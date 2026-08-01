// scripts/patchCol8FrancaisVideoLinksT1.js
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
  l1: [
    {
      title: "Les types de phrases et questions totales/partielles — 8ème année",
      url: "https://www.youtube.com/watch?v=Y2IMTIhTnXs",
    },
  ],
  l2: [
    {
      title: "Les propositions subordonnées circonstancielles de temps — 8ème année",
      url: "https://www.youtube.com/watch?v=y253hTYTbiw",
    },
  ],
  l3: [
    {
      title: "Les propositions subordonnées de cause et de conséquence — 8ème année",
      url: "https://www.youtube.com/watch?v=9dsbEut-zPo",
    },
  ],
  l4: [
    {
      title: "Le plus-que-parfait — CM1 - CM2 - 6ème — Leçon, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=mcEOTko34zA",
    },
  ],
  l5: [
    {
      title: "Les fonctions du groupe nominal (sujet, COD, COI, complément circonstanciel, attribut) — 8ème année",
      url: "https://www.youtube.com/watch?v=lJSkCPwHAFw",
    },
  ],
  l6: [
    {
      title: "Formation des mots : dérivation et composition — 8ème année",
      url: "https://www.youtube.com/watch?v=fYkLTUpnuPs",
    },
  ],
  l7: [
    {
      title: "Les paronymes et les niveaux de langue (familier, courant, soutenu) — 8ème année",
      url: "https://www.youtube.com/watch?v=M_XVEUnwmqA",
    },
  ],
  l8: [
    {
      title: "Cohérence des temps dans un récit au passé — 8ème année",
      url: "https://www.youtube.com/watch?v=zW-p4wTp8XM",
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
  console.log(`  (l1, l2, l3, l5, l6, l7, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});