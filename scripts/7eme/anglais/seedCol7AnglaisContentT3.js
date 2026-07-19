// scripts/seedCol7AnglaisContentT3.js
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
const SUBJECT_ID = "anglais";

// Trimestre 3 — lessons l17 through l24
const LESSON_CONTENT = {
  l17: {
    summary:
      "Découverte du vocabulaire des métiers et de la structure 'going to' pour exprimer des projets futurs déjà décidés, pour pouvoir parler de ce qu'on veut faire plus tard.",
    keyPoints: [
      "Métiers : doctor, engineer, teacher, pilot, chef",
      "'I am going to be a + métier' pour exprimer une intention future",
      "'What are you going to do?' pour demander les projets de quelqu'un",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ going to be a doctor.'",
        options: ["am", "is", "are", "be"],
        answer: 0,
        explanation: "Avec 'I', on utilise 'am' : I am going to be a doctor.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'pilote' (métier) in English?",
        options: ["pilot", "chef", "engineer", "doctor"],
        answer: 0,
        explanation: "'Pilot' est la traduction anglaise de 'pilote'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'She ___ (be) going to study medicine because she wants ___ (be) a doctor.'",
        options: ["is / to be", "are / be", "am / to be", "is / be"],
        answer: 0,
        explanation: "'Is going to' (futur proche) et 'to be' (infinitif après 'wants') sont corrects.",
      },
    ],
    quiz: [
      { question: "How do you say 'ingénieur' in English?", options: ["engineer", "doctor", "pilot", "chef"], answer: 0 },
      { question: "Complete: 'We ___ going to travel next year.'", options: ["am", "is", "are", "be"], answer: 2 },
      { question: "How do you ask about someone's future plans?", options: ["What are you going to do?", "What is your name?", "Where are you?", "How old are you?"], answer: 0 },
      { question: "How do you say 'chef' (cuisinier) in English?", options: ["chef", "boss", "leader", "manager"], answer: 0 },
      { question: "Complete: 'He ___ going to become a teacher.'", options: ["am", "is", "are", "be"], answer: 1 },
    ],
  },

  l18: {
    summary:
      "Découverte du comparatif et du superlatif pour comparer des personnes, des lieux, ou des choses, avec les règles selon la longueur de l'adjectif (court : -er/-est, long : more/most).",
    keyPoints: [
      "Comparatif (adjectifs courts) : + er + than (bigger than)",
      "Comparatif (adjectifs longs) : more + adjectif + than (more beautiful than)",
      "Superlatif : the + adjectif + est / the most + adjectif (the biggest / the most beautiful)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the comparative of 'big'?",
        options: ["big", "bigger", "more big", "biggest"],
        answer: 1,
        explanation: "Adjectif court : bigger.",
      },
      {
        difficulty: "moyen",
        question: "What is the superlative of 'beautiful'?",
        options: ["beautifuler", "more beautiful", "the most beautiful", "beautifulest"],
        answer: 2,
        explanation: "Adjectif long : the most beautiful.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'This mountain is ___ than that one, but Everest is ___ mountain in the world.'",
        options: ["higher / the highest", "high / highest", "more high / the most high", "higher / highest"],
        answer: 0,
        explanation: "'Higher than' (comparatif, adjectif court) et 'the highest' (superlatif, adjectif court).",
      },
    ],
    quiz: [
      { question: "What is the comparative of 'small'?", options: ["small", "smaller", "more small", "smallest"], answer: 1 },
      { question: "What is the superlative of 'fast'?", options: ["faster", "the fastest", "more fast", "the most fast"], answer: 1 },
      { question: "What is the comparative of 'interesting'?", options: ["interestinger", "more interesting", "interestingest", "the most interesting"], answer: 1 },
      { question: "Complete: 'She is ___ than her brother.' (tall)", options: ["tall", "taller", "more tall", "tallest"], answer: 1 },
      { question: "What is the superlative of 'good'? (irregular)", options: ["gooder", "the goodest", "the best", "more good"], answer: 2 },
    ],
  },

  l19: {
    summary:
      "Découverte des expressions pour demander et donner des directions, avec du vocabulaire de lieux dans une ville et des instructions comme turn left/right, go straight.",
    keyPoints: [
      "'Excuse me, where is the...?' pour demander une direction poliment",
      "Instructions : turn left/right, go straight, cross the street",
      "'It is next to/near/opposite the...' pour situer un lieu",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you politely ask for directions?",
        options: ["Excuse me, where is the bank?", "Give me directions now!", "Bank where?", "I want bank"],
        answer: 0,
        explanation: "'Excuse me, where is...?' est la formule polie pour demander un lieu.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'tourner à gauche' in English?",
        options: ["turn right", "turn left", "go straight", "stop here"],
        answer: 1,
        explanation: "'Turn left' signifie 'tourner à gauche'.",
      },
      {
        difficulty: "difficile",
        question: "Complete these directions: 'Go straight, then ___ at the traffic lights, and the school is ___ the bank.'",
        options: ["turn right / next to", "turn right / far from", "go straight / next to", "turn left / opposite from"],
        answer: 0,
        explanation: "'Turn right' complète logiquement les instructions, et 'next to' situe l'école par rapport à la banque.",
      },
    ],
    quiz: [
      { question: "How do you say 'tourner à droite' in English?", options: ["turn left", "turn right", "go straight", "stop"], answer: 1 },
      { question: "How do you say 'aller tout droit' in English?", options: ["turn left", "turn right", "go straight", "stop here"], answer: 2 },
      { question: "How do you say 'en face de' in English?", options: ["next to", "opposite", "under", "behind"], answer: 1 },
      { question: "How do you say 'traverser la rue' in English?", options: ["cross the street", "turn the street", "go the street", "stop the street"], answer: 0 },
      { question: "How do you say 'près de' in English?", options: ["far from", "near", "under", "behind"], answer: 1 },
    ],
  },

  l20: {
    summary:
      "Découverte du vocabulaire de la santé et des parties du corps, avec les expressions pour exprimer une douleur ou un malaise et demander un conseil médical simple.",
    keyPoints: [
      "Parties du corps : head, stomach, throat, back, arm, leg",
      "'I have a + douleur' (Ex: I have a headache = J'ai mal à la tête)",
      "'What is wrong?' / 'I don't feel well' pour exprimer un problème de santé",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'J'ai mal à la tête' in English?",
        options: ["I have a headache", "I have a head", "My head is headache", "I am headache"],
        answer: 0,
        explanation: "'I have a headache' est la structure correcte pour exprimer un mal de tête.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'estomac' in English?",
        options: ["throat", "stomach", "back", "arm"],
        answer: 1,
        explanation: "'Stomach' est la traduction anglaise de 'estomac'.",
      },
      {
        difficulty: "difficile",
        question: "Complete this dialogue: 'What ___ wrong?' — 'I have a sore throat and I ___ (not/feel) well.'",
        options: ["is / don't feel", "are / doesn't feel", "am / not feel", "is / not feeling"],
        answer: 0,
        explanation: "'Is wrong' (structure figée) et 'don't feel' (négation présent simple, 1ère personne).",
      },
    ],
    quiz: [
      { question: "How do you say 'gorge' in English?", options: ["throat", "stomach", "back", "arm"], answer: 0 },
      { question: "How do you say 'dos' in English?", options: ["throat", "stomach", "back", "leg"], answer: 2 },
      { question: "How do you say 'J'ai mal au ventre' in English?", options: ["I have a stomachache", "I have a stomach", "My stomach is ache", "I am stomachache"], answer: 0 },
      { question: "How do you ask what's wrong with someone?", options: ["What is wrong?", "What is your name?", "How old are you?", "Where are you?"], answer: 0 },
      { question: "How do you say 'Je ne me sens pas bien' in English?", options: ["I don't feel well", "I am not well feel", "I not feel well", "I feel don't well"], answer: 0 },
    ],
  },

  l21: {
    summary:
      "Découverte des verbes modaux 'can' (capacité/permission), 'must' (obligation), et 'should' (conseil), utiles pour donner des conseils de santé ou exprimer des règles.",
    keyPoints: [
      "'Can' : capacité ou permission (I can swim. Can I go out?)",
      "'Must' : obligation forte (You must see a doctor.)",
      "'Should' : conseil (You should rest.)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which modal verb expresses advice?",
        options: ["can", "must", "should", "will"],
        answer: 2,
        explanation: "'Should' exprime un conseil.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'You ___ drink more water when you are sick.' (conseil)",
        options: ["can", "must", "should", "will"],
        answer: 2,
        explanation: "'Should' convient pour donner un conseil de santé.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'If you have a fever, you ___ see a doctor, and you ___ rest at home.'",
        options: ["must / should", "can / can", "should / must", "will / will"],
        answer: 0,
        explanation: "'Must' exprime une obligation forte (voir un médecin en cas de fièvre), et 'should' exprime un conseil (se reposer).",
      },
    ],
    quiz: [
      { question: "Which modal verb expresses strong obligation?", options: ["can", "must", "should", "would"], answer: 1 },
      { question: "Complete: 'I ___ swim very well.' (capacité)", options: ["can", "must", "should", "would"], answer: 0 },
      { question: "Complete: 'You ___ wear a seatbelt in the car.' (obligation)", options: ["can", "must", "should", "would"], answer: 1 },
      { question: "Modal verbs are followed by:", options: ["the infinitive with 'to'", "the infinitive without 'to'", "the -ing form", "the past tense"], answer: 1 },
      { question: "Complete: 'You ___ eat more vegetables.' (conseil)", options: ["can", "must", "should", "will"], answer: 2 },
    ],
  },

  l22: {
    summary:
      "Apprentissage de la structure de base pour écrire une courte histoire, combinant les acquis de l'année : passé simple pour les événements, connecteurs chronologiques, et un vocabulaire descriptif varié.",
    keyPoints: [
      "Structure : une situation de départ, des événements (au passé simple), une fin",
      "Connecteurs chronologiques : first, then, after that, finally",
      "Combiner des phrases variées avec des adjectifs et des détails rend l'histoire plus vivante",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which tense is mainly used to write a short story about the past?",
        options: ["present simple", "past simple", "future simple", "present continuous"],
        answer: 1,
        explanation: "Le passé simple est le temps principal pour raconter des événements passés.",
      },
      {
        difficulty: "moyen",
        question: "Which connector introduces the last event in a story?",
        options: ["First", "Then", "Finally", "Before"],
        answer: 2,
        explanation: "'Finally' introduit généralement le dernier événement d'une histoire.",
      },
      {
        difficulty: "difficile",
        question: "Complete this story beginning logically: '___ , the weather was sunny. ___ , dark clouds appeared, and ___ , it started raining heavily.'",
        options: ["First / Then / finally", "Finally / First / then", "Then / finally / first", "First / finally / then"],
        answer: 0,
        explanation: "L'ordre logique est 'First' (situation initiale), 'Then' (événement suivant), 'finally' (conclusion) : First, Then, finally.",
      },
    ],
    quiz: [
      { question: "How do you say 'd'abord' in English?", options: ["First", "Then", "Finally", "Before"], answer: 0 },
      { question: "How do you say 'ensuite' in English?", options: ["First", "Then", "Finally", "Before"], answer: 1 },
      { question: "A good short story includes:", options: ["a beginning, events, and an ending", "only a title", "only dialogue", "no structure"], answer: 0 },
      { question: "Complete: 'Yesterday, I ___ (find) a lost dog in the park.'", options: ["find", "found", "finds", "finding"], answer: 1 },
      { question: "Adjectives in a story help to:", options: ["make it more vivid and descriptive", "make it shorter", "remove details", "confuse the reader"], answer: 0 },
    ],
  },

  l23: {
    summary:
      "Révision générale de tous les points grammaticaux étudiés durant l'année : présent simple/continu, passé simple, futur proche (going to), comparatifs/superlatifs, et verbes modaux.",
    keyPoints: [
      "Présent simple (habitudes) vs présent continu (action en cours)",
      "Passé simple (verbes réguliers et irréguliers) pour les actions terminées",
      "Going to (projets futurs), comparatifs/superlatifs, et modaux (can/must/should)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ (play) tennis every Saturday.' (habitude)",
        options: ["play", "am playing", "played", "will play"],
        answer: 0,
        explanation: "'Every Saturday' indique une habitude : présent simple.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'Yesterday, we ___ (go) to the beach.'",
        options: ["go", "are going", "went", "will go"],
        answer: 2,
        explanation: "'Yesterday' indique le passé : went.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'She ___ (be) going to become a doctor because she ___ (want) to help people.'",
        options: ["is / wants", "are / want", "am / wants", "is / want"],
        answer: 0,
        explanation: "'Is going to' (futur proche, 3ème pers. sing.) et 'wants' (présent simple, 3ème pers. sing.).",
      },
    ],
    quiz: [
      { question: "Complete: 'She ___ (watch) TV right now.'", options: ["watches", "is watching", "watched", "will watch"], answer: 1 },
      { question: "What is the comparative of 'good'?", options: ["gooder", "more good", "better", "goodest"], answer: 2 },
      { question: "Complete: 'You ___ study more.' (conseil)", options: ["can", "must", "should", "will"], answer: 2 },
      { question: "Complete: 'They ___ (visit) their grandmother last week.'", options: ["visit", "are visiting", "visited", "will visit"], answer: 2 },
      { question: "Complete: 'I ___ (travel) to Paris next year; I already booked my ticket.'", options: ["am going to travel", "travel", "traveled", "am travelling now"], answer: 0 },
    ],
  },

  l24: {
    summary:
      "Préparation finale à l'évaluation de fin d'année : révision combinée de la lecture (compréhension de texte), de l'écriture (rédiger un court texte structuré), et de la grammaire (tous les points étudiés durant l'année).",
    keyPoints: [
      "Compréhension : identifier les idées principales et répondre avec des phrases complètes",
      "Expression écrite : structurer un texte avec une introduction, un développement, et une conclusion",
      "Grammaire : revoir tous les temps, le vocabulaire, les comparatifs, et les modaux étudiés",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "When answering a reading comprehension question, you should:",
        options: ["answer with a complete sentence", "answer with one word only always", "guess without reading", "copy the whole text"],
        answer: 0,
        explanation: "Les réponses de compréhension doivent être des phrases complètes pour montrer la compréhension.",
      },
      {
        difficulty: "moyen",
        question: "A good short paragraph should include:",
        options: ["a clear structure with connected ideas", "random unrelated sentences", "no verbs", "only questions"],
        answer: 0,
        explanation: "Un bon paragraphe combine des idées organisées et reliées logiquement.",
      },
      {
        difficulty: "difficile",
        question: "Complete this exam-style sentence: 'My brother ___ (be) an engineer, and he ___ (work) in Tunis.'",
        options: ["is / works", "are / work", "am / working", "be / worked"],
        answer: 0,
        explanation: "'Is' (verbe être) et 'works' (présent simple, -s pour la 3ème personne) sont corrects.",
      },
    ],
    quiz: [
      { question: "What tense is used for habits?", options: ["present simple", "present continuous", "past simple", "future simple"], answer: 0 },
      { question: "What tense is used for a completed past action?", options: ["present simple", "present continuous", "past simple", "future simple"], answer: 2 },
      { question: "What structure expresses a planned future intention?", options: ["going to", "will only", "present simple", "past simple"], answer: 0 },
      { question: "A well-organized paragraph typically has:", options: ["an introduction and logical development", "no structure", "only questions", "only isolated words"], answer: 0 },
      { question: "Which modal verb expresses obligation?", options: ["can", "must", "would", "could"], answer: 1 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 3)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});