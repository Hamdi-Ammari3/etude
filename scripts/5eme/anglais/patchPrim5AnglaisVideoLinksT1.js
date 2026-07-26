// scripts/patchPrim5AnglaisVideoLinksT1.js
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

const VIDEO_LINKS = {
  l1: [
    {
      title: "Learn Family Members in English",
      url: "https://www.youtube.com/watch?v=24GWC1dDyUM",
    },
  ],
  l2: [
    {
      title: "Explore My Neighborhood",
      url: "https://www.youtube.com/watch?v=iHsCGwOBNrs",
    },
  ],
  l3: [
    {
      title: "Welcome to School",
      url: "https://www.youtube.com/watch?v=2i4CbCINjWA",
    },
  ],
  l4: [
    {
      title: "Number song 1-20 for children",
      url: "https://www.youtube.com/watch?v=D0Ajq682yrA",
    },
  ],
  l5: [
    {
      title: "Adjectives Words for Kids",
      url: "https://www.youtube.com/watch?v=sEDy0wGaXJY",
    },
  ],
  l6: [
    {
      title: "Irregular Plural Nouns — Spelling and Grammar for Kids (Superlexia, Episode 10)",
      url: "https://www.youtube.com/watch?v=uQwlDUAQY6g",
    },
  ],
  l7: [
    {
      title: "POSSESSIVES ",
      url: "https://www.youtube.com/watch?v=8ZHBKDRBeao",
    },
  ],
  l8: [
    {
      title: "Ordinal Numbers in English 1-31 (and What is the date today?)",
      url: "https://www.youtube.com/watch?v=P99hKDjb9Xs",
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
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1)`);
  console.log(`  (l2, l3, l4, l5, l7 have empty url — no video found yet)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});