import { collection, doc, getDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { DB } from "./firebaseConfig";

const cache = new Map();

async function cached(key, fetcher) {
  if (cache.has(key)) return cache.get(key);
  const value = await fetcher();
  cache.set(key, value);
  return value;
}

// Fetches ALL subjects across ALL grades in a single query, grouped by gradeId.
// Used on the home page so we can compute progress per grade without N+1 queries.
export async function getAllSubjectsByGrade() {
  return cached("all-subjects-by-grade", async () => {
    const snap = await getDocs(collection(DB, "subjects"));
    const byGrade = new Map();
    for (const d of snap.docs) {
      const s = { id: d.id, ...d.data() };
      if (!byGrade.has(s.gradeId)) byGrade.set(s.gradeId, []);
      byGrade.get(s.gradeId).push({ subjectId: s.subjectId, lessonCount: s.lessonCount });
    }
    return byGrade; // Map<gradeId, [{subjectId, lessonCount}, ...]>
  });
}

export async function getLevelsWithGrades() {
  return cached("levels-with-grades", async () => {
    const snap = await getDocs(query(collection(DB, "grades"), orderBy("order")));
    const grades = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const levelMap = new Map();
    for (const g of grades) {
      if (!levelMap.has(g.levelId)) {
        levelMap.set(g.levelId, { id: g.levelId, name: g.levelName, grades: [] });
      }
      levelMap.get(g.levelId).grades.push(g);
    }
    return Array.from(levelMap.values());
  });
}

export async function findGrade(gradeId) {
  return cached(`grade:${gradeId}`, async () => {
    const snap = await getDoc(doc(DB, "grades", gradeId));
    if (!snap.exists()) return null;
    const grade = { id: snap.id, ...snap.data() };
    return { level: { id: grade.levelId, name: grade.levelName }, grade };
  });
}

export async function findSubjectsForGrade(gradeId) {
  return cached(`subjects:${gradeId}`, async () => {
    const q = query(
      collection(DB, "subjects"),
      where("gradeId", "==", gradeId),
      orderBy("order")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  });
}

export async function findSubject(gradeId, subjectId) {
  const found = await findGrade(gradeId);
  if (!found) return null;
  const subjects = await findSubjectsForGrade(gradeId);
  const subject = subjects.find((s) => s.subjectId === subjectId);
  if (!subject) return null;
  return { ...found, subject };
}

// Lightweight — for the subject/lessons listing page. No exercises/quiz payload.
export async function findLessonsForSubject(gradeId, subjectId) {
  return cached(`lessons:${gradeId}:${subjectId}`, async () => {
    const q = query(
      collection(DB, "lessons"),
      where("gradeId", "==", gradeId),
      where("subjectId", "==", subjectId),
      orderBy("order")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  });
}

// Heavy — only called on the lesson detail page. Merges lessons + lessonContent docs.
export async function findLesson(gradeId, subjectId, lessonId) {
  const found = await findSubject(gradeId, subjectId);
  if (!found) return null;

  const docId = `${gradeId}_${subjectId}_${lessonId}`;

  const [lessonSnap, contentSnap] = await Promise.all([
    getDoc(doc(DB, "lessons", docId)),
    getDoc(doc(DB, "lessonContent", docId)),
  ]);

  if (!lessonSnap.exists()) return null;

  const lesson = {
    id: lessonId,
    ...lessonSnap.data(),
    ...(contentSnap.exists() ? contentSnap.data() : {}),
  };

  return { ...found, lesson };
}