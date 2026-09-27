import { adminDb, requireUser, jsonError, FieldValue } from "../../../../../lib/videoServer";
import { canWatchVideo } from "../../../../../lib/videoAccess";
import { VIEW_RATE_MILLIMES, TEACHER_FIELDS } from "../../../../../lib/videoConfig";
import {
  totalChunksFor,
  requiredChunksFor,
  chunkAllowance,
  mergeChunks,
  countBits,
  monthKeyTunis,
} from "../../../../../lib/viewMath";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/videos/{id}/heartbeat
 * Body: { chunks: number[], position: number }
 *
 * Records which 10-second chunks the student really watched. The first time
 * a student reaches 50% of DISTINCT chunks, ONE view is counted, inside a
 * transaction, so it can never be counted twice (two tabs, retries, rewatch).
 *
 * Writes (Admin SDK only):
 *   videoViews/{videoId}_{uid}          progress + counted flag (one doc per student per video)
 *   videos/{videoId}                    views +1, monthlyViews["YYYY-MM"] +1
 *   teacherEarnings/{teacherId}_{YYYY-MM}  views +1, amountMillimes +100
 */
export async function POST(request, { params }) {
  let user;
  try {
    user = await requireUser(request);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  const { id: videoId } = await params;
  if (!videoId || typeof videoId !== "string" || videoId.length > 64) {
    return jsonError("Vidéo introuvable.", 404);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Requête invalide.");
  }
  const reported = Array.isArray(body.chunks) ? body.chunks : [];
  const position = Math.max(0, Math.round(Number(body.position) || 0));

  const db = adminDb();
  const videoRef = db.collection("videos").doc(videoId);
  const [videoSnap, userSnap] = await Promise.all([videoRef.get(), db.collection("users").doc(user.uid).get()]);

  if (!videoSnap.exists) return jsonError("Vidéo introuvable.", 404);
  const video = videoSnap.data();
  const profile = userSnap.exists ? userSnap.data() : {};
  const role = user.role || profile.role || null;

  if (!canWatchVideo({ ...profile, uid: user.uid, role }, video)) {
    return jsonError("Accès refusé.", 403);
  }

  // Only real students on published videos generate paid views.
  // Teachers previewing their own video and admins are never counted.
  const countable =
    video.status === "published" && video.teacherId !== user.uid && role !== "teacher" && role !== "admin";

  const total = totalChunksFor(video.durationSec);
  if (total === 0) {
    // Duration not known yet (encoding not finished) — nothing to measure.
    return Response.json({ counted: false, tracking: false });
  }
  const required = requiredChunksFor(total);

  const viewRef = db.collection("videoViews").doc(`${videoId}_${user.uid}`);
  const now = Date.now();

  try {
    const result = await db.runTransaction(async (tx) => {
      const viewSnap = await tx.get(viewRef);
      const view = viewSnap.exists ? viewSnap.data() : null;

      const base = {
        videoId,
        studentId: user.uid,
        teacherId: video.teacherId,
        gradeId: video.gradeId || null,
        totalChunks: total,
        lastPositionSec: position,
        lastHeartbeatAt: FieldValue.serverTimestamp(),
      };

      // Already counted: just remember where the student stopped.
      if (view?.counted) {
        tx.set(viewRef, base, { merge: true });
        return { counted: true, justCounted: false, watched: view.watchedCount || required, accepted: [] };
      }

      // Re-measure from scratch if the video length changed.
      const storedBits = view?.totalChunks === total ? view.watchedBits : null;
      const allowance = chunkAllowance(view?.lastHeartbeatAt?.toMillis?.() || 0, now);
      const { bits, accepted } = mergeChunks(storedBits, reported, total, allowance);
      const watched = countBits(bits);

      const update = {
        ...base,
        watchedBits: bits,
        watchedCount: watched,
        counted: false,
        ...(viewSnap.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      };

      if (countable && watched >= required) {
        const monthKey = monthKeyTunis(new Date(now));
        update.counted = true;
        update.countedAt = FieldValue.serverTimestamp();
        update.monthKey = monthKey;

        tx.update(videoRef, {
          views: FieldValue.increment(1),
          [`monthlyViews.${monthKey}`]: FieldValue.increment(1),
        });

        // Teacher's running balance (what we owe them) + all-time totals.
        tx.set(
          db.collection("users").doc(video.teacherId),
          {
            [TEACHER_FIELDS.BALANCE]: FieldValue.increment(VIEW_RATE_MILLIMES),
            [TEACHER_FIELDS.VIEWS_TOTAL]: FieldValue.increment(1),
            [TEACHER_FIELDS.EARNED_TOTAL]: FieldValue.increment(VIEW_RATE_MILLIMES),
          },
          { merge: true }
        );

        // Monthly breakdown — kept for later analytics / revenue-share pool.
        tx.set(
          db.collection("teacherEarnings").doc(`${video.teacherId}_${monthKey}`),
          {
            teacherId: video.teacherId,
            monthKey,
            views: FieldValue.increment(1),
            amountMillimes: FieldValue.increment(VIEW_RATE_MILLIMES),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }

      tx.set(viewRef, update, { merge: true });
      return { counted: update.counted, justCounted: update.counted, watched, accepted };
    });

    return Response.json({
      tracking: true,
      counted: result.counted,
      justCounted: result.justCounted,
      watchedChunks: result.watched,
      requiredChunks: required,
      totalChunks: total,
      accepted: result.accepted,
    });
  } catch (err) {
    console.error("heartbeat failed", videoId, user.uid, err);
    return jsonError("Erreur temporaire.", 500);
  }
}