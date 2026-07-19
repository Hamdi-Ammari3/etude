// scripts/seedCol7Anglais.js
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

const GRADE_ID = "col-7";
const SUBJECT_ID = "anglais";

// The official Tunisian 7ème année (collège) English textbook is confirmed
// to be "Enjoy Your English", organized in Modules and Sections. l7 (Module
// 2, Section 3: Welcome to Tunisia) is a confirmed real unit title sourced
// from a YouTube lesson explainer following the official program. The
// remaining lessons are reconstructed using standard beginner-collège English
// progression, mapped onto the confirmed Module structure (6 modules total,
// ~4 lessons per module) — not individually verified against the textbook's
// table of contents. Recommend teacher review before treating as final.
const LESSONS = [
  { title: "Module 1: Introducing myself and my classmates", trimestre: 1 },
  { title: "Module 1: My school and my timetable", trimestre: 1 },
  { title: "Module 1: Countries and nationalities", trimestre: 1 },
  { title: "Module 1: The verb 'to be' and simple present (review)", trimestre: 1 },
  { title: "Module 2: My family and my home", trimestre: 1 },
  { title: "Module 2: Describing people (appearance and personality)", trimestre: 1 },
  { title: "Module 2, Section 3: Welcome to Tunisia", trimestre: 1 },
  { title: "Module 2: Tunisian cities and landmarks", trimestre: 1 },

  { title: "Module 3: Daily routines and free time", trimestre: 2 },
  { title: "Module 3: Telling the time and making plans", trimestre: 2 },
  { title: "Module 3: Present simple vs. present continuous", trimestre: 2 },
  { title: "Module 3: Food, meals, and shopping", trimestre: 2 },
  { title: "Module 4: Animals and habitats", trimestre: 2 },
  { title: "Module 4: The past simple: regular and irregular verbs", trimestre: 2 },
  { title: "Module 4: Talking about a past holiday", trimestre: 2 },
  { title: "Module 4: Weather and seasons", trimestre: 2 },

  { title: "Module 5: Jobs and future plans (going to)", trimestre: 3 },
  { title: "Module 5: Comparatives and superlatives", trimestre: 3 },
  { title: "Module 5: Giving and following directions", trimestre: 3 },
  { title: "Module 6: Health and the body", trimestre: 3 },
  { title: "Module 6: Modal verbs (can, must, should)", trimestre: 3 },
  { title: "Module 6: Writing a short story", trimestre: 3 },
  { title: "Review: all grammar points of the year", trimestre: 3 },
  { title: "Exam preparation: reading, writing, and grammar", trimestre: 3 },
];

async function seedCol7Anglais() {
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
  console.log(`✔ seedCol7Anglais: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol7Anglais();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});