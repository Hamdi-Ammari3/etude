import { adminDb, requireTeacher, jsonError, FieldValue } from "../../../../lib/videoServer";
import { presignPdfUpload, pdfKeyFor } from "../../../../lib/bunnyStorage";
import { cleanTitle, normalizeText, buildSearchKeywords } from "../../../../lib/videoText";
import {
  TITLE_MIN,
  TITLE_MAX,
  TRIMESTRES,
  VIDEO_STATUS,
  MAX_PDF_BYTES,
  CONTENT_TYPES,
  DEFAULT_THUMBNAIL_URL,
  getPdfCategory,
  PDF_VIEW_RATE_MILLIMES,
} from "../../../../lib/videoConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_OPEN_UPLOADS = 5;
const UPLOAD_URL_TTL_SEC = 3600; // slow connections: 1 h to send the file

function str(value, max = 120) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

/**
 * POST /api/pdfs/create-upload
 * Body: { title, gradeId, gradeName, specializationId?, specializationName?,
 *         subjectId, subjectName, subjectEmoji, category, hasCorrection,
 *         trimestre?, fileName, fileSize }
 * → creates the Firestore doc (status "uploading") and returns a presigned
 *   URL the browser PUTs the PDF to, directly on Bunny Storage.
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

  const title = cleanTitle(body.title).slice(0, TITLE_MAX);
  const gradeId = str(body.gradeId, 40);
  const gradeName = str(body.gradeName, 60);
  const subjectId = str(body.subjectId, 40);
  const subjectName = str(body.subjectName, 60);
  const subjectEmoji = str(body.subjectEmoji, 8) || "📚";
  const specializationId = str(body.specializationId, 40) || null;
  const specializationName = str(body.specializationName, 60) || null;
  const category = getPdfCategory(str(body.category, 40));
  const hasCorrection = body.hasCorrection === true;
  const trimestreRaw = Number(body.trimestre);
  const trimestre = TRIMESTRES.some((t) => t.id === trimestreRaw) ? trimestreRaw : null;
  const fileName = str(body.fileName, 200);
  const fileSize = Math.round(Number(body.fileSize) || 0);

  if (title.length < TITLE_MIN) return jsonError("Le titre est trop court.");
  if (!gradeId || !gradeName) return jsonError("Niveau manquant.");
  if (!subjectId || !subjectName) return jsonError("Matière manquante.");
  if (!category) return jsonError("Choisissez le type de document.");
  if (category.needsTrimestre && !trimestre) return jsonError("Choisissez le trimestre de ce devoir.");
  if (fileSize <= 0) return jsonError("Fichier PDF manquant.");
  if (fileSize > MAX_PDF_BYTES) {
    return jsonError(`Le PDF ne doit pas dépasser ${Math.round(MAX_PDF_BYTES / (1024 * 1024))} Mo.`);
  }

  const db = adminDb();

  const openUploads = await db
    .collection("videos")
    .where("teacherId", "==", teacher.uid)
    .where("status", "==", VIDEO_STATUS.UPLOADING)
    .limit(MAX_OPEN_UPLOADS)
    .get();
  if (openUploads.size >= MAX_OPEN_UPLOADS) {
    return jsonError("Trop d'envois en cours. Attendez la fin de vos envois précédents.", 429);
  }

  const docRef = db.collection("videos").doc();
  const storageKey = pdfKeyFor(teacher.uid, docRef.id);

  let uploadUrl;
  try {
    uploadUrl = await presignPdfUpload(storageKey, UPLOAD_URL_TTL_SEC);
  } catch (err) {
    console.error("Bunny Storage presign failed", err);
    return jsonError("Le service de stockage est indisponible. Réessayez dans un instant.", 502);
  }

  const payload = {
    type: CONTENT_TYPES.PDF,
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
    searchKeywords: buildSearchKeywords(title, subjectName, teacher.name, gradeName, category.label),
    pdfCategory: category.id,
    pdfCategoryLabel: category.label,
    // Rate frozen on the doc: changing the config later won't change what this PDF already earns.
    viewRateMillimes: PDF_VIEW_RATE_MILLIMES,
    hasCorrection,
    storageKey,
    originalFileName: fileName || null,
    fileSizeBytes: fileSize, // provisional — confirmed by /complete
    pageCount: null,
    thumbnailUrl: DEFAULT_THUMBNAIL_URL,
    thumbnailPublicId: null,
    views: 0,
    monthlyViews: {},
    status: VIDEO_STATUS.UPLOADING,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await docRef.set(payload);

  return Response.json({
    contentId: docRef.id,
    uploadUrl,
    expiresInSec: UPLOAD_URL_TTL_SEC,
    content: { ...payload, id: docRef.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  });
}