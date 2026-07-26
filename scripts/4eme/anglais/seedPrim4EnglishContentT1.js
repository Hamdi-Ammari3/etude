// scripts/seedPrim4EnglishContentT1.js
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

// Trimestre 1 — lessons l1 through l8
// videoLinks added: real, existing YouTube videos found via web search,
// prioritizing established/official channels (British Council LearnEnglish
// Kids, Super Simple Songs, Dream English, Have Fun Teaching). I could not
// watch the videos myself to verify content/quality end-to-end — please
// do a final sanity check on each link (dialect, ad load, appropriateness)
// before treating them as fully vetted.
const LESSON_CONTENT = {
  l1: {
    summary:
      "Découverte de l'alphabet anglais, composé de 26 lettres. La prononciation de certaines lettres est différente du français, notamment G, H, J, W et Y. On apprend à reconnaître et à prononcer chaque lettre.",
    keyPoints: [
      "L'alphabet anglais a 26 lettres, comme le français",
      "Certaines lettres se prononcent différemment : G se dit 'dji', H se dit 'eïtch', W se dit 'dabelyou'",
      "5 voyelles : A, E, I, O, U",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How many letters are there in the English alphabet?",
        options: ["24", "25", "26", "27"],
        answer: 2,
        explanation: "L'alphabet anglais compte 26 lettres, tout comme l'alphabet français.",
      },
      {
        difficulty: "moyen",
        question: "Which letter comes after 'M' in the alphabet?",
        options: ["L", "N", "O", "K"],
        answer: 1,
        explanation: "L'ordre alphabétique est ...K, L, M, N, O... donc N vient juste après M.",
      },
      {
        difficulty: "difficile",
        question: "Which of these letters is NOT a vowel?",
        options: ["A", "E", "T", "O"],
        answer: 2,
        explanation: "Les voyelles en anglais sont A, E, I, O, U. La lettre T est une consonne.",
      },
    ],
    quiz: [
      { question: "What is the first letter of the alphabet?", options: ["A", "B", "Z", "M"], answer: 0 },
      { question: "What is the last letter of the alphabet?", options: ["Y", "Z", "X", "W"], answer: 1 },
      { question: "How do you pronounce the letter 'H' in English?", options: ["ash", "eïtch", "aitche", "atch"], answer: 1 },
      { question: "Which letter comes before 'D'?", options: ["A", "B", "C", "E"], answer: 2 },
      { question: "Which of these is a vowel?", options: ["B", "I", "S", "R"], answer: 1 },
    ],
    videoLinks: [
      {
        title: "Alphabet Song | ABC Song | Phonics Song",
        url: "https://www.youtube.com/watch?v=36IBDpTRVNE",
        channel: "Have Fun Teaching",
      },
    ],
  },

  l2: {
    summary:
      "Apprentissage des salutations de base en anglais : comment dire bonjour et au revoir dans différentes situations, formelles et informelles.",
    keyPoints: [
      "'Hello' et 'Hi' signifient tous les deux 'Bonjour' ('Hi' est plus familier)",
      "'Good morning' (le matin), 'Good afternoon' (l'après-midi), 'Good evening' (le soir)",
      "'Goodbye' ou 'Bye' signifient 'Au revoir'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'Bonjour' in English?",
        options: ["Goodbye", "Hello", "Sorry", "Please"],
        answer: 1,
        explanation: "'Hello' est la traduction de 'Bonjour' en anglais.",
      },
      {
        difficulty: "moyen",
        question: "What do you say to someone in the morning?",
        options: ["Good evening", "Good night", "Good morning", "Goodbye"],
        answer: 2,
        explanation: "'Good morning' est utilisé pour saluer quelqu'un le matin.",
      },
      {
        difficulty: "difficile",
        question: "Which greeting is the most informal (used with friends)?",
        options: ["Good afternoon", "Hello", "Hi", "Good evening"],
        answer: 2,
        explanation: "'Hi' est la salutation la plus familière, utilisée surtout entre amis.",
      },
    ],
    quiz: [
      { question: "How do you say 'Au revoir' in English?", options: ["Hello", "Hi", "Goodbye", "Please"], answer: 2 },
      { question: "What do you say in the evening?", options: ["Good morning", "Good evening", "Good afternoon", "Hi"], answer: 1 },
      { question: "Which word means 'Bonjour' in a casual way?", options: ["Hi", "Goodbye", "Sorry", "Bye"], answer: 0 },
      { question: "What do you say in the afternoon?", options: ["Good morning", "Good night", "Good afternoon", "Goodbye"], answer: 2 },
      { question: "Which of these is a way to say goodbye?", options: ["Hello", "Bye", "Hi", "Good morning"], answer: 1 },
    ],
    videoLinks: [
      {
        title: "Hi. Hello. Good bye. (Greeting song)",
        url: "https://www.youtube.com/watch?v=svS0UikccrY",
        channel: "English Singsing",
      },
    ],
  },

  l3: {
    summary:
      "Apprentissage des nombres de 1 à 10 en anglais, avec leur prononciation et leur orthographe, pour pouvoir compter et répondre à des questions simples sur les quantités.",
    keyPoints: [
      "1 = one, 2 = two, 3 = three, 4 = four, 5 = five",
      "6 = six, 7 = seven, 8 = eight, 9 = nine, 10 = ten",
      "On utilise ces nombres pour compter des objets ou répondre à 'How many?'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say '5' in English?",
        options: ["four", "five", "six", "seven"],
        answer: 1,
        explanation: "'Five' est la traduction anglaise du nombre 5.",
      },
      {
        difficulty: "moyen",
        question: "Which number is 'eight'?",
        options: ["6", "7", "8", "9"],
        answer: 2,
        explanation: "'Eight' correspond au nombre 8.",
      },
      {
        difficulty: "difficile",
        question: "What is 'three' + 'four' in English numbers?",
        options: ["six", "seven", "eight", "nine"],
        answer: 1,
        explanation: "3 + 4 = 7, qui se dit 'seven' en anglais.",
      },
    ],
    quiz: [
      { question: "How do you say '1' in English?", options: ["one", "two", "ten", "six"], answer: 0 },
      { question: "How do you say '10' in English?", options: ["nine", "ten", "eight", "seven"], answer: 1 },
      { question: "Which number is 'six'?", options: ["5", "6", "7", "8"], answer: 1 },
      { question: "Which number is 'two'?", options: ["1", "2", "3", "4"], answer: 1 },
      { question: "What comes after 'nine'?", options: ["eight", "ten", "seven", "eleven"], answer: 1 },
    ],
    videoLinks: [
      {
        title: "Top 10 Counting Songs | Learn To Count",
        url: "https://www.youtube.com/watch?v=7D4K9oi7oBM",
        channel: "Super Simple Songs",
      },
    ],
  },

  l4: {
    summary:
      "Découverte du vocabulaire des couleurs en anglais, pour pouvoir décrire des objets et répondre à la question 'What color is it?'.",
    keyPoints: [
      "Couleurs de base : red (rouge), blue (bleu), yellow (jaune), green (vert)",
      "Autres couleurs : black (noir), white (blanc), orange (orange), pink (rose)",
      "Structure : 'It is + couleur' (Ex: It is red = C'est rouge)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What color is the sky?",
        options: ["red", "blue", "green", "black"],
        answer: 1,
        explanation: "Le ciel est généralement 'blue' (bleu).",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'jaune' in English?",
        options: ["yellow", "green", "orange", "white"],
        answer: 0,
        explanation: "'Yellow' est la traduction anglaise de 'jaune'.",
      },
      {
        difficulty: "difficile",
        question: "If you mix 'blue' and 'yellow', what color do you get?",
        options: ["red", "green", "pink", "black"],
        answer: 1,
        explanation: "Le mélange du bleu et du jaune donne du vert ('green').",
      },
    ],
    quiz: [
      { question: "What color is grass?", options: ["red", "green", "blue", "orange"], answer: 1 },
      { question: "How do you say 'rouge' in English?", options: ["red", "pink", "orange", "yellow"], answer: 0 },
      { question: "What color is a banana?", options: ["blue", "yellow", "black", "green"], answer: 1 },
      { question: "How do you say 'noir' in English?", options: ["white", "black", "brown", "grey"], answer: 1 },
      { question: "What color do you get by mixing red and white?", options: ["pink", "green", "purple", "orange"], answer: 0 },
    ],
    videoLinks: [
      {
        title: "What Color Is it? Song | Learn 11 Colors",
        url: "https://www.youtube.com/watch?v=YyFLBTTAbSE",
        channel: "LearnEnglish Kids (British Council)",
      },
    ],
  },

  l5: {
    summary:
      "Découverte du verbe 'to be' (être) au présent, un des verbes les plus importants en anglais. Il change de forme selon la personne : I am, you are, he/she/it is.",
    keyPoints: [
      "I am (je suis), you are (tu es), he/she/it is (il/elle est)",
      "We are (nous sommes), you are (vous êtes), they are (ils/elles sont)",
      "Formes courtes : I'm, you're, he's, she's, we're, they're",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: I ___ happy.",
        options: ["am", "is", "are", "be"],
        answer: 0,
        explanation: "Avec 'I', on utilise toujours 'am' : I am happy.",
      },
      {
        difficulty: "moyen",
        question: "Complete: She ___ my sister.",
        options: ["am", "is", "are", "be"],
        answer: 1,
        explanation: "Avec 'he/she/it', on utilise 'is' : She is my sister.",
      },
      {
        difficulty: "difficile",
        question: "Which sentence is correct?",
        options: ["They is happy", "We am students", "You are my friend", "He are tall"],
        answer: 2,
        explanation: "'You are my friend' est correct : avec 'you', on utilise toujours 'are'.",
      },
    ],
    quiz: [
      { question: "Complete: You ___ my friend.", options: ["am", "is", "are", "be"], answer: 2 },
      { question: "Complete: We ___ students.", options: ["am", "is", "are", "be"], answer: 2 },
      { question: "Complete: He ___ my brother.", options: ["am", "is", "are", "be"], answer: 1 },
      { question: "Complete: They ___ happy.", options: ["am", "is", "are", "be"], answer: 2 },
      { question: "What is the short form of 'I am'?", options: ["I's", "I'm", "I'am", "Im"], answer: 1 },
    ],
    videoLinks: [
      {
        title: '"I Am, You Are, He/She Is" Song – Present Simple "To Be" Lesson',
        url: "https://www.youtube.com/watch?v=PZCcRzgrr8Y",
        channel: "Rockin English",
      },
    ],
  },

  l6: {
    summary:
      "Apprentissage du vocabulaire de la famille en anglais : les membres principaux comme la mère, le père, le frère et la sœur, pour pouvoir présenter sa famille.",
    keyPoints: [
      "Mother (mère), father (père), parents (parents)",
      "Brother (frère), sister (sœur)",
      "Structure : 'This is my + membre de la famille' (Ex: This is my mother)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'mère' in English?",
        options: ["father", "mother", "sister", "brother"],
        answer: 1,
        explanation: "'Mother' est la traduction anglaise de 'mère'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'frère' in English?",
        options: ["sister", "mother", "brother", "father"],
        answer: 2,
        explanation: "'Brother' est la traduction anglaise de 'frère'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'This is my father. He ___ a teacher.'",
        options: ["am", "is", "are", "be"],
        answer: 1,
        explanation: "'He' (il) utilise 'is' : He is a teacher.",
      },
    ],
    quiz: [
      { question: "How do you say 'père' in English?", options: ["mother", "father", "sister", "brother"], answer: 1 },
      { question: "How do you say 'sœur' in English?", options: ["brother", "mother", "father", "sister"], answer: 3 },
      { question: "What does 'parents' mean?", options: ["parents", "enfants", "frères", "amis"], answer: 0 },
      { question: "Complete: 'This is my ___.' (mother)", options: ["mother", "father", "brother", "sister"], answer: 0 },
      { question: "Which word means 'frère' or 'sœur' together?", options: ["parents", "siblings", "family", "cousins"], answer: 1 },
    ],
    videoLinks: [
      {
        title: "Family Song For Children | 7 Family Member Names",
        url: "https://www.youtube.com/watch?v=FXqPs1IvtNs",
        channel: "LearnEnglish Kids (British Council)",
      },
    ],
  },

  l7: {
    summary:
      "Découverte du vocabulaire des objets de la classe en anglais, pour pouvoir nommer ce qu'on utilise à l'école et répondre à des questions simples sur les objets.",
    keyPoints: [
      "Pen (stylo), pencil (crayon), book (livre), notebook (cahier)",
      "Table (table), chair (chaise), bag (sac)",
      "Structure : 'This is a + objet' (Ex: This is a pen)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'stylo' in English?",
        options: ["pencil", "pen", "book", "bag"],
        answer: 1,
        explanation: "'Pen' est la traduction anglaise de 'stylo'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'livre' in English?",
        options: ["notebook", "book", "table", "chair"],
        answer: 1,
        explanation: "'Book' est la traduction anglaise de 'livre'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'This ___ my book.'",
        options: ["am", "is", "are", "be"],
        answer: 1,
        explanation: "'This' (ceci) utilise 'is' : This is my book.",
      },
    ],
    quiz: [
      { question: "How do you say 'chaise' in English?", options: ["table", "chair", "bag", "pen"], answer: 1 },
      { question: "How do you say 'cahier' in English?", options: ["book", "notebook", "pencil", "bag"], answer: 1 },
      { question: "How do you say 'sac' in English?", options: ["bag", "book", "table", "pen"], answer: 0 },
      { question: "How do you say 'crayon' in English?", options: ["pen", "pencil", "book", "chair"], answer: 1 },
      { question: "How do you say 'table' in English?", options: ["chair", "table", "bag", "book"], answer: 1 },
    ],
    videoLinks: [
      {
        title: "What is In Your Bag? Song with Matt | School Classroom Items",
        url: "https://www.youtube.com/watch?v=aVSnDZHNEQc",
        channel: "LearnEnglish Kids (British Council)",
      },
    ],
  },

  l8: {
    summary:
      "Apprentissage des jours de la semaine en anglais, dans l'ordre, pour pouvoir parler de son emploi du temps et répondre à la question 'What day is it today?'.",
    keyPoints: [
      "Monday (lundi), Tuesday (mardi), Wednesday (mercredi), Thursday (jeudi)",
      "Friday (vendredi), Saturday (samedi), Sunday (dimanche)",
      "En anglais, les jours de la semaine s'écrivent toujours avec une majuscule",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'lundi' in English?",
        options: ["Sunday", "Monday", "Tuesday", "Friday"],
        answer: 1,
        explanation: "'Monday' est la traduction anglaise de 'lundi'.",
      },
      {
        difficulty: "moyen",
        question: "Which day comes after 'Wednesday'?",
        options: ["Tuesday", "Thursday", "Friday", "Monday"],
        answer: 1,
        explanation: "L'ordre est ...Tuesday, Wednesday, Thursday... donc Thursday vient après Wednesday.",
      },
      {
        difficulty: "difficile",
        question: "Which day is the first day of the school week in Tunisia?",
        options: ["Sunday", "Saturday", "Monday", "Friday"],
        answer: 2,
        explanation: "En Tunisie, la semaine scolaire commence généralement le lundi ('Monday').",
      },
    ],
    quiz: [
      { question: "How do you say 'dimanche' in English?", options: ["Saturday", "Sunday", "Monday", "Friday"], answer: 1 },
      { question: "How do you say 'vendredi' in English?", options: ["Thursday", "Saturday", "Friday", "Sunday"], answer: 2 },
      { question: "Which day comes before 'Friday'?", options: ["Thursday", "Saturday", "Sunday", "Monday"], answer: 0 },
      { question: "How do you say 'samedi' in English?", options: ["Sunday", "Saturday", "Friday", "Monday"], answer: 1 },
      { question: "How many days are there in a week?", options: ["5", "6", "7", "8"], answer: 2 },
    ],
    videoLinks: [
      {
        title: "Days of The Week Song For Kids",
        url: "https://www.youtube.com/watch?v=36n93jvjkDs",
        channel: "Dream English",
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