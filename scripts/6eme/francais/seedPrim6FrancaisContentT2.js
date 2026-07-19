// scripts/seedPrim6FrancaisContentT2.js
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
const SUBJECT_ID = "francais";

// Trimestre 2 — lessons l8 through l12
const LESSON_CONTENT = {
  l8: {
    summary:
      "Les compléments essentiels (COD, COI) ne peuvent généralement pas être supprimés ou déplacés sans rendre la phrase incorrecte ou changer son sens, contrairement aux compléments non essentiels (compléments circonstanciels) qui peuvent souvent l'être.",
    keyPoints: [
      "Complément essentiel (COD, COI) : indispensable au sens du verbe, difficile à supprimer — Il mange une pomme.",
      "Complément non essentiel (circonstanciel) : ajoute une précision, peut souvent être supprimé ou déplacé — Il mange une pomme le matin.",
      "Test : si on peut enlever le complément sans rendre la phrase bizarre, il est probablement non essentiel",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Il mange une pomme', 'une pomme' est un complément :",
        options: ["essentiel", "non essentiel", "aucun des deux", "un sujet"],
        answer: 0,
        explanation: "'Une pomme' est un COD, essentiel car on ne peut pas dire simplement 'Il mange' avec le même sens complet.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Il mange une pomme le matin', 'le matin' est un complément :",
        options: ["essentiel", "non essentiel", "aucun des deux", "un COD"],
        answer: 1,
        explanation: "'Le matin' peut être supprimé (Il mange une pomme) sans rendre la phrase incorrecte, c'est un complément non essentiel.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi 'une pomme' dans 'Il mange une pomme' est-il essentiel alors que 'le matin' ne l'est pas ?",
        options: ["'une pomme' complète le sens du verbe 'manger' (on mange quelque chose), tandis que 'le matin' n'ajoute qu'une précision de temps facultative", "les deux sont également essentiels", "'le matin' est plus important grammaticalement", "il n'y a pas de différence réelle"],
        answer: 0,
        explanation: "Le COD complète directement le sens du verbe transitif, alors que le complément circonstanciel de temps donne juste une information supplémentaire non indispensable.",
      },
    ],
    quiz: [
      { question: "Un complément essentiel peut-il être supprimé facilement ?", options: ["oui, toujours", "non, généralement pas sans changer le sens", "cela dépend du jour", "oui, sans aucun problème"], answer: 1 },
      { question: "Le COD est un complément :", options: ["essentiel", "non essentiel", "toujours facultatif", "jamais nécessaire"], answer: 0 },
      { question: "Les compléments circonstanciels sont généralement :", options: ["essentiels", "non essentiels", "impossibles à identifier", "toujours au début de la phrase"], answer: 1 },
      { question: "Dans 'Elle lit un livre dans le salon', quel complément est non essentiel ?", options: ["un livre", "dans le salon", "les deux", "aucun"], answer: 1 },
      { question: "Dans 'Elle lit un livre', peut-on supprimer 'un livre' sans changer le sens ?", options: ["oui facilement", "non, cela change le sens", "cela n'a pas d'importance", "oui, toujours"], answer: 1 },
    ],
  },

  l9: {
    summary:
      "Conjugaison des verbes usuels du type 'prendre' et 'mettre' (3ème groupe, irréguliers) au passé composé et au futur simple, deux verbes très fréquents dans la langue courante.",
    keyPoints: [
      "Prendre : participe passé 'pris' — j'ai pris, tu as pris... Futur : je prendrai, tu prendras...",
      "Mettre : participe passé 'mis' — j'ai mis, tu as mis... Futur : je mettrai, tu mettras...",
      "Ces verbes du 3ème groupe ont des formes irrégulières à mémoriser directement",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au passé composé : J'___ (prendre) mon petit-déjeuner.",
        options: ["ai pris", "prenais", "prendrai", "prends"],
        answer: 0,
        explanation: "Passé composé de 'prendre' à la 1ère personne : j'ai pris.",
      },
      {
        difficulty: "moyen",
        question: "Complète au futur : Nous ___ (mettre) la table dans une heure.",
        options: ["mettons", "mettrons", "avons mis", "mettions"],
        answer: 1,
        explanation: "Futur simple de 'mettre' à la 1ère personne du pluriel : nous mettrons.",
      },
      {
        difficulty: "difficile",
        question: "Complète au passé composé : Elle ___ (prendre) de bonnes décisions.",
        options: ["a pris", "prenait", "prendra", "prend"],
        answer: 0,
        explanation: "Passé composé de 'prendre' : elle a pris.",
      },
    ],
    quiz: [
      { question: "Quel est le participe passé de 'prendre' ?", options: ["pris", "prendu", "prenant", "prendra"], answer: 0 },
      { question: "Quel est le participe passé de 'mettre' ?", options: ["mettu", "mis", "mettant", "mettra"], answer: 1 },
      { question: "Complète au futur : Tu ___ (prendre) le bus.", options: ["prends", "prendras", "as pris", "prenais"], answer: 1 },
      { question: "Complète au passé composé : Ils ___ (mettre) leurs chaussures.", options: ["ont mis", "mettaient", "mettront", "mettent"], answer: 0 },
      { question: "Complète au futur : Vous ___ (mettre) vos manteaux.", options: ["mettez", "mettrez", "avez mis", "mettiez"], answer: 1 },
    ],
  },

  l10: {
    summary:
      "Le verbe s'accorde toujours en personne et en nombre avec son sujet. Cet accord peut devenir plus complexe avec des sujets composés (deux sujets reliés par 'et'), des sujets inversés, ou des sujets éloignés du verbe.",
    keyPoints: [
      "Règle de base : le verbe prend la terminaison correspondant à la personne et au nombre du sujet",
      "Sujet composé (deux noms reliés par 'et') : le verbe se met au pluriel — Sami et Amira jouent.",
      "Même avec un sujet éloigné du verbe par un groupe de mots, l'accord reste avec le vrai sujet",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Le chat ___ (dormir) sur le canapé.",
        options: ["dort", "dorment", "dors", "dormons"],
        answer: 0,
        explanation: "'Le chat' est singulier, le verbe s'accorde à la 3ème personne du singulier : dort.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Mon frère et ma sœur ___ (aimer) le chocolat.",
        options: ["aime", "aiment", "aimes", "aimons"],
        answer: 1,
        explanation: "Sujet composé (deux personnes reliées par 'et') = pluriel : ils aiment.",
      },
      {
        difficulty: "difficile",
        question: "Complète : Les enfants de ma voisine ___ (jouer) dans le jardin.",
        options: ["joue", "joues", "jouent", "jouons"],
        answer: 2,
        explanation: "Le vrai sujet est 'Les enfants' (pluriel), même si 'de ma voisine' s'intercale ; l'accord se fait avec 'les enfants' : ils jouent.",
      },
    ],
    quiz: [
      { question: "Le verbe s'accorde avec :", options: ["le complément", "le sujet", "l'adjectif", "rien de particulier"], answer: 1 },
      { question: "Complète : Les oiseaux ___ (chanter) le matin.", options: ["chante", "chantent", "chantes", "chantons"], answer: 1 },
      { question: "Un sujet composé de deux noms reliés par 'et' donne un accord :", options: ["singulier", "pluriel", "cela dépend", "aucun accord"], answer: 1 },
      { question: "Complète : Le livre que j'ai acheté ___ (être) intéressant.", options: ["est", "sont", "es", "êtes"], answer: 0 },
      { question: "Complète : Sami et son ami ___ (partir) en vacances.", options: ["part", "partent", "pars", "partons"], answer: 1 },
    ],
  },

  l11: {
    summary:
      "Le complément de lieu (complément circonstanciel de lieu) indique où se déroule l'action exprimée par le verbe. Il répond à la question 'où ?' et peut être introduit par diverses prépositions (dans, sur, à, chez...).",
    keyPoints: [
      "Le complément de lieu répond à la question 'où ?'",
      "Il est souvent introduit par une préposition : dans, sur, à, chez, devant, derrière",
      "Il peut généralement être déplacé ou supprimé sans rendre la phrase incorrecte",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Il dort dans sa chambre', quel est le complément de lieu ?",
        options: ["Il", "dort", "dans sa chambre", "aucun"],
        answer: 2,
        explanation: "'Dans sa chambre' répond à la question 'où ?', c'est le complément de lieu.",
      },
      {
        difficulty: "moyen",
        question: "Quelle question pose-t-on pour trouver un complément de lieu ?",
        options: ["Quand ?", "Où ?", "Comment ?", "Pourquoi ?"],
        answer: 1,
        explanation: "Le complément de lieu répond toujours à la question 'où ?'.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Nous mangeons chez ma grand-mère tous les dimanches', combien y a-t-il de compléments circonstanciels, et lequel est le complément de lieu ?",
        options: ["2 compléments; 'chez ma grand-mère' est le complément de lieu", "1 seul complément", "'tous les dimanches' est le complément de lieu", "aucun complément de lieu"],
        answer: 0,
        explanation: "Il y a deux compléments circonstanciels : 'chez ma grand-mère' (lieu, répond à où ?) et 'tous les dimanches' (temps, répond à quand ?).",
      },
    ],
    quiz: [
      { question: "Le complément de lieu répond à :", options: ["où ?", "quand ?", "comment ?", "pourquoi ?"], answer: 0 },
      { question: "Quelle préposition introduit souvent un complément de lieu ?", options: ["dans", "hier", "vite", "beaucoup"], answer: 0 },
      { question: "Dans 'Elle habite à Tunis', quel est le complément de lieu ?", options: ["Elle", "habite", "à Tunis", "aucun"], answer: 2 },
      { question: "Le complément de lieu peut-il souvent être déplacé dans la phrase ?", options: ["oui", "non, jamais", "cela rend toujours la phrase incorrecte", "aucune de ces réponses"], answer: 0 },
      { question: "Dans 'Le chat se cache sous le lit', quel est le complément de lieu ?", options: ["Le chat", "se cache", "sous le lit", "aucun"], answer: 2 },
    ],
  },

  l12: {
    summary:
      "Conjugaison des verbes irréguliers 'aller' et 'faire' au passé composé (aller utilise l'auxiliaire être, faire utilise avoir) et au futur simple (radicaux irréguliers ir- et fer-).",
    keyPoints: [
      "Aller au passé composé (avec être) : je suis allé(e), tu es allé(e), il est allé, elle est allée...",
      "Faire au passé composé (avec avoir) : j'ai fait, tu as fait, il a fait...",
      "Aller au futur : j'irai, tu iras, il ira, nous irons, vous irez, ils iront",
      "Faire au futur : je ferai, tu feras, il fera, nous ferons, vous ferez, ils feront",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au passé composé : Je ___ (aller) à l'école.",
        options: ["suis allé(e)", "ai allé", "vais", "irai"],
        answer: 0,
        explanation: "'Aller' utilise l'auxiliaire être au passé composé : je suis allé(e).",
      },
      {
        difficulty: "moyen",
        question: "Complète au futur : Nous ___ (faire) un gâteau demain.",
        options: ["faisons", "ferons", "avons fait", "faisions"],
        answer: 1,
        explanation: "Futur simple de 'faire' à la 1ère personne du pluriel : nous ferons.",
      },
      {
        difficulty: "difficile",
        question: "Complète au passé composé : Elles ___ (aller) au marché ce matin.",
        options: ["sont allées", "ont allé", "vont", "iront"],
        answer: 0,
        explanation: "'Aller' au passé composé avec être, accordé au féminin pluriel car le sujet 'elles' est féminin : elles sont allées.",
      },
    ],
    quiz: [
      { question: "Quel auxiliaire utilise 'aller' au passé composé ?", options: ["avoir", "être", "aucun", "les deux au choix"], answer: 1 },
      { question: "Quel auxiliaire utilise 'faire' au passé composé ?", options: ["avoir", "être", "aucun", "les deux au choix"], answer: 0 },
      { question: "Complète au futur : Tu ___ (aller) chez ton ami.", options: ["vas", "iras", "es allé", "allais"], answer: 1 },
      { question: "Complète au passé composé : Ils ___ (faire) leurs devoirs.", options: ["ont fait", "faisaient", "feront", "font"], answer: 0 },
      { question: "Complète au futur : Elle ___ (faire) la cuisine.", options: ["fait", "fera", "a fait", "faisait"], answer: 1 },
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