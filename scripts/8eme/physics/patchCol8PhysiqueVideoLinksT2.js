// scripts/patchCol8PhysiqueVideoLinksT2.js
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

const GRADE_ID = "col-8";
const SUBJECT_ID = "physique";

const VIDEO_LINKS = {
  l7: [
    {
      title: "التوتر الكهربائي ووحدته الفولط",
      url: "https://www.youtube.com/watch?v=eVM_512HXPU",
    },
  ],
  l8: [
    {
      title: "قياس التوتر بالفولط متر والتوصيل على التوازي",
      url: "https://www.youtube.com/watch?v=tr6WOed2HuA",
    },
  ],
  l9: [
    {
      title: "شدة التيار الكهربائي وقياسها بالأمبير متر",
      url: "https://www.youtube.com/watch?v=TzY7om8fSkE",
    },
  ],
  l10: [
    {
      title: "قانون أوم: العلاقة بين التوتر وشدة التيار (U=R×I)",
      url: "https://www.youtube.com/watch?v=Oje30LH541Y",
    },
  ],
  l12: [
    {
      title: "الدارات الكهربائية على التوالي والتوازي",
      url: "https://www.youtube.com/watch?v=x__tQMsQFHo",
    },
  ],
  l13: [
    {
      title: "المقاومة الكهربائية",
      url: "https://www.youtube.com/watch?v=C9sfBo2cHL4",
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
  console.log(`  (l7, l8, l9, l10, l11, l12, l14 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});