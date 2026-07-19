// scripts/seedPrim6AnglaisContentT1.js
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

// Trimestre 1 — lessons l1 through l8
const LESSON_CONTENT = {
  l1: {
    summary:
      "Découverte du vocabulaire lié au divertissement et aux loisirs, avec la structure 'Let's + verbe' pour proposer une activité à faire ensemble.",
    keyPoints: [
      "'Let's + verbe' = proposer de faire quelque chose ensemble (Let's play = Jouons)",
      "Vocabulaire du divertissement : fun (amusement), game (jeu), party (fête)",
      "'Let's have fun' = Amusons-nous",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'Jouons !' in English?",
        options: ["Let's play!", "I play!", "You play!", "Playing!"],
        answer: 0,
        explanation: "'Let's play!' est la structure pour proposer de jouer ensemble.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'amusement' in English?",
        options: ["work", "fun", "sad", "boring"],
        answer: 1,
        explanation: "'Fun' est la traduction anglaise de 'amusement'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: '___ have a party this weekend!'",
        options: ["Let's", "I'm", "You're", "We has"],
        answer: 0,
        explanation: "'Let's' introduit une proposition d'activité collective : Let's have a party.",
      },
    ],
    quiz: [
      { question: "How do you say 'jeu' in English?", options: ["game", "work", "sad", "school"], answer: 0 },
      { question: "How do you say 'fête' in English?", options: ["party", "game", "fun", "work"], answer: 0 },
      { question: "Complete: '___ go to the park!'", options: ["Let's", "I'm", "You has", "It's"], answer: 0 },
      { question: "'Let's have fun' means:", options: ["Travaillons", "Amusons-nous", "Dormons", "Mangeons"], answer: 1 },
      { question: "How do you say 'amusant' (adjective) in English?", options: ["boring", "fun", "sad", "tired"], answer: 1 },
    ],
  },

  l2: {
    summary:
      "Découverte du vocabulaire des activités de temps libre, avec la structure 'I like/love/enjoy + verbe-ing' pour exprimer ses préférences en matière de loisirs.",
    keyPoints: [
      "Activités de temps libre : reading, swimming, painting, playing video games, dancing",
      "'I like/love/enjoy + verbe-ing' pour exprimer une préférence (I love painting)",
      "'What do you do in your free time?' = Que fais-tu pendant ton temps libre ?",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'peindre' as a hobby in English?",
        options: ["paint", "painting", "paints", "painted"],
        answer: 1,
        explanation: "Après 'like/love', on utilise la forme -ing : painting.",
      },
      {
        difficulty: "moyen",
        question: "How do you ask what someone does in their free time?",
        options: ["What do you do in your free time?", "What is your name?", "How old are you?", "Where do you live?"],
        answer: 0,
        explanation: "'What do you do in your free time?' est la question pour demander les activités de loisir.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My brother enjoys ___ (play) video games in his free time.'",
        options: ["play", "plays", "playing", "played"],
        answer: 2,
        explanation: "Après 'enjoys', le verbe prend -ing : playing.",
      },
    ],
    quiz: [
      { question: "How do you say 'nager' as a hobby in English?", options: ["swim", "swimming", "swims", "swam"], answer: 1 },
      { question: "How do you say 'danser' as a hobby in English?", options: ["dance", "dancing", "dances", "danced"], answer: 1 },
      { question: "Complete: 'I love ___ (read) books.'", options: ["read", "reading", "reads", "readed"], answer: 1 },
      { question: "What does 'free time' mean?", options: ["temps de travail", "temps libre", "temps de dormir", "temps de manger"], answer: 1 },
      { question: "Complete: 'She likes ___ (draw) animals.'", options: ["draw", "drawing", "draws", "drew"], answer: 1 },
    ],
  },

  l3: {
    summary:
      "Découverte du vocabulaire pour décrire une sortie ou une journée passée à l'extérieur, avec la structure du passé composé/passé simple anglais pour raconter les activités faites.",
    keyPoints: [
      "'A day out' = une sortie, une journée passée à l'extérieur de la maison",
      "Vocabulaire : zoo, beach, park, museum, cinema",
      "'We went to the zoo' = Nous sommes allés au zoo (utilise le passé de 'go' : went)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'zoo' in English?",
        options: ["zoo", "park", "museum", "beach"],
        answer: 0,
        explanation: "'Zoo' se dit exactement pareil en anglais.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'Yesterday, we ___ (go) to the beach.'",
        options: ["go", "goes", "went", "going"],
        answer: 2,
        explanation: "'Went' est le passé simple irrégulier de 'go', utilisé pour parler d'une action passée (yesterday).",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Last Sunday, my family ___ (visit) the museum.'",
        options: ["visit", "visits", "visited", "visiting"],
        answer: 2,
        explanation: "'Visited' est le passé simple régulier de 'visit' (ajout de -ed), utilisé pour une action passée précise.",
      },
    ],
    quiz: [
      { question: "How do you say 'plage' in English?", options: ["beach", "park", "zoo", "museum"], answer: 0 },
      { question: "How do you say 'musée' in English?", options: ["museum", "zoo", "park", "beach"], answer: 0 },
      { question: "What is the past tense of 'go'?", options: ["goed", "went", "gone", "going"], answer: 1 },
      { question: "Complete: 'We ___ (have) a great day out.'", options: ["have", "has", "had", "having"], answer: 2 },
      { question: "How do you say 'parc' in English?", options: ["park", "zoo", "beach", "museum"], answer: 0 },
    ],
  },

  l4: {
    summary:
      "Révision et distinction entre le présent simple (habitudes, faits généraux) et le présent continu (action en cours au moment où l'on parle), deux temps essentiels déjà vus séparément en 5ème année.",
    keyPoints: [
      "Présent simple : habitudes, faits généraux (I play football every Saturday)",
      "Présent continu : action en cours maintenant (I am playing football right now)",
      "Mots indicateurs du présent simple : always, usually, every day. Du présent continu : now, right now, at the moment",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'She ___ (play) tennis every weekend.'",
        options: ["play", "plays", "is playing", "played"],
        answer: 1,
        explanation: "'Every weekend' indique une habitude, donc présent simple : plays.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'Look! He ___ (run) very fast right now.'",
        options: ["run", "runs", "is running", "ran"],
        answer: 2,
        explanation: "'Right now' indique une action en cours, donc présent continu : is running.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I usually ___ (walk) to school, but today I ___ (take) the bus.'",
        options: ["walk / am taking", "am walking / take", "walks / takes", "walked / took"],
        answer: 0,
        explanation: "'Usually' indique une habitude (présent simple : walk), et 'today' avec l'action en cours indique le présent continu (am taking).",
      },
    ],
    quiz: [
      { question: "Which time expression suggests present simple?", options: ["now", "every day", "at the moment", "right now"], answer: 1 },
      { question: "Which time expression suggests present continuous?", options: ["always", "usually", "right now", "every week"], answer: 2 },
      { question: "Complete: 'They ___ (watch) TV at the moment.'", options: ["watch", "watches", "are watching", "watched"], answer: 2 },
      { question: "Complete: 'My father ___ (work) in a bank.' (habitude générale)", options: ["work", "works", "is working", "worked"], answer: 1 },
      { question: "Complete: 'We ___ (not/play) football now, we are studying.'", options: ["don't play", "doesn't play", "aren't playing", "didn't play"], answer: 2 },
    ],
  },

  l5: {
    summary:
      "Découverte d'adjectifs pour exprimer des sentiments et des opinions, pour pouvoir décrire comment on se sent ou ce qu'on pense d'une activité ou d'une chose.",
    keyPoints: [
      "Sentiments : happy, sad, excited, bored, tired, surprised",
      "Opinions : interesting, boring, amazing, terrible",
      "Structure : 'I feel + sentiment' ou 'I think it's + opinion' (Ex: I think it's amazing)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'ennuyé' in English?",
        options: ["excited", "bored", "happy", "surprised"],
        answer: 1,
        explanation: "'Bored' est la traduction anglaise de 'ennuyé'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'incroyable' (opinion positive) in English?",
        options: ["boring", "terrible", "amazing", "sad"],
        answer: 2,
        explanation: "'Amazing' signifie 'incroyable' ou 'formidable', une opinion très positive.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I think this film is ___ ; I don't like it at all.'",
        options: ["amazing", "terrible", "exciting", "interesting"],
        answer: 1,
        explanation: "'Terrible' convient ici car la personne exprime une opinion négative ('je ne l'aime pas du tout').",
      },
    ],
    quiz: [
      { question: "How do you say 'excité/e' in English?", options: ["excited", "bored", "tired", "sad"], answer: 0 },
      { question: "How do you say 'surpris' in English?", options: ["tired", "surprised", "happy", "bored"], answer: 1 },
      { question: "How do you say 'intéressant' in English?", options: ["boring", "interesting", "terrible", "sad"], answer: 1 },
      { question: "Complete: 'I feel ___ today.' (fatigué)", options: ["excited", "tired", "amazing", "interesting"], answer: 1 },
      { question: "How do you say 'ennuyeux' (chose) in English?", options: ["boring", "bored", "amazing", "excited"], answer: 0 },
    ],
  },

  l6: {
    summary:
      "Révision approfondie des mots interrogatifs (who, what, where, when, why, how), chacun utilisé pour poser un type de question spécifique, pour consolider la formulation de questions variées.",
    keyPoints: [
      "'Who' pour une personne, 'what' pour une chose, 'where' pour un lieu",
      "'When' pour un temps, 'why' pour une raison, 'how' pour une manière",
      "Chaque mot interrogatif se place en début de question, suivi de l'inversion sujet-auxiliaire",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which question word asks about a person?",
        options: ["What", "Who", "Where", "When"],
        answer: 1,
        explanation: "'Who' s'utilise pour poser une question sur une personne.",
      },
      {
        difficulty: "moyen",
        question: "Which question word asks about a reason?",
        options: ["Where", "When", "Why", "How"],
        answer: 2,
        explanation: "'Why' s'utilise pour demander une raison ou une explication.",
      },
      {
        difficulty: "difficile",
        question: "Complete: '___ did you go to the party? Because it was my friend's birthday.'",
        options: ["Who", "Why", "Where", "What"],
        answer: 1,
        explanation: "La réponse commence par 'Because' (parce que), ce qui indique que la question portait sur une raison, donc 'Why'.",
      },
    ],
    quiz: [
      { question: "Which question word asks about a place?", options: ["Who", "What", "Where", "Why"], answer: 2 },
      { question: "Which question word asks about a time?", options: ["When", "How", "Who", "What"], answer: 0 },
      { question: "Which question word asks about a manner?", options: ["Who", "Why", "How", "When"], answer: 2 },
      { question: "Complete: '___ is your favorite color?'", options: ["Who", "What", "Where", "When"], answer: 1 },
      { question: "Complete: '___ do you live?'", options: ["Where", "Who", "Why", "What"], answer: 0 },
    ],
  },

  l7: {
    summary:
      "Découverte du vocabulaire des sports et jeux, pour pouvoir parler de ses activités sportives préférées et de celles pratiquées par d'autres, avec les verbes 'play' (pour les sports d'équipe) et 'do' (pour certaines activités individuelles).",
    keyPoints: [
      "Sports : football, basketball, tennis, swimming, running",
      "'Play' s'utilise avec les sports d'équipe ou de balle (play football, play tennis)",
      "'Do' s'utilise avec certaines activités individuelles (do swimming, do athletics)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'football' in English?",
        options: ["football", "swimming", "running", "tennis"],
        answer: 0,
        explanation: "'Football' se dit pareil en anglais.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'I ___ football every Saturday.'",
        options: ["play", "do", "make", "have"],
        answer: 0,
        explanation: "On utilise 'play' avec les sports de balle/équipe comme le football.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'She ___ swimming twice a week.'",
        options: ["plays", "does", "makes", "has"],
        answer: 1,
        explanation: "On utilise 'do' avec certaines activités sportives individuelles comme la natation : does swimming.",
      },
    ],
    quiz: [
      { question: "How do you say 'natation' in English?", options: ["swimming", "running", "football", "tennis"], answer: 0 },
      { question: "How do you say 'course' (sport) in English?", options: ["swimming", "running", "football", "tennis"], answer: 1 },
      { question: "Complete: 'They ___ basketball on Fridays.'", options: ["play", "does", "make", "has"], answer: 0 },
      { question: "How do you say 'jeu' in English?", options: ["game", "work", "school", "sad"], answer: 0 },
      { question: "Complete: 'He ___ athletics every morning.'", options: ["plays", "does", "makes", "has"], answer: 1 },
    ],
  },

  l8: {
    summary:
      "Découverte de la formation du passé simple des verbes réguliers en anglais, en ajoutant -ed à l'infinitif, pour raconter des actions terminées dans le passé.",
    keyPoints: [
      "Formation régulière : verbe + -ed (play → played, watch → watched)",
      "Si le verbe se termine par -e, on ajoute seulement -d (like → liked)",
      "La même forme s'utilise pour toutes les personnes au passé simple (I played, you played, he played...)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the past tense of 'play'?",
        options: ["play", "played", "playing", "plays"],
        answer: 1,
        explanation: "Le passé simple régulier ajoute -ed : play → played.",
      },
      {
        difficulty: "moyen",
        question: "What is the past tense of 'like'?",
        options: ["liked", "likeed", "likes", "liking"],
        answer: 0,
        explanation: "Les verbes en -e n'ajoutent que -d : like → liked.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Yesterday, we ___ (watch) a great film and ___ (enjoy) it a lot.'",
        options: ["watched / enjoyed", "watch / enjoy", "watches / enjoys", "watching / enjoying"],
        answer: 0,
        explanation: "Les deux verbes réguliers prennent -ed au passé simple : watched et enjoyed.",
      },
    ],
    quiz: [
      { question: "What is the past tense of 'watch'?", options: ["watch", "watched", "watching", "watches"], answer: 1 },
      { question: "What is the past tense of 'walk'?", options: ["walked", "walk", "walking", "walks"], answer: 0 },
      { question: "What is the past tense of 'dance'?", options: ["danced", "dance", "dancing", "dances"], answer: 0 },
      { question: "Complete: 'She ___ (visit) her grandmother last week.'", options: ["visit", "visited", "visits", "visiting"], answer: 1 },
      { question: "The regular past tense ending is:", options: ["-ing", "-s", "-ed", "-er"], answer: 2 },
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