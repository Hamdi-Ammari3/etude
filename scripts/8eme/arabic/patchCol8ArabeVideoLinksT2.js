// scripts/patchCol8ArabeVideoLinksT2.js
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
const SUBJECT_ID = "arabe";

const VIDEO_LINKS = {
  l9: [
    {
      title: "الفاعل مركّبا موصوليّ",
      url: "https://www.youtube.com/watch?v=fEqSQNXpGXc",
    },
  ],
  l10: [
    {
      title: "الفاعل مركّبا موصوليّ",
      url: "https://www.youtube.com/watch?v=fEqSQNXpGXc",
    },
  ],
  l11: [
    {
      title: "المفعول به المركب موصوليا (اسميا وحرفيا)",
      url: "https://www.youtube.com/watch?v=98V1HZDRcdU",
    },
  ],
  l12: [
    {
      title: "الخبر مركب موصولي أو مركب اسنادي",
      url: "https://www.youtube.com/watch?v=zromX7B987M",
    },
  ],
  l13: [
    {
      title: "الخبر مركب موصولي أو مركب اسنادي",
      url: "https://www.youtube.com/watch?v=zromX7B987M",
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
  console.log(`  (l11, l14, l15, l16 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});