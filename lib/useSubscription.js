"use client";

// Reads the logged-in user's subscription (users/{uid}) for the counters and
// 🔒 badges. The server re-checks everything when a document is opened.

import { useCallback, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { DB } from "./firebaseConfig";
import { subscriptionStatus } from "./subscription";

export function useSubscription(user) {
  const uid = user?.uid || null;
  const [status, setStatus] = useState(null); // null = loading / logged out
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!uid) {
      setStatus(null);
      return;
    }
    let cancelled = false;
    getDoc(doc(DB, "users", uid))
      .then((snap) => !cancelled && setStatus(subscriptionStatus(snap.exists() ? snap.data() : {})))
      .catch((err) => {
        console.warn("Subscription read failed", err);
        // Fall back on what the session already knows (still checked by the server).
        if (!cancelled) setStatus(subscriptionStatus(user || {}));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, tick]);

  const refresh = useCallback(() => setTick((n) => n + 1), []);
  return { status, refresh };
}

/**
 * Asks the server whether this document can be opened now (and counts it).
 * → { ok: true } or { ok: false, code: "none" | "expired" | "inactive" | "quota" }.
 * Network / server errors give { ok: true }: the player or PDF reader checks again.
 */
export async function claimAccess(docId) {
  try {
    const { auth } = await import("./firebaseConfig");
    const token = await auth.currentUser?.getIdToken();
    if (!token) return { ok: true };
    const res = await fetch("/api/access/claim", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ docId }),
    });
    if (res.status === 403) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, code: data.code || "none" };
    }
  } catch {
    /* fall through */
  }
  return { ok: true };
}