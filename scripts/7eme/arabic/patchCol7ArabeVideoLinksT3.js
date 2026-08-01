// scripts/patchCol7ArabeVideoLinksT3.js
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
const SUBJECT_ID = "arabe";

const VIDEO_LINKS = {
  l17: [
    {
      title: "الفعل المثال: تعريفه وأمثلته — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=ElHaDo9g6xc",
    },
  ],
  l18: [
    {
      title: "تصريف الفعل المثال في الماضي والمضارع والأمر — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=ElHaDo9g6xc",
    },
  ],
  l19: [
    {
      title: "الفعل الأجوف: تعريفه وأمثلته — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=l1h1rP5zmpg&t=19s",
    },
  ],
  l20: [
    {
      title: "تصريف الفعل الأجوف في الماضي والمضارع والأمر — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=l1h1rP5zmpg&t=19s",
    },
  ],
  l21: [
    {
      title: "اللفيف المفروق واللفيف المقرون — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=nhAgIFBAtiA",
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