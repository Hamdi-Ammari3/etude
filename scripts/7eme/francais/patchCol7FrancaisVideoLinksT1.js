// scripts/patchCol7FrancaisVideoLinksT1.js
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
  l1: [
    {
      title: "Tout savoir sur les classes grammaticales : le nom, le déterminant, l'adjectif et le pronom",
      url: "https://www.youtube.com/watch?v=-8BBXriOx2o",
    },
  ],
  l2: [
    {
      title: "Phrase simple et phrase complexe — CM1, CM2 et 6ème — Leçon, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=_Z2xnaAe9Qk",
    },
  ],
  l3: [
    {
      title: "Les propositions dans la phrase — CM1 - CM2 - 6ème - Cycle 3 - Français : grammaire",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=TdsNs6re308",
    },
  ],
  l4: [
    {
      title: "Les expansions du groupe nominal : adjectif épithète et complément du nom — 6ème",
      url: "https://www.youtube.com/watch?v=qUQcxi9qly4",
    },
  ],
  l5: [
    {
      title: "Le présent de l'indicatif : 1er, 2ème et 3ème groupes — 6ème",
      url: "https://www.youtube.com/watch?v=5noY8tSjmDk",
    },
  ],
  l6: [
    {
      title: "Fonctions grammaticales : sujet, COD, COI, attribut du sujet — 6ème",
      url: "https://www.youtube.com/watch?v=wwJjFsbCcd4",
    },
  ],
  l7: [
    {
      title: "Préfixes et suffixes — CM1, CM2 et 6ème — Leçon, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=wvpE4EaJuDY",
    },
  ],
  l8: [
    {
      title: "La structure du texte narratif : situation initiale, péripéties, situation finale — 6ème",
      url: "https://www.youtube.com/watch?v=vm-sUURV880",
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
  console.log(`  (l4, l5, l6, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});