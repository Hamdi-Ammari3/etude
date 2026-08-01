// scripts/patchPrim6ArabeVideoLinksT3.js
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
const SUBJECT_ID = "arabe";

const VIDEO_LINKS = {
  l12: [
    {
      title: "مراجعة شاملة للإعراب — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=4EymsJxwf9I",
    },
  ],
  l13: [
    {
      title: "رسم حروف العلة: الواو والياء والتاء المربوطة في نهايات الكلمات — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=ZdsGoLwpkx8",
    },
  ],
  l14: [
    {
      title: "المركب التمييزي والمركب الموصولي — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=cP7zL9PeZmc",
    },
  ],
  l15: [
    {
      title: "اسم الفاعل واسم المفعول من الفعل الثلاثي المزيد — سنة سادسة ابتدائي",
      url: "https://www.youtube.com/watch?v=lci_cn6nZME&t=46s",
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
  console.log(`  (all 4 lessons have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});