// scripts/seedCol9Francais.js
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

const GRADE_ID = "col-9";
const SUBJECT_ID = "francais";

// Sourced directly from the official 9ème année français textbook's
// "tableau synoptique" (synoptic overview table), provided by the user as
// photographs of the actual book. Same highest-confidence tier as col-9
// maths — the real published textbook, not a reconstruction. 5 thematic
// modules (each with Oral/Lecture/Écriture skills + explicit Grammaire/
// Conjugaison/Orthographe/Vocabulaire resources) plus 2 standalone literary
// reading modules (Nom de plume by Micheline La France; Riquet à la houppe
// by Charles Perrault). This replaces the earlier reconstructed 24-lesson
// version entirely — that version had the right general tone (exam-year
// synthesis) but missed real specific content (passé simple, forme passive
// with COD/COI, subjonctif présent, multiple homophone sets, the two
// literary works).
const LESSONS = [
  { title: "Lecture : le texte narratif (Module 1 : Causes à défendre)", trimestre: 1 },
  { title: "Grammaire : l'expression du temps dans la phrase simple et complexe", trimestre: 1 },
  { title: "Conjugaison : le passé simple et l'imparfait", trimestre: 1 },
  { title: "Orthographe : l'accord des adjectifs interrogatifs et exclamatifs, les homophones « Quelle(s) »/« Qu'elle(s) »", trimestre: 1 },
  { title: "Écriture : produire un récit intégrant un dialogue", trimestre: 1 },
  { title: "Lecture : le texte descriptif (Module 2 : Vivre ensemble)", trimestre: 1 },
  { title: "Vocabulaire et style : la synonymie, le sens propre et le sens figuré, la comparaison, la métaphore", trimestre: 1 },
  { title: "Grammaire : les expansions du groupe nominal, les verbes d'état et l'attribut du sujet", trimestre: 1 },
  { title: "Conjugaison : l'imparfait et le plus-que-parfait", trimestre: 1 },
  { title: "Orthographe : l'accord des adjectifs de couleur", trimestre: 1 },
  { title: "Écriture : produire un récit intégrant une description", trimestre: 1 },
  { title: "Module de lecture : Nom de plume de Micheline La France", trimestre: 1 },

  { title: "Lecture : le texte informatif, préparer et conduire une interview", trimestre: 2 },
  { title: "Grammaire : les procédés de reprise, les pronoms COD et COI, la forme passive", trimestre: 2 },
  { title: "Conjugaison : le futur simple et le futur antérieur", trimestre: 2 },
  { title: "Orthographe : les homophones « Quand »/« Quant »/« Qu'en »", trimestre: 2 },
  { title: "Écriture : produire un texte informatif, rédiger un article de presse", trimestre: 2 },
  { title: "Lecture : le texte argumentatif, participer à un débat", trimestre: 2 },
  { title: "Vocabulaire : la synonymie et la polysémie", trimestre: 2 },
  { title: "Grammaire : l'expression de l'opinion, la cause et la conséquence", trimestre: 2 },
  { title: "Conjugaison : le subjonctif présent", trimestre: 2 },
  { title: "Orthographe : l'accord de « Tout »", trimestre: 2 },
  { title: "Écriture : produire un texte argumentatif", trimestre: 2 },

  { title: "Module de lecture : Riquet à la houppe de Charles Perrault", trimestre: 3 },
  { title: "Grammaire : l'expression du but", trimestre: 3 },
  { title: "Conjugaison : le conditionnel présent et le conditionnel passé", trimestre: 3 },
  { title: "Orthographe : les adverbes en -ment, les homophones « S'en »/« Sans »", trimestre: 3 },
  { title: "Écriture : écrire des lettres variées, répondre par écrit à des questions de compréhension", trimestre: 3 },
  { title: "Révision générale et préparation à l'examen du برفوي", trimestre: 3 },
];

async function seedCol9Francais() {
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
  console.log(`✔ seedCol9Francais: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol9Francais();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});