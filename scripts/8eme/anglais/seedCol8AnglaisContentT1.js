// scripts/seedCol8AnglaisContentT1.js
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

// Trimestre 1 — lessons l1 through l8
const LESSON_CONTENT = {
  l1: {
    summary:
      "Approfondissement du vocabulaire pour décrire son école et son emploi du temps quotidien, avec des phrases plus complètes combinant matières, horaires, et activités scolaires.",
    keyPoints: [
      "Vocabulaire : timetable, subject, break, lesson, schoolyard",
      "'My school starts at 8 and finishes at 5.' pour décrire les horaires",
      "'On Mondays, I have Maths, then English, then a break.' pour décrire une journée complète",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'récréation' in English?",
        options: ["break", "lesson", "subject", "schoolyard"],
        answer: 0,
        explanation: "'Break' est la traduction anglaise de 'récréation'.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'My school ___ (start) at 8 o'clock.'",
        options: ["start", "starts", "starting", "started"],
        answer: 1,
        explanation: "3ème personne du singulier au présent simple : starts.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'On Tuesdays, I ___ (have) Science, and after that, we ___ (go) to the schoolyard for a break.'",
        options: ["have / go", "has / goes", "having / going", "had / went"],
        answer: 0,
        explanation: "Les deux verbes sont au présent simple (habitude), à la 1ère personne du pluriel : have et go.",
      },
    ],
    quiz: [
      { question: "How do you say 'cour de récréation' in English?", options: ["schoolyard", "classroom", "timetable", "break"], answer: 0 },
      { question: "How do you say 'emploi du temps' in English?", options: ["timetable", "subject", "break", "schoolyard"], answer: 0 },
      { question: "Complete: 'We ___ (finish) school at 5 pm.'", options: ["finish", "finishes", "finishing", "finished"], answer: 0 },
      { question: "How do you say 'cours' (leçon) in English?", options: ["lesson", "break", "schoolyard", "timetable"], answer: 0 },
      { question: "Complete: 'She ___ (have) Maths every Monday.'", options: ["have", "has", "having", "had"], answer: 1 },
    ],
  },

  l2: {
    summary:
      "Consolidation approfondie de la distinction entre le présent simple (habitudes) et le présent continu (action en cours), avec des exercices combinant les deux temps dans des contextes plus complexes.",
    keyPoints: [
      "Présent simple : habitudes régulières, faits généraux, horaires fixes",
      "Présent continu : action en cours maintenant, ou projet déjà arrangé pour le futur proche",
      "Certains verbes (comme, know, like, want) ne s'utilisent généralement pas au présent continu",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'He ___ (study) English every day.'",
        options: ["study", "studies", "is studying", "studied"],
        answer: 1,
        explanation: "'Every day' indique une habitude : présent simple, 3ème personne : studies.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'I ___ (know) the answer.' (verbe d'état, jamais au continu)",
        options: ["know", "am knowing", "knows", "knew"],
        answer: 0,
        explanation: "'Know' est un verbe d'état, ne s'utilise pas au présent continu : I know.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'We usually ___ (walk) to school, but this week we ___ (take) the bus because it's raining.'",
        options: ["walk / are taking", "are walking / take", "walks / takes", "walked / took"],
        answer: 0,
        explanation: "'Usually' indique une habitude (walk, présent simple), et 'this week' avec le contexte actuel indique le présent continu (are taking).",
      },
    ],
    quiz: [
      { question: "Which verb is rarely used in the continuous form?", options: ["run", "know", "play", "eat"], answer: 1 },
      { question: "Complete: 'They ___ (watch) a film right now.'", options: ["watch", "watches", "are watching", "watched"], answer: 2 },
      { question: "Complete: 'My mother ___ (work) in a hospital.'", options: ["work", "works", "is working", "worked"], answer: 1 },
      { question: "Which time expression suggests present continuous?", options: ["every day", "usually", "right now", "always"], answer: 2 },
      { question: "Complete: 'I ___ (not/understand) this exercise.'", options: ["don't understand", "doesn't understand", "am not understanding", "didn't understand"], answer: 0 },
    ],
  },

  l3: {
    summary:
      "Approfondissement du vocabulaire pour décrire l'apparence physique et la personnalité de façon plus nuancée, avec des adjectifs plus variés et des structures pour comparer des personnes.",
    keyPoints: [
      "Apparence : slim, muscular, freckles, wavy hair",
      "Personnalité : confident, honest, generous, stubborn",
      "'He is more confident than his brother.' pour comparer des traits de personnalité",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'généreux' in English?",
        options: ["generous", "honest", "confident", "stubborn"],
        answer: 0,
        explanation: "'Generous' est la traduction anglaise de 'généreux'.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'têtu' in English?",
        options: ["confident", "stubborn", "generous", "honest"],
        answer: 1,
        explanation: "'Stubborn' est la traduction anglaise de 'têtu'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'My sister is ___ (confident) than me, but I am ___ (honest) than her.'",
        options: ["more confident / more honest", "confidenter / honester", "most confident / most honest", "confident / honest"],
        answer: 0,
        explanation: "'Confident' et 'honest' sont des adjectifs longs, donc leur comparatif utilise 'more' : more confident, more honest.",
      },
    ],
    quiz: [
      { question: "How do you say 'confiant' in English?", options: ["confident", "stubborn", "generous", "shy"], answer: 0 },
      { question: "How do you say 'honnête' in English?", options: ["honest", "stubborn", "confident", "generous"], answer: 0 },
      { question: "How do you say 'mince' in English?", options: ["slim", "muscular", "tall", "short"], answer: 0 },
      { question: "How do you say 'musclé' in English?", options: ["slim", "muscular", "curly", "straight"], answer: 1 },
      { question: "How do you say 'taches de rousseur' in English?", options: ["freckles", "wrinkles", "curls", "dimples"], answer: 0 },
    ],
  },

  l4: {
    summary:
      "Approfondissement du vocabulaire des pays, nationalités, et cultures, avec des structures pour parler des traditions, des langues parlées, et des comparaisons culturelles simples.",
    keyPoints: [
      "'People in + pays + speak + langue' (Ex: People in Tunisia speak Arabic and French.)",
      "'In + pays, people celebrate...' pour parler des traditions culturelles",
      "Adjectifs de nationalité s'écrivent avec une majuscule : Tunisian, French, Japanese",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'People in Tunisia ___ (speak) Arabic.'",
        options: ["speak", "speaks", "speaking", "spoke"],
        answer: 0,
        explanation: "Avec 'people' (pluriel), on utilise 'speak' sans -s au présent simple.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'japonais' (nationalité) in English?",
        options: ["Japan", "Japanese", "Japon", "Japaneese"],
        answer: 1,
        explanation: "'Japanese' est l'adjectif de nationalité pour le Japon.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'In Tunisia, people ___ (celebrate) Eid with their families, and they ___ (eat) traditional food.'",
        options: ["celebrate / eat", "celebrates / eats", "celebrating / eating", "celebrated / ate"],
        answer: 0,
        explanation: "Les deux verbes sont au présent simple (habitude culturelle générale), avec 'people' (pluriel) : celebrate, eat.",
      },
    ],
    quiz: [
      { question: "How do you say 'chinois' (nationalité) in English?", options: ["China", "Chinese", "Chinees", "Chine"], answer: 1 },
      { question: "Nationality adjectives in English start with:", options: ["a lowercase letter", "a capital letter", "a number", "no specific rule"], answer: 1 },
      { question: "How do you say 'traditions' in English?", options: ["traditions", "habits only", "customs only", "cultures only"], answer: 0 },
      { question: "Complete: 'They ___ (speak) English and French.'", options: ["speak", "speaks", "speaking", "spoke"], answer: 0 },
      { question: "How do you say 'égyptien' in English?", options: ["Egypt", "Egyptian", "Egyptean", "Egyptish"], answer: 1 },
    ],
  },

  l5: {
    summary:
      "Découverte du vocabulaire des moyens de transport, pour pouvoir parler de la façon dont on se déplace au quotidien ou en voyage, avec la structure 'by + moyen de transport'.",
    keyPoints: [
      "Moyens de transport : car, bus, train, plane, bicycle, boat, motorbike",
      "'By + moyen de transport' (Ex: I go to school by bus = Je vais à l'école en bus)",
      "Exception : 'on foot' (à pied) n'utilise pas 'by'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you say 'aller à l'école en bus' in English?",
        options: ["go to school by bus", "go to school with bus", "go to school in bus", "go to school on bus"],
        answer: 0,
        explanation: "'By bus' est la structure correcte pour indiquer le moyen de transport.",
      },
      {
        difficulty: "moyen",
        question: "How do you say 'à pied' in English?",
        options: ["by foot", "on foot", "with foot", "in foot"],
        answer: 1,
        explanation: "'On foot' est l'exception : on ne dit pas 'by foot'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'I usually go to school ___ bus, but yesterday I went ___ foot because the bus was late.'",
        options: ["by / on", "on / by", "by / by", "on / on"],
        answer: 0,
        explanation: "'By bus' pour le bus, et 'on foot' pour la marche (exception à la règle 'by').",
      },
    ],
    quiz: [
      { question: "How do you say 'avion' in English?", options: ["plane", "boat", "train", "bicycle"], answer: 0 },
      { question: "How do you say 'vélo' in English?", options: ["car", "bicycle", "motorbike", "boat"], answer: 1 },
      { question: "How do you say 'bateau' in English?", options: ["boat", "plane", "train", "car"], answer: 0 },
      { question: "Complete: 'She goes to work ___ car.'", options: ["by", "on", "with", "in"], answer: 0 },
      { question: "How do you say 'moto' in English?", options: ["bicycle", "motorbike", "car", "train"], answer: 1 },
    ],
  },

  l6: {
    summary:
      "Découverte des prépositions de mouvement, qui décrivent une direction ou un déplacement : to (vers), into (à l'intérieur de), through (à travers), across (en traversant).",
    keyPoints: [
      "'To' indique une destination : She goes to school.",
      "'Into' indique un mouvement vers l'intérieur : He walked into the room.",
      "'Through' indique un passage à travers : We walked through the forest.",
      "'Across' indique une traversée : They swam across the river.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complete: 'She walked ___ the room.' (entra dans la pièce)",
        options: ["into", "through", "across", "to"],
        answer: 0,
        explanation: "'Into' indique un mouvement vers l'intérieur d'un lieu.",
      },
      {
        difficulty: "moyen",
        question: "Complete: 'We swam ___ the river.' (traversèrent la rivière)",
        options: ["into", "through", "across", "to"],
        answer: 2,
        explanation: "'Across' indique une traversée d'un côté à l'autre.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'The train went ___ the tunnel, then it arrived ___ the station.'",
        options: ["through / at", "into / to", "across / at", "to / through"],
        answer: 0,
        explanation: "'Through' pour le passage à travers le tunnel, et 'at' pour l'arrivée à un point précis (la gare).",
      },
    ],
    quiz: [
      { question: "How do you say 'à travers' (passage) in English?", options: ["through", "into", "across", "to"], answer: 0 },
      { question: "Which preposition indicates entering a space?", options: ["into", "across", "through", "to"], answer: 0 },
      { question: "Which preposition indicates crossing from one side to another?", options: ["into", "across", "through", "to"], answer: 1 },
      { question: "Complete: 'He walked ___ the door.' (entra)", options: ["into", "across", "through", "to"], answer: 0 },
      { question: "Complete: 'They walked ___ the bridge.' (traversèrent)", options: ["into", "across", "through", "to"], answer: 1 },
    ],
  },

  l7: {
    summary:
      "Découverte des structures pour demander et donner des informations personnelles de façon plus formelle, comme lors d'un entretien ou pour remplir un formulaire (nom, date de naissance, adresse, numéro de téléphone).",
    keyPoints: [
      "'What is your full name?' / 'When were you born?' / 'What is your address?'",
      "Vocabulaire de formulaire : date of birth, address, phone number, nationality",
      "Réponses formelles : 'My full name is...' / 'I was born on...'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "How do you ask for someone's full name?",
        options: ["What is your full name?", "What is your name?", "Who are you?", "How are you?"],
        answer: 0,
        explanation: "'What is your full name?' est la question formelle pour demander le nom complet.",
      },
      {
        difficulty: "moyen",
        question: "How do you ask for someone's date of birth?",
        options: ["When were you born?", "How old are you?", "What is your birthday cake?", "Where are you?"],
        answer: 0,
        explanation: "'When were you born?' est la question formelle pour demander la date de naissance.",
      },
      {
        difficulty: "difficile",
        question: "Complete this form-filling dialogue: 'What is your ___?' — 'I live at 12 Habib Bourguiba Street.'",
        options: ["address", "phone number", "nationality", "date of birth"],
        answer: 0,
        explanation: "La réponse ('12 Habib Bourguiba Street') est une adresse, donc la question porte sur 'address'.",
      },
    ],
    quiz: [
      { question: "How do you say 'numéro de téléphone' in English?", options: ["phone number", "address", "date of birth", "full name"], answer: 0 },
      { question: "How do you say 'adresse' in English?", options: ["address", "phone number", "nationality", "date of birth"], answer: 0 },
      { question: "How do you ask for someone's nationality?", options: ["What is your nationality?", "How old are you?", "Where are you?", "What is your name?"], answer: 0 },
      { question: "Complete: 'I ___ (be) born on 5th May 2010.'", options: ["am", "was", "were", "is"], answer: 1 },
      { question: "How do you say 'formulaire' in English?", options: ["form", "letter", "book", "paper"], answer: 0 },
    ],
  },

  l8: {
    summary:
      "Approfondissement du passé simple avec les verbes irréguliers, en couvrant un plus grand nombre de verbes fréquents et en pratiquant leur usage dans des phrases variées pour raconter des événements passés.",
    keyPoints: [
      "Verbes irréguliers supplémentaires : take/took, give/gave, write/wrote, drive/drove",
      "Chaque verbe irrégulier a une forme unique à mémoriser directement",
      "Le passé simple s'utilise pour une action précise et terminée dans le passé",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "What is the past tense of 'take'?",
        options: ["taked", "took", "taken", "taking"],
        answer: 1,
        explanation: "'Took' est le passé irrégulier de 'take'.",
      },
      {
        difficulty: "moyen",
        question: "What is the past tense of 'write'?",
        options: ["writed", "wrote", "written", "writing"],
        answer: 1,
        explanation: "'Wrote' est le passé irrégulier de 'write'.",
      },
      {
        difficulty: "difficile",
        question: "Complete: 'Yesterday, she ___ (give) me a gift, and I ___ (write) her a thank-you note.'",
        options: ["gave / wrote", "give / write", "gives / writes", "giving / writing"],
        answer: 0,
        explanation: "'Gave' (passé de give) et 'wrote' (passé de write) sont les formes irrégulières correctes.",
      },
    ],
    quiz: [
      { question: "What is the past tense of 'drive'?", options: ["drived", "drove", "driven", "driving"], answer: 1 },
      { question: "What is the past tense of 'give'?", options: ["gived", "gave", "given", "giving"], answer: 1 },
      { question: "What is the past tense of 'take'?", options: ["taked", "took", "taken", "taking"], answer: 1 },
      { question: "Complete: 'He ___ (drive) to Sousse last weekend.'", options: ["drive", "drove", "drives", "driving"], answer: 1 },
      { question: "What is the past tense of 'write'?", options: ["writed", "wrote", "written", "writing"], answer: 1 },
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