// scripts/patchPrim5AnglaisVideoLinksT3.js
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
  l17: [
    {
      title: "The weather for kids | Learn vocabulary in English",
      url: "https://www.youtube.com/watch?v=sn6GLgaTY0M",
    },
  ],
  l18: [
    {
      title: "Clothes Vocabulary",
      url: "https://www.youtube.com/watch?v=upLd2zxY2mo",
    },
  ],
  l19: [
    {
      title: "Comparative adjectives for kids - English Grammar For Kids",
      channel: "Novakid",
      url: "https://www.youtube.com/watch?v=Qortcs1yoV4",
    },
  ],
  l20: [
    {
      title: "Going to + Infinitive",
      url: "https://www.youtube.com/watch?v=Sc5CV5VzMqk",
    },
  ],
  l21: [
    {
      title: "Hobbies and Interests - What do you like doing? - Kids vocabulary",
      channel: "English Singsing",
      url: "https://www.youtube.com/watch?v=N1o4oOXLOZc",
    },
  ],
  l22: [
    {
      title: "Where - Where is it",
      url: "https://www.youtube.com/watch?v=jWY6N9QXmEY",
    },
  ],
  l23: [
    {
      title: "How Do You Feel",
      url: "https://www.youtube.com/watch?v=BXWNhq-lPD8",
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
  console.log(`  (l18, l20, l22, l23, l24 have empty url — no video found yet)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});