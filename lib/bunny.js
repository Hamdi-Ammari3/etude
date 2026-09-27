// SERVER-ONLY. Never import this file from a "use client" component:
// it reads the Bunny API key and token key from the environment.

import crypto from "crypto";

const API_BASE = "https://video.bunnycdn.com";

function env(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

export function bunnyConfig() {
  return {
    libraryId: env("BUNNY_STREAM_LIBRARY_ID"),
    apiKey: env("BUNNY_STREAM_API_KEY"),
    // Falls back to the library API key, which Bunny uses as the embed
    // token key when no separate key is shown in the Security tab.
    tokenKey: process.env.BUNNY_STREAM_TOKEN_KEY || env("BUNNY_STREAM_API_KEY"),
    cdnHostname: process.env.BUNNY_STREAM_CDN_HOSTNAME || "",
  };
}

function sha256Hex(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

async function bunnyFetch(path, { method = "GET", body } = {}) {
  const { apiKey } = bunnyConfig();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      AccessKey: apiKey,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const err = new Error(`Bunny API ${method} ${path} failed with ${res.status}`);
    err.status = res.status;
    err.details = data;
    throw err;
  }
  return data;
}

/** Creates an empty video object in the library. Returns Bunny's video GUID. */
export async function createBunnyVideo(title) {
  const { libraryId } = bunnyConfig();
  const data = await bunnyFetch(`/library/${libraryId}/videos`, {
    method: "POST",
    body: { title: String(title).slice(0, 200) },
  });
  if (!data?.guid) throw new Error("Bunny did not return a video GUID");
  return data.guid;
}

/** Reads a video's current state (status, length in seconds, encodeProgress...). */
export async function getBunnyVideo(guid) {
  const { libraryId } = bunnyConfig();
  return bunnyFetch(`/library/${libraryId}/videos/${guid}`);
}

export async function deleteBunnyVideo(guid) {
  const { libraryId } = bunnyConfig();
  try {
    await bunnyFetch(`/library/${libraryId}/videos/${guid}`, { method: "DELETE" });
  } catch (err) {
    if (err.status !== 404) throw err;
  }
}

/**
 * Signature for a direct browser → Bunny TUS upload.
 * sha256(library_id + api_key + expiration_time + video_id)
 * The API key itself never leaves the server.
 */
export function buildTusSignature(videoGuid, expiresUnix) {
  const { libraryId, apiKey } = bunnyConfig();
  return sha256Hex(`${libraryId}${apiKey}${expiresUnix}${videoGuid}`);
}

/**
 * Short-lived signed iframe URL for the Bunny player.
 * token = sha256(token_key + video_id + expires)
 */
export function buildEmbedUrl(videoGuid, { ttlSec = 300, autoplay = false } = {}) {
  const { libraryId, tokenKey } = bunnyConfig();
  const expires = Math.floor(Date.now() / 1000) + ttlSec;
  const token = sha256Hex(`${tokenKey}${videoGuid}${expires}`);
  const params = new URLSearchParams({
    token,
    expires: String(expires),
    autoplay: String(autoplay),
    preload: "true",
    responsive: "true",
  });
  return {
    url: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoGuid}?${params.toString()}`,
    expires,
  };
}

/**
 * Maps the "status" field of Bunny's video object (NOT the webhook status
 * codes, which use different numbers) to our lifecycle.
 * 0 Created · 1 Uploaded · 2 Processing · 3 Transcoding · 4 Finished
 * 5 Error · 6 UploadFailed
 */
export function mapBunnyVideoStatus(bunnyStatus) {
  switch (bunnyStatus) {
    case 0:
      return "uploading";
    case 1:
    case 2:
    case 3:
      return "encoding";
    case 4:
      return "ready";
    case 5:
    case 6:
      return "failed";
    default:
      // 7/8 = JIT packaging states in newer libraries — still playable soon.
      return "encoding";
  }
}