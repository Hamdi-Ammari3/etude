// scripts/patchPrim4MathsVideoLinksT2.js
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

const GRADE_ID = "prim-4";
const SUBJECT_ID = "maths";

const VIDEO_LINKS = {
  l11: [
    {
      title: "التعرف على مضاعفات المتر والعلاقة بينها وبين المتر",
      url: "https://www.youtube.com/watch?v=TMFt2buoGKw",
    },
  ],
  l12: [
    {
      title: "إنجاز عملية الضرب في عدد ذي رقمين",
      url: "https://www.youtube.com/watch?v=_Dlxkyvjwzs",
    },
  ],
  l13: [
    {
      title: "رسم المستطيل و المربع باستعمال التعامد و التوازي",
      url: "https://www.youtube.com/watch?v=hH0ZoUUv18k",
    },
  ],
  l14: [
    {
      title: "وحدات قيس السعة : اللتر و اجزاؤه",
      url: "https://www.youtube.com/watch?v=vAIstagPyZI",
    },
  ],
  l15: [
    {
      title: "قراءة الأعداد ذات 6 أرقام، تفكيكها و تركيبها و مقارنتها",
      url: "https://www.youtube.com/watch?v=dLiAWr6GgeE",
    },
  ],
  l16: [
    {
      title: "التصرف في وحدات قيس الكتل - الكيلوغرام و الغرام",
      url: "https://www.youtube.com/watch?v=xUv4RRL4t5g",
    },
  ],
  l17: [
    {
      title: "قراءة الأعداد ذات 6 أرقام، تفكيكها و تركيبها و مقارنتها",
      url: "https://www.youtube.com/watch?v=dLiAWr6GgeE",
    },
  ],
  l18: [
    {
      title: "حساب قيس محيط شكل مركب من مستطيلات و مربعات للسنة الرابعة ابتدائي",
      url: "https://www.youtube.com/watch?v=pIce8OXV5ew",
    },
  ],
  l19: [
    {
      title: "مقارنة الاعداد ذات 6 ارقام و ترتيبها",
      url: "https://www.youtube.com/watch?v=4vhvE3zwz3g",
    },
  ],
  l20: [
    {
      title: "ﺃﻧﺠﺰ عملية ﺍﻟﻀّﺭﺏ ﻓﻲ ﻋﺪﺩ ﺫﻱ 3 ﺃﺭﻗﺎﻡ",
      url: "https://www.youtube.com/watch?v=CjxR4o6qR-Y",
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
  console.log(`  (l11, l12, l13, l14, l19, l20 have empty url — no video found yet)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});