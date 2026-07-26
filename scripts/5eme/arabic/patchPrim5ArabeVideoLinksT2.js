// scripts/patchPrim5ArabeVideoLinksT2.js
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
  l7: [
    {
      title: "المفعول فيه: ظرف الزمان وظرف المكان — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=RS9lrhtIqkk",
    },
  ],
  l8: [
    {
      title: "الفعل المثال (الواوي): تصريفه في الماضي والمضارع والأمر — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=rxexGLV5K7U",
    },
  ],
  l9: [
    {
      title: "الحال والمفعول لأجله — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=mGmUoiGtSiw",
    },
  ],
  l10: [
    {
      title: "اسم الفاعل: صياغته من الفعل الصحيح والمهموز والمثال — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=js2B0a1HAX0",
    },
  ],
  l11: [
    {
      title: "اسم المفعول: صياغته من الفعل الصحيح والمهموز والمثال — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=LjA8pIIhA80",
    },
  ],
  l12: [
    {
      title: "رسم همزة الوسط وقاعدة قوة الحركات — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=DRUi3iL0zVQ",
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