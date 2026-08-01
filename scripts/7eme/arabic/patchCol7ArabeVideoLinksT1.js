// scripts/patchCol7ArabeVideoLinksT1.js
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
const SUBJECT_ID = "arabe";

const VIDEO_LINKS = {
  l1: [
    {
      title: "الفعل اللازم والمتعدي — سلسلة تعلم الإعراب 68",
      url: "https://www.youtube.com/watch?v=zize7F4LOCU",
    },
  ],
  l2: [
    {
      title: "الفعل اللازم والمتعدي",
      url: "https://www.youtube.com/watch?v=zize7F4LOCU",
    },
  ],
  l3: [
    {
      title: "البناء الثلاثي للنص السردي:",
      url: "https://www.youtube.com/watch?v=PFbfWlLUtRk",
    },
  ],
  l4: [
    {
      title: "الإطاران المكاني والزماني في النص السردي — سنة سابعة أساسي",
      url: "https://www.youtube.com/watch?v=u4NG4Xg_kF4",
    },
  ],
  l5: [
    {
      title: "شخصية البطل: مواصفاته وتطوره في القصة — سنة سابعة أساسي",
      url: "",
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
  console.log(`  (l3, l4, l5, l6, l7, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});