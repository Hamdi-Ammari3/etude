// SERVER-ONLY: data for the public teacher profile page (/enseignants/[id]).
// Read with the Admin SDK so the teacher's users doc never needs to be
// readable by the public — only the fields below leave the server.
//
// His documents are NOT loaded here any more: the page shows them with the
// same catalog as the home page (40 at a time, filters, search), limited to
// this teacher. Here we only count them for the stats line.

import { cache } from "react";
import { adminDb } from "./videoServer";

const digits8 = (v) => String(v || "").replace(/\D/g, "").slice(-8);

/** Count queries (1 read each) — never fails the page. */
async function countOf(query) {
  try {
    const snap = await query.count().get();
    return snap.data().count;
  } catch {
    return null;
  }
}

/** Sum of views without downloading the documents (Firestore sum aggregation). */
async function sumViews(query) {
  try {
    const { AggregateField } = await import("firebase-admin/firestore");
    if (!AggregateField?.sum) return null;
    const snap = await query.aggregate({ views: AggregateField.sum("views") }).get();
    return snap.data().views ?? 0;
  } catch {
    return null; // older firebase-admin: the stats line just hides the views
  }
}

/** { teacher, stats } or null when the id isn't a teacher. Cached per request. */
export const loadTeacherProfile = cache(async (id) => {
  if (!id || typeof id !== "string" || id.length > 128 || id.includes("/")) return null;
  const db = adminDb();

  const userSnap = await db.collection("users").doc(id).get();
  if (!userSnap.exists) return null;
  const u = userSnap.data();
  if (u.role !== "teacher") return null;

  const published = db.collection("videos").where("teacherId", "==", id).where("status", "==", "published");
  const [videos, pdfs, views] = await Promise.all([
    countOf(published.where("type", "==", "video")),
    countOf(published.where("type", "==", "pdf")),
    sumViews(published),
  ]);

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

  return { teacher, stats: { videos, pdfs, views } };
});