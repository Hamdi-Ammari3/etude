// scripts/patchPrim5AnglaisVideoLinksT2.js
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
  l9: [
    {
      title: "My daily routine - My day - Learn English for kids",
      url: "https://www.youtube.com/watch?v=zzdz7mDW0eI",
    },
  ],
  l10: [
    {
      title: "Learn Quarter Past, Quarter To & Half Past for Kids! | Hi Friends!",
      url: "https://www.youtube.com/watch?v=5mNuKKPrSsY",
    },
  ],
  l11: [
    {
      title: "My Sweet Home",
      url: "https://www.youtube.com/watch?v=aEM9d_8_i0k",
    },
  ],
  l12: [
    {
      title: "In, On, Under",
      url: "https://www.youtube.com/watch?v=fhe7vQjQBxM",
    },
  ],
  l13: [
    {
      title: "Breakfast lunch dinner Im hungry",
      url: "https://www.youtube.com/watch?v=EIVIRgueIiA",
    },
  ],
  l14: [
    {
      title: "How much is it",
      url: "https://www.youtube.com/watch?v=I9YYtue3_Cs",
    },
  ],
  l15: [
    {
      title: "THE FOREST",
      url: "https://www.youtube.com/watch?v=_ajWIEzRJnw",
    },
  ],
  l16: [
    {
      title: "Present Continuous | An Easy English Grammar Lesson",
      url: "https://www.youtube.com/watch?v=QqxdZzOorAU",
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
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 2)`);
  console.log(`  (l11, l12, l13, l14, l15 have empty url — no video found yet)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});