// scripts/patchPrim4PhysiqueVideoLinksT1.js
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
const SUBJECT_ID = "physique"; // "إيقاظ علمي" at this grade

const VIDEO_LINKS = {
  l1: [
    {
      title: "الحواس و أعضاء الحسّ",
      url: "https://www.youtube.com/watch?v=bDBzZRtIh5g",
    },
  ],
  l2: [
    {
      title: "تعليم أجزاء جسم الإنسان: الرأس، الجذع، الأطراف",
      url: "https://www.youtube.com/watch?v=i9prxU0_q7w",
    },
  ],
  l3: [
    {
      title: "أنواع الأسنان عند الإنسان — سنة رابعة",
      url: "https://www.youtube.com/watch?v=sC7Dsp51-74",
    },
  ],
  l4: [
    {
      title: "الهيكل العضمي",
      url: "https://www.youtube.com/watch?v=xApc515KbuI",
    },
  ],
  l5: [
    {
      title: "عملية التنفس و الرئتين في الانسان",
      url: "https://www.youtube.com/watch?v=eP355IHjbBU",
    },
  ],
  l6: [
    {
      title: "درس التغذية عند الانسان",
      url: "https://www.youtube.com/watch?v=zyDL_8rfXhQ",
    },
  ],
  l7: [
    {
      title: "النظافة الشخصية",
      url: "https://www.youtube.com/watch?v=impoklK-yeA",
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
  console.log(`  (l4, l6, l7 have empty url — no video found yet; l5 is a flagged partial match)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});