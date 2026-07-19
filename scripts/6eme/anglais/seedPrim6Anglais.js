// scripts/seedPrim6Anglais.js
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

const GRADE_ID = "prim-6";
const SUBJECT_ID = "anglais";

// l1-l3 are confirmed real Trimestre-1 topics sourced from i-learning.tn's
// annual program sidebar for السنة السادسة ابتدائي — الانقليزية (Unit 1:
// Entertaining myself — Let's have fun / My free time activities / A day
// out). Remaining lessons build on confirmed prim-5 anglais foundations with
// standard progression — not individually verified. This is the final
// primary year before collège; recommend teacher review before treating as
// final, given exam-year stakes. English remains outside the official
// Tunisian public primary curriculum (starts officially in 6ème année) but
// is offered here for private/early-English schools per the platform's goal.
const LESSONS = [
  { title: "Unit 1, Lesson 1: Let's have fun", trimestre: 1 },
  { title: "Unit 1, Lesson 2: My free time activities", trimestre: 1 },
  { title: "Unit 1, Lesson 3: A day out", trimestre: 1 },
  { title: "Review: present simple vs. present continuous", trimestre: 1 },
  { title: "Adjectives: describing feelings and opinions", trimestre: 1 },
  { title: "Question words review (who, what, where, when, why, how)", trimestre: 1 },
  { title: "Vocabulary: sports and games", trimestre: 1 },
  { title: "Simple past: regular verbs", trimestre: 1 },

  { title: "Simple past: irregular verbs", trimestre: 2 },
  { title: "My town and places in the city", trimestre: 2 },
  { title: "Giving simple instructions (imperative)", trimestre: 2 },
  { title: "Vocabulary: jobs and professions", trimestre: 2 },
  { title: "Modal verbs: can, must, should", trimestre: 2 },
  { title: "Making plans: going to vs. will", trimestre: 2 },
  { title: "Describing a process (first, then, next, finally)", trimestre: 2 },
  { title: "Vocabulary: technology and communication", trimestre: 2 },

  { title: "Adverbs of frequency (always, often, sometimes, never)", trimestre: 3 },
  { title: "Superlatives (the biggest, the most beautiful)", trimestre: 3 },
  { title: "Writing a short paragraph about myself", trimestre: 3 },
  { title: "Reading comprehension: short stories", trimestre: 3 },
  { title: "Vocabulary: travel and holidays", trimestre: 3 },
  { title: "Question tags (simple introduction)", trimestre: 3 },
  { title: "Review: all tenses studied", trimestre: 3 },
  { title: "Exam preparation: reading, writing, and grammar review", trimestre: 3 },
];

async function seedPrim6Anglais() {
  const batch = db.batch();

  LESSONS.forEach((lesson, index) => {
    const order = index + 1;
    const lessonId = `l${order}`;
    const docId = `${GRADE_ID}_${SUBJECT_ID}_${lessonId}`;
    const ref = db.collection("lessons").doc(docId);

    batch.set(ref, {
      gradeId: GRADE_ID,
      subjectId: SUBJECT_ID,
      lessonId,
      order,
      title: lesson.title,
      trimestre: lesson.trimestre,
    });
  });

  await batch.commit();
  console.log(`✔ seedPrim6Anglais: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim6Anglais();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});