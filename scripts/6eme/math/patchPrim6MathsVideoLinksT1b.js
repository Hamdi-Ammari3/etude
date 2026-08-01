// scripts/patchPrim6MathsVideoLinksT1b.js
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
  l8: [
    {
      title: "المضاعفات المشتركة لعددين صحيحين طبيعيين",
      url: "https://www.youtube.com/watch?v=GE0s10bCrj4",
    },
  ],
  l9: [
    {
      title: "أتعرّف خاصّيات شبه المنحرف و أرسمه",
      url: "https://www.youtube.com/watch?v=_LYHcn_6p-M",
    },
    {
      title: "أتعرّف خاصّيات شبه المنحرف و أرسمه",
      url: "https://www.youtube.com/watch?v=CvuEexH4BQo",
    },
  ],
  l10: [
    {
      title: "السلم ومقياس الرسم",
      url: "https://www.youtube.com/watch?v=UoljHsuW2N8",
    },
    {
      title: "السلم ومقياس الرسم",
      url: "https://www.youtube.com/watch?v=fRYoAYps5qI",
    },
    {
      title: "السلم ومقياس الرسم",
      url: "https://www.youtube.com/watch?v=xdJpGJkSU44",
    },
  ],
  l11: [
    {
      title: "متوازي الأضلاع: خصائصه ورسمه",
      url: "https://www.youtube.com/watch?v=mEB5Go_XlOY",
    },
  ],
  l12: [
    {
      title: "الأعداد الكسرية",
      url: "https://www.youtube.com/watch?v=fyMQpNNWvA8",
    },
    {
      title: "الأعداد الكسرية",
      url: "https://www.youtube.com/watch?v=Uz0AnPVBqKs",
    },
    {
      title: "الأعداد الكسرية",
      url: "https://www.youtube.com/watch?v=Znpd-j9Elqo",
    },
  ],
  l13: [
    {
      title: "شرح محيط الدائرة ومساحتها",
      url: "https://www.youtube.com/watch?v=TcXnJKY7QI0",
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
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1, part B)`);
  console.log(`  (l8, l10, l11, l12, l14 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});