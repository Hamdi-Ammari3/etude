// scripts/patchCol7ArabeVideoLinksT2.js
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
  l9: [
    {
      title: "الحلقة 7: النواسخ الفعلية والنواسخ الحرفية (إنّ وأخواتها - كان وأخواتها)",
      url: "https://www.youtube.com/watch?v=J9VedQsy3Wg",
    },
  ],
  l12: [
    {
      title: "تصريف الفعل المجرد السالم — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=tWqglJ3zsOg",
    },
  ],
  l13: [
    {
      title: "تصريف الفعل المجرد المهموز — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=5cfhku5M7So",
    },
  ],
  l14: [
    {
      title: "تصريف الفعل المجرد المضاعف — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=IhvdetQu73Q",
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
  console.log(`  (l12, l13, l14, l15, l16 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});