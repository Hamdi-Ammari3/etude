// scripts/patchPrim6MathsVideoLinksT1a.js
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
  l1: [
    {
      title: "الجمع والطرح في الأعداد العشرية — السنة السادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=gr2CONhkbZE",
    },
  ],
  l2: [
    {
      title: "قسمة الكسور العشرية على أعداد كلية — الصف السادس الابتدائي",
      url: "https://www.youtube.com/watch?v=asC_Amvz9NI",
    },
  ],
  l3: [
    {
      title: "وحدات قيس المساحة: م²، دسم²، سم²، هكتار، آر — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=aEGY8cixvlc",
    },
  ],
  l4: [
    {
      title: "التعامد والتوازي ومنصف الزاوية — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=gQ2fX8qBMVA",
    },
    {
      title: "التعامد والتوازي ومنصف الزاوية — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=u19IDZCFbGA",
    },
  ],
  l5: [
    {
      title: "عمليات على أعداد الزمن (ساعات ودقائق) — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=kUHVPz7dIQw",
    },
  ],
  l6: [
    {
      title: "بناء زوايا بقياسات محددة بالمنقلة — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=ptWEdLrZJLA",
    },
    {
      title: "بناء زوايا بقياسات محددة بالمنقلة — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=H8lkoylbN8s",
    },
  ],
  l7: [
    {
      title: "بناء المثلثات — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=E1acmDRIW7M",
    },
    {
      title: "بناء المثلثات — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=ZiHiGM-My_U",
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
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1, part A)`);
  console.log(`  (l3, l4, l5, l6 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});