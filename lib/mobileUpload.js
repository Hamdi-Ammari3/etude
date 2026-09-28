"use client";

// Robust video upload helpers for teachers on phones and slow connections.
//
// - Video files are NOT pre-read on selection (Android can hand over files
//   that fail a full read but upload fine chunk by chunk). We only read the
//   first bytes, and report the exact browser error if even that fails.
// - Uploads: 5 MB chunks, automatic resume when the network comes back,
//   resume from where it stopped (never from 0), screen kept awake,
//   live speed and time-remaining estimate.

import * as tus from "tus-js-client";
import { BUNNY_TUS_ENDPOINT } from "./videoConfig";

const VIDEO_EXTENSIONS = /\.(mp4|m4v|mov|3gp|3g2|webm|mkv|avi|mts|m2ts|wmv|mpg|mpeg)$/i;
const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_CONSECUTIVE_FAILURES = 40; // without ANY progress in between

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

/** Facebook / Instagram / TikTok / Snapchat in-app browsers break file uploads. */
export function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  return /FBAN|FBAV|FB_IAB|Instagram|Snapchat|TikTok|musical_ly|Line\/|LinkedInApp|Twitter/i.test(
    navigator.userAgent || ""
  );
}

export function isVideoFile(file) {
  return !!file && ((file.type || "").startsWith("video/") || VIDEO_EXTENSIONS.test(file.name || ""));
}

function sleep(ms, signal) {
  return new Promise((resolve) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener?.("kick", () => {
      clearTimeout(t);
      resolve();
    }, { once: true });
  });
}

function waitForOnline(signal) {
  if (typeof navigator === "undefined" || navigator.onLine !== false) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      window.removeEventListener("online", done);
      resolve();
    };
    window.addEventListener("online", done);
    signal?.addEventListener?.("kick", done, { once: true });
  });
}

// ---------------------------------------------------------------------------
// Video: light readability probe + best-effort duration (never blocks)
// ---------------------------------------------------------------------------

/**
 * Reads only the first bytes of the file. Returns { ok: true } or
 * { ok: false, errorName, errorMessage } with the browser's exact error.
 * (We don't read the end of the file: some Android pickers report a size
 * that makes tail reads fail even though a chunked upload works.)
 */
export async function probeFileStart(file) {
  try {
    if (!file || !file.size) return { ok: false, errorName: "EmptyFile", errorMessage: "size 0" };
    await file.slice(0, Math.min(64 * 1024, file.size)).arrayBuffer();
    return { ok: true };
  } catch (err) {
    return { ok: false, errorName: err?.name || "Error", errorMessage: String(err?.message || err).slice(0, 300) };
  }
}

/** Duration in seconds, or 0 if the phone won't tell us (the server gets the real one after encoding). */
export function readVideoDuration(file, timeoutMs = 8000) {
  return new Promise((resolve) => {
    let url;
    let el;
    let finished = false;
    const finish = (d) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      try {
        el?.removeAttribute("src");
        el?.load?.();
        el?.remove();
      } catch {
        /* ignore */
      }
      if (url) URL.revokeObjectURL(url);
      resolve(Number.isFinite(d) && d > 0 ? d : 0);
    };
    const timer = setTimeout(() => finish(0), timeoutMs);
    try {
      url = URL.createObjectURL(file);
      el = document.createElement("video");
      el.preload = "metadata";
      el.muted = true;
      el.playsInline = true;
      el.setAttribute("playsinline", "");
      el.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px";
      el.onloadedmetadata = () => {
        if (el.duration === Infinity) {
          // Some recordings (webm) report Infinity until we seek far.
          el.ontimeupdate = () => {
            el.ontimeupdate = null;
            finish(el.duration);
          };
          el.currentTime = 1e101;
        } else {
          finish(el.duration);
        }
      };
      el.onerror = () => finish(0);
      document.body.appendChild(el); // iOS loads metadata more reliably when attached
      el.src = url;
    } catch {
      finish(0);
    }
  });
}

// ---------------------------------------------------------------------------
// Video upload to Bunny (TUS) — resumable, self-healing
// ---------------------------------------------------------------------------

export function tusHttpStatus(err) {
  const s = err?.originalResponse?.getStatus?.();
  if (s) return s;
  const m = String(err?.message || "").match(/response code: (\d{3})/);
  return m ? Number(m[1]) : null;
}

function isFatalStatus(status) {
  // Client errors that retrying won't fix (except conflict/locked/rate-limit).
  return !!status && status >= 400 && status < 500 && ![408, 409, 423, 429].includes(status);
}

/**
 * Starts (or resumes) the upload of `file` to the Bunny video `creds.bunnyVideoId`.
 *
 * onProgress(fraction, { bytesSent, bytesTotal, speedBps, etaSec })
 * onState("uploading" | "retrying" | "offline" | "slow", info)
 *
 * Returns { promise, abort, kick }:
 *   promise resolves on success, rejects with a friendly Error (+ .httpStatus, .fraction)
 *   abort()  stops for good (teacher cancelled)
 *   kick()   skips the current wait and retries now (network back / page visible)
 */
