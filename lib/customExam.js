import { randomUUID } from "crypto";
import { adminDB } from "./firebaseAdmin";

const EXAMS_COLLECTION = "customExams";
const EXAM_CONTENT_COLLECTION = "customExamContent";

// Generates a fresh exam id. Using a UUID (rather than Firestore's
// auto-id) keeps the id predictable/portable and easy to log alongside
// usage stats, without depending on any particular doc reference shape.
export function generateExamId() {
  return randomUUID();
}

// Creates both the metadata doc and the content doc for a freshly
// generated exam, in a single batch so they can never end up
// out of sync (one written without the other).
//
// meta: { uid, gradeId, subjectId, lessonIds, title, totalPoints,
//         durationMinutes, difficulty, model, usage }
// content: { sections: [...] }   // already validated by validateExamShape
export async function saveCustomExam({ examId, meta, content }) {
  const batch = adminDB.batch();

  const examRef = adminDB.collection(EXAMS_COLLECTION).doc(examId);
  const contentRef = adminDB.collection(EXAM_CONTENT_COLLECTION).doc(examId);

  batch.set(examRef, {
    ...meta,
    status: "ready",
    createdAt: new Date().toISOString(),
  });

  batch.set(contentRef, content);

  await batch.commit();
  return examId;
}

// Fetches an exam's metadata + content together. Returns null if either
// piece is missing (treated as "not found" rather than a partial result,
// since the two docs should always exist together thanks to the batched
// write above).
export async function findCustomExam(examId) {
  const [examSnap, contentSnap] = await Promise.all([
    adminDB.collection(EXAMS_COLLECTION).doc(examId).get(),
    adminDB.collection(EXAM_CONTENT_COLLECTION).doc(examId).get(),
  ]);

  if (!examSnap.exists || !contentSnap.exists) {
    return null;
  }

  return {
    id: examId,
    ...examSnap.data(),
    sections: contentSnap.data().sections,
  };
}

// Ownership check — used by the [examId] page/route to make sure a user
// can only view exams they generated themselves.
export function isExamOwnedBy(exam, uid) {
  return !!exam && exam.uid === uid;
}

// --- Daily/monthly generation-count tracking, used by the API route for
// rate limiting before calling OpenAI at all. ---

// Returns a "YYYY-MM" key for the current month, used to bucket the
// generation counter without needing a separate cleanup job — old
// month keys just sit unused in the doc and cost nothing meaningful.
function currentMonthKey(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

// Reads how many exams this user has generated in the current month.
export async function getMonthlyGenerationCount(uid) {
  const userRef = adminDB.collection("users").doc(uid);
  const snap = await userRef.get();
  if (!snap.exists) return 0;

  const data = snap.data();
  const monthKey = currentMonthKey();
  const counter = data.customExamUsage?.[monthKey];
  return counter || 0;
}

// Increments this user's generation count for the current month.
// Uses a Firestore transaction to avoid a race condition if the user
// somehow fires two generation requests at nearly the same time.
export async function incrementMonthlyGenerationCount(uid) {
  const userRef = adminDB.collection("users").doc(uid);
  const monthKey = currentMonthKey();

  await adminDB.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const data = snap.exists ? snap.data() : {};
    const usage = data.customExamUsage || {};
    const current = usage[monthKey] || 0;

    tx.set(
      userRef,
      { customExamUsage: { ...usage, [monthKey]: current + 1 } },
      { merge: true }
    );
  });
}

// --- Lightweight logging for cost monitoring, per the plan discussed
// earlier — one doc per generation call, cheap to write, easy to query
// later ("sum of total_tokens this week", etc.) ---

export async function logGenerationUsage({ examId, uid, gradeId, subjectId, model, usage, valid }) {
  await adminDB.collection("customExamLogs").add({
    examId,
    uid,
    gradeId,
    subjectId,
    model,
    valid,
    promptTokens: usage?.prompt_tokens ?? null,
    completionTokens: usage?.completion_tokens ?? null,
    totalTokens: usage?.total_tokens ?? null,
    createdAt: new Date().toISOString(),
  });
}