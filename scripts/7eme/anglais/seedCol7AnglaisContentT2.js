// scripts/seedCol7AnglaisContentT2.js
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

// Trimestre 2 — lessons l9 through l16
const LESSON_CONTENT = {
  l9: {
    summary:
      "Découverte du vocabulaire de la routine quotidienne et des loisirs, avec le présent simple pour décrire les habitudes de la journée, du réveil au coucher.",
    keyPoints: [
      "Routine : wake up, get dressed, have breakfast, go to school, do homework, go to bed",
      "Loisirs : play sports, read, watch TV, use the computer",
      "Structure : 'I usually + verbe' pour une habitude régulière",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'faire ses devoirs' in English?",
        options: ["do homework", "go to school", "wake up", "have breakfast"],
        answer: 0,
        explanation: "'Do homework' est la traduction anglaise de 'faire ses devoirs'.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'I usually ___ (wake up) at 6:30.'",
        options: ["wake up", "wakes up", "waking up", "woke up"],
        answer: 0,
        explanation: "1ère personne du singulier au présent simple : wake up.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'She ___ (get up) early, then she ___ (have) breakfast before school.'",
        options: ["gets up / has", "get up / have", "getting up / having", "got up / had"],
        answer: 0,
        explanation: "3ème personne du singulier : gets up, has (forme irrégulière de have à la 3ème personne).",
      },
    ],
    quiz: [
      { question: "How do you say 'se lever' in English?", options: ["go to bed", "get up", "have breakfast", "do homework"], answer: 1 },
      { question: "Complete: 'He ___ (play) video games every evening.'", options: ["play", "plays", "playing", "played"], answer: 1 },
      { question: "How do you say 'se coucher' in English?", options: ["wake up", "get dressed", "go to bed", "have breakfast"], answer: 2 },
      { question: "Complete: 'I ___ (read) books in my free time.'", options: ["read", "reads", "reading", "readed"], answer: 0 },
      { question: "How do you say 's'habiller' in English?", options: ["wake up", "get dressed", "go to bed", "have breakfast"], answer: 1 },
    ],
  },

  l10: {
    summary:
      "Apprentissage de l'heure et des expressions pour faire des projets simples, en combinant les nombres, les expressions horaires (half past, quarter to/past) et la structure 'What time...?'.",
    keyPoints: [
      "'What time is it?' / 'What time do you...?' pour demander l'heure ou un horaire",
      "Expressions : half past, quarter past, quarter to, o'clock",
      "'Let's meet at + heure' pour proposer un rendez-vous",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'trois heures et demie' in English?",
        options: ["Three o'clock", "Half past three", "Quarter past three", "Quarter to three"],
        answer: 1,
        explanation: "'Half past three' signifie 'trois heures et demie'.",
      },
      {
        difficulty: "moyen",
        question: "How do you propose a meeting time?",
        options: ["Let's meet at 5 o'clock.", "What time is it?", "I am 5 years old.", "It is Monday."],
        answer: 0,
        explanation: "'Let's meet at + heure' est la structure pour proposer un rendez-vous.",
      },
      {
        difficulty: "difficile",
        question: "If it is 4:45, how do you say the time?",
        options: ["Quarter past four", "Half past four", "Quarter to five", "Five o'clock"],
        answer: 2,
        explanation: "4:45 se dit 'quarter to five' (cinq heures moins le quart).",
      },
    ],
    quiz: [
      { question: "How do you say 'six heures moins le quart' in English?", options: ["Quarter past six", "Half past six", "Quarter to six", "Six o'clock"], answer: 2 },
      { question: "What time is 'half past nine'?", options: ["9:00", "9:15", "9:30", "9:45"], answer: 2 },
      { question: "How do you ask what time it is?", options: ["What time is it?", "What is your name?", "How old are you?", "Where are you?"], answer: 0 },
      { question: "What time is 'quarter past two'?", options: ["2:00", "2:15", "2:30", "2:45"], answer: 1 },
      { question: "How do you say 'sept heures et demie' in English?", options: ["Quarter past seven", "Half past seven", "Quarter to seven", "Seven o'clock"], answer: 1 },
    ],
  },

  l11: {
    summary:
      "Approfondissement de la distinction entre présent simple (habitudes générales) et présent continu (action en cours au moment présent), avec des mots indicateurs précis pour choisir le bon temps.",
    keyPoints: [
      "Présent simple : habitudes (every day, usually, always, often)",
      "Présent continu : action en cours (now, right now, at the moment, look!)",
      "Formation du présent continu : sujet + am/is/are + verbe-ing",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'She ___ (play) tennis every weekend.'",
        options: ["play", "plays", "is playing", "played"],
        answer: 1,
        explanation: "'Every weekend' indique une habitude : présent simple.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'Look! He ___ (run) very fast right now.'",
        options: ["run", "runs", "is running", "ran"],
        answer: 2,
        explanation: "'Right now' indique une action en cours : présent continu.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I usually ___ (walk) to school, but today I ___ (take) the bus because it is raining.'",
        options: ["walk / am taking", "am walking / take", "walks / takes", "walked / took"],
        answer: 0,
        explanation: "'Usually' (présent simple : walk) et l'action exceptionnelle du jour (présent continu : am taking).",
      },
    ],
    quiz: [
      { question: "Which word suggests present simple?", options: ["now", "every day", "at the moment", "right now"], answer: 1 },
      { question: "Which word suggests present continuous?", options: ["always", "usually", "right now", "every week"], answer: 2 },
      { question: "Complete: 'They ___ (watch) TV at the moment.'", options: ["watch", "watches", "are watching", "watched"], answer: 2 },
      { question: "Complete: 'My father ___ (work) in a bank.'", options: ["work", "works", "is working", "worked"], answer: 1 },
      { question: "Complete: 'We ___ (not/play) football now.'", options: ["don't play", "doesn't play", "aren't playing", "didn't play"], answer: 2 },
    ],
  },

  l12: {
    summary:
      "Découverte du vocabulaire de la nourriture, des repas, et du shopping, avec les structures pour demander un prix et exprimer une quantité (some, any, how much/many).",
    keyPoints: [
      "Vocabulaire : vegetables, fruit, meat, bread, rice",
      "'How much is/are...?' pour demander un prix",
      "'Some/any' pour une quantité indéterminée ; 'how much' (indénombrable) vs 'how many' (dénombrable)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'légumes' in English?",
        options: ["fruit", "meat", "vegetables", "rice"],
        answer: 2,
        explanation: "'Vegetables' est la traduction anglaise de 'légumes'.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'How much ___ this bread?'",
        options: ["is", "are", "am", "be"],
        answer: 0,
        explanation: "'Bread' est indénombrable, on utilise 'is' au singulier.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I have ___ apples, but I don't have ___ oranges.'",
        options: ["some / any", "any / some", "much / many", "many / much"],
        answer: 0,
        explanation: "'Some' s'utilise dans les phrases affirmatives, et 'any' dans les phrases négatives.",
      },
    ],
    quiz: [
      { question: "How do you say 'viande' in English?", options: ["rice", "meat", "fruit", "vegetables"], answer: 1 },
      { question: "Which word asks about a countable noun's quantity?", options: ["how much", "how many", "how old", "how far"], answer: 1 },
      { question: "Which word asks about an uncountable noun's quantity?", options: ["how much", "how many", "how old", "how far"], answer: 0 },
      { question: "Complete: 'Do you have ___ milk?'", options: ["some", "any", "many", "much"], answer: 1 },
      { question: "How do you ask the price of shoes?", options: ["How much are these shoes?", "How much is this shoe?", "How old are these shoes?", "What are these shoes?"], answer: 0 },
    ],
  },

  l13: {
    summary:
      "Découverte du vocabulaire des animaux et de leurs habitats naturels, pour enrichir le vocabulaire au-delà des animaux domestiques et comprendre où vivent différentes espèces.",
    keyPoints: [
      "Habitats : forest, desert, ocean, jungle, farm",
      "'Animals live in + habitat' (Ex: Lions live in the savanna)",
      "Vocabulaire d'animaux sauvages : lion, elephant, giraffe, camel, eagle",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'désert' in English?",
        options: ["forest", "desert", "ocean", "jungle"],
        answer: 1,
        explanation: "'Desert' est la traduction anglaise de 'désert'.",
      },
      {
        difficulty: "moyen",
        question: "Where do camels typically live?",
        options: ["In the ocean", "In the desert", "In the forest", "In the jungle"],
        answer: 1,
        explanation: "Les chameaux vivent typiquement dans le désert.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Elephants ___ (live) in Africa, and they ___ (eat) plants.'",
        options: ["live / eat", "lives / eats", "living / eating", "lived / ate"],
        answer: 0,
        explanation: "Avec 'elephants' (pluriel), on utilise 'live' et 'eat' sans -s au présent simple.",
      },
    ],
    quiz: [
      { question: "How do you say 'océan' in English?", options: ["desert", "forest", "ocean", "jungle"], answer: 2 },
      { question: "Where do lions typically live?", options: ["In the ocean", "In the savanna", "In the desert only", "In the forest"], answer: 1 },
      { question: "How do you say 'girafe' in English?", options: ["giraffe", "camel", "eagle", "lion"], answer: 0 },
      { question: "How do you say 'aigle' in English?", options: ["eagle", "camel", "giraffe", "lion"], answer: 0 },
      { question: "Complete: 'Fish ___ (live) in water.'", options: ["live", "lives", "living", "lived"], answer: 0 },
    ],
  },

  l14: {
    summary:
      "Approfondissement du passé simple avec les verbes réguliers (ajout de -ed) et irréguliers (formes à mémoriser), pour pouvoir raconter des événements passés de façon complète.",
    keyPoints: [
      "Verbes réguliers : + -ed (play → played, watch → watched)",
      "Verbes irréguliers : forme unique à mémoriser (go → went, eat → ate, see → saw)",
      "Le passé simple s'utilise pour une action terminée à un moment précis du passé",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the past tense of 'play'?",
        options: ["play", "played", "playing", "plays"],
        answer: 1,
        explanation: "Verbe régulier : play → played.",
      },
      {
        difficulty: "moyen",
        question: "What is the past tense of 'go'?",
        options: ["goed", "went", "gone", "going"],
        answer: 1,
        explanation: "'Went' est le passé irrégulier de 'go'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Yesterday, we ___ (watch) a film and then we ___ (eat) dinner together.'",
        options: ["watched / ate", "watch / eat", "watches / eats", "watching / eating"],
        answer: 0,
        explanation: "'Watched' (régulier, +ed) et 'ate' (irrégulier, passé de 'eat').",
      },
    ],
    quiz: [
      { question: "What is the past tense of 'see'?", options: ["seed", "saw", "seen", "seeing"], answer: 1 },
      { question: "What is the past tense of 'walk'?", options: ["walked", "walk", "walking", "walks"], answer: 0 },
      { question: "What is the past tense of 'have'?", options: ["haved", "had", "having", "haves"], answer: 1 },
      { question: "Complete: 'She ___ (visit) her grandmother last week.'", options: ["visit", "visited", "visits", "visiting"], answer: 1 },
      { question: "What is the past tense of 'do'?", options: ["doed", "did", "done", "doing"], answer: 1 },
    ],
  },

  l15: {
    summary:
      "Découverte des structures pour raconter des vacances passées, en combinant le passé simple avec du vocabulaire de voyage : where you went, what you did, and how you felt.",
    keyPoints: [
      "'Last summer, I went to...' pour introduire un récit de vacances",
      "Vocabulaire : beach, mountains, hotel, souvenirs",
      "Combinaison de verbes au passé pour raconter une séquence d'événements",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you start telling about a past holiday?",
        options: ["Last summer, I went to...", "Tomorrow, I will go to...", "I usually go to...", "Now, I am going to..."],
        answer: 0,
        explanation: "'Last summer, I went to...' introduit un récit au passé.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'We ___ (stay) in a nice hotel near the beach.'",
        options: ["stay", "stayed", "stays", "staying"],
        answer: 1,
        explanation: "Passé simple régulier : stayed.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Last year, my family ___ (go) to the mountains, and we ___ (see) beautiful landscapes.'",
        options: ["went / saw", "go / see", "goes / sees", "going / seeing"],
        answer: 0,
        explanation: "'Went' (passé de go) et 'saw' (passé de see), deux verbes irréguliers.",
      },
    ],
    quiz: [
      { question: "How do you say 'souvenirs' (objets) in English?", options: ["souvenirs", "memories only", "gifts only", "photos only"], answer: 0 },
      { question: "How do you say 'montagnes' in English?", options: ["mountains", "beach", "hotel", "forest"], answer: 0 },
      { question: "Complete: 'I ___ (buy) some souvenirs for my friends.'", options: ["buy", "bought", "buys", "buying"], answer: 1 },
      { question: "What tense is used to tell about past holidays?", options: ["present simple", "past simple", "future simple", "present continuous"], answer: 1 },
      { question: "Complete: 'It ___ (be) a wonderful trip.'", options: ["is", "was", "will be", "are"], answer: 1 },
    ],
  },

  l16: {
    summary:
      "Approfondissement du vocabulaire de la météo et des saisons, avec des structures complètes pour décrire le climat et le relier à des activités adaptées à chaque saison.",
    keyPoints: [
      "Weather : sunny, rainy, cloudy, windy, hot, cold, snowy",
      "Seasons : spring, summer, autumn/fall, winter",
      "'In + saison, it is usually + météo' (Ex: In summer, it is usually hot)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'il neige' in English?",
        options: ["It is rainy", "It is snowy", "It is sunny", "It is windy"],
        answer: 1,
        explanation: "'It is snowy' signifie 'Il neige'.",
      },
      {
        difficulty: "moyen",
        question: "Which season is usually hot in Tunisia?",
        options: ["Winter", "Summer", "Autumn", "None of them"],
        answer: 1,
        explanation: "L'été ('summer') est généralement la saison chaude en Tunisie.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'In winter, it is often ___ , so people wear warm clothes.'",
        options: ["hot", "cold", "sunny only", "never cloudy"],
        answer: 1,
        explanation: "En hiver, il fait généralement froid, ce qui explique le port de vêtements chauds.",
      },
    ],
    quiz: [
      { question: "How do you say 'automne' in English?", options: ["spring", "summer", "autumn", "winter"], answer: 2 },
      { question: "How do you say 'nuageux' in English?", options: ["sunny", "rainy", "cloudy", "hot"], answer: 2 },
      { question: "Which season comes after summer?", options: ["Spring", "Winter", "Autumn", "Summer again"], answer: 2 },
      { question: "How do you say 'venteux' in English?", options: ["windy", "sunny", "rainy", "cold"], answer: 0 },
      { question: "What do people usually wear in cold weather?", options: ["warm clothes", "swimsuits", "sandals", "shorts"], answer: 0 },
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