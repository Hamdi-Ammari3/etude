// SERVER-ONLY helpers shared by the video API routes.

// ⚠️ Adjust this single import if your Admin SDK initialisation file lives
// elsewhere. It only needs to initialise the default firebase-admin app.
import "./firebaseAdmin";

import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getBunnyVideo, mapBunnyVideoStatus, deleteBunnyVideo } from "./bunny";
import { REQUIRE_REVIEW, MIN_DURATION_SEC, VIDEO_STATUS } from "./videoConfig";

// Collection that holds user profiles with a `role` field.
const USERS_COLLECTION = "users";

export const adminDb = () => getFirestore();
export const adminAuth = () => getAuth();
export { FieldValue };

export function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status });
}

/**
 * Verifies the Firebase ID token in "Authorization: Bearer <token>".
 * Returns { uid, role, name } or throws a Response.
 */
export async function requireUser(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw jsonError("Non authentifié.", 401);

  let decoded;
  try {
    decoded = await adminAuth().verifyIdToken(match[1]);
  } catch {
    throw jsonError("Session expirée. Reconnectez-vous.", 401);
  }

  // Prefer a custom claim if your login route sets one; otherwise read the profile doc.
  let role = decoded.role || null;
  let name = decoded.name || "";
  if (!role || !name) {
    const snap = await adminDb().collection(USERS_COLLECTION).doc(decoded.uid).get();
    const data = snap.exists ? snap.data() : {};
    role = role || data.role || null;
    name = name || data.name || "";
  }

  return { uid: decoded.uid, role, name };
}

export async function requireTeacher(request) {
  const user = await requireUser(request);
  if (user.role !== "teacher") throw jsonError("Réservé aux enseignants.", 403);
  return user;
}

const ABANDON_AFTER_MS = 24 * 60 * 60 * 1000;

/**
 * Pulls the latest state of a video from Bunny and moves our Firestore doc
 * forward in its lifecycle. Never moves a video backwards and never touches
 * a video an admin already published or rejected.
 *
 * Used by the Bunny webhook AND by the dashboard's status polling (useful in
 * local dev, where Bunny can't reach your localhost webhook).
 */
export async function syncVideoFromBunny(docRef, current) {
  const ourStatus = current.status;

  // PDFs don't live on Bunny Stream: their status is set by /api/pdfs/complete.
  // Only expire an upload that never finished.
  if (current.type === "pdf") {
    const createdMs = current.createdAt?.toMillis?.() || 0;
    if (ourStatus === VIDEO_STATUS.UPLOADING && createdMs && Date.now() - createdMs > ABANDON_AFTER_MS) {
      await docRef.update({
        status: VIDEO_STATUS.FAILED,
        failureReason: "upload_never_finished_24h",
        failedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return { status: VIDEO_STATUS.FAILED, durationSec: 0, changed: true };
    }
    return { status: ourStatus, durationSec: 0, changed: false };
  }
  if (![VIDEO_STATUS.UPLOADING, VIDEO_STATUS.ENCODING].includes(ourStatus)) {
    return { status: ourStatus, durationSec: current.durationSec || 0, changed: false };
  }

  let bunny;
  try {
    bunny = await getBunnyVideo(current.bunnyVideoId);
  } catch (err) {
    if (err.status === 404) {
      await docRef.update({
        status: VIDEO_STATUS.FAILED,
        failureReason: "bunny_video_not_found",
        failedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return { status: VIDEO_STATUS.FAILED, durationSec: 0, changed: true };
    }
    throw err;
  }

  const mapped = mapBunnyVideoStatus(bunny.status);
  const durationSec = Math.round(bunny.length || current.durationSec || 0);
  const createdAtMs = current.createdAt?.toMillis?.() || 0;
  const update = { updatedAt: FieldValue.serverTimestamp(), encodeProgress: bunny.encodeProgress ?? null };
  let next = ourStatus;

  if (mapped === "ready") {
    if (durationSec > 0 && durationSec < MIN_DURATION_SEC) {
      next = VIDEO_STATUS.REJECTED;
      update.rejectionReason = "too_short";
    } else {
      next = REQUIRE_REVIEW ? VIDEO_STATUS.PENDING : VIDEO_STATUS.PUBLISHED;
      if (next === VIDEO_STATUS.PUBLISHED) update.publishedAt = FieldValue.serverTimestamp();
    }
    update.durationSec = durationSec;
    update.encodedAt = FieldValue.serverTimestamp();
  } else if (mapped === "failed") {
    next = VIDEO_STATUS.FAILED;
    // 5 = Bunny could not encode the file, 6 = upload failed on Bunny's side.
    update.failureReason = `bunny_status_${bunny.status}${bunny.status === 5 ? "_encoding_error" : "_upload_failed"}`;
    update.failedAt = FieldValue.serverTimestamp();
    update.bunnyStorageSize = bunny.storageSize ?? null;
  } else if (mapped === "encoding") {
    next = VIDEO_STATUS.ENCODING;
    if (durationSec > 0) update.durationSec = durationSec;
  } else if (mapped === "uploading" && createdAtMs && Date.now() - createdAtMs > ABANDON_AFTER_MS) {
    // Nothing was ever uploaded — clean up the empty Bunny object.
    next = VIDEO_STATUS.FAILED;
    update.failureReason = "upload_never_finished_24h";
    update.failedAt = FieldValue.serverTimestamp();
    await deleteBunnyVideo(current.bunnyVideoId).catch(() => {});
  }

  const changed = next !== ourStatus || update.durationSec !== undefined;
  if (changed) {
    update.status = next;
    await docRef.update(update);
  }
  return { status: next, durationSec: update.durationSec ?? current.durationSec ?? 0, changed };
}