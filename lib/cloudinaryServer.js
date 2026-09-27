// SERVER-ONLY. Signs direct browser → Cloudinary uploads so the API secret
// never reaches the browser.

import crypto from "crypto";

export function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET");
  }
  return { cloudName, apiKey, apiSecret };
}

export function thumbnailFolderFor(uid) {
  return `droussy/thumbnails/${uid}`;
}

/**
 * Cloudinary signature: sha1 of the upload params sorted alphabetically,
 * joined as "key=value&key=value", followed by the API secret.
 * (file, api_key, cloud_name and resource_type are never signed.)
 */
export function signCloudinaryParams(params) {
  const { apiSecret } = cloudinaryConfig();
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/** Deletes an uploaded image (best effort — never throws). */
export async function destroyCloudinaryImage(publicId) {
  if (!publicId) return false;
  try {
    const { cloudName, apiKey } = cloudinaryConfig();
    const params = { public_id: publicId, timestamp: Math.floor(Date.now() / 1000), invalidate: "true" };
    const body = new URLSearchParams({ ...params, api_key: apiKey, signature: signCloudinaryParams(params) });
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    return data.result === "ok" || data.result === "not found";
  } catch (err) {
    console.warn("Cloudinary destroy failed", publicId, err);
    return false;
  }
}

/**
 * Upload parameters for a video thumbnail:
 * - converted to WebP on upload (smaller files, faster pages)
 * - resized down to max 1280×720, quality auto
 * - stored in droussy/thumbnails/<teacherUid>/
 */
export function buildThumbnailUploadParams(uid) {
  const { cloudName, apiKey } = cloudinaryConfig();
  const params = {
    folder: thumbnailFolderFor(uid),
    format: "webp",
    timestamp: Math.floor(Date.now() / 1000),
    transformation: "c_limit,w_1280,h_720,q_auto",
  };
  return {
    cloudName,
    apiKey,
    ...params,
    signature: signCloudinaryParams(params),
  };
}