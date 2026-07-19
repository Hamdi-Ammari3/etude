// scripts/seedCol8Anglais.js
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

const GRADE_ID = "col-8";
const SUBJECT_ID = "anglais";

// l5 (Means of transport in English) is a confirmed real topic sourced from
// Tadris.TN's video library for السنة الثامنة أساسي — أنقليزية. The
// remaining lessons are reconstructed using standard progression, building
// on confirmed col-7 anglais topics (present simple/continuous, past
// simple, comparatives, going to, modals). Recommend teacher review before
// treating as final.
const LESSONS = [
  { title: "Describing my school and daily schedule", trimestre: 1 },
  { title: "Present simple and present continuous (review and consolidation)", trimestre: 1 },
  { title: "Adjectives: physical appearance and personality (deeper vocabulary)", trimestre: 1 },
  { title: "Countries, nationalities, and cultures", trimestre: 1 },
  { title: "Means of transport in English", trimestre: 1 },
  { title: "Prepositions of movement (to, into, through, across)", trimestre: 1 },
  { title: "Asking for and giving personal information (forms and interviews)", trimestre: 1 },
  { title: "Simple past: irregular verbs (review and expansion)", trimestre: 1 },

  { title: "Telling a story: sequencing events in the past", trimestre: 2 },
  { title: "Past continuous: actions in progress in the past", trimestre: 2 },
  { title: "Comparatives and superlatives (deeper practice)", trimestre: 2 },
  { title: "Food, recipes, and giving simple instructions", trimestre: 2 },
  { title: "Shopping and money: prices and bargaining", trimestre: 2 },
  { title: "Present perfect: introduction (have/has + past participle)", trimestre: 2 },
  { title: "Adverbs of manner", trimestre: 2 },
  { title: "Writing a short biography", trimestre: 2 },

  { title: "Future plans: will vs. going to (review and contrast)", trimestre: 3 },
  { title: "Modal verbs: obligation and permission (must, have to, can, may)", trimestre: 3 },
  { title: "Environment and nature vocabulary", trimestre: 3 },
  { title: "Giving opinions and reasons (I think... because...)", trimestre: 3 },
  { title: "Reading comprehension: informational texts", trimestre: 3 },
  { title: "Writing a formal and an informal letter", trimestre: 3 },
  { title: "Review: all grammar points of the year", trimestre: 3 },
  { title: "Exam preparation: reading, writing, and grammar", trimestre: 3 },
];

async function seedCol8Anglais() {
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
  console.log(`✔ seedCol8Anglais: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol8Anglais();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});