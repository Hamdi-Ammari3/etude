// scripts/seedDatabase.js
require("dotenv").config();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);

// ---------------------------------------------------------------------------
// SOURCE DATA — edit this section as your real content grows.
// ---------------------------------------------------------------------------

const GRADES = [
  { id: "prim-4", levelId: "primaire", levelName: "Primaire", name: "4ème année", order: 4 },
  { id: "prim-5", levelId: "primaire", levelName: "Primaire", name: "5ème année", order: 5 },
  { id: "prim-6", levelId: "primaire", levelName: "Primaire", name: "6ème année", order: 6 },
  { id: "col-7", levelId: "college", levelName: "Collège", name: "7ème année", order: 7 },
  { id: "col-8", levelId: "college", levelName: "Collège", name: "8ème année", order: 8 },
  { id: "col-9", levelId: "college", levelName: "Collège", name: "9ème année", order: 9 },
];

const SUBJECTS = [
  { subjectId: "arabe", name: "Arabe", icon: "ع", order: 1 },
  { subjectId: "francais", name: "Français", icon: "Fr", order: 2 },
  { subjectId: "anglais", name: "Anglais", icon: "En", order: 3 },
  { subjectId: "maths", name: "Mathématiques", icon: "∑", order: 4 },
  { subjectId: "physique", name: "Physique", icon: "⚛", order: 5 },
];

// Placeholder — 3 lessons per subject (1 per trimestre). Replace titles/content
// with real curriculum as you author it; the seeding functions below don't care
// how many lessons exist, so you can freely add more later by re-running seedLessons.
const LESSONS_PER_SUBJECT = [
  { lessonId: "l1", title: "Leçon 1", trimestre: 1, order: 1 },
  { lessonId: "l2", title: "Leçon 2", trimestre: 2, order: 2 },
  { lessonId: "l3", title: "Leçon 3", trimestre: 3, order: 3 },
];

function placeholderContent(title) {
  return {
    summary: `Cette leçon couvre les notions essentielles de "${title}". Elle pose les bases nécessaires pour aborder les exercices et le test qui suivent.`,
    keyPoints: [
      "Comprendre la définition et le vocabulaire de base",
      "Savoir appliquer la méthode sur un exemple simple",
      "Identifier les pièges les plus courants",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: `Question facile sur ${title}`,
        options: ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
        answer: 0,
        explanation: "Explication de la bonne réponse.",
      },
      {
        difficulty: "moyen",
        question: `Question moyenne sur ${title}`,
        options: ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
        answer: 1,
        explanation: "Explication de la bonne réponse.",
      },
      {
        difficulty: "difficile",
        question: `Question difficile sur ${title}`,
        options: ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
        answer: 2,
        explanation: "Explication de la bonne réponse.",
      },
    ],
    quiz: [
      { question: `Test — question 1 sur ${title}`, options: ["A", "B", "C", "D"], answer: 0 },
      { question: `Test — question 2 sur ${title}`, options: ["A", "B", "C", "D"], answer: 1 },
      { question: `Test — question 3 sur ${title}`, options: ["A", "B", "C", "D"], answer: 2 },
      { question: `Test — question 4 sur ${title}`, options: ["A", "B", "C", "D"], answer: 0 },
      { question: `Test — question 5 sur ${title}`, options: ["A", "B", "C", "D"], answer: 3 },
    ],
  };
}

// ---------------------------------------------------------------------------
// SEED FUNCTIONS — one per collection, as requested.
// ---------------------------------------------------------------------------

async function seedGrades() {
  const batch = db.batch();
  for (const grade of GRADES) {
    const ref = db.collection("grades").doc(grade.id);
    batch.set(ref, {
      levelId: grade.levelId,
      levelName: grade.levelName,
      name: grade.name,
      order: grade.order,
    });
  }
  await batch.commit();
  console.log(`✔ seedGrades: wrote ${GRADES.length} grade docs`);
}

async function seedSubjects() {
  const batch = db.batch();
  let count = 0;

  for (const grade of GRADES) {
    for (const subject of SUBJECTS) {
      const docId = `${grade.id}_${subject.subjectId}`;
      const ref = db.collection("subjects").doc(docId);
      batch.set(ref, {
        gradeId: grade.id,
        subjectId: subject.subjectId,
        name: subject.name,
        icon: subject.icon,
        order: subject.order,
        lessonCount: LESSONS_PER_SUBJECT.length,
      });
      count++;
    }
  }

  await batch.commit();
  console.log(`✔ seedSubjects: wrote ${count} subject docs`);
}

async function seedLessons() {
  // Firestore batches cap at 500 writes; 6 grades × 5 subjects × 3 lessons = 90, safely under the limit.
  const batch = db.batch();
  let count = 0;

  for (const grade of GRADES) {
    for (const subject of SUBJECTS) {
      for (const lesson of LESSONS_PER_SUBJECT) {
        const docId = `${grade.id}_${subject.subjectId}_${lesson.lessonId}`;
        const ref = db.collection("lessons").doc(docId);
        batch.set(ref, {
          gradeId: grade.id,
          subjectId: subject.subjectId,
          lessonId: lesson.lessonId,
          title: lesson.title,
          trimestre: lesson.trimestre,
          order: lesson.order,
        });
        count++;
      }
    }
  }

  await batch.commit();
  console.log(`✔ seedLessons: wrote ${count} lesson docs`);
}

async function seedLessonContent() {
  const batch = db.batch();
  let count = 0;

  for (const grade of GRADES) {
    for (const subject of SUBJECTS) {
      for (const lesson of LESSONS_PER_SUBJECT) {
        const docId = `${grade.id}_${subject.subjectId}_${lesson.lessonId}`;
        const ref = db.collection("lessonContent").doc(docId);
        batch.set(ref, placeholderContent(lesson.title));
        count++;
      }
    }
  }

  await batch.commit();
  console.log(`✔ seedLessonContent: wrote ${count} lessonContent docs`);
}

// ---------------------------------------------------------------------------
// RUN — order matters: grades → subjects → lessons → lessonContent
// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding Droussy TN database...\n");
  await seedGrades();
  await seedSubjects();
  await seedLessons();
  await seedLessonContent();
  console.log("\nDone. Total docs written: grades + subjects + lessons + lessonContent.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});