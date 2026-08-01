// scripts/patchCol8AnglaisVideoLinksT1.js
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
const SUBJECT_ID = "anglais";

const VIDEO_LINKS = {
  l1: [
    {
      title: "School vocabulary and daily timetable: subjects, break, lesson",
      url: "https://www.youtube.com/watch?v=AnZxeX_8mVk&t=16s",
    },
  ],
  l2: [
    {
      title: "Easy English Learning! Present Simple vs Present Continuous",
      url: "https://www.youtube.com/watch?v=IL9ImXyvL-E",
    },
  ],
  l3: [
    {
      title: "Physical appearance and personality: comparing traits (more confident, more honest)",
      url: "https://www.youtube.com/watch?v=w9wI5ZvZn6g&t=50s",
    },
  ],
  l4: [
    {
      title: "Countries, nationalities, and cultural traditions",
      url: "https://www.youtube.com/watch?v=NJVV1LDt2hE",
    },
  ],
  l5: [
    {
      title: "Boat, bicycle, car, motorbike, train... Means of Transport | English Vocabulary for Kids",
      channel: "Happy Learning",
      url: "https://www.youtube.com/watch?v=Yfp_5a5CQdw",
    },
  ],
  l6: [
    {
      title: "Prepositions of movement: to, into, through, across",
      url: "https://www.youtube.com/watch?v=6TAyrxsqhNI",
    },
  ],
  l7: [
    {
      title: "Formal personal information: full name, date of birth, address, phone number",
      url: "https://www.youtube.com/watch?v=KutS5YYOWyc",
    },
  ],
  l8: [
    {
      title: "More irregular verbs in the past tense: take/took, give/gave, write/wrote, drive/drove",
      url: "https://www.youtube.com/watch?v=oJZdkhclusQ&t=4s",
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
  console.log(`  (l1, l3, l4, l6, l7, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});