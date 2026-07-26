// scripts/patchPrim4MathsVideoLinksT3.js
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
  l21: [
    {
      title: "التعرف على شكل مستو",
      url: "https://www.youtube.com/watch?v=Wk-sVVF8a50",
    },
  ],
  l22: [
    {
      title: "الاعداد ذات ستة ارقام",
      url: "https://www.youtube.com/watch?v=S6HGYrUK3ik",
    },
  ],
  l23: [
    {
      title: "مضاعفات عدد صحيح طبيعي",
      url: "https://www.youtube.com/watch?v=ZA4DIrh5itM",
    },
  ],
  l24: [
    {
      title: "القسمة الإقليدية",
      url: "https://www.youtube.com/watch?v=ZXUt4eGftb4",
    },
  ],
  l25: [
    {
      title: "القسمة الإقليدية",
      url: "https://www.youtube.com/watch?v=cI_D5mCDcIE",
    },
  ],
  l26: [
    {
      title: "إيجاد المساحة — مساحة المستطيل والمربع",
      url: "https://www.youtube.com/watch?v=18T97otn3Ro",
    },
  ],
  
  l28: [
    {
      title: "أنواع الزوايا و قياساتها: الحادة / القائمة / المنفرجة / المستقيمة",
      url: "https://www.youtube.com/watch?v=C0Ej9jj0-YU",
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
  console.log(`  (l21, l22, l23, l29, l30 have empty url — no video found yet)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});