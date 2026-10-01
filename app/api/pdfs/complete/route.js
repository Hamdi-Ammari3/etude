import { PDFDocument } from "pdf-lib";
import { adminDb, requireTeacher, jsonError, FieldValue } from "../../../../lib/videoServer";
import { headObject, getObjectBytes, deleteObject } from "../../../../lib/bunnyStorage";
import { VIDEO_STATUS, MAX_PDF_BYTES, REQUIRE_REVIEW, CONTENT_TYPES } from "../../../../lib/videoConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/pdfs/complete   { contentId }
 * Called by the browser after the PUT to Bunny Storage succeeded.
 * Checks the file is really there, really a PDF and not too big, counts its
 * pages, then moves the doc to "pending" (admin review) or "published".
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
  const contentId = typeof body.contentId === "string" ? body.contentId.slice(0, 64) : "";
  if (!contentId) return jsonError("Document introuvable.", 404);

  const ref = adminDb().collection("videos").doc(contentId);
  const snap = await ref.get();
  const data = snap.exists ? snap.data() : null;
  if (!data || data.teacherId !== teacher.uid || data.type !== CONTENT_TYPES.PDF) {
    return jsonError("Document introuvable.", 404);
  }
  if (data.status !== VIDEO_STATUS.UPLOADING) {
    // Already completed (double click / retry) — just return the current state.
    return Response.json({ status: data.status, pageCount: data.pageCount || null, fileSizeBytes: data.fileSizeBytes });
  }

  async function fail(reason, message) {
    await deleteObject(data.storageKey);
    await ref.update({
      status: VIDEO_STATUS.FAILED,
      failureReason: reason,
      failedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return jsonError(message, 422);
  }

  const head = await headObject(data.storageKey);
  if (!head || head.size === 0) {
    return jsonError("Le fichier n'est pas encore arrivé. Réessayez l'envoi.", 409);
  }
  if (head.size > MAX_PDF_BYTES) {
    return fail("pdf_too_large", "Le PDF dépasse la taille maximale autorisée.");
  }

  const bytes = await getObjectBytes(data.storageKey);
  // Real PDFs start with "%PDF-" (allowing a few junk bytes before it).
  const head1k = Buffer.from(bytes.subarray(0, 1024)).toString("latin1");
  if (!head1k.includes("%PDF-")) {
    return fail("not_a_pdf", "Ce fichier n'est pas un PDF valide.");
  }

  let pageCount = null;
  try {
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
    pageCount = pdf.getPageCount();
  } catch (err) {
    // Unusual/damaged structure: keep it (the admin review will see it), just no page count.
    console.warn("pdf-lib could not read", contentId, err?.message);
  }
  if (pageCount === 0) return fail("empty_pdf", "Ce PDF ne contient aucune page.");

  const status = REQUIRE_REVIEW ? VIDEO_STATUS.PENDING : VIDEO_STATUS.PUBLISHED;
  await ref.update({
    status,
    fileSizeBytes: head.size,
    pageCount,
    uploadedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    ...(status === VIDEO_STATUS.PUBLISHED ? { publishedAt: FieldValue.serverTimestamp() } : {}),
  });

  return Response.json({ status, pageCount, fileSizeBytes: head.size });
}