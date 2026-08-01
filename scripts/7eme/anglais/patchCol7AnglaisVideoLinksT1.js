// scripts/patchCol7AnglaisVideoLinksT1.js
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

const VIDEO_LINKS = {
  l1: [
    {
      title: "Introducing Yourself in English and Meeting New People",
      url: "https://www.youtube.com/watch?v=XBxz8_Ri8-Y",
    },
  ],
  l2: [
    {
      title: "School subjects, timetable, and days of the week vocabulary",
      url: "https://www.youtube.com/watch?v=AnZxeX_8mVk&t=1s",
    },
  ],
  l3: [
    {
      title: "Countries & Nationalities: Where are you from? — Beginner English for ESL Teens (A1)",
      url: "https://www.youtube.com/watch?v=0i4qB00nDFY",
    },
  ],
  l4: [
    {
      title: "Review: verb 'to be' and present simple for habits",
      url: "https://www.youtube.com/watch?v=z34JmFecgV0",
    },
  ],
  l5: [
    {
      title: "Extended family and house vocabulary: there is / there are",
      url: "https://www.youtube.com/watch?v=gYyfun8e2eQ",
    },
  ],
  l6: [
    {
      title: "Describing physical appearance and personality adjectives",
      url: "https://www.youtube.com/watch?v=w9wI5ZvZn6g",
    },
  ],
  l7: [
    {
      title: "Presenting Tunisia: geography, cities, and culture",
      url: "https://www.youtube.com/watch?v=7liuxc5-Ufk",
    },
  ],
  l8: [
    {
      title: "Tunisian cities and monuments: making recommendations (you should visit...)",
      url: "https://www.youtube.com/watch?v=7liuxc5-Ufk",
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
  console.log(`  (l2, l4, l5, l6, l7, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});