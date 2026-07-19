// scripts/seedPrim4Francais.js
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
const SUBJECT_ID = "francais";

// Built from the confirmed 9-module structure (module0-module8) of the real
// Tunisian 4ème année primaire français curriculum, each module split into its
// Grammaire / Conjugaison / Orthographe-Vocabulaire components. The individual
// grammar points are standard 4ème-année content; exact module-by-module
// sequencing is reconstructed, not verified against the official textbook —
// recommend teacher review before treating as final.
const LESSONS = [
  // Module 1
  { title: "Le nom : masculin/féminin, singulier/pluriel", trimestre: 1 },
  { title: "Le verbe être au présent", trimestre: 1 },
  { title: "Les articles définis et indéfinis", trimestre: 1 },
  // Module 2
  { title: "La phrase simple : sujet et verbe", trimestre: 1 },
  { title: "Le verbe avoir au présent", trimestre: 1 },
  { title: "La ponctuation (point, virgule, point d'interrogation)", trimestre: 1 },
  // Module 3
  { title: "Le groupe nominal (déterminant + nom + adjectif)", trimestre: 1 },
  { title: "Révision : être et avoir au présent", trimestre: 1 },
  { title: "Le vocabulaire de l'école", trimestre: 1 },

  // Module 4
  { title: "L'adjectif qualificatif", trimestre: 2 },
  { title: "Les verbes du 1er groupe (-er) au présent", trimestre: 2 },
  { title: "Le pluriel des noms (ajout du -s)", trimestre: 2 },
  // Module 5
  { title: "La phrase affirmative et la phrase négative", trimestre: 2 },
  { title: "Les verbes du 1er groupe : cas particuliers (-ger, -cer)", trimestre: 2 },
  { title: "Le vocabulaire de la famille", trimestre: 2 },
  // Module 6
  { title: "Les pronoms personnels sujets", trimestre: 2 },
  { title: "Révision des verbes du 1er groupe au présent", trimestre: 2 },
  { title: "Le féminin des adjectifs", trimestre: 2 },

  // Module 7
  { title: "Les compléments du verbe (COD simple)", trimestre: 3 },
  { title: "Les verbes du 2ème groupe (-ir) au présent", trimestre: 3 },
  { title: "Le vocabulaire du corps humain et de la santé", trimestre: 3 },
  // Module 8
  { title: "Les mots invariables (prépositions simples)", trimestre: 3 },
  { title: "Le futur simple des verbes du 1er groupe", trimestre: 3 },
  { title: "Les homophones (a/à, et/est)", trimestre: 3 },
  // Module 9
  { title: "Révision : les types de phrases", trimestre: 3 },
  { title: "Le futur simple : être et avoir", trimestre: 3 },
  { title: "Le vocabulaire du temps et des saisons", trimestre: 3 },
];

async function seedPrim4Francais() {
  const batch = db.batch();

  LESSONS.forEach((lesson, index) => {
    const order = index + 1;
    const lessonId = `l${order}`;
    const docId = `${GRADE_ID}_${SUBJECT_ID}_${lessonId}`;
    const ref = db.collection("lessons").doc(docId);

    batch.set(ref, {
      gradeId: GRADE_ID,
      subjectId: SUBJECT_ID,
      lessonId,
      order,
      title: lesson.title,
      trimestre: lesson.trimestre,
    });
  });

  await batch.commit();
  console.log(`✔ seedPrim4Francais: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim4Francais();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});