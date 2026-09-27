"use client";

// Bunny iframe player + real-watch tracking.
// Measures which 10-second chunks were ACTUALLY played (seeking forward
// doesn't count) and reports them to /api/videos/{id}/heartbeat. The server
// decides when a view counts (50% of distinct chunks, once per student).

import { useEffect, useRef } from "react";
import { auth } from "../../lib/firebaseConfig";
import { CHUNK_SEC, CHUNK_PLAYED_RATIO, HEARTBEAT_MS } from "../../lib/videoConfig";

const PLAYERJS_SRC = "https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js";
const MAX_NORMAL_DELTA = 1.5; // bigger jumps between two timeupdates = a seek, not playback
const POSITION_ONLY_MS = 60000; // after the view is counted, only save position every minute

let playerJsPromise = null;
function loadPlayerJs() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.playerjs) return Promise.resolve(window.playerjs);
  if (!playerJsPromise) {
    playerJsPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = PLAYERJS_SRC;
      s.async = true;
      s.onload = () => (window.playerjs ? resolve(window.playerjs) : reject(new Error("playerjs missing")));
      s.onerror = () => {
        playerJsPromise = null;
        reject(new Error("playerjs failed to load"));
      };
      document.head.appendChild(s);
    });
  }
  return playerJsPromise;
}

export default function TrackedVideoPlayer({ videoId, embedUrl, title, onCounted }) {
  const iframeRef = useRef(null);

  // Tracking state lives in refs: it changes several times per second and
  // must not re-render the player.
  const t = useRef({
    lastTime: null,
    duration: 0,
    position: 0,
    playedPerChunk: new Map(), // chunk index → seconds actually played
    pending: new Set(), // completed chunks not yet acknowledged by the server
    sent: new Set(), // chunks the server already recorded
    counted: false,
    lastSentAt: 0,
    lastSentPosition: -1,
    inFlight: false,
    token: null,
  });

  const onCountedRef = useRef(onCounted);
  onCountedRef.current = onCounted;

  useEffect(() => {
    const state = t.current;
    let player = null;
    let disposed = false;
    let interval = null;

    // Reset for this video.
    Object.assign(state, {
      lastTime: null,
      duration: 0,
      position: 0,
      playedPerChunk: new Map(),
      pending: new Set(),
      sent: new Set(),
      counted: false,
      lastSentAt: 0,
      lastSentPosition: -1,
      inFlight: false,
    });

    async function refreshToken() {
      try {
        state.token = (await auth.currentUser?.getIdToken()) || state.token;
      } catch {
        /* keep previous token */
      }
      return state.token;
    }

    function chunkNeed(index) {
      const d = state.duration || 0;
      const len = d > 0 ? Math.min(CHUNK_SEC, d - index * CHUNK_SEC) : CHUNK_SEC;
      return Math.max(1, len * CHUNK_PLAYED_RATIO);
    }

    function onTimeUpdate(data) {
      const seconds = Number(data?.seconds);
      if (!Number.isFinite(seconds)) return;
      if (Number(data?.duration) > 0) state.duration = Number(data.duration);
      state.position = seconds;

      const prev = state.lastTime;
      state.lastTime = seconds;
      if (prev == null || state.counted) return;

      const delta = seconds - prev;
      if (delta <= 0 || delta > MAX_NORMAL_DELTA) return; // paused, rewound or seeked

      const chunk = Math.floor(prev / CHUNK_SEC);
      if (state.sent.has(chunk) || state.pending.has(chunk)) return;
      const played = (state.playedPerChunk.get(chunk) || 0) + delta;
      state.playedPerChunk.set(chunk, played);
      if (played >= chunkNeed(chunk)) state.pending.add(chunk);
    }

    async function sendHeartbeat({ keepalive = false, force = false } = {}) {
      if (state.inFlight && !keepalive) return;
      const now = Date.now();
      const hasChunks = !state.counted && state.pending.size > 0;
      const positionChanged = Math.abs(state.position - state.lastSentPosition) >= 5;
      const positionDue = now - state.lastSentAt >= (state.counted ? POSITION_ONLY_MS : HEARTBEAT_MS);

      if (!force && !hasChunks && !(positionChanged && positionDue)) return;
      if (!state.token && !keepalive) await refreshToken();
      if (!state.token) return;

      const chunks = hasChunks ? [...state.pending] : [];
      const body = JSON.stringify({ chunks, position: Math.round(state.position) });
      state.lastSentAt = now;
      state.lastSentPosition = state.position;

      if (keepalive) {
        // Page closing: fire and forget, can't read the answer.
        fetch(`/api/videos/${videoId}/heartbeat`, {
          method: "POST",
          keepalive: true,
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${state.token}` },
          body,
        }).catch(() => {});
        return;
      }

      state.inFlight = true;
      try {
        const res = await fetch(`/api/videos/${videoId}/heartbeat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${state.token}` },
          body,
        });
        if (res.status === 401) {
          await refreshToken();
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return;

        (data.accepted || []).forEach((c) => {
          state.pending.delete(c);
          state.sent.add(c);
          state.playedPerChunk.delete(c);
        });
        if (data.counted && !state.counted) {
          state.counted = true;
          state.pending.clear();
          if (data.justCounted) onCountedRef.current?.();
        }
        if (data.tracking === false) state.counted = true; // nothing to measure (e.g. teacher preview)
      } catch {
        /* network hiccup: pending chunks are kept and re-sent next time */
      } finally {
        state.inFlight = false;
      }
    }

    function flushOnHide() {
      if (document.visibilityState === "hidden") sendHeartbeat({ keepalive: true, force: true });
    }

    refreshToken();

    loadPlayerJs()
      .then((playerjs) => {
        if (disposed || !iframeRef.current) return;
        player = new playerjs.Player(iframeRef.current);
        player.on("ready", () => {
          if (disposed) return;
          player.on("timeupdate", onTimeUpdate);
          player.on("seeked", () => {
            state.lastTime = null;
          });
          player.on("pause", () => {
            state.lastTime = null;
            sendHeartbeat({ force: true });
          });
          player.on("ended", () => {
            state.lastTime = null;
            sendHeartbeat({ force: true });
          });
        });
      })
      .catch((err) => console.warn("Suivi de lecture indisponible", err));

    interval = setInterval(() => {
      refreshToken();
      sendHeartbeat();
    }, HEARTBEAT_MS);

    document.addEventListener("visibilitychange", flushOnHide);
    window.addEventListener("pagehide", flushOnHide);

    return () => {
      disposed = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", flushOnHide);
      window.removeEventListener("pagehide", flushOnHide);
      // Modal closed: send what's left.
      sendHeartbeat({ keepalive: true, force: true });
      try {
        player?.off?.("timeupdate");
      } catch {
        /* ignore */
      }
    };
  }, [videoId, embedUrl]);

  return (
    <iframe
      ref={iframeRef}
      src={embedUrl}
      title={title}
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
    />
  );
}