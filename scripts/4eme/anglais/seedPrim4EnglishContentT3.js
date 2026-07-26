// scripts/seedPrim4EnglishContentT3.js
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

const GRADE_ID = "prim-4";
const SUBJECT_ID = "anglais";

const LESSON_CONTENT = {
  l17: {
    summary:
      "Découverte d'adjectifs simples en anglais pour décrire des personnes, des objets ou des sentiments : big/small (grand/petit), happy/sad (content/triste).",
    keyPoints: [
      "Big (grand), small (petit)",
      "Happy (content/heureux), sad (triste)",
      "Structure : 'It is + adjectif' ou 'I am + adjectif' (Ex: I am happy)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'grand' in English?",
        options: ["small", "big", "sad", "happy"],
        answer: 1,
        explanation: "'Big' est la traduction anglaise de 'grand'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'triste' in English?",
        options: ["happy", "big", "sad", "small"],
        answer: 2,
        explanation: "'Sad' est la traduction anglaise de 'triste'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'The elephant is ___, but the mouse is ___.'",
        options: ["small / big", "big / small", "happy / sad", "sad / happy"],
        answer: 1,
        explanation: "L'éléphant est grand ('big') et la souris est petite ('small').",
      },
    ],
    quiz: [
      { question: "How do you say 'petit' in English?", options: ["big", "small", "happy", "sad"], answer: 1 },
      { question: "How do you say 'content' in English?", options: ["sad", "big", "happy", "small"], answer: 2 },
      { question: "Complete: 'I am ___ today!' (feeling good)", options: ["sad", "small", "happy", "big"], answer: 2 },
      { question: "What is the opposite of 'big'?", options: ["happy", "sad", "small", "good"], answer: 2 },
      { question: "What is the opposite of 'happy'?", options: ["big", "small", "sad", "good"], answer: 2 },
    ],
    videoLinks: [
      {
        title: "Adjectives and Opposites Song | Children's Songs",
        url: "https://www.youtube.com/watch?v=Qfl9m0sff-4",
        channel: "Fun Kids English",
      },
    ],
  },

  l18: {
    summary:
      "Découverte du vocabulaire de la maison en anglais : les pièces et quelques meubles, pour pouvoir décrire son logement.",
    keyPoints: [
      "Rooms: kitchen (cuisine), bedroom (chambre), bathroom (salle de bain), living room (salon)",
      "Furniture: bed (lit), sofa (canapé), table (table), door (porte), window (fenêtre)",
      "Structure : 'There is a + meuble + in the + pièce' (Ex: There is a bed in the bedroom)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'cuisine' in English?",
        options: ["bedroom", "kitchen", "bathroom", "living room"],
        answer: 1,
        explanation: "'Kitchen' est la traduction anglaise de 'cuisine'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'chambre' in English?",
        options: ["kitchen", "bathroom", "bedroom", "living room"],
        answer: 2,
        explanation: "'Bedroom' est la traduction anglaise de 'chambre'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'There is a bed in the ___.'",
        options: ["kitchen", "bathroom", "bedroom", "garden"],
        answer: 2,
        explanation: "Le lit se trouve normalement dans la chambre ('bedroom').",
      },
    ],
    quiz: [
      { question: "How do you say 'salle de bain' in English?", options: ["kitchen", "bathroom", "bedroom", "living room"], answer: 1 },
      { question: "How do you say 'salon' in English?", options: ["living room", "bedroom", "kitchen", "bathroom"], answer: 0 },
      { question: "How do you say 'lit' in English?", options: ["sofa", "bed", "table", "door"], answer: 1 },
      { question: "How do you say 'fenêtre' in English?", options: ["door", "window", "table", "sofa"], answer: 1 },
      { question: "How do you say 'canapé' in English?", options: ["bed", "table", "sofa", "door"], answer: 2 },
    ],
    videoLinks: [
      {
        title: "Parts of the House | Kids Vocabulary",
        url: "https://www.youtube.com/watch?v=aOSJZbHoiY8",
        channel: "Fun Kids English",
      },
    ],
  },

  l19: {
    summary:
      "Apprentissage du vocabulaire de la météo en anglais, pour pouvoir décrire le temps qu'il fait et répondre à la question 'How is the weather today?'.",
    keyPoints: [
      "Sunny (ensoleillé), rainy (pluvieux), cloudy (nuageux), windy (venteux)",
      "Hot (chaud), cold (froid)",
      "Structure : 'It is + adjectif de météo' (Ex: It is sunny today)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'il fait chaud' in English?",
        options: ["It is cold", "It is hot", "It is rainy", "It is windy"],
        answer: 1,
        explanation: "'It is hot' signifie 'Il fait chaud'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'ensoleillé' in English?",
        options: ["rainy", "cloudy", "sunny", "windy"],
        answer: 2,
        explanation: "'Sunny' est la traduction anglaise de 'ensoleillé'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'In winter, it is usually ___ in Tunisia.'",
        options: ["hot", "cold", "sunny only", "never cloudy"],
        answer: 1,
        explanation: "En hiver, il fait généralement froid ('cold') en Tunisie.",
      },
    ],
    quiz: [
      { question: "How do you say 'pluvieux' in English?", options: ["sunny", "rainy", "windy", "hot"], answer: 1 },
      { question: "How do you say 'froid' in English?", options: ["hot", "cold", "windy", "sunny"], answer: 1 },
      { question: "How do you say 'venteux' in English?", options: ["cloudy", "windy", "rainy", "sunny"], answer: 1 },
      { question: "How do you say 'nuageux' in English?", options: ["cloudy", "sunny", "hot", "cold"], answer: 0 },
      { question: "Complete: 'It is ___ today, take an umbrella.'", options: ["sunny", "hot", "rainy", "cold"], answer: 2 },
    ],
    videoLinks: [
      {
        title: "Weather Song for Kids | Sunny, Cloudy, Rainy, Snowy",
        url: "https://www.youtube.com/watch?v=Unbc3y1RefQ",
        channel: "Fun Kids English",
      },
    ],
  },

  l20: {
    summary:
      "Utilisation du présent simple avec 'I like' et 'I don't like' pour exprimer ses goûts et ses préférences de façon simple et claire.",
    keyPoints: [
      "'I like + nom' pour exprimer un goût positif (Ex: I like apples)",
      "'I don't like + nom' pour exprimer un goût négatif (Ex: I don't like rain)",
      "Avec 'he/she/it', on dit 'likes' et 'doesn't like'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ chocolate.' (positive)",
        options: ["like", "don't like", "am", "have"],
        answer: 0,
        explanation: "Pour exprimer un goût positif, on utilise 'like' : I like chocolate.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'I ___ spiders.' (negative, if you don't like them)",
        options: ["like", "don't like", "am", "has"],
        answer: 1,
        explanation: "Pour exprimer un goût négatif, on utilise 'don't like' : I don't like spiders.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'She ___ football.' (positive, he/she form)",
        options: ["like", "likes", "don't like", "doesn't like"],
        answer: 1,
        explanation: "Avec 'she', le verbe 'like' devient 'likes' à la forme positive.",
      },
    ],
    quiz: [
      { question: "Complete: 'I ___ cats.' (positive)", options: ["like", "don't like", "is", "has"], answer: 0 },
      { question: "Complete: 'He ___ rain.' (negative)", options: ["don't like", "doesn't like", "like", "likes"], answer: 1 },
      { question: "How do you express a positive preference?", options: ["I don't like", "I like", "I am", "I have"], answer: 1 },
      { question: "How do you express a negative preference?", options: ["I like", "I am", "I don't like", "I has"], answer: 2 },
      { question: "Complete: 'They ___ vegetables.' (positive)", options: ["likes", "like", "doesn't like", "am"], answer: 1 },
    ],
    videoLinks: [
      {
        title: "Do You Like? Song for Kids | Learn English for Children",
        url: "https://www.youtube.com/watch?v=YngQO-u9sWQ",
        channel: "Fun Kids English",
      },
    ],
  },

  l21: {
    summary:
      "Découverte des prépositions de lieu de base en anglais : in (dans), on (sur), under (sous), pour pouvoir décrire la position d'un objet par rapport à un autre.",
    keyPoints: [
      "In (dans) : The pen is in the bag",
      "On (sur) : The book is on the table",
      "Under (sous) : The cat is under the table",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'The book is ___ the table.' (on top of it)",
        options: ["in", "on", "under", "at"],
        answer: 1,
        explanation: "'On' signifie 'sur' quand un objet est posé au-dessus d'un autre.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'The pen is ___ the bag.' (inside it)",
        options: ["in", "on", "under", "at"],
        answer: 0,
        explanation: "'In' signifie 'dans' quand un objet est à l'intérieur d'un autre.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'The cat is sleeping ___ the bed.' (beneath it)",
        options: ["in", "on", "under", "at"],
        answer: 2,
        explanation: "'Under' signifie 'sous' quand un objet est en dessous d'un autre.",
      },
    ],
    quiz: [
      { question: "How do you say 'dans' in English?", options: ["on", "in", "under", "at"], answer: 1 },
      { question: "How do you say 'sur' in English?", options: ["in", "on", "under", "at"], answer: 1 },
      { question: "How do you say 'sous' in English?", options: ["in", "on", "under", "at"], answer: 2 },
      { question: "Complete: 'The ball is ___ the box.' (inside)", options: ["on", "in", "under", "at"], answer: 1 },
      { question: "Complete: 'The shoes are ___ the bed.' (beneath)", options: ["on", "in", "under", "at"], answer: 2 },
    ],
    videoLinks: [
      {
        title: "Prepositions Song for Kids | In On Under",
        url: "https://www.youtube.com/watch?v=ZDklTwnR8i8",
        channel: "Fun Kids English",
      },
    ],
  },

  l22: {
    summary:
      "Apprentissage de l'heure en anglais avec les heures exactes ('o'clock'), pour pouvoir dire et comprendre l'heure simple, sans les minutes.",
    keyPoints: [
      "'It is + nombre + o'clock' pour une heure exacte (Ex: It is three o'clock = Il est trois heures)",
      "'What time is it?' = Quelle heure est-il ?",
      "'O'clock' s'utilise uniquement pour les heures rondes, sans minutes",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you ask 'Quelle heure est-il ?' in English?",
        options: ["What time is it?", "What is your name?", "How old are you?", "Where are you?"],
        answer: 0,
        explanation: "'What time is it?' est la question pour demander l'heure.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'Il est cinq heures' in English?",
        options: ["It is five", "It is five o'clock", "It is o'clock five", "Five is o'clock"],
        answer: 1,
        explanation: "'It is five o'clock' est la formule correcte pour dire 'Il est cinq heures'.",
      },
      {
        difficulty: "difficile",
        question: "If it is 9:00, how do you say the time in English?",
        options: ["It is nine o'clock", "It is o'clock nine", "It nine o'clock", "Nine o'clock it is"],
        answer: 0,
        explanation: "'It is nine o'clock' est l'ordre correct des mots pour dire l'heure exacte.",
      },
    ],
    quiz: [
      { question: "How do you say 'Il est une heure' in English?", options: ["It is one o'clock", "It is o'clock one", "One is o'clock", "It one o'clock"], answer: 0 },
      { question: "What does 'o'clock' indicate?", options: ["les minutes", "une heure exacte", "un jour", "un mois"], answer: 1 },
      { question: "How do you say 'Il est dix heures' in English?", options: ["It is ten o'clock", "It is o'clock ten", "Ten o'clock", "It ten is o'clock"], answer: 0 },
      { question: "Complete: 'What ___ is it?'", options: ["time", "day", "date", "hour"], answer: 0 },
      { question: "How do you say 'Il est sept heures' in English?", options: ["It is seven o'clock", "It seven o'clock", "It is o'clock seven", "Seven it is o'clock"], answer: 0 },
    ],
    videoLinks: [
      {
        title: "Tell the Time Song | Learn to Tell Time for Kids",
        url: "https://www.youtube.com/watch?v=K5q65e_E-os",
        channel: "Fun Kids English",
      },
    ],
  },

  l23: {
    summary:
      "Découverte du vocabulaire lié à l'école en anglais : les matières scolaires et quelques activités courantes, pour pouvoir parler de sa journée d'école.",
    keyPoints: [
      "Subjects: English, French, Arabic, Math, Science",
      "Activities: read (lire), write (écrire), draw (dessiner), sing (chanter)",
      "Structure : 'I study + matière' (Ex: I study Math = J'étudie les maths)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'lire' in English?",
        options: ["write", "read", "draw", "sing"],
        answer: 1,
        explanation: "'Read' est la traduction anglaise de 'lire'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'écrire' in English?",
        options: ["read", "draw", "write", "sing"],
        answer: 2,
        explanation: "'Write' est la traduction anglaise de 'écrire'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'In Math class, we ___ numbers and solve problems.'",
        options: ["sing", "draw", "study", "sleep"],
        answer: 2,
        explanation: "'Study' (étudier) est le verbe qui convient pour décrire ce qu'on fait en classe de maths.",
      },
    ],
    quiz: [
      { question: "How do you say 'dessiner' in English?", options: ["write", "read", "draw", "sing"], answer: 2 },
      { question: "How do you say 'chanter' in English?", options: ["sing", "draw", "read", "write"], answer: 0 },
      { question: "Which word means a school subject?", options: ["read", "Math", "draw", "sing"], answer: 1 },
      { question: "Complete: 'I like to ___ stories.' (lire)", options: ["write", "read", "sing", "draw"], answer: 1 },
      { question: "Complete: 'We ___ in Art class.' (dessiner)", options: ["read", "write", "draw", "sing"], answer: 2 },
    ],
    videoLinks: [
      {
        title: "School Subjects Song | What Do You Study at School?",
        url: "https://www.youtube.com/watch?v=JoDm0RC5gk8",
        channel: "Fun Kids English",
      },
    ],
  },

  l24: {
    summary:
      "Découverte du présent simple pour parler de la routine quotidienne : les actions habituelles comme se réveiller, manger et dormir, avec les verbes conjugués à la 1ère personne.",
    keyPoints: [
      "Wake up (se réveiller), eat (manger), sleep (dormir)",
      "Go to school (aller à l'école), play (jouer), study (étudier)",
      "Structure : 'I + verbe' pour une action habituelle (Ex: I wake up at 7 o'clock)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'se réveiller' in English?",
        options: ["sleep", "eat", "wake up", "play"],
        answer: 2,
        explanation: "'Wake up' est la traduction anglaise de 'se réveiller'.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'I ___ breakfast every morning.'",
        options: ["sleep", "eat", "wake up", "study"],
        answer: 1,
        explanation: "'Eat' (manger) convient pour parler du petit-déjeuner : I eat breakfast.",
      },
      {
        difficulty: "difficile",
        question: "Put in the correct order: 'I wake up, I eat breakfast, I go to school.' What happens first?",
        options: ["I go to school", "I eat breakfast", "I wake up", "I sleep"],
        answer: 2,
        explanation: "Dans une routine typique, on se réveille ('wake up') en premier, avant de manger et d'aller à l'école.",
      },
    ],
    quiz: [
      { question: "How do you say 'dormir' in English?", options: ["wake up", "eat", "sleep", "play"], answer: 2 },
      { question: "How do you say 'jouer' in English?", options: ["play", "study", "sleep", "eat"], answer: 0 },
      { question: "Complete: 'I ___ to school every day.' (aller)", options: ["go", "eat", "sleep", "play"], answer: 0 },
      { question: "Complete: 'I ___ at night.' (dormir)", options: ["wake up", "eat", "sleep", "study"], answer: 2 },
      { question: "Which verb describes studying at home?", options: ["sleep", "study", "wake up", "play"], answer: 1 },
    ],
    videoLinks: [
      {
        title: "This Is The Way - Morning Routines Song",
        url: "https://www.youtube.com/watch?v=9ji9K20U6ms",
        channel: "Fun Kids English",
      },
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