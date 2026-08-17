// scripts/patchCol9PhysiqueVideoLinksT2.js
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
  l11: [
    {
      title: "تعريف الذرّة",
      url: "https://www.youtube.com/watch?v=RgKMSYdBpoU",
    },
  ],
  l12: [
    {
      title: "بنية الذرّة ",
      url: "https://www.youtube.com/watch?v=w0UnQQL0gHU",
    },
  ],
  l13: [
    {
      title: "رموز الذرات والصيغ الكيميائية",
      url: "https://www.youtube.com/watch?v=JYWGJVDQY-k",
    },
  ],
  l14: [
    {
      title: "معادلات التفاعلات الكيميائيّة",
      url: "https://www.youtube.com/watch?v=UrN-DqFF6gA",
    },
  ],
  l15: [
    {
      title: "ناقلية المحاليل المائية للكهرباء",
      url: "https://www.youtube.com/watch?v=QK3WxKAeeJ0",
    },
  ],
  l16: [
    {
      title: "تأثير التركيز على ناقلية المحلول الشاردي",
      url: "https://www.youtube.com/watch?v=va1h27GCstk",
    },
  ],
  l17: [
    {
      title: "الأنيونات والكتيونات — سنة تاسعة أساسي",
      url: "https://www.youtube.com/watch?v=hAMwsE7EyGo",
    },
  ],
  l18: [
    {
      title: "المحلول الحامضي والمحلول القلوي",
      url: "https://www.youtube.com/watch?v=3mutQFdUhQM",
    },
  ],
  l19: [
    {
      title: "قياس pH بجهاز pH متر وبورق pH",
      url: "https://www.youtube.com/watch?v=gn24pMkMhhk",
    },
  ],
  l20: [
    {
      title: "درجة حموضة محلول ومقياس pH",
      url: "https://www.youtube.com/watch?v=BDKE9p8HzXU",
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
  console.log(`  (all 10 lessons have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});