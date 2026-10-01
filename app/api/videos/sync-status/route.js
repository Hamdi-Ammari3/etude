import { deleteBunnyVideo } from "../../../../lib/bunny";
import { deleteObject } from "../../../../lib/bunnyStorage";
import { adminDb, requireTeacher, jsonError, syncVideoFromBunny, FieldValue } from "../../../../lib/videoServer";
import { VIDEO_STATUS } from "../../../../lib/videoConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IDS = 10;

// Only known, primitive fields from the browser are stored.
const CLIENT_INFO_KEYS = ["stage", "httpStatus", "fileType", "fileSizeMB", "uploadedPercent", "online", "userAgent"];
function sanitizeClientInfo(info) {
  if (!info || typeof info !== "object") return null;
  const out = {};
  for (const key of CLIENT_INFO_KEYS) {
    const v = info[key];
    if (typeof v === "number" && Number.isFinite(v)) out[key] = v;
    else if (typeof v === "boolean") out[key] = v;
    else if (typeof v === "string") out[key] = v.slice(0, 200);
  }
  return out;
}

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
          if (data.type === "pdf") await deleteObject(data.storageKey).catch(() => {});
          else await deleteBunnyVideo(data.bunnyVideoId).catch(() => {});
          // Keep the browser's error details so failures can be diagnosed.
          const reason = typeof body.reason === "string" ? body.reason.slice(0, 500) : "client_abandoned";
          const clientInfo = sanitizeClientInfo(body.clientInfo);
          await ref.update({
            status: VIDEO_STATUS.FAILED,
            failureReason: reason,
            failureClientInfo: clientInfo,
            failedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
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