// scripts/seedPrim5AnglaisContentT3.js
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

// Trimestre 3 — lessons l17 through l24
const LESSON_CONTENT = {
  l17: {
    summary:
      "Approfondissement du vocabulaire de la météo et des saisons, avec des phrases complètes pour décrire le temps qu'il fait et le relier à la saison correspondante.",
    keyPoints: [
      "Weather : sunny, rainy, cloudy, windy, hot, cold, snowy",
      "Seasons : spring (printemps), summer (été), autumn/fall (automne), winter (hiver)",
      "Structure : 'It is + météo + in + saison' (Ex: It is hot in summer)",
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
        question: "Which season is usually hot?",
        options: ["Winter", "Summer", "Autumn", "None of them"],
        answer: 1,
        explanation: "L'été ('summer') est généralement la saison chaude.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'It is often ___ in winter in Tunisia.'",
        options: ["hot", "cold and rainy", "sunny only", "never cloudy"],
        answer: 1,
        explanation: "En Tunisie, l'hiver est généralement froid et pluvieux.",
      },
    ],
    quiz: [
      { question: "How do you say 'automne' in English?", options: ["spring", "summer", "autumn", "winter"], answer: 2 },
      { question: "How do you say 'printemps' in English?", options: ["spring", "summer", "autumn", "winter"], answer: 0 },
      { question: "How do you say 'nuageux' in English?", options: ["sunny", "rainy", "cloudy", "hot"], answer: 2 },
      { question: "How do you say 'venteux' in English?", options: ["windy", "sunny", "rainy", "cold"], answer: 0 },
      { question: "Which season comes after summer?", options: ["Spring", "Winter", "Autumn", "Summer again"], answer: 2 },
    ],
  },

  l18: {
    summary:
      "Découverte du vocabulaire des vêtements et de la structure 'to wear' (porter), pour pouvoir décrire ce que les gens portent selon la saison ou l'occasion.",
    keyPoints: [
      "Vêtements : shirt (chemise), trousers (pantalon), dress (robe), coat (manteau), shoes (chaussures)",
      "'To wear' = porter (un vêtement) : She is wearing a red dress.",
      "On adapte les vêtements à la météo : In winter, we wear a coat.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'chemise' in English?",
        options: ["dress", "shirt", "coat", "trousers"],
        answer: 1,
        explanation: "'Shirt' est la traduction anglaise de 'chemise'.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'She ___ (wear) a blue dress today.'",
        options: ["wear", "wears", "is wearing", "weared"],
        answer: 2,
        explanation: "Pour décrire ce que quelqu'un porte maintenant, on utilise le présent continu : is wearing.",
      },
      {
        difficulty: "difficile",
        question: "What do we usually wear in winter?",
        options: ["A coat", "Only a t-shirt", "Sandals", "Shorts"],
        answer: 0,
        explanation: "En hiver, on porte généralement un manteau ('coat') pour se protéger du froid.",
      },
    ],
    quiz: [
      { question: "How do you say 'pantalon' in English?", options: ["shirt", "trousers", "dress", "coat"], answer: 1 },
      { question: "How do you say 'manteau' in English?", options: ["shirt", "trousers", "coat", "shoes"], answer: 2 },
      { question: "How do you say 'chaussures' in English?", options: ["shirt", "shoes", "coat", "dress"], answer: 1 },
      { question: "How do you say 'porter' (un vêtement) in English?", options: ["to have", "to wear", "to take", "to make"], answer: 1 },
      { question: "How do you say 'robe' in English?", options: ["shirt", "trousers", "dress", "coat"], answer: 2 },
    ],
  },

  l19: {
    summary:
      "Découverte du comparatif en anglais, utilisé pour comparer deux choses ou personnes. Pour les adjectifs courts, on ajoute -er, et pour les adjectifs plus longs, on utilise 'more' devant l'adjectif.",
    keyPoints: [
      "Adjectifs courts : adjectif + er (big → bigger, small → smaller, fast → faster)",
      "Adjectifs longs : more + adjectif (beautiful → more beautiful)",
      "Structure : 'A is + comparatif + than B' (Ex: An elephant is bigger than a mouse)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the comparative of 'big'?",
        options: ["big", "bigger", "more big", "biggest"],
        answer: 1,
        explanation: "Pour un adjectif court comme 'big', on ajoute -er : bigger.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'An elephant is ___ than a mouse.' (big)",
        options: ["big", "bigger", "more big", "biggest"],
        answer: 1,
        explanation: "'Bigger than' est la forme comparative correcte : An elephant is bigger than a mouse.",
      },
      {
        difficulty: "difficile",
        question: "What is the comparative of 'beautiful'?",
        options: ["beautifuler", "more beautiful", "beautifulest", "most beautiful"],
        answer: 1,
        explanation: "Les adjectifs longs comme 'beautiful' utilisent 'more' devant l'adjectif : more beautiful.",
      },
    ],
    quiz: [
      { question: "What is the comparative of 'small'?", options: ["small", "smaller", "more small", "smallest"], answer: 1 },
      { question: "What is the comparative of 'fast'?", options: ["fast", "faster", "more fast", "fastest"], answer: 1 },
      { question: "Complete: 'A car is ___ than a bicycle.' (fast)", options: ["fast", "faster", "more fast", "fastest"], answer: 1 },
      { question: "What is the comparative of 'interesting'?", options: ["interestinger", "more interesting", "interestingest", "most interesting"], answer: 1 },
      { question: "Which word means 'than' is used with comparatives?", options: ["and", "than", "or", "but"], answer: 1 },
    ],
  },

  l20: {
    summary:
      "Découverte de la structure 'going to' pour exprimer une intention ou un projet futur déjà décidé. Formation : sujet + to be + going to + verbe à l'infinitif.",
    keyPoints: [
      "Formation : sujet + am/is/are + going to + verbe",
      "Exemple : I am going to visit my grandmother tomorrow.",
      "'Going to' exprime une intention ou un plan déjà décidé, pas une action spontanée",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ going to visit my aunt tomorrow.'",
        options: ["am", "is", "are", "be"],
        answer: 0,
        explanation: "Avec 'I', on utilise 'am' : I am going to visit my aunt.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'She ___ going to play football this afternoon.'",
        options: ["am", "is", "are", "be"],
        answer: 1,
        explanation: "Avec 'she', on utilise 'is' : She is going to play football.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'They ___ going to travel to Tunis next week.'",
        options: ["am", "is", "are", "be"],
        answer: 2,
        explanation: "Avec 'they', on utilise 'are' : They are going to travel to Tunis.",
      },
    ],
    quiz: [
      { question: "Complete: 'We ___ going to cook dinner tonight.'", options: ["am", "is", "are", "be"], answer: 2 },
      { question: "Complete: 'He ___ going to study tonight.'", options: ["am", "is", "are", "be"], answer: 1 },
      { question: "What does 'going to' express?", options: ["une habitude", "une intention future", "le passé", "une question"], answer: 1 },
      { question: "Complete: 'You ___ going to like this film.'", options: ["am", "is", "are", "be"], answer: 2 },
      { question: "Complete: 'I am going to ___ (visit) my friend.'", options: ["visit", "visits", "visiting", "visited"], answer: 0 },
    ],
  },

  l21: {
    summary:
      "Découverte du vocabulaire des loisirs et des activités de temps libre, avec la structure 'I like/love + verbe-ing' pour exprimer ses préférences en matière de loisirs.",
    keyPoints: [
      "Loisirs : reading (lire), swimming (nager), playing football (jouer au foot), drawing (dessiner)",
      "'I like/love + verbe-ing' (Ex: I love swimming = J'adore nager)",
      "Après 'like/love/enjoy', le verbe prend la forme en -ing",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'nager' as a hobby in English?",
        options: ["swim", "swimming", "swims", "swam"],
        answer: 1,
        explanation: "Après 'like/love', on utilise la forme -ing : swimming.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'I love ___ (read) books.'",
        options: ["read", "reads", "reading", "readed"],
        answer: 2,
        explanation: "Après 'love', le verbe prend -ing : reading.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My brother enjoys ___ (draw) animals.'",
        options: ["draw", "draws", "drawing", "drew"],
        answer: 2,
        explanation: "Après 'enjoys', le verbe prend -ing : drawing.",
      },
    ],
    quiz: [
      { question: "How do you say 'dessiner' as a hobby in English?", options: ["draw", "drawing", "draws", "drew"], answer: 1 },
      { question: "Complete: 'She likes ___ (play) the piano.'", options: ["play", "plays", "playing", "played"], answer: 2 },
      { question: "How do you say 'lire' as a hobby in English?", options: ["read", "reading", "reads", "readed"], answer: 1 },
      { question: "Complete: 'We enjoy ___ (dance) together.'", options: ["dance", "dances", "dancing", "danced"], answer: 2 },
      { question: "What form of the verb follows 'like/love/enjoy'?", options: ["infinitive", "-ing form", "past tense", "-s form"], answer: 1 },
    ],
  },

  l22: {
    summary:
      "Découverte des expressions pour demander et donner des directions simples : 'Where is...?' pour demander un lieu, et des instructions comme 'turn left/right' et 'go straight' pour indiquer le chemin.",
    keyPoints: [
      "'Where is the + lieu?' = Où se trouve... ? (Ex: Where is the market?)",
      "'Turn left' (tourner à gauche), 'turn right' (tourner à droite), 'go straight' (aller tout droit)",
      "'It is next to/near the + lieu' pour situer un endroit",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you ask where the market is in English?",
        options: ["Where is the market?", "What is the market?", "How is the market?", "When is the market?"],
        answer: 0,
        explanation: "'Where is the market?' est la question pour demander l'emplacement du marché.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'tourner à gauche' in English?",
        options: ["turn right", "turn left", "go straight", "stop here"],
        answer: 1,
        explanation: "'Turn left' signifie 'tourner à gauche'.",
      },
      {
        difficulty: "difficile",
        question: "Complete the directions: 'Go straight, then ___ at the bank.'",
        options: ["turn right", "sleep", "eat", "sing"],
        answer: 0,
        explanation: "'Turn right' complète logiquement une série d'instructions de direction.",
      },
    ],
    quiz: [
      { question: "How do you say 'tourner à droite' in English?", options: ["turn left", "turn right", "go straight", "stop"], answer: 1 },
      { question: "How do you say 'aller tout droit' in English?", options: ["turn left", "turn right", "go straight", "stop here"], answer: 2 },
      { question: "How do you say 'près de' in English?", options: ["far from", "near", "under", "behind"], answer: 1 },
      { question: "How do you ask where the school is?", options: ["Where is the school?", "What is the school?", "How is the school?", "When is the school?"], answer: 0 },
      { question: "How do you say 'à côté de' when giving directions?", options: ["next to", "far from", "under", "over"], answer: 0 },
    ],
  },

  l23: {
    summary:
      "Découverte du vocabulaire des émotions et des sentiments, avec la structure 'I feel/I am + émotion', pour pouvoir exprimer ce que l'on ressent.",
    keyPoints: [
      "Émotions : happy (content), sad (triste), angry (en colère), scared (effrayé), excited (excité/e)",
      "Structure : 'I feel + émotion' ou 'I am + émotion' (Ex: I feel happy / I am happy)",
      "'Why are you sad?' pour demander la raison d'une émotion",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'en colère' in English?",
        options: ["happy", "sad", "angry", "scared"],
        answer: 2,
        explanation: "'Angry' est la traduction anglaise de 'en colère'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'effrayé' in English?",
        options: ["excited", "scared", "happy", "angry"],
        answer: 1,
        explanation: "'Scared' est la traduction anglaise de 'effrayé'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I ___ excited about my birthday party.'",
        options: ["feel", "feels", "am", "are"],
        answer: 2,
        explanation: "Avec 'I', on utilise 'am' pour exprimer une émotion : I am excited.",
      },
    ],
    quiz: [
      { question: "How do you say 'content' in English?", options: ["happy", "sad", "angry", "scared"], answer: 0 },
      { question: "How do you say 'triste' in English?", options: ["happy", "sad", "excited", "angry"], answer: 1 },
      { question: "How do you ask why someone is sad?", options: ["Why are you sad?", "What is sad?", "How sad?", "Where sad?"], answer: 0 },
      { question: "How do you say 'excité/e' in English?", options: ["scared", "angry", "excited", "sad"], answer: 2 },
      { question: "Complete: 'She ___ happy today.'", options: ["am", "is", "are", "be"], answer: 1 },
    ],
  },

  l24: {
    summary:
      "Révision générale de l'année : mise en pratique des structures apprises (présent simple, présent continu, comparatifs, 'going to', vocabulaire varié) à travers de courts dialogues combinant plusieurs notions.",
    keyPoints: [
      "Révision des temps : présent simple (habitudes), présent continu (action en cours), going to (intentions futures)",
      "Révision du vocabulaire : famille, maison, nourriture, vêtements, météo, émotions",
      "Capacité à combiner plusieurs structures dans un dialogue simple",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete this dialogue: 'What are you doing?' — 'I ___ (read) a book.'",
        options: ["read", "am reading", "reads", "reading"],
        answer: 1,
        explanation: "Pour répondre à 'What are you doing?', on utilise le présent continu : I am reading.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'It is cold today, so I ___ (wear) a coat.'",
        options: ["wear", "wears", "am wearing", "wore"],
        answer: 2,
        explanation: "Pour décrire ce qu'on porte maintenant, on utilise le présent continu : I am wearing a coat.",
      },
      {
        difficulty: "difficile",
        question: "Combine correctly: 'My sister is ___ than me, but I am ___ than my little brother.' (tall)",
        options: ["tall / tall", "taller / taller", "more tall / more tall", "tallest / tallest"],
        answer: 1,
        explanation: "'Tall' est un adjectif court, donc son comparatif est 'taller' dans les deux cas.",
      },
    ],
    quiz: [
      { question: "Complete: 'Tomorrow, I ___ going to visit my grandmother.'", options: ["am", "is", "are", "be"], answer: 0 },
      { question: "Complete: 'She usually ___ (wake up) at 7.' (habitude)", options: ["wake up", "wakes up", "is waking up", "woke up"], answer: 1 },
      { question: "What is the comparative of 'small'?", options: ["small", "smaller", "more small", "smallest"], answer: 1 },
      { question: "Complete: 'Right now, they ___ (play) in the garden.'", options: ["play", "plays", "are playing", "played"], answer: 2 },
      { question: "How do you ask where a place is?", options: ["Where is...?", "What is...?", "How is...?", "When is...?"], answer: 0 },
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