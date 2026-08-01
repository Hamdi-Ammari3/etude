// scripts/patchCol7FrancaisVideoLinksT3.js
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
const SUBJECT_ID = "francais";

const VIDEO_LINKS = {
  l17: [
    {
      title: "Le conditionnel présent — CM1 - CM2 - 6ème — Cours, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=38wnY7FxD20",
    },
  ],
  l18: [
    {
      title: "Les propositions subordonnées conjonctives — 6ème",
      url: "https://www.youtube.com/watch?v=jpZMyicHn7U",
    },
  ],
  l19: [
    {
      title: "Personnification, comparaison et métaphore",
      url: "https://www.youtube.com/watch?v=_9xZ7eAzX1s",
    },
  ],
  l20: [
    {
      title: "L'accord du participe passé — CM1, CM2 et 6ème — Leçon, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=2CU6It4RJS0",
    },
  ],
  l21: [
    {
      title: "Champ lexical et champ sémantique — 6ème",
      url: "https://www.youtube.com/watch?v=5JD1JCBzmSE",
    },
  ],
  l22: [
    {
      title: "Écrire une lettre et un message : structure et registre de langue — 6ème",
      url: "https://www.youtube.com/watch?v=0AmcTSkeV-8",
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
  console.log(`  (l18, l21, l22, l23, l24 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});