import crypto from "crypto";
import { bunnyConfig } from "../../../../lib/bunny";
import { adminDb, syncVideoFromBunny } from "../../../../lib/videoServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Bunny Stream webhook.
 * Set in Bunny → Stream → your library → API → Webhook URL:
 *   https://droussy.tn/api/webhooks/bunny?secret=<BUNNY_WEBHOOK_SECRET>
 *
 * Bunny sends { VideoLibraryId, VideoGuid, Status }. We don't trust the
 * Status number directly (webhook codes differ from the API's video status
 * codes); we re-read the video from Bunny's API instead.
 */

function secretMatches(received) {
  const expected = process.env.BUNNY_WEBHOOK_SECRET || "";
  if (!expected || !received) return false;
  const a = Buffer.from(String(received));
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (!secretMatches(secret)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: true, ignored: "invalid_json" });
  }

  const guid = typeof payload?.VideoGuid === "string" ? payload.VideoGuid : null;
  const libraryId = String(payload?.VideoLibraryId ?? "");
  if (!guid) return Response.json({ ok: true, ignored: "no_guid" });
  if (libraryId && libraryId !== String(bunnyConfig().libraryId)) {
    return Response.json({ ok: true, ignored: "other_library" });
  }

  const snap = await adminDb().collection("videos").where("bunnyVideoId", "==", guid).limit(1).get();

  // Always answer 200 for unknown videos (e.g. manual test uploads from the
  // Bunny dashboard) so Bunny doesn't keep retrying.
  if (snap.empty) return Response.json({ ok: true, ignored: "unknown_video" });

  const doc = snap.docs[0];
  try {
    const result = await syncVideoFromBunny(doc.ref, doc.data());
    return Response.json({ ok: true, videoId: doc.id, status: result.status });
  } catch (err) {
    console.error("Bunny webhook sync failed", guid, err.details || err);
    // 500 lets Bunny retry later.
    return Response.json({ error: "sync_failed" }, { status: 500 });
  }
}