// scripts/patchPrim5PhysiqueVideoLinksT2.js
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

const GRADE_ID = "prim-5";
const SUBJECT_ID = "physique"; // "إيقاظ علمي" at this grade

const VIDEO_LINKS = {
  l9: [
    {
      title: "التحولات الفيزيائية للمادة: الانصهار، التبخر، التكاثف، التجمد — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=MgsjE2XRIYw",
    },
  ],
  l10: [
    {
      title: "علوم سنة خامسة ابتدائي (إيقاظ علمي): الماء في الطبيعة، مصادره ودورة الماء",
      url: "https://www.youtube.com/watch?v=tQCz9YL01HQ",
    },
  ],
  l11: [
    {
      title: "تلوث الماء والهواء — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=ABYcTtDylGE",
    },
  ],
  l12: [
    {
      title: "إيقاظ علمي سنة خامسة: عناصر الوسط البيئي والسلسلة الغذائية",
      url: "https://www.youtube.com/watch?v=W1gpoG4gTpE",
    },
  ],
  l13: [
    {
      title: "إيقاظ علمي سنة خامسة: عناصر الوسط البيئي والسلسلة الغذائية",
      url: "https://www.youtube.com/watch?v=W1gpoG4gTpE",
    },
  ],
  l14: [
    {
      title: "تكيف الحيوانات مع الوسط البيئي — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=eRpXI1c6vgQ",
    },
  ],
  l15: [
    {
      title: "تكاثر النباتات وانتشار البذور — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=NlmQ-07P3KU",
    },
  ],
  l16: [
    {
      title: "مصادر الطاقة المتجددة وغير المتجددة — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=3MNvdgqFYQs",
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
  console.log(`  (l9, l11, l14, l15, l16 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});