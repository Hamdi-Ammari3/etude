// scripts/patchPrim6MathsVideoLinksT2.js
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
const SUBJECT_ID = "maths";

const VIDEO_LINKS = {
  l15: [
    {
      title: "قابلية القسمة على 2 و3 و5 و9 — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=pfjumWt1Gi8",
    },
    {
      title: "قابلية القسمة على 2 و3 و5 و9 — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=WhQnAjHTuig",
    },
  ],
  l16: [
    {
      title: "محيط شكل مركب (مستطيل، مربع، دائرة) — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=MzP-cs0t6aI",
    },
  ],
  l17: [
    {
      title: "النسبة المئوية — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=7uxy-BeuQQU",
    },
     {
      title: "النسبة المئوية — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=htvGFT-idHI",
    },
  ],
  l18: [
    {
      title: "مساحة المثلث — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=d3s8mUOSU1E",
    },
  ],
  l19: [
    {
      title: "بناء متوازي الأضلاع بالكوس والمسطرة والفرجار — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=P5DOVaXxa9k",
    },
  ],
  l20: [
    {
      title: "جمع وطرح الأعداد الكسرية — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=cKQgdHf2WGc",
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