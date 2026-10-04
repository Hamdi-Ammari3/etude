// SERVER-ONLY: data for the public teacher profile page (/enseignants/[id]).
// Read with the Admin SDK so the teacher's users doc never needs to be
// readable by the public — only the fields below leave the server.

import { cache } from "react";
import { adminDb } from "./videoServer";

const MAX_ITEMS = 300;

const digits8 = (v) => String(v || "").replace(/\D/g, "").slice(-8);
const millis = (ts) => (ts?.toMillis ? ts.toMillis() : typeof ts === "number" ? ts : null);

// Only what the cards and viewers need — never storage keys or Bunny ids.
function publicItem(id, d) {
  return {
    id,
    type: d.type === "pdf" ? "pdf" : "video",
    status: d.status,
    title: d.title || "",
    teacherId: d.teacherId,
    teacherName: d.teacherName || "",
    gradeId: d.gradeId || null,
    gradeName: d.gradeName || "",
    specializationId: d.specializationId || null,
    specializationName: d.specializationName || null,
    subjectId: d.subjectId || null,
    subjectName: d.subjectName || "",
    subjectEmoji: d.subjectEmoji || null,
    durationSec: d.durationSec || 0,
    pageCount: d.pageCount || null,
    pdfCategory: d.pdfCategory || null,
    hasCorrection: !!d.hasCorrection,
    trimestre: d.trimestre || null,
    thumbnailUrl: d.thumbnailUrl || null,
    views: d.views || 0,
    publishedAt: millis(d.publishedAt) || millis(d.encodedAt) || millis(d.createdAt),
  };
}

/** { teacher, items } or null when the id isn't a teacher. Cached per request. */
export const loadTeacherProfile = cache(async (id) => {
  if (!id || typeof id !== "string" || id.length > 128 || id.includes("/")) return null;
  const db = adminDb();

  const userSnap = await db.collection("users").doc(id).get();
  if (!userSnap.exists) return null;
  const u = userSnap.data();
  if (u.role !== "teacher") return null;

  // Single-field query (no composite index needed); published filter in code.
  const itemsSnap = await db.collection("videos").where("teacherId", "==", id).limit(MAX_ITEMS * 2).get();
  const items = itemsSnap.docs
    .map((doc) => ({ doc, d: doc.data() }))
    .filter(({ d }) => d.status === "published")
    .map(({ doc, d }) => publicItem(doc.id, d))
    .sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0))
    .slice(0, MAX_ITEMS);

  const pub = u.publicProfile || {};
  const teacher = {
    id,
    name: u.name || "Enseignant",
    bio: pub.bio || "",
    address: pub.address || "",
    // Same default as the teacher's dashboard: his account phone until he sets a contact phone.
    phone: digits8(pub.contactPhone) || digits8(u.phone || u.phoneNumber),
    whatsapp: !!pub.whatsapp,
  };

  return { teacher, items };
});