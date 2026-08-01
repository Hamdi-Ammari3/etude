// scripts/patchCol7MathsVideoLinksT3.js
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
const SUBJECT_ID = "maths";

const VIDEO_LINKS = {
  l17: [
    {
      title: "سابعة أساسي - قوى الأعداد الصحيحة الطبيعية - الجزء الأول",
      url: "https://www.youtube.com/watch?v=7UAyGGSbJwI",
    },
  ],
  l18: [
    {
      title: "الإحصاء: جداول، المدرج التكراري، والقطاعات الدائرية — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=c7ov27FEwgU",
    },
  ],
  l19: [
    {
      title: "متوازي المستطيلات — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=zdGuwrHExsU",
    },
  ],
  l20: [
    {
      title: "حجم متوازي المستطيلات وحجم المكعب — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=zdGuwrHExsU",
    },
  ],
  l21: [
    {
      title: "القواعد الأساسية لحل أي معادلة بسهولة",
      url: "https://www.youtube.com/watch?v=VwBdr5rNGM0",
    },
  ],
  l22: [
    {
      title: "التناظر المركزي: مركز التناظر وخصائصه — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=jhhRmcYnzMg",
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
  console.log(`  (l18, l19, l20, l22, l23, l24 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});