// scripts/seedPrim6AnglaisContentT3.js
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
const SUBJECT_ID = "anglais";

// Trimestre 3 — lessons l17 through l24
const LESSON_CONTENT = {
  l17: {
    summary:
      "Découverte des adverbes de fréquence (always, often, sometimes, never), qui indiquent à quelle fréquence une action se produit et se placent généralement avant le verbe principal (mais après le verbe 'to be').",
    keyPoints: [
      "Always (toujours), often (souvent), sometimes (parfois), never (jamais)",
      "Placement : avant le verbe principal (I always eat breakfast), mais après 'to be' (She is always happy)",
      "Ces adverbes aident à décrire des habitudes avec précision",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'toujours' in English?",
        options: ["never", "always", "sometimes", "often"],
        answer: 1,
        explanation: "'Always' est la traduction anglaise de 'toujours'.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'I ___ eat vegetables.' (jamais)",
        options: ["always", "often", "never", "sometimes"],
        answer: 2,
        explanation: "'Never' signifie 'jamais'.",
      },
      {
        difficulty: "difficile",
        question: "Where does the adverb of frequency go in 'She is happy'? (toujours)",
        options: ["She always is happy", "She is always happy", "Always she is happy", "She is happy always"],
        answer: 1,
        explanation: "Avec le verbe 'to be', l'adverbe de fréquence se place après le verbe : She is always happy.",
      },
    ],
    quiz: [
      { question: "How do you say 'parfois' in English?", options: ["always", "never", "sometimes", "often"], answer: 2 },
      { question: "How do you say 'souvent' in English?", options: ["always", "never", "sometimes", "often"], answer: 3 },
      { question: "Complete: 'He ___ plays football on Sundays.' (souvent)", options: ["never", "often", "always is", "sometime"], answer: 1 },
      { question: "Where does 'often' go with the verb 'play'?", options: ["before the verb", "after the verb", "at the end only", "it doesn't matter"], answer: 0 },
      { question: "Complete: 'We ___ go to the cinema.' (jamais)", options: ["always", "often", "never", "sometimes"], answer: 2 },
    ],
  },

  l18: {
    summary:
      "Découverte du superlatif, utilisé pour exprimer que quelque chose est 'le plus' d'une qualité parmi un groupe. Pour les adjectifs courts, on ajoute '-est' ; pour les adjectifs longs, on utilise 'the most' devant l'adjectif.",
    keyPoints: [
      "Adjectifs courts : the + adjectif + est (big → the biggest, tall → the tallest)",
      "Adjectifs longs : the most + adjectif (beautiful → the most beautiful)",
      "Structure : 'X is the + superlatif + in/of...' (Ex: This is the biggest city in Tunisia)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the superlative of 'big'?",
        options: ["bigger", "the biggest", "more big", "most big"],
        answer: 1,
        explanation: "Pour un adjectif court, on ajoute 'the' + adjectif + '-est' : the biggest.",
      },
      {
        difficulty: "moyen",
        question: "What is the superlative of 'beautiful'?",
        options: ["the beautifulest", "more beautiful", "the most beautiful", "beautifuler"],
        answer: 2,
        explanation: "Les adjectifs longs comme 'beautiful' utilisent 'the most' devant l'adjectif.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Everest is ___ (high) mountain in the world.'",
        options: ["higher", "the highest", "more high", "the most high"],
        answer: 1,
        explanation: "'High' est un adjectif court, donc son superlatif est 'the highest'.",
      },
    ],
    quiz: [
      { question: "What is the superlative of 'small'?", options: ["smaller", "the smallest", "more small", "most small"], answer: 1 },
      { question: "What is the superlative of 'interesting'?", options: ["the interestingest", "more interesting", "the most interesting", "interestinger"], answer: 2 },
      { question: "Complete: 'This is ___ (fast) car I have ever seen.'", options: ["faster", "the fastest", "more fast", "the most fast"], answer: 1 },
      { question: "Which word usually comes before a superlative?", options: ["a", "the", "an", "some"], answer: 1 },
      { question: "What is the superlative of 'good'? (irregular)", options: ["gooder", "the goodest", "the best", "more good"], answer: 2 },
    ],
  },

  l19: {
    summary:
      "Apprentissage de la structure pour écrire un court paragraphe de présentation personnelle, en combinant les acquis : nom, âge, famille, loisirs, et description physique, avec des connecteurs simples pour lier les phrases.",
    keyPoints: [
      "Structure de base : nom et âge → famille → loisirs → description",
      "Connecteurs utiles : and (et), but (mais), because (parce que), also (aussi)",
      "Exemple : 'My name is Sami. I am 11 years old. I live with my family in Tunis. I love playing football and I also enjoy reading.'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you start a paragraph about yourself?",
        options: ["My name is...", "The weather is...", "This is a book...", "He is my friend..."],
        answer: 0,
        explanation: "'My name is...' est la façon standard de commencer une présentation personnelle.",
      },
      {
        difficulty: "moyen",
        question: "Which connector means 'aussi'?",
        options: ["but", "because", "also", "or"],
        answer: 2,
        explanation: "'Also' signifie 'aussi', utilisé pour ajouter une information supplémentaire.",
      },
      {
        difficulty: "difficile",
        question: "Complete the paragraph logically: 'I love sports, ___ my favorite hobby is swimming ___ it makes me feel relaxed.'",
        options: ["and / because", "but / and", "because / but", "or / or"],
        answer: 0,
        explanation: "'And' relie deux idées complémentaires (aimer le sport, préférer la natation), et 'because' introduit la raison (se sentir détendu).",
      },
    ],
    quiz: [
      { question: "Which connector means 'mais'?", options: ["and", "but", "also", "because"], answer: 1 },
      { question: "Which connector introduces a reason?", options: ["and", "but", "because", "also"], answer: 2 },
      { question: "What information is typically included in a self-introduction?", options: ["nom, âge, famille, loisirs", "seulement le nom", "seulement l'âge", "aucune information personnelle"], answer: 0 },
      { question: "Complete: 'I live in Sousse, ___ I was born in Tunis.'", options: ["and", "but", "because", "also"], answer: 1 },
      { question: "How do you say 'Je m'appelle...' in English?", options: ["My name is...", "I am from...", "I live in...", "I like..."], answer: 0 },
    ],
  },

  l20: {
    summary:
      "Développement des compétences de compréhension de textes courts (histoires simples), en apprenant à identifier les informations clés : les personnages, le lieu, l'événement principal, et la fin de l'histoire.",
    keyPoints: [
      "Pour comprendre une histoire courte, on identifie : qui (personnages), où (lieu), quoi (événement)",
      "Lire d'abord le titre et survoler le texte aide à anticiper le contenu",
      "Répondre aux questions de compréhension nécessite de relire les passages pertinents",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What should you identify first when reading a short story?",
        options: ["the characters and setting", "the last word", "the punctuation only", "nothing in particular"],
        answer: 0,
        explanation: "Identifier les personnages et le lieu (setting) aide à comprendre le contexte de l'histoire dès le début.",
      },
      {
        difficulty: "moyen",
        question: "In a story titled 'The Lost Dog', what do you expect the story to be about?",
        options: ["a dog that gets lost", "a cat", "a car race", "a school day"],
        answer: 0,
        explanation: "Le titre suggère fortement que l'histoire parlera d'un chien perdu.",
      },
      {
        difficulty: "difficile",
        question: "If a story says 'Finally, Sami found his dog near the park', what does this tell us about the story's structure?",
        options: ["This is the beginning of the story", "This is likely the resolution/ending of the story", "This has no relation to the plot", "This is unrelated information"],
        answer: 1,
        explanation: "Le mot 'Finally' (enfin) indique généralement qu'on est arrivé à la résolution ou la fin de l'histoire.",
      },
    ],
    quiz: [
      { question: "What does 'setting' mean in a story?", options: ["les personnages", "le lieu et le moment", "la morale", "le titre"], answer: 1 },
      { question: "Reading the title before the story helps to:", options: ["anticiper le contenu", "ne rien comprendre", "sauter la lecture", "aucune utilité"], answer: 0 },
      { question: "What word often signals the end of a story?", options: ["First", "Then", "Finally", "Suddenly"], answer: 2 },
      { question: "What are 'characters' in a story?", options: ["les personnes ou animaux de l'histoire", "le titre", "le lieu", "la date"], answer: 0 },
      { question: "To answer comprehension questions, you should:", options: ["deviner sans lire", "relire les passages pertinents", "ignorer le texte", "lire seulement le titre"], answer: 1 },
    ],
  },

  l21: {
    summary:
      "Découverte du vocabulaire lié aux voyages et aux vacances, pour pouvoir parler de ses projets de voyage ou raconter des vacances passées.",
    keyPoints: [
      "Vocabulaire : suitcase, ticket, passport, hotel, beach holiday",
      "'I am going to travel to...' pour un projet de voyage futur",
      "'We went on holiday to...' pour raconter des vacances passées",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'valise' in English?",
        options: ["ticket", "suitcase", "passport", "hotel"],
        answer: 1,
        explanation: "'Suitcase' est la traduction anglaise de 'valise'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'passeport' in English?",
        options: ["ticket", "suitcase", "passport", "hotel"],
        answer: 2,
        explanation: "'Passport' est la traduction anglaise de 'passeport'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Last summer, we ___ (go) on holiday to the beach, and we ___ (stay) in a nice hotel.'",
        options: ["went / stayed", "go / stay", "goes / stays", "going / staying"],
        answer: 0,
        explanation: "'Went' (passé irrégulier de go) et 'stayed' (passé régulier de stay) sont corrects pour raconter des vacances passées.",
      },
    ],
    quiz: [
      { question: "How do you say 'billet' in English?", options: ["ticket", "suitcase", "passport", "hotel"], answer: 0 },
      { question: "How do you say 'hôtel' in English?", options: ["ticket", "suitcase", "passport", "hotel"], answer: 3 },
      { question: "Complete: 'I ___ (travel) to France next summer.' (projet futur)", options: ["am going to travel", "traveled", "travels", "travel"], answer: 0 },
      { question: "What does 'beach holiday' mean?", options: ["vacances à la montagne", "vacances à la plage", "vacances en ville", "pas de vacances"], answer: 1 },
      { question: "Complete: 'We ___ (pack) our suitcases yesterday.'", options: ["pack", "packed", "packs", "packing"], answer: 1 },
    ],
  },

  l22: {
    summary:
      "Introduction simple aux question tags (mini-questions ajoutées à la fin d'une phrase pour demander confirmation), en se limitant aux structures les plus courantes avec 'is/isn't' et 'do/don't'.",
    keyPoints: [
      "Structure : si la phrase est affirmative, le tag est négatif (You are happy, aren't you?)",
      "Si la phrase est négative, le tag est affirmatif (You aren't tired, are you?)",
      "Les question tags servent à demander confirmation ou engager la conversation",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'You are a student, ___?'",
        options: ["aren't you", "are you", "isn't it", "don't you"],
        answer: 0,
        explanation: "La phrase est affirmative, donc le tag est négatif : aren't you?",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'She isn't at home, ___?'",
        options: ["is she", "isn't she", "does she", "doesn't she"],
        answer: 0,
        explanation: "La phrase est négative (isn't), donc le tag est affirmatif : is she?",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'They like football, ___?'",
        options: ["do they", "don't they", "are they", "aren't they"],
        answer: 1,
        explanation: "La phrase est affirmative avec le verbe 'like' (pas 'to be'), donc le tag utilise l'auxiliaire 'don't' : don't they?",
      },
    ],
    quiz: [
      { question: "Complete: 'He is tired, ___?'", options: ["isn't he", "is he", "doesn't he", "does he"], answer: 0 },
      { question: "Complete: 'You don't like coffee, ___?'", options: ["do you", "don't you", "are you", "aren't you"], answer: 0 },
      { question: "If the sentence is affirmative, the tag is:", options: ["affirmative", "negative", "a question word", "always 'do you'"], answer: 1 },
      { question: "If the sentence is negative, the tag is:", options: ["negative", "affirmative", "a question word", "always 'don't you'"], answer: 1 },
      { question: "Complete: 'We are late, ___?'", options: ["aren't we", "are we", "don't we", "do we"], answer: 0 },
    ],
  },

  l23: {
    summary:
      "Révision générale de tous les temps étudiés au cours de l'année : présent simple, présent continu, passé simple (régulier et irrégulier), et les structures de futur (going to / will), pour consolider avant l'examen final.",
    keyPoints: [
      "Présent simple : habitudes (I play football every day)",
      "Présent continu : action en cours (I am playing now)",
      "Passé simple : actions terminées (I played / I went yesterday)",
      "Futur : going to (intention) ou will (spontané/prédiction)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ (play) tennis every Saturday.' (habitude)",
        options: ["play", "am playing", "played", "will play"],
        answer: 0,
        explanation: "'Every Saturday' indique une habitude, donc présent simple : play.",
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
        question: "Complete: 'Look! It ___ (rain) now, so I ___ (take) my umbrella.'",
        options: ["is raining / am going to take", "rains / take", "rained / took", "will rain / took"],
        answer: 0,
        explanation: "'Look! ... now' indique le présent continu (is raining), et la décision logique qui en découle utilise 'going to' : am going to take.",
      },
    ],
    quiz: [
      { question: "Complete: 'She ___ (watch) TV right now.'", options: ["watches", "is watching", "watched", "will watch"], answer: 1 },
      { question: "Complete: 'They ___ (visit) their grandmother last week.'", options: ["visit", "are visiting", "visited", "will visit"], answer: 2 },
      { question: "Complete: 'I ___ (travel) to Paris next year; I already booked my ticket.'", options: ["am going to travel", "travel", "traveled", "am travelling now"], answer: 0 },
      { question: "Complete: 'The phone is ringing! I ___ (answer) it.' (décision spontanée)", options: ["will answer", "am going to answer", "answer", "answered"], answer: 0 },
      { question: "Complete: 'We ___ (not/finish) our homework yet.'", options: ["don't finish", "haven't finished", "didn't finish", "aren't finishing"], answer: 2 },
    ],
  },

  l24: {
    summary:
      "Préparation finale à l'examen de fin d'année primaire : révision combinée de la lecture (compréhension de texte), de l'écriture (rédaction d'un court paragraphe), et de la grammaire (tous les points étudiés durant l'année).",
    keyPoints: [
      "Compréhension : identifier les idées principales, les personnages, et répondre aux questions avec des phrases complètes",
      "Expression écrite : structurer un paragraphe avec une introduction, des détails, et une conclusion simple",
      "Grammaire : revoir les temps (présent simple/continu, passé, futur), le vocabulaire, et les structures de questions",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "When answering a reading comprehension question, you should:",
        options: ["répondre par une phrase complète", "répondre par un seul mot toujours", "deviner sans lire le texte", "copier tout le texte"],
        answer: 0,
        explanation: "Les réponses aux questions de compréhension doivent être formulées en phrases complètes pour montrer la compréhension.",
      },
      {
        difficulty: "moyen",
        question: "A good paragraph about yourself should include:",
        options: ["seulement ton nom", "des informations variées (nom, âge, loisirs...) reliées logiquement", "aucune structure particulière", "seulement des questions"],
        answer: 1,
        explanation: "Un bon paragraphe combine plusieurs informations personnelles organisées de manière cohérente avec des connecteurs.",
      },
      {
        difficulty: "difficile",
        question: "Complete this exam-style sentence: 'My sister ___ (be) a doctor, and she ___ (work) in a hospital in Tunis.'",
        options: ["is / works", "are / work", "am / working", "be / worked"],
        answer: 0,
        explanation: "'Is' (verbe être) et 'works' (avec -s pour la 3ème personne du singulier) sont les formes correctes au présent simple.",
      },
    ],
    quiz: [
      { question: "What tense do we use for habits?", options: ["présent simple", "présent continu", "passé simple", "futur"], answer: 0 },
      { question: "What tense do we use for an action happening right now?", options: ["présent simple", "présent continu", "passé simple", "futur"], answer: 1 },
      { question: "What tense do we use for a completed past action?", options: ["présent simple", "présent continu", "passé simple", "futur"], answer: 2 },
      { question: "What structure expresses a planned future intention?", options: ["going to", "will only", "présent simple", "passé simple"], answer: 0 },
      { question: "A well-organized paragraph typically has:", options: ["une introduction et un développement logique", "aucune structure", "seulement des questions", "seulement des mots isolés"], answer: 0 },
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