import { buildEmbedUrl } from "../../../../../lib/bunny";
import { adminDb, requireUser, jsonError } from "../../../../../lib/videoServer";
import { canWatchVideo } from "../../../../../lib/videoAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMBED_TTL_SEC = 300; // Bunny recommends short-lived tokens (1–5 min)

/**
 * POST /api/videos/{id}/play
 * Checks that the logged-in user may watch this video (published + grade
 * purchased, or the teacher who uploaded it) and returns a short-lived
 * signed Bunny player URL.
 */
export async function POST(request, { params }) {
  let user;
  try {
    user = await requireUser(request);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  const { id } = await params;
  if (!id || typeof id !== "string" || id.length > 64) return jsonError("Vidéo introuvable.", 404);

  const db = adminDb();
  const [videoSnap, userSnap] = await Promise.all([
    db.collection("videos").doc(id).get(),
    db.collection("users").doc(user.uid).get(),
  ]);

  if (!videoSnap.exists) return jsonError("Vidéo introuvable.", 404);
  const video = videoSnap.data();
  const profile = userSnap.exists ? userSnap.data() : {};

  const viewer = { ...profile, uid: user.uid, role: user.role || profile.role };
  if (!canWatchVideo(viewer, video)) {
    return jsonError("Cette vidéo n'est pas incluse dans votre abonnement.", 403);
  }
  if (video.type === "pdf") return jsonError("Ce contenu est un PDF.", 400);
  if (!video.bunnyVideoId) return jsonError("Vidéo indisponible.", 409);

  const { url, expires } = buildEmbedUrl(video.bunnyVideoId, { ttlSec: EMBED_TTL_SEC, autoplay: true });

  return Response.json({
    embedUrl: url,
    expires,
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