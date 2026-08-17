// scripts/patchCol8PhysiqueVideoLinksT3.js
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
  l15: [
    {
      title: "انكسار الضوء وتغير اتجاهه بين وسطين شفافين — سنة ثامنة أساسي",
      url: "https://www.youtube.com/watch?v=rk0h5_3mE-M",
    },
  ],
  l16: [
    {
      title: "العدسات (المحدبة والمقعرة) والمرايا — سنة ثامنة أساسي",
      url: "https://www.youtube.com/watch?v=8pR7JBkh81c",
    },
  ],
  l18: [
    {
      title: "الفرق بين الكتلة والوزن — سنة ثامنة أساسي",
      url: "https://www.youtube.com/watch?v=HuRRGs1Lxrk",
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
  console.log(`  (all 6 lessons have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});