export function startVideoUpload(file, creds, { title, onProgress, onState } = {}) {
  const signal = new EventTarget();
  let upload = null;
  let aborted = false;
  let failuresInARow = 0;
  let lastFraction = 0;
  let lastBytes = 0;
  let lastProgressAt = Date.now();
  let speedBps = 0;
  let slowTimer = null;

  const promise = new Promise((resolve, reject) => {
    const fail = (err, message) => {
      clearInterval(slowTimer);
      const e = new Error(message);
      e.httpStatus = tusHttpStatus(err);
      e.fraction = lastFraction;
      e.cause = err;
      reject(e);
    };

    upload = new tus.Upload(file, {
      endpoint: BUNNY_TUS_ENDPOINT,
      chunkSize: CHUNK_SIZE,
      // Short built-in retries; our own loop below handles long outages.
      retryDelays: [0, 1000, 3000, 6000],
      storeFingerprintForResuming: true,
      removeFingerprintOnSuccess: true,
      // Tie the resume point to THIS Bunny video, so a new upload of the same
      // file never tries to resume into an old (deleted) video.
      fingerprint: async (f) =>
        ["droussy-tus", creds.bunnyVideoId, f.name, f.size, f.lastModified].join("|"),
      headers: {
        AuthorizationSignature: creds.signature,
        AuthorizationExpire: String(creds.expires),
        VideoId: creds.bunnyVideoId,
        LibraryId: String(creds.libraryId),
      },
      metadata: { filetype: file.type || "video/mp4", title: title || "Droussy" },

      onProgress: (sent, total) => {
        const now = Date.now();
        const dt = (now - lastProgressAt) / 1000;
        if (dt > 0.5 && sent > lastBytes) {
          const inst = (sent - lastBytes) / dt;
          speedBps = speedBps ? speedBps * 0.7 + inst * 0.3 : inst;
          lastBytes = sent;
          lastProgressAt = now;
        }
        failuresInARow = 0;
        lastFraction = total ? sent / total : 0;
        const etaSec = speedBps > 0 ? Math.round((total - sent) / speedBps) : null;
        onState?.("uploading");
        onProgress?.(lastFraction, { bytesSent: sent, bytesTotal: total, speedBps, etaSec });
      },

      onSuccess: () => {
        clearInterval(slowTimer);
        resolve();
      },

      onError: async (err) => {
        if (aborted) return;
        const status = tusHttpStatus(err);

        if (status === 401 || status === 403) {
          return fail(err, "L'autorisation d'envoi a expiré. Fermez cette fenêtre et publiez à nouveau.");
        }
        if (isFatalStatus(status)) {
          return fail(err, `Le serveur vidéo a refusé le fichier (erreur ${status}). Essayez un autre format (MP4).`);
        }
        if (err?.name === "NotReadableError" || /NotReadable|could not be read|permission/i.test(String(err))) {
          return fail(
            err,
            "Le téléphone ne permet plus de lire cette vidéo. Enregistrez-la dans la galerie du téléphone, puis réessayez."
          );
        }

        failuresInARow += 1;
        if (failuresInARow > MAX_CONSECUTIVE_FAILURES) {
          return fail(err, "La connexion est trop instable. Vous pourrez reprendre l'envoi là où il s'est arrêté.");
        }

        const offline = typeof navigator !== "undefined" && navigator.onLine === false;
        onState?.(offline ? "offline" : "retrying", { attempt: failuresInARow });
        await waitForOnline(signal);
        await sleep(Math.min(30000, 1000 * 2 ** Math.min(failuresInARow, 5)), signal);
        if (!aborted) upload.start(); // resumes from the last confirmed byte
      },
    });

    // Resume a previous attempt of THIS video if the browser remembers one.
    upload
      .findPreviousUploads()
      .then((previous) => {
        if (previous?.length) upload.resumeFromPreviousUpload(previous[0]);
      })
      .catch(() => {})
      .finally(() => {
        if (!aborted) upload.start();
      });

    // "Slow" indicator: no progress for 20 s while online.
    slowTimer = setInterval(() => {
      if (!aborted && Date.now() - lastProgressAt > 20000 && navigator.onLine !== false) onState?.("slow");
    }, 5000);
  });

  // Network back or page visible again → retry immediately.
  const kick = () => signal.dispatchEvent(new Event("kick"));
  const onVisible = () => document.visibilityState === "visible" && kick();
  window.addEventListener("online", kick);
  document.addEventListener("visibilitychange", onVisible);
  const cleanup = () => {
    clearInterval(slowTimer);
    window.removeEventListener("online", kick);
    document.removeEventListener("visibilitychange", onVisible);
  };
  promise.then(cleanup, cleanup);

  return {
    promise,
    kick,
    abort: async () => {
      aborted = true;
      cleanup();
      try {
        await upload?.abort(true);
      } catch {
        /* ignore */
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Keep the phone screen on during long uploads (Chrome Android, iOS 16.4+)
// ---------------------------------------------------------------------------

export function keepScreenAwake() {
  let sentinel = null;
  let active = true;
  const request = async () => {
    try {
      if (active && "wakeLock" in navigator && document.visibilityState === "visible") {
        sentinel = await navigator.wakeLock.request("screen");
      }
    } catch {
      /* not supported / denied — upload still works */
    }
  };
  const onVisible = () => document.visibilityState === "visible" && request();
  request();
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    active = false;
    document.removeEventListener("visibilitychange", onVisible);
    sentinel?.release?.().catch?.(() => {});
  };
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function formatEta(sec) {
  if (sec == null || !Number.isFinite(sec)) return "";
  if (sec < 60) return "moins d'une minute";
  const m = Math.round(sec / 60);
  if (m < 60) return `≈ ${m} min`;
  const h = Math.floor(m / 60);
  return `≈ ${h} h ${String(m % 60).padStart(2, "0")}`;
}

export function formatSpeed(bps) {
  if (!bps) return "";
  const kbps = (bps * 8) / 1000;
  return kbps >= 1000 ? `${(kbps / 1000).toFixed(1)} Mb/s` : `${Math.round(kbps)} kb/s`;
}