// scripts/seedCol9AnglaisContentT3b.js
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
  l26: {
    summary:
      "Le thème 'Voluntary work' explore le bénévolat, avec 'can' et 'cannot' pour exprimer la capacité ou l'incapacité de faire quelque chose.",
    keyPoints: [
      "'Can' exprime une capacité (Volunteers can make a real difference.)",
      "'Cannot/can't' exprime une incapacité (Some people can't afford basic needs.)",
      "Vocabulaire : to take part in, needy, homeless, cruel, volunteer, donate, disabled, to stand by, to survive, chores, lack of, to give a hand",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'Volunteers ___ make a real difference in their community.' (ability)",
        options: ["can", "cannot", "must not", "shouldn't"],
        answer: 0,
        explanation: "'Can' exprime la capacité positive d'accomplir une action.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'faire un don' in English?",
        options: ["to donate", "to donate to (redundant)", "to give away only", "to receive"],
        answer: 0,
        explanation: "'To donate' signifie faire un don.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Without help, disabled people ___ perform some daily chores easily.'",
        options: ["cannot", "can", "must", "should"],
        answer: 0,
        explanation: "'Cannot' exprime l'incapacité, appropriée ici pour souligner la difficulté sans assistance.",
      },
    ],
    quiz: [
      { question: "How do you say 'sans-abri' in English?", options: ["homeless", "needy", "disabled", "cruel"], answer: 0 },
      { question: "How do you say 'dans le besoin' in English?", options: ["needy", "homeless", "disabled", "cruel"], answer: 0 },
      { question: "How do you say 'bénévole' in English?", options: ["volunteer", "employee", "customer", "manager"], answer: 0 },
      { question: "How do you say 'manque de' in English?", options: ["lack of", "plenty of", "full of", "amount of"], answer: 0 },
      { question: "How do you say 'tâches ménagères' in English?", options: ["chores", "hobbies", "jobs (paid)", "games"], answer: 0 },
    ],
  },

  l27: {
    summary:
      "Le thème 'Volunteering kids' montre des enfants engagés dans le bénévolat, avec les structures pour offrir de l'aide : 'Can I help you?' et 'What can I do for you?'.",
    keyPoints: [
      "'Can I help you?' : offre d'aide directe et polie",
      "'What can I do for you?' : offre d'aide en demandant précisément le besoin",
      "Vocabulaire : to get started, to come forward, membership, to establish, to involve, across, foreign",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which phrase offers help politely?",
        options: ["Can I help you?", "I don't care", "Leave me alone", "That's not my problem"],
        answer: 0,
        explanation: "'Can I help you?' est une offre d'aide polie et directe.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'se manifester/se présenter' in English?",
        options: ["to come forward", "to come back", "to come in", "to come round"],
        answer: 0,
        explanation: "'To come forward' signifie se manifester ou se présenter volontairement.",
      },
      {
        difficulty: "difficile",
        question: "Complete this offer of help: '___ can I do for you today?'",
        options: ["What", "How", "Who", "Where"],
        answer: 0,
        explanation: "'What can I do for you?' est la structure exacte pour offrir de l'aide en demandant le besoin précis.",
      },
    ],
    quiz: [
      { question: "How do you say 'adhésion' in English?", options: ["membership", "leadership", "friendship", "relationship"], answer: 0 },
      { question: "How do you say 'établir' in English?", options: ["to establish", "to destroy", "to remove", "to forget"], answer: 0 },
      { question: "How do you say 'étranger (adjectif)' in English?", options: ["foreign", "domestic", "local", "national"], answer: 0 },
      { question: "How do you say 'impliquer' in English?", options: ["to involve", "to exclude", "to remove", "to forget"], answer: 0 },
      { question: "'Can I help you?' is used to:", options: ["offer help politely", "refuse help", "ask for money", "give an order"], answer: 0 },
    ],
  },

  l28: {
    summary:
      "Le thème 'How to be cooperative' aborde la coopération, avec le passé progressif (past progressive/continuous), qui exprime une action en cours à un moment précis du passé.",
    keyPoints: [
      "Formation : was/were + verbe-ing (I was helping, they were sharing)",
      "Usage : action en cours dans le passé, souvent interrompue par une autre action",
      "Vocabulaire : hard time, to trust, to perform, to figure out, to share, to carry out, peers",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'They ___ (share) their tools when the accident happened.'",
        options: ["were sharing", "shared", "share", "will share"],
        answer: 0,
        explanation: "Le passé progressif exprime une action en cours interrompue : were sharing.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'faire confiance' in English?",
        options: ["to trust", "to distrust", "to doubt", "to suspect"],
        answer: 0,
        explanation: "'To trust' signifie faire confiance.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'While the team ___ (carry out) the project, they realized they needed more cooperation.'",
        options: ["was carrying out", "carried out", "carries out", "will carry out"],
        answer: 0,
        explanation: "Le passé progressif ('was carrying out') exprime l'action en cours pendant laquelle une prise de conscience s'est produite.",
      },
    ],
    quiz: [
      { question: "How do you say 'pairs/camarades' in English?", options: ["peers", "enemies", "strangers", "rivals"], answer: 0 },
      { question: "How do you say 'moment difficile' in English?", options: ["hard time", "easy time", "free time", "spare time"], answer: 0 },
      { question: "How do you say 'comprendre/résoudre (figure out)' in English?", options: ["to figure out", "to figure in", "to figure up", "to figure down"], answer: 0 },
      { question: "The past progressive is formed with:", options: ["was/were + verb-ing", "have/has + past participle", "will + infinitive", "did + infinitive"], answer: 0 },
      { question: "The past progressive often expresses:", options: ["an action in progress in the past", "a future plan", "a general truth", "a present habit"], answer: 0 },
    ],
  },

  l29: {
    summary:
      "Le thème 'Clubs, associations and charities' aborde les organisations caritatives, avec les structures pour exprimer une opinion : 'I think that...', 'I believe that...', 'In my opinion...'.",
    keyPoints: [
      "'I think that + clause' : exprime une opinion générale",
      "'I believe that + clause' : exprime une conviction",
      "'In my opinion, + clause' : introduit un point de vue personnel formel",
      "Vocabulaire : opportunity, hands-on, mission, homeless (rappel), shovel, driveway, stair lift, walking stick",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I think ___ this charity does great work.'",
        options: ["that", "if", "for", "to"],
        answer: 0,
        explanation: "'I think that + proposition' introduit une opinion.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'occasion/opportunité' in English?",
        options: ["opportunity", "obligation", "necessity", "requirement"],
        answer: 0,
        explanation: "'Opportunity' est la traduction anglaise de 'occasion' ou 'opportunité'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'In my opinion, ___ volunteering teaches young people responsibility and empathy.'",
        options: ["I believe that", "you must", "we should never", "it's forbidden that"],
        answer: 0,
        explanation: "'In my opinion, I believe that...' combine deux structures d'opinion pour renforcer l'expression du point de vue personnel.",
      },
    ],
    quiz: [
      { question: "How do you say 'canne (de marche)' in English?", options: ["walking stick", "wheelchair", "crutch", "cane (alternative, also correct)"], answer: 0 },
      { question: "How do you say 'pelle' in English?", options: ["shovel", "rake", "hoe", "spade (alternative, also correct)"], answer: 0 },
      { question: "How do you say 'pratique/concret (hands-on)' in English?", options: ["hands-on", "theoretical", "abstract", "distant"], answer: 0 },
      { question: "Which expression introduces an opinion?", options: ["I think that", "I doubt it", "Never mind", "So what"], answer: 0 },
      { question: "How do you say 'mission' in English?", options: ["mission", "vision (different meaning)", "task (broader meaning)", "job (broader meaning)"], answer: 0 },
    ],
  },

  l30: {
    summary:
      "Le thème 'Tolerance and respect for others' conclut le module Civility, avec la structure 'I hope that + clause' pour exprimer un espoir, souvent utilisée dans des contextes de tolérance et de vivre-ensemble.",
    keyPoints: [
      "'I hope that + clause' exprime un espoir (I hope that people will be more tolerant.)",
      "Vocabulaire : immigrants, refugees, peacemaker, conflicts, tortured, reconciliation",
      "Ce thème encourage l'usage de structures d'espoir pour discuter de valeurs sociales comme la tolérance",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I hope ___ people become more tolerant of differences.'",
        options: ["that", "if", "for", "to"],
        answer: 0,
        explanation: "'I hope that + proposition' exprime un espoir.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'réfugiés' in English?",
        options: ["refugees", "immigrants (related but different)", "tourists", "citizens"],
        answer: 0,
        explanation: "'Refugees' désigne spécifiquement les personnes fuyant un danger, distinct des immigrants en général.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I hope that this reconciliation process ___ (bring) lasting peace to the region.'",
        options: ["will bring", "brings (present, less natural for hope about future)", "brought", "is bringing"],
        answer: 0,
        explanation: "'I hope that + will + verbe' est la structure naturelle pour exprimer un espoir concernant un événement futur.",
      },
    ],
    quiz: [
      { question: "How do you say 'immigrants' in English?", options: ["immigrants", "refugees (different, fleeing danger)", "tourists", "citizens"], answer: 0 },
      { question: "How do you say 'artisan de paix' in English?", options: ["peacemaker", "warmonger", "soldier", "enemy"], answer: 0 },
      { question: "How do you say 'conflits' in English?", options: ["conflicts", "agreements", "treaties", "alliances"], answer: 0 },
      { question: "How do you say 'réconciliation' in English?", options: ["reconciliation", "separation", "division", "conflict"], answer: 0 },
      { question: "'I hope that' is followed by a clause expressing:", options: ["a wish for the future", "a certain fact", "a past regret", "an obligation"], answer: 0 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 3, part B)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});