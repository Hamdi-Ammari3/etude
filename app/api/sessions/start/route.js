import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";
import { createDailyRoom } from "../../../../lib/daily";

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

  let courseId, date;
  try {
    ({ courseId, date } = await request.json());
  } catch {
    courseId = null;
  }
  if (!courseId || !date) {
    return NextResponse.json({ error: "Séance introuvable." }, { status: 400 });
  }

  // Defense in depth — the UI already disables the button before the
  // scheduled time (and for entirely past days), but the server must
  // not trust that alone.
  const sessionTime = new Date(date);
  if (Number.isNaN(sessionTime.getTime())) {
    return NextResponse.json({ error: "Séance introuvable." }, { status: 400 });
  }

  const now = new Date();
  const sessionDay = new Date(sessionTime.getFullYear(), sessionTime.getMonth(), sessionTime.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (sessionDay.getTime() < today.getTime()) {
    return NextResponse.json(
      { error: "Cette séance est passée et ne peut plus être démarrée." },
      { status: 409 }
    );
  }
  if (now < sessionTime) {
    return NextResponse.json({ error: "Cette séance n'a pas encore commencé." }, { status: 409 });
  }

  // Scoping the query to teacherId == the AUTHENTICATED teacher means a
  // teacher can never start another teacher's session — the query just
  // returns empty for a courseId/date they don't own, no separate
  // ownership check needed.
  const sessionsQuery = adminDB
    .collection("sessions")
    .where("teacherId", "==", teacherUid)
    .where("courseId", "==", courseId)
    .where("date", "==", date)
    .where("status", "==", "subscribed");

  try {
    const snap = await sessionsQuery.get();
    if (snap.empty) {
      return NextResponse.json({ error: "Aucune séance à démarrer trouvée." }, { status: 404 });
    }

    // Create the video room BEFORE touching Firestore — if Daily fails,
    // nothing should flip to "started" at all. This is a plain batch
    // write (not a transaction), so doing an external HTTP call first
    // and Firestore writes after is safe: batches don't retry on
    // contention the way transactions do, so there's no risk of this
    // external call firing more than once.
    const roomRef = adminDB.collection("liveRooms").doc();
    const dailyRoom = await createDailyRoom({ name: roomRef.id });

    await roomRef.set({
      courseId,
      date,
      teacherId: teacherUid,
      dailyRoomName: dailyRoom.name,
      dailyRoomUrl: dailyRoom.url,
      status: "active",
      startedAt: FieldValue.serverTimestamp(),
      endedAt: null,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Multiple students in the same class slot are separate session
    // docs sharing the same (courseId, date) — they all need to move to
    // "started" together, atomically, and all need to know which room
    // to join.
    const batch = adminDB.batch();
    snap.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: "started",
        liveRoomId: roomRef.id,
        startedAt: FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();

    return NextResponse.json({ success: true, updatedCount: snap.size, roomId: roomRef.id });
  } catch (err) {
    console.error("start session error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessayez." }, { status: 500 });
  }
}