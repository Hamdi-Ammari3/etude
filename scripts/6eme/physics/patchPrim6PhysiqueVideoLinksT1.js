// scripts/patchPrim6PhysiqueVideoLinksT1.js
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
const SUBJECT_ID = "physique"; // "إيقاظ علمي" at this grade

const VIDEO_LINKS = {
  l1: [
    {
      title: "درس خصائص الهواء",
      url: "https://www.youtube.com/watch?v=72Hi2nCwAxE",
    },
  ],
  l2: [
    {
      title: "درس مكوّنات الهواء",
      url: "https://www.youtube.com/watch?v=_eavGqI37f0",
    },
  ],
  l3: [
    {
      title: "الهواء ضروري للكائنات الحيّة",
      url: "https://www.youtube.com/watch?v=pHLewMMF58k",
    },
  ],
  l4: [
    {
      title: "الاحتراق في الهواء ، أهمية الأكسيجين في عملية الاحتراق",
      url: "https://www.youtube.com/watch?v=z8VIlIPlxWk",
    },
  ],
  l5: [
    {
      title: "الجهاز التنفسي عند الإنسان",
      url: "https://www.youtube.com/watch?v=eP355IHjbBU",
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
  console.log(`  (l5 has a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});