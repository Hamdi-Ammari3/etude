// scripts/seedCol8AnglaisContentT2.js
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
const SUBJECT_ID = "anglais";

// Trimestre 2 — lessons l9 through l16
const LESSON_CONTENT = {
  l9: {
    summary:
      "Découverte des connecteurs chronologiques pour organiser un récit au passé : first, then, after that, later, finally, pour lier les événements dans un ordre logique et clair.",
    keyPoints: [
      "First (d'abord), then (ensuite), after that (après cela), later (plus tard), finally (enfin)",
      "Ces connecteurs s'utilisent avec le passé simple pour raconter une séquence d'événements",
      "Un bon récit combine ces connecteurs avec des verbes variés pour éviter la répétition",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which word introduces the first event in a story?",
        options: ["First", "Then", "Finally", "Later"],
        answer: 0,
        explanation: "'First' introduit toujours le premier événement.",
      },
      {
        difficulty: "moyen",
        question: "Which word introduces the last event?",
        options: ["First", "Then", "Finally", "After that"],
        answer: 2,
        explanation: "'Finally' introduit généralement le dernier événement d'un récit.",
      },
      {
        difficulty: "difficile",
        question: "Order the story logically: 'woke up', 'ate breakfast', 'went to school', 'came back home' using connectors:",
        options: ["First I woke up, then I ate breakfast, after that I went to school, and finally I came back home.", "Finally I woke up, first I ate breakfast.", "The order doesn't matter with connectors.", "Then I woke up, first I ate breakfast."],
        answer: 0,
        explanation: "L'ordre logique d'une routine matinale suit ces connecteurs dans l'ordre chronologique correct.",
      },
    ],
    quiz: [
      { question: "How do you say 'ensuite' in English?", options: ["First", "Then", "Finally", "Before"], answer: 1 },
      { question: "How do you say 'plus tard' in English?", options: ["First", "Later", "Finally", "Before"], answer: 1 },
      { question: "How do you say 'après cela' in English?", options: ["After that", "Before that", "First", "Finally"], answer: 0 },
      { question: "These connectors are used to:", options: ["organize events chronologically", "ask questions", "express negation", "describe feelings"], answer: 0 },
      { question: "How do you say 'enfin' in English?", options: ["First", "Then", "Finally", "Later"], answer: 2 },
    ],
  },

  l10: {
    summary:
      "Découverte du passé continu, qui exprime une action en cours à un moment précis du passé, souvent interrompue par une autre action (au passé simple). Formation : was/were + verbe-ing.",
    keyPoints: [
      "Formation : sujet + was/were + verbe-ing",
      "Usage : action en cours dans le passé, souvent interrompue (I was reading when the phone rang.)",
      "'Was' avec I/he/she/it, 'were' avec you/we/they",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ (read) a book when you called.'",
        options: ["read", "was reading", "reads", "will read"],
        answer: 1,
        explanation: "Le passé continu exprime une action en cours interrompue : was reading.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'They ___ (play) football when it started to rain.'",
        options: ["played", "were playing", "play", "are playing"],
        answer: 1,
        explanation: "Avec 'they', on utilise 'were' + verbe-ing : were playing.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'While she ___ (cook) dinner, the children ___ (watch) TV.'",
        options: ["was cooking / were watching", "cooked / watched", "cooks / watch", "is cooking / are watching"],
        answer: 0,
        explanation: "Les deux actions se déroulent simultanément dans le passé, d'où le passé continu pour les deux : was cooking, were watching.",
      },
    ],
    quiz: [
      { question: "Complete: 'He ___ (sleep) when I arrived.'", options: ["slept", "was sleeping", "sleeps", "sleep"], answer: 1 },
      { question: "Which auxiliary is used with 'we' in the past continuous?", options: ["was", "were", "is", "are"], answer: 1 },
      { question: "The past continuous is often used with:", options: ["when + past simple", "tomorrow", "every day", "next week"], answer: 0 },
      { question: "Complete: 'I ___ (walk) home when it started to rain.'", options: ["walked", "was walking", "walk", "walks"], answer: 1 },
      { question: "Which auxiliary is used with 'she' in the past continuous?", options: ["was", "were", "is", "are"], answer: 0 },
    ],
  },

  l11: {
    summary:
      "Approfondissement des comparatifs et superlatifs avec des cas plus complexes : adjectifs de deux syllabes (règles variables), comparatifs irréguliers, et structures 'as...as' pour exprimer l'égalité.",
    keyPoints: [
      "Adjectifs de deux syllabes se terminant en -y : happy → happier (comme les adjectifs courts)",
      "Comparatifs irréguliers : good→better, bad→worse, far→farther/further",
      "'As + adjectif + as' pour exprimer l'égalité (Tom is as tall as his brother.)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the comparative of 'happy'?",
        options: ["happyer", "happier", "more happy", "happiest"],
        answer: 1,
        explanation: "'Happy' se termine en -y précédé d'une consonne, donc : happier (comme un adjectif court).",
      },
      {
        difficulty: "moyen",
        question: "What is the comparative of 'bad'?",
        options: ["badder", "more bad", "worse", "baddest"],
        answer: 2,
        explanation: "'Bad' a un comparatif irrégulier : worse.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My brother is ___ tall ___ me.' (égalité)",
        options: ["as / as", "more / than", "the most / of", "than / as"],
        answer: 0,
        explanation: "'As...as' exprime l'égalité entre deux éléments : as tall as.",
      },
    ],
    quiz: [
      { question: "What is the comparative of 'good'?", options: ["gooder", "better", "more good", "goodest"], answer: 1 },
      { question: "What is the comparative of 'far'?", options: ["farer", "farther", "more far", "farrest"], answer: 1 },
      { question: "Complete: 'This book is ___ interesting ___ that one.' (égalité)", options: ["as / as", "more / than", "the most / of", "than / as"], answer: 0 },
      { question: "What is the comparative of 'easy'?", options: ["easyer", "easier", "more easy", "easiest"], answer: 1 },
      { question: "'As...as' expresses:", options: ["equality", "superiority", "inferiority", "the superlative"], answer: 0 },
    ],
  },

  l12: {
    summary:
      "Découverte du vocabulaire des recettes et des instructions culinaires, avec l'impératif pour donner des instructions étape par étape, et le vocabulaire des ingrédients et ustensiles.",
    keyPoints: [
      "Vocabulaire : ingredients, recipe, mix, boil, chop, add",
      "L'impératif pour donner des instructions : Add the eggs. Mix well. Boil the water.",
      "Connecteurs pour organiser une recette : first, then, next, finally",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'ingrédients' in English?",
        options: ["ingredients", "recipe", "utensils", "instructions"],
        answer: 0,
        explanation: "'Ingredients' est la traduction anglaise de 'ingrédients'.",
      },
      {
        difficulty: "moyen",
        question: "How do you give an instruction in a recipe?",
        options: ["Add the sugar.", "You add the sugar.", "Adding the sugar.", "Added the sugar."],
        answer: 0,
        explanation: "Les recettes utilisent l'impératif : Add the sugar.",
      },
      {
        difficulty: "difficile",
        question: "Complete this recipe instruction: '___ the vegetables, then ___ them in the pan for ten minutes.'",
        options: ["Chop / cook", "Chopping / cooking", "Chops / cooks", "Chopped / cooked"],
        answer: 0,
        explanation: "Les instructions de recette utilisent l'impératif : Chop, cook.",
      },
    ],
    quiz: [
      { question: "How do you say 'faire bouillir' in English?", options: ["boil", "chop", "mix", "add"], answer: 0 },
      { question: "How do you say 'mélanger' in English?", options: ["mix", "boil", "chop", "add"], answer: 0 },
      { question: "How do you say 'recette' in English?", options: ["recipe", "ingredients", "utensils", "kitchen"], answer: 0 },
      { question: "How do you say 'couper en morceaux' in English?", options: ["chop", "boil", "mix", "add"], answer: 0 },
      { question: "Recipe instructions typically use:", options: ["the imperative", "the past tense", "the future tense", "questions"], answer: 0 },
    ],
  },

  l13: {
    summary:
      "Découverte des structures pour faire des achats et négocier un prix, avec du vocabulaire de shopping et des expressions pour demander une réduction ou exprimer que quelque chose est trop cher.",
    keyPoints: [
      "'How much does this cost?' / 'That's too expensive.' / 'Can you give me a discount?'",
      "Vocabulaire : price, discount, expensive, cheap, bargain",
      "'I'll take it.' pour accepter d'acheter un article",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'C'est trop cher' in English?",
        options: ["That's too expensive.", "That's very cheap.", "I want it.", "That's a bargain."],
        answer: 0,
        explanation: "'That's too expensive' signifie 'C'est trop cher'.",
      },
      {
        difficulty: "moyen",
        question: "How do you ask for a discount politely?",
        options: ["Can you give me a discount?", "Give me a discount now!", "I don't want a discount.", "This is expensive."],
        answer: 0,
        explanation: "'Can you give me a discount?' est la formule polie pour demander une réduction.",
      },
      {
        difficulty: "difficile",
        question: "Complete this shopping dialogue: 'How much ___ this shirt cost?' — 'It ___ 25 dinars.'",
        options: ["does / costs", "do / cost", "is / cost", "does / cost"],
        answer: 0,
        explanation: "'Does' (question au présent simple, 3ème pers.) et 'costs' (verbe avec -s pour la 3ème personne) sont corrects.",
      },
    ],
    quiz: [
      { question: "How do you say 'bon marché' in English?", options: ["expensive", "cheap", "discount", "bargain"], answer: 1 },
      { question: "How do you say 'réduction' in English?", options: ["discount", "expensive", "cheap", "price"], answer: 0 },
      { question: "How do you say 'Je le prends' in English?", options: ["I'll take it.", "I don't want it.", "Give it to me.", "It's mine."], answer: 0 },
      { question: "How do you say 'une bonne affaire' in English?", options: ["a bargain", "an expense", "a discount only", "a price"], answer: 0 },
      { question: "How do you ask the price of an item?", options: ["How much does this cost?", "How old is this?", "Where is this?", "What is this?"], answer: 0 },
    ],
  },

  l14: {
    summary:
      "Introduction au present perfect, utilisé pour parler d'une expérience passée sans préciser quand, ou d'une action commencée dans le passé et qui continue d'avoir un effet au présent. Formation : have/has + participe passé.",
    keyPoints: [
      "Formation : have/has + participe passé (I have visited, she has seen)",
      "Usage : expérience de vie sans temps précis (I have been to Paris.)",
      "Mots indicateurs : ever, never, already, just, yet",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ (visit) Paris.' (experience, no specific time)",
        options: ["visit", "visited", "have visited", "am visiting"],
        answer: 2,
        explanation: "Le present perfect exprime une expérience sans temps précis : have visited.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'She ___ (never/see) snow.'",
        options: ["never sees", "has never seen", "never saw", "is never seeing"],
        answer: 1,
        explanation: "'Never' avec le present perfect : has never seen (3ème personne du singulier).",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Have you ___ (ever/try) sushi?' — 'Yes, I ___ (already/try) it once.'",
        options: ["ever tried / have already tried", "ever try / already try", "ever tries / has already tried", "ever tried / already tried"],
        answer: 0,
        explanation: "'Have you ever tried' (question au present perfect) et 'I have already tried' (réponse au present perfect avec 'already').",
      },
    ],
    quiz: [
      { question: "How is the present perfect formed?", options: ["have/has + past participle", "be + verb-ing", "will + infinitive", "did + infinitive"], answer: 0 },
      { question: "Complete: 'They ___ (finish) their homework.'", options: ["finish", "finished", "have finished", "are finishing"], answer: 2 },
      { question: "Which word often accompanies the present perfect?", options: ["ever", "yesterday", "last week", "tomorrow"], answer: 0 },
      { question: "Complete: 'He ___ (not/eat) breakfast yet.'", options: ["doesn't eat", "hasn't eaten", "didn't eat", "isn't eating"], answer: 1 },
      { question: "The present perfect often expresses:", options: ["a life experience without a specific time", "a specific past action with a date", "a future plan", "a habit"], answer: 0 },
    ],
  },

  l15: {
    summary:
      "Découverte des adverbes de manière, formés généralement en ajoutant -ly à l'adjectif, pour décrire comment se déroule une action (rapidement, lentement, prudemment).",
    keyPoints: [
      "Formation générale : adjectif + ly (quick → quickly, careful → carefully)",
      "Cas particuliers : good → well (irrégulier), adjectifs en -y → -ily (happy → happily)",
      "L'adverbe de manière se place généralement après le verbe (ou après le COD)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the adverb form of 'quick'?",
        options: ["quick", "quickly", "quickness", "quicker"],
        answer: 1,
        explanation: "On ajoute -ly à l'adjectif : quick → quickly.",
      },
      {
        difficulty: "moyen",
        question: "What is the adverb form of 'good'?",
        options: ["goodly", "well", "gooder", "goodness"],
        answer: 1,
        explanation: "'Good' a une forme adverbiale irrégulière : well.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'She sings ___ (beautiful), and she always finishes her work ___ (careful).'",
        options: ["beautifully / carefully", "beautiful / careful", "more beautiful / more careful", "beautifully / careful"],
        answer: 0,
        explanation: "Les deux adjectifs se transforment en adverbes en ajoutant -ly : beautifully, carefully.",
      },
    ],
    quiz: [
      { question: "What is the adverb form of 'careful'?", options: ["careful", "carefully", "carefulness", "carefuler"], answer: 1 },
      { question: "What is the adverb form of 'happy'?", options: ["happyly", "happily", "happy", "happiness"], answer: 1 },
      { question: "What is the adverb form of 'slow'?", options: ["slow", "slowly", "slowness", "slower"], answer: 1 },
      { question: "Where does the adverb of manner usually go?", options: ["before the subject", "after the verb (or COD)", "at the very beginning always", "nowhere specific"], answer: 1 },
      { question: "What is the irregular adverb form of 'good'?", options: ["goodly", "well", "gooder", "best"], answer: 1 },
    ],
  },

  l16: {
    summary:
      "Apprentissage de la structure pour écrire une courte biographie, combinant le passé simple pour les événements de vie, des connecteurs chronologiques, et des informations organisées (naissance, enfance, réalisations).",
    keyPoints: [
      "Structure : naissance → enfance/études → réalisations principales → situation actuelle",
      "Utilisation du passé simple pour les événements passés, et du présent pour la situation actuelle",
      "Connecteurs : born in, then, later, after that, now",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you start a biography?",
        options: ["He/She was born in...", "He/She will be born...", "He/She is born...", "He/She born..."],
        answer: 0,
        explanation: "'He/She was born in...' est la structure standard pour commencer une biographie.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'She ___ (study) medicine, and now she ___ (work) as a doctor.'",
        options: ["studied / works", "studies / worked", "study / work", "studying / working"],
        answer: 0,
        explanation: "'Studied' (passé simple, événement passé) et 'works' (présent simple, situation actuelle).",
      },
      {
        difficulty: "difficile",
        question: "Complete this biography excerpt: 'He ___ (be) born in 1990. He ___ (grow) up in Sfax, and later he ___ (move) to Tunis to study.'",
        options: ["was / grew / moved", "is / grows / moves", "will be / will grow / will move", "was / grows / moved"],
        answer: 0,
        explanation: "Tous les verbes sont au passé simple, car ils décrivent des événements de vie déjà passés : was, grew, moved.",
      },
    ],
    quiz: [
      { question: "What tense is mainly used for past life events in a biography?", options: ["past simple", "present simple", "future simple", "present continuous"], answer: 0 },
      { question: "What tense describes someone's current situation?", options: ["past simple", "present simple", "future simple", "past continuous"], answer: 1 },
      { question: "A biography typically includes:", options: ["birth, childhood, achievements, current situation", "only a title", "only dialogue", "no structure"], answer: 0 },
      { question: "Complete: 'He ___ (win) an award in 2015.'", options: ["win", "wins", "won", "winning"], answer: 2 },
      { question: "How do you say 'grandir' (enfance) in English?", options: ["grow up", "go up", "come up", "stand up"], answer: 0 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 2)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});