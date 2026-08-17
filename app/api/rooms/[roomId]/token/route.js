import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "../../../../../lib/firebaseAdmin";
import { createMeetingToken } from "../../../../../lib/daily";

// This is the real access boundary for the video room, not the room
// page's UI — no valid, per-user, per-role token, no way into the
// Daily room at all (rooms are created with privacy:"private").
export async function POST(request, { params }) {
  const { roomId } = await params;

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
  const uid = decoded.uid;

  const roomRef = adminDB.collection("liveRooms").doc(roomId);
  const roomSnap = await roomRef.get();
  if (!roomSnap.exists) {
    return NextResponse.json({ error: "Séance introuvable." }, { status: 404 });
  }
  const room = roomSnap.data();

  if (room.status !== "active") {
    return NextResponse.json({ error: "Cette séance est terminée." }, { status: 409 });
  }

  const userSnap = await adminDB.collection("users").doc(uid).get();
  const userName = userSnap.exists ? userSnap.data().name || "Utilisateur" : "Utilisateur";

  let role;
  if (uid === room.teacherId) {
    role = "teacher";
  } else {
    // Must have a real, currently-"started" session tied to THIS exact
    // room — not just any enrollment in the course, and not a session
    // that's already finished or was for a different occurrence.
    const sessionsSnap = await adminDB
      .collection("sessions")
      .where("liveRoomId", "==", roomId)
      .where("studentId", "==", uid)
      .where("status", "==", "started")
      .limit(1)
      .get();
    if (sessionsSnap.empty) {
      return NextResponse.json({ error: "Vous n'êtes pas inscrit à cette séance." }, { status: 403 });
    }
    role = "student";
  }

  try {
    const token = await createMeetingToken({
      roomName: room.dailyRoomName,
      userName,
      isOwner: role === "teacher",
    });
    return NextResponse.json({ token, roomUrl: room.dailyRoomUrl, role });
  } catch (err) {
    console.error("token mint error:", err);
    return NextResponse.json({ error: "Impossible de rejoindre la séance. Réessayez." }, { status: 500 });
  }
}