import { presignPdfRead } from "../../../../../lib/bunnyStorage";
import { adminDb, requireUser, jsonError } from "../../../../../lib/videoServer";
import { canWatchVideo } from "../../../../../lib/videoAccess";
import { CONTENT_TYPES, PDF_URL_TTL_SEC } from "../../../../../lib/videoConfig";
import { subscriptionStatus, isFreeAccess, accessDeniedMessage, deniedCode } from "../../../../../lib/subscription";
import { claimDocAccess } from "../../../../../lib/subscriptionServer";
import { isOpenDoc } from "../../../../../lib/openDocs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Logged-in user when a token is sent, null otherwise (open documents need no account). */
async function optionalUser(request) {
  const header = request.headers.get("authorization") || "";
  if (!/^Bearer\s+\S+/i.test(header)) return null;
  return requireUser(request);
}

/**
 * POST /api/pdfs/{id}/open
 * - Open (free) PDF: anyone, even without an account. Never counted.
 * - Otherwise: the logged-in user must be allowed (published + active
 *   subscription, or the teacher who uploaded it); the PDF is counted
 *   against the subscription's hidden usage limit (never twice).
 * Returns:
 *   - a signed file link valid a few minutes (the viewer downloads it at once
 *     and draws the pages itself — the link is never shown to the student),
 *   - the watermark text drawn on every page (name + phone of the reader,
 *     "Droussy TN" for visitors without an account),
 *   - where the student stopped last time,
 *   - tracking: false for open PDFs (no reading reports at all).
 */
export async function POST(request, { params }) {
  let user;
  try {
    user = await optionalUser(request);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  const { id } = await params;
  if (!id || typeof id !== "string" || id.length > 64) return jsonError("Document introuvable.", 404);

  const db = adminDb();
  const [docSnap, userSnap, viewSnap] = await Promise.all([
    db.collection("videos").doc(id).get(),
    user ? db.collection("users").doc(user.uid).get() : null,
    user ? db.collection("videoViews").doc(`${id}_${user.uid}`).get() : null,
  ]);

  if (!docSnap.exists) return jsonError("Document introuvable.", 404);
  const pdf = docSnap.data();
  if (pdf.type !== CONTENT_TYPES.PDF) return jsonError("Ce contenu n'est pas un PDF.", 400);
  if (!pdf.storageKey) return jsonError("PDF indisponible.", 409);

  const open = isOpenDoc(pdf);
  const profile = userSnap?.exists ? userSnap.data() : {};

  if (!open) {
    if (!user) return Response.json({ error: "Connecte-toi pour lire ce PDF.", code: "login" }, { status: 401 });

    const viewer = { ...profile, uid: user.uid, role: user.role || profile.role };
    if (!canWatchVideo(viewer, pdf)) {
      if (!isFreeAccess(viewer, pdf) && pdf.status !== "published") return jsonError("Document introuvable.", 404);
      const code = deniedCode(subscriptionStatus(viewer));
      return Response.json({ error: accessDeniedMessage(code), code }, { status: 403 });
    }

    // Count it against the subscription (no-op if already opened in this subscription).
    let access;
    try {
      access = await claimDocAccess(db, viewer, pdf, id);
    } catch (err) {
      console.error("claimDocAccess failed", id, user.uid, err);
      return jsonError("Erreur temporaire. Réessaie dans un instant.", 500);
    }
    if (!access.ok) {
      return Response.json({ error: access.message, code: access.state }, { status: 403 });
    }
  }

  let url;
  try {
    url = await presignPdfRead(pdf.storageKey, PDF_URL_TTL_SEC);
  } catch (err) {
    console.error("presign read failed", id, err);
    return jsonError("PDF indisponible pour le moment.", 503);
  }

  // Name + phone on every page: a shared screenshot or photo points back to its owner.
  let watermark = "Droussy TN";
  if (user) {
    const name = String(profile.name || user.name || "").trim().slice(0, 40);
    const phone = String(profile.phone || profile.phoneNumber || "").replace(/\D/g, "").slice(-8);
    watermark = ["Droussy TN", name, phone].filter(Boolean).join(" · ") || `Droussy TN · ${user.uid.slice(0, 6)}`;
  }

  const view = viewSnap?.exists ? viewSnap.data() : null;

  return Response.json(
    {
      url,
      expiresInSec: PDF_URL_TTL_SEC,
      watermark,
      pageCount: pdf.pageCount || null,
      lastPage: Math.max(1, Number(view?.lastPage) || 1),
      counted: !!view?.counted,
      tracking: !open,
      isOpen: open,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}