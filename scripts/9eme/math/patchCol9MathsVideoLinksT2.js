// scripts/patchCol9MathsVideoLinksT2.js
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
const SUBJECT_ID = "maths";

const VIDEO_LINKS = {
  l6: [
    {
      title: "الجذاءات المعتبرة - التفكيك",
      url: "https://www.youtube.com/watch?v=jOffK2DuJqY",
    },
  ],
  l7: [
    {
      title: "المعادلات والمتراجحات من الدرجة الأولى بمجهول واحد",
      url: "https://www.youtube.com/watch?v=IbKuDG0XWms",
    },
  ],
  l8: [
    {
      title: "تحليل السلسلة الإحصائية",
      url: "https://www.youtube.com/watch?v=wO59b8x_S0g",
    },
    {
      title: "تحليل السلسلة الإحصائية",
      url: "https://www.youtube.com/watch?v=lLb3K_LXOUA",
    },
  ],
  l10: [
    {
      title: "التعيين في المستوى",
      url: "https://www.youtube.com/watch?v=nIsCgWmlLrY",
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
  console.log(`  (l7, l8, l9, l10 have a title but empty url — check the Tadris.TN تاسعة أساسي playlist)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});