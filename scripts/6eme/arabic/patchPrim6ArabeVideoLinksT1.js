// scripts/patchPrim6ArabeVideoLinksT1.js
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
const SUBJECT_ID = "arabe";

const VIDEO_LINKS = {
  l1: [
    {
      title: "النكرة والمعرفة وأنواع المعارف — سلسلة تعلم الإعراب 53",
      url: "https://www.youtube.com/watch?v=QwgwnhBA86w",
    },
  ],
  l2: [
    {
      title: "سنة سادسة إبتدائي: العربيّة — أنشطة وتمارين حول تصريف المضاعف",
      url: "https://www.youtube.com/watch?v=ctJnsmyJicY",
    },
  ],
  l3: [
    {
      title: "تصريف الناقص في المضارع المرفوع — السنة السادسة",
      url: "https://www.youtube.com/watch?v=-FiWoFXFQrc&t=1s",
    },
  ],
  l4: [
    {
      title: "تصريف الناقص في المضارع المرفوع — السنة السادسة",
      url: "https://www.youtube.com/watch?v=jqqXv_BG2lM",
    },
  ],
  l5: [
    {
      title: "الاسم المقصور وتنوينه — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=EVDmhdhZ84g",
    },
  ],
  l6: [
    {
      title: "تقديم الخبر على المبتدأ — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=7qvuKilgSjc",
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
  console.log(`  (l5, l6 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});