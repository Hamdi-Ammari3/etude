import { buildEmbedUrl } from "../../../../../lib/bunny";
import { adminDb, requireUser, jsonError } from "../../../../../lib/videoServer";
import { canWatchVideo } from "../../../../../lib/videoAccess";
import { subscriptionStatus, isFreeAccess, accessDeniedMessage, deniedCode } from "../../../../../lib/subscription";
import { claimDocAccess } from "../../../../../lib/subscriptionServer";
import { isOpenDoc } from "../../../../../lib/openDocs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMBED_TTL_SEC = 300; // Bunny recommends short-lived tokens (1–5 min)

/** Logged-in user when a token is sent, null otherwise (open documents need no account). */
async function optionalUser(request) {
  const header = request.headers.get("authorization") || "";
  if (!/^Bearer\s+\S+/i.test(header)) return null;
  return requireUser(request);
}

/**
 * POST /api/videos/{id}/play
 * - Open (free) video: anyone, even without an account. Never counted.
 * - Otherwise: the logged-in user must be allowed (published + active
 *   subscription, or the teacher who uploaded it); the video is counted
 *   against the subscription's hidden usage limit (never twice).
 * Returns a short-lived signed Bunny player URL.
 */
export async function POST(request, { params }) {
  let user;
  try {
    user = await optionalUser(request);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  const { id } = await params;
  if (!id || typeof id !== "string" || id.length > 64) return jsonError("Vidéo introuvable.", 404);

  const db = adminDb();
  const [videoSnap, userSnap] = await Promise.all([
    db.collection("videos").doc(id).get(),
    user ? db.collection("users").doc(user.uid).get() : null,
  ]);

  if (!videoSnap.exists) return jsonError("Vidéo introuvable.", 404);
  const video = videoSnap.data();
  if (video.type === "pdf") return jsonError("Ce contenu est un PDF.", 400);
  if (!video.bunnyVideoId) return jsonError("Vidéo indisponible.", 409);

  const open = isOpenDoc(video);

  if (!open) {
    if (!user) return Response.json({ error: "Connecte-toi pour regarder cette vidéo.", code: "login" }, { status: 401 });

    const profile = userSnap?.exists ? userSnap.data() : {};
    const viewer = { ...profile, uid: user.uid, role: user.role || profile.role };
    if (!canWatchVideo(viewer, video)) {
      if (!isFreeAccess(viewer, video) && video.status !== "published") return jsonError("Vidéo indisponible.", 404);
      const code = deniedCode(subscriptionStatus(viewer));
      return Response.json({ error: accessDeniedMessage(code), code }, { status: 403 });
    }

    // Count it against the subscription (no-op if already opened in this subscription).
    let access;
    try {
      access = await claimDocAccess(db, viewer, video, id);
    } catch (err) {
      console.error("claimDocAccess failed", id, user.uid, err);
      return jsonError("Erreur temporaire. Réessaie dans un instant.", 500);
    }
    if (!access.ok) {
      return Response.json({ error: access.message, code: access.state }, { status: 403 });
    }
  }

  const { url, expires } = buildEmbedUrl(video.bunnyVideoId, { ttlSec: EMBED_TTL_SEC, autoplay: true });

  return Response.json({
    embedUrl: url,
    expires,
    // Open videos are never counted: the player doesn't send progress reports.
    tracking: !open,
    isOpen: open,
    video: {
      id,
      title: video.title,
      teacherName: video.teacherName,
      subjectName: video.subjectName,
      subjectEmoji: video.subjectEmoji,
      gradeName: video.gradeName,
      durationSec: video.durationSec || 0,
    },
  });
}