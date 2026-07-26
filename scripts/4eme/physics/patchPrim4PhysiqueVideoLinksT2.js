// scripts/patchPrim4PhysiqueVideoLinksT2.js
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
  l9: [
    {
      title: "تصنيف الحيوانات حسب الغذاء",
      url: "https://www.youtube.com/watch?v=rJwTAjszy6Y",
    },
  ],
  l10: [
    {
      title: "ماهي أجزاء النبات",
      url: "https://www.youtube.com/watch?v=tHngJrLIYHY",
    },
  ],
  l11: [
    {
      title: "دورة حياة النبات",
      url: "https://www.youtube.com/watch?v=qWTvC8tBfwY",
    },
  ],
  l12: [
    {
      title: "تكاثر الحيوانات",
      url: "https://www.youtube.com/watch?v=bT6xb9hVlVc",
    },
  ],
  l13: [
    {
      title: "الكائنات الحية والكائنات غير الحية",
      url: "https://www.youtube.com/watch?v=ZYo7ZH5P_Cg",
    },
  ],
  l14: [
    {
      title: "اهمية الماء في حياتنا",
      url: "https://www.youtube.com/watch?v=0papDTX8XSM",
    },
  ],
  l15: [
    {
      title: "حالات الماء في الطبيعة",
      url: "https://www.youtube.com/watch?v=tEn4fZu-0Wk",
    },
  ],
  l16: [
    {
      title: "الهواء و خصائصه",
      url: "https://www.youtube.com/watch?v=1-X8wXcpXuU",
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
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 2)`);
  console.log(`  (l9, l11, l12, l13, l14, l15, l16 have empty url — no video found yet)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});