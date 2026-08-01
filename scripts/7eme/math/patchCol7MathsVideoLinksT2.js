// scripts/patchCol7MathsVideoLinksT2.js
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
  l9: [
    {
      title: "الأعداد الصحيحة النسبية: التمثيل على خط الأعداد والقيمة المطلقة — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=gwiGjNnutmU",
    },
  ],
  l11: [
    {
      title: "التناسب وجدول التناسب ومعامل التناسب — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=wTBjz9J6-E0",
    },
  ],
  l12: [
    {
      title: "النسبة المئوية والسلم (مقياس الرسم) — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=Ba2oOIcUMq4",
    },
  ],
  l13: [
    {
      title: "الدائرة: نصف القطر، القطر، والمحيط — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=wGXuMqudT98",
    },
  ],
  l14: [
    {
      title: "بناء المثلثات وشرط إمكانية البناء — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=NSJ8LIjfQpI",
    },
  ],
  l15: [
    {
      title: "الأشكال الرباعية الخاصة: متوازي الأضلاع، المستطيل، المربع، المعين، شبه المنحرف — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=pZGONNLs4O4",
    },
  ],
  l16: [
    {
      title: "مساحات الأشكال: المستطيل، المربع، المثلث، متوازي الأضلاع — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=cK5tUjK-Lho",
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
  console.log(`  (all 8 lessons have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});