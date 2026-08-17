import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";

const STATUS_BY_CODE = {
  "not-found": 404,
  "no-account": 404,
};

export async function POST(request) {
  // Must be logged in — verified server-side via the Firebase ID token,
  // same as the join route. Never trust a client-supplied studentId.
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

  // Only sessions that haven't started yet are refundable/cancellable —
  // a session already "started" or "finished" already consumed the
  // teacher's time and is left untouched, matching the no-show/
  // attendance policy already established for this platform.
  const refundableSessionsQuery = adminDB
    .collection("sessions")
    .where("studentId", "==", studentUid)
    .where("courseId", "==", courseId)
    .where("status", "==", "subscribed");

  try {
    const result = await adminDB.runTransaction(async (tx) => {
      // All reads before any writes — Firestore transactions require
      // this ordering, and tx.get() supports queries as well as single
      // document refs.
      const [courseSnap, studentSnap, refundableSnap] = await Promise.all([
        tx.get(courseRef),
        tx.get(studentRef),
        tx.get(refundableSessionsQuery),
      ]);

      if (!courseSnap.exists) {
        throw { code: "not-found", message: "Ce cours n'existe plus." };
      }
      if (!studentSnap.exists) {
        throw { code: "no-account", message: "Compte introuvable." };
      }
      const student = studentSnap.data();
      const currentBalance = Number(student.balance) || 0;

      const refundableDocs = refundableSnap.docs;
      const refundAmount = refundableDocs.reduce((sum, d) => sum + (Number(d.data().price) || 0), 0);

      // Cancel each still-unattended session.
      refundableDocs.forEach((d) => {
        tx.update(d.ref, { status: "cancelled" });
      });

      // Refund and free the seat — both conditioned on there actually
      // having been something to cancel, which is also what makes this
      // action safely repeatable (a second call finds zero "subscribed"
      // sessions and does nothing further, rather than double-refunding
      // or double-freeing the seat).
      if (refundableDocs.length > 0) {
        tx.update(studentRef, { balance: FieldValue.increment(refundAmount) });
        tx.update(courseRef, { enrolledCount: FieldValue.increment(-1) });

        const walletTxRef = studentRef.collection("walletTransactions").doc();
        tx.set(walletTxRef, {
          type: "refund",
          amount: refundAmount,
          balanceAfter: currentBalance + refundAmount,
          courseId,
          cancelledSessionIds: refundableDocs.map((d) => d.id),
          createdAt: FieldValue.serverTimestamp(),
        });
      }

      return {
        refundAmount,
        cancelledCount: refundableDocs.length,
        newBalance: currentBalance + refundAmount,
      };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err && err.code) {
      return NextResponse.json({ error: err.message }, { status: STATUS_BY_CODE[err.code] || 400 });
    }
    console.error("leave course error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessayez." }, { status: 500 });
  }
}