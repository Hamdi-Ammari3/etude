// scripts/seedPrim5AnglaisContentT1.js
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

// Trimestre 1 — lessons l1 through l8
const LESSON_CONTENT = {
  l1: {
    summary:
      "Découverte du vocabulaire de la famille élargie en anglais et de la structure 'This is my...' pour présenter les membres de sa famille. On apprend aussi à poser des questions simples sur la famille avec 'Who is this?'.",
    keyPoints: [
      "Vocabulaire : grandmother (grand-mère), grandfather (grand-père), aunt (tante), uncle (oncle), cousin (cousin/cousine)",
      "Structure : 'This is my + membre de la famille' (Ex: This is my grandmother)",
      "Question : 'Who is this?' = Qui est-ce ? → réponse : 'This is my...'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'grand-mère' in English?",
        options: ["grandfather", "grandmother", "aunt", "uncle"],
        answer: 1,
        explanation: "'Grandmother' est la traduction anglaise de 'grand-mère'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'oncle' in English?",
        options: ["aunt", "uncle", "cousin", "grandfather"],
        answer: 1,
        explanation: "'Uncle' est la traduction anglaise de 'oncle'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Who is this?' — '___ is my grandfather.'",
        options: ["This", "These", "He", "It"],
        answer: 0,
        explanation: "Pour répondre à 'Who is this?', on utilise 'This is my...' pour présenter une personne.",
      },
    ],
    quiz: [
      { question: "How do you say 'tante' in English?", options: ["uncle", "aunt", "cousin", "grandmother"], answer: 1 },
      { question: "How do you ask who someone is?", options: ["What is this?", "Who is this?", "Where is this?", "How is this?"], answer: 1 },
      { question: "How do you say 'cousin' in English?", options: ["cousin", "nephew", "niece", "brother"], answer: 0 },
      { question: "Complete: 'This is my ___.' (grand-père)", options: ["grandmother", "grandfather", "aunt", "uncle"], answer: 1 },
      { question: "How do you say 'grand-père' in English?", options: ["grandmother", "grandfather", "father", "uncle"], answer: 1 },
    ],
  },

  l2: {
    summary:
      "Découverte du vocabulaire lié aux voisins et à la description simple des gens qui vivent autour de nous, avec la structure 'He/She lives next to me' pour parler de sa localisation.",
    keyPoints: [
      "'Neighbour' = voisin/voisine",
      "'He/She lives next to me' = Il/Elle habite à côté de chez moi",
      "'He/She lives in front of my house' = Il/Elle habite en face de ma maison",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'voisin' in English?",
        options: ["friend", "neighbour", "family", "teacher"],
        answer: 1,
        explanation: "'Neighbour' est la traduction anglaise de 'voisin'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'Il habite à côté de chez moi' in English?",
        options: ["He lives next to me", "He lives far from me", "He is my brother", "He is my teacher"],
        answer: 0,
        explanation: "'He lives next to me' signifie 'Il habite à côté de chez moi'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My neighbour ___ (live) in front of my house.'",
        options: ["live", "lives", "living", "lived"],
        answer: 1,
        explanation: "Avec 'my neighbour' (il/elle), le verbe 'live' prend un -s au présent simple : lives.",
      },
    ],
    quiz: [
      { question: "How do you say 'à côté de' in English?", options: ["far from", "next to", "behind", "under"], answer: 1 },
      { question: "How do you say 'en face de' in English?", options: ["next to", "behind", "in front of", "under"], answer: 2 },
      { question: "Complete: 'She ___ (live) next to my house.'", options: ["live", "lives", "living", "lived"], answer: 1 },
      { question: "What does 'neighbour' mean?", options: ["ami", "voisin", "professeur", "cousin"], answer: 1 },
      { question: "How do you say 'Elle habite en face de chez moi' in English?", options: ["She lives in front of my house", "She lives next to me", "She is my sister", "She lives far away"], answer: 0 },
    ],
  },

  l3: {
    summary:
      "Découverte du vocabulaire pour décrire son enseignant/enseignante, avec des adjectifs simples et le verbe 'to teach' (enseigner), pour pouvoir parler de son professeur et de sa classe.",
    keyPoints: [
      "'Teacher' = professeur/enseignant(e)",
      "'He/She teaches + matière' (Ex: She teaches English = Elle enseigne l'anglais)",
      "Adjectifs pour décrire : kind (gentil/gentille), funny (drôle), strict (strict/e)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'professeur' in English?",
        options: ["student", "teacher", "friend", "neighbour"],
        answer: 1,
        explanation: "'Teacher' est la traduction anglaise de 'professeur'.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'My teacher ___ (teach) English.'",
        options: ["teach", "teaches", "teaching", "taught"],
        answer: 1,
        explanation: "Avec 'my teacher' (il/elle), le verbe 'teach' prend -es au présent simple : teaches.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My teacher is very ___.' (gentil)",
        options: ["strict", "funny", "kind", "tall"],
        answer: 2,
        explanation: "'Kind' signifie 'gentil/gentille' en anglais.",
      },
    ],
    quiz: [
      { question: "How do you say 'drôle' in English?", options: ["strict", "funny", "kind", "tall"], answer: 1 },
      { question: "How do you say 'strict' in English?", options: ["kind", "funny", "strict", "short"], answer: 2 },
      { question: "Complete: 'He ___ (teach) Maths.'", options: ["teach", "teaches", "teaching", "taught"], answer: 1 },
      { question: "What does 'teacher' mean?", options: ["élève", "professeur", "voisin", "ami"], answer: 1 },
      { question: "Complete: 'My teacher is very ___.' (drôle)", options: ["strict", "funny", "tall", "short"], answer: 1 },
    ],
  },

  l4: {
    summary:
      "Révision des nombres de 1 à 20 et du verbe 'to be' au présent, deux notions essentielles apprises en 4ème année, pour bien les consolider avant d'aborder des structures plus complexes.",
    keyPoints: [
      "Nombres 1-20 : one, two, three... eleven, twelve... nineteen, twenty",
      "'To be' : I am, you are, he/she/it is, we are, you are, they are",
      "Ces bases sont essentielles pour construire des phrases plus longues cette année",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say '15' in English?",
        options: ["fifteen", "fifty", "fourteen", "sixteen"],
        answer: 0,
        explanation: "'Fifteen' est la traduction anglaise de 15.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'They ___ my friends.'",
        options: ["am", "is", "are", "be"],
        answer: 2,
        explanation: "Avec 'they', on utilise toujours 'are' : They are my friends.",
      },
      {
        difficulty: "difficile",
        question: "What is 'twelve' + 'eight' in English numbers?",
        options: ["eighteen", "twenty", "nineteen", "twelve"],
        answer: 1,
        explanation: "12 + 8 = 20, qui se dit 'twenty' en anglais.",
      },
    ],
    quiz: [
      { question: "How do you say '20' in English?", options: ["twelve", "twenty", "two", "ten"], answer: 1 },
      { question: "Complete: 'We ___ students.'", options: ["am", "is", "are", "be"], answer: 2 },
      { question: "How do you say '18' in English?", options: ["eight", "eighteen", "eighty", "eleven"], answer: 1 },
      { question: "Complete: 'She ___ my sister.'", options: ["am", "is", "are", "be"], answer: 1 },
      { question: "How do you say '11' in English?", options: ["ten", "eleven", "twelve", "one"], answer: 1 },
    ],
  },

  l5: {
    summary:
      "Découverte d'adjectifs pour décrire l'apparence physique des personnes : tall/short (grand/petit), young/old (jeune/âgé), pour pouvoir décrire les gens autour de soi.",
    keyPoints: [
      "Tall (grand) / short (petit)",
      "Young (jeune) / old (âgé, vieux)",
      "Structure : 'He/She is + adjectif' (Ex: He is tall = Il est grand)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'grand' (pour une personne) in English?",
        options: ["short", "tall", "young", "old"],
        answer: 1,
        explanation: "'Tall' est la traduction anglaise de 'grand' pour décrire la taille d'une personne.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'jeune' in English?",
        options: ["old", "young", "short", "tall"],
        answer: 1,
        explanation: "'Young' est la traduction anglaise de 'jeune'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My grandfather is ___, but my little brother is ___.'",
        options: ["young / old", "old / young", "tall / short", "short / tall"],
        answer: 1,
        explanation: "Le grand-père est âgé ('old') et le petit frère est jeune ('young').",
      },
    ],
    quiz: [
      { question: "How do you say 'petit' (pour une personne) in English?", options: ["tall", "short", "young", "old"], answer: 1 },
      { question: "How do you say 'âgé/vieux' in English?", options: ["young", "old", "tall", "short"], answer: 1 },
      { question: "What is the opposite of 'tall'?", options: ["young", "old", "short", "big"], answer: 2 },
      { question: "What is the opposite of 'young'?", options: ["tall", "short", "old", "small"], answer: 2 },
      { question: "Complete: 'She is very ___.' (grande)", options: ["short", "tall", "old", "young"], answer: 1 },
    ],
  },

  l6: {
    summary:
      "Apprentissage du pluriel des noms en anglais. La règle générale est l'ajout d'un -s, mais certains mots ont des pluriels irréguliers simples à connaître (child → children, man → men, woman → women).",
    keyPoints: [
      "Règle générale : nom + s (book → books, cat → cats)",
      "Noms se terminant en -ch, -sh, -s, -x : ajout de -es (box → boxes)",
      "Pluriels irréguliers courants : child → children, man → men, woman → women",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the plural of 'book'?",
        options: ["book", "books", "bookes", "bookies"],
        answer: 1,
        explanation: "On ajoute simplement -s : book → books.",
      },
      {
        difficulty: "moyen",
        question: "What is the plural of 'box'?",
        options: ["box", "boxs", "boxes", "boxies"],
        answer: 2,
        explanation: "Les noms en -x prennent -es au pluriel : box → boxes.",
      },
      {
        difficulty: "difficile",
        question: "What is the plural of 'child'?",
        options: ["childs", "childes", "children", "child"],
        answer: 2,
        explanation: "'Child' a un pluriel irrégulier : children (et non 'childs').",
      },
    ],
    quiz: [
      { question: "What is the plural of 'cat'?", options: ["cat", "cats", "cates", "catis"], answer: 1 },
      { question: "What is the plural of 'man'?", options: ["mans", "men", "mens", "man"], answer: 1 },
      { question: "What is the plural of 'woman'?", options: ["womans", "women", "womens", "woman"], answer: 1 },
      { question: "What is the plural of 'dish'?", options: ["dish", "dishs", "dishes", "dishies"], answer: 2 },
      { question: "What is the plural of 'pen'?", options: ["pen", "pens", "penes", "penies"], answer: 1 },
    ],
  },

  l7: {
    summary:
      "Découverte du génitif possessif 's, utilisé pour indiquer que quelque chose appartient à quelqu'un. Structure : nom du possesseur + 's + objet possédé (my brother's book = le livre de mon frère).",
    keyPoints: [
      "Structure : possesseur + 's + objet (Sami's pen = le stylo de Sami)",
      "Pour un pluriel se terminant déjà par -s, on ajoute juste l'apostrophe (the girls' books)",
      "Différent du français, où on dit 'le livre de mon frère' — en anglais l'ordre est inversé",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'le livre de Sami' in English?",
        options: ["The book of Sami", "Sami's book", "Sami book's", "The Sami book"],
        answer: 1,
        explanation: "En anglais, on utilise 'Sami's book' — le possesseur suivi de 's puis l'objet.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'le chat de ma sœur' in English?",
        options: ["My sister's cat", "The cat of my sister", "My sister cat's", "Cat's my sister"],
        answer: 0,
        explanation: "'My sister's cat' est la structure correcte pour le possessif en anglais.",
      },
      {
        difficulty: "difficile",
        question: "How do you say 'les jouets des enfants' (pluriel déjà en -s) in English?",
        options: ["The children's toys", "The childrens toys", "The toys of children's", "Children toys's"],
        answer: 0,
        explanation: "'Children' ne se termine pas par -s au pluriel, donc on ajoute normalement 's : the children's toys.",
      },
    ],
    quiz: [
      { question: "How do you say 'le vélo de mon frère' in English?", options: ["My brother's bike", "The bike of my brother", "My brother bike's", "Bike's my brother"], answer: 0 },
      { question: "How do you say 'la maison de ma tante' in English?", options: ["My aunt's house", "The house of my aunt", "My aunt house's", "House's my aunt"], answer: 0 },
      { question: "What does 's usually show in English?", options: ["le pluriel", "la possession", "le temps du verbe", "la négation"], answer: 1 },
      { question: "How do you say 'le stylo du professeur' in English?", options: ["The teacher's pen", "The pen of teacher", "Teacher pen's", "Pen's teacher"], answer: 0 },
      { question: "How do you say 'la voiture de mes parents' in English?", options: ["My parents' car", "My parents car's", "The car of parents", "Car's my parents"], answer: 0 },
    ],
  },

  l8: {
    summary:
      "Apprentissage de la structure pour demander et donner une date, en combinant les jours de la semaine, les mois, et les nombres ordinaux simples (first, second, third...).",
    keyPoints: [
      "'What is the date today?' = Quelle est la date aujourd'hui ?",
      "Réponse : 'It is + jour + le + mois' (Ex: It is Monday, the first of January)",
      "Nombres ordinaux courants : first (1er), second (2ème), third (3ème)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you ask for today's date in English?",
        options: ["What is the date today?", "What time is it?", "How old are you?", "Where are you?"],
        answer: 0,
        explanation: "'What is the date today?' est la question pour demander la date.",
      },
      {
        difficulty: "moyen",
        question: "How do you say '1er' (premier) in English?",
        options: ["one", "first", "once", "onest"],
        answer: 1,
        explanation: "'First' est le nombre ordinal pour '1er' en anglais.",
      },
      {
        difficulty: "difficile",
        question: "How do you say '3ème' (troisième) in English?",
        options: ["three", "threeth", "third", "thirst"],
        answer: 2,
        explanation: "'Third' est le nombre ordinal irrégulier pour '3ème' en anglais.",
      },
    ],
    quiz: [
      { question: "How do you say '2ème' (deuxième) in English?", options: ["two", "second", "twoth", "twond"], answer: 1 },
      { question: "How do you say 'lundi' in English?", options: ["Sunday", "Monday", "Tuesday", "Friday"], answer: 1 },
      { question: "How do you say 'janvier' in English?", options: ["June", "January", "July", "March"], answer: 1 },
      { question: "What does 'What is the date today?' mean?", options: ["Quelle heure est-il ?", "Quelle est la date aujourd'hui ?", "Quel âge as-tu ?", "Où habites-tu ?"], answer: 1 },
      { question: "How do you say 'décembre' in English?", options: ["November", "December", "October", "January"], answer: 1 },
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