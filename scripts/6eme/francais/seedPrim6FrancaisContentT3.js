// scripts/seedPrim6FrancaisContentT3.js
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

// Trimestre 3 — lessons l13 through l17
// (l13: complément de temps, l14: verbes usuels passé composé/futur,
//  l15: accord adjectifs neuf/gentil/beau/bon, l16: complément de manière,
//  l17: accord participe passé avec être)
const LESSON_CONTENT = {
  l13: {
    summary:
      "Le complément de temps (complément circonstanciel de temps) indique quand se déroule l'action exprimée par le verbe. Il répond à la question 'quand ?' et peut être introduit par diverses expressions ou prépositions.",
    keyPoints: [
      "Le complément de temps répond à la question 'quand ?'",
      "Il peut être un simple adverbe (hier, demain, toujours) ou un groupe nominal (le matin, la semaine prochaine)",
      "Il peut généralement être déplacé dans la phrase sans en changer le sens global",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Il part demain', quel est le complément de temps ?",
        options: ["Il", "part", "demain", "aucun"],
        answer: 2,
        explanation: "'Demain' répond à la question 'quand ?', c'est le complément de temps.",
      },
      {
        difficulty: "moyen",
        question: "Quelle question pose-t-on pour trouver un complément de temps ?",
        options: ["Où ?", "Quand ?", "Comment ?", "Pourquoi ?"],
        answer: 1,
        explanation: "Le complément de temps répond toujours à la question 'quand ?'.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Chaque matin, elle court dans le parc pendant une heure', identifie les compléments circonstanciels et leurs types :",
        options: ["'Chaque matin' (temps), 'dans le parc' (lieu), 'pendant une heure' (temps)", "seulement 'dans le parc' (lieu)", "aucun complément circonstanciel", "'elle court' est le seul complément"],
        answer: 0,
        explanation: "La phrase contient trois compléments circonstanciels : 'Chaque matin' (temps, quand ?), 'dans le parc' (lieu, où ?), et 'pendant une heure' (temps, durée).",
      },
    ],
    quiz: [
      { question: "Le complément de temps répond à :", options: ["où ?", "quand ?", "comment ?", "pourquoi ?"], answer: 1 },
      { question: "Quel mot est un complément de temps ?", options: ["ici", "hier", "vite", "beaucoup"], answer: 1 },
      { question: "Dans 'Nous partirons la semaine prochaine', quel est le complément de temps ?", options: ["Nous", "partirons", "la semaine prochaine", "aucun"], answer: 2 },
      { question: "Le complément de temps peut-il être déplacé dans la phrase ?", options: ["oui, généralement", "non, jamais", "cela rend toujours la phrase incorrecte", "aucune de ces réponses"], answer: 0 },
      { question: "Dans 'Il pleut souvent en hiver', quel est le complément de temps ?", options: ["Il", "pleut souvent", "en hiver", "aucun"], answer: 2 },
    ],
  },

  l14: {
    summary:
      "Consolidation de la conjugaison des verbes usuels (des trois groupes confondus) au passé composé et au futur simple, pour renforcer l'aisance à passer d'un verbe à l'autre selon le temps demandé, en vue de l'examen.",
    keyPoints: [
      "Rappel : passé composé = auxiliaire (être/avoir) au présent + participe passé",
      "Rappel : futur simple = radical (souvent l'infinitif) + terminaisons -ai, -as, -a, -ons, -ez, -ont",
      "Les verbes usuels courants à maîtriser : être, avoir, aller, faire, prendre, mettre, finir, parler, voir, dire",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au passé composé : Je ___ (voir) un beau film.",
        options: ["ai vu", "voyais", "verrai", "vois"],
        answer: 0,
        explanation: "Passé composé de 'voir' : j'ai vu.",
      },
      {
        difficulty: "moyen",
        question: "Complète au futur : Elle ___ (dire) la vérité.",
        options: ["dit", "dira", "a dit", "disait"],
        answer: 1,
        explanation: "Futur simple de 'dire' : elle dira.",
      },
      {
        difficulty: "difficile",
        question: "Complète au passé composé et au futur : 'Hier, nous ___ (parler) au directeur, et demain nous lui ___ (parler) encore.'",
        options: ["avons parlé / parlerons", "parlions / parlerons", "avons parlé / parlions", "parlerons / avons parlé"],
        answer: 0,
        explanation: "'Hier' impose le passé composé (avons parlé), et 'demain' impose le futur (parlerons).",
      },
    ],
    quiz: [
      { question: "Complète au passé composé : Tu ___ (dire) merci.", options: ["as dit", "disais", "diras", "dis"], answer: 0 },
      { question: "Complète au futur : Nous ___ (voir) nos amis.", options: ["voyons", "verrons", "avons vu", "voyions"], answer: 1 },
      { question: "Quel est le participe passé de 'dire' ?", options: ["dit", "disé", "disant", "dira"], answer: 0 },
      { question: "Quel est le participe passé de 'voir' ?", options: ["voyu", "vu", "voyant", "verra"], answer: 1 },
      { question: "Complète au futur : Ils ___ (parler) à leurs parents.", options: ["parlent", "parleront", "ont parlé", "parlaient"], answer: 1 },
    ],
  },

  l15: {
    summary:
      "Certains adjectifs suivent des règles particulières d'accord en genre et en nombre, comme neuf/neuve, gentil/gentille, beau/belle, et bon/bonne, qui ne suivent pas la règle générale du simple ajout de -e au féminin.",
    keyPoints: [
      "Neuf → neuve (le f devient v) : une voiture neuve",
      "Gentil → gentille (doublement de la consonne + e) : une fille gentille",
      "Beau → belle (changement complet) : une belle robe",
      "Bon → bonne (doublement de la consonne + e) : une bonne idée",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel est le féminin de 'neuf' (adjectif) ?",
        options: ["neuve", "neufe", "neuffe", "neuf"],
        answer: 0,
        explanation: "'Neuf' devient 'neuve' au féminin (le f se transforme en v).",
      },
      {
        difficulty: "moyen",
        question: "Quel est le féminin de 'gentil' ?",
        options: ["gentile", "gentille", "gentil", "gentiye"],
        answer: 1,
        explanation: "'Gentil' double sa consonne finale et ajoute -e : gentille.",
      },
      {
        difficulty: "difficile",
        question: "Accorde correctement : 'une ___ (beau) voiture ___ (neuf)'",
        options: ["belle / neuve", "beau / neuf", "belle / neuf", "beau / neuve"],
        answer: 0,
        explanation: "'Voiture' est féminin singulier, donc les deux adjectifs s'accordent au féminin : belle voiture neuve.",
      },
    ],
    quiz: [
      { question: "Quel est le féminin de 'beau' ?", options: ["beau", "beaue", "belle", "beauve"], answer: 2 },
      { question: "Quel est le féminin de 'bon' ?", options: ["bone", "bonne", "bon", "bonte"], answer: 1 },
      { question: "Complète : une idée ___ (bon)", options: ["bon", "bonne", "bone", "bons"], answer: 1 },
      { question: "Complète : une ___ (gentil) maîtresse", options: ["gentil", "gentille", "gentile", "gentills"], answer: 1 },
      { question: "Complète : des chaussures ___ (neuf)", options: ["neuf", "neuve", "neuves", "neufs"], answer: 2 },
    ],
  },

  l16: {
    summary:
      "Le complément de manière (complément circonstanciel de manière) indique comment se déroule l'action exprimée par le verbe. Il répond à la question 'comment ?' et est souvent formé d'un adverbe en -ment ou d'un groupe prépositionnel.",
    keyPoints: [
      "Le complément de manière répond à la question 'comment ?'",
      "Souvent formé d'un adverbe en -ment : rapidement, doucement, joyeusement",
      "Peut aussi être un groupe prépositionnel : avec joie, sans bruit",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Il court rapidement', quel est le complément de manière ?",
        options: ["Il", "court", "rapidement", "aucun"],
        answer: 2,
        explanation: "'Rapidement' répond à la question 'comment ?', c'est le complément de manière.",
      },
      {
        difficulty: "moyen",
        question: "Quelle question pose-t-on pour trouver un complément de manière ?",
        options: ["Où ?", "Quand ?", "Comment ?", "Pourquoi ?"],
        answer: 2,
        explanation: "Le complément de manière répond toujours à la question 'comment ?'.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Elle a répondu avec politesse à la question', quel est le complément de manière ?",
        options: ["Elle", "a répondu", "avec politesse", "à la question"],
        answer: 2,
        explanation: "'Avec politesse' est un groupe prépositionnel qui répond à 'comment ?', c'est le complément de manière (tandis que 'à la question' est un COI).",
      },
    ],
    quiz: [
      { question: "Le complément de manière répond à :", options: ["où ?", "quand ?", "comment ?", "pourquoi ?"], answer: 2 },
      { question: "Quel mot est un complément de manière ?", options: ["hier", "doucement", "ici", "beaucoup"], answer: 1 },
      { question: "Dans 'Il parle calmement', quel est le complément de manière ?", options: ["Il", "parle", "calmement", "aucun"], answer: 2 },
      { question: "Un complément de manière peut être formé par un adverbe se terminant en :", options: ["-tion", "-ment", "-eux", "-able"], answer: 1 },
      { question: "Dans 'Elle chante avec joie', quel est le complément de manière ?", options: ["Elle", "chante", "avec joie", "aucun"], answer: 2 },
    ],
  },

  l17: {
    summary:
      "Lorsqu'un verbe est conjugué au passé composé avec l'auxiliaire être, le participe passé s'accorde toujours en genre et en nombre avec le sujet, contrairement à l'auxiliaire avoir où l'accord suit d'autres règles.",
    keyPoints: [
      "Avec l'auxiliaire être, le participe passé s'accorde avec le sujet : il est allé / elle est allée / ils sont allés / elles sont allées",
      "L'accord se fait en ajoutant -e (féminin), -s (pluriel), ou -es (féminin pluriel) selon le sujet",
      "Cette règle concerne les verbes de mouvement (aller, venir, partir, arriver...) et les verbes pronominaux",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Accorde : Elle est ___ (aller) au marché.",
        options: ["allé", "allée", "allés", "allées"],
        answer: 1,
        explanation: "Le sujet 'Elle' est féminin singulier, le participe passé s'accorde : allée.",
      },
      {
        difficulty: "moyen",
        question: "Accorde : Ils sont ___ (partir) tôt ce matin.",
        options: ["parti", "partie", "partis", "parties"],
        answer: 2,
        explanation: "Le sujet 'Ils' est masculin pluriel, le participe passé s'accorde : partis.",
      },
      {
        difficulty: "difficile",
        question: "Accorde : Mes sœurs sont ___ (arriver) en retard.",
        options: ["arrivé", "arrivée", "arrivés", "arrivées"],
        answer: 3,
        explanation: "Le sujet 'Mes sœurs' est féminin pluriel, le participe passé s'accorde avec les deux marques : arrivées.",
      },
    ],
    quiz: [
      { question: "Avec l'auxiliaire être, le participe passé s'accorde avec :", options: ["le COD", "le sujet", "rien", "le complément de lieu"], answer: 1 },
      { question: "Accorde : Il est ___ (venir).", options: ["venu", "venue", "venus", "venues"], answer: 0 },
      { question: "Accorde : Elles sont ___ (rester) à la maison.", options: ["resté", "restée", "restés", "restées"], answer: 3 },
      { question: "Accorde : Nous sommes ___ (arriver). (groupe de filles)", options: ["arrivé", "arrivée", "arrivés", "arrivées"], answer: 3 },
      { question: "Quels verbes utilisent généralement l'auxiliaire être ?", options: ["tous les verbes", "les verbes de mouvement et pronominaux", "seulement les verbes du 1er groupe", "aucun verbe"], answer: 1 },
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