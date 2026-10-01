"use client";

// PDF upload from the teacher's browser straight to Bunny Storage, through a
// short-lived presigned URL from our server. PDFs are small compared to videos,
// so it's a single PUT — retried automatically on bad connections.

import { MAX_PDF_BYTES } from "./videoConfig";

export function isPdfFile(file) {
  return !!file && ((file.type || "") === "application/pdf" || /\.pdf$/i.test(file.name || ""));
}

/**
 * Reads the first bytes: { ok: true } if it's a real PDF ("%PDF-" header),
 * otherwise { ok: false, reason: "unreadable" | "not_pdf" | "too_large" | "empty", errorName?, errorMessage? }.
 */
export async function checkPdfFile(file) {
  if (!file || !file.size) return { ok: false, reason: "empty" };
  if (file.size > MAX_PDF_BYTES) return { ok: false, reason: "too_large" };
  try {
    const buf = await file.slice(0, Math.min(1024, file.size)).arrayBuffer();
    const head = new TextDecoder("latin1").decode(buf);
    return head.includes("%PDF-") ? { ok: true } : { ok: false, reason: "not_pdf" };
  } catch (err) {
    return {
      ok: false,
      reason: "unreadable",
      errorName: err?.name || "Error",
      errorMessage: String(err?.message || err).slice(0, 300),
    };
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function waitForOnline() {
  if (typeof navigator === "undefined" || navigator.onLine !== false) return Promise.resolve();
  return new Promise((resolve) => window.addEventListener("online", resolve, { once: true }));
}

/**
 * PUTs `file` to the presigned `uploadUrl`.
 * onProgress(fraction) · onState("uploading" | "retrying" | "offline")
 * Returns { promise, abort }.
 */
export function startPdfUpload(file, uploadUrl, { onProgress, onState } = {}) {
  let xhr = null;
  let aborted = false;
  const MAX_ATTEMPTS = 6;

  const sendOnce = () =>
    new Promise((resolve, reject) => {
      xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      // Must match the Content-Type the URL was signed with.
      xhr.setRequestHeader("Content-Type", "application/pdf");
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onState?.("uploading");
          onProgress?.(e.loaded / e.total);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(Object.assign(new Error(`HTTP ${xhr.status}`), { status: xhr.status, body: xhr.responseText }));
      };
      xhr.onerror = () => reject(Object.assign(new Error("network"), { network: true }));
      xhr.onabort = () => reject(Object.assign(new Error("aborted"), { aborted: true }));
      xhr.send(file);
    });

  const promise = (async () => {
    let lastErr;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      if (aborted) throw Object.assign(new Error("aborted"), { aborted: true });
      try {
        await sendOnce();
        onProgress?.(1);
        return;
      } catch (err) {
        lastErr = err;
        if (err.aborted) throw err;
        if (err.status === 403) {
          // Signature expired or rejected — a retry with the same URL won't help.
          throw Object.assign(new Error("L'autorisation d'envoi a expiré. Fermez cette fenêtre et publiez à nouveau."), {
            httpStatus: 403,
            cause: err,
          });
        }
        if (err.status && err.status >= 400 && err.status < 500) break;
        const offline = typeof navigator !== "undefined" && navigator.onLine === false;
        onState?.(offline ? "offline" : "retrying");
        await waitForOnline();
        await sleep(Math.min(20000, 1500 * 2 ** (attempt - 1)));
      }
    }
    throw Object.assign(new Error("L'envoi du PDF a échoué. Vérifiez votre connexion et réessayez."), {
      httpStatus: lastErr?.status,
      cause: lastErr,
    });
  })();

  return {
    promise,
    abort: () => {
      aborted = true;
      try {
        xhr?.abort();
      } catch {
        /* ignore */
      }
    },
  };
}