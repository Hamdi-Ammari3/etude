// scripts/patchCol8AnglaisVideoLinksT2.js
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
  l9: [
    {
      title: "Chronological connectors: first, then, after that, later, finally",
      url: "https://www.youtube.com/watch?v=4AMptAmS_xM",
    },
  ],
  l10: [
    {
      title: "Past Continuous Tense for Kids | Past Progressive ESL",
      url: "https://www.youtube.com/watch?v=Rb_qdxmspeU",
    },
  ],
  l11: [
    {
      title: "Comparatives and superlatives: two-syllable adjectives, irregular forms, as...as",
      url: "https://www.youtube.com/watch?v=jz8Fy5qQXu8",
    },
  ],
  l12: [
    {
      title: "Recipe vocabulary and cooking instructions with the imperative",
      url: "https://www.youtube.com/watch?v=aHsgzHDnLyM",
    },
  ],
  l13: [
    {
      title: "Shopping vocabulary: prices, discounts, and negotiating",
      url: "https://www.youtube.com/watch?v=Z5Ty43EPYg4",
    },
  ],
  l14: [
    {
      title: "Introduction to the present perfect: have/has + past participle",
      url: "https://www.youtube.com/watch?v=553eeL1Dvho",
    },
  ],
  l15: [
    {
      title: "Adverbs of manner: forming and using -ly adverbs",
      url: "https://www.youtube.com/watch?v=cFTKMx738J4&t=138s",
    },
  ],
  l16: [
    {
      title: "Writing a short biography: birth, childhood, achievements, current situation",
      url: "https://www.youtube.com/watch?v=IUHP3fdBQJw",
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
  console.log(`  (l9, l11, l12, l13, l14, l15, l16 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});