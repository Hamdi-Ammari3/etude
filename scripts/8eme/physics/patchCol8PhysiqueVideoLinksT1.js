// scripts/patchCol8PhysiqueVideoLinksT1.js
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
const SUBJECT_ID = "physique";

const VIDEO_LINKS = {
  l1: [
    {
      title: "الغلاف الجوي: مكوناته وطبقاته (التروبوسفير)",
      url: "https://www.youtube.com/watch?v=eehIR3-yUDE",
    },
  ],
  l2: [
    {
      title: "الضغط الجوي — فيزياء",
      url: "https://www.youtube.com/watch?v=vM8ULNeN7zQ",
    },
  ],
  l3: [
    {
      title: "التيارات الهوائية (الرياح) واختلاف الضغط الجوي",
      url: "https://www.youtube.com/watch?v=3h8GHni2XFI",
    },
  ],
  l4: [
    {
      title: "التكهنات الجوية: جمع البيانات والتنبؤ بالطقس",
      url: "https://www.youtube.com/watch?v=hGO043COxYk&t=11s",
    },
  ],
  l5: [
    {
      title: "الرطوبة والتساقطات (المطر، الثلج، البَرَد)",
      url: "https://www.youtube.com/watch?v=93-DDOzLmbM",
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
  console.log(`  (l1, l3, l4, l5, l6 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});