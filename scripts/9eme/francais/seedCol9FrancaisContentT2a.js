// scripts/seedCol9FrancaisContentT2a.js
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
const SUBJECT_ID = "francais";

// Trimestre 2, part A — lessons l13 through l18 (Module 3)
// Titles confirmed from the real textbook's tableau synoptique. Content
// reconstructed — NOT verified against actual textbook pages.
const LESSON_CONTENT = {
  l13: {
    summary:
      "Le texte informatif du Module 3 (« Raison et émotions ») vise à transmettre des faits et informations de façon claire et objective. Préparer et conduire une interview implique de définir un objectif, formuler des questions structurées, et savoir relancer la discussion pour obtenir des réponses complètes.",
    keyPoints: [
      "Le texte informatif privilégie la clarté, l'objectivité, et une structure logique (souvent chronologique ou thématique)",
      "Conduire une interview : poser des questions ouvertes pour obtenir des réponses développées, et savoir relancer si besoin",
      "Distinguer les informations factuelles des commentaires ou opinions personnelles de l'interviewé",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Un texte informatif privilégie :",
        options: ["la clarté et l'objectivité", "les émotions personnelles de l'auteur", "des figures de style complexes", "aucune structure particulière"],
        answer: 0,
        explanation: "Le texte informatif cherche avant tout à transmettre des faits clairement et objectivement.",
      },
      {
        difficulty: "moyen",
        question: "Qu'est-ce qu'une question ouverte lors d'une interview ?",
        options: ["une question qui invite à une réponse développée", "une question qui se répond par oui ou non uniquement", "une question sans rapport avec le sujet", "une question qu'on ne pose jamais"],
        answer: 0,
        explanation: "Une question ouverte encourage l'interviewé à développer sa réponse, contrairement à une question fermée.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi est-il utile de préparer des questions de relance avant une interview ?",
        options: ["parce que l'interviewé peut donner une réponse incomplète, et une relance permet d'approfondir ou de clarifier sans dévier du sujet principal", "les relances ne servent à rien lors d'une interview", "il ne faut jamais interrompre l'interviewé, même pour clarifier", "les questions de relance remplacent toujours la question initiale"],
        answer: 0,
        explanation: "Les questions de relance permettent d'obtenir des précisions ou des développements supplémentaires lorsque la première réponse est incomplète ou trop générale.",
      },
    ],
    quiz: [
      { question: "Une question fermée se répond par :", options: ["oui ou non", "un développement long", "plusieurs paragraphes", "aucune réponse possible"], answer: 0 },
      { question: "Le texte informatif privilégie une structure :", options: ["claire et logique", "aléatoire", "purement poétique", "sans aucun ordre"], answer: 0 },
      { question: "Une question de relance sert à :", options: ["approfondir ou clarifier une réponse", "changer complètement de sujet", "terminer l'interview", "éviter toute réponse"], answer: 0 },
      { question: "'Raison et émotions' comme centre d'intérêt suggère un thème lié à :", options: ["l'exploit et la performance humaine", "uniquement la météo", "uniquement les objets", "aucun thème particulier"], answer: 0 },
      { question: "Dans un texte informatif, il faut distinguer :", options: ["les faits des opinions", "les adjectifs des verbes uniquement", "les majuscules des minuscules", "rien de particulier"], answer: 0 },
    ],
  },

  l14: {
    summary:
      "Les procédés de reprise (pronoms, synonymes, périphrases) évitent la répétition d'un même mot dans un texte. Les pronoms personnels COD (le, la, les) et COI (lui, leur) remplacent respectivement un complément d'objet direct ou indirect. La forme passive met en avant l'objet de l'action plutôt que l'agent.",
    keyPoints: [
      "Procédés de reprise : pronom (il/elle), synonyme, périphrase (cet homme → ce grand voyageur)",
      "Pronoms COD : le, la, les (Je le vois. / Je les invite.)",
      "Pronoms COI : lui, leur (Je lui parle. / Je leur écris.)",
      "Forme passive : sujet + être + participe passé (+ par + agent) — La lettre est envoyée par Sami.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Je vois Sami. Je ___ salue.', quel pronom convient ?",
        options: ["le", "lui", "leur", "la"],
        answer: 0,
        explanation: "'Sami' est un COD (je salue Sami), donc on utilise 'le' pour le remplacer.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Je parle à mes parents. Je ___ parle souvent.', quel pronom convient ?",
        options: ["leur", "les", "le", "la"],
        answer: 0,
        explanation: "'À mes parents' est un COI, donc on utilise 'leur' pour le remplacer.",
      },
      {
        difficulty: "difficile",
        question: "Transforme à la voix passive : 'Le jury a récompensé les meilleurs candidats.'",
        options: ["Les meilleurs candidats ont été récompensés par le jury.", "Le jury récompense.", "Les candidats récompensent le jury.", "Le jury a été récompensé."],
        answer: 0,
        explanation: "À la voix passive, l'objet (les candidats) devient sujet : Les meilleurs candidats ont été récompensés par le jury.",
      },
    ],
    quiz: [
      { question: "Quel pronom remplace un COD féminin singulier ?", options: ["la", "le", "lui", "leur"], answer: 0 },
      { question: "Quel pronom remplace un COI pluriel ?", options: ["leur", "les", "la", "le"], answer: 0 },
      { question: "Un procédé de reprise sert à :", options: ["éviter la répétition d'un mot", "compliquer le texte", "changer le sens du texte", "rien de particulier"], answer: 0 },
      { question: "La voix passive utilise l'auxiliaire :", options: ["être", "avoir", "aller", "faire"], answer: 0 },
      { question: "Le complément d'agent dans une phrase passive est introduit par :", options: ["par", "de", "à", "pour"], answer: 0 },
    ],
  },

  l15: {
    summary:
      "Le futur simple exprime une action à venir (je partirai), tandis que le futur antérieur exprime une action future qui sera achevée avant une autre action future (quand j'aurai fini, je partirai). Le futur antérieur se forme avec l'auxiliaire au futur simple + participe passé.",
    keyPoints: [
      "Futur simple : radical + terminaisons -ai, -as, -a, -ons, -ez, -ont (je finirai)",
      "Futur antérieur : auxiliaire (être/avoir) au futur simple + participe passé (j'aurai fini, elle sera partie)",
      "Le futur antérieur marque l'antériorité par rapport à une autre action future (Quand tu arriveras, j'aurai déjà terminé.)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au futur simple : Demain, je ___ (partir) tôt.",
        options: ["partirai", "suis parti", "partais", "pars"],
        answer: 0,
        explanation: "Futur simple de 'partir' à la 1ère personne : partirai.",
      },
      {
        difficulty: "moyen",
        question: "Complète au futur antérieur : Quand elle ___ (finir) son travail, elle sortira.",
        options: ["aura fini", "finira", "a fini", "finissait"],
        answer: 0,
        explanation: "Futur antérieur de 'finir' (auxiliaire avoir au futur + participe passé) : aura fini.",
      },
      {
        difficulty: "difficile",
        question: "Complète en respectant l'antériorité future : 'Dès que nous ___ (arriver), nous vous ___ (appeler).'",
        options: ["serons arrivés / appellerons", "arriverons / appellerons", "arrivons / appelons", "sommes arrivés / appelons"],
        answer: 0,
        explanation: "'Serons arrivés' (futur antérieur, action accomplie en premier) et 'appellerons' (futur simple, action qui suit).",
      },
    ],
    quiz: [
      { question: "Comment se forme le futur antérieur ?", options: ["auxiliaire au futur simple + participe passé", "radical + terminaisons du futur", "auxiliaire au présent + participe passé", "infinitif seul"], answer: 0 },
      { question: "Complète au futur simple : Nous ___ (voir) ce film.", options: ["verrons", "voyons", "avons vu", "voyions"], answer: 0 },
      { question: "Complète au futur antérieur : Tu ___ (manger) avant de sortir.", options: ["auras mangé", "mangeras", "as mangé", "mangeais"], answer: 0 },
      { question: "Le futur antérieur exprime :", options: ["une action future achevée avant une autre action future", "une action présente", "une habitude passée", "un ordre"], answer: 0 },
      { question: "Complète au futur antérieur : Ils ___ (partir) avant notre arrivée.", options: ["seront partis", "partiront", "sont partis", "partaient"], answer: 0 },
    ],
  },

  l16: {
    summary:
      "Les homophones « quand » (conjonction de temps ou adverbe interrogatif), « quant » (toujours suivi de 'à', signifiant 'en ce qui concerne'), et « qu'en » (que + pronom 'en') se distinguent par leur fonction grammaticale et le contexte de la phrase.",
    keyPoints: [
      "Quand : exprime le temps (Quand pars-tu ? / Quand il pleut, je reste chez moi.)",
      "Quant à : signifie 'en ce qui concerne' (Quant à moi, je préfère rester.)",
      "Qu'en : que + pronom 'en' (Je pense qu'en travaillant bien, tu réussiras. / Qu'en penses-tu ?)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : '___ pars-tu en vacances ?'",
        options: ["Quand", "Quant", "Qu'en", "Quands"],
        answer: 0,
        explanation: "'Quand' interroge sur le moment du départ.",
      },
      {
        difficulty: "moyen",
        question: "Complète : '___ à moi, je reste ici.'",
        options: ["Quant", "Quand", "Qu'en", "Quants"],
        answer: 0,
        explanation: "'Quant à moi' signifie 'en ce qui me concerne', toujours suivi de 'à'.",
      },
      {
        difficulty: "difficile",
        question: "Complète : '___ penses-tu de ce projet ?'",
        options: ["Qu'en", "Quand", "Quant", "Qu'ent"],
        answer: 0,
        explanation: "'Qu'en penses-tu ?' = que + en (pronom), signifiant 'quelle est ton opinion à ce sujet ?'.",
      },
    ],
    quiz: [
      { question: "Complète : '___ il fait beau, nous sortons.'", options: ["Quand", "Quant", "Qu'en", "Quands"], answer: 0 },
      { question: "Complète : '___ à cette question, je n'ai pas de réponse.'", options: ["Quant", "Quand", "Qu'en", "Quants"], answer: 0 },
      { question: "'Quant à' est toujours suivi de :", options: ["à", "de", "en", "pour"], answer: 0 },
      { question: "'Qu'en' contient le pronom :", options: ["en", "le", "lui", "y"], answer: 0 },
      { question: "Complète : 'Je sais ___ tu es capable de réussir.'", options: ["qu'en", "quand", "quant", "qu'ent"], answer: 0 },
    ],
  },

  l17: {
    summary:
      "Produire un texte informatif ou rédiger un article de presse nécessite une structure claire (titre accrocheur, chapô résumant l'essentiel, corps développant les informations), une objectivité dans le ton, et l'utilisation de sources ou citations pour appuyer les faits rapportés.",
    keyPoints: [
      "Structure d'un article de presse : titre, chapô (résumé introductif), corps de l'article",
      "Répondre aux questions clés : qui, quoi, où, quand, comment, pourquoi",
      "Le ton reste objectif ; les opinions sont attribuées clairement à leurs sources",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel élément résume l'essentiel d'un article dès le début ?",
        options: ["le chapô", "la conclusion", "les dernières lignes", "aucun élément particulier"],
        answer: 0,
        explanation: "Le chapô est le court paragraphe introductif qui résume l'essentiel de l'article.",
      },
      {
        difficulty: "moyen",
        question: "Quelles questions un article de presse doit-il typiquement répondre ?",
        options: ["qui, quoi, où, quand, comment, pourquoi", "seulement pourquoi", "aucune question précise", "seulement combien"],
        answer: 0,
        explanation: "Ces six questions (souvent appelées les 5W+H en anglais) structurent l'information essentielle d'un article.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi un article de presse doit-il attribuer clairement les opinions à leurs sources plutôt que les présenter comme des faits ?",
        options: ["pour maintenir l'objectivité du texte informatif et permettre au lecteur de distinguer ce qui est vérifiable de ce qui relève du jugement personnel d'une personne citée", "les opinions n'ont jamais leur place dans un article de presse", "il est interdit de citer qui que ce soit dans un article", "les faits et les opinions sont toujours identiques"],
        answer: 0,
        explanation: "Attribuer clairement une opinion à sa source (par exemple, 'selon X') préserve l'objectivité du texte informatif, en distinguant les faits vérifiables des jugements personnels rapportés.",
      },
    ],
    quiz: [
      { question: "Le titre d'un article doit être :", options: ["accrocheur et informatif", "toujours très long", "sans rapport avec le contenu", "invisible"], answer: 0 },
      { question: "Un article de presse doit rester :", options: ["objectif dans le ton", "toujours subjectif", "sans structure", "uniquement une opinion personnelle"], answer: 0 },
      { question: "Le corps de l'article sert à :", options: ["développer les informations en détail", "résumer en une phrase", "remplacer le titre", "rien de particulier"], answer: 0 },
      { question: "Attribuer une opinion à sa source permet de :", options: ["préserver l'objectivité du texte", "cacher l'information", "compliquer inutilement le texte", "remplacer les faits"], answer: 0 },
      { question: "Le chapô se situe :", options: ["juste après le titre, avant le corps de l'article", "à la toute fin de l'article", "avant le titre", "nulle part en particulier"], answer: 0 },
    ],
  },

  l18: {
    summary:
      "Le texte argumentatif du Module 4 (« Regards sur la société d'aujourd'hui ») vise à défendre une thèse à l'aide d'arguments et d'exemples, dans un contexte de débat sur des questions de société. Participer à une discussion ou un débat implique d'écouter les autres points de vue, structurer son propos, et réagir avec des contre-arguments pertinents.",
    keyPoints: [
      "Le texte argumentatif défend une thèse, appuyée par des arguments et exemples concrets",
      "Participer à un débat : écouter, structurer son argumentation, répondre avec des contre-arguments pertinents",
      "Le thème 'Métiers d'hier, métiers d'aujourd'hui' invite à réfléchir sur l'évolution du monde du travail",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Le texte argumentatif a pour but de :",
        options: ["défendre une thèse avec des arguments", "raconter une histoire au passé", "décrire un paysage", "donner une recette"],
        answer: 0,
        explanation: "Le texte argumentatif cherche à convaincre le lecteur en défendant un point de vue (la thèse) à l'aide d'arguments.",
      },
      {
        difficulty: "moyen",
        question: "Lors d'un débat, un contre-argument sert à :",
        options: ["répondre à un argument opposé de façon pertinente", "ignorer complètement l'autre point de vue", "changer de sujet", "répéter son propre argument sans réagir"],
        answer: 0,
        explanation: "Un contre-argument permet de répondre directement et logiquement à un argument avancé par l'interlocuteur.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi est-il important d'écouter attentivement les autres points de vue avant de réagir dans un débat ?",
        options: ["parce que cela permet de formuler un contre-argument précis et pertinent, plutôt que de répondre à côté du véritable propos de l'interlocuteur", "l'écoute n'a aucune utilité dans un débat", "il faut toujours répondre avant d'avoir entendu l'argument complet", "les débats ne nécessitent jamais d'écoute véritable"],
        answer: 0,
        explanation: "Écouter attentivement permet de comprendre précisément l'argument de l'autre, et donc de formuler une réponse ciblée et pertinente plutôt qu'une réaction générale ou hors-sujet.",
      },
    ],
    quiz: [
      { question: "La thèse dans un texte argumentatif est :", options: ["l'opinion principale défendue", "un exemple concret", "une description", "la conclusion uniquement"], answer: 0 },
      { question: "'Regards sur la société d'aujourd'hui' suggère un thème :", options: ["social et contemporain", "purement historique", "sans rapport avec la société", "uniquement scientifique"], answer: 0 },
      { question: "Un bon débatteur doit :", options: ["écouter et structurer son argumentation", "ignorer les autres participants", "répéter la même phrase", "éviter tout argument"], answer: 0 },
      { question: "'Métiers d'hier, métiers d'aujourd'hui' invite à réfléchir sur :", options: ["l'évolution du monde du travail", "uniquement la météo", "uniquement les couleurs", "aucun thème précis"], answer: 0 },
      { question: "Un contre-argument doit être :", options: ["pertinent par rapport à l'argument initial", "sans rapport avec le débat", "toujours une insulte", "impossible à formuler"], answer: 0 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 2, part A)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});