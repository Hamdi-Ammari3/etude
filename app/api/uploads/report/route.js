import { adminDb, requireUser, jsonError, FieldValue } from "../../../../lib/videoServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/uploads/report
 * The teacher's browser reports upload problems (file can't be read,
 * upload stopped…) so we can see the exact error from real phones.
 * Stored in Firestore `uploadErrors` (read it in the console; no client access).
 */
const KEYS = [
  "where", // "select_video" | "read_check" | "video_upload" | ...
  "errorName",
  "errorMessage",
  "fileName",
  "fileType",
  "fileSizeMB",
  "lastModified",
  "picker", // "files" | "camera"
  "httpStatus",
  "uploadedPercent",
  "online",
  "inAppBrowser",
  "userAgent",
  "videoId",
];

export async function POST(request) {
  let user;
  try {
    user = await requireUser(request);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Requête invalide.");
  }

  const entry = { uid: user.uid, role: user.role || null, createdAt: FieldValue.serverTimestamp() };
  for (const key of KEYS) {
    const v = body?.[key];
    if (typeof v === "string") entry[key] = v.slice(0, 400);
    else if (typeof v === "number" && Number.isFinite(v)) entry[key] = v;
    else if (typeof v === "boolean") entry[key] = v;
  }

  try {
    await adminDb().collection("uploadErrors").add(entry);
  } catch (err) {
    console.error("upload report failed", err);
  }
  return Response.json({ ok: true });
}