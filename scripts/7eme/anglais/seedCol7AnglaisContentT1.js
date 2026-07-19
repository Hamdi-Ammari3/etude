// scripts/seedCol7AnglaisContentT1.js
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

// Trimestre 1 — lessons l1 through l8
const LESSON_CONTENT = {
  l1: {
    summary:
      "Découverte des structures pour se présenter et présenter ses camarades de classe, en combinant le nom, l'âge, et des informations personnelles simples avec le verbe 'to be' et des questions de base.",
    keyPoints: [
      "'My name is...' / 'I am... years old.' pour se présenter",
      "'This is my classmate...' pour présenter quelqu'un d'autre",
      "Questions de base : 'What is your name?', 'How old are you?'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you introduce yourself in English?",
        options: ["My name is...", "This is...", "How are you?", "Where is..."],
        answer: 0,
        explanation: "'My name is...' est la structure standard pour se présenter.",
      },
      {
        difficulty: "moyen",
        question: "How do you introduce a classmate?",
        options: ["My name is...", "This is my classmate...", "How old are you?", "I am fine"],
        answer: 1,
        explanation: "'This is my classmate...' est utilisé pour présenter une autre personne.",
      },
      {
        difficulty: "difficile",
        question: "Complete this introduction: '___ Sami. ___ 12 years old, and ___ my classmate Amira.'",
        options: ["My name is / I am / this is", "I am / My name is / this is", "This is / I am / my name is", "My name is / this is / I am"],
        answer: 0,
        explanation: "'My name is Sami' (se présenter), 'I am 12 years old' (donner son âge), 'this is my classmate Amira' (présenter quelqu'un).",
      },
    ],
    quiz: [
      { question: "How do you ask someone's name?", options: ["What is your name?", "How old are you?", "Where are you?", "How are you?"], answer: 0 },
      { question: "How do you ask someone's age?", options: ["What is your name?", "How old are you?", "Where are you?", "How are you?"], answer: 1 },
      { question: "Complete: 'I ___ 13 years old.'", options: ["am", "is", "are", "be"], answer: 0 },
      { question: "How do you say 'Voici mon ami' in English?", options: ["This is my friend", "My name is friend", "I am friend", "Where is my friend"], answer: 0 },
      { question: "Complete: 'My name ___ Sami.'", options: ["am", "is", "are", "be"], answer: 1 },
    ],
  },

  l2: {
    summary:
      "Découverte du vocabulaire lié à l'école et à l'emploi du temps, avec les jours de la semaine et les matières scolaires, pour pouvoir parler de son horaire de cours.",
    keyPoints: [
      "Vocabulaire scolaire : timetable (emploi du temps), subject (matière), classroom (salle de classe)",
      "Matières : Maths, English, Arabic, French, Science, History",
      "'I have + matière + on + jour' (Ex: I have Maths on Monday)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'emploi du temps' in English?",
        options: ["timetable", "subject", "classroom", "school"],
        answer: 0,
        explanation: "'Timetable' est la traduction anglaise de 'emploi du temps'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'matière' (scolaire) in English?",
        options: ["timetable", "subject", "classroom", "teacher"],
        answer: 1,
        explanation: "'Subject' est la traduction anglaise de 'matière'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I ___ (have) English on Tuesday and Maths on ___.'",
        options: ["have / Thursday", "has / Thursday", "having / Thursday", "have / thursday (sans majuscule)"],
        answer: 0,
        explanation: "'Have' (1ère personne) et 'Thursday' (avec majuscule, comme tous les jours en anglais) sont corrects.",
      },
    ],
    quiz: [
      { question: "How do you say 'salle de classe' in English?", options: ["timetable", "subject", "classroom", "school"], answer: 2 },
      { question: "How do you say 'jeudi' in English?", options: ["Tuesday", "Wednesday", "Thursday", "Friday"], answer: 2 },
      { question: "Complete: 'I have Science on ___.' (mercredi)", options: ["Monday", "Wednesday", "Sunday", "Saturday"], answer: 1 },
      { question: "In English, days of the week start with:", options: ["a lowercase letter", "a capital letter", "a number", "no specific rule"], answer: 1 },
      { question: "How do you say 'l'histoire' (matière) in English?", options: ["History", "Story", "Geography", "Science"], answer: 0 },
    ],
  },

  l3: {
    summary:
      "Découverte du vocabulaire des pays et des nationalités, avec la structure 'I am from + pays' et 'I am + nationalité', pour pouvoir parler de son origine et de celle des autres.",
    keyPoints: [
      "'I am from + pays' (Ex: I am from Tunisia)",
      "'I am + nationalité' (Ex: I am Tunisian)",
      "Pays et nationalités courants : Tunisia/Tunisian, France/French, England/English",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'Je suis de Tunisie' in English?",
        options: ["I am from Tunisia", "I am Tunisia", "I am to Tunisia", "I from Tunisia"],
        answer: 0,
        explanation: "'I am from Tunisia' est la structure correcte pour indiquer son origine.",
      },
      {
        difficulty: "moyen",
        question: "What is the nationality for someone from France?",
        options: ["France", "French", "Frenchy", "Francian"],
        answer: 1,
        explanation: "'French' est l'adjectif de nationalité pour une personne originaire de France.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My friend ___ (be) from England, so she ___ (be) English.'",
        options: ["is / is", "are / is", "is / are", "am / is"],
        answer: 0,
        explanation: "'Is' (3ème pers. sing.) convient pour les deux verbes ici.",
      },
    ],
    quiz: [
      { question: "What is the nationality for someone from Tunisia?", options: ["Tunisia", "Tunisian", "Tunisean", "Tunis"], answer: 1 },
      { question: "How do you say 'anglais' (nationalité) in English?", options: ["England", "English", "Englishman only", "Britain"], answer: 1 },
      { question: "Complete: 'I ___ from Tunisia.'", options: ["am", "is", "are", "be"], answer: 0 },
      { question: "What nationality word comes from 'Egypt'?", options: ["Egypt", "Egyptian", "Egyptish", "Egyptese"], answer: 1 },
      { question: "How do you ask someone's nationality?", options: ["Where are you from?", "How old are you?", "What is your name?", "How are you?"], answer: 0 },
    ],
  },

  l4: {
    summary:
      "Révision approfondie du verbe 'to be' (I am, you are, he/she is...) et du présent simple pour les habitudes, deux notions essentielles déjà vues en primaire, pour consolider les bases avant d'aborder des structures plus complexes en collège.",
    keyPoints: [
      "'To be' : I am, you are, he/she/it is, we are, you are, they are",
      "Présent simple : sujet + verbe (+s à la 3ème pers. sing.) pour une habitude",
      "Ces deux bases sont essentielles pour construire des phrases plus complexes cette année",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'They ___ my friends.'",
        options: ["am", "is", "are", "be"],
        answer: 2,
        explanation: "Avec 'they', on utilise toujours 'are'.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'My sister ___ (like) chocolate.'",
        options: ["like", "likes", "liking", "liked"],
        answer: 1,
        explanation: "3ème personne du singulier au présent simple : likes.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'He ___ (be) a student, and he ___ (study) every day.'",
        options: ["is / studies", "are / study", "am / studies", "is / study"],
        answer: 0,
        explanation: "'Is' (verbe être) et 'studies' (présent simple, -ies pour les verbes en -y précédé d'une consonne) sont corrects.",
      },
    ],
    quiz: [
      { question: "Complete: 'She ___ my sister.'", options: ["am", "is", "are", "be"], answer: 1 },
      { question: "Complete: 'We ___ students.'", options: ["am", "is", "are", "be"], answer: 2 },
      { question: "Complete: 'He ___ (play) football every Saturday.'", options: ["play", "plays", "playing", "played"], answer: 1 },
      { question: "What is the short form of 'I am'?", options: ["I's", "I'm", "I'am", "Im"], answer: 1 },
      { question: "Complete: 'I ___ happy today.'", options: ["am", "is", "are", "be"], answer: 0 },
    ],
  },

  l5: {
    summary:
      "Découverte du vocabulaire de la famille élargie et de la maison, avec la structure 'This is my...' et 'There is/are' pour présenter les membres de sa famille et décrire son logement.",
    keyPoints: [
      "Famille élargie : grandmother, grandfather, uncle, aunt, cousin",
      "Maison : bedroom, kitchen, living room, garden",
      "'There is a + singulier' / 'There are + pluriel' pour décrire ce qui se trouve dans la maison",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'oncle' in English?",
        options: ["aunt", "uncle", "cousin", "grandfather"],
        answer: 1,
        explanation: "'Uncle' est la traduction anglaise de 'oncle'.",
      },
      {
        difficulty: "moyen",
        question: "Complete: '___ a garden behind my house.'",
        options: ["There is", "There are", "There has", "There have"],
        answer: 0,
        explanation: "'There is' s'utilise avec un nom singulier : There is a garden.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'In my house, ___ three bedrooms and ___ a big kitchen.'",
        options: ["there are / there is", "there is / there are", "there are / there are", "there is / there is"],
        answer: 0,
        explanation: "'There are' (pluriel, three bedrooms) et 'there is' (singulier, a big kitchen).",
      },
    ],
    quiz: [
      { question: "How do you say 'tante' in English?", options: ["uncle", "aunt", "cousin", "grandmother"], answer: 1 },
      { question: "How do you say 'chambre' in English?", options: ["kitchen", "bedroom", "garden", "living room"], answer: 1 },
      { question: "Complete: '___ two bathrooms in my house.'", options: ["There is", "There are", "There has", "There have"], answer: 1 },
      { question: "How do you say 'cuisine' in English?", options: ["bedroom", "kitchen", "garden", "bathroom"], answer: 1 },
      { question: "How do you say 'cousin' in English?", options: ["cousin", "nephew", "niece", "brother"], answer: 0 },
    ],
  },

  l6: {
    summary:
      "Découverte des adjectifs pour décrire l'apparence physique (tall, short, curly hair) et la personnalité (kind, funny, shy) d'une personne, pour pouvoir la décrire de façon complète.",
    keyPoints: [
      "Apparence physique : tall/short, long/short hair, curly/straight hair",
      "Personnalité : kind (gentil), funny (drôle), shy (timide), friendly (amical)",
      "Structure : 'He/She is + adjectif' ou 'He/She has + nom' (pour les cheveux, les yeux)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'timide' in English?",
        options: ["funny", "shy", "kind", "tall"],
        answer: 1,
        explanation: "'Shy' est la traduction anglaise de 'timide'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'Elle a les cheveux bouclés' in English?",
        options: ["She has curly hair", "She is curly hair", "She has straight hair", "She is curly"],
        answer: 0,
        explanation: "'She has curly hair' est la structure correcte pour décrire les cheveux.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My friend is very ___ ; she always makes people laugh.'",
        options: ["shy", "funny", "tall", "short"],
        answer: 1,
        explanation: "'Funny' (drôle) convient car elle fait toujours rire les gens.",
      },
    ],
    quiz: [
      { question: "How do you say 'gentil' in English?", options: ["kind", "funny", "shy", "tall"], answer: 0 },
      { question: "How do you say 'amical' in English?", options: ["friendly", "shy", "kind", "tall"], answer: 0 },
      { question: "Complete: 'He has ___ hair.' (cheveux longs)", options: ["long", "tall", "short height", "curly only"], answer: 0 },
      { question: "How do you say 'drôle' in English?", options: ["kind", "funny", "shy", "friendly"], answer: 1 },
      { question: "What is the opposite of 'tall'?", options: ["long", "short", "curly", "kind"], answer: 1 },
    ],
  },

  l7: {
    summary:
      "Découverte de vocabulaire et d'expressions pour présenter la Tunisie : sa localisation géographique, ses principales villes, et quelques traits culturels de base, pour pouvoir décrire son pays à un visiteur étranger.",
    keyPoints: [
      "'Tunisia is in North Africa.' pour la localisation",
      "Villes principales : Tunis (the capital), Sousse, Sfax, Djerba",
      "'Welcome to Tunisia!' expression d'accueil courante",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Where is Tunisia located?",
        options: ["In North Africa", "In Europe", "In Asia", "In South America"],
        answer: 0,
        explanation: "La Tunisie se trouve en Afrique du Nord.",
      },
      {
        difficulty: "moyen",
        question: "What is the capital of Tunisia?",
        options: ["Sousse", "Sfax", "Tunis", "Djerba"],
        answer: 2,
        explanation: "Tunis est la capitale de la Tunisie.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Tunisia ___ (be) a beautiful country, and its capital ___ (be) Tunis.'",
        options: ["is / is", "are / is", "is / are", "am / is"],
        answer: 0,
        explanation: "'Is' (3ème pers. sing.) convient pour les deux affirmations.",
      },
    ],
    quiz: [
      { question: "How do you say 'Bienvenue en Tunisie !' in English?", options: ["Welcome to Tunisia!", "Welcome in Tunisia!", "Come to Tunisia!", "Tunisia welcome!"], answer: 0 },
      { question: "Which city is a famous island in Tunisia?", options: ["Sousse", "Djerba", "Tunis", "Sfax"], answer: 1 },
      { question: "What continent is Tunisia part of?", options: ["Europe", "Asia", "Africa", "America"], answer: 2 },
      { question: "What is a major city in southern Tunisia?", options: ["Sfax", "Bizerte", "Tunis", "Nabeul"], answer: 0 },
      { question: "Complete: 'Tunisia ___ many beautiful beaches.'", options: ["has", "have", "is", "are"], answer: 0 },
    ],
  },

  l8: {
    summary:
      "Approfondissement du vocabulaire des villes et monuments tunisiens, avec des structures pour décrire un lieu touristique et exprimer une recommandation simple (You should visit...).",
    keyPoints: [
      "Monuments et lieux : the Medina, the amphitheater, the beach, the museum",
      "'You should visit + lieu' pour recommander un endroit",
      "'It is famous for + nom' pour expliquer pourquoi un lieu est connu",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'la médina' in English?",
        options: ["the Medina", "the museum", "the beach", "the market"],
        answer: 0,
        explanation: "'The Medina' se dit pareil en anglais, c'est un emprunt direct.",
      },
      {
        difficulty: "moyen",
        question: "How do you recommend visiting a place?",
        options: ["You should visit...", "You must not visit...", "You never visit...", "You visited..."],
        answer: 0,
        explanation: "'You should visit...' est la structure pour recommander poliment un lieu.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'El Djem ___ (be) famous for ___ ancient amphitheater.'",
        options: ["is / its", "are / their", "is / their", "am / its"],
        answer: 0,
        explanation: "'Is' (3ème pers. sing.) et 'its' (adjectif possessif pour un lieu/chose) sont corrects.",
      },
    ],
    quiz: [
      { question: "How do you say 'célèbre pour' in English?", options: ["famous for", "famous of", "famous with", "famous at"], answer: 0 },
      { question: "What structure recommends a place?", options: ["You should visit", "You never visit", "You must not visit", "You visited"], answer: 0 },
      { question: "How do you say 'plage' in English?", options: ["beach", "museum", "market", "amphitheater"], answer: 0 },
      { question: "How do you say 'musée' in English?", options: ["beach", "museum", "market", "medina"], answer: 1 },
      { question: "Complete: 'The amphitheater ___ very old.'", options: ["is", "are", "am", "be"], answer: 0 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});