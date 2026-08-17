import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";
import { getUpcomingOccurrences } from "../../../../lib/recurrence";

// Maps internal error codes (thrown inside the transaction below) to
// HTTP status codes for the response.
const STATUS_BY_CODE = {
  "not-found": 404,
  unavailable: 409,
  "no-account": 404,
  "wrong-role": 403,
  full: 409,
  "insufficient-funds": 402,
  "schedule-error": 500,
  "already-subscribed": 409,
};

export async function POST(request) {
  // 1. Must be logged in — verified server-side via the Firebase ID
  // token, never trusted from a client-supplied studentId in the body.
  const authHeader = request.headers.get("authorization") || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!idToken) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Session invalide. Reconnectez-vous." }, { status: 401 });
  }
  const studentUid = decoded.uid;

  let courseId;
  try {
    ({ courseId } = await request.json());
  } catch {
    courseId = null;
  }
  if (!courseId) {
    return NextResponse.json({ error: "Cours introuvable." }, { status: 400 });
  }

  const courseRef = adminDB.collection("courses").doc(courseId);
  const studentRef = adminDB.collection("users").doc(studentUid);

  // A student may not re-subscribe to a course they're already actively
  // subscribed to — "actively" meaning they still have at least one
  // "subscribed" (not yet started) session from a prior join. Once all
  // of those are consumed (started/finished) or the student explicitly
  // leaves (cancelling the remaining ones), this query finds nothing and
  // they're free to subscribe again.
  const existingSubscriptionQuery = adminDB
    .collection("sessions")
    .where("studentId", "==", studentUid)
    .where("courseId", "==", courseId)
    .where("status", "==", "subscribed")
    .limit(1);

  try {
    const result = await adminDB.runTransaction(async (tx) => {
      // All reads must happen before any writes in a Firestore
      // transaction.
      const [courseSnap, studentSnap, existingSnap] = await Promise.all([
        tx.get(courseRef),
        tx.get(studentRef),
        tx.get(existingSubscriptionQuery),
      ]);

      if (!courseSnap.exists) {
        throw { code: "not-found", message: "Ce cours n'existe plus." };
      }
      const course = courseSnap.data();

      if (course.status !== "active") {
        throw { code: "unavailable", message: "Ce cours n'est plus disponible." };
      }

      if (!existingSnap.empty) {
        throw { code: "already-subscribed", message: "Vous êtes déjà inscrit à ce cours." };
      }

      if (!studentSnap.exists) {
        throw { code: "no-account", message: "Compte introuvable." };
      }
      const student = studentSnap.data();

      // 1b. Only student accounts may subscribe — mirrors the same role
      // separation already enforced at login. Teachers shouldn't reach
      // this page at all (RoleGate), but this is the real security
      // boundary, not the client-side redirect.
      if ((student.role || "student") !== "student") {
        throw { code: "wrong-role", message: "Seuls les comptes élèves peuvent s'inscrire à un cours." };
      }

      // Capacity check — reading enrolledCount INSIDE the transaction
      // (not before it) is what makes this race-safe: if two students
      // both attempt to grab the last seat simultaneously, Firestore
      // serializes the transactions, and the loser's transaction
      // automatically retries and re-reads the updated count, correctly
      // failing this check on retry instead of double-booking the seat.
      const enrolledCount = course.enrolledCount || 0;
      if (enrolledCount >= course.maxStudents) {
        throw { code: "full", message: "Ce cours est complet." };
      }

      // 2. Balance check — authoritative, server-side. Any client-side
      // balance check is purely a UX convenience and must never be
      // trusted as the actual gate. Number() guards against balance
      // ever having been stored as a string.
      const price = Number(course.monthlyPrice) || 0;
      const balance = Number(student.balance) || 0;
      const hasSufficientBalance = balance >= price;
      if (!hasSufficientBalance) {
        throw { code: "insufficient-funds", message: "Solde insuffisant. Rechargez votre compte." };
      }

      // 3. Build the session docs — one per upcoming occurrence of the
      // course's recurring weekly rule, up to sessionsPerMonth of them.
      const sessionsPerMonth = course.sessionsPerMonth || 4;
      const occurrences = getUpcomingOccurrences(course.weeklySlots || [], sessionsPerMonth);
      if (occurrences.length < sessionsPerMonth) {
        throw {
          code: "schedule-error",
          message: "Le planning de ce cours est incomplet. Contactez le support.",
        };
      }

      const sessionRefs = occurrences.map(() => adminDB.collection("sessions").doc());
      sessionRefs.forEach((ref, i) => {
        tx.set(ref, {
          courseId,
          teacherId: course.teacherId,
          studentId: studentUid,
          date: occurrences[i].toISOString(),
          price: course.pricePerSession,
          status: "subscribed", // subscribed -> started -> finished, or cancelled
          payed: false,
          // Denormalized for display (profile page "Mes cours en direct",
          // etc.) — same reasoning as why courses denormalize
          // subjectName/gradeName/teacherName: avoids an extra Firestore
          // read per distinct course every time a student's session list
          // is shown.
          teacherName: course.teacherName || "",
          subjectName: course.subjectName || "",
          gradeName: course.gradeName || "",
          specializationName: course.specializationName || null,
          monthlyPrice: course.monthlyPrice,
          createdAt: FieldValue.serverTimestamp(),
        });
      });

      // 4. Debit the student's balance and bump the course's seat count.
      tx.update(courseRef, { enrolledCount: FieldValue.increment(1) });
      tx.update(studentRef, { balance: FieldValue.increment(-price) });

      // Wallet ledger entry — not explicitly asked for this round, but
      // matches the audit-trail pattern from the original wallet design
      // (every balance mutation gets a transaction record). Cheap to
      // include now; remove if you'd rather not have it yet.
      const walletTxRef = studentRef.collection("walletTransactions").doc();
      tx.set(walletTxRef, {
        type: "subscribe",
        amount: -price,
        balanceAfter: balance - price,
        courseId,
        sessionIds: sessionRefs.map((r) => r.id),
        createdAt: FieldValue.serverTimestamp(),
      });

      return {
        sessionCount: sessionRefs.length,
        sessionDates: occurrences.map((d) => d.toISOString()),
        newBalance: balance - price,
      };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err && err.code) {
      return NextResponse.json({ error: err.message }, { status: STATUS_BY_CODE[err.code] || 400 });
    }
    console.error("join course error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessayez." }, { status: 500 });
  }
}