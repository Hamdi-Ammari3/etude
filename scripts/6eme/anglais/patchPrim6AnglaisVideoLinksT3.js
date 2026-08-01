// scripts/patchPrim6AnglaisVideoLinksT3.js
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

const VIDEO_LINKS = {
  l17: [
    {
      title: "Adverbs of Frequency for kids | Grammar in English",
      url: "https://www.youtube.com/watch?v=y1l7OTgbC7Y",
    },
  ],
  l18: [
    {
      title: "Superlatives | Superlative Adjectives | English for Kids | Grammar for Kids",
      url: "https://www.youtube.com/watch?v=orLwiZBVoyA",
    },
  ],
  l19: [
    {
      title: "Writing a self-introduction paragraph: name, family, hobbies",
      url: "https://www.youtube.com/watch?v=2r2pYz3kD-k",
    },
  ],
  l20: [
    {
      title: "Reading comprehension strategy: characters, setting, and events in a short story",
      url: "https://www.youtube.com/watch?v=1M0pFLXegG0",
    },
  ],
  l21: [
    {
      title: "Travel and holiday vocabulary: suitcase, ticket, passport, hotel",
      url: "https://www.youtube.com/watch?v=KUOFZQw9dGg",
    },
  ],
  l22: [
    {
      title: "Question tags: aren't you? / isn't she? / don't they?",
      url: "https://www.youtube.com/watch?v=JuAnvVADyLc",
    },
  ],
  l23: [
    {
      title: "Tense review: present simple, present continuous, past simple, future",
      url: "https://www.youtube.com/watch?v=zgSX40Q5sOM",
    },
  ],
};

async function patchVideoLinks() {
  const batch = db.batch();
  let count = 0;

  for (const [lessonId, videoLinks] of Object.entries(VIDEO_LINKS)) {
    const docId = `${GRADE_ID}_${SUBJECT_ID}_${lessonId}`;
    const ref = db.collection("lessonContent").doc(docId);
    batch.set(ref, { videoLinks }, { merge: true });
    count++;
  }

  await batch.commit();
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 3)`);
  console.log(`  (l19, l20, l21, l22, l23, l24 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});