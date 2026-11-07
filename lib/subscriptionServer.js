// SERVER-ONLY: counts the documents a student opens against his subscription.

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { DOC_QUOTA, LEGACY_CYCLE, SUBSCRIPTION_MONTHS, subscriptionStatus, isFreeAccess, accessDeniedMessage } from "./subscription";
import { isOpenDoc } from "./openDocs";

/**
 * Called when a student opens a video or a PDF (play / open routes).
 * In ONE transaction:
 *   - already opened in this subscription → allowed, not counted again;
 *   - new document and quota left       → allowed, used +1;
 *   - quota reached / no subscription    → refused.
 *
 * Returns { ok: true, counted, used, quota } or { ok: false, state, message, used, quota }.
 */
export async function claimDocAccess(db, user, doc, docId) {
  if (isFreeAccess(user, doc)) return { ok: true, counted: false, free: true, used: null, quota: null };
  // Open (free) documents never use the subscription's limit.
  if (isOpenDoc(doc)) return { ok: true, counted: false, free: true, used: null, quota: null };

  const userRef = db.collection("users").doc(user.uid);

  return db.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
    const profile = userSnap.exists ? userSnap.data() : {};
    const st = subscriptionStatus(profile);

    if (!st.active) {
      return { ok: false, state: st.state, message: accessDeniedMessage(st.state), used: st.used, quota: st.quota };
    }

    const openedRef = userRef.collection("openedDocs").doc(`${st.cycleId}_${docId}`);
    const opened = await tx.get(openedRef);
    if (opened.exists) {
      return { ok: true, counted: false, used: st.used, quota: st.quota };
    }

    if (st.used >= st.quota) {
      return { ok: false, state: "quota", message: accessDeniedMessage("quota"), used: st.used, quota: st.quota };
    }

    tx.set(openedRef, {
      docId,
      cycleId: st.cycleId,
      type: doc.type === "pdf" ? "pdf" : "video",
      title: doc.title || "",
      openedAt: FieldValue.serverTimestamp(),
    });

    // Students who bought a grade before the switch get a real subscription
    // object on first open — with an end date, so their access expires too.
    const endsAt = new Date();
    endsAt.setMonth(endsAt.getMonth() + SUBSCRIPTION_MONTHS);
    const subscriptionUpdate = st.legacy
      ? {
          active: true,
          cycleId: LEGACY_CYCLE,
          quota: DOC_QUOTA,
          used: FieldValue.increment(1),
          startedAt: FieldValue.serverTimestamp(),
          endsAt: Timestamp.fromDate(endsAt),
        }
      : { used: FieldValue.increment(1), lastOpenedAt: FieldValue.serverTimestamp() };
    tx.set(userRef, { subscription: subscriptionUpdate }, { merge: true });

    return { ok: true, counted: true, used: st.used + 1, quota: st.quota };
  });
}