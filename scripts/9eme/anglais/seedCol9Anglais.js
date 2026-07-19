// scripts/seedCol9Anglais.js
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
const SUBJECT_ID = "anglais";

// Sourced directly from the official 9ème année English textbook's module
// synopsis table, provided by the user as photographs of the actual book.
// Same highest-confidence tier as col-9 maths/français — the real published
// textbook, not a reconstruction. 6 modules (Family Life, Education, Health
// and Environment, Services, Entertainment, Civility) x 5 lessons each = 30
// lessons, each with explicit Functions and Grammar points from the book.
// This replaces the earlier reconstructed 24-lesson version entirely.
const LESSONS = [
  { title: "Family relationships (question words, adjectives)", trimestre: 1 },
  { title: "Sharing family responsibilities (comparatives, the superlative)", trimestre: 1 },
  { title: "The Generation Gap (compound adjectives)", trimestre: 1 },
  { title: "Pocket money (As + adjective + As)", trimestre: 1 },
  { title: "Safety at home (while / whereas)", trimestre: 1 },
  { title: "School memories (the genitive, possessive pronouns)", trimestre: 1 },
  { title: "School rules (going to, reflexive pronouns)", trimestre: 1 },
  { title: "First day at school (simple past, irregular verbs, past participles)", trimestre: 1 },
  { title: "Violence at school (has to/must, prepositions of location/movement)", trimestre: 1 },
  { title: "School life (the future: going to, intend to, in ten years time I'll)", trimestre: 1 },

  { title: "Air and land pollution (linkers: so, therefore, because)", trimestre: 2 },
  { title: "Smoking and health (may/might)", trimestre: 2 },
  { title: "Pollution, a threat to our environment (who/which/that)", trimestre: 2 },
  { title: "Save the earth! (should/ought to/must/don't)", trimestre: 2 },
  { title: "Let everyday be an Earth Day (noun formation: -er)", trimestre: 2 },
  { title: "At the airport (would you mind + Ving, could you + VP)", trimestre: 2 },
  { title: "Internet shopping (mind + NP, Look out!)", trimestre: 2 },
  { title: "Tourism (the present perfect tense)", trimestre: 2 },
  { title: "Transport (first conditional: if + present → future)", trimestre: 2 },
  { title: "Communication (gerund + noun, noun + gerund)", trimestre: 2 },

  { title: "Means of entertainment (expressing uncertainty/certainty)", trimestre: 3 },
  { title: "Eating out (exclamations, expressing satisfaction)", trimestre: 3 },
  { title: "Where shall we go? (making suggestions)", trimestre: 3 },
  { title: "Let's watch a film! (expressing regret)", trimestre: 3 },
  { title: "Stars pastimes (showing interest, showing indifference)", trimestre: 3 },
  { title: "Voluntary work (can/cannot: ability/inability)", trimestre: 3 },
  { title: "Volunteering kids (offering help)", trimestre: 3 },
  { title: "How to be cooperative (the past progressive)", trimestre: 3 },
  { title: "Clubs, associations and charities (expressing opinion)", trimestre: 3 },
  { title: "Tolerance and respect for others (expressing hope)", trimestre: 3 },
];

async function seedCol9Anglais() {
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
  console.log(`✔ seedCol9Anglais: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol9Anglais();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});