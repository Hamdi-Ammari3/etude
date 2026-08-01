// scripts/patchPrim6PhysiqueVideoLinksT3.js
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
  l9: [
    {
      title: "الوسط البيئي، السلاسل الغذائية والتوازن البيئي",
      url: "https://www.youtube.com/watch?v=o02V30yQk8k",
    },
  ],
  l10: [
    {
      title: "تلوث الأوساط المائية وطرق المحافظة عليها",
      url: "https://www.youtube.com/watch?v=hOZQZjd0MYs",
    },
  ],
  l11: [
    {
      title: "أمراض ناتجة عن تلوث المياه والوقاية منها",
      url: "https://www.youtube.com/watch?v=EDAp5fP2NMI",
    },
  ],
  l12: [
    {
      title: "التيار الكهربائي والدارة الكهربائية",
      url: "https://www.youtube.com/watch?v=kepCI9HFBoU",
    },
  ],
  l13: [
    {
      title: "المغنط والبوصلة والتأثير المغناطيسي للتيار الكهربائي",
      url: "https://www.youtube.com/watch?v=5vB9fH_vGVU",
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
  console.log(`  (all 5 lessons have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});