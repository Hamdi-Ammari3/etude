// SERVER-ONLY: keeps every teacher between 1 and 3 open (free) documents.
// See lib/openDocs.js for the rules.

import { FieldValue } from "firebase-admin/firestore";
import {
  OPEN_DOCS_MIN,
  OPEN_DOCS_MAX,
  OPEN_DOC_ALIVE_STATUSES,
  OPEN_DOC_TOGGLE_STATUSES,
  OPEN_DOC_MESSAGES,
} from "./openDocs";

// Teacher's open documents — two equality filters, no composite index needed.
function openDocsQuery(db, teacherId) {
  return db.collection("videos").where("teacherId", "==", teacherId).where("isOpen", "==", true);
}

const isAlive = (data) => OPEN_DOC_ALIVE_STATUSES.includes(data?.status);

/** How many open documents the teacher has (uploading → published). Works inside a transaction too. */
export async function countOpenDocs(db, teacherId, tx = null) {
  const q = openDocsQuery(db, teacherId);
  const snap = tx ? await tx.get(q) : await q.get();
  return snap.docs.filter((d) => isAlive(d.data())).length;
}

/** Used when a teacher submits a new document: open if he has none yet. */
export async function shouldOpenNewDoc(db, teacherId) {
  try {
    return (await countOpenDocs(db, teacherId)) === 0;
  } catch (err) {
    console.error("countOpenDocs failed", teacherId, err);
    return false;
  }
}

/**
 * Teacher switches one of HIS documents to open (true) or paid (false).
 * One transaction: the 1–3 rule can't be bypassed with two clicks at once.
 * → { ok: true, isOpen, openCount } or { ok: false, status, error }
 */
export async function setDocOpen(db, teacherId, docId, open) {
  const ref = db.collection("videos").doc(docId);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : null;
    if (!data || data.teacherId !== teacherId || data.status === "deleted") {
      return { ok: false, status: 404, error: "Document introuvable." };
    }

    const openSnap = await tx.get(openDocsQuery(db, teacherId));
    const openIds = openSnap.docs.filter((d) => isAlive(d.data())).map((d) => d.id);
    const already = data.isOpen === true;

    if (open === already) return { ok: true, isOpen: already, openCount: openIds.length };

    if (open) {
      if (!OPEN_DOC_TOGGLE_STATUSES.includes(data.status)) {
        return { ok: false, status: 409, error: OPEN_DOC_MESSAGES.status };
      }
      if (openIds.length >= OPEN_DOCS_MAX) return { ok: false, status: 409, error: OPEN_DOC_MESSAGES.max };
    } else if (openIds.filter((id) => id !== docId).length < OPEN_DOCS_MIN) {
      return { ok: false, status: 409, error: OPEN_DOC_MESSAGES.min };
    }

    tx.update(ref, {
      isOpen: open,
      openChangedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const openCount = open ? openIds.length + 1 : openIds.length - 1;
    return { ok: true, isOpen: open, openCount };
  });
}

const createdMs = (d) => d.data().createdAt?.toMillis?.() || 0;

/**
 * After the teacher's open document disappears (deleted, failed, rejected):
 * if he has no open document left, his OLDEST published document becomes open
 * (or the oldest pending one if nothing is published yet).
 * Returns the id of the document made open, or null.
 */
export async function ensureOpenDoc(db, teacherId) {
  if (!teacherId) return null;
  if ((await countOpenDocs(db, teacherId)) >= OPEN_DOCS_MIN) return null;

  const snap = await db
    .collection("videos")
    .where("teacherId", "==", teacherId)
    .where("status", "in", ["published", "pending"])
    .get();
  if (snap.empty) return null;

  const byAge = [...snap.docs].sort((a, b) => createdMs(a) - createdMs(b));
  const pick = byAge.find((d) => d.data().status === "published") || byAge[0];

  await pick.ref.update({
    isOpen: true,
    openChangedAt: FieldValue.serverTimestamp(),
    openAutoReason: "replacement",
    updatedAt: FieldValue.serverTimestamp(),
  });
  return pick.id;
}