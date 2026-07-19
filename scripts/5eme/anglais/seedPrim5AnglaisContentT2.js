// scripts/seedPrim5AnglaisContentT2.js
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

const GRADE_ID = "prim-5";
const SUBJECT_ID = "anglais";

// Trimestre 2 — lessons l9 through l16
const LESSON_CONTENT = {
  l9: {
    summary:
      "Découverte du vocabulaire de la routine quotidienne au présent simple, pour pouvoir raconter les actions habituelles de la journée, de se réveiller au coucher, en utilisant les bonnes terminaisons verbales.",
    keyPoints: [
      "Wake up (se réveiller), get dressed (s'habiller), have breakfast (prendre le petit-déjeuner), go to school (aller à l'école)",
      "Au présent simple, avec 'he/she/it', le verbe prend -s : She wakes up at 7.",
      "Structure : 'I + verbe' pour parler de sa propre routine (Ex: I go to school at 8)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'se réveiller' in English?",
        options: ["wake up", "go to bed", "have breakfast", "get dressed"],
        answer: 0,
        explanation: "'Wake up' est la traduction anglaise de 'se réveiller'.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'She ___ (wake up) at 7 o'clock.'",
        options: ["wake up", "wakes up", "waking up", "woke up"],
        answer: 1,
        explanation: "Avec 'she', le verbe prend -s au présent simple : wakes up.",
      },
      {
        difficulty: "difficile",
        question: "Put in order: 'I have breakfast, I wake up, I go to school.' What happens first?",
        options: ["I go to school", "I have breakfast", "I wake up", "None of them"],
        answer: 2,
        explanation: "Dans une routine typique, on se réveille ('I wake up') en premier, avant de prendre le petit-déjeuner et d'aller à l'école.",
      },
    ],
    quiz: [
      { question: "How do you say 's'habiller' in English?", options: ["wake up", "get dressed", "go to bed", "have breakfast"], answer: 1 },
      { question: "Complete: 'He ___ (go) to school at 8.'", options: ["go", "goes", "going", "went"], answer: 1 },
      { question: "How do you say 'se coucher' in English?", options: ["wake up", "get dressed", "go to bed", "have breakfast"], answer: 2 },
      { question: "Complete: 'I ___ (have) breakfast every morning.'", options: ["has", "have", "having", "had"], answer: 1 },
      { question: "How do you say 'prendre le petit-déjeuner' in English?", options: ["have breakfast", "have lunch", "have dinner", "wake up"], answer: 0 },
    ],
  },

  l10: {
    summary:
      "Apprentissage de l'heure avec les expressions 'half past' (et demie) et 'quarter to/past' (moins/et le quart), pour aller au-delà des heures exactes vues précédemment et exprimer l'heure de façon plus précise.",
    keyPoints: [
      "'Half past + heure' = et demie (Ex: half past three = trois heures et demie)",
      "'Quarter past + heure' = et quart (Ex: quarter past four = quatre heures et quart)",
      "'Quarter to + heure' = moins le quart (Ex: quarter to five = cinq heures moins le quart)",
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
        question: "How do you say 'quatre heures et quart' in English?",
        options: ["Half past four", "Quarter to four", "Quarter past four", "Four o'clock"],
        answer: 2,
        explanation: "'Quarter past four' signifie 'quatre heures et quart'.",
      },
      {
        difficulty: "difficile",
        question: "If it is 4:45, how do you say the time in English?",
        options: ["Quarter past four", "Half past four", "Quarter to five", "Five o'clock"],
        answer: 2,
        explanation: "4:45 correspond à 'cinq heures moins le quart', qui se dit 'quarter to five' en anglais (on compte vers l'heure suivante).",
      },
    ],
    quiz: [
      { question: "How do you say 'six heures moins le quart' in English?", options: ["Quarter past six", "Half past six", "Quarter to six", "Six o'clock"], answer: 2 },
      { question: "What time is 'half past nine'?", options: ["9:00", "9:15", "9:30", "9:45"], answer: 2 },
      { question: "What time is 'quarter past two'?", options: ["2:00", "2:15", "2:30", "2:45"], answer: 1 },
      { question: "What time is 'quarter to eight'?", options: ["7:45", "8:15", "8:30", "7:30"], answer: 0 },
      { question: "How do you say 'sept heures et demie' in English?", options: ["Quarter past seven", "Half past seven", "Quarter to seven", "Seven o'clock"], answer: 1 },
    ],
  },

  l11: {
    summary:
      "Approfondissement du vocabulaire de la maison : les pièces et le mobilier, avec la structure 'There is/There are' pour décrire ce qui se trouve dans chaque pièce.",
    keyPoints: [
      "Pièces : kitchen, bedroom, bathroom, living room, garden",
      "Meubles : bed, sofa, wardrobe, fridge, sink",
      "'There is + singulier' / 'There are + pluriel' (Ex: There is a bed in my room / There are two chairs in the kitchen)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'armoire' in English?",
        options: ["bed", "sofa", "wardrobe", "fridge"],
        answer: 2,
        explanation: "'Wardrobe' est la traduction anglaise de 'armoire'.",
      },
      {
        difficulty: "moyen",
        question: "Complete: '___ a fridge in the kitchen.'",
        options: ["There is", "There are", "There has", "There have"],
        answer: 0,
        explanation: "'There is' s'utilise avec un nom singulier : There is a fridge in the kitchen.",
      },
      {
        difficulty: "difficile",
        question: "Complete: '___ three chairs in the living room.'",
        options: ["There is", "There are", "There has", "There have"],
        answer: 1,
        explanation: "'There are' s'utilise avec un nom pluriel : There are three chairs.",
      },
    ],
    quiz: [
      { question: "How do you say 'réfrigérateur' in English?", options: ["sink", "fridge", "sofa", "bed"], answer: 1 },
      { question: "How do you say 'évier' in English?", options: ["sink", "fridge", "wardrobe", "sofa"], answer: 0 },
      { question: "Complete: '___ a sofa in the living room.'", options: ["There is", "There are", "There has", "There have"], answer: 0 },
      { question: "How do you say 'jardin' in English?", options: ["kitchen", "bathroom", "garden", "bedroom"], answer: 2 },
      { question: "Complete: '___ two beds in the bedroom.'", options: ["There is", "There are", "There has", "There have"], answer: 1 },
    ],
  },

  l12: {
    summary:
      "Approfondissement des prépositions de lieu vues en 4ème année (in, on, under), avec l'ajout de 'next to' (à côté de) et 'between' (entre), pour décrire des positions plus précises.",
    keyPoints: [
      "In (dans), on (sur), under (sous) — révision",
      "Next to (à côté de) : The chair is next to the table.",
      "Between (entre) : The book is between the two boxes.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'à côté de' in English?",
        options: ["in", "on", "next to", "under"],
        answer: 2,
        explanation: "'Next to' signifie 'à côté de'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'entre' in English?",
        options: ["next to", "between", "under", "on"],
        answer: 1,
        explanation: "'Between' signifie 'entre' (généralement entre deux choses).",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'The cat is sleeping ___ the two cushions.'",
        options: ["next to", "between", "on", "in"],
        answer: 1,
        explanation: "'Between' convient ici car le chat dort entre deux coussins (deux éléments).",
      },
    ],
    quiz: [
      { question: "Complete: 'The chair is ___ the table.' (à côté de)", options: ["in", "on", "next to", "under"], answer: 2 },
      { question: "Complete: 'The pen is ___ the two books.' (entre)", options: ["next to", "between", "under", "on"], answer: 1 },
      { question: "How do you say 'sous' in English?", options: ["on", "in", "under", "next to"], answer: 2 },
      { question: "How do you say 'sur' in English?", options: ["in", "on", "under", "between"], answer: 1 },
      { question: "How do you say 'dans' in English?", options: ["in", "on", "under", "next to"], answer: 0 },
    ],
  },

  l13: {
    summary:
      "Découverte du vocabulaire des repas de la journée (breakfast, lunch, dinner) et de la nourriture associée, pour pouvoir parler de ses habitudes alimentaires.",
    keyPoints: [
      "Breakfast (petit-déjeuner), lunch (déjeuner), dinner (dîner)",
      "'I have + repas' (Ex: I have lunch at noon = Je déjeune à midi)",
      "Vocabulaire de nourriture : rice (riz), meat (viande), vegetables (légumes), fruit (fruits)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'déjeuner' (le repas) in English?",
        options: ["breakfast", "lunch", "dinner", "snack"],
        answer: 1,
        explanation: "'Lunch' est la traduction anglaise de 'déjeuner'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'légumes' in English?",
        options: ["fruit", "meat", "vegetables", "rice"],
        answer: 2,
        explanation: "'Vegetables' est la traduction anglaise de 'légumes'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'We ___ (have) dinner at 8 pm every day.'",
        options: ["has", "have", "having", "had"],
        answer: 1,
        explanation: "Avec 'we', on utilise 'have' au présent simple : We have dinner at 8 pm.",
      },
    ],
    quiz: [
      { question: "How do you say 'dîner' (le repas) in English?", options: ["breakfast", "lunch", "dinner", "snack"], answer: 2 },
      { question: "How do you say 'riz' in English?", options: ["rice", "meat", "fruit", "vegetables"], answer: 0 },
      { question: "How do you say 'viande' in English?", options: ["rice", "meat", "fruit", "vegetables"], answer: 1 },
      { question: "Complete: 'I ___ (have) breakfast at 7.'", options: ["has", "have", "having", "had"], answer: 1 },
      { question: "How do you say 'petit-déjeuner' in English?", options: ["breakfast", "lunch", "dinner", "snack"], answer: 0 },
    ],
  },

  l14: {
    summary:
      "Découverte des structures de base pour faire du shopping : demander le prix d'un article avec 'How much is/are...?' et répondre avec le prix en dinars.",
    keyPoints: [
      "'How much is this?' pour un objet singulier = Combien coûte ceci ?",
      "'How much are these?' pour des objets pluriels = Combien coûtent ceux-ci ?",
      "Réponse : 'It is X dinars' / 'They are X dinars'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you ask the price of one item in English?",
        options: ["How much is this?", "How much are these?", "How old is this?", "What is this?"],
        answer: 0,
        explanation: "'How much is this?' s'utilise pour demander le prix d'un seul objet.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'How much ___ these shoes?'",
        options: ["is", "are", "am", "be"],
        answer: 1,
        explanation: "'Shoes' est pluriel, donc on utilise 'are' : How much are these shoes?",
      },
      {
        difficulty: "difficile",
        question: "How do you answer 'How much is this book?' if it costs 5 dinars?",
        options: ["It is 5 dinars", "They are 5 dinars", "It have 5 dinars", "Five dinars is"],
        answer: 0,
        explanation: "Pour un objet singulier (this book), on répond avec 'It is + prix'.",
      },
    ],
    quiz: [
      { question: "How do you ask the price of several items?", options: ["How much is this?", "How much are these?", "How old are these?", "What are these?"], answer: 1 },
      { question: "Complete: 'How much ___ this pen?'", options: ["is", "are", "am", "be"], answer: 0 },
      { question: "How do you say 'dinars' in a price answer?", options: ["It is 3 dinars", "It has 3 dinars", "It make 3 dinars", "It take 3 dinars"], answer: 0 },
      { question: "What does 'How much' ask about?", options: ["le temps", "le prix ou la quantité", "le lieu", "la personne"], answer: 1 },
      { question: "Complete: 'They ___ 10 dinars.' (ces chaussures)", options: ["is", "are", "am", "be"], answer: 1 },
    ],
  },

  l15: {
    summary:
      "Approfondissement du vocabulaire des animaux avec leurs habitats naturels, pour comprendre où vivent différents animaux et enrichir le vocabulaire au-delà des animaux domestiques vus en 4ème année.",
    keyPoints: [
      "Habitats : forest (forêt), desert (désert), sea/ocean (mer/océan), jungle (jungle)",
      "'Lions live in the jungle/savanna' = Les lions vivent dans la jungle/savane",
      "'Fish live in the sea' = Les poissons vivent dans la mer",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'désert' in English?",
        options: ["forest", "desert", "sea", "jungle"],
        answer: 1,
        explanation: "'Desert' est la traduction anglaise de 'désert'.",
      },
      {
        difficulty: "moyen",
        question: "Where do fish live?",
        options: ["In the desert", "In the sea", "In the forest", "In the jungle"],
        answer: 1,
        explanation: "Les poissons vivent dans la mer : 'Fish live in the sea.'",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Camels ___ (live) in the desert because they need little water.'",
        options: ["live", "lives", "living", "lived"],
        answer: 0,
        explanation: "Avec 'camels' (pluriel), on utilise 'live' sans -s au présent simple.",
      },
    ],
    quiz: [
      { question: "How do you say 'forêt' in English?", options: ["forest", "desert", "sea", "jungle"], answer: 0 },
      { question: "Where do lions typically live?", options: ["In the sea", "In the jungle/savanna", "In the desert only", "In the forest"], answer: 1 },
      { question: "How do you say 'océan' in English?", options: ["desert", "forest", "ocean", "jungle"], answer: 2 },
      { question: "Complete: 'Fish ___ (live) in the sea.'", options: ["live", "lives", "living", "lived"], answer: 0 },
      { question: "How do you say 'jungle' in English?", options: ["jungle", "desert", "forest", "sea"], answer: 0 },
    ],
  },

  l16: {
    summary:
      "Découverte du présent continu (be + verbe-ing), utilisé pour exprimer une action en train de se dérouler au moment où l'on parle, différent du présent simple qui exprime une habitude.",
    keyPoints: [
      "Formation : sujet + be (am/is/are) + verbe-ing",
      "Exemple : I am reading a book right now (Je suis en train de lire un livre maintenant)",
      "Le présent continu s'utilise avec 'now' ou 'right now' pour insister sur l'instant présent",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ (read) a book now.'",
        options: ["read", "am reading", "reads", "reading"],
        answer: 1,
        explanation: "Le présent continu se forme avec 'am/is/are + verbe-ing' : I am reading.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'She ___ (play) in the garden right now.'",
        options: ["play", "plays", "is playing", "playing"],
        answer: 2,
        explanation: "Avec 'she', on utilise 'is' + verbe-ing : She is playing.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'They ___ (eat) dinner at the moment.'",
        options: ["eat", "eats", "is eating", "are eating"],
        answer: 3,
        explanation: "Avec 'they', on utilise 'are' + verbe-ing : They are eating.",
      },
    ],
    quiz: [
      { question: "Complete: 'He ___ (write) a letter now.'", options: ["write", "writes", "is writing", "writing"], answer: 2 },
      { question: "Complete: 'We ___ (watch) a film right now.'", options: ["watch", "watches", "is watching", "are watching"], answer: 3 },
      { question: "What auxiliary do we use with 'I' in the present continuous?", options: ["is", "am", "are", "be"], answer: 1 },
      { question: "Complete: 'You ___ (listen) to music now.'", options: ["listen", "listens", "is listening", "are listening"], answer: 3 },
      { question: "What ending do verbs take in the present continuous?", options: ["-s", "-ed", "-ing", "-er"], answer: 2 },
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