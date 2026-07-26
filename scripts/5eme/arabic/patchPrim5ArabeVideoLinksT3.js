// scripts/patchPrim5ArabeVideoLinksT3.js
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
const SUBJECT_ID = "arabe";

const VIDEO_LINKS = {
  l13: [
    {
      title: "الجملة الاسمية: المبتدأ والخبر (خبر مفرد وخبر شبه جملة) — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=57nnHYnYOas",
    },
  ],
  l14: [
    {
      title: "الفعل الأجوف: تصريفه في الماضي والمضارع (قال، باع، نام) — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=l1h1rP5zmpg",
    },
  ],
  l15: [
    {
      title: "النواسخ الفعلية والحرفية: كان وأخواتها، إنّ وأخواتها — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=evbAyPgYkIk&t=18s",
    },
  ],
  l16: [
    {
      title: "إنّ وأخواتها: التوكيد، الاستدراك، التشبيه، التمني، الترجي — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=gbcwDeT-f8o",
    },
  ],
  l17: [
    {
      title: "الفعل الأجوف في المضارع المجزوم والأمر — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=hBdVB2qgT3s",
    },
  ],
  l18: [
    {
      title: "رسم همزة آخر الكلمة — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=TemdKSvbkcs",
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
  console.log(`  (all 6 lessons have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});