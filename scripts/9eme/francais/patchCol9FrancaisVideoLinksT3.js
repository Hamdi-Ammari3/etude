// scripts/patchCol9FrancaisVideoLinksT3.js
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

const GRADE_ID = "col-9";
const SUBJECT_ID = "francais";

const VIDEO_LINKS = {
  l24: [
    {
      title: "Résumé : « Riquet à la houppe » (Charles Perrault)",
      url: "https://www.youtube.com/watch?v=Lq2DrJhd25o",
    },
  ],
  l25: [
    {
      title: "L'expression du but : pour/pour que, afin de/afin que",
      url: "https://www.youtube.com/watch?v=OHX6ar-rNGc",
    },
  ],
  l26: [
    {
      title: "Le conditionnel présent et passé : synthèse",
      url: "https://www.youtube.com/watch?v=VN-3mVh-oxg",
    },
  ],
  l27: [
    {
      title: "Les adverbes en -ment et les homophones s'en/sans",
      url: "https://www.youtube.com/watch?v=3-UDtbTlR6A",
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
  console.log(`  (l25, l26, l27, l28, l29 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});