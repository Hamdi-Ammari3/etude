// scripts/patchCol8FrancaisVideoLinksT2.js
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
const SUBJECT_ID = "francais";

const VIDEO_LINKS = {
  l9: [
    {
      title: "Le texte argumentatif : thèse, arguments, exemples — 8ème année",
      url: "https://www.youtube.com/watch?v=OWxSU2mvjfw",
    },
  ],
  l10: [
    {
      title: "Les connecteurs logiques dans l'argumentation — 8ème année",
      url: "https://www.youtube.com/watch?v=-3Qj3i9ZE1Y",
    },
  ],
  l11: [
    {
      title: "Les propositions subordonnées de but et d'opposition — 8ème année",
      url: "https://www.youtube.com/watch?v=c2Pp8qSLy4w",
    },
  ],
  l12: [
    {
      title: "Le conditionnel passé — 8ème année",
      url: "https://www.youtube.com/watch?v=i-4-wHukaws",
    },
  ],
  l13: [
    {
      title: "La phrase active et la phrase passive",
      url: "https://www.youtube.com/watch?v=9dHVp_PrG64",
    },
  ],
  l14: [
    {
      title: "Le lexique de l'argumentation : verbes d'opinion et expressions de nuance — 8ème année",
      url: "https://www.youtube.com/watch?v=VZKGpbdlAV0",
    },
  ],
  l15: [
    {
      title: "La nominalisation avancée : suffixes -tion, -ment, -ité, -age — 8ème année",
      url: "https://www.youtube.com/watch?v=OJirdct3Vz8",
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
  console.log(`  (l9, l10, l11, l12, l14, l15, l16 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});