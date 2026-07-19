"use client";

import { doc, setDoc } from "firebase/firestore";
import { DB } from "./firebaseConfig";

const LOCAL_KEY = "droussy-guest-progress";

// --- Guest (not logged in) progress, kept only in this browser ---
export function getLocalProgress() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalProgress(progress) {
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(progress));
}

export function clearLocalProgress() {
  window.localStorage.removeItem(LOCAL_KEY);
}

export async function mergeLocalProgressIntoAccount(uid) {
  const local = getLocalProgress();
  if (!local || Object.keys(local).length === 0) return;
  await setDoc(doc(DB, "users", uid), { progress: local }, { merge: true });
  clearLocalProgress();
}

export async function updateLessonProgress(uid, gradeId, subjectId, lessonId, patch) {
  const nestedUpdate = {
    progress: {
      [gradeId]: {
        [subjectId]: {
          [lessonId]: patch,
        },
      },
    },
  };
  await setDoc(doc(DB, "users", uid), nestedUpdate, { merge: true });
}

export function lessonCompletion(lp) {
  if (!lp) return 0;
  let done = 0;
  const total = 5;
  if (lp.summaryRead) done++;
  if (lp.exercises?.facile) done++;
  if (lp.exercises?.moyen) done++;
  if (lp.exercises?.difficile) done++;
  if (lp.quizTotal && (lp.quizScore ?? 0) / lp.quizTotal >= 0.6) done++;
  return done / total;
}

// lessonCount comes from subjects/{gradeId_subjectId}.lessonCount — no curriculum fetch needed.
export function subjectProgress(progress, gradeId, subjectId, lessonCount) {
  if (!lessonCount) return 0;
  const lessonsMap = progress?.[gradeId]?.[subjectId] || {};
  const sum = Object.values(lessonsMap).reduce((acc, lp) => acc + lessonCompletion(lp), 0);
  return sum / lessonCount;
}

// subjects = [{ subjectId, lessonCount }, ...] — pass the subjects you already fetched for the grade page.
export function gradeProgress(progress, gradeId, subjects) {
  if (!subjects || subjects.length === 0) return 0;
  const sum = subjects.reduce(
    (acc, s) => acc + subjectProgress(progress, gradeId, s.subjectId, s.lessonCount),
    0
  );
  return sum / subjects.length;
}