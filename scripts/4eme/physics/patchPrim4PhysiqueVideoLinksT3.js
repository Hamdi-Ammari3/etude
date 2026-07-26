// scripts/patchPrim4PhysiqueVideoLinksT3.js
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

const GRADE_ID = "prim-4";
const SUBJECT_ID = "physique"; // "إيقاظ علمي" at this grade

const VIDEO_LINKS = {
  l17: [
    {
      title: "خصائص الضوء",
      url: "https://www.youtube.com/watch?v=AZt8voNXuMY",
    },
  ],
  l18: [
    {
      title: "الضوء و الظل",
      url: "https://www.youtube.com/watch?v=KyxU3Du6cEQ",
    },
  ],
  l19: [
    {
      title: "الصوت ينتقل عبر المواد",
      url: "https://www.youtube.com/watch?v=RyYP2I9RCyQ",
    },
  ],
  l20: [
    {
      title: "المغناطيس وخصائصه",
      url: "https://www.youtube.com/watch?v=y0C0OEzTbLg",
    },
  ],
  l21: [
    {
      title: "الدارات الكهربائية البسيطة",
      url: "https://www.youtube.com/watch?v=XgRpzwQey_I",
    },
  ],
  l22: [
    {
      title: "الفصول الأربعة",
      url: "https://www.youtube.com/watch?v=9RRjlPTqQdU",
    },
  ],
  l23: [
    {
      title: "الليل والنهار",
      url: "https://www.youtube.com/watch?v=csTeZ0L04BA",
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
  console.log(`  (l18, l20, l21, l22, l23, l24 have empty url — no video found yet)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});