// scripts/patchCol8MathsVideoLinksT1.js
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

const GRADE_ID = "col-8";
const SUBJECT_ID = "maths";

const VIDEO_LINKS = {
  l1: [
    {
      title: "مقارنة الأعداد الصحيحة النسبية",
      url: "https://www.youtube.com/watch?v=01HEY2Plsg4",
    },
  ],
  l2: [
    {
      title: "جمع وطرح الأعداد الصحيحة النسبية",
      url: "https://www.youtube.com/watch?v=AHDPMCh-J_g",
    },
  ],
  l3: [
    {
      title: "ضرب وقسمة الكسور النسبية",
      url: "https://www.youtube.com/watch?v=3amhbaz3Uqo",
    },
  ],
  l4: [
    {
      title: "مقارنة الكسور بجذاء الطرفين والوسطين",
      url: "https://www.youtube.com/watch?v=-F2lWvNp5uE",
    },
  ],
  l5: [
    {
      title: "جمع وطرح الكسور النسبية",
      url: "https://www.youtube.com/watch?v=MJ4SLCoz2Wc",
    },
  ],
  l6: [
    {
      title: "الحساب الحرفي والمقادير الجبرية",
      url: "https://www.youtube.com/watch?v=4WuLc9thKMA",
    },
  ],
  l7: [
    {
      title: "تبسيط العبارات الجبرية",
      url: "https://www.youtube.com/watch?v=x1RTHYXTbDg",
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
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1)`);
  console.log(`  (l1, l2, l3, l4, l5, l6, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});