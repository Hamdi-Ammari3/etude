// scripts/seedCol9AnglaisContentT1b.js
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

// Trimestre 1, part B — lessons l6 through l10 (Module 2: Education)
// Grammar points and functions confirmed from the real textbook synopsis.
// Content reconstructed to teach that specific grammar — NOT verified
// against actual textbook exercises/texts.
const LESSON_CONTENT = {
  l6: {
    summary:
      "Le thème 'School memories' porte sur les souvenirs scolaires, avec le génitif ('s) pour exprimer la possession, et les pronoms possessifs (mine, yours, his, hers, ours, theirs) pour remplacer un nom possédé.",
    keyPoints: [
      "Le génitif : possesseur + 's + objet possédé (My teacher's book)",
      "Pronoms possessifs : mine, yours, his, hers, ours, theirs (This book is mine.)",
      "Vocabulaire : memory, preparatory, grade, mark, to notice, to erase",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'le livre de mon professeur' using the genitive?",
        options: ["my teacher's book", "the book of my teacher", "my teacher book's", "book's my teacher"],
        answer: 0,
        explanation: "'My teacher's book' est la structure correcte du génitif en anglais.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'This pen is not yours, it's ___.' (belonging to me)",
        options: ["mine", "my", "me", "I"],
        answer: 0,
        explanation: "'Mine' est le pronom possessif remplaçant 'my pen' : this pen is mine.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'These are not our books, they are ___.' (belonging to them)",
        options: ["theirs", "their", "them", "they"],
        answer: 0,
        explanation: "'Theirs' est le pronom possessif remplaçant 'their books' : they are theirs.",
      },
    ],
    quiz: [
      { question: "How do you say 'note (scolaire)' in English?", options: ["mark", "memory", "grade", "both mark and grade are correct"], answer: 3 },
      { question: "How do you say 'remarquer' in English?", options: ["to notice", "to erase", "to prepare", "to test"], answer: 0 },
      { question: "How do you say 'effacer' in English?", options: ["to erase", "to notice", "to test", "to prepare"], answer: 0 },
      { question: "Which is a possessive pronoun?", options: ["hers", "she", "her (adjective)", "he"], answer: 0 },
      { question: "Complete: 'Is this bag yours or ___?' (belonging to him)", options: ["his", "he", "him", "himself"], answer: 0 },
    ],
  },

  l7: {
    summary:
      "Le thème 'School rules' aborde les règles scolaires, avec la structure 'going to' pour exprimer une intention future, et les pronoms réfléchis (myself, yourself, himself, herself...) pour indiquer que l'action revient au sujet.",
    keyPoints: [
      "'Going to' + infinitif : intention future (I am going to follow the rules.)",
      "Pronoms réfléchis : myself, yourself, himself, herself, itself, ourselves, yourselves, themselves",
      "Vocabulaire : to dream, to fall, awake, unless, earthquake, cool, loud",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ going to study harder this year.'",
        options: ["am", "is", "are", "be"],
        answer: 0,
        explanation: "Avec 'I', on utilise 'am' : I am going to study.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'She hurt ___ while playing.'",
        options: ["herself", "himself", "themselves", "itself"],
        answer: 0,
        explanation: "'Herself' est le pronom réfléchi correspondant au sujet féminin 'she'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: '___ you follow the school rules, you will get in trouble.'",
        options: ["Unless", "Because", "So", "And"],
        answer: 0,
        explanation: "'Unless' signifie 'à moins que', introduisant une condition négative : à moins que tu suives les règles.",
      },
    ],
    quiz: [
      { question: "How do you say 'rêver' in English?", options: ["to dream", "to fall", "to notice", "to erase"], answer: 0 },
      { question: "How do you say 'tomber' in English?", options: ["to fall", "to dream", "awake", "loud"], answer: 0 },
      { question: "How do you say 'éveillé' in English?", options: ["awake", "asleep", "tired", "dreaming"], answer: 0 },
      { question: "Which is a reflexive pronoun?", options: ["myself", "me", "I", "my"], answer: 0 },
      { question: "How do you say 'bruyant' in English?", options: ["loud", "cool", "awake", "unless"], answer: 0 },
    ],
  },

  l8: {
    summary:
      "Le thème 'First day at school' raconte le premier jour d'école, s'appuyant sur le passé simple, les verbes irréguliers, et les participes passés pour parler d'une action passée achevée.",
    keyPoints: [
      "Passé simple des verbes irréguliers : go→went, see→saw, feel→felt",
      "Participe passé : utilisé avec 'have' (present perfect) ou seul comme adjectif (a forgotten memory)",
      "Vocabulaire : fun, to pretend, to shake hands, to forget, to meet",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the past simple of 'go'?",
        options: ["went", "goed", "gone", "going"],
        answer: 0,
        explanation: "'Went' est le passé simple irrégulier de 'go'.",
      },
      {
        difficulty: "moyen",
        question: "What is the past simple of 'meet'?",
        options: ["met", "meeted", "meet", "meeting"],
        answer: 0,
        explanation: "'Met' est le passé simple irrégulier de 'meet'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'On my first day, I ___ (feel) nervous, so I ___ (pretend) to be confident.'",
        options: ["felt / pretended", "feel / pretend", "feeled / pretend", "felt / pretend"],
        answer: 0,
        explanation: "'Felt' (passé irrégulier de feel) et 'pretended' (passé régulier de pretend), tous deux au passé simple.",
      },
    ],
    quiz: [
      { question: "What is the past simple of 'see'?", options: ["saw", "seed", "seen", "seeing"], answer: 0 },
      { question: "How do you say 'faire semblant' in English?", options: ["to pretend", "to forget", "to meet", "to shake"], answer: 0 },
      { question: "How do you say 'serrer la main' in English?", options: ["to shake hands", "to shake legs", "to hold hands only", "to wave"], answer: 0 },
      { question: "What is the past simple of 'forget'?", options: ["forgot", "forgetted", "forgeted", "forgetting"], answer: 0 },
      { question: "How do you say 'amusant' in English?", options: ["fun", "boring", "sad", "tired"], answer: 0 },
    ],
  },

  l9: {
    summary:
      "Le thème 'Violence at school' aborde le sujet sensible de la violence scolaire, avec 'has to/must' pour exprimer l'obligation, et les prépositions de lieu (over, next to) et de mouvement (along, across) pour situer des actions.",
    keyPoints: [
      "'Has to/must' expriment l'obligation (Schools must protect students. / Every student has to respect others.)",
      "Prépositions de lieu : over, next to. Prépositions de mouvement : along, across",
      "Vocabulaire : to believe, used to, to move, accent, to taunt, mad, to participate",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'Schools ___ protect all students from bullying.' (strong obligation)",
        options: ["must", "can", "might", "would"],
        answer: 0,
        explanation: "'Must' exprime une obligation forte, appropriée pour un devoir des écoles.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'se moquer méchamment de quelqu'un' in English?",
        options: ["to taunt", "to believe", "to move", "to participate"],
        answer: 0,
        explanation: "'To taunt' signifie railler ou se moquer méchamment de quelqu'un.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'The bully walked ___ the corridor and pushed a student ___ the wall.'",
        options: ["along / against", "across / next to", "over / along", "next to / over"],
        answer: 0,
        explanation: "'Along the corridor' (le long du couloir, mouvement) et 'against the wall' (contre le mur, position).",
      },
    ],
    quiz: [
      { question: "How do you say 'participer' in English?", options: ["to participate", "to taunt", "to believe", "to move"], answer: 0 },
      { question: "How do you say 'fou/furieux' in English?", options: ["mad", "calm", "happy", "bored"], answer: 0 },
      { question: "Which preposition indicates movement across a space?", options: ["across", "next to", "over (position)", "at"], answer: 0 },
      { question: "How do you say 'accent' in English?", options: ["accent", "voice", "sound", "tone"], answer: 0 },
      { question: "Complete: 'Every student ___ respect the school rules.' (obligation)", options: ["has to", "can", "might", "would"], answer: 0 },
    ],
  },

  l10: {
    summary:
      "Le thème 'School life' synthétise les projets futurs, avec trois structures pour exprimer le futur : 'going to' (intention planifiée), 'intend to' (intention formelle), et 'in ten years time, I'll...' (prédiction à long terme avec 'will').",
    keyPoints: [
      "'Going to' : intention déjà décidée (I am going to study medicine.)",
      "'Intend to' : intention plus formelle (I intend to become a doctor.)",
      "'In ten years time, I'll...' : prédiction à long terme avec 'will' (In ten years time, I'll have my own clinic.)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ going to study engineering.' (planned intention)",
        options: ["am", "is", "are", "be"],
        answer: 0,
        explanation: "'Am going to' exprime une intention déjà décidée.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'She ___ (intend) to become a teacher.'",
        options: ["intends", "intend", "intending", "intended"],
        answer: 0,
        explanation: "3ème personne du singulier au présent simple : intends.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'In ten years time, I ___ (have) my own business.'",
        options: ["will have", "have", "am having", "had"],
        answer: 0,
        explanation: "'Will have' exprime une prédiction à long terme sur l'avenir, structure typique avec 'in ten years time'.",
      },
    ],
    quiz: [
      { question: "How do you say 'obtenir' in English?", options: ["to get on", "to get off", "to get out", "to get in"], answer: 0 },
      { question: "How do you say 's'attendre à' in English?", options: ["to expect", "to spend", "to send", "to realise"], answer: 0 },
      { question: "How do you say 'sensible' in English?", options: ["sensitive", "sensible (careful)", "senseless", "sensory"], answer: 0 },
      { question: "Which structure expresses a formal intention?", options: ["intend to", "will (prediction)", "can", "might"], answer: 0 },
      { question: "Complete: 'In the future, robots ___ (do) many jobs.' (long-term prediction)", options: ["will do", "do", "are doing", "did"], answer: 0 },
    ],
  },
};

async function seedContent() {
  const batch = db.batch();
  let count = 0;

  for (const [lessonId, content] of Object.entries(LESSON_CONTENT)) {
    const docId = `${GRADE_ID}_${SUBJECT_ID}_${lessonId}`;
    const ref = db.collection("lessonContent").doc(docId);
    batch.set(ref, content);
    count++;
  }

  await batch.commit();
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1, part B)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});