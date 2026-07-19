// scripts/seedPrim4English.js
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

const GRADE_ID = "prim-4";
const SUBJECT_ID = "anglais";

// English is not part of the official Tunisian public curriculum until 6ème année
// primaire — it officially starts later. This lesson set is offered here because
// some private Tunisian schools and English-early programs teach it from 4ème
// année, per the platform's stated goal. Unlike maths/français, there is no
// official Tunisian public-school program to source or verify this against — this
// is a standard beginner-English-foundations sequence, not a sourced curriculum.
const LESSONS = [
  { title: "The alphabet (A-Z)", trimestre: 1 },
  { title: "Greetings: Hello, Hi, Goodbye", trimestre: 1 },
  { title: "Numbers 1-10", trimestre: 1 },
  { title: "Colors", trimestre: 1 },
  { title: "The verb 'to be': I am, you are, he/she is", trimestre: 1 },
  { title: "My family (mother, father, brother, sister)", trimestre: 1 },
  { title: "Classroom objects (pen, book, table, chair)", trimestre: 1 },
  { title: "Days of the week", trimestre: 1 },

  { title: "Numbers 11-20", trimestre: 2 },
  { title: "This is / These are", trimestre: 2 },
  { title: "Animals (cat, dog, bird, fish...)", trimestre: 2 },
  { title: "Parts of the body", trimestre: 2 },
  { title: "The verb 'to have': I have, you have, he/she has", trimestre: 2 },
  { title: "Food and drinks", trimestre: 2 },
  { title: "Months of the year", trimestre: 2 },
  { title: "What is your name? / How old are you?", trimestre: 2 },

  { title: "Adjectives: big, small, happy, sad", trimestre: 3 },
  { title: "My house (rooms and furniture)", trimestre: 3 },
  { title: "Weather: sunny, rainy, hot, cold", trimestre: 3 },
  { title: "Simple present: I like / I don't like", trimestre: 3 },
  { title: "Prepositions of place: in, on, under", trimestre: 3 },
  { title: "Telling the time (o'clock)", trimestre: 3 },
  { title: "My school (subjects and activities)", trimestre: 3 },
  { title: "Simple present: daily routine (wake up, eat, sleep)", trimestre: 3 },
];

async function seedPrim4English() {
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
  console.log(`✔ seedPrim4English: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim4English();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});