// SERVER-ONLY. Bunny Storage through its S3-compatible API.
//
// Why S3 mode: it supports PRESIGNED URLs, so
//   - teachers upload the PDF straight from the browser to Bunny
//     (no file size limit from our own server/hosting), and
//   - students read it through a short-lived link,
// without the storage password ever reaching the browser.
//
// Bunny requires S3 compatibility to be switched on WHEN CREATING the
// storage zone (it can't be enabled later on an existing zone).
//
// Env:
//   BUNNY_STORAGE_ZONE      storage zone name   (= S3 access key id / bucket)
//   BUNNY_STORAGE_PASSWORD  storage zone password (= S3 secret key)
//   BUNNY_STORAGE_REGION    de | uk | se | ny | la | sg | jh | syd   (default: de, closest to Tunisia)

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let client = null;

export function storageConfig() {
  const zone = process.env.BUNNY_STORAGE_ZONE;
  const password = process.env.BUNNY_STORAGE_PASSWORD;
  const region = (process.env.BUNNY_STORAGE_REGION || "de").trim().toLowerCase();
  if (!zone || !password) throw new Error("Missing BUNNY_STORAGE_ZONE / BUNNY_STORAGE_PASSWORD");
  return { zone: zone.trim(), password: password.trim(), region };
}

function s3() {
  if (client) return client;
  const { zone, password, region } = storageConfig();
  client = new S3Client({
    region,
    endpoint: `https://${region}-s3.storage.bunnycdn.com`,
    forcePathStyle: true,
    credentials: { accessKeyId: zone, secretAccessKey: password },
    // Recent AWS SDKs add checksum parameters to presigned URLs by default;
    // a browser can't provide them, so only send checksums when required.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return client;
}

const bucket = () => storageConfig().zone;

export function pdfKeyFor(teacherUid, docId) {
  return `pdfs/${teacherUid}/${docId}.pdf`;
}

/** Short-lived URL the browser PUTs the file to (must send Content-Type: application/pdf). */
export async function presignPdfUpload(key, ttlSec = 3600) {
  return getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: "application/pdf" }),
    { expiresIn: ttlSec }
  );
}

/** Short-lived URL the protected viewer downloads the file from (never shown to the student). */
export async function presignPdfRead(key, ttlSec = 300) {
  return getSignedUrl(
    s3(),
    new GetObjectCommand({
      Bucket: bucket(),
      Key: key,
    }),
    { expiresIn: ttlSec }
  );
}

/** { size, contentType } or null if the object doesn't exist. */
export async function headObject(key) {
  try {
    const res = await s3().send(new HeadObjectCommand({ Bucket: bucket(), Key: key }));
    return { size: Number(res.ContentLength || 0), contentType: res.ContentType || "" };
  } catch (err) {
    if (err?.$metadata?.httpStatusCode === 404 || err?.name === "NotFound") return null;
    throw err;
  }
}

/** Reads the whole object (PDFs are small enough) as a Uint8Array. */
export async function getObjectBytes(key) {
  const res = await s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
  return new Uint8Array(await res.Body.transformToByteArray());
}

export async function deleteObject(key) {
  try {
    await s3().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
    return true;
  } catch (err) {
    if (err?.$metadata?.httpStatusCode === 404) return true;
    console.warn("Bunny Storage delete failed", key, err?.message || err);
    return false;
  }
}