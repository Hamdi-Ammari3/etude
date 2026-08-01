// scripts/patchCol7AnglaisVideoLinksT2.js
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
const SUBJECT_ID = "anglais";

const VIDEO_LINKS = {
  l9: [
    {
      title: "My daily routine - My day - Learn English for kids",
      url: "https://www.youtube.com/watch?v=zzdz7mDW0eI",
    },
  ],
  l10: [
    {
      title: "Learn Quarter Past, Quarter To & Half Past for Kids! | Hi Friends!",
      url: "https://www.youtube.com/watch?v=5mNuKKPrSsY",
    },
  ],
  l11: [
    {
      title: "Easy English Learning! Present Simple vs Present Continuous",
      url: "https://www.youtube.com/watch?v=IL9ImXyvL-E",
    },
  ],
  l12: [
    {
      title: "World Food — Kids vocabulary — Learn English for kids",
      channel: "English Singsing",
      url: "https://www.youtube.com/watch?v=4uuGYHfnVRE",
    },
  ],
  l13: [
    {
      title: "Wild animals and their habitats: forest, desert, ocean, jungle",
      url: "https://www.youtube.com/watch?v=8gp42yzkEtg",
    },
  ],
  l14: [
    {
      title: "Past Simple Regular Verbs | English Grammar Videos",
      url: "https://www.youtube.com/watch?v=sYRbVTJXH64",
    },
  ],
  l15: [
    {
      title: "Recounting a past holiday: where you went, what you did, how you felt",
      url: "https://www.youtube.com/watch?v=PPqhRL-uINc",
    },
  ],
  l16: [
    {
      title: "The weather for kids | Learn vocabulary in English",
      url: "https://www.youtube.com/watch?v=sn6GLgaTY0M",
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
  console.log(`  (l13, l15 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});