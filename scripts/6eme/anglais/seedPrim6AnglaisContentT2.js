// scripts/seedPrim6AnglaisContentT2.js
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

// Trimestre 2 — lessons l9 through l16
const LESSON_CONTENT = {
  l9: {
    summary:
      "Découverte des verbes irréguliers au passé simple, dont la forme passée ne suit pas la règle du -ed et doit être mémorisée directement pour chaque verbe.",
    keyPoints: [
      "Les verbes irréguliers ont une forme de passé unique à apprendre par cœur : go → went, eat → ate, see → saw",
      "Contrairement aux verbes réguliers, aucune règle fixe ne s'applique",
      "Verbes irréguliers courants : go/went, eat/ate, see/saw, have/had, do/did, make/made",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the past tense of 'go'?",
        options: ["goed", "went", "gone", "going"],
        answer: 1,
        explanation: "'Went' est le passé irrégulier de 'go', à mémoriser directement.",
      },
      {
        difficulty: "moyen",
        question: "What is the past tense of 'eat'?",
        options: ["eated", "ate", "eaten", "eating"],
        answer: 1,
        explanation: "'Ate' est le passé irrégulier de 'eat'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Last night, we ___ (have) dinner and then we ___ (see) a good film.'",
        options: ["had / saw", "have / see", "haved / seed", "having / seeing"],
        answer: 0,
        explanation: "'Had' est le passé irrégulier de 'have', et 'saw' est le passé irrégulier de 'see'.",
      },
    ],
    quiz: [
      { question: "What is the past tense of 'do'?", options: ["doed", "did", "done", "doing"], answer: 1 },
      { question: "What is the past tense of 'make'?", options: ["maked", "made", "making", "makes"], answer: 1 },
      { question: "What is the past tense of 'see'?", options: ["seed", "saw", "seen", "seeing"], answer: 1 },
      { question: "Complete: 'She ___ (have) a great time yesterday.'", options: ["have", "had", "haved", "having"], answer: 1 },
      { question: "Irregular verbs form their past tense:", options: ["by adding -ed", "with a unique form to memorize", "by adding -ing", "the same way every time"], answer: 1 },
    ],
  },

  l10: {
    summary:
      "Découverte du vocabulaire des lieux dans une ville, pour pouvoir décrire son quartier ou sa ville et demander/donner des directions vers ces endroits.",
    keyPoints: [
      "Lieux dans une ville : hospital, supermarket, library, post office, bank",
      "'There is a + lieu + in my town' pour décrire ce qui existe dans sa ville",
      "'Where is the + lieu?' pour demander où se trouve un endroit",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'hôpital' in English?",
        options: ["hospital", "school", "bank", "library"],
        answer: 0,
        explanation: "'Hospital' est la traduction anglaise de 'hôpital'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'bibliothèque' in English?",
        options: ["bank", "library", "post office", "supermarket"],
        answer: 1,
        explanation: "'Library' est la traduction anglaise de 'bibliothèque'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: '___ a supermarket near my house, but ___ no library.'",
        options: ["There is / there is", "There is / there isn't", "There are / there is", "There isn't / there is"],
        answer: 1,
        explanation: "'There is' (affirmatif, singulier) pour le supermarché, et 'there isn't' (négatif) pour l'absence de bibliothèque.",
      },
    ],
    quiz: [
      { question: "How do you say 'banque' in English?", options: ["bank", "hospital", "school", "library"], answer: 0 },
      { question: "How do you say 'bureau de poste' in English?", options: ["post office", "supermarket", "bank", "hospital"], answer: 0 },
      { question: "How do you ask where a place is?", options: ["Where is the...?", "What is the...?", "How is the...?", "When is the...?"], answer: 0 },
      { question: "How do you say 'supermarché' in English?", options: ["supermarket", "library", "bank", "hospital"], answer: 0 },
      { question: "Complete: '___ many shops in my town.'", options: ["There is", "There are", "There has", "There have"], answer: 1 },
    ],
  },

  l11: {
    summary:
      "Découverte de l'impératif, utilisé pour donner un ordre, une instruction ou un conseil. À la forme affirmative, on utilise directement l'infinitif sans sujet ; à la forme négative, on ajoute 'don't' avant le verbe.",
    keyPoints: [
      "Impératif affirmatif : verbe à l'infinitif sans sujet (Close the door. Sit down.)",
      "Impératif négatif : Don't + verbe (Don't touch that. Don't be late.)",
      "L'impératif s'utilise pour des instructions, des ordres, ou des conseils",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'Ferme la porte !' in English?",
        options: ["Close the door!", "You close the door!", "Closing the door!", "Closed the door!"],
        answer: 0,
        explanation: "L'impératif utilise directement le verbe à l'infinitif : Close the door!",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'Ne cours pas !' in English?",
        options: ["Not run!", "Don't run!", "Doesn't run!", "No running!"],
        answer: 1,
        explanation: "L'impératif négatif se forme avec 'Don't' + verbe : Don't run!",
      },
      {
        difficulty: "difficile",
        question: "Complete the recipe instructions: '___ the eggs, then ___ them into the bowl.'",
        options: ["Take / put", "Taking / putting", "Takes / puts", "Took / put"],
        answer: 0,
        explanation: "Les instructions utilisent l'impératif : Take the eggs, then put them into the bowl.",
      },
    ],
    quiz: [
      { question: "How do you say 'Assieds-toi !' in English?", options: ["Sit down!", "You sit down!", "Sitting down!", "Sat down!"], answer: 0 },
      { question: "How do you say 'Ne parle pas !' in English?", options: ["Not talk!", "Don't talk!", "Doesn't talk!", "No talking!"], answer: 1 },
      { question: "The imperative form uses:", options: ["the infinitive without subject", "the subject + verb", "the past tense", "the -ing form"], answer: 0 },
      { question: "How do you say 'Écoute !' in English?", options: ["Listen!", "You listen!", "Listening!", "Listened!"], answer: 0 },
      { question: "How do you say 'Ne sois pas en retard !' in English?", options: ["Not be late!", "Don't be late!", "Doesn't be late!", "No being late!"], answer: 1 },
    ],
  },

  l12: {
    summary:
      "Découverte du vocabulaire des métiers et professions, avec la structure 'He/She is a + métier' pour parler du métier de quelqu'un, et 'What does he/she do?' pour le demander.",
    keyPoints: [
      "Métiers : doctor, teacher, engineer, farmer, police officer",
      "'He/She is a + métier' (Ex: She is a doctor = Elle est médecin)",
      "'What does he/she do?' = Quel est son métier ?",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'médecin' in English?",
        options: ["teacher", "doctor", "farmer", "engineer"],
        answer: 1,
        explanation: "'Doctor' est la traduction anglaise de 'médecin'.",
      },
      {
        difficulty: "moyen",
        question: "How do you ask about someone's job?",
        options: ["What does he do?", "What is he?", "Who is he?", "Where is he?"],
        answer: 0,
        explanation: "'What does he do?' est la question standard pour demander le métier de quelqu'un.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My uncle ___ (be) an engineer, and he ___ (work) in a big company.'",
        options: ["is / works", "are / work", "am / working", "be / worked"],
        answer: 0,
        explanation: "'Is' (verbe être, 3ème pers. sing.) et 'works' (verbe travailler avec -s pour la 3ème personne) sont corrects ici.",
      },
    ],
    quiz: [
      { question: "How do you say 'agriculteur' in English?", options: ["farmer", "doctor", "teacher", "engineer"], answer: 0 },
      { question: "How do you say 'policier' in English?", options: ["police officer", "doctor", "farmer", "teacher"], answer: 0 },
      { question: "How do you say 'ingénieur' in English?", options: ["engineer", "farmer", "doctor", "teacher"], answer: 0 },
      { question: "Complete: 'She is a ___.' (professeure)", options: ["teacher", "doctor", "farmer", "engineer"], answer: 0 },
      { question: "What does 'What does he do?' ask about?", options: ["son âge", "son métier", "son adresse", "son nom"], answer: 1 },
    ],
  },

  l13: {
    summary:
      "Découverte des verbes modaux 'can' (capacité/permission), 'must' (obligation forte), et 'should' (conseil), qui expriment des nuances de sens différentes et sont suivis directement de l'infinitif sans 'to'.",
    keyPoints: [
      "'Can' exprime la capacité ou la permission : I can swim. Can I go out?",
      "'Must' exprime une obligation forte : You must wear a seatbelt.",
      "'Should' exprime un conseil : You should study more.",
      "Ces verbes modaux sont suivis directement de l'infinitif sans 'to' (can go, must go, should go)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which modal verb expresses ability?",
        options: ["can", "must", "should", "will"],
        answer: 0,
        explanation: "'Can' exprime la capacité de faire quelque chose.",
      },
      {
        difficulty: "moyen",
        question: "Which modal verb expresses strong obligation?",
        options: ["can", "must", "should", "would"],
        answer: 1,
        explanation: "'Must' exprime une obligation forte, presque une règle à suivre.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'You ___ study for your exam, and you ___ swim very well already, so you don't need extra lessons.'",
        options: ["should / can", "must / should", "can / must", "should / should"],
        answer: 0,
        explanation: "'Should' exprime le conseil d'étudier, et 'can' exprime la capacité déjà acquise de bien nager.",
      },
    ],
    quiz: [
      { question: "Which modal verb expresses advice?", options: ["can", "must", "should", "will"], answer: 2 },
      { question: "Complete: 'You ___ wear a seatbelt in the car.' (obligation)", options: ["can", "must", "should", "would"], answer: 1 },
      { question: "Complete: 'I ___ speak three languages.' (capacité)", options: ["can", "must", "should", "would"], answer: 0 },
      { question: "Complete: 'You ___ drink more water.' (conseil)", options: ["can", "must", "should", "will"], answer: 2 },
      { question: "Modal verbs are followed by:", options: ["the infinitive with 'to'", "the infinitive without 'to'", "the -ing form", "the past tense"], answer: 1 },
    ],
  },

  l14: {
    summary:
      "Comparaison entre deux façons d'exprimer le futur : 'going to' pour une intention déjà décidée, et 'will' pour une décision spontanée ou une prédiction générale.",
    keyPoints: [
      "'Going to' : intention déjà planifiée (I am going to visit my grandmother tomorrow — c'est déjà prévu)",
      "'Will' : décision spontanée prise au moment de parler (The phone is ringing, I will answer it)",
      "'Will' s'utilise aussi pour des prédictions générales (It will rain tomorrow)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which structure expresses a planned intention?",
        options: ["going to", "will", "can", "must"],
        answer: 0,
        explanation: "'Going to' s'utilise pour une intention déjà décidée avant le moment de parler.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'The phone is ringing! I ___ (answer) it.' (décision spontanée)",
        options: ["am going to answer", "will answer", "answer", "answered"],
        answer: 1,
        explanation: "'Will answer' convient pour une décision prise à l'instant même, spontanément.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I ___ (visit) my cousin next week; I already bought the train ticket.'",
        options: ["am going to visit", "will visit", "visit", "visited"],
        answer: 0,
        explanation: "'Am going to visit' convient car le billet de train déjà acheté montre que c'est une intention planifiée à l'avance.",
      },
    ],
    quiz: [
      { question: "Which structure is used for a spontaneous decision?", options: ["going to", "will", "can", "must"], answer: 1 },
      { question: "Complete: 'Look at those clouds! It ___ (rain).' (prédiction)", options: ["is going to rain", "will rain", "rains", "rained"], answer: 0 },
      { question: "Complete: 'I ___ (help) you with your bags.' (offre spontanée)", options: ["am going to help", "will help", "help", "helped"], answer: 1 },
      { question: "'Going to' is used for:", options: ["une intention planifiée", "une décision spontanée uniquement", "le passé", "une habitude"], answer: 0 },
      { question: "Complete: 'We ___ (travel) to Paris this summer; we booked our flights already.'", options: ["are going to travel", "will travel", "travel", "traveled"], answer: 0 },
    ],
  },

  l15: {
    summary:
      "Découverte des mots de liaison pour décrire un processus étape par étape : first (d'abord), then (ensuite), next (puis), et finally (enfin), utilisés pour organiser des instructions ou un récit dans l'ordre.",
    keyPoints: [
      "First (d'abord) : introduit la première étape",
      "Then / Next (ensuite / puis) : introduisent les étapes intermédiaires",
      "Finally (enfin) : introduit la dernière étape",
      "Ces mots aident à structurer clairement un processus ou une recette",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which word introduces the first step of a process?",
        options: ["First", "Then", "Next", "Finally"],
        answer: 0,
        explanation: "'First' introduit toujours la première étape.",
      },
      {
        difficulty: "moyen",
        question: "Which word introduces the last step?",
        options: ["First", "Then", "Next", "Finally"],
        answer: 3,
        explanation: "'Finally' introduit la dernière étape d'un processus.",
      },
      {
        difficulty: "difficile",
        question: "Order the steps: 'wake up', 'brush your teeth', 'get dressed', 'eat breakfast' using First/Then/Next/Finally:",
        options: ["First wake up, then brush your teeth, next get dressed, finally eat breakfast", "Finally wake up, first brush your teeth", "The order doesn't matter", "Then wake up, first get dressed"],
        answer: 0,
        explanation: "L'ordre logique d'une routine matinale est : se réveiller, se brosser les dents, s'habiller, puis prendre le petit-déjeuner, marqué par First/then/next/finally.",
      },
    ],
    quiz: [
      { question: "Which word introduces a step in the middle of a process?", options: ["First", "Then", "Finally", "Before"], answer: 1 },
      { question: "How do you say 'd'abord' in English?", options: ["First", "Then", "Next", "Finally"], answer: 0 },
      { question: "How do you say 'enfin' in English?", options: ["First", "Then", "Next", "Finally"], answer: 3 },
      { question: "These words are used to:", options: ["décrire des émotions", "organiser les étapes d'un processus", "poser des questions", "exprimer une négation"], answer: 1 },
      { question: "How do you say 'ensuite' in English?", options: ["First", "Then", "Finally", "Before"], answer: 1 },
    ],
  },

  l16: {
    summary:
      "Découverte du vocabulaire de la technologie et de la communication moderne, pour pouvoir parler des appareils électroniques et des moyens de communication qu'on utilise au quotidien.",
    keyPoints: [
      "Appareils : computer, phone, tablet, television",
      "Communication : call, text message, email, video call",
      "'I use my phone to call my friends' = J'utilise mon téléphone pour appeler mes amis",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'ordinateur' in English?",
        options: ["computer", "phone", "tablet", "television"],
        answer: 0,
        explanation: "'Computer' est la traduction anglaise de 'ordinateur'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'message texte' in English?",
        options: ["email", "text message", "video call", "phone call"],
        answer: 1,
        explanation: "'Text message' est la traduction anglaise de 'message texte' (SMS).",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I usually ___ (send) emails, but yesterday I ___ (make) a video call with my cousin abroad.'",
        options: ["send / made", "sends / make", "sending / making", "sent / make"],
        answer: 0,
        explanation: "'Send' au présent simple (habitude) et 'made' au passé simple (action passée précise) sont corrects.",
      },
    ],
    quiz: [
      { question: "How do you say 'tablette' in English?", options: ["tablet", "computer", "phone", "television"], answer: 0 },
      { question: "How do you say 'courriel' in English?", options: ["text message", "email", "video call", "phone call"], answer: 1 },
      { question: "How do you say 'appel vidéo' in English?", options: ["text message", "email", "video call", "phone call"], answer: 2 },
      { question: "How do you say 'télévision' in English?", options: ["computer", "phone", "tablet", "television"], answer: 3 },
      { question: "Complete: 'I ___ (use) my phone every day.'", options: ["use", "uses", "am using", "used"], answer: 0 },
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