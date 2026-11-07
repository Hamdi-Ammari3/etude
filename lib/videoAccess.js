// Who can open a document. Shared by the catalog (to show 🔒 or ▶) and the
// API routes (the real enforcement).
//
// New rule: an active subscription opens EVERY document (all grades, all
// subjects), up to 1000 different documents per subscription — see
// lib/subscription.js. The 1000 limit itself is enforced when a document is
// opened (lib/subscriptionServer.js → claimDocAccess).

import { subscriptionStatus, isFreeAccess } from "./subscription";
import { isOpenDoc } from "./openDocs";

/**
 * Grades linked to the student's account (old per-grade purchases, or his own grade).
 * No longer used for access — only to open the catalog on his level by default.
 */
export function getAccessibleGradeIds(user) {
  const ids = new Set();
  if (!user) return ids;

  if (Array.isArray(user.purchasedGrades)) {
    user.purchasedGrades.forEach((g) => g && ids.add(String(g)));
  }
  if (user.gradeId) ids.add(String(user.gradeId));

  return ids;
}

/**
 * Open (free) published document → everyone, even without an account (user = null).
 * Otherwise: published document + active subscription (or the teacher's own document / admin).
 */
export function canWatchVideo(user, video) {
  if (!video) return false;
  if (isOpenDoc(video)) return true;
  if (!user) return false;
  if (isFreeAccess(user, video)) return true;
  if (video.status !== "published") return false;
  return subscriptionStatus(user).active;
}