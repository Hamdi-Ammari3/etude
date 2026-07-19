// scripts/seedCol8AnglaisContentT3.js
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

const GRADE_ID = "col-8";
const SUBJECT_ID = "anglais";

// Trimestre 3 — lessons l17 through l24
const LESSON_CONTENT = {
  l17: {
    summary:
      "Révision et approfondissement de la distinction entre 'will' (décision spontanée, prédiction générale) et 'going to' (intention déjà planifiée), avec des exercices combinant les deux structures dans des contextes variés.",
    keyPoints: [
      "'Going to' : intention déjà décidée avant de parler (I am going to visit my grandmother tomorrow.)",
      "'Will' : décision spontanée au moment de parler, ou prédiction générale (I think it will rain.)",
      "Les deux structures peuvent coexister dans un même texte selon le contexte de chaque action",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ (already/decide) to study medicine.' (intention planifiée)",
        options: ["am going to study", "will study", "study", "studied"],
        answer: 0,
        explanation: "'Going to' convient pour une intention déjà décidée avant de parler.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'Look at those clouds! It ___ (rain).' (prédiction basée sur une preuve visible)",
        options: ["is going to rain", "will rain", "rains", "rained"],
        answer: 0,
        explanation: "'Going to' s'utilise pour une prédiction basée sur une preuve visible actuelle (les nuages).",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'The phone is ringing! I ___ (answer) it.' vs 'I ___ (visit) my cousin next week; I already bought the ticket.'",
        options: ["will answer / am going to visit", "am going to answer / will visit", "answer / visit", "answered / visited"],
        answer: 0,
        explanation: "'Will answer' pour une décision spontanée (le téléphone sonne maintenant), et 'am going to visit' pour une intention déjà planifiée (billet déjà acheté).",
      },
    ],
    quiz: [
      { question: "Which structure expresses a spontaneous decision?", options: ["going to", "will", "present simple", "past simple"], answer: 1 },
      { question: "Which structure expresses a planned intention?", options: ["going to", "will only", "present simple", "past simple"], answer: 0 },
      { question: "Complete: 'I ___ (help) you with your bags.' (offre spontanée)", options: ["am going to help", "will help", "help", "helped"], answer: 1 },
      { question: "Complete: 'We ___ (travel) to Paris this summer; we booked our flights already.'", options: ["are going to travel", "will travel", "travel", "traveled"], answer: 0 },
      { question: "'Will' is often used for:", options: ["general predictions", "planned intentions only", "past events", "habits"], answer: 0 },
    ],
  },

  l18: {
    summary:
      "Approfondissement des verbes modaux exprimant l'obligation (must, have to) et la permission (can, may), avec les nuances entre 'must' (obligation personnelle/forte) et 'have to' (obligation externe/règle).",
    keyPoints: [
      "'Must' : obligation personnelle ou forte conviction (I must study for my exam.)",
      "'Have to' : obligation externe, règle imposée (I have to wear a uniform at school.)",
      "'Can'/'May' : permission (Can I go out? / You may leave now.)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'Students ___ wear a uniform at this school.' (règle externe)",
        options: ["must", "have to", "can", "may"],
        answer: 1,
        explanation: "'Have to' convient pour une règle externe imposée par l'école.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'I ___ study harder; my exam is very important to me.' (obligation personnelle)",
        options: ["must", "have to", "can", "may"],
        answer: 0,
        explanation: "'Must' convient pour une obligation ressentie personnellement, une conviction forte.",
      },
      {
        difficulty: "difficile",
        question: "Complete: '___ I borrow your pen, please?' — 'Yes, you ___.'",
        options: ["May / may", "Must / must", "Have to / have to", "Will / will"],
        answer: 0,
        explanation: "'May' s'utilise pour demander et donner une permission polie.",
      },
    ],
    quiz: [
      { question: "Which modal expresses an external rule?", options: ["have to", "must", "can", "may"], answer: 0 },
      { question: "Which modal expresses a personal strong obligation?", options: ["have to", "must", "can", "may"], answer: 1 },
      { question: "Complete: 'You ___ smoke here; it's forbidden.' (interdiction)", options: ["must not", "don't have to", "can", "may"], answer: 0 },
      { question: "Complete: '___ I sit here?' (permission)", options: ["May", "Must", "Have to", "Will"], answer: 0 },
      { question: "'Don't have to' means:", options: ["it is not necessary", "it is forbidden", "it is required", "it is a strong obligation"], answer: 0 },
    ],
  },

  l19: {
    summary:
      "Découverte du vocabulaire de l'environnement et de la nature, avec des structures pour parler des problèmes écologiques (pollution, déforestation) et des solutions (recycling, protecting).",
    keyPoints: [
      "Vocabulaire des problèmes : pollution, deforestation, climate change, waste",
      "Vocabulaire des solutions : recycle, protect, save energy, plant trees",
      "'We should + verbe' pour proposer des solutions environnementales",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'pollution' in English?",
        options: ["pollution", "protection", "recycling", "deforestation"],
        answer: 0,
        explanation: "'Pollution' se dit pareil en anglais.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'déforestation' in English?",
        options: ["pollution", "deforestation", "recycling", "protection"],
        answer: 1,
        explanation: "'Deforestation' est la traduction anglaise de 'déforestation'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'We ___ (should) recycle more to reduce ___ (pollution) in our city.'",
        options: ["should / pollution", "must not / protection", "will / recycling", "can't / deforestation"], 
        answer: 0,
        explanation: "'Should recycle' propose une solution, et 'pollution' est le problème mentionné.",
      },
    ],
    quiz: [
      { question: "How do you say 'recycler' in English?", options: ["recycle", "pollute", "destroy", "waste"], answer: 0 },
      { question: "How do you say 'protéger' in English?", options: ["protect", "pollute", "waste", "destroy"], answer: 0 },
      { question: "How do you say 'changement climatique' in English?", options: ["climate change", "weather change", "season change", "no change"], answer: 0 },
      { question: "How do you say 'planter des arbres' in English?", options: ["plant trees", "cut trees", "burn trees", "sell trees"], answer: 0 },
      { question: "How do you say 'économiser l'énergie' in English?", options: ["save energy", "waste energy", "use energy only", "buy energy"], answer: 0 },
    ],
  },

  l20: {
    summary:
      "Découverte des structures pour exprimer une opinion et la justifier avec une raison, en utilisant des expressions comme 'I think... because...' ou 'In my opinion...', utile pour l'argumentation orale et écrite.",
    keyPoints: [
      "'I think that + opinion + because + raison' (I think that recycling is important because it protects the environment.)",
      "'In my opinion...' pour introduire un avis personnel",
      "'I agree/disagree with...' pour exprimer l'accord ou le désaccord",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you introduce a personal opinion?",
        options: ["In my opinion...", "It is a fact that...", "Never...", "Always..."],
        answer: 0,
        explanation: "'In my opinion...' introduit clairement un avis personnel.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'I think that sport is important ___ it keeps us healthy.'",
        options: ["because", "but", "or", "so"],
        answer: 0,
        explanation: "'Because' introduit la raison qui justifie l'opinion.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I ___ (agree) with this idea ___ it makes sense to me, but some people might ___ (disagree).'",
        options: ["agree / because / disagree", "disagree / but / agree", "agree / but / agree", "disagree / because / agree"],
        answer: 0,
        explanation: "'Agree... because' exprime l'accord avec justification, et 'disagree' présente une opinion opposée possible.",
      },
    ],
    quiz: [
      { question: "How do you say 'être d'accord' in English?", options: ["agree", "disagree", "think", "believe"], answer: 0 },
      { question: "How do you say 'ne pas être d'accord' in English?", options: ["agree", "disagree", "think", "believe"], answer: 1 },
      { question: "Which word introduces a reason?", options: ["because", "but", "or", "and"], answer: 0 },
      { question: "Complete: 'In my opinion, this book ___ interesting.'", options: ["is", "are", "am", "be"], answer: 0 },
      { question: "How do you express your opinion politely?", options: ["I think that...", "This is true.", "You are wrong.", "Never say that."], answer: 0 },
    ],
  },

  l21: {
    summary:
      "Développement de la compréhension de textes informatifs (articles, brochures), en apprenant à identifier l'idée principale, les détails de soutien, et à répondre à des questions de compréhension avec des phrases complètes.",
    keyPoints: [
      "L'idée principale se trouve souvent dans la première phrase d'un paragraphe informatif",
      "Les détails de soutien apportent des exemples, chiffres, ou explications à l'idée principale",
      "Répondre aux questions de compréhension nécessite de repérer l'information précise dans le texte",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Where is the main idea often found in an informational paragraph?",
        options: ["in the first sentence", "always in the last sentence", "nowhere specific", "only in the title"],
        answer: 0,
        explanation: "L'idée principale se trouve souvent dans la première phrase (la phrase-thème) d'un paragraphe informatif.",
      },
      {
        difficulty: "moyen",
        question: "What do supporting details provide?",
        options: ["examples and explanations for the main idea", "a completely different topic", "nothing useful", "only questions"],
        answer: 0,
        explanation: "Les détails de soutien apportent des exemples et des explications qui développent l'idée principale.",
      },
      {
        difficulty: "difficile",
        question: "If a text says 'Recycling reduces waste. For example, recycling one ton of paper saves 17 trees', what is the supporting detail?",
        options: ["the example about saving 17 trees per ton of paper recycled", "recycling reduces waste (main idea)", "there is no supporting detail", "the whole sentence is the main idea"],
        answer: 0,
        explanation: "Le détail de soutien est l'exemple concret et chiffré (17 arbres sauvés), qui vient appuyer l'idée principale (le recyclage réduit les déchets).",
      },
    ],
    quiz: [
      { question: "What is a 'main idea'?", options: ["the central point of a paragraph", "an unrelated fact", "the title only", "a question"], answer: 0 },
      { question: "What are 'supporting details'?", options: ["examples that develop the main idea", "random unrelated facts", "the conclusion only", "questions"], answer: 0 },
      { question: "When answering comprehension questions, you should:", options: ["answer with complete sentences based on the text", "guess without reading", "copy the whole text", "answer with one word only always"], answer: 0 },
      { question: "Reading the title before a text helps to:", options: ["anticipate the content", "understand nothing", "skip the reading", "no particular use"], answer: 0 },
      { question: "An informational text is mainly used to:", options: ["inform the reader about facts", "tell a fictional story", "express only opinions", "give orders"], answer: 0 },
    ],
  },

  l22: {
    summary:
      "Découverte des différences entre une lettre formelle (adressée à une administration ou une personne inconnue) et une lettre informelle (adressée à un ami ou un membre de la famille), avec leurs structures et formules respectives.",
    keyPoints: [
      "Lettre formelle : 'Dear Sir/Madam', vocabulaire soutenu, 'Yours faithfully/sincerely'",
      "Lettre informelle : 'Dear + prénom', vocabulaire familier, 'Love/Best wishes'",
      "Le choix du registre dépend du destinataire et du but de la lettre",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which greeting is used in a formal letter to an unknown person?",
        options: ["Dear Sir/Madam,", "Hi!", "Dear Sami,", "Hey!"],
        answer: 0,
        explanation: "'Dear Sir/Madam,' est la formule d'ouverture standard pour une lettre formelle à un destinataire inconnu.",
      },
      {
        difficulty: "moyen",
        question: "Which closing is used in an informal letter to a friend?",
        options: ["Yours faithfully,", "Yours sincerely,", "Best wishes,", "Respectfully,"],
        answer: 2,
        explanation: "'Best wishes,' convient pour une lettre informelle et amicale.",
      },
      {
        difficulty: "difficile",
        question: "Which pair correctly matches a formal letter's opening and closing?",
        options: ["Dear Sir/Madam, ... Yours faithfully,", "Hi! ... Love,", "Dear Sir/Madam, ... Love,", "Hey! ... Yours faithfully,"],
        answer: 0,
        explanation: "'Dear Sir/Madam,' (ouverture formelle) s'accorde avec 'Yours faithfully,' (fermeture formelle), maintenant un registre cohérent tout au long de la lettre.",
      },
    ],
    quiz: [
      { question: "Which greeting is informal?", options: ["Dear Sir/Madam,", "Hi Sami!", "To whom it may concern,", "Dear Madam,"], answer: 1 },
      { question: "Which closing is formal?", options: ["Love,", "Best wishes,", "Yours sincerely,", "See you soon,"], answer: 2 },
      { question: "A formal letter is typically written to:", options: ["an administration or unknown person", "a close friend", "a family member only", "no one in particular"], answer: 0 },
      { question: "An informal letter is typically written to:", options: ["a friend or family member", "a company", "an unknown official", "a stranger"], answer: 0 },
      { question: "Choosing the right register depends on:", options: ["the recipient and purpose of the letter", "nothing in particular", "the length of the letter only", "the day of the week"], answer: 0 },
    ],
  },

  l23: {
    summary:
      "Révision générale de tous les points grammaticaux étudiés durant l'année : présent simple/continu, passé simple/continu, present perfect, comparatifs/superlatifs, going to/will, et verbes modaux.",
    keyPoints: [
      "Temps : présent simple/continu, passé simple/continu, present perfect",
      "Futur : will (spontané/prédiction) vs going to (planifié)",
      "Modaux : must/have to (obligation), can/may (permission)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I ___ (play) tennis every Saturday.' (habitude)",
        options: ["play", "am playing", "played", "will play"],
        answer: 0,
        explanation: "'Every Saturday' indique une habitude : présent simple.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'She ___ (never/visit) London.' (experience)",
        options: ["never visits", "has never visited", "never visited", "is never visiting"],
        answer: 1,
        explanation: "'Never' avec le present perfect pour une expérience de vie : has never visited.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'While I ___ (walk) home, it ___ (start) to rain, so I ___ (decide) to run.'",
        options: ["was walking / started / decided", "walked / was starting / decide", "walk / starts / decided", "am walking / starts / decide"],
        answer: 0,
        explanation: "'Was walking' (passé continu, action en cours), 'started' (passé simple, action ponctuelle qui interrompt), et 'decided' (passé simple, action ponctuelle suivante).",
      },
    ],
    quiz: [
      { question: "Complete: 'She ___ (watch) TV right now.'", options: ["watches", "is watching", "watched", "will watch"], answer: 1 },
      { question: "What is the comparative of 'good'?", options: ["gooder", "more good", "better", "goodest"], answer: 2 },
      { question: "Complete: 'You ___ study more.' (conseil)", options: ["can", "must", "should", "will"], answer: 2 },
      { question: "Complete: 'They ___ (visit) their grandmother last week.'", options: ["visit", "are visiting", "visited", "will visit"], answer: 2 },
      { question: "Complete: 'I ___ (travel) to Paris next year; I already booked my ticket.'", options: ["am going to travel", "travel", "traveled", "am travelling now"], answer: 0 },
    ],
  },

  l24: {
    summary:
      "Préparation finale à l'évaluation de fin d'année : révision combinée de la lecture (compréhension de texte informatif), de l'écriture (lettre formelle/informelle, biographie), et de la grammaire (tous les points étudiés durant l'année).",
    keyPoints: [
      "Compréhension : identifier l'idée principale et les détails de soutien, répondre en phrases complètes",
      "Expression écrite : adapter le registre (formel/informel) selon le destinataire",
      "Grammaire : revoir tous les temps, les modaux, les comparatifs, et les connecteurs",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "When answering a reading comprehension question, you should:",
        options: ["answer with a complete sentence based on the text", "answer with one word only always", "guess without reading", "copy the whole text"],
        answer: 0,
        explanation: "Les réponses de compréhension doivent être des phrases complètes justifiées par le texte.",
      },
      {
        difficulty: "moyen",
        question: "A formal letter should use:",
        options: ["polite and formal vocabulary", "casual slang", "no greeting at all", "only short forms"],
        answer: 0,
        explanation: "Une lettre formelle nécessite un vocabulaire poli et soutenu, adapté au destinataire.",
      },
      {
        difficulty: "difficile",
        question: "Complete this exam-style sentence: 'My sister ___ (already/finish) her homework, so now she ___ (can) watch TV.'",
        options: ["has already finished / can", "already finishes / could", "already finished / can", "is already finishing / can"],
        answer: 0,
        explanation: "'Has already finished' (present perfect avec 'already') et 'can' (modal de capacité/permission au présent) sont corrects.",
      },
    ],
    quiz: [
      { question: "What tense is used for habits?", options: ["present simple", "present continuous", "past simple", "future simple"], answer: 0 },
      { question: "What tense is used for a life experience without a specific time?", options: ["present perfect", "present continuous", "past simple", "future simple"], answer: 0 },
      { question: "What structure expresses a planned future intention?", options: ["going to", "will only", "present simple", "past simple"], answer: 0 },
      { question: "A well-organized paragraph typically has:", options: ["a clear main idea and supporting details", "no structure", "only questions", "only isolated words"], answer: 0 },
      { question: "Which modal verb expresses obligation?", options: ["can", "must", "would", "could"], answer: 1 },
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