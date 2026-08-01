// scripts/patchPrim6FrancaisVideoLinksT3.js
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
const SUBJECT_ID = "francais";

const VIDEO_LINKS = {
  l13: [
    {
      title: "Les compléments circonstanciels — CM1 - CM2 - Cycle 3 - Français - Grammaire",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=sdBR0imeOSY",
    },
  ],
  l14: [
    {
      title: "Révision : verbes usuels au passé composé et au futur simple — CM1 CM2",
      url: "https://www.youtube.com/watch?v=cSYxB8LvCDI",
    },
  ],
  l15: [
    {
      title: "Adjectifs particuliers au féminin : neuf/neuve, gentil/gentille, beau/belle, bon/bonne — CM1 CM2",
      url: "https://www.youtube.com/watch?v=eeimxjZAQa8",
    },
  ],
  l16: [
    {
      title: "Les compléments circonstanciels — CM1 - CM2 - Cycle 3 - Français - Grammaire",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=sdBR0imeOSY",
    },
  ],
  l17: [
    {
      title: "L'accord du participe passé — CM1, CM2 et 6ème — Leçon, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=2CU6It4RJS0",
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
  console.log(`  (l14, l15 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});