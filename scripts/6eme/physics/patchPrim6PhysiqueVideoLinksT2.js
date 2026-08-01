// scripts/patchPrim6PhysiqueVideoLinksT2.js
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
  l6: [
    {
      title: "مكونات الدم ووظائفها",
      url: "https://www.youtube.com/watch?v=XD3Fud4DtI8",
    },
    {
      title: "درس الدورة الدموية الكبرى والصغرى",
      url: "https://www.youtube.com/watch?v=7ptmS6qaN2A",
    },
  ],
  l7: [
    {
      title: "الجلد: طبقاته",
      url: "https://www.youtube.com/watch?v=RClfrsmybIs",
    },
  ],
  l8: [
    {
      title: "تصنيف الأغذية والوجبة الغذائية المتوازنة",
      url: "https://www.youtube.com/watch?v=yhQ0r8jFpRw",
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
  console.log(`  (l7, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});