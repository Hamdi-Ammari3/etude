// scripts/seedPrim5Francais.js
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

// l1, l2, l4, l5, l6 are confirmed real Trimestre-1 topics sourced from
// i-learning.tn's annual program sidebar for السنة الخامسة ابتدائي — لغة فرنسية
// (Les types de phrases; Les formes de la phrase; Conjugaison: les trois temps —
// présent, futur, passé composé — split here into 3 lessons for depth). The
// remaining lessons are built from standard 5ème année français progression,
// not individually verified — recommend teacher review before treating as final.
const LESSONS = [
  { title: "Les types de phrases", trimestre: 1 },
  { title: "Les formes de la phrase (affirmative / négative)", trimestre: 1 },
  { title: "Le groupe nominal et ses expansions", trimestre: 1 },
  { title: "Conjugaison : le présent de l'indicatif", trimestre: 1 },
  { title: "Conjugaison : le futur simple", trimestre: 1 },
  { title: "Conjugaison : le passé composé", trimestre: 1 },
  { title: "Les déterminants (articles, possessifs, démonstratifs)", trimestre: 1 },
  { title: "Vocabulaire : synonymes et antonymes", trimestre: 1 },

  { title: "Les fonctions dans la phrase : sujet et verbe", trimestre: 2 },
  { title: "Le complément d'objet direct (COD) et indirect (COI)", trimestre: 2 },
  { title: "L'adjectif qualificatif : accord et place", trimestre: 2 },
  { title: "Les verbes du 2ème et 3ème groupe au présent", trimestre: 2 },
  { title: "Les compléments circonstanciels (lieu, temps, manière)", trimestre: 2 },
  { title: "L'imparfait de l'indicatif", trimestre: 2 },
  { title: "Vocabulaire : les familles de mots", trimestre: 2 },
  { title: "Les homophones grammaticaux (son/sont, on/ont, ce/se)", trimestre: 2 },

  { title: "La ponctuation et le discours direct", trimestre: 3 },
  { title: "Les pronoms relatifs (qui, que, où)", trimestre: 3 },
  { title: "Le futur simple : verbes irréguliers", trimestre: 3 },
  { title: "Les adverbes", trimestre: 3 },
  { title: "Les prépositions", trimestre: 3 },
  { title: "Le conditionnel présent (introduction)", trimestre: 3 },
  { title: "Révision : les temps du récit (passé composé / imparfait)", trimestre: 3 },
  { title: "Révision générale : grammaire, conjugaison, vocabulaire", trimestre: 3 },
];

async function seedPrim5Francais() {
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
  console.log(`✔ seedPrim5Francais: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim5Francais();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});