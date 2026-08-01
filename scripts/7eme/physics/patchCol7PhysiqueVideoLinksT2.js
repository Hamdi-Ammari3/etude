// scripts/patchCol7PhysiqueVideoLinksT2.js
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

const GRADE_ID = "col-7";
const SUBJECT_ID = "physique";

const VIDEO_LINKS = {
  l7: [
    {
      title: "أهمية الماء في الحياة",
      url: "https://www.youtube.com/watch?v=oJCQCnsnsX8",
    },
  ],
  l8: [
    {
      title: "مصادر الماء وتحولاته الفيزيائية",
      url: "https://www.youtube.com/watch?v=CtcVUaGRmg8",
    },
  ],
  l9: [
    {
      title: "درس دورة الماء في الطبيعة ",
      url: "https://www.youtube.com/watch?v=ES_xdSbvxnA",
    },
  ],
  l10: [
    {
      title: "الماء النقي وماء الشرب: النقاوة والمعالجة",
      url: "https://www.youtube.com/watch?v=pkRWzX6cLVk",
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
  console.log(`  (l7, l8, l10, l11, l12 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});