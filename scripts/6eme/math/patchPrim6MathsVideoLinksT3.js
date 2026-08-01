// scripts/patchPrim6MathsVideoLinksT3.js
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
const SUBJECT_ID = "maths";

const VIDEO_LINKS = {
  l21: [
    {
      title: "معدل السرعة والمسافة والزمن: الحل بالقواعد وبالتناسب",
      url: "https://www.youtube.com/watch?v=zmN83zdPH5M",
    },
  ],
  l22: [
    {
      title: "الجمع والطرح والضرب في الأعداد الكسرية",
      url: "https://www.youtube.com/watch?v=fyXmyBIjVt4",
    },
  ],
  l23: [
    {
      title: "مساحة شكل مركب من عدة أشكال هندسية",
      url: "https://www.youtube.com/watch?v=gDdzuxErImU",
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
  console.log(`  (l22, l23 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});