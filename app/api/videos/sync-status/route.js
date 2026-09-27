import { deleteBunnyVideo } from "../../../../lib/bunny";
import { adminDb, requireTeacher, jsonError, syncVideoFromBunny, FieldValue } from "../../../../lib/videoServer";
import { VIDEO_STATUS } from "../../../../lib/videoConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IDS = 10;

/**
 * POST { videoIds: string[] }                  → refreshes status from Bunny
 * POST { videoIds: [id], abandon: true }       → teacher's upload failed/was cancelled:
 *                                                 deletes the Bunny object, marks "failed"
 * Only the owning teacher can sync their own videos.
 */
export async function POST(request) {
  let teacher;
  try {
    teacher = await requireTeacher(request);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Requête invalide.");
  }

  const ids = Array.isArray(body.videoIds)
    ? [...new Set(body.videoIds.filter((id) => typeof id === "string" && id.length < 64))].slice(0, MAX_IDS)
    : [];
  if (ids.length === 0) return jsonError("Aucune vidéo indiquée.");

  const db = adminDb();
  const results = {};

  await Promise.all(
    ids.map(async (id) => {
      const ref = db.collection("videos").doc(id);
      const snap = await ref.get();
      if (!snap.exists || snap.data().teacherId !== teacher.uid) {
        results[id] = { error: "not_found" };
        return;
      }
      const data = snap.data();

      if (body.abandon === true) {
        if (data.status === VIDEO_STATUS.UPLOADING) {
          await deleteBunnyVideo(data.bunnyVideoId).catch(() => {});
          await ref.update({ status: VIDEO_STATUS.FAILED, updatedAt: FieldValue.serverTimestamp() });
          results[id] = { status: VIDEO_STATUS.FAILED, durationSec: data.durationSec || 0 };
        } else {
          results[id] = { status: data.status, durationSec: data.durationSec || 0 };
        }
        return;
      }

      try {
        const { status, durationSec } = await syncVideoFromBunny(ref, data);
        results[id] = { status, durationSec };
      } catch (err) {
        console.error("sync failed", id, err.details || err);
        results[id] = { status: data.status, durationSec: data.durationSec || 0, error: "sync_failed" };
      }
    })
  );

  return Response.json({ videos: results });
}