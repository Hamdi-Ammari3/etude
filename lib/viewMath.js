// Pure view-counting math, shared by the heartbeat API route and tests.
// No Firebase imports here on purpose.
//
// How a view is measured:
// - The video is split into 10-second chunks.
// - The browser reports a chunk only after ~80% of it actually PLAYED
//   (skipping ahead does not count).
// - The server stores which chunks were watched as a string of "0"/"1".
//   Rewatching the same minute 20 times still marks the same chunks, so
//   only DISTINCT chunks count toward the 50%.
// - The server accepts at most as many new chunks as real time allows
//   (2x speed max), so a fake request can't claim a 20-minute video was
//   watched in 5 seconds.

import { CHUNK_SEC, VIEW_THRESHOLD, MAX_PLAYBACK_RATE } from "./videoConfig";

const FIRST_BEAT_ALLOWANCE = 3; // chunks accepted on the very first heartbeat
const MAX_ELAPSED_SEC = 600; // longer gaps don't grant a bigger allowance
const MAX_CHUNKS_PER_REQUEST = 200;

export function totalChunksFor(durationSec) {
  const d = Number(durationSec) || 0;
  return d > 0 ? Math.max(1, Math.ceil(d / CHUNK_SEC)) : 0;
}

export function requiredChunksFor(totalChunks) {
  return Math.max(1, Math.ceil(totalChunks * VIEW_THRESHOLD));
}

export function emptyBits(total) {
  return "0".repeat(total);
}

export function countBits(bits = "") {
  let n = 0;
  for (let i = 0; i < bits.length; i++) if (bits[i] === "1") n++;
  return n;
}

/** How many NEW chunks the server will accept, given time since the last heartbeat. */
export function chunkAllowance(lastHeartbeatMs, nowMs) {
  if (!lastHeartbeatMs) return FIRST_BEAT_ALLOWANCE;
  const elapsedSec = Math.min(MAX_ELAPSED_SEC, Math.max(0, (nowMs - lastHeartbeatMs) / 1000));
  return Math.ceil((elapsedSec * MAX_PLAYBACK_RATE) / CHUNK_SEC) + 1;
}

/**
 * Merges newly reported chunks into the stored bit string.
 * Returns { bits, accepted } — `accepted` lists the chunk indices actually
 * recorded, so the browser can re-send the rest on the next heartbeat.
 */
export function mergeChunks(storedBits, reported, total, allowance) {
  let bits = storedBits && storedBits.length === total ? storedBits : emptyBits(total);

  const candidates = [
    ...new Set(
      (Array.isArray(reported) ? reported : [])
        .slice(0, MAX_CHUNKS_PER_REQUEST)
        .map((c) => Number(c))
        .filter((c) => Number.isInteger(c) && c >= 0 && c < total)
    ),
  ]
    .filter((c) => bits[c] !== "1")
    .sort((a, b) => a - b)
    .slice(0, Math.max(0, allowance));

  if (candidates.length === 0) return { bits, accepted: [] };

  const arr = bits.split("");
  candidates.forEach((c) => {
    arr[c] = "1";
  });
  return { bits: arr.join(""), accepted: candidates };
}

/** "YYYY-MM" in Tunisia time. */
export function monthKeyTunis(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Tunis",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  return `${y}-${m}`;
}