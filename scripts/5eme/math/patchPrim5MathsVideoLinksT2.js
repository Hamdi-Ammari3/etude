// scripts/patchPrim5MathsVideoLinksT2.js
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
const SUBJECT_ID = "maths";

const VIDEO_LINKS = {
  l10: [
    {
      title: "التناسب الطردي — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=pSnM_fPyJX8",
    },
  ],
  l11: [
    {
      title: "الأعداد الكسرية: البسط والمقام — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=8mC15TizCb8",
    },
  ],
  l12: [
    {
      title: "وحدات قيس المساحة: المتر المربع وأجزاؤه ومضاعفاته — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=YU3-OYCdG70",
    },
  ],
  l13: [
    {
      title: "استخدام المنقلة، قياس الزوايا، رسم الزوايا (الصف الرابع الابتدائي — قريب من محتوى الخامسة)",
      url: "https://www.youtube.com/watch?v=GyHpYgpRmBs",
    },
  ],
  l14: [
    {
      title: "وحدات القيس الفلاحية: الهكتار والآر والسنتيار — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=EgmHOezqYbg",
    },
  ],
  l15: [
    {
      title: "تكوين الأعداد العشرية وكتابتها وقراءتها — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=CJchADrP47U",
    },
  ],
  l16: [
    {
      title: "الأعداد العشرية: حصر وترتيب — السنة الخامسة ابتدائي",
      url: "https://m.youtube.com/watch?v=kfzApp1j4Kc",
    },
  ],
  l17: [
    {
      title: "جمع وطرح الأعداد العشرية — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=qrnaiow66bw",
    },
  ],
  l18: [
    {
      title: "جمع وطرح الزمن: الساعات والدقائق — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=DqKR814qVxw",
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
  console.log(`  (l11, l12, l14, l15, l17, l18 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});