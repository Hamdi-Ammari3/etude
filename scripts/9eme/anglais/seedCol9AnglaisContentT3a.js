// scripts/seedCol9AnglaisContentT3a.js
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

// Trimestre 3, part A — lessons l21 through l25 (Module 5: Entertainment).
// Grammar points and functions confirmed from the real textbook synopsis.
// Content reconstructed to teach that specific grammar — NOT verified
// against actual textbook exercises/texts.
const LESSON_CONTENT = {
  l21: {
    summary:
      "Le thème 'Means of entertainment' explore les divertissements modernes, avec les expressions pour exprimer l'incertitude ('maybe', 'perhaps') et la certitude ('I'm sure', 'no doubt' + proposition déclarative).",
    keyPoints: [
      "Incertitude : maybe, perhaps (Maybe we'll go to the cinema.)",
      "Certitude : I'm sure that..., no doubt + declarative sentence (No doubt this film will be a success.)",
      "Vocabulaire : disc-based, e-books, to take over, a walk-in cinema, to interrupt, giant, dolby system",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which word expresses uncertainty?",
        options: ["maybe", "definitely", "certainly", "surely"],
        answer: 0,
        explanation: "'Maybe' exprime l'incertitude, une possibilité non confirmée.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'I'm sure ___ this new cinema will be amazing.'",
        options: ["that", "if", "whether", "no"],
        answer: 0,
        explanation: "'I'm sure that + proposition déclarative' exprime la certitude.",
      },
      {
        difficulty: "difficile",
        question: "Complete: '___ e-books will completely replace paper books one day.'",
        options: ["No doubt", "Maybe not sure", "Uncertain", "Perhaps not"],
        answer: 0,
        explanation: "'No doubt' introduit une affirmation exprimant une forte certitude sur l'avenir des livres électroniques.",
      },
    ],
    quiz: [
      { question: "How do you say 'livres électroniques' in English?", options: ["e-books", "paper books", "audiobooks", "comic books"], answer: 0 },
      { question: "How do you say 'interrompre' in English?", options: ["to interrupt", "to continue", "to start", "to finish"], answer: 0 },
      { question: "How do you say 'géant' in English?", options: ["giant", "tiny", "small", "average"], answer: 0 },
      { question: "Which expression shows certainty?", options: ["I'm sure that", "maybe", "perhaps", "I'm not sure"], answer: 0 },
      { question: "How do you say 'prendre le dessus/remplacer' in English?", options: ["to take over", "to take off", "to take out", "to take away"], answer: 0 },
    ],
  },

  l22: {
    summary:
      "Le thème 'Eating out' porte sur les repas au restaurant, avec les exclamations (What a...!, How nice to...!) et les expressions de satisfaction (This is just what I wanted/needed/meant).",
    keyPoints: [
      "Exclamation avec 'What' : What a surprise! / What a delicious meal!",
      "Exclamation avec 'How' : How nice to see you here!",
      "Expression de satisfaction : This is just what I wanted/needed/meant.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete this exclamation: '___ delicious meal!'",
        options: ["What a", "How a", "What", "How"],
        answer: 0,
        explanation: "'What a + adjectif + nom' forme une exclamation : What a delicious meal!",
      },
      {
        difficulty: "moyen",
        question: "Complete: '___ nice to see this restaurant again!'",
        options: ["How", "What a", "What", "How a"],
        answer: 0,
        explanation: "'How + adjectif' forme une exclamation : How nice to see this restaurant again!",
      },
      {
        difficulty: "difficile",
        question: "Complete this expression of satisfaction after trying a dish: 'This is just what I ___.'",
        options: ["wanted", "want (present, less natural here)", "will want", "am wanting"],
        answer: 0,
        explanation: "'This is just what I wanted' exprime la satisfaction, généralement au passé pour évoquer une attente comblée.",
      },
    ],
    quiz: [
      { question: "How do you say 'diète/coca light' in English?", options: ["diet coke", "regular coke", "juice", "water"], answer: 0 },
      { question: "How do you say 'décider' in English?", options: ["to make up one's mind", "to decide against", "to undecided", "to mind up"], answer: 0 },
      { question: "How do you say 'ail' in English?", options: ["garlic", "onion", "pepper", "salt"], answer: 0 },
      { question: "How do you say 'assaisonnement (vinaigrette)' in English?", options: ["dressing", "topping", "sauce only", "spice"], answer: 0 },
      { question: "Which exclamation pattern uses 'What'?", options: ["What a + adjective + noun!", "How + adjective!", "So + adjective!", "Such + noun!"], answer: 0 },
    ],
  },

  l23: {
    summary:
      "Le thème 'Where shall we go?' propose des suggestions d'activités, avec les structures 'Shall we + verbe', 'I suggest that + clause', et 'Why don't we...?'.",
    keyPoints: [
      "'Shall we + verbe' : suggestion (Shall we go to the beach?)",
      "'I suggest that + clause' : suggestion plus formelle (I suggest that we visit the museum.)",
      "'Why don't we...?' : suggestion informelle (Why don't we watch a film tonight?)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: '___ we go to the cinema tonight?' (suggestion)",
        options: ["Shall", "Do", "Are", "Will always"],
        answer: 0,
        explanation: "'Shall we + verbe' est la structure de suggestion classique.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'Why don't ___ visit the new water park?'",
        options: ["we", "us", "our", "ourselves"],
        answer: 0,
        explanation: "'Why don't we + verbe' est la structure correcte pour une suggestion informelle.",
      },
      {
        difficulty: "difficile",
        question: "Complete a more formal suggestion: 'I suggest ___ we book the tickets in advance.'",
        options: ["that", "if", "for", "to"],
        answer: 0,
        explanation: "'I suggest that + proposition' introduit une suggestion plus formelle.",
      },
    ],
    quiz: [
      { question: "How do you say 'acrobates' in English?", options: ["acrobats", "swimmers", "dancers", "singers"], answer: 0 },
      { question: "How do you say 'planche à voile' in English?", options: ["windsurf", "surfboard", "kayak", "canoe"], answer: 0 },
      { question: "How do you say 'toboggans nautiques' in English?", options: ["water slides", "swimming pools", "water parks (general)", "fountains"], answer: 0 },
      { question: "Which structure suggests an activity informally?", options: ["Why don't we...?", "I must...", "You should never...", "I refuse to..."], answer: 0 },
      { question: "How do you say 'exotique' in English?", options: ["exotic", "ordinary", "boring", "typical"], answer: 0 },
    ],
  },

  l24: {
    summary:
      "Le thème 'Let's watch a film!' aborde le cinéma, avec les expressions de regret : 'I'm so/very sorry that + clause' et 'I regret + (noun/Ving)'.",
    keyPoints: [
      "'I'm so/very sorry that + clause' : regret (I'm so sorry that we missed the beginning.)",
      "'I regret + noun/Ving' : regret plus formel (I regret missing that film. / I regret my decision.)",
      "Vocabulaire : to take away, fish tank, to come across, a shark, to run away",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'I'm so sorry ___ we arrived late for the movie.'",
        options: ["that", "if", "for", "to"],
        answer: 0,
        explanation: "'I'm so sorry that + proposition' exprime le regret.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'I regret ___ (miss) the beginning of the film.'",
        options: ["missing", "to miss", "missed", "miss"],
        answer: 0,
        explanation: "'Regret + Ving' est la structure correcte pour exprimer un regret sur une action.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I regret ___ that we didn't book tickets earlier; the show was sold out.'",
        options: ["to say", "saying (less appropriate for this formal announcement)", "say", "said"],
        answer: 0,
        explanation: "'I regret to say that...' est une expression figée utilisée pour annoncer une mauvaise nouvelle avec regret formel.",
      },
    ],
    quiz: [
      { question: "How do you say 'emporter (nourriture)' in English?", options: ["to take away", "to bring in", "to leave behind", "to give back"], answer: 0 },
      { question: "How do you say 'requin' in English?", options: ["shark", "fish", "whale", "dolphin"], answer: 0 },
      { question: "How do you say 's'enfuir' in English?", options: ["to run away", "to run into", "to run out", "to run over"], answer: 0 },
      { question: "How do you say 'rencontrer par hasard' in English?", options: ["to come across", "to come round", "to come in", "to come back"], answer: 0 },
      { question: "'I regret' can be followed by:", options: ["a gerund (Ving)", "only a noun", "only 'that' clauses", "never followed by anything"], answer: 0 },
    ],
  },

  l25: {
    summary:
      "Le thème 'Stars pastimes' explore les loisirs de célébrités, avec les expressions pour montrer l'intérêt ('I'd like to know about...', 'I'm interested in...') et l'indifférence ('I don't mind', 'I don't care').",
    keyPoints: [
      "Montrer l'intérêt : I'd like to know about..., I'm interested in...",
      "Montrer l'indifférence : I don't mind, I don't care",
      "Vocabulaire : lyrics, award, skateboarding, a single, a yacht",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Which expression shows interest?",
        options: ["I'm interested in...", "I don't care", "I don't mind", "Whatever"],
        answer: 0,
        explanation: "'I'm interested in...' montre clairement l'intérêt pour un sujet.",
      },
      {
        difficulty: "moyen",
        question: "Which expression shows indifference?",
        options: ["I don't mind", "I'm very interested", "I'd love to know", "That's fascinating"],
        answer: 0,
        explanation: "'I don't mind' exprime l'indifférence, un manque de préférence marquée.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I'd like to know ___ this singer's new album.'",
        options: ["about", "for", "of", "at"],
        answer: 0,
        explanation: "'I'd like to know about + sujet' est la structure correcte pour exprimer l'intérêt à en savoir plus.",
      },
    ],
    quiz: [
      { question: "How do you say 'paroles (chanson)' in English?", options: ["lyrics", "melody", "rhythm", "beat"], answer: 0 },
      { question: "How do you say 'récompense/prix' in English?", options: ["award", "penalty", "fine", "loss"], answer: 0 },
      { question: "How do you say 'yacht' in English?", options: ["yacht", "boat (generic)", "ship (generic)", "canoe"], answer: 0 },
      { question: "How do you say 'single (chanson)' in English?", options: ["a single", "an album", "a playlist", "a concert"], answer: 0 },
      { question: "Which phrase expresses indifference?", options: ["I don't care", "I'm fascinated", "I'd love to know", "That's so interesting"], answer: 0 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 3, part A)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});