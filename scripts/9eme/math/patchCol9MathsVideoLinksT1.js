// scripts/patchCol9MathsVideoLinksT1.js
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
const SUBJECT_ID = "maths";

const VIDEO_LINKS = {
  l1: [
    {
      title: "العمليات في مجموعة الأعداد الحقيقية",
      url: "https://www.youtube.com/watch?v=L2NKZe3TGYQ",
    },
  ],
  l2: [
    {
      title: "مجموعة الأعداد الحقيقية",
      url: "https://www.youtube.com/watch?v=J_zSpH_OTBc",
    },
  ],
  l3: [
    {
      title: "الجمع والطرح في مجموعة الأعداد الحقيقية",
      url: "https://www.youtube.com/watch?v=Xiwzqzq95Hs",
    },
  ],
  l4: [
    {
      title: "القوة في مجموعة الأعداد الحقيقية",
      url: "https://www.youtube.com/watch?v=a2_SBGCfUME",
    },
  ],
  l5: [
    {
      title: "الترتيب والمقاربة في مجموعة الأعداد الحقيقية",
      url: "https://www.youtube.com/watch?v=lXl4ZM_GaVo",
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
  console.log(`  (l5 has a title but empty url — check the Tadris.TN تاسعة أساسي playlist)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});