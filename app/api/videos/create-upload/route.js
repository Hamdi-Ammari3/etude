import { createBunnyVideo, deleteBunnyVideo, buildTusSignature, bunnyConfig } from "../../../../lib/bunny";
import { adminDb, requireTeacher, jsonError, FieldValue } from "../../../../lib/videoServer";
import {
  TITLE_MIN,
  TITLE_MAX,
  TRIMESTRES,
  VIDEO_STATUS,
  MIN_DURATION_SEC,
  DEFAULT_THUMBNAIL_URL,
} from "../../../../lib/videoConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_OPEN_UPLOADS = 5; // unfinished uploads a teacher can have at once
const TUS_SIGNATURE_TTL_SEC = 24 * 60 * 60; // big files on slow connections need time

function cleanString(value, max = 120) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

function normalizeText(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function buildSearchKeywords(...parts) {
  const words = parts
    .filter(Boolean)
    .flatMap((p) => normalizeText(p).split(/[^\p{L}\p{N}]+/u))
    .filter((w) => w.length >= 2);
  return [...new Set(words)].slice(0, 40);
}

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

  // ---- Validate input ----
  const title = cleanString(body.title, TITLE_MAX);
  const gradeId = cleanString(body.gradeId, 40);
  const gradeName = cleanString(body.gradeName, 60);
  const subjectId = cleanString(body.subjectId, 40);
  const subjectName = cleanString(body.subjectName, 60);
  const subjectEmoji = cleanString(body.subjectEmoji, 8) || "📚";
  const specializationId = cleanString(body.specializationId, 40) || null;
  const specializationName = cleanString(body.specializationName, 60) || null;
  // Trimestre is optional — null when the form doesn't ask for it.
  const trimestreRaw = Number(body.trimestre);
  const trimestre = TRIMESTRES.some((t) => t.id === trimestreRaw) ? trimestreRaw : null;
  const clientDurationSec = Math.max(0, Math.round(Number(body.clientDurationSec) || 0));

  if (title.length < TITLE_MIN) return jsonError("Le titre est trop court.");
  if (!gradeId || !gradeName) return jsonError("Niveau manquant.");
  if (!subjectId || !subjectName) return jsonError("Matière manquante.");

  // Every video uses the shared default thumbnail (set on the server, so the
  // browser can't point it anywhere else). thumbnailPublicId stays null so
  // deleting a video never deletes the shared image.
  const thumbnailUrl = DEFAULT_THUMBNAIL_URL;
  const thumbnailPublicId = null;

  if (clientDurationSec > 0 && clientDurationSec < MIN_DURATION_SEC) {
    return jsonError(`La vidéo doit durer au moins ${Math.round(MIN_DURATION_SEC / 60)} minutes.`);
  }

  const db = adminDb();

  // ---- Basic abuse guard: limit unfinished uploads ----
  const openUploads = await db
    .collection("videos")
    .where("teacherId", "==", teacher.uid)
    .where("status", "==", VIDEO_STATUS.UPLOADING)
    .limit(MAX_OPEN_UPLOADS)
    .get();
  if (openUploads.size >= MAX_OPEN_UPLOADS) {
    return jsonError("Trop d'envois en cours. Attendez la fin de vos envois précédents.", 429);
  }

  // ---- Create the empty video on Bunny ----
  let bunnyVideoId;
  try {
    bunnyVideoId = await createBunnyVideo(`${gradeName} · ${subjectName} · ${title}`);
  } catch (err) {
    console.error("Bunny create failed", err.details || err);
    return jsonError("Le service vidéo est indisponible. Réessayez dans un instant.", 502);
  }

  // ---- Create our Firestore doc ----
  const { libraryId } = bunnyConfig();
  const docRef = db.collection("videos").doc();
  const payload = {
    teacherId: teacher.uid,
    teacherName: teacher.name || "",
    gradeId,
    gradeName,
    specializationId,
    specializationName,
    subjectId,
    subjectName,
    subjectEmoji,
    trimestre,
    title,
    titleLower: normalizeText(title),
    searchKeywords: buildSearchKeywords(title, subjectName, teacher.name, gradeName),
    bunnyVideoId,
    bunnyLibraryId: libraryId,
    thumbnailUrl,
    thumbnailPublicId,
    durationSec: clientDurationSec, // provisional — replaced by Bunny's real length after encoding
    views: 0,
    monthlyViews: {},
    status: VIDEO_STATUS.UPLOADING,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  try {
    await docRef.set(payload);
  } catch (err) {
    console.error("Firestore write failed", err);
    await deleteBunnyVideo(bunnyVideoId).catch(() => {});
    return jsonError("Impossible d'enregistrer la vidéo. Réessayez.", 500);
  }

  // ---- Signed, time-limited TUS credentials for the browser ----
  const expires = Math.floor(Date.now() / 1000) + TUS_SIGNATURE_TTL_SEC;
  const signature = buildTusSignature(bunnyVideoId, expires);

  return Response.json({
    videoId: docRef.id,
    bunnyVideoId,
    libraryId,
    signature,
    expires,
    video: {
      ...payload,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
}