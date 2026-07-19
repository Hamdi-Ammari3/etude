// scripts/seedCol7Francais.js
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

// Could not verify an official 7ème année (collège) français curriculum list
// — only scattered exam archives and directory pages were found, no ordered
// program. This list is reconstructed from standard Tunisian/francophone
// collège français progression, building on confirmed prim-6 français topics
// (COD/COI, imparfait, passé composé, discours direct, participe passé).
// Lower confidence than sourced lists — recommend teacher review before
// treating as final.
const LESSONS = [
  { title: "Les classes de mots (révision) : nom, verbe, adjectif, déterminant", trimestre: 1 },
  { title: "La phrase simple et la phrase complexe", trimestre: 1 },
  { title: "Les propositions indépendantes coordonnées et juxtaposées", trimestre: 1 },
  { title: "Le groupe nominal : expansions (adjectif, complément du nom)", trimestre: 1 },
  { title: "Le présent de l'indicatif : verbes des 3 groupes (révision et approfondissement)", trimestre: 1 },
  { title: "Les fonctions grammaticales : sujet, COD, COI, attribut du sujet", trimestre: 1 },
  { title: "Vocabulaire : la formation des mots (préfixes, suffixes, radicaux)", trimestre: 1 },
  { title: "Production écrite : le texte narratif (structure de base)", trimestre: 1 },

  { title: "L'imparfait et le passé composé dans le récit", trimestre: 2 },
  { title: "Le discours direct et le discours indirect", trimestre: 2 },
  { title: "Les propositions subordonnées relatives", trimestre: 2 },
  { title: "Les compléments circonstanciels (lieu, temps, manière, cause)", trimestre: 2 },
  { title: "Le futur simple et le futur proche", trimestre: 2 },
  { title: "Vocabulaire : synonymes, antonymes et homonymes", trimestre: 2 },
  { title: "La ponctuation et la mise en page d'un dialogue", trimestre: 2 },
  { title: "Production écrite : la description (portrait et paysage)", trimestre: 2 },

  { title: "Le conditionnel présent : formation et emploi", trimestre: 3 },
  { title: "Les propositions subordonnées conjonctives (introduction)", trimestre: 3 },
  { title: "Les figures de style : comparaison, métaphore, personnification", trimestre: 3 },
  { title: "L'accord du participe passé (avec être et avoir)", trimestre: 3 },
  { title: "Vocabulaire : le champ lexical et le champ sémantique", trimestre: 3 },
  { title: "La lettre et le message : formes d'expression écrite courtes", trimestre: 3 },
  { title: "Révision générale : grammaire, conjugaison, orthographe", trimestre: 3 },
  { title: "Préparation à l'évaluation : compréhension et expression écrite", trimestre: 3 },
];

async function seedCol7Francais() {
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
  console.log(`✔ seedCol7Francais: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol7Francais();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});