import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";
import { deleteDailyRoom } from "../../../../lib/daily";

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
  const teacherUid = decoded.uid;

  let roomId;
  try {
    ({ roomId } = await request.json());
  } catch {
    roomId = null;
  }
  if (!roomId) {
    return NextResponse.json({ error: "Séance introuvable." }, { status: 400 });
  }

  const roomRef = adminDB.collection("liveRooms").doc(roomId);
  const roomSnap = await roomRef.get();

  if (!roomSnap.exists) {
    return NextResponse.json({ error: "Séance introuvable." }, { status: 404 });
  }
  const room = roomSnap.data();

  if (room.teacherId !== teacherUid) {
    return NextResponse.json({ error: "Vous n'êtes pas autorisé à terminer cette séance." }, { status: 403 });
  }

  // Idempotent — a second click (or a click from the dashboard after
  // already finishing from inside the room) just finds nothing left to
  // do rather than erroring.
  if (room.status !== "active") {
    return NextResponse.json({ success: true, updatedCount: 0, alreadyEnded: true });
  }

  const sessionsQuery = adminDB
    .collection("sessions")
    .where("liveRoomId", "==", roomId)
    .where("status", "==", "started");

  try {
    const snap = await sessionsQuery.get();

    const batch = adminDB.batch();
    snap.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: "finished",
        endedAt: FieldValue.serverTimestamp(),
      });
    });
    batch.update(roomRef, {
      status: "ended",
      endedAt: FieldValue.serverTimestamp(),
    });
    await batch.commit();

    // Best-effort — the session data is already correctly saved
    // regardless of whether this succeeds, so a Daily API hiccup here
    // shouldn't fail the whole request.
    try {
      await deleteDailyRoom(room.dailyRoomName);
    } catch (err) {
      console.error("Daily room cleanup failed (non-fatal):", err);
    }

    return NextResponse.json({ success: true, updatedCount: snap.size });
  } catch (err) {
    console.error("finish session error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessayez." }, { status: 500 });
  }
}