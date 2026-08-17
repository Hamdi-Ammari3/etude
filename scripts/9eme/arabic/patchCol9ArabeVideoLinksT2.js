// scripts/patchCol9ArabeVideoLinksT2.js
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
const SUBJECT_ID = "arabe";

const VIDEO_LINKS = {
  l9: [
    {
      title: "النص الحجاجي: الأطروحة، الحجة، بنية النص",
      url: "https://www.youtube.com/watch?v=SslkcBV0BSk",
    },
  ],
  l10: [
    {
      title: "محور العمل في النص الحجاجي: حجج وأمثلة",
      url: "https://www.youtube.com/watch?v=fNlallr5YSQ",
    },
  ],
  l11: [
    {
      title: "منهجية تحليل النص الحجاجي خطوة بخطوة",
      url: "https://www.youtube.com/watch?v=-A56w2xfPvo",
    },
  ],
  l13: [
    {
      title: "أدوات التوكيد والتعليل في الحجاج",
      url: "https://www.youtube.com/watch?v=5ucjzHcYq-I",
    },
  ],
  l15: [
    {
      title: "منهج الإنشاء الحجاجي: مقدمة، جوهر، خاتمة",
      url: "https://www.youtube.com/watch?v=w-qp1fZiKK4",
    },
  ],
  l16: [
    {
      title: "تدريب على كتابة فقرة حجاجية متكاملة",
      url: "https://www.youtube.com/watch?v=rSGM_c3b9Zg",
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