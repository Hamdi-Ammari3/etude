// scripts/patchPrim5MathsVideoLinksT1.js
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
const SUBJECT_ID = "maths";

const VIDEO_LINKS = {
  l1: [
    {
      title: "السنة خامسة: التصرف في الأعداد ذات 7 أرقام فأكثر (الملايين)",
      url: "https://www.youtube.com/watch?v=SW0iUAanyrc",
    },
  ],
  l2: [
    {
      title: "التموقع على شبكة: تحديد إحداثيات نقطة ورسم أشكال — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=iXzKY9SIifw",
    },
  ],
  l3: [
    {
      title: "الجمع والطرح والضرب في نطاق الأعداد الصحيحة الطبيعية الكبيرة — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=_lRx096tJBQ",
    },
  ],
  l4: [
    {
      title: "القسمة الإقليدية على الأعداد الكبيرة — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=wGHArtBqcOw",
    },
  ],
  l5: [
    {
      title: "وحدات قيس الكتل: القنطار والطنّ",
      url: "https://www.youtube.com/watch?v=yYKaEo7jmXU",
    },
  ],
  l6: [
    {
      title: "الدائرة والقرص الدائري: المركز، نصف القطر، القطر — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=lPWrnJP1rGQ",
    },
  ],
  l7: [
    {
      title: "الموسط العمودي لقطعة مستقيم — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=0wG77_Ugx08",
    },
  ],
  l8: [
    {
      title: "بناءات هندسية بالاعتماد على الدائرة (مضلعات منتظمة) — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=Ydl2PAUA2ls",
    },
  ],
  l9: [
    {
      title: "التعامد والتوازي بأسهل طريقة — السنة الخامسة والرابعة ابتدائي",
      url: "https://m.youtube.com/watch?v=ka9t25AaKQA",
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
  console.log(`  (l2, l3, l4, l6, l7, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});