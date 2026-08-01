// scripts/patchPrim6ArabeVideoLinksT2.js
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
const SUBJECT_ID = "arabe";

const VIDEO_LINKS = {
  l7: [
    {
      title: "المصدر من الفعل الثلاثي المزيد وأوزانه — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=9Ao8G_EVpZE",
    },
  ],
  l8: [
    {
      title: "درس المفعول المطلق وأنواعه — الصف السادس الابتدائي (⚠️ منهج مصري، تحقق قبل الاستعمال)",
      url: "https://www.youtube.com/watch?v=FYdCFU43dPY",
    },
  ],
  l9: [
    {
      title: "رسم همزة آخر الكلمة — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=WeF_7WR_X80",
    },
  ],
  l10: [
    {
      title: "اسم الفاعل واسم المفعول من الفعل الثلاثي — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=js2B0a1HAX0&t=13s",
    },
  ],
  l11: [
    {
      title: "رسم همزة الوسط وقاعدة قوة الحركات — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=GbbxfGYgZ8g",
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
  console.log(`  (l7, l9, l10, l11 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});