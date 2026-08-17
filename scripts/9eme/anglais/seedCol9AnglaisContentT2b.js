// scripts/seedCol9AnglaisContentT2b.js
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

const GRADE_ID = "col-9";
const SUBJECT_ID = "anglais";

const LESSON_CONTENT = {
  l16: {
    summary:
      "Le thème 'At the airport' enseigne les formules de politesse pour faire une demande polie : 'Would you mind + Ving' et 'Could you + verbe de base' (VP), utiles dans des situations formelles comme l'aéroport.",
    keyPoints: [
      "'Would you mind + Ving' : demande polie (Would you mind closing the door?)",
      "'Could you + verbe' : demande polie (Could you help me with my luggage?)",
      "Vocabulaire : customs, aisle, boarding pass, railway, to fasten, seat belt, to take off",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete a polite request: '___ you mind showing me your boarding pass?'",
        options: ["Would", "Could you (needs different structure)", "Can", "Will"],
        answer: 0,
        explanation: "'Would you mind + Ving' est la structure correcte pour une demande polie.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'douane' in English?",
        options: ["customs", "aisle", "boarding pass", "railway"],
        answer: 0,
        explanation: "'Customs' est la traduction anglaise de 'douane'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Could you ___ your seat belt before take-off, please?'",
        options: ["fasten", "fastening", "to fasten", "fastened"],
        answer: 0,
        explanation: "'Could you + verbe de base (sans to, sans -ing)' : Could you fasten your seat belt?",
      },
    ],
    quiz: [
      { question: "How do you say 'carte d'embarquement' in English?", options: ["boarding pass", "customs", "aisle", "railway"], answer: 0 },
      { question: "How do you say 'décoller (avion)' in English?", options: ["to take off", "to land", "to fasten", "to board"], answer: 0 },
      { question: "How do you say 'allée (dans un avion)' in English?", options: ["aisle", "seat", "belt", "railway"], answer: 0 },
      { question: "Which structure requests something politely with -ing?", options: ["Would you mind + Ving", "Could you + Ving", "Can you + infinitive", "Must you + infinitive"], answer: 0 },
      { question: "How do you say 'attacher (la ceinture)' in English?", options: ["to fasten", "to take off", "to board", "to check in"], answer: 0 },
    ],
  },

  l17: {
    summary:
      "Le thème 'Internet shopping' explore les achats en ligne, avec les structures 'mind + nom' pour donner un avertissement (Mind the hackers!) et l'expression 'Look out!' pour alerter d'un danger.",
    keyPoints: [
      "'Mind + NP (nom)' : avertissement (Mind the gap! / Mind your password.)",
      "'Look out!' : exclamation pour alerter d'un danger imminent",
      "Vocabulaire : to exchange, to chat, on-line, website, hackers, means, huge, benefits, secure, to order",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you warn someone about hackers online?",
        options: ["Mind the hackers!", "Hackers mind you!", "You mind hackers", "Hackers are minding"],
        answer: 0,
        explanation: "'Mind + nom' avertit d'un danger, ici les pirates informatiques.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'commander (en ligne)' in English?",
        options: ["to order", "to exchange", "to chat", "to secure"],
        answer: 0,
        explanation: "'To order' signifie commander, souvent utilisé pour les achats en ligne.",
      },
      {
        difficulty: "difficile",
        question: "Complete this warning exclamation: '___! That website doesn't look secure.'",
        options: ["Look out", "Look at", "Look in", "Look up"],
        answer: 0,
        explanation: "'Look out!' est l'exclamation appropriée pour alerter d'un danger, ici un site web non sécurisé.",
      },
    ],
    quiz: [
      { question: "How do you say 'pirates informatiques' in English?", options: ["hackers", "customers", "sellers", "buyers"], answer: 0 },
      { question: "How do you say 'sécurisé' in English?", options: ["secure", "insecure", "hacked", "broken"], answer: 0 },
      { question: "How do you say 'échanger' in English?", options: ["to exchange", "to order", "to secure", "to chat"], answer: 0 },
      { question: "How do you say 'énorme' in English?", options: ["huge", "tiny", "secure", "hacked"], answer: 0 },
      { question: "'Mind + NP' is used to:", options: ["give a warning", "ask a question", "give a compliment", "express regret"], answer: 0 },
    ],
  },

  l18: {
    summary:
      "Le thème 'Tourism' introduit le present perfect (have/has + participe passé), utilisé pour parler d'une expérience de vie sans temps précis, ou d'une action passée ayant un effet présent, souvent utilisé pour discuter de voyages.",
    keyPoints: [
      "Formation : have/has + participe passé (I have visited many countries.)",
      "Usage : expérience de vie (Have you ever been to Paris?), résultat présent d'une action passée",
      "Vocabulaire : boom, amount, progress, to experience, that will be/it's worth your while, kind of you",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ (visit) five countries so far.'",
        options: ["have visited", "visited", "visit", "am visiting"],
        answer: 0,
        explanation: "Le present perfect exprime une expérience cumulée sans temps précis : have visited.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'Have you ever ___ (be) to Japan?'",
        options: ["been", "be", "were", "was"],
        answer: 0,
        explanation: "'Have you ever been' est la question standard du present perfect pour demander une expérience de vie.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Tourism ___ (grow) significantly in this region over the last decade.'",
        options: ["has grown", "grew", "grows", "is growing"],
        answer: 0,
        explanation: "Le present perfect ('has grown') convient pour une action commencée dans le passé et continuant d'avoir un effet jusqu'à présent, marquée par 'over the last decade'.",
      },
    ],
    quiz: [
      { question: "How is the present perfect formed?", options: ["have/has + past participle", "be + Ving", "will + infinitive", "did + infinitive"], answer: 0 },
      { question: "How do you say 'expérimenter/vivre (une expérience)' in English?", options: ["to experience", "to progress", "to boom", "to amount"], answer: 0 },
      { question: "Complete: 'She ___ (never/travel) abroad.'", options: ["has never traveled", "never travels", "never traveled", "is never traveling"], answer: 0 },
      { question: "The present perfect often expresses:", options: ["a life experience without a specific time", "a specific past action with a date", "a future plan", "a habit only"], answer: 0 },
      { question: "How do you say 'essor/boom' in English?", options: ["boom", "amount", "progress", "experience"], answer: 0 },
    ],
  },

  l19: {
    summary:
      "Le thème 'Transport' introduit le premier conditionnel (first conditional), utilisé pour parler d'une conséquence probable dans le futur si une condition présente se réalise : 'If + présent, ... futur (will)'.",
    keyPoints: [
      "Structure : If + présent simple, ... will + verbe (If it rains, I will take the bus.)",
      "Exprime une condition réaliste avec une conséquence probable dans le futur",
      "Vocabulaire : convenient, frequent, available, throughout, an enquiry, to give a hand",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'If it rains, I ___ (take) the bus.'",
        options: ["will take", "take", "took", "am taking"],
        answer: 0,
        explanation: "Premier conditionnel : If + présent, will + verbe : will take.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'If the train ___ (be) late, we will miss our connection.'",
        options: ["is", "will be", "was", "would be"],
        answer: 0,
        explanation: "Dans le premier conditionnel, la proposition avec 'if' utilise le présent simple : is.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'If public transport ___ (become) more convenient, more people ___ (use) it instead of cars.'",
        options: ["becomes / will use", "will become / use", "became / would use", "become / used"],
        answer: 0,
        explanation: "'If + présent (becomes)' et 'will + verbe (will use)' respectent la structure du premier conditionnel.",
      },
    ],
    quiz: [
      { question: "How do you say 'pratique/commode' in English?", options: ["convenient", "frequent", "available", "throughout"], answer: 0 },
      { question: "How do you say 'fréquent' in English?", options: ["frequent", "convenient", "available", "rare"], answer: 0 },
      { question: "How do you say 'disponible' in English?", options: ["available", "convenient", "frequent", "throughout"], answer: 0 },
      { question: "The first conditional structure is:", options: ["If + present, will + verb", "If + past, would + verb", "If + present perfect, will + verb", "If + future, will + verb"], answer: 0 },
      { question: "How do you say 'donner un coup de main' in English?", options: ["to give a hand", "to give a foot", "to give an arm", "to give a leg"], answer: 0 },
    ],
  },

  l20: {
    summary:
      "Le thème 'Communication' aborde les moyens de communication, avec le gérondif (Ving) utilisé comme nom (le gérondif + nom, ou nom + gérondif), une forme verbale fonctionnant comme un substantif dans la phrase.",
    keyPoints: [
      "Le gérondif (Ving) fonctionne comme un nom : Reading is a good hobby. / I enjoy reading books.",
      "Gérondif + nom : a reading room (une salle de lecture). Nom + gérondif : a means of communicating",
      "Vocabulaire : seller, to come round, reception desk, to join, to look forward to",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I enjoy ___ (chat) with my friends online.'",
        options: ["chatting", "chat", "to chat", "chatted"],
        answer: 0,
        explanation: "Après 'enjoy', le verbe prend la forme gérondive (-ing) : chatting.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'avoir hâte de' in English?",
        options: ["to look forward to", "to look at", "to look for", "to look up"],
        answer: 0,
        explanation: "'To look forward to' signifie 'avoir hâte de', souvent suivi d'un gérondif : I look forward to seeing you.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I look forward to ___ (hear) from you soon.'",
        options: ["hearing", "hear", "to hear", "heard"],
        answer: 0,
        explanation: "'Look forward to' est suivi d'un gérondif (Ving), même si 'to' apparaît dans l'expression : looking forward to hearing.",
      },
    ],
    quiz: [
      { question: "How do you say 'bureau de réception' in English?", options: ["reception desk", "seller", "join", "come round"], answer: 0 },
      { question: "How do you say 'rejoindre/adhérer' in English?", options: ["to join", "to seller", "to look forward", "to come round"], answer: 0 },
      { question: "What is a gerund?", options: ["a verb form (-ing) used as a noun", "a type of adjective", "a past tense verb", "a question word"], answer: 0 },
      { question: "Complete: '___ (Communicate) online is very common today.' (gerund as subject)", options: ["Communicating", "Communicate", "To communicate", "Communicated"], answer: 0 },
      { question: "How do you say 'passer (rendre visite)' in English?", options: ["to come round", "to join", "to look forward", "to sell"], answer: 0 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 2, part B)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});