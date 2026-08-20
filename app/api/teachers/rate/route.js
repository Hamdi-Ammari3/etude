import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";

// Minimum-confidence threshold for the Bayesian-weighted score — below
// this many ratings, the displayed score stays close to the
// platform-wide average rather than swinging fully on 1-2 opinions.
const MIN_CONFIDENCE = 5;

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

  let teacherId, stars;
  try {
    ({ teacherId, stars } = await request.json());
  } catch {
    teacherId = null;
  }
  stars = Number(stars);
  if (!teacherId || !Number.isInteger(stars) || stars < 1 || stars > 5) {
    return NextResponse.json({ error: "Note invalide." }, { status: 400 });
  }

  const teacherRef = adminDB.collection("users").doc(teacherId);
  const ratingRef = teacherRef.collection("ratings").doc(studentUid);
  const statsRef = adminDB.collection("platformStats").doc("liveRatings");

  // Eligibility gate — ANY finished session with this teacher, across
  // any course, unlocks rating them. No courseId involved at all, since
  // the rating belongs to the teacher, not a specific (deletable)
  // course.
  const eligibilityQuery = adminDB
    .collection("sessions")
    .where("studentId", "==", studentUid)
    .where("teacherId", "==", teacherId)
    .where("status", "==", "finished")
    .limit(1);

  try {
    const result = await adminDB.runTransaction(async (tx) => {
      const [eligibleSnap, teacherSnap, existingRatingSnap, statsSnap] = await Promise.all([
        tx.get(eligibilityQuery),
        tx.get(teacherRef),
        tx.get(ratingRef),
        tx.get(statsRef),
      ]);

      if (eligibleSnap.empty) {
        throw {
          code: "not-eligible",
          message: "Tu dois avoir terminé au moins une séance avec cet enseignant pour le noter.",
        };
      }
      if (!teacherSnap.exists) {
        throw { code: "not-found", message: "Enseignant introuvable." };
      }

      const teacher = teacherSnap.data();
      const currentCount = teacher.ratingCount || 0;
      const currentSum = teacher.ratingSum || 0;

      const stats = statsSnap.exists ? statsSnap.data() : { totalCount: 0, totalSum: 0 };
      const platformCount = stats.totalCount || 0;
      const platformSum = stats.totalSum || 0;

      let newTeacherCount, newTeacherSum, newPlatformCount, newPlatformSum;

      if (existingRatingSnap.exists) {
        // Edit — apply the DELTA between old and new stars, not the new
        // value on top of the old. Editing 3★ to 5★ must not look like
        // a second person rated the teacher.
        const previousStars = existingRatingSnap.data().stars || 0;
        const delta = stars - previousStars;
        newTeacherCount = currentCount; // unchanged — still the same rater
        newTeacherSum = currentSum + delta;
        newPlatformCount = platformCount; // unchanged
        newPlatformSum = platformSum + delta;
      } else {
        newTeacherCount = currentCount + 1;
        newTeacherSum = currentSum + stars;
        newPlatformCount = platformCount + 1;
        newPlatformSum = platformSum + stars;
      }

      const platformAvg = newPlatformCount > 0 ? newPlatformSum / newPlatformCount : 3;
      const teacherAvg = newTeacherCount > 0 ? newTeacherSum / newTeacherCount : platformAvg;
      const weighted =
        newTeacherCount > 0
          ? (newTeacherCount / (newTeacherCount + MIN_CONFIDENCE)) * teacherAvg +
            (MIN_CONFIDENCE / (newTeacherCount + MIN_CONFIDENCE)) * platformAvg
          : platformAvg;

      tx.set(
        ratingRef,
        {
          // Denormalized alongside the doc ID itself — doc IDs aren't
          // queryable directly, so this field is what would let a
          // future "all of this student's ratings" collectionGroup
          // query work.
          studentId: studentUid,
          teacherId,
          stars,
          createdAt: existingRatingSnap.exists ? existingRatingSnap.data().createdAt : FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      tx.update(teacherRef, {
        ratingCount: newTeacherCount,
        ratingSum: newTeacherSum,
        ratingAvg: Math.round(teacherAvg * 100) / 100,
        ratingWeighted: Math.round(weighted * 100) / 100,
      });

      tx.set(statsRef, { totalCount: newPlatformCount, totalSum: newPlatformSum }, { merge: true });

      return { ratingCount: newTeacherCount, ratingWeighted: Math.round(weighted * 100) / 100 };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err && err.code) {
      const statusByCode = { "not-eligible": 403, "not-found": 404 };
      return NextResponse.json({ error: err.message }, { status: statusByCode[err.code] || 400 });
    }
    console.error("rate teacher error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessayez." }, { status: 500 });
  }
}