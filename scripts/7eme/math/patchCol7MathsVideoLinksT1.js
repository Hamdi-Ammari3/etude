// scripts/patchCol7MathsVideoLinksT1.js
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
const SUBJECT_ID = "maths";

const VIDEO_LINKS = {
  l1: [
    {
      title: "العمليات في الأعداد الصحيحة الطبيعيّة",
      url: "https://www.youtube.com/watch?v=kYsJdqFYVA8",
    },
  ],
  l2: [
    {
      title: "مضاعفات وقواسم عدد صحيح طبيعي",
      url: "https://www.youtube.com/watch?v=RXdSEjYueVg",
    },
  ],
  l3: [
    {
      title: "ما هي الأعداد الأولية؟",
      url: "https://www.youtube.com/watch?v=A5fYPQQBj14",
    },
  ],
  l4: [
    {
      title: "تبسيط ومقارنة الكسور",
      url: "https://www.youtube.com/watch?v=_hJdA0MO530",
    },
  ],
  l5: [
    {
      title: "جمع وطرح الكسور",
      url: "https://www.youtube.com/watch?v=v3tlhSSYxjE",
    },
  ],
  l6: [
    {
      title: "ضرب وقسمة الكسور",
      url: "https://www.youtube.com/watch?v=9O2ITGuEGS8",
    },
  ],
  l7: [
    {
      title: "التناظر المحوري",
      url: "https://www.youtube.com/watch?v=uRBcDHRySl0",
    },
  ],
  l8: [
    {
      title: "التعامد والتوازي",
      url: "https://www.youtube.com/watch?v=gUaSfbNLf4o",
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
  console.log(`  (l2, l4, l5, l6, l7, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});