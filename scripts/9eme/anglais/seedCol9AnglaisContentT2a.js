// scripts/seedCol9AnglaisContentT2a.js
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

// Trimestre 2, part A — lessons l11 through l15 (Module 3: Health and
// Environment). Grammar points and functions confirmed from the real
// textbook synopsis. Content reconstructed to teach that specific grammar —
// NOT verified against actual textbook exercises/texts.
const LESSON_CONTENT = {
  l11: {
    summary:
      "Le thème 'Air and land pollution' aborde la pollution environnementale, avec les connecteurs logiques (linkers) 'so', 'therefore', et 'because' pour organiser une séquence d'événements ou de causes/conséquences.",
    keyPoints: [
      "'Because' introduit une cause (Factories pollute because they burn fossil fuels.)",
      "'So' et 'therefore' introduisent une conséquence (Air is polluted, so people get sick. / ... therefore, people get sick.)",
      "Vocabulaire : skin rash, ozone layer, fumes, smog, inflammable, solvents, glues",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which linker introduces a cause?",
        options: ["because", "so", "therefore", "then"],
        answer: 0,
        explanation: "'Because' introduit la cause d'un événement ou d'une situation.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'couche d'ozone' in English?",
        options: ["ozone layer", "skin rash", "smog", "solvent"],
        answer: 0,
        explanation: "'Ozone layer' est la traduction anglaise de 'couche d'ozone'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Factories release harmful fumes, ___ the air quality decreases significantly.'",
        options: ["therefore", "because", "although", "unless"],
        answer: 0,
        explanation: "'Therefore' introduit la conséquence logique (la baisse de qualité de l'air) résultant de la cause précédente.",
      },
    ],
    quiz: [
      { question: "How do you say 'inflammable' in English?", options: ["inflammable", "unbreakable", "washable", "durable"], answer: 0 },
      { question: "How do you say 'éruption cutanée' in English?", options: ["skin rash", "skin cream", "sunburn only", "skin color"], answer: 0 },
      { question: "How do you say 'brouillard de pollution (smog)' in English?", options: ["smog", "fog", "rain", "mist"], answer: 0 },
      { question: "Which linker introduces a consequence?", options: ["so", "because", "although", "since (cause)"], answer: 0 },
      { question: "How do you say 'colles' in English?", options: ["glues", "solvents only", "fumes", "smog"], answer: 0 },
    ],
  },

  l12: {
    summary:
      "Le thème 'Smoking and health' aborde les dangers du tabac, avec les verbes modaux 'may' et 'might' pour exprimer une possibilité (moins certaine que 'will').",
    keyPoints: [
      "'May' et 'might' expriment une possibilité (Smoking may cause cancer. / He might quit smoking soon.)",
      "'Might' est légèrement moins certain que 'may'",
      "Vocabulaire : waste, landfill, threat, to spill, impact, to ruin, particles, to discharge, to inhale",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'Smoking ___ cause serious health problems.' (possibility)",
        options: ["may", "must", "should", "will always"],
        answer: 0,
        explanation: "'May' exprime une possibilité, appropriée pour parler des risques potentiels du tabac.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'inhaler' in English?",
        options: ["to inhale", "to exhale only", "to breathe out", "to spill"],
        answer: 0,
        explanation: "'To inhale' signifie inspirer ou inhaler (comme la fumée de cigarette).",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'If he continues smoking, his health ___ deteriorate further.'",
        options: ["might", "must", "should", "will definitely"],
        answer: 0,
        explanation: "'Might' exprime une possibilité (moins certaine que 'will'), appropriée pour une conséquence potentielle mais non garantie.",
      },
    ],
    quiz: [
      { question: "How do you say 'décharge (déchets)' in English?", options: ["landfill", "smog", "ozone layer", "skin rash"], answer: 0 },
      { question: "How do you say 'menace' in English?", options: ["threat", "safety", "protection", "benefit"], answer: 0 },
      { question: "How do you say 'renverser (un liquide)' in English?", options: ["to spill", "to inhale", "to discharge", "to ruin"], answer: 0 },
      { question: "How do you say 'ruiner' in English?", options: ["to ruin", "to build", "to protect", "to save"], answer: 0 },
      { question: "'Might' expresses:", options: ["a possibility", "a strong obligation", "a certainty", "a past habit"], answer: 0 },
    ],
  },

  l13: {
    summary:
      "Le thème 'Pollution, a threat to our environment' utilise les pronoms relatifs 'who', 'which', et 'that' pour définir des personnes ou des objets liés à la pollution.",
    keyPoints: [
      "'Who' pour les personnes (The scientist who studies pollution...)",
      "'Which' pour les choses (The waste which pollutes rivers...)",
      "'That' pour les personnes ou les choses, souvent à l'oral (The factory that pollutes the air...)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'The scientist ___ studies pollution works at this university.'",
        options: ["who", "which", "whose", "where"],
        answer: 0,
        explanation: "'Who' s'utilise pour une personne (le scientifique).",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'The waste ___ pollutes rivers comes from factories.'",
        options: ["which", "who", "whose", "where"],
        answer: 0,
        explanation: "'Which' s'utilise pour une chose (les déchets).",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'The company ___ dumps chemicals in the river must be fined immediately.'",
        options: ["that", "who", "whom", "whose"],
        answer: 0,
        explanation: "'That' peut s'utiliser pour une chose comme 'company' (compagnie), et introduit une proposition relative essentielle.",
      },
    ],
    quiz: [
      { question: "Which pronoun is used for people?", options: ["who", "which", "that (things)", "whose (possession)"], answer: 0 },
      { question: "Which pronoun is used for things?", options: ["which", "who", "whom", "none of these"], answer: 0 },
      { question: "Complete: 'The bins ___ collect waste are placed everywhere.'", options: ["which", "who", "whom", "whose"], answer: 0 },
      { question: "Complete: 'The man ___ works at the recycling center is my uncle.'", options: ["who", "which", "whose", "where"], answer: 0 },
      { question: "'That' can be used for:", options: ["both people and things", "only people", "only things", "neither people nor things"], answer: 0 },
    ],
  },

  l14: {
    summary:
      "Le thème 'Save the earth!' propose des solutions écologiques, avec les modaux d'obligation et de conseil : 'should', 'ought to', 'must', et 'don't' (impératif négatif pour interdire).",
    keyPoints: [
      "'Should'/'ought to' : conseil (We should recycle more.)",
      "'Must' : obligation forte (We must protect endangered species.)",
      "'Don't...' : impératif négatif, interdiction (Don't waste water.)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'We ___ recycle more to help the planet.' (advice)",
        options: ["should", "must", "don't", "can't"],
        answer: 0,
        explanation: "'Should' exprime un conseil, approprié pour recommander le recyclage.",
      },
      {
        difficulty: "moyen",
        question: "Complete: '___ waste water; it's a precious resource.' (prohibition)",
        options: ["Don't", "Do", "Should", "Ought to"],
        answer: 0,
        explanation: "'Don't' + verbe forme l'impératif négatif, ici pour interdire de gaspiller l'eau.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Governments ___ take urgent action against pollution.' (strong obligation)",
        options: ["must", "might", "could", "would"],
        answer: 0,
        explanation: "'Must' exprime une obligation forte et urgente, appropriée pour l'action gouvernementale contre la pollution.",
      },
    ],
    quiz: [
      { question: "Which modal expresses advice?", options: ["should", "must", "don't", "can't"], answer: 0 },
      { question: "Which modal expresses strong obligation?", options: ["must", "should", "ought to", "might"], answer: 0 },
      { question: "How do you say 'espèce' (biologique) in English?", options: ["species", "campaign", "recycling", "threat"], answer: 0 },
      { question: "How do you say 'campagne (de sensibilisation)' in English?", options: ["campaign", "species", "recycling", "bins"], answer: 0 },
      { question: "'Ought to' is similar in meaning to:", options: ["should", "must", "don't", "might"], answer: 0 },
    ],
  },

  l15: {
    summary:
      "Le thème 'Let everyday be an Earth Day' encourage l'action écologique quotidienne, avec la formation de noms par le suffixe '-er' (ajouté à un verbe pour désigner celui qui fait l'action, comme 'recycler').",
    keyPoints: [
      "Formation de noms avec '-er' : verbe + er = personne qui fait l'action (recycle → recycler)",
      "Vocabulaire : bins, recycling, organic, legumes, fatty, sugary, salty, crunchy",
      "Ce suffixe est très productif en anglais pour désigner un agent ou un outil",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What noun is formed from the verb 'recycle' using -er?",
        options: ["recycler", "recycling only", "recycled", "recycles"],
        answer: 0,
        explanation: "'Recycle' + er = 'recycler' (celui qui recycle, ou l'appareil de recyclage).",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'poubelles' in English?",
        options: ["bins", "recycling", "campaign", "species"],
        answer: 0,
        explanation: "'Bins' est la traduction anglaise de 'poubelles'.",
      },
      {
        difficulty: "difficile",
        question: "What noun would you form from 'compute' using -er, and what does it mean?",
        options: ["computer, meaning a machine or device that computes", "computering, which is not a real word", "computed, a past tense form", "computes, a present tense verb form"],
        answer: 0,
        explanation: "'Compute' + er = 'computer', désignant la machine qui effectue des calculs — un exemple classique du suffixe -er formant un nom d'agent/outil.",
      },
    ],
    quiz: [
      { question: "How do you say 'biologique (nourriture)' in English?", options: ["organic", "fatty", "sugary", "salty"], answer: 0 },
      { question: "How do you say 'légumes' in English?", options: ["legumes", "fruits", "meat", "dairy"], answer: 0 },
      { question: "How do you say 'gras' in English?", options: ["fatty", "sugary", "salty", "crunchy"], answer: 0 },
      { question: "How do you say 'croustillant' in English?", options: ["crunchy", "fatty", "salty", "sugary"], answer: 0 },
      { question: "The suffix '-er' added to a verb usually forms:", options: ["a noun for the person/thing that does the action", "an adjective", "an adverb", "a past tense verb"], answer: 0 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 2, part A)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});