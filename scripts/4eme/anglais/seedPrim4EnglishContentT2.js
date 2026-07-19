// scripts/seedPrim4EnglishContentT2.js
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

// Trimestre 2 — lessons l9 through l16
const LESSON_CONTENT = {
  l9: {
    summary:
      "Apprentissage des nombres de 11 à 20 en anglais. La plupart de ces nombres se terminent par '-teen', sauf onze et douze qui ont une forme particulière à retenir.",
    keyPoints: [
      "11 = eleven, 12 = twelve (formes particulières à mémoriser)",
      "13 = thirteen, 14 = fourteen, 15 = fifteen, 16 = sixteen",
      "17 = seventeen, 18 = eighteen, 19 = nineteen, 20 = twenty",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say '15' in English?",
        options: ["fiveteen", "fifteen", "fivteen", "fifteen"],
        answer: 1,
        explanation: "'Fifteen' est la traduction anglaise du nombre 15.",
      },
      {
        difficulty: "moyen",
        question: "Which number is 'eighteen'?",
        options: ["16", "17", "18", "19"],
        answer: 2,
        explanation: "'Eighteen' correspond au nombre 18.",
      },
      {
        difficulty: "difficile",
        question: "What is 'twelve' + 'three' in English?",
        options: ["fourteen", "fifteen", "sixteen", "thirteen"],
        answer: 1,
        explanation: "12 + 3 = 15, qui se dit 'fifteen' en anglais.",
      },
    ],
    quiz: [
      { question: "How do you say '11' in English?", options: ["ten", "eleven", "twelve", "one"], answer: 1 },
      { question: "How do you say '20' in English?", options: ["ten", "twelve", "twenty", "two"], answer: 2 },
      { question: "Which number is 'sixteen'?", options: ["15", "16", "17", "18"], answer: 1 },
      { question: "How do you say '12' in English?", options: ["eleven", "twelve", "twenty", "ten"], answer: 1 },
      { question: "What comes after 'nineteen'?", options: ["eighteen", "twenty", "ten", "nine"], answer: 1 },
    ],
  },

  l10: {
    summary:
      "Découverte des expressions 'This is' et 'These are', utilisées pour présenter une chose (singulier) ou plusieurs choses (pluriel) proches de nous.",
    keyPoints: [
      "'This is' + nom singulier : This is a book (Ceci est un livre)",
      "'These are' + nom pluriel : These are books (Ce sont des livres)",
      "Le nom pluriel se termine généralement par -s en anglais",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: ___ a pen.",
        options: ["This is", "These are", "This are", "These is"],
        answer: 0,
        explanation: "'This is' s'utilise avec un nom singulier : This is a pen.",
      },
      {
        difficulty: "moyen",
        question: "Complete: ___ my books.",
        options: ["This is", "These are", "This are", "These is"],
        answer: 1,
        explanation: "'These are' s'utilise avec un nom pluriel : These are my books.",
      },
      {
        difficulty: "difficile",
        question: "Which sentence is correct?",
        options: ["This are my friends", "These is my friend", "These are my friends", "This is my friends"],
        answer: 2,
        explanation: "'These are my friends' est correct : nom pluriel (friends) avec 'These are'.",
      },
    ],
    quiz: [
      { question: "Complete: ___ my chair.", options: ["This is", "These are", "This are", "These is"], answer: 0 },
      { question: "Complete: ___ my pencils.", options: ["This is", "These are", "This are", "These is"], answer: 1 },
      { question: "Which word means 'ceci' (singulier) ?", options: ["This", "These", "Those", "That"], answer: 0 },
      { question: "Which word means 'ces' (pluriel) ?", options: ["This", "These", "It", "That"], answer: 1 },
      { question: "Complete: ___ a table.", options: ["This is", "These are", "This are", "These is"], answer: 0 },
    ],
  },

  l11: {
    summary:
      "Découverte du vocabulaire des animaux en anglais, pour pouvoir nommer les animaux courants et parler de ses préférences avec 'I like'.",
    keyPoints: [
      "Cat (chat), dog (chien), bird (oiseau), fish (poisson)",
      "Rabbit (lapin), horse (cheval), cow (vache), sheep (mouton)",
      "Structure : 'I like + animal' (Ex: I like cats = J'aime les chats)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'chat' in English?",
        options: ["dog", "cat", "bird", "fish"],
        answer: 1,
        explanation: "'Cat' est la traduction anglaise de 'chat'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'poisson' in English?",
        options: ["bird", "fish", "cow", "horse"],
        answer: 1,
        explanation: "'Fish' est la traduction anglaise de 'poisson'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I ___ dogs, but I don't like cats.'",
        options: ["am", "like", "is", "are"],
        answer: 1,
        explanation: "'I like' exprime une préférence positive : I like dogs.",
      },
    ],
    quiz: [
      { question: "How do you say 'chien' in English?", options: ["cat", "dog", "bird", "fish"], answer: 1 },
      { question: "How do you say 'oiseau' in English?", options: ["bird", "fish", "cow", "sheep"], answer: 0 },
      { question: "How do you say 'cheval' in English?", options: ["cow", "sheep", "horse", "rabbit"], answer: 2 },
      { question: "How do you say 'lapin' in English?", options: ["rabbit", "horse", "cow", "sheep"], answer: 0 },
      { question: "How do you say 'vache' in English?", options: ["horse", "sheep", "cow", "cat"], answer: 2 },
    ],
  },

  l12: {
    summary:
      "Découverte du vocabulaire des parties du corps en anglais, pour pouvoir se décrire physiquement et comprendre des consignes simples liées au corps.",
    keyPoints: [
      "Head (tête), eyes (yeux), nose (nez), mouth (bouche)",
      "Hands (mains), arms (bras), legs (jambes), feet (pieds)",
      "Structure : 'I have + partie du corps' (Ex: I have two hands)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'tête' in English?",
        options: ["hand", "head", "leg", "arm"],
        answer: 1,
        explanation: "'Head' est la traduction anglaise de 'tête'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'yeux' in English?",
        options: ["ears", "eyes", "nose", "mouth"],
        answer: 1,
        explanation: "'Eyes' est la traduction anglaise de 'yeux'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I have two ___.' (referring to what you see with)",
        options: ["eyes", "eye", "head", "nose"],
        answer: 0,
        explanation: "On a deux yeux, donc au pluriel : I have two eyes.",
      },
    ],
    quiz: [
      { question: "How do you say 'main' in English?", options: ["hand", "arm", "leg", "foot"], answer: 0 },
      { question: "How do you say 'jambe' in English?", options: ["arm", "leg", "hand", "head"], answer: 1 },
      { question: "How do you say 'nez' in English?", options: ["mouth", "eyes", "nose", "ears"], answer: 2 },
      { question: "How do you say 'bouche' in English?", options: ["nose", "mouth", "ears", "eyes"], answer: 1 },
      { question: "How do you say 'pied' in English?", options: ["hand", "arm", "foot", "leg"], answer: 2 },
    ],
  },

  l13: {
    summary:
      "Découverte du verbe 'to have' (avoir) au présent, utilisé pour exprimer la possession. Il change légèrement de forme à la 3ème personne du singulier (he/she/it).",
    keyPoints: [
      "I have, you have, we have, they have (forme identique)",
      "He/she/it has (forme spéciale à la 3ème personne du singulier)",
      "Structure : 'I have + objet' (Ex: I have a bike = J'ai un vélo)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: I ___ a bike.",
        options: ["has", "have", "am", "is"],
        answer: 1,
        explanation: "Avec 'I', on utilise 'have' : I have a bike.",
      },
      {
        difficulty: "moyen",
        question: "Complete: She ___ a cat.",
        options: ["have", "has", "am", "are"],
        answer: 1,
        explanation: "Avec 'he/she/it', le verbe 'to have' devient 'has' : She has a cat.",
      },
      {
        difficulty: "difficile",
        question: "Which sentence is correct?",
        options: ["He have a dog", "They has a dog", "We has a dog", "They have a dog"],
        answer: 3,
        explanation: "'They have a dog' est correct : avec 'they', on utilise 'have' (pas 'has').",
      },
    ],
    quiz: [
      { question: "Complete: You ___ a nice pen.", options: ["has", "have", "am", "is"], answer: 1 },
      { question: "Complete: He ___ a sister.", options: ["have", "has", "am", "are"], answer: 1 },
      { question: "Complete: We ___ a big house.", options: ["has", "have", "is", "am"], answer: 1 },
      { question: "Complete: It ___ four legs.", options: ["have", "has", "are", "am"], answer: 1 },
      { question: "Which form is used with 'she'?", options: ["have", "has", "am", "are"], answer: 1 },
    ],
  },

  l14: {
    summary:
      "Découverte du vocabulaire de la nourriture et des boissons en anglais, pour pouvoir exprimer ses goûts alimentaires et commander simplement.",
    keyPoints: [
      "Bread (pain), milk (lait), water (eau), juice (jus)",
      "Apple (pomme), banana (banane), egg (œuf), cheese (fromage)",
      "Structure : 'I like/I don't like + aliment' pour exprimer ses goûts",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'pain' in English?",
        options: ["milk", "bread", "water", "juice"],
        answer: 1,
        explanation: "'Bread' est la traduction anglaise de 'pain'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'pomme' in English?",
        options: ["banana", "apple", "egg", "cheese"],
        answer: 1,
        explanation: "'Apple' est la traduction anglaise de 'pomme'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I like apples, but I ___ bananas.'",
        options: ["like", "don't like", "am", "have"],
        answer: 1,
        explanation: "Pour exprimer un goût négatif, on utilise 'don't like' : I don't like bananas.",
      },
    ],
    quiz: [
      { question: "How do you say 'lait' in English?", options: ["water", "milk", "juice", "bread"], answer: 1 },
      { question: "How do you say 'eau' in English?", options: ["milk", "juice", "water", "bread"], answer: 2 },
      { question: "How do you say 'œuf' in English?", options: ["cheese", "egg", "banana", "apple"], answer: 1 },
      { question: "How do you say 'fromage' in English?", options: ["egg", "cheese", "milk", "bread"], answer: 1 },
      { question: "How do you say 'jus' in English?", options: ["water", "milk", "juice", "bread"], answer: 2 },
    ],
  },

  l15: {
    summary:
      "Apprentissage des mois de l'année en anglais, pour pouvoir parler des dates, des anniversaires, et des saisons. Comme les jours, les mois s'écrivent toujours avec une majuscule.",
    keyPoints: [
      "January (janvier), February (février), March (mars), April (avril)",
      "May (mai), June (juin), July (juillet), August (août)",
      "September (septembre), October (octobre), November (novembre), December (décembre)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'janvier' in English?",
        options: ["June", "January", "July", "March"],
        answer: 1,
        explanation: "'January' est la traduction anglaise de 'janvier', le premier mois de l'année.",
      },
      {
        difficulty: "moyen",
        question: "Which month comes after 'March'?",
        options: ["February", "April", "May", "January"],
        answer: 1,
        explanation: "L'ordre est ...February, March, April... donc April vient après March.",
      },
      {
        difficulty: "difficile",
        question: "Which month is the last month of the year?",
        options: ["November", "October", "December", "September"],
        answer: 2,
        explanation: "'December' est le dernier mois de l'année.",
      },
    ],
    quiz: [
      { question: "How do you say 'décembre' in English?", options: ["November", "December", "October", "January"], answer: 1 },
      { question: "How do you say 'juillet' in English?", options: ["June", "July", "August", "May"], answer: 1 },
      { question: "Which month comes before 'September'?", options: ["July", "August", "October", "June"], answer: 1 },
      { question: "How do you say 'mai' in English?", options: ["March", "April", "May", "June"], answer: 2 },
      { question: "How many months are there in a year?", options: ["10", "11", "12", "13"], answer: 2 },
    ],
  },

  l16: {
    summary:
      "Apprentissage des questions essentielles pour se présenter : demander le nom d'une personne avec 'What is your name?' et son âge avec 'How old are you?', et savoir y répondre.",
    keyPoints: [
      "'What is your name?' = Comment t'appelles-tu ?",
      "Réponse : 'My name is...' = Je m'appelle...",
      "'How old are you?' = Quel âge as-tu ?",
      "Réponse : 'I am ... years old' = J'ai ... ans",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you ask someone's name in English?",
        options: ["How old are you?", "What is your name?", "Where are you?", "How are you?"],
        answer: 1,
        explanation: "'What is your name?' est la question pour demander le nom de quelqu'un.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'My name ___ Sami.'",
        options: ["am", "is", "are", "have"],
        answer: 1,
        explanation: "'My name' (il/elle) utilise 'is' : My name is Sami.",
      },
      {
        difficulty: "difficile",
        question: "How do you correctly answer 'How old are you?' if you are 9 years old?",
        options: ["I am 9", "I am 9 years old", "I have 9 years", "I 9 years old"],
        answer: 1,
        explanation: "La réponse complète et correcte est 'I am 9 years old' (bien que 'I am 9' soit aussi accepté familièrement).",
      },
    ],
    quiz: [
      { question: "How do you ask someone's age in English?", options: ["What is your name?", "How old are you?", "Where are you?", "How are you?"], answer: 1 },
      { question: "Complete: 'I ___ 10 years old.'", options: ["have", "am", "is", "are"], answer: 1 },
      { question: "What does 'My name is...' mean?", options: ["Mon âge est...", "Je m'appelle...", "Ma classe est...", "J'habite à..."], answer: 1 },
      { question: "Complete: 'My name ___ Amira.'", options: ["am", "is", "are", "have"], answer: 1 },
      { question: "What does 'How old are you?' mean?", options: ["Comment vas-tu ?", "Quel âge as-tu ?", "Où habites-tu ?", "Comment t'appelles-tu ?"], answer: 1 },
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