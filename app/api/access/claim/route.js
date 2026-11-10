import { adminDb, requireUser, jsonError } from "../../../../lib/videoServer";
import { canWatchVideo } from "../../../../lib/videoAccess";
import { subscriptionStatus, isFreeAccess, accessDeniedMessage, deniedCode } from "../../../../lib/subscription";
import { claimDocAccess } from "../../../../lib/subscriptionServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/access/claim   { docId }
 * Called by the catalog just before it opens a video or a PDF, so it can show
 * the right window (subscribe / expired / usage limit) instead of an error
 * inside the player. Counts the document against the subscription — the play
 * and PDF routes call the same claim again, which never counts twice.
 *
 * → 200 { ok: true }   or   403 { ok: false, code: "none" | "expired" | "inactive" | "quota" | "trial_ended", error }
 * The response never contains the counter (students don't see it).
 */
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
  const docId = typeof body.docId === "string" ? body.docId.slice(0, 64) : "";
  if (!docId) return jsonError("Document introuvable.", 404);

  const db = adminDb();
  const [docSnap, userSnap] = await Promise.all([
    db.collection("videos").doc(docId).get(),
    db.collection("users").doc(user.uid).get(),
  ]);
  if (!docSnap.exists) return jsonError("Document introuvable.", 404);
  const doc = docSnap.data();
  const profile = userSnap.exists ? userSnap.data() : {};
  const viewer = { ...profile, uid: user.uid, role: user.role || profile.role };

  if (!canWatchVideo(viewer, doc)) {
    if (!isFreeAccess(viewer, doc) && doc.status !== "published") return jsonError("Document introuvable.", 404);
    const code = deniedCode(subscriptionStatus(viewer));
    return Response.json({ ok: false, code, error: accessDeniedMessage(code) }, { status: 403 });
  }

  try {
    const access = await claimDocAccess(db, viewer, doc, docId);
    if (!access.ok) {
      return Response.json({ ok: false, code: access.state, error: access.message }, { status: 403 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("claim failed", docId, user.uid, err);
    return jsonError("Erreur temporaire. Réessaie dans un instant.", 500);
  }
}