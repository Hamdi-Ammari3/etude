// scripts/seedCol9AnglaisContentT1a.js
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

// Trimestre 1, part A — lessons l1 through l5 (Module 1: Family Life)
// Grammar points and functions confirmed from the real textbook synopsis.
// Content reconstructed to teach that specific grammar — NOT verified
// against actual textbook exercises/texts.
const LESSON_CONTENT = {
  l1: {
    summary:
      "Découverte du vocabulaire des relations familiales élargies et des adjectifs pour décrire des situations familiales, avec les mots interrogatifs (question words) pour poser des questions précises sur la famille.",
    keyPoints: [
      "Mots interrogatifs : who, what, where, when, why, how, whose",
      "Vocabulaire : supportive, easy-going, wisdom, divorce, orphanage, to afford",
      "'Whose' interroge sur la possession (Whose photo is this?)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you ask about the owner of something?",
        options: ["Whose is this?", "Who is this?", "What is this?", "Where is this?"],
        answer: 0,
        explanation: "'Whose' s'utilise pour demander à qui appartient quelque chose.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'compréhensif/bienveillant' in English?",
        options: ["supportive", "severe", "easy-going", "miserable"],
        answer: 0,
        explanation: "'Supportive' décrit une personne compréhensive et bienveillante envers les autres.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My parents can't ___ a big house, so we live in a small flat.'",
        options: ["afford", "effort", "afraid", "efford"],
        answer: 0,
        explanation: "'To afford' signifie 'avoir les moyens de', ici financièrement pour une grande maison.",
      },
    ],
    quiz: [
      { question: "How do you say 'divorce' in English?", options: ["divorce", "marriage", "wedding", "engagement"], answer: 0 },
      { question: "How do you say 'orphelinat' in English?", options: ["orphanage", "hospital", "school", "prison"], answer: 0 },
      { question: "How do you say 'décontracté/facile à vivre' in English?", options: ["easy-going", "severe", "miserable", "supportive"], answer: 0 },
      { question: "Which question word asks about a reason?", options: ["why", "who", "where", "when"], answer: 0 },
      { question: "How do you say 'sagesse' in English?", options: ["wisdom", "fighting", "divorce", "affording"], answer: 0 },
    ],
  },

  l2: {
    summary:
      "Distinction entre les faits (fact) et les opinions (opinion), avec le comparatif et le superlatif pour comparer des responsabilités familiales ou des situations entre membres d'une famille.",
    keyPoints: [
      "Un fait est vérifiable objectivement ; une opinion exprime un jugement personnel",
      "Comparatif (adjectifs courts) : + er + than (older than). Comparatif (adjectifs longs) : more + than",
      "Superlatif : the + adjectif + est / the most + adjectif",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the comparative of 'demanding'?",
        options: ["more demanding", "demandinger", "the most demanding", "demanding"],
        answer: 0,
        explanation: "'Demanding' est un adjectif long, son comparatif utilise 'more' : more demanding.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'She is ___ (responsible) than her brother.'",
        options: ["more responsible", "responsibler", "the most responsible", "responsible"],
        answer: 0,
        explanation: "'Responsible' est un adjectif long : more responsible than.",
      },
      {
        difficulty: "difficile",
        question: "Is 'My father works too much' a fact or an opinion, and why?",
        options: ["an opinion, because 'too much' expresses a personal judgment rather than a verifiable, objective measurement", "a fact, because it can be measured exactly", "neither a fact nor an opinion", "both a fact and an opinion equally"],
        answer: 0,
        explanation: "'Too much' est une évaluation subjective (ce qui est 'trop' varie selon la personne), donc c'est une opinion plutôt qu'un fait objectivement vérifiable.",
      },
    ],
    quiz: [
      { question: "What is the superlative of 'demanding'?", options: ["the most demanding", "demandingest", "more demanding", "demanding"], answer: 0 },
      { question: "How do you say 'partager' in English?", options: ["to share", "to keep", "to sell", "to buy"], answer: 0 },
      { question: "A fact is:", options: ["objective and verifiable", "a personal judgment", "always false", "the same as an opinion"], answer: 0 },
      { question: "What is the comparative of 'busy'?", options: ["busier", "more busy", "the busiest", "busy"], answer: 0 },
      { question: "An opinion is:", options: ["a personal point of view", "always verifiable", "the same as a fact", "never subjective"], answer: 0 },
    ],
  },

  l3: {
    summary:
      "Le thème 'The Generation Gap' explore les différences entre générations (parents/enfants), avec les adjectifs composés (compound adjectives), qui combinent deux mots pour former un seul adjectif descriptif.",
    keyPoints: [
      "Adjectif composé : deux mots reliés par un trait d'union, formant un seul adjectif (dog-headed, well-known)",
      "Vocabulaire du thème : to agree, to argue, embarrassed, to break the rules, to sneak out",
      "Les adjectifs composés précèdent généralement le nom qu'ils qualifient",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'gêné/embarrassé' in English?",
        options: ["embarrassed", "proud", "confident", "relaxed"],
        answer: 0,
        explanation: "'Embarrassed' est la traduction anglaise de 'gêné' ou 'embarrassé'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'enfreindre les règles' in English?",
        options: ["to break the rules", "to make the rules", "to follow the rules", "to write the rules"],
        answer: 0,
        explanation: "'To break the rules' signifie 'enfreindre' ou 'ne pas respecter les règles'.",
      },
      {
        difficulty: "difficile",
        question: "What is a compound adjective, and give an example related to this module's theme.",
        options: ["two words joined (often with a hyphen) to form a single descriptive adjective, like 'dog-headed'", "an adjective with only one syllable", "a verb used as an adjective", "an adjective that never changes form"],
        answer: 0,
        explanation: "Un adjectif composé combine deux mots (souvent avec un trait d'union) pour créer un seul adjectif, comme 'dog-headed' (têtu comme un chien).",
      },
    ],
    quiz: [
      { question: "How do you say 'se disputer' in English?", options: ["to argue", "to agree", "to sleep", "to eat"], answer: 0 },
      { question: "How do you say 's'éclipser/sortir en cachette' in English?", options: ["to sneak out", "to walk in", "to stay in", "to come back"], answer: 0 },
      { question: "How do you say 'être d'accord' in English?", options: ["to agree", "to argue", "to disagree", "to fight"], answer: 0 },
      { question: "A compound adjective usually combines:", options: ["two words with a hyphen", "three separate sentences", "a verb and a question word", "nothing in particular"], answer: 0 },
      { question: "How do you say 'la génération' in English?", options: ["generation", "generator", "general", "generosity"], answer: 0 },
    ],
  },

  l4: {
    summary:
      "Le thème 'Pocket money' aborde l'argent de poche et son usage, avec la structure comparative 'As + adjective + As' pour exprimer l'égalité entre deux éléments comparés.",
    keyPoints: [
      "'As + adjective + As' exprime l'égalité (This is as expensive as that one.)",
      "Vocabulaire : savings, extras, to purchase, overspending, an addiction, hard-earned",
      "Utile pour comparer des dépenses ou des habitudes financières entre deux personnes ou situations",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'This book is ___ expensive ___ that one.' (equality)",
        options: ["as / as", "more / than", "the most / of", "than / as"],
        answer: 0,
        explanation: "'As...as' exprime l'égalité entre deux éléments comparés : as expensive as.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'économies' in English?",
        options: ["savings", "extras", "purchase", "addiction"],
        answer: 0,
        explanation: "'Savings' est la traduction anglaise d'économies (argent mis de côté).",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My pocket money is not ___ big ___ my sister's, so I have to save more carefully.'",
        options: ["as / as", "more / than", "the most / of", "as / than"],
        answer: 0,
        explanation: "'Not as...as' exprime une infériorité (moins grand que), utilisant la même structure comparative d'égalité inversée.",
      },
    ],
    quiz: [
      { question: "How do you say 'acheter' in English?", options: ["to purchase", "to sell", "to save", "to spend nothing"], answer: 0 },
      { question: "How do you say 'dépense excessive' in English?", options: ["overspending", "saving", "purchasing", "earning"], answer: 0 },
      { question: "How do you say 'durement gagné' in English?", options: ["hard-earned", "easily earned", "never earned", "over-earned"], answer: 0 },
      { question: "Complete: 'She is ___ tall ___ her brother.' (equality)", options: ["as / as", "more / than", "the most / of", "than / as"], answer: 0 },
      { question: "How do you say 'dépendance' in English?", options: ["addiction", "savings", "purchase", "extras"], answer: 0 },
    ],
  },

  l5: {
    summary:
      "Le thème 'Safety at home' porte sur la sécurité domestique et le transfert d'information (scanning pour informations spécifiques), avec les conjonctions 'while' et 'whereas' pour exprimer un contraste entre deux situations.",
    keyPoints: [
      "'While' et 'whereas' introduisent un contraste entre deux idées (While some rooms are safe, others need supervision.)",
      "Vocabulaire : to bite, owner, chained, isolation, to occur, infected, to supervise",
      "'Whereas' est souvent plus formel que 'while' pour marquer une opposition",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: '___ some pets are friendly, others can be dangerous.'",
        options: ["While", "Because", "So", "And"],
        answer: 0,
        explanation: "'While' introduit un contraste entre deux idées opposées.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'surveiller' in English?",
        options: ["to supervise", "to bite", "to occur", "to chain"],
        answer: 0,
        explanation: "'To supervise' signifie 'surveiller' ou 'superviser'.",
      },
      {
        difficulty: "difficile",
        question: "Complete and explain the contrast: 'The living room is childproof, ___ the kitchen has many hazards.'",
        options: ["whereas (introduces a contrast: one room is safe, the other is dangerous)", "because (introduces a cause, not a contrast)", "so (introduces a consequence, not a contrast)", "and (adds information without contrast)"],
        answer: 0,
        explanation: "'Whereas' marque le contraste entre le salon sécurisé et la cuisine dangereuse, exactement le rôle attendu de cette conjonction.",
      },
    ],
    quiz: [
      { question: "How do you say 'mordre' in English?", options: ["to bite", "to chain", "to occur", "to supervise"], answer: 0 },
      { question: "How do you say 'propriétaire' in English?", options: ["owner", "tenant", "visitor", "guest"], answer: 0 },
      { question: "How do you say 'infecté' in English?", options: ["infected", "isolated", "chained", "supervised"], answer: 0 },
      { question: "'Whereas' is used to express:", options: ["a contrast between two ideas", "a cause", "a consequence", "an addition"], answer: 0 },
      { question: "How do you say 'se produire (un événement)' in English?", options: ["to occur", "to bite", "to supervise", "to chain"], answer: 0 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1, part A)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});