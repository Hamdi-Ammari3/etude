import { deleteBunnyVideo } from "../../../../lib/bunny";
import { destroyCloudinaryImage } from "../../../../lib/cloudinaryServer";
import { adminDb, requireTeacher, jsonError, FieldValue } from "../../../../lib/videoServer";
import { TITLE_MIN, TITLE_MAX } from "../../../../lib/videoConfig";
import { cleanTitle, normalizeText, buildSearchKeywords } from "../../../../lib/videoText";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH  /api/videos/{id}   { title }  → teacher renames their own video
 * DELETE /api/videos/{id}              → teacher deletes their own video
 *
 * Only the owning teacher can do either. Firestore rules block all client
 * writes to `videos`, so this route (Admin SDK) is the only way in.
 */

async function loadOwnedVideo(request, params) {
  const teacher = await requireTeacher(request);
  const { id } = await params;
  if (!id || typeof id !== "string" || id.length > 64) throw jsonError("Vidéo introuvable.", 404);

  const ref = adminDb().collection("videos").doc(id);
  const snap = await ref.get();
  if (!snap.exists || snap.data().teacherId !== teacher.uid || snap.data().status === "deleted") {
    throw jsonError("Vidéo introuvable.", 404);
  }
  return { teacher, id, ref, video: snap.data() };
}

export async function PATCH(request, ctx) {
  let owned;
  try {
    owned = await loadOwnedVideo(request, ctx.params);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Requête invalide.");
  }

  const title = cleanTitle(body.title).slice(0, TITLE_MAX);
  if (title.length < TITLE_MIN) {
    return jsonError(`Le titre doit contenir au moins ${TITLE_MIN} caractères.`);
  }

  const { ref, video } = owned;
  if (title === video.title) return Response.json({ id: owned.id, title });

  await ref.update({
    title,
    titleLower: normalizeText(title),
    searchKeywords: buildSearchKeywords(title, video.subjectName, video.teacherName, video.gradeName),
    previousTitle: video.title || null,
    titleEditedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return Response.json({ id: owned.id, title });
}

export async function DELETE(request, ctx) {
  let owned;
  try {
    owned = await loadOwnedVideo(request, ctx.params);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  const { ref, video } = owned;

  // Soft delete: the doc stays (views, earnings and payouts reference it),
  // but it disappears everywhere — the catalog only lists "published".
  await ref.update({
    status: "deleted",
    statusBeforeDelete: video.status || null,
    deletedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  // Free the storage (best effort — the video is already hidden either way).
  const [bunnyOk, thumbOk] = await Promise.all([
    video.bunnyVideoId
      ? deleteBunnyVideo(video.bunnyVideoId).then(
          () => true,
          (err) => {
            console.warn("Bunny delete failed", video.bunnyVideoId, err.details || err);
            return false;
          }
        )
      : true,
    destroyCloudinaryImage(video.thumbnailPublicId),
  ]);
  await ref.update({ bunnyDeleted: bunnyOk, thumbnailDeleted: thumbOk }).catch(() => {});

  return Response.json({ id: owned.id, deleted: true });
}