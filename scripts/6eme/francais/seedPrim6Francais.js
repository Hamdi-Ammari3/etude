// scripts/seedPrim6Francais.js
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

const GRADE_ID = "prim-6";
const SUBJECT_ID = "francais";

// Sourced from a real Tunisian teacher's curriculum planning document (شكيب
// بن مسعود), same source family as prim-5 arabe and prim-6 maths. The source
// itself has gaps (items 2-6, 18, and 23 are entirely missing from the list
// as provided) — preserved faithfully as 16 real lesson entries using our own
// sequential l1-l16 IDs, rather than inventing content to fill the gaps.
// Mapped 2 فترات per trimestre: فترة1+2 → T1 (6 lessons), فترة3+4 → T2
// (4 lessons), فترة5+6 → T3 (6 lessons).
const LESSONS = [
  { title: "Grammaire : Les déterminants, les noms et les pronoms personnels", trimestre: 1 },
  { title: "Grammaire : Les adjectifs (épithète et attribut)", trimestre: 1 },
  { title: "Conjugaison : Conjuguer être/avoir au passé composé et au futur", trimestre: 1 },
  { title: "Orthographe : Les homophones son/sont", trimestre: 1 },
  { title: "La phrase négative (ne...plus, ne...jamais)", trimestre: 1 },
  { title: "Conjugaison : les verbes usuels du type finir au passé composé et au futur", trimestre: 1 },
  { title: "Orthographe : Les homophones et/est", trimestre: 1 },

  { title: "Les compléments essentiels et les compléments non essentiels", trimestre: 2 },
  { title: "Conjugaison : les verbes usuels du type prendre et mettre au passé composé et au futur", trimestre: 2 },
  { title: "Accorder le verbe avec son sujet", trimestre: 2 },
  { title: "Grammaire : reconnaître et utiliser le complément de lieu", trimestre: 2 },
  { title: "Conjuguer les verbes aller et faire au passé composé et au futur", trimestre: 2 },

  { title: "Utiliser le complément de temps", trimestre: 3 },
  { title: "Conjuguer les verbes usuels au passé composé et au futur", trimestre: 3 },
  { title: "Accorder en genre et en nombre : neuf/neuve, gentil/gentille, beau/belle, bon/bonne", trimestre: 3 },
  { title: "Utiliser le complément de manière", trimestre: 3 },
  { title: "Accorder le participe passé employé avec l'auxiliaire être", trimestre: 3 },
];

async function seedPrim6Francais() {
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
  console.log(`✔ seedPrim6Francais: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim6Francais();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});