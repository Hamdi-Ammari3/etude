// scripts/patchCol9PhysiqueVideoLinksT3.js
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

const GRADE_ID = "col-9";
const SUBJECT_ID = "physique";
const VIDEO_LINKS = {
  l21: [
    {
      title: "درجة القلوية ومقياس pH",
      url: "https://www.youtube.com/watch?v=zRpw0iLaHA0",
    },
  ],
  l22: [
    {
      title: "المحلول المتعادل",
      url: "https://www.youtube.com/watch?v=w4JbKqzbkg8",
    },
  ],
  l23: [
    {
      title: "إنعكاس الضوء",
      url: "https://www.youtube.com/watch?v=gbjOZ54IJAU",
    },
  ],
  l24: [
    {
      title: "المرآة المسطحة",
      url: "https://www.youtube.com/watch?v=8bGzfyVlko0",
    },
  ],
  l25: [
    {
      title: "انكسار الضوء بين وسطين شفافين",
      url: "https://www.youtube.com/watch?v=hjBrR0XiLN0",
    },
  ],
  l26: [
    {
      title: "الزاوية الحدية والانعكاس الكلي",
      url: "https://www.youtube.com/watch?v=jUCZk0yCrYE",
    },
  ],
  l27: [
    {
      title: "تطبيقات الانعكاس الكلي",
      url: "https://www.youtube.com/watch?v=bH8fREQawkg",
    },
  ],
  l28: [
    {
      title: "الضوء الأبيض وتفريقه إلى ألوان الطيف",
      url: "https://www.youtube.com/watch?v=s_K8rC0AtpA",
    },
  ],
  l30: [
    {
      title: "الطاقة الشمسية: الخلايا الكهروضوئية والسخانات الشمسية",
      url: "https://www.youtube.com/watch?v=cwtycCW9kOI",
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
  console.log(`  (l21, l22, l24, l25, l26, l27, l28, l29, l30 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});