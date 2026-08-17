import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";
import { getUpcomingOccurrences } from "../../../../lib/recurrence";

const STATUS_BY_CODE = {
  "not-found": 404,
  unavailable: 409,
  "no-account": 404,
  "wrong-role": 403,
  "not-subscribed": 409,
  "insufficient-funds": 402,
  "schedule-error": 500,
};

export async function POST(request) {
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

  // Prolonging requires an existing active subscription to anchor onto —
  // deliberately a different entry point from a fresh join: no seat is
  // being taken, and the new sessions continue directly after the
  // student's current ones instead of restarting from "today".
  const activeSubscriptionQuery = adminDB
    .collection("sessions")
    .where("studentId", "==", studentUid)
    .where("courseId", "==", courseId)
    .where("status", "==", "subscribed");

  try {
    const result = await adminDB.runTransaction(async (tx) => {
      const [courseSnap, studentSnap, activeSnap] = await Promise.all([
        tx.get(courseRef),
        tx.get(studentRef),
        tx.get(activeSubscriptionQuery),
      ]);

      if (!courseSnap.exists) {
        throw { code: "not-found", message: "Ce cours n'existe plus." };
      }
      const course = courseSnap.data();

      if (course.status !== "active") {
        throw { code: "unavailable", message: "Ce cours n'est plus disponible." };
      }

      if (activeSnap.empty) {
        throw {
          code: "not-subscribed",
          message: "Vous n'avez pas d'abonnement actif à prolonger pour ce cours.",
        };
      }

      if (!studentSnap.exists) {
        throw { code: "no-account", message: "Compte introuvable." };
      }
      const student = studentSnap.data();

      if ((student.role || "student") !== "student") {
        throw { code: "wrong-role", message: "Seuls les comptes élèves peuvent prolonger un abonnement." };
      }

      // Balance check — authoritative, server-side. Any client-side
      // check is purely a UX convenience.
      const price = Number(course.monthlyPrice) || 0;
      const balance = Number(student.balance) || 0;
      if (balance < price) {
        throw { code: "insufficient-funds", message: "Solde insuffisant. Rechargez votre compte." };
      }

      // Anchor the new batch on the LATEST existing session's date —
      // continues the weekly pattern forward with no gap and no
      // overlap, rather than restarting from "today" like a fresh join.
      const latestExistingDate = activeSnap.docs.reduce((latest, d) => {
        const date = new Date(d.data().date);
        return date > latest ? date : latest;
      }, new Date(0));

      const sessionsPerMonth = course.sessionsPerMonth || 4;
      const occurrences = getUpcomingOccurrences(course.weeklySlots || [], sessionsPerMonth, latestExistingDate);
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
          status: "subscribed",
          payed: false,
          teacherName: course.teacherName || "",
          subjectName: course.subjectName || "",
          gradeName: course.gradeName || "",
          specializationName: course.specializationName || null,
          monthlyPrice: course.monthlyPrice,
          createdAt: FieldValue.serverTimestamp(),
        });
      });

      // Debit the balance only — no enrolledCount change, since this
      // student is already counted as enrolled in this course; no new
      // seat is being taken.
      tx.update(studentRef, { balance: FieldValue.increment(-price) });

      const walletTxRef = studentRef.collection("walletTransactions").doc();
      tx.set(walletTxRef, {
        type: "prolong",
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
    console.error("prolong course error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessayez." }, { status: 500 });
  }
}