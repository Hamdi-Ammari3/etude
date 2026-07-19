// scripts/seedPrim5Anglais.js
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

const GRADE_ID = "prim-5";
const SUBJECT_ID = "anglais";

// English is not part of the official Tunisian public curriculum at primary
// level (starts officially in 6ème année) — offered here per the platform's
// stated goal for private/early-English schools. l1-l3 are confirmed real
// Trimestre-1 topics sourced from i-learning.tn's annual program sidebar for
// السنة الخامسة ابتدائي — الانقليزية (Unit 1: Introducing others — Meet my
// family / Meet my neighbours / Meet my teacher). Remaining lessons build on
// prim-4 anglais foundations with standard progression — not individually
// verified. Recommend teacher review before treating as final.
const LESSONS = [
  { title: "Unit 1, Lesson 1: Meet my family", trimestre: 1 },
  { title: "Unit 1, Lesson 2: Meet my neighbours", trimestre: 1 },
  { title: "Unit 1, Lesson 3: Meet my teacher", trimestre: 1 },
  { title: "Review: numbers 1-20 and the verb 'to be'", trimestre: 1 },
  { title: "Describing people: tall/short, young/old", trimestre: 1 },
  { title: "Plural nouns (regular and simple irregular)", trimestre: 1 },
  { title: "Possessive 's (my brother's book)", trimestre: 1 },
  { title: "Days, months, and asking about dates", trimestre: 1 },

  { title: "My daily routine (simple present)", trimestre: 2 },
  { title: "Telling the time (half past, quarter to)", trimestre: 2 },
  { title: "Rooms and furniture in the house", trimestre: 2 },
  { title: "Prepositions of place (in, on, under, next to)", trimestre: 2 },
  { title: "Food and mealtimes", trimestre: 2 },
  { title: "Shopping: asking for prices", trimestre: 2 },
  { title: "Animals and their habitats", trimestre: 2 },
  { title: "Present continuous: what I am doing now", trimestre: 2 },

  { title: "Weather and seasons", trimestre: 3 },
  { title: "Clothes and what people wear", trimestre: 3 },
  { title: "Comparatives (bigger, smaller, faster)", trimestre: 3 },
  { title: "Simple future: going to", trimestre: 3 },
  { title: "Hobbies and free time activities", trimestre: 3 },
  { title: "Asking and giving directions", trimestre: 3 },
  { title: "Feelings and emotions", trimestre: 3 },
  { title: "Review: putting it all together (short dialogues)", trimestre: 3 },
];

async function seedPrim5Anglais() {
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
  console.log(`✔ seedPrim5Anglais: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim5Anglais();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});