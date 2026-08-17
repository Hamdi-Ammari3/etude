// scripts/patchCol9MathsVideoLinksT3.js
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
  l11: [
    {
      title: "مبرهنة طالس وتطبيقاتها",
      url: "https://www.youtube.com/watch?v=6i4T6wJpoWM",
    },
  ],
  l12: [
    {
      title: "نظرية بيتاغور",
      url: "https://www.youtube.com/watch?v=iB1z2vLiEao",
    },
    {
      title: "نظرية بيتاغور",
      url: "https://www.youtube.com/watch?v=3EzcDbtF2J0",
    },
  ],
  l13: [
    {
      title: "أنشطة حول الرباعيات",
      url: "https://www.youtube.com/watch?v=s_To1Q9NAsg",
    },
  ],
  l14: [
    {
      title: "التعامد في الفضاء",
      url: "https://www.youtube.com/watch?v=sQQWz9jBI0U",
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
  console.log(`  (l13, l14 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});