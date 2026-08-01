// scripts/patchPrim5PhysiqueVideoLinksT3.js
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
  l17: [
    {
      title: "# 15 إيقاظ علمي سنة خامسة: درس الدارة الكهربائية",
      url: "https://www.youtube.com/watch?v=SoX09FXaFok",
    },
  ],
  l18: [
    {
      title: "# 16 إيقاظ علمي سنة خامسة: المواد والأجسام الناقلة والعازلة للتيار الكهربائي",
      url: "https://www.youtube.com/watch?v=_OGIPNCeiJw",
    },
  ],
  l19: [
    {
      title: "الدارات الكهربائية التسلسلية والتوازية — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=i99VhoyvPBY",
    },
  ],
  l20: [
    {
      title: "المغناطيس والبوصلة — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=IBd8P6qAVmQ",
    },
  ],
  l21: [
    {
      title: "الصوت واهتزاز الأجسام — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=O8ILGPB8jNc",
    },
  ],
  l22: [
    {
      title: "الحرارة وتمدد المواد — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=P7dypnWa9Pg",
    },
  ],
  l23: [
    {
      title: "السلامة المنزلية من الكهرباء والنار — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=y6gt8y4RB2w",
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
  console.log(`  (l19, l20, l21, l22, l23, l24 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});