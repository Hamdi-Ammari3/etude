// scripts/patchCol7PhysiqueVideoLinksT3.js
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
const SUBJECT_ID = "physique";

const VIDEO_LINKS = {
  l13: [
    {
      title: "التيار الكهربائي: مفهومه ومصادره",
      url: "https://www.youtube.com/watch?v=w5x9kydy9OM",
    },
  ],
  l14: [
    {
      title: "مكونات الدارة الكهربائية البسيطة",
      url: "https://www.youtube.com/watch?v=RLJOt7hLao8",
    },
  ],
  l15: [
    {
      title: "الدارة الكهربائية المغلقة والمفتوحة",
      url: "https://www.youtube.com/watch?v=RLJOt7hLao8",
    },
  ],
  l16: [
    {
      title: "المواد الموصلة والعازلة للكهرباء",
      url: "https://www.youtube.com/watch?v=xQsg0j5YQP8",
    },
  ],
  l17: [
    {
      title: "المغانط: خصائصها وتطبيقاتها (البوصلة، أبواب الثلاجة)",
      url: "https://www.youtube.com/watch?v=fTnHL6WPzxQ",
    },
  ],
  l18: [
    {
      title: "أقطاب المغناطيس: التجاذب والتنافر",
      url: "https://www.youtube.com/watch?v=VSfiaRlPhU8",
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