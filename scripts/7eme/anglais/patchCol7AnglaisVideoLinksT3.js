// scripts/patchCol7AnglaisVideoLinksT3.js
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
  l17: [
    {
      title: "Jobs vocabulary and 'going to' for future plans: What are you going to do?",
      url: "https://www.youtube.com/watch?v=R69YKFmlcnA",
    },
  ],
  l18: [
    {
      title: "Comparative adjectives for kids - English Grammar For Kids",
      channel: "Novakid",
      url: "https://www.youtube.com/watch?v=Qortcs1yoV4",
    },
  ],
  l19: [
    {
      title: "Teaching Directions: Turn Left / Right / Go Straight — Funny ESL Tutorial",
      url: "https://www.youtube.com/watch?v=DPYJQSA-x50",
    },
  ],
  l20: [
    {
      title: "body parts",
      url: "https://www.youtube.com/watch?v=W1aR3h_RQ94",
    },
    {
      title: "Health vocabulary I have a headache, I don't feel well",
      url: "https://www.youtube.com/watch?v=2mQ-weZKJRE",
    },
  ],
  l21: [
    {
      title: "Modal Verbs in English for Kids | Can, Could, May, Might, Must, Should",
      url: "https://www.youtube.com/watch?v=udmQXJn5ZyA",
    },
  ],
  l22: [
    {
      title: "Writing a short story: past simple, chronological connectors, descriptive vocabulary",
      url: "https://www.youtube.com/watch?v=WDg85KdxFHU",
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
  console.log(`  (l17, l20, l22, l23, l24 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});