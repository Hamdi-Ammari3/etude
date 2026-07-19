// scripts/seedCol8FrancaisContentT2.js
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
const SUBJECT_ID = "francais";

// Trimestre 2 — lessons l9 through l16
const LESSON_CONTENT = {
  l9: {
    summary:
      "Le texte argumentatif défend une thèse (opinion principale) à l'aide d'arguments (idées qui soutiennent cette thèse) et d'exemples concrets, dans le but de convaincre ou persuader le lecteur.",
    keyPoints: [
      "La thèse : l'opinion ou le point de vue défendu dans le texte",
      "Les arguments : les raisons qui soutiennent la thèse",
      "Les exemples : illustrations concrètes qui renforcent chaque argument",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Qu'est-ce que la thèse dans un texte argumentatif ?",
        options: ["l'opinion principale défendue", "un exemple concret", "une figure de style", "la conclusion uniquement"],
        answer: 0,
        explanation: "La thèse est l'opinion ou le point de vue central que le texte cherche à défendre.",
      },
      {
        difficulty: "moyen",
        question: "Quel est le rôle d'un argument dans un texte argumentatif ?",
        options: ["décorer le texte", "soutenir la thèse par une raison logique", "raconter une histoire", "décrire un lieu"],
        answer: 1,
        explanation: "Un argument est une raison logique qui appuie et justifie la thèse défendue.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi les exemples concrets sont-ils importants dans un texte argumentatif ?",
        options: ["ils rendent les arguments plus convaincants en les illustrant par des faits ou des situations réelles et vérifiables", "ils n'ont aucune utilité réelle", "ils remplacent complètement les arguments", "ils compliquent inutilement le texte"],
        answer: 0,
        explanation: "Les exemples concrets ancrent les arguments abstraits dans la réalité, les rendant plus crédibles et plus persuasifs pour le lecteur.",
      },
    ],
    quiz: [
      { question: "Le but d'un texte argumentatif est de :", options: ["convaincre ou persuader", "raconter une histoire", "décrire un paysage", "donner une recette"], answer: 0 },
      { question: "Un argument doit être soutenu par :", options: ["un exemple concret", "rien de particulier", "une négation", "une question"], answer: 0 },
      { question: "La thèse se trouve généralement :", options: ["au début ou clairement énoncée dans le texte", "cachée et jamais énoncée", "seulement à la fin sans lien avec le reste", "absente du texte argumentatif"], answer: 0 },
      { question: "Combien d'éléments principaux structure un texte argumentatif ?", options: ["thèse, arguments, exemples", "seulement des dialogues", "seulement une description", "aucun élément structuré"], answer: 0 },
      { question: "Un bon argument est :", options: ["logique et pertinent par rapport à la thèse", "sans rapport avec le sujet", "toujours une question", "toujours une négation"], answer: 0 },
    ],
  },

  l10: {
    summary:
      "Les connecteurs logiques structurent l'argumentation en reliant les idées : cependant/mais (opposition), donc/par conséquent (conséquence), en effet (explication ou justification), et d'abord/ensuite/enfin (organisation chronologique des arguments).",
    keyPoints: [
      "Opposition : cependant, mais, toutefois, néanmoins",
      "Conséquence : donc, par conséquent, ainsi",
      "Explication/justification : en effet, car",
      "Organisation : d'abord, ensuite, enfin, de plus",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel connecteur exprime l'opposition ?",
        options: ["cependant", "donc", "en effet", "d'abord"],
        answer: 0,
        explanation: "'Cependant' introduit une idée qui s'oppose à ce qui précède.",
      },
      {
        difficulty: "moyen",
        question: "Quel connecteur exprime une conséquence ?",
        options: ["mais", "par conséquent", "en effet", "toutefois"],
        answer: 1,
        explanation: "'Par conséquent' introduit le résultat logique de ce qui précède.",
      },
      {
        difficulty: "difficile",
        question: "Dans la phrase 'Le sport est bénéfique pour la santé ; en effet, il renforce le cœur et les muscles', quel est le rôle de 'en effet' ?",
        options: ["il introduit une justification/explication de l'affirmation précédente", "il introduit une opposition", "il introduit une conséquence", "il n'a aucun rôle logique"],
        answer: 0,
        explanation: "'En effet' introduit ici une explication qui justifie l'affirmation initiale (le sport est bénéfique), en donnant les raisons concrètes.",
      },
    ],
    quiz: [
      { question: "Quel connecteur organise chronologiquement les arguments ?", options: ["d'abord", "cependant", "en effet", "donc"], answer: 0 },
      { question: "Quel connecteur exprime l'opposition ?", options: ["ainsi", "toutefois", "en effet", "donc"], answer: 1 },
      { question: "Quel connecteur exprime une conséquence ?", options: ["mais", "cependant", "ainsi", "en effet"], answer: 2 },
      { question: "Les connecteurs logiques servent à :", options: ["structurer et relier les idées entre elles", "rien de particulier", "remplacer les verbes", "supprimer la ponctuation"], answer: 0 },
      { question: "Quel connecteur introduit une justification ?", options: ["car", "mais", "donc", "cependant"], answer: 0 },
    ],
  },

  l11: {
    summary:
      "Les propositions subordonnées circonstancielles de but (introduites par pour que, afin que) expriment l'objectif d'une action, tandis que celles d'opposition (introduites par bien que, quoique) expriment un contraste ou une concession.",
    keyPoints: [
      "But : pour que, afin que — suivies du subjonctif — répond à 'dans quel but ?'",
      "Opposition/concession : bien que, quoique — suivies du subjonctif — exprime un contraste",
      "Exemple but : Il travaille dur pour qu'il réussisse. Exemple opposition : Bien qu'il soit fatigué, il continue.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle conjonction exprime le but ?",
        options: ["afin que", "bien que", "quoique", "puisque"],
        answer: 0,
        explanation: "'Afin que' introduit le but ou l'objectif d'une action.",
      },
      {
        difficulty: "moyen",
        question: "Quelle conjonction exprime l'opposition/concession ?",
        options: ["pour que", "bien que", "afin que", "parce que"],
        answer: 1,
        explanation: "'Bien que' introduit une opposition ou une concession.",
      },
      {
        difficulty: "difficile",
        question: "Complète et identifie le type : 'Il sort sans manteau, ___ il fasse très froid.'",
        options: ["bien qu' — opposition/concession", "afin qu' — but", "parce qu' — cause", "donc — conséquence"], 
        answer: 0,
        explanation: "'Bien qu'il fasse très froid' exprime une opposition/concession : il sort sans manteau malgré le froid.",
      },
    ],
    quiz: [
      { question: "La subordonnée de but répond à :", options: ["dans quel but ?", "pourquoi ?", "quand ?", "comment ?"], answer: 0 },
      { question: "Quel mode suit 'afin que' ?", options: ["le subjonctif", "l'indicatif", "l'impératif", "le conditionnel"], answer: 0 },
      { question: "Quelle conjonction exprime l'opposition ?", options: ["quoique", "afin que", "pour que", "parce que"], answer: 0 },
      { question: "Complète : 'Il étudie beaucoup ___ il réussisse.' (but)", options: ["pour que", "bien que", "parce que", "donc"], answer: 0 },
      { question: "Complète : '___ il soit jeune, il est très sage.' (opposition)", options: ["Bien qu'", "Afin qu'", "Parce qu'", "Puisqu'"], answer: 0 },
    ],
  },

  l12: {
    summary:
      "Le conditionnel passé exprime une action qui aurait pu se produire dans le passé mais qui ne s'est pas réalisée (un regret ou un reproche), ou une supposition sur le passé. Il se forme avec l'auxiliaire être/avoir au conditionnel présent, suivi du participe passé.",
    keyPoints: [
      "Formation : auxiliaire au conditionnel présent + participe passé (j'aurais mangé, elle serait partie)",
      "Usage : regret ou reproche sur une action non réalisée (J'aurais dû étudier plus.)",
      "Usage : supposition sur le passé, souvent avec 'si + plus-que-parfait' (Si j'avais su, je serais venu.)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au conditionnel passé : J'___ (aimer) venir, mais je n'ai pas pu.",
        options: ["aime", "aimerais", "aurais aimé", "aimais"],
        answer: 2,
        explanation: "Conditionnel passé : aurais (conditionnel présent de avoir) + aimé (participe passé).",
      },
      {
        difficulty: "moyen",
        question: "Complète : Si tu m'avais appelé, je ___ (venir) t'aider.",
        options: ["viens", "viendrai", "serais venu(e)", "venais"],
        answer: 2,
        explanation: "Avec 'si + plus-que-parfait', on utilise le conditionnel passé dans la principale : serais venu(e).",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase exprime un regret avec le conditionnel passé ?",
        options: ["J'aurais dû réviser davantage.", "Je révise davantage.", "Je réviserai davantage.", "Je révisais davantage."],
        answer: 0,
        explanation: "'J'aurais dû réviser davantage' exprime un regret sur une action passée non réalisée, typique du conditionnel passé.",
      },
    ],
    quiz: [
      { question: "Le conditionnel passé exprime souvent :", options: ["un regret sur une action non réalisée", "une habitude présente", "un ordre", "une question"], answer: 0 },
      { question: "Comment se forme le conditionnel passé ?", options: ["auxiliaire au conditionnel présent + participe passé", "radical + terminaisons du futur", "infinitif seul", "auxiliaire au présent + participe passé"], answer: 0 },
      { question: "Complète : Elle ___ (pouvoir) réussir si elle avait essayé.", options: ["peut", "pourra", "aurait pu", "pouvait"], answer: 2 },
      { question: "Complète : Nous ___ (partir) plus tôt si nous avions su.", options: ["partons", "partirons", "serions partis", "partions"], answer: 2 },
      { question: "Le conditionnel passé s'utilise souvent avec :", options: ["si + plus-que-parfait", "si + présent", "si + futur", "si + conditionnel"], answer: 0 },
    ],
  },

  l13: {
    summary:
      "La voix passive transforme une phrase active en mettant en avant l'objet de l'action plutôt que le sujet qui l'accomplit. Elle se forme avec l'auxiliaire être + participe passé, et l'agent (celui qui fait l'action) est introduit par 'par'.",
    keyPoints: [
      "Phrase active : Le chat mange la souris. → Phrase passive : La souris est mangée par le chat.",
      "Formation : sujet + être (au temps voulu) + participe passé (+ par + agent)",
      "Le complément d'agent (introduit par 'par') n'est pas toujours exprimé",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Transforme à la voix passive : 'Le professeur corrige les copies.'",
        options: ["Les copies sont corrigées par le professeur.", "Le professeur corrige.", "Les copies corrigent le professeur.", "Le professeur est corrigé."],
        answer: 0,
        explanation: "À la voix passive, l'objet (les copies) devient sujet : Les copies sont corrigées par le professeur.",
      },
      {
        difficulty: "moyen",
        question: "Quelle est la structure de la voix passive ?",
        options: ["sujet + être + participe passé (+ par + agent)", "sujet + avoir + participe passé", "sujet + verbe seul", "sujet + verbe + COD"],
        answer: 0,
        explanation: "La voix passive utilise l'auxiliaire être suivi du participe passé, avec un complément d'agent optionnel introduit par 'par'.",
      },
      {
        difficulty: "difficile",
        question: "Transforme à la voix active : 'La lettre a été envoyée par Sami.'",
        options: ["Sami a envoyé la lettre.", "La lettre envoie Sami.", "Sami est envoyé par la lettre.", "La lettre a envoyé Sami."],
        answer: 0,
        explanation: "À la voix active, l'agent (Sami) redevient sujet, et l'objet (la lettre) redevient COD : Sami a envoyé la lettre.",
      },
    ],
    quiz: [
      { question: "La voix passive met en avant :", options: ["l'objet de l'action", "toujours l'agent", "rien de particulier", "seulement le verbe"], answer: 0 },
      { question: "Quel auxiliaire utilise la voix passive ?", options: ["avoir", "être", "aller", "faire"], answer: 1 },
      { question: "Le complément d'agent est introduit par :", options: ["par", "de", "à", "pour"], answer: 0 },
      { question: "Transforme à la voix passive : 'Le vent a cassé la branche.'", options: ["La branche a été cassée par le vent.", "Le vent casse.", "La branche casse le vent.", "Le vent est cassé."], answer: 0 },
      { question: "Le complément d'agent est-il toujours obligatoire à la voix passive ?", options: ["non, il peut être omis", "oui, toujours obligatoire", "jamais présent", "seulement au passé"], answer: 0 },
    ],
  },

  l14: {
    summary:
      "Le lexique de l'argumentation regroupe des mots et expressions utiles pour défendre une opinion : verbes d'opinion (penser, estimer, considérer), expressions pour introduire un argument (tout d'abord, de plus), et pour nuancer (certes, néanmoins).",
    keyPoints: [
      "Verbes d'opinion : penser, estimer, considérer, croire, affirmer",
      "Expressions pour introduire un argument : tout d'abord, de plus, en outre",
      "Expressions pour nuancer : certes... mais, il est vrai que... cependant",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel verbe exprime une opinion ?",
        options: ["courir", "estimer", "manger", "dormir"],
        answer: 1,
        explanation: "'Estimer' est un verbe d'opinion, utilisé pour exprimer un point de vue.",
      },
      {
        difficulty: "moyen",
        question: "Quelle expression introduit un argument supplémentaire ?",
        options: ["de plus", "cependant", "car", "donc"],
        answer: 0,
        explanation: "'De plus' ajoute un argument supplémentaire à ceux déjà énoncés.",
      },
      {
        difficulty: "difficile",
        question: "Quelle structure permet de nuancer une opinion en reconnaissant un point de vue opposé ?",
        options: ["certes... mais", "d'abord... ensuite", "parce que... donc", "si... alors"],
        answer: 0,
        explanation: "'Certes... mais' permet de concéder un point à l'opposition avant de réaffirmer sa propre position, une technique argumentative de nuance.",
      },
    ],
    quiz: [
      { question: "Quel verbe exprime une opinion ?", options: ["penser", "sauter", "chanter", "dessiner"], answer: 0 },
      { question: "Quelle expression introduit le premier argument ?", options: ["tout d'abord", "cependant", "enfin", "donc"], answer: 0 },
      { question: "Quelle expression ajoute un argument ?", options: ["en outre", "mais", "or", "pourtant"], answer: 0 },
      { question: "Le lexique de l'argumentation sert à :", options: ["défendre une opinion de façon organisée", "raconter une histoire", "décrire un paysage", "rien de particulier"], answer: 0 },
      { question: "Quel verbe exprime une opinion ferme ?", options: ["affirmer", "sauter", "courir", "dormir"], answer: 0 },
    ],
  },

  l15: {
    summary:
      "La nominalisation avancée transforme un verbe ou un adjectif en nom en utilisant des suffixes variés (-tion, -ment, -ité, -age), une technique utile pour condenser l'information et varier le style, notamment dans l'argumentation.",
    keyPoints: [
      "Suffixes de nominalisation : -tion (décider→décision), -ment (changer→changement), -ité (rapide→rapidité), -age (nettoyer→nettoyage)",
      "La nominalisation condense l'information et permet un style plus soutenu",
      "Utile dans l'argumentation pour transformer des phrases verbales en groupes nominaux concis",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel est le nom dérivé du verbe 'décider' ?",
        options: ["décision", "décidement", "décideur seulement", "décidé"],
        answer: 0,
        explanation: "'Décider' se nominalise en 'décision' avec le suffixe -sion.",
      },
      {
        difficulty: "moyen",
        question: "Quel est le nom dérivé de l'adjectif 'rapide' ?",
        options: ["rapidement", "rapidité", "rapidifier", "rapidage"],
        answer: 1,
        explanation: "'Rapide' se nominalise en 'rapidité' avec le suffixe -ité.",
      },
      {
        difficulty: "difficile",
        question: "Transforme la phrase 'Le gouvernement a décidé d'augmenter les impôts' en utilisant une nominalisation :",
        options: ["La décision du gouvernement d'augmenter les impôts...", "Le gouvernement décide d'augmenter les impôts.", "Augmenter les impôts est décidé par le gouvernement.", "aucune nominalisation possible ici"],
        answer: 0,
        explanation: "'A décidé' (verbe) devient 'la décision' (nom), condensant l'information dans un groupe nominal : La décision du gouvernement d'augmenter les impôts...",
      },
    ],
    quiz: [
      { question: "Quel nom dérive du verbe 'changer' ?", options: ["changement", "changerie", "changable", "changé"], answer: 0 },
      { question: "Quel suffixe forme souvent un nom à partir d'un verbe ?", options: ["-tion", "-eux", "-able", "-if"], answer: 0 },
      { question: "Quel nom dérive du verbe 'nettoyer' ?", options: ["nettoyage", "nettoyement", "nettoyure", "nettoyable"], answer: 0 },
      { question: "La nominalisation permet de :", options: ["condenser l'information dans un style soutenu", "allonger inutilement les phrases", "rien de particulier", "supprimer le sens"], answer: 0 },
      { question: "Quel nom dérive de l'adjectif 'beau' ?", options: ["beauté", "beaument", "beautifier", "beauage"], answer: 0 },
    ],
  },

  l16: {
    summary:
      "Rédiger un paragraphe argumentatif nécessite une structure claire : une phrase d'introduction annonçant l'idée principale (l'argument), suivie d'une explication développée, et d'un exemple concret qui illustre et renforce cet argument.",
    keyPoints: [
      "Structure : idée principale (argument) → explication → exemple concret",
      "Utiliser des connecteurs logiques pour lier les idées de façon fluide",
      "Chaque paragraphe argumentatif développe généralement un seul argument principal",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle est la première étape pour rédiger un paragraphe argumentatif ?",
        options: ["énoncer clairement l'argument principal", "donner un exemple d'abord", "conclure directement", "poser une question"],
        answer: 0,
        explanation: "On commence par énoncer clairement l'idée principale (l'argument) que le paragraphe va développer.",
      },
      {
        difficulty: "moyen",
        question: "Pourquoi ajouter un exemple concret après avoir expliqué un argument ?",
        options: ["pour illustrer et renforcer la crédibilité de l'argument", "cela n'a aucune utilité", "pour allonger le texte sans raison", "pour remplacer l'argument"],
        answer: 0,
        explanation: "L'exemple concret rend l'argument plus tangible et convaincant en l'ancrant dans une situation réelle ou vérifiable.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi est-il conseillé de développer un seul argument principal par paragraphe argumentatif ?",
        options: ["cela rend le texte plus clair et structuré, chaque paragraphe ayant une idée centrale facile à suivre pour le lecteur", "un paragraphe ne peut contenir qu'une seule phrase", "il est interdit d'avoir plusieurs arguments dans tout un texte", "cela n'a aucune importance stylistique"],
        answer: 0,
        explanation: "Limiter chaque paragraphe à un argument principal améliore la clarté et la structure du texte, facilitant la compréhension du lecteur qui peut suivre chaque idée séparément.",
      },
    ],
    quiz: [
      { question: "Un paragraphe argumentatif contient généralement :", options: ["un argument, une explication, un exemple", "seulement un exemple", "seulement une question", "aucune structure particulière"], answer: 0 },
      { question: "L'exemple concret sert à :", options: ["illustrer et renforcer l'argument", "remplacer l'argument", "rien de particulier", "compliquer le texte"], answer: 0 },
      { question: "Les connecteurs logiques aident à :", options: ["lier les idées de façon fluide", "rien de particulier", "supprimer les arguments", "raccourcir le texte inutilement"], answer: 0 },
      { question: "Combien d'arguments principaux développe généralement un paragraphe ?", options: ["un seul", "toujours cinq", "aucun", "un nombre illimité"], answer: 0 },
      { question: "Un bon paragraphe argumentatif est :", options: ["clair et bien structuré", "confus et désorganisé", "sans lien logique", "toujours très court sans développement"], answer: 0 },
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