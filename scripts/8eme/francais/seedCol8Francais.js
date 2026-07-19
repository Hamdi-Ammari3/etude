// scripts/seedCol8Francais.js
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

// Could not verify an official col-8 français curriculum list — only site
// navigation pages were found (Tadris.TN), no actual program content. This
// list is reconstructed from standard Tunisian/francophone collège français
// progression, building directly on confirmed col-7 français topics
// (discours direct/indirect, subordonnées relatives, participe passé,
// figures de style simples). Recommend teacher review before treating as
// final.
const LESSONS = [
  { title: "Les types et formes de phrases (approfondissement et cas complexes)", trimestre: 1 },
  { title: "Les propositions subordonnées circonstancielles de temps", trimestre: 1 },
  { title: "Les propositions subordonnées circonstancielles de cause et de conséquence", trimestre: 1 },
  { title: "Le plus-que-parfait de l'indicatif", trimestre: 1 },
  { title: "Les fonctions du groupe nominal (approfondissement)", trimestre: 1 },
  { title: "Vocabulaire : la dérivation et la composition des mots", trimestre: 1 },
  { title: "Les paronymes et les niveaux de langue", trimestre: 1 },
  { title: "Production écrite : le récit au passé (cohérence des temps)", trimestre: 1 },

  { title: "Le texte argumentatif : thèse et arguments", trimestre: 2 },
  { title: "Les connecteurs logiques (cependant, donc, en effet, par conséquent)", trimestre: 2 },
  { title: "Les propositions subordonnées circonstancielles de but et d'opposition", trimestre: 2 },
  { title: "Le conditionnel passé", trimestre: 2 },
  { title: "Le passif : formation et emploi", trimestre: 2 },
  { title: "Vocabulaire : le lexique de l'argumentation", trimestre: 2 },
  { title: "La nominalisation avancée", trimestre: 2 },
  { title: "Production écrite : rédiger un paragraphe argumentatif", trimestre: 2 },

  { title: "Le discours rapporté : concordance des temps approfondie", trimestre: 3 },
  { title: "Les figures de style avancées (antithèse, hyperbole, gradation)", trimestre: 3 },
  { title: "L'expression de l'hypothèse (si + temps variés)", trimestre: 3 },
  { title: "La ponctuation expressive et stylistique", trimestre: 3 },
  { title: "Vocabulaire : le registre soutenu et le registre familier", trimestre: 3 },
  { title: "Analyse de texte : identifier le point de vue narratif", trimestre: 3 },
  { title: "Révision générale : grammaire, conjugaison, vocabulaire", trimestre: 3 },
  { title: "Préparation à l'évaluation finale", trimestre: 3 },
];

async function seedCol8Francais() {
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
  console.log(`✔ seedCol8Francais: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol8Francais();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});