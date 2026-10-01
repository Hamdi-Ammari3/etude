import { presignPdfRead } from "../../../../../lib/bunnyStorage";
import { adminDb, requireUser, jsonError } from "../../../../../lib/videoServer";
import { canWatchVideo } from "../../../../../lib/videoAccess";
import { CONTENT_TYPES, PDF_URL_TTL_SEC } from "../../../../../lib/videoConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/pdfs/{id}/open
 * Checks that the logged-in user may read this PDF (published + grade
 * purchased, or the teacher who uploaded it) and returns:
 *   - a signed file link valid a few minutes (the viewer downloads it at once
 *     and draws the pages itself — the link is never shown to the student),
 *   - the watermark text drawn on every page (name + phone of the reader),
 *   - where the student stopped last time.
 */
export async function POST(request, { params }) {
  let user;
  try {
    user = await requireUser(request);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  const { id } = await params;
  if (!id || typeof id !== "string" || id.length > 64) return jsonError("Document introuvable.", 404);

  const db = adminDb();
  const [docSnap, userSnap, viewSnap] = await Promise.all([
    db.collection("videos").doc(id).get(),
    db.collection("users").doc(user.uid).get(),
    db.collection("videoViews").doc(`${id}_${user.uid}`).get(),
  ]);

  if (!docSnap.exists) return jsonError("Document introuvable.", 404);
  const pdf = docSnap.data();
  if (pdf.type !== CONTENT_TYPES.PDF) return jsonError("Ce contenu n'est pas un PDF.", 400);

  const profile = userSnap.exists ? userSnap.data() : {};
  const viewer = { ...profile, uid: user.uid, role: user.role || profile.role };
  if (!canWatchVideo(viewer, pdf)) {
    return jsonError("Ce PDF n'est pas inclus dans votre abonnement.", 403);
  }
  if (!pdf.storageKey) return jsonError("PDF indisponible.", 409);

  let url;
  try {
    url = await presignPdfRead(pdf.storageKey, PDF_URL_TTL_SEC);
  } catch (err) {
    console.error("presign read failed", id, err);
    return jsonError("PDF indisponible pour le moment.", 503);
  }

  // Name + phone on every page: a shared screenshot or photo points back to its owner.
  const name = String(profile.name || user.name || "").trim().slice(0, 40);
  const phone = String(profile.phone || profile.phoneNumber || "").replace(/\D/g, "").slice(-8);
  const watermark = ["Droussy TN", name, phone].filter(Boolean).join(" · ") || `Droussy TN · ${user.uid.slice(0, 6)}`;

  const view = viewSnap.exists ? viewSnap.data() : null;

  return Response.json(
    {
      url,
      expiresInSec: PDF_URL_TTL_SEC,
      watermark,
      pageCount: pdf.pageCount || null,
      lastPage: Math.max(1, Number(view?.lastPage) || 1),
      counted: !!view?.counted,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}