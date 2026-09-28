"use client";

// Robust upload helpers for teachers on phones and slow connections.
//
// Problems this solves:
// 1. Phones (esp. Android + Google Photos/Drive, HEIC photos, in-app browsers)
//    hand the site a file reference that becomes unreadable → preview
//    "undefined", duration 0:00, and "network error" on upload.
//    → We READ the thumbnail into memory right away and re-encode it as a
//      small JPEG (≈150 KB). For videos we test-read the file on selection
//      and explain clearly if the phone doesn't allow reading it.
// 2. Slow / unstable connections.
//    → 5 MB chunks, automatic resume when the network comes back, resume
//      from where it stopped (never from 0), screen kept awake, live speed
//      and time-remaining estimate.

import * as tus from "tus-js-client";
import { BUNNY_TUS_ENDPOINT } from "./videoConfig";

const VIDEO_EXTENSIONS = /\.(mp4|m4v|mov|3gp|3g2|webm|mkv|avi|mts|m2ts|wmv|mpg|mpeg)$/i;
const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|heic|heif|bmp)$/i;
const THUMB_MAX_W = 1280;
const THUMB_MAX_H = 720;
const THUMB_JPEG_QUALITY = 0.85;
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

export function isImageFile(file) {
  return !!file && ((file.type || "").startsWith("image/") || IMAGE_EXTENSIONS.test(file.name || ""));
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
// Thumbnail: read NOW, re-encode to a small JPEG, keep the bytes in memory
// ---------------------------------------------------------------------------

async function decodeImage(blob) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(blob, { imageOrientation: "from-image" });
    } catch {
      /* fall through to <img> */
    }
  }
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("decode"));
      el.src = url;
    });
    return img;
  } finally {
    // The <img> keeps its decoded pixels; the URL can go.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/**
 * Returns { blob, previewUrl, converted } — `blob` is safe to upload later
 * even if the phone revokes access to the original file.
 * Throws an Error with a French, user-facing message when the file can't be read.
 */
export async function prepareThumbnail(file) {
  let bytes;
  try {
    bytes = await file.arrayBuffer(); // read immediately, while we still can
  } catch {
    throw new Error(
      "Impossible de lire cette image sur votre téléphone. Choisissez une photo enregistrée dans la galerie (pas dans le cloud) ou faites une capture d'écran."
    );
  }
  const original = new Blob([bytes], { type: file.type || "image/jpeg" });

  try {
    const img = await decodeImage(original);
    const w = img.width || img.naturalWidth;
    const h = img.height || img.naturalHeight;
    if (!w || !h) throw new Error("size");
    const scale = Math.min(1, THUMB_MAX_W / w, THUMB_MAX_H / h);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    img.close?.();
    const jpeg = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", THUMB_JPEG_QUALITY));
    if (!jpeg) throw new Error("encode");
    return { blob: jpeg, previewUrl: URL.createObjectURL(jpeg), converted: true };
  } catch {
    // Browser can't decode it (e.g. HEIC on Android Chrome). Upload the
    // original bytes — Cloudinary converts HEIC to WebP — but no preview.
    return { blob: original, previewUrl: null, converted: false };
  }
}

// ---------------------------------------------------------------------------
// Video: check it's readable + best-effort duration (never blocks on phones)
// ---------------------------------------------------------------------------

/** Reads a few bytes at the start and end — fails fast if the phone blocks access. */
export async function checkFileReadable(file) {
  try {
    const size = file.size || 0;
    if (size === 0) return false;
    await file.slice(0, Math.min(65536, size)).arrayBuffer();
    if (size > 65536) await file.slice(size - 65536, size).arrayBuffer();
    return true;
  } catch {
    return false;
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
// Thumbnail upload with retries
// ---------------------------------------------------------------------------

function xhrUpload(url, form, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* ignore */
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) resolve(data);
      else {
        const err = new Error(data?.error?.message || `HTTP ${xhr.status}`);
        err.status = xhr.status;
        reject(err);
      }
    };
    xhr.onerror = () => reject(Object.assign(new Error("network"), { network: true }));
    xhr.ontimeout = () => reject(Object.assign(new Error("timeout"), { network: true }));
    xhr.timeout = 120000;
    xhr.send(form);
  });
}

/**
 * Uploads the prepared thumbnail blob to Cloudinary.
 * `getSignature` is called on every attempt (signatures are time-limited).
 */
export async function uploadThumbnail(blob, getSignature, onProgress, onRetry) {
  let lastErr;
  for (let attempt = 1; attempt <= 5; attempt++) {
    await waitForOnline();
    try {
      const sig = await getSignature();
      const form = new FormData();
      form.append("file", blob, "thumbnail.jpg");
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);
      form.append("format", sig.format);
      form.append("transformation", sig.transformation);
      const data = await xhrUpload(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, form, onProgress);
      return { url: data.secure_url, publicId: data.public_id };
    } catch (err) {
      lastErr = err;
      // 4xx from Cloudinary (bad file, bad signature) won't fix itself.
      if (err.status && err.status >= 400 && err.status < 500) break;
      onRetry?.(attempt);
      await sleep(Math.min(15000, 1500 * 2 ** (attempt - 1)));
    }
  }
  throw new Error(
    lastErr?.network
      ? "Impossible d'envoyer la miniature : connexion instable. Vérifiez votre réseau et réessayez."
      : "Impossible d'envoyer la miniature. Essayez avec une autre image."
  );
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