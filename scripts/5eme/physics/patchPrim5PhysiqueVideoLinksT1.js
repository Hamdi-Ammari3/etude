// scripts/patchPrim5PhysiqueVideoLinksT1_v2.js
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
  l1: [
    {
      title: "01 إيقاظ علمي سنة خامسة | مصادر الضوء الطبيعية والاصطناعية",
      url: "https://www.youtube.com/watch?v=GSMWd7AyAwc",
    },
  ],
  l2: [
    {
      title: "05 إيقاظ علمي سنة خامسة | الانتشار المستقيمي للضوء",
      url: "https://www.youtube.com/watch?v=JoCZ-v9eedM",
    },
  ],
  l3: [
    {
      title: "إيقاظ علمي سنة خامسة: الأجسام الشفافة والأجسام الشافة والأجسام العاتمة",
      url: "https://www.youtube.com/watch?v=1JQY611U3r8",
    },
  ],
  l4: [
    {
      title: "تكوّن الظل — سنة خامسة (إيقاظ علمي)",
      url: "https://www.youtube.com/watch?v=hq7fu4D2bEg",
    },
  ],
  l5: [
    {
      title: "انعكاس الضوء والمرايا — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=Ta4kbnS7gdA",
    },
  ],
  l7: [
    {
      title: "الجهاز الهضمي عند الإنسان — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=hmuYjbYyIa8",
    },
  ],
  l8: [
    {
      title: "التغذية السليمة والصحة الجيدة — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=x1E_78mS7cE",
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
  console.log(`  (l5, l6, l7, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});