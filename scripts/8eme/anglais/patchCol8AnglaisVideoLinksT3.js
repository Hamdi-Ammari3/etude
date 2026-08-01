// scripts/patchCol8AnglaisVideoLinksT3.js
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

const VIDEO_LINKS = {
  l17: [
    {
      title: "Will vs Be Going to — Future Tense Trick (English Grammar Lesson)",
      url: "https://www.youtube.com/watch?v=jGjgS6tBuXM",
    },
  ],
  l18: [
    {
      title: "Modal Verbs of Obligation (Elementary English): Have To and Must",
      url: "https://www.youtube.com/watch?v=2oumWdjA9hM",
    },
  ],
  l19: [
    {
      title: "Environment vocabulary: pollution, deforestation, recycling, solutions",
      url: "https://www.youtube.com/watch?v=vGLZC3XZFW8",
    },
  ],
  l20: [
    {
      title: "Expressing and justifying an opinion: I think... because..., in my opinion",
      url: "https://www.youtube.com/watch?v=6aUH1R6bIFE",
    },
  ],
  l21: [
    {
      title: "Reading informational texts: main idea and supporting details",
      url: "https://www.youtube.com/watch?v=LbO3lRXT0ww",
    },
  ],
  l22: [
    {
      title: "Formal vs informal letters: greetings, closings, and register",
      url: "https://www.youtube.com/watch?v=nwMI97hDTJk",
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