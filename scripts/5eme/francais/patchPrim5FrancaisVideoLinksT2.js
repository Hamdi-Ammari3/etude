// scripts/patchPrim5FrancaisVideoLinksT2.js
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

const GRADE_ID = "prim-5";
const SUBJECT_ID = "francais";

const VIDEO_LINKS = {
  l9: [
    {
      title: "L'accord sujet-verbe - CM1, CM2 et 6ème - Leçon, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=zGYZkHX0v_I",
    },
  ],
  l10: [
    {
      title: "Le complément d'objet : COD - COI - CE2 / CM1 / CM2 / 6°",
      url: "https://www.youtube.com/watch?v=C74ZnD1xB9g",
    },
  ],
  l11: [
    {
      title: "Les adjectifs qualificatifs CE1 - CE2 - CM1 - CM2",
      url: "https://www.youtube.com/watch?v=NDhlU-p900Q",
    },
  ],
  l12: [
    {
      title: "Le présent des verbes du 3e groupe + être et avoir — CM1 - CM2 - Cycle 3 - Français - Conjugaison",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=cPgLhjON8Pg",
    },
  ],
  l13: [
    {
      title: "Les compléments circonstanciels — CM1 - CM2 - Cycle 3 - Français - Grammaire",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=sdBR0imeOSY",
    },
  ],
  l14: [
    {
      title: "L'imparfait (CE1 - CE2 - CM1 - CM2)",
      url: "https://www.youtube.com/watch?v=C6caY0y06Qc",
    },
  ],
  l15: [
    {
      title: "Les familles de mots — CM1 - CM2 - Cycle 3 - Français - Lexique",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=Ci-AVeJaNHE",
    },
  ],
  l16: [
    {
      title: "Homophones grammaticaux — CM1 - CM2 - 6ème - Cycle 3 - Français - Grammaire",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=iq_NpmADtr4",
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
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});