"use client";

// In-site PDF reader that never hands the file to the student.
//
// How it protects the teacher's PDF:
// - The file is fetched with a signed link valid 5 minutes, then drawn page
//   by page on <canvas> (pdf.js). No browser PDF viewer → no download,
//   print or "open in…" button, and no text to select or copy.
// - Every page carries a watermark with the reader's name + phone, drawn into
//   the pixels: a shared screenshot or photo points back to its owner.
// - Right-click, long-press menu, drag, Ctrl/Cmd+S and Ctrl/Cmd+P are blocked;
//   printing the page prints nothing.
// No website can stop a phone screenshot or a photo of the screen — the
// watermark is what makes sharing traceable.
//
// It also measures real reading and reports it to /api/pdfs/{id}/progress:
// a page counts once it stayed ≥ 2 s on screen; reading time only runs while
// the tab is visible and the student is active.

import { useCallback, useEffect, useRef, useState } from "react";
import { auth } from "../../lib/firebaseConfig";
import { PDF_HEARTBEAT_MS, PDF_PAGE_DWELL_MS } from "../../lib/videoConfig";
import "./protectedPdfViewer.css";

// pdf.js worker. Default: loaded from jsDelivr with the exact installed version.
// To self-host it instead, copy node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs
// to /public and set: const WORKER_SRC = "/pdf.worker.min.mjs";
const WORKER_SRC = null;

const ZOOM_LEVELS = [1, 1.25, 1.5, 2, 2.5, 3];
const MAX_CANVAS_SIDE = 4096; // phones refuse bigger canvases
const MAX_CANVAS_AREA = 16_000_000;
const IDLE_AFTER_MS = 90_000; // no scroll/touch for 90 s → reading time pauses
const PAGE_GAP_PX = 12;

let pdfjsPromise = null;
function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist/legacy/build/pdf.min.mjs")
      .then((mod) => {
        const lib = mod.getDocument ? mod : mod.default;
        if (!lib.GlobalWorkerOptions.workerSrc) {
          lib.GlobalWorkerOptions.workerSrc =
            WORKER_SRC || `https://cdn.jsdelivr.net/npm/pdfjs-dist@${lib.version}/legacy/build/pdf.worker.min.mjs`;
        }
        return lib;
      })
      .catch((err) => {
        pdfjsPromise = null;
        throw err;
      });
  }
  return pdfjsPromise;
}

async function fetchBytes(url, onProgress, signal) {
  const res = await fetch(url, { signal, credentials: "omit", cache: "no-store" });
  if (!res.ok) {
    throw Object.assign(new Error(res.status === 403 ? "expired" : `HTTP ${res.status}`), { httpStatus: res.status });
  }
  const total = Number(res.headers.get("content-length")) || 0;
  if (!res.body || !total) return new Uint8Array(await res.arrayBuffer());

  const reader = res.body.getReader();
  const out = new Uint8Array(total);
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (received + value.length > out.length) {
      // Server sent more than announced — fall back to a growing buffer.
      const bigger = new Uint8Array(received + value.length);
      bigger.set(out.subarray(0, received));
      bigger.set(value, received);
      received += value.length;
      return bigger;
    }
    out.set(value, received);
    received += value.length;
    onProgress?.(received / total);
  }
  return received === total ? out : out.subarray(0, received);
}

function friendlyError(err) {
  const name = err?.name || "";
  if (name === "PasswordException") return "Ce PDF est protégé par un mot de passe et ne peut pas être affiché.";
  if (name === "InvalidPDFException") return "Ce fichier PDF est endommagé.";
  if (err?.httpStatus === 403 || err?.message === "expired") return "Le lien a expiré. Réessayez.";
  if (err?.message === "Failed to fetch" || name === "TypeError") return "Connexion impossible. Vérifiez votre réseau et réessayez.";
  return err?.message || "Ouverture impossible pour le moment.";
}

/** Repeated diagonal watermark, drawn into the page pixels. */
function drawWatermark(ctx, w, h, text) {
  if (!text) return;
  const fontSize = Math.max(12, Math.round(w / 30));
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#1a2846";
  ctx.font = `700 ${fontSize}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-Math.PI / 6);
  const stepX = ctx.measureText(text).width + fontSize * 3;
  const stepY = fontSize * 6;
  const reach = Math.hypot(w, h) / 2 + stepX;
  let row = 0;
  for (let y = -reach; y <= reach; y += stepY, row++) {
    const shift = row % 2 ? stepX / 2 : 0;
    for (let x = -reach - shift; x <= reach; x += stepX) ctx.fillText(text, x, y);
  }
  ctx.restore();
}

// =========================================================
// VIEWER
// =========================================================

export default function ProtectedPdfViewer({ docId, onCounted }) {
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState("opening"); // opening | downloading | ready | error
  const [loadPct, setLoadPct] = useState(0);
  const [error, setError] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [ratio, setRatio] = useState(Math.SQRT2); // page height / width (A4 until known)
  const [watermark, setWatermark] = useState("");
  const [zoom, setZoom] = useState(1);
  const [boxWidth, setBoxWidth] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const scrollRef = useRef(null);
  const pageEls = useRef([]);
  const startPageRef = useRef(1);
  const jumpedRef = useRef(false);

  const track = useRef({
    pending: new Set(), // pages seen, not yet recorded by the server
    sent: new Set(),
    activeSec: 0,
    counted: false,
    tracking: true,
    inFlight: false,
    numPages: 0,
    currentPage: 1,
    lastActivity: Date.now(),
    token: null,
  });
  const onCountedRef = useRef(onCounted);
  onCountedRef.current = onCounted;

  // ---- 1) Ask the server, download, parse ----
  useEffect(() => {
    let cancelled = false;
    let loadingTask = null;
    let doc = null;
    const ctrl = new AbortController();
    jumpedRef.current = false;
    setPhase("opening");
    setError(null);
    setLoadPct(0);
    setPdf(null);

    (async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Connecte-toi pour lire ce PDF.");
        track.current.token = token;
        const res = await fetch(`/api/pdfs/${docId}/open`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          signal: ctrl.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Ouverture impossible pour le moment.");
        if (cancelled) return;

        setWatermark(data.watermark || "Droussy TN");
        track.current.counted = !!data.counted;
        startPageRef.current = Math.max(1, Number(data.lastPage) || 1);
        setPhase("downloading");

        const [lib, bytes] = await Promise.all([
          loadPdfjs(),
          fetchBytes(data.url, (f) => !cancelled && setLoadPct(f), ctrl.signal),
        ]);
        if (cancelled) return;

        loadingTask = lib.getDocument({ data: bytes, isEvalSupported: false, enableXfa: false });
        doc = await loadingTask.promise;
        if (cancelled) return;

        const first = await doc.getPage(1);
        const vp = first.getViewport({ scale: 1 });
        if (cancelled) return;
        setRatio(vp.height / vp.width);
        setNumPages(doc.numPages);
        track.current.numPages = doc.numPages;
        setPdf(doc);
        setPhase("ready");
      } catch (err) {
        if (cancelled || err?.name === "AbortError") return;
        console.error("PDF viewer", err);
        setError(friendlyError(err));
        setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
      if (doc) doc.destroy();
      else loadingTask?.destroy?.();
    };
  }, [docId, attempt]);

  // ---- 2) Available width (follows rotation / resize) ----
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxWidth(el.clientWidth));
    ro.observe(el);
    setBoxWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const pageWidth = boxWidth ? Math.max(120, Math.round(Math.min(boxWidth - 2 * PAGE_GAP_PX, 900) * zoom)) : 0;

  // ---- 3) Reopen where the student stopped ----
  useEffect(() => {
    if (phase !== "ready" || !pageWidth || jumpedRef.current) return;
    jumpedRef.current = true;
    const target = Math.min(startPageRef.current, numPages);
    if (target > 1) {
      requestAnimationFrame(() => {
        const el = pageEls.current[target - 1];
        if (el && scrollRef.current) scrollRef.current.scrollTop = el.offsetTop - PAGE_GAP_PX;
      });
    }
  }, [phase, pageWidth, numPages]);

  // ---- 4) Current page indicator ----
  const updateCurrentPage = useCallback(() => {
    const box = scrollRef.current;
    if (!box || !numPages) return;
    const line = box.scrollTop + box.clientHeight * 0.35;
    let lo = 0;
    let hi = numPages - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if ((pageEls.current[mid]?.offsetTop ?? Infinity) <= line) lo = mid;
      else hi = mid - 1;
    }
    const page = lo + 1;
    track.current.currentPage = page;
    setCurrentPage((p) => (p === page ? p : page));
  }, [numPages]);

  const rafRef = useRef(0);
  function onScroll() {
    track.current.lastActivity = Date.now();
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      updateCurrentPage();
    });
  }

  // Keep the same page in view when zooming.
  function changeZoom(dir) {
    const i = ZOOM_LEVELS.indexOf(zoom);
    const next = ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, Math.max(0, i + dir))];
    if (next === zoom) return;
    const page = track.current.currentPage;
    setZoom(next);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const el = pageEls.current[page - 1];
        if (el && scrollRef.current) scrollRef.current.scrollTop = el.offsetTop - PAGE_GAP_PX;
      })
    );
  }

  // ---- 5) Reading tracking ----
  const onSeen = useCallback((num) => {
    const s = track.current;
    if (!s.sent.has(num)) s.pending.add(num);
  }, []);

  const sendProgress = useCallback(
    async (final = false) => {
      const s = track.current;
      if (!s.tracking || !s.numPages || (s.inFlight && !final)) return;
      if (s.counted && !final) return; // read already counted: only save the page on close
      const pages = [...s.pending].slice(0, 200);
      const activeSec = Math.floor(s.activeSec);
      if (!final && pages.length === 0 && activeSec < 1) return;

      s.activeSec -= activeSec;
      s.inFlight = true;
      try {
        const token = final ? s.token : (await auth.currentUser?.getIdToken()) || s.token;
        if (!token) throw new Error("no token");
        s.token = token;
        const res = await fetch(`/api/pdfs/${docId}/progress`, {
          method: "POST",
          keepalive: final,
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            pages: s.counted ? [] : pages,
            activeSec: s.counted ? 0 : activeSec,
            totalPages: s.numPages,
            currentPage: s.currentPage,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        if (data.tracking === false) {
          s.tracking = false;
          return;
        }
        (data.accepted || []).forEach((p) => {
          s.pending.delete(p);
          s.sent.add(p);
        });
        if (data.counted && !s.counted) {
          s.counted = true;
          onCountedRef.current?.();
        }
      } catch (err) {
        s.activeSec += activeSec; // retry with the next report
        if (!final) console.warn("PDF progress", err?.message || err);
      } finally {
        s.inFlight = false;
      }
    },
    [docId]
  );

  useEffect(() => {
    if (phase !== "ready") return;
    const s = track.current;
    s.lastActivity = Date.now();

    const markActive = () => {
      s.lastActivity = Date.now();
    };
    const tick = setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - s.lastActivity < IDLE_AFTER_MS) {
        s.activeSec += 1;
      }
    }, 1000);
    const beat = setInterval(() => sendProgress(false), PDF_HEARTBEAT_MS);
    const onVisibility = () => document.visibilityState === "hidden" && sendProgress(true);

    window.addEventListener("pointerdown", markActive, { passive: true });
    window.addEventListener("touchstart", markActive, { passive: true });
    window.addEventListener("keydown", markActive);
    window.addEventListener("wheel", markActive, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(tick);
      clearInterval(beat);
      window.removeEventListener("pointerdown", markActive);
      window.removeEventListener("touchstart", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("wheel", markActive);
      document.removeEventListener("visibilitychange", onVisibility);
      sendProgress(true); // closing the reader: save progress + current page
    };
  }, [phase, sendProgress]);

  // ---- 6) No save / print shortcuts while the reader is open ----
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("pdfv-lock");
    function onKey(e) {
      const k = (e.key || "").toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (k === "s" || k === "p")) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => {
      root.classList.remove("pdfv-lock");
      window.removeEventListener("keydown", onKey, true);
    };
  }, []);

  const block = (e) => e.preventDefault();
  const zoomIndex = ZOOM_LEVELS.indexOf(zoom);

  return (
    <div className="pdfv" onContextMenu={block} onDragStart={block}>
      <div className="pdfv-toolbar">
        <span className="pdfv-pageinfo" aria-live="polite">
          {phase === "ready" ? `Page ${currentPage} / ${numPages}` : "PDF"}
        </span>
        <div className="pdfv-zoom" role="group" aria-label="Zoom">
          <button
            type="button"
            className="pdfv-zoom-btn"
            onClick={() => changeZoom(-1)}
            disabled={phase !== "ready" || zoomIndex <= 0}
            aria-label="Réduire"
          >
            −
          </button>
          <span className="pdfv-zoom-value">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="pdfv-zoom-btn"
            onClick={() => changeZoom(1)}
            disabled={phase !== "ready" || zoomIndex >= ZOOM_LEVELS.length - 1}
            aria-label="Agrandir"
          >
            +
          </button>
        </div>
      </div>

      <div className="pdfv-scroll" ref={scrollRef} onScroll={onScroll}>
        {phase === "ready" && pdf && pageWidth > 0 ? (
          <div className="pdfv-pages" style={{ width: pageWidth + 2 * PAGE_GAP_PX }}>
            {Array.from({ length: numPages }, (_, i) => (
              <PdfPage
                key={i}
                pdf={pdf}
                num={i + 1}
                width={pageWidth}
                defaultRatio={ratio}
                watermark={watermark}
                scrollRef={scrollRef}
                onSeen={onSeen}
                setRef={(el) => (pageEls.current[i] = el)}
              />
            ))}
          </div>
        ) : phase === "error" ? (
          <div className="pdfv-msg">
            <p>⚠️ {error}</p>
            <button type="button" className="pdfv-retry" onClick={() => setAttempt((n) => n + 1)}>
              Réessayer
            </button>
          </div>
        ) : (
          <div className="pdfv-msg">
            <p>{phase === "downloading" ? "Chargement du PDF..." : "Ouverture du PDF..."}</p>
            <div className="pdfv-loadbar">
              <div
                className="pdfv-loadbar-fill"
                style={{ width: `${phase === "downloading" ? Math.max(4, Math.round(loadPct * 100)) : 2}%` }}
              />
            </div>
            {phase === "downloading" && loadPct > 0 && <p className="pdfv-msg-sub">{Math.round(loadPct * 100)}%</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================
// ONE PAGE — drawn only when near the screen, freed when far
// =========================================================

function PdfPage({ pdf, num, width, defaultRatio, watermark, scrollRef, onSeen, setRef }) {
  const wrapRef = useRef(null);
  const holderRef = useRef(null);
  const [ratio, setRatio] = useState(null);
  const [near, setNear] = useState(num <= 2);
  const [drawn, setDrawn] = useState(false);
  const height = Math.round(width * (ratio || defaultRatio));

  // Near the screen? (draw ahead ~2 screens, free pages far away)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      root: scrollRef.current,
      rootMargin: "200% 0px 200% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [scrollRef]);

  // Seen? Half the page visible (or the page fills half the screen) for 2 s.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !drawn) return;
    let timer = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        const rootH = entry.rootBounds?.height || 0;
        const enough =
          entry.isIntersecting &&
          (entry.intersectionRatio >= 0.5 || (rootH > 0 && entry.intersectionRect.height >= rootH * 0.5));
        if (enough && !timer) {
          timer = setTimeout(() => onSeen(num), PDF_PAGE_DWELL_MS);
        } else if (!enough && timer) {
          clearTimeout(timer);
          timer = null;
        }
      },
      { root: scrollRef.current, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    io.observe(el);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [drawn, num, onSeen, scrollRef]);

  // Draw (into a fresh canvas, swapped in when ready — no blank flash on zoom).
  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    if (!near || !width) {
      holder.replaceChildren(); // free the memory of far-away pages
      setDrawn(false);
      return;
    }
    let cancelled = false;
    let task = null;
    (async () => {
      const page = await pdf.getPage(num);
      if (cancelled) return;
      const base = page.getViewport({ scale: 1 });
      setRatio(base.height / base.width);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = Math.min(
        (width * dpr) / base.width,
        MAX_CANVAS_SIDE / base.width,
        MAX_CANVAS_SIDE / base.height,
        Math.sqrt(MAX_CANVAS_AREA / (base.width * base.height))
      );
      const vp = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      canvas.className = "pdfv-canvas";
      const ctx = canvas.getContext("2d", { alpha: false });
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      task = page.render({ canvasContext: ctx, viewport: vp });
      await task.promise;
      if (cancelled) return;
      drawWatermark(ctx, canvas.width, canvas.height, watermark);
      holder.replaceChildren(canvas);
      setDrawn(true);
    })().catch((err) => {
      if (!cancelled && err?.name !== "RenderingCancelledException") console.warn("PDF page", num, err);
    });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [pdf, num, width, near, watermark]);

  return (
    <div
      ref={(el) => {
        wrapRef.current = el;
        setRef(el);
      }}
      className="pdfv-page"
      style={{ width, height }}
    >
      <div ref={holderRef} className="pdfv-holder" />
      {!drawn && <span className="pdfv-page-loading">Page {num}</span>}
    </div>
  );
}