// scripts/seedCol7FrancaisContentT3.js
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

const GRADE_ID = "col-7";
const SUBJECT_ID = "francais";

// Trimestre 3 — lessons l17 through l24
const LESSON_CONTENT = {
  l17: {
    summary:
      "Le conditionnel présent exprime un souhait, une politesse, une hypothèse, ou une action soumise à une condition. Il se forme avec le radical du futur simple, suivi des terminaisons de l'imparfait.",
    keyPoints: [
      "Formation : radical du futur + terminaisons de l'imparfait (-ais, -ais, -ait, -ions, -iez, -aient)",
      "Exemple avec 'parler' : je parlerais, tu parlerais, il parlerait, nous parlerions...",
      "Emplois : politesse (Je voudrais...), souhait (J'aimerais...), hypothèse (Si j'avais de l'argent, je voyagerais)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au conditionnel : Je ___ (vouloir) un café, s'il vous plaît.",
        options: ["veux", "voudrai", "voudrais", "voulais"],
        answer: 2,
        explanation: "'Voudrais' est le conditionnel présent, utilisé par politesse.",
      },
      {
        difficulty: "moyen",
        question: "Complète au conditionnel : Nous ___ (aimer) partir en vacances.",
        options: ["aimons", "aimerons", "aimerions", "aimions"],
        answer: 2,
        explanation: "Au conditionnel, 1ère personne du pluriel : nous aimerions.",
      },
      {
        difficulty: "difficile",
        question: "Complète : Si j'avais des ailes, je ___ (voler) comme un oiseau.",
        options: ["vole", "volerai", "volerais", "volais"],
        answer: 2,
        explanation: "Avec 'si + imparfait', on utilise le conditionnel présent dans la proposition principale : je volerais.",
      },
    ],
    quiz: [
      { question: "Le conditionnel présent se forme avec :", options: ["radical du présent + terminaisons du futur", "radical du futur + terminaisons de l'imparfait", "l'infinitif seul", "aucune règle fixe"], answer: 1 },
      { question: "Complète : Tu ___ (pouvoir) m'aider ?", options: ["peux", "pourras", "pourrais", "pouvais"], answer: 2 },
      { question: "Le conditionnel s'utilise souvent pour :", options: ["donner un ordre", "exprimer la politesse ou un souhait", "raconter le passé uniquement", "rien de particulier"], answer: 1 },
      { question: "Complète : Elle ___ (être) contente de te voir.", options: ["est", "sera", "serait", "était"], answer: 2 },
      { question: "Quelle terminaison utilise le conditionnel à 'nous' ?", options: ["-ons", "-ions", "-ez", "-ont"], answer: 1 },
    ],
  },

  l18: {
    summary:
      "Les propositions subordonnées conjonctives sont introduites par une conjonction de subordination (que, parce que, quand, si...) et dépendent d'une proposition principale, contrairement aux propositions indépendantes qui n'en dépendent pas.",
    keyPoints: [
      "Introduites par une conjonction de subordination : que, parce que, quand, si, comme, lorsque...",
      "Dépendent grammaticalement de la proposition principale (elles ne peuvent pas exister seules)",
      "Exemple : 'Je pense que tu as raison' — 'que tu as raison' dépend de 'Je pense'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle conjonction introduit une proposition subordonnée conjonctive ?",
        options: ["et", "que", "ou", "ni"],
        answer: 1,
        explanation: "'Que' est une conjonction de subordination fréquente, introduisant une proposition qui dépend d'une autre.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Il reste à la maison parce qu'il pleut', quelle est la proposition subordonnée ?",
        options: ["Il reste à la maison", "parce qu'il pleut", "toute la phrase", "aucune"],
        answer: 1,
        explanation: "'Parce qu'il pleut' est introduite par la conjonction 'parce que' et dépend de la principale.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi une proposition subordonnée conjonctive ne peut-elle pas former une phrase seule ?",
        options: ["elle le peut très bien", "parce qu'elle dépend grammaticalement et sémantiquement de la proposition principale à laquelle elle est rattachée", "parce qu'elle n'a pas de verbe", "parce qu'elle est toujours négative"],
        answer: 1,
        explanation: "Une subordonnée est par définition dépendante : elle ne peut exister sans la proposition principale qu'elle complète (ex. 'parce qu'il pleut' seul n'a pas de sens complet).",
      },
    ],
    quiz: [
      { question: "Quelle conjonction exprime une condition ?", options: ["si", "et", "mais", "donc"], answer: 0 },
      { question: "Quelle conjonction exprime le temps ?", options: ["que", "quand", "car", "ni"], answer: 1 },
      { question: "Une proposition subordonnée conjonctive :", options: ["dépend de la principale", "est toujours indépendante", "n'a jamais de verbe", "remplace toujours un nom"], answer: 0 },
      { question: "Dans 'Je sais que tu viendras', quelle est la subordonnée ?", options: ["Je sais", "que tu viendras", "toute la phrase", "aucune"], answer: 1 },
      { question: "Quelle conjonction exprime la cause ?", options: ["parce que", "et", "ou", "ni"], answer: 0 },
    ],
  },

  l19: {
    summary:
      "Les figures de style enrichissent l'expression littéraire : la comparaison relie deux éléments par un mot comparatif (comme, tel que), la métaphore établit un rapprochement direct sans mot comparatif, et la personnification attribue des caractéristiques humaines à une chose ou un animal.",
    keyPoints: [
      "Comparaison : relie deux éléments avec un mot comparatif (comme, tel que, pareil à) — Ses yeux brillent comme des étoiles.",
      "Métaphore : rapprochement direct sans mot comparatif — Ses yeux sont des étoiles.",
      "Personnification : attribue des qualités humaines à une chose/animal — Le vent murmurait à travers les arbres.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle phrase contient une comparaison ?",
        options: ["Ses cheveux sont de l'or.", "Ses cheveux brillent comme de l'or.", "Le vent chantait doucement.", "La lune souriait."],
        answer: 1,
        explanation: "'Comme' est le mot comparatif qui indique une comparaison.",
      },
      {
        difficulty: "moyen",
        question: "Quelle phrase contient une métaphore ?",
        options: ["Il court comme le vent.", "Il est rapide comme un guépard.", "Il est un vrai guépard sur la piste.", "Il court vite."],
        answer: 2,
        explanation: "'Il est un vrai guépard' rapproche directement l'homme et l'animal, sans mot comparatif : c'est une métaphore.",
      },
      {
        difficulty: "difficile",
        question: "Identifie la figure de style dans 'La forêt se réveillait doucement, les arbres s'étirant sous le premier soleil' :",
        options: ["une comparaison", "une métaphore", "une personnification (la forêt et les arbres agissent comme des humains)", "aucune figure de style"],
        answer: 2,
        explanation: "Attribuer des actions humaines ('se réveillait', 's'étirant') à la forêt et aux arbres est une personnification.",
      },
    ],
    quiz: [
      { question: "La comparaison utilise :", options: ["un mot comparatif comme 'comme'", "aucun mot de liaison", "toujours une négation", "seulement des chiffres"], answer: 0 },
      { question: "La métaphore rapproche deux éléments :", options: ["avec un mot comparatif", "sans mot comparatif, directement", "jamais", "seulement au pluriel"], answer: 1 },
      { question: "La personnification attribue des qualités ___ à une chose ou un animal.", options: ["animales", "humaines", "minérales", "aucune"], answer: 1 },
      { question: "'Le soleil sourit ce matin' est :", options: ["une comparaison", "une personnification", "aucune figure de style", "une négation"], answer: 1 },
      { question: "'Elle est douce comme un agneau' est :", options: ["une métaphore", "une comparaison", "une personnification", "aucune figure de style"], answer: 1 },
    ],
  },

  l20: {
    summary:
      "L'accord du participe passé varie selon l'auxiliaire : avec 'être', il s'accorde toujours avec le sujet ; avec 'avoir', il ne s'accorde pas avec le sujet, mais avec le COD seulement si celui-ci est placé avant le verbe.",
    keyPoints: [
      "Avec être : accord systématique avec le sujet (elle est partie, ils sont partis)",
      "Avec avoir : pas d'accord avec le sujet (elle a mangé, ils ont mangé)",
      "Avec avoir : accord avec le COD si celui-ci précède le verbe (la pomme qu'elle a mangée)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Accorde : Elle est ___ (aller) au marché.",
        options: ["allé", "allée", "allés", "allées"],
        answer: 1,
        explanation: "Avec 'être', le participe passé s'accorde avec le sujet féminin singulier 'Elle' : allée.",
      },
      {
        difficulty: "moyen",
        question: "Accorde : Elle a ___ (manger) une pomme.",
        options: ["mangé", "mangée", "mangés", "mangées"],
        answer: 0,
        explanation: "Avec 'avoir', pas d'accord avec le sujet quand le COD ('une pomme') suit le verbe : mangé (invariable).",
      },
      {
        difficulty: "difficile",
        question: "Accorde : La pomme qu'elle a ___ (manger) était délicieuse.",
        options: ["mangé", "mangée", "mangés", "mangées"],
        answer: 1,
        explanation: "Le COD 'que' (représentant 'la pomme', féminin singulier) est placé avant le verbe avoir, donc le participe passé s'accorde : mangée.",
      },
    ],
    quiz: [
      { question: "Avec l'auxiliaire être, le participe passé s'accorde avec :", options: ["le COD", "le sujet", "rien", "le complément de lieu"], answer: 1 },
      { question: "Avec l'auxiliaire avoir, le participe passé s'accorde avec le sujet ?", options: ["oui, toujours", "non, jamais avec le sujet", "seulement au féminin", "seulement au pluriel"], answer: 1 },
      { question: "Accorde : Ils sont ___ (partir).", options: ["parti", "partie", "partis", "parties"], answer: 2 },
      { question: "Avec avoir, quand accorde-t-on avec le COD ?", options: ["jamais", "quand le COD précède le verbe", "toujours", "quand le COD suit le verbe"], answer: 1 },
      { question: "Accorde : Les lettres qu'il a ___ (écrire) sont belles.", options: ["écrit", "écrite", "écrits", "écrites"], answer: 3 },
    ],
  },

  l21: {
    summary:
      "Le champ lexical regroupe tous les mots qui se rapportent à un même thème (le champ lexical de la mer : vague, bateau, plage...), tandis que le champ sémantique regroupe les différents sens qu'un même mot peut avoir selon le contexte.",
    keyPoints: [
      "Champ lexical : ensemble de mots liés à un même thème (ex. champ lexical de l'école : professeur, cahier, cours)",
      "Champ sémantique : ensemble des sens différents d'un même mot (ex. 'feuille' : feuille d'arbre, feuille de papier)",
      "Identifier le champ lexical d'un texte aide à comprendre son thème dominant",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel mot appartient au champ lexical de la mer ?",
        options: ["vague", "cahier", "voiture", "montagne"],
        answer: 0,
        explanation: "'Vague' est directement lié au thème de la mer.",
      },
      {
        difficulty: "moyen",
        question: "Le mot 'feuille' peut désigner une feuille d'arbre ou une feuille de papier. Cela illustre :",
        options: ["un champ lexical", "un champ sémantique (plusieurs sens d'un même mot)", "une figure de style", "une conjugaison"],
        answer: 1,
        explanation: "Le champ sémantique regroupe les différents sens qu'un même mot peut prendre selon le contexte.",
      },
      {
        difficulty: "difficile",
        question: "Dans un texte contenant les mots 'orage', 'nuages', 'tonnerre', 'pluie', quel est le champ lexical dominant ?",
        options: ["le champ lexical de la mer", "le champ lexical de la tempête/météo", "le champ lexical de l'école", "aucun champ lexical identifiable"],
        answer: 1,
        explanation: "Tous ces mots se rapportent au thème de la tempête ou de la météo, formant un champ lexical cohérent.",
      },
    ],
    quiz: [
      { question: "Le champ lexical regroupe des mots liés à :", options: ["un même thème", "un même son", "une même conjugaison", "rien de particulier"], answer: 0 },
      { question: "Le champ sémantique concerne :", options: ["les différents sens d'un même mot", "les mots d'un même thème", "la conjugaison des verbes", "la ponctuation"], answer: 0 },
      { question: "Quel mot appartient au champ lexical de l'école ?", options: ["professeur", "océan", "voiture", "montagne"], answer: 0 },
      { question: "Identifier le champ lexical d'un texte aide à :", options: ["comprendre son thème dominant", "compter les lettres", "conjuguer les verbes", "rien de particulier"], answer: 0 },
      { question: "'Glace' (dessert) et 'glace' (miroir) illustrent :", options: ["un champ lexical", "un champ sémantique", "une comparaison", "une négation"], answer: 1 },
    ],
  },

  l22: {
    summary:
      "La lettre et le message sont des formes d'expression écrite courtes destinées à communiquer avec un destinataire précis. La lettre suit une structure formelle (formule d'appel, corps, formule de politesse), tandis que le message est plus court et direct.",
    keyPoints: [
      "La lettre : formule d'appel (Cher/Chère...), corps du texte, formule de politesse finale",
      "Le message : plus court, direct, sans nécessairement toute la structure formelle de la lettre",
      "Le ton et le registre de langue varient selon le destinataire (familier pour un ami, formel pour une administration)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle partie ouvre traditionnellement une lettre ?",
        options: ["la formule de politesse finale", "la formule d'appel", "la signature seule", "aucune partie précise"],
        answer: 1,
        explanation: "La formule d'appel (Cher ami, Madame, Monsieur...) ouvre traditionnellement une lettre.",
      },
      {
        difficulty: "moyen",
        question: "Quel registre de langue convient à une lettre adressée à une administration ?",
        options: ["familier", "formel", "argotique", "aucun registre particulier"],
        answer: 1,
        explanation: "Une lettre administrative exige un registre formel et respectueux.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi le message diffère-t-il souvent de la lettre dans sa structure ?",
        options: ["il n'y a aucune différence", "le message privilégie la rapidité et la concision, souvent sans les formules complètes de politesse de la lettre traditionnelle", "le message est toujours plus long", "le message n'a jamais de destinataire précis"],
        answer: 1,
        explanation: "Le message (SMS, message rapide) privilégie l'efficacité et la brièveté, contrairement à la lettre qui suit une structure plus formelle et complète.",
      },
    ],
    quiz: [
      { question: "Quelle partie clôt traditionnellement une lettre ?", options: ["la formule d'appel", "la formule de politesse finale", "le titre", "aucune partie précise"], answer: 1 },
      { question: "Un message est généralement :", options: ["plus long qu'une lettre", "plus court et direct qu'une lettre", "identique à une lettre", "sans destinataire"], answer: 1 },
      { question: "Le registre de langue dépend de :", options: ["la météo", "le destinataire et le contexte", "rien de particulier", "la longueur du texte uniquement"], answer: 1 },
      { question: "Quel registre convient à un message à un ami proche ?", options: ["formel uniquement", "familier", "administratif", "aucun registre possible"], answer: 1 },
      { question: "La lettre formelle nécessite généralement :", options: ["des formules de politesse appropriées", "aucune structure particulière", "toujours un ton familier", "aucune formule d'appel"], answer: 0 },
    ],
  },

  l23: {
    summary:
      "Révision générale des principaux acquis de l'année : les classes et fonctions grammaticales, les temps de conjugaison (présent, imparfait, passé composé, futur, conditionnel), les types de propositions, et le vocabulaire (synonymes, antonymes, champs lexicaux).",
    keyPoints: [
      "Grammaire : classes de mots, fonctions (sujet, COD, COI, attribut), propositions (indépendantes, subordonnées)",
      "Conjugaison : présent, imparfait, passé composé, futur simple/proche, conditionnel présent",
      "Vocabulaire : synonymes, antonymes, homonymes, champs lexicaux et sémantiques, figures de style",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel temps exprime une action qui se déroule maintenant ?",
        options: ["le présent", "le passé composé", "l'imparfait", "le futur"],
        answer: 0,
        explanation: "Le présent exprime une action qui se déroule au moment où l'on parle.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Elle offre un cadeau à son frère', identifie le COD :",
        options: ["Elle", "offre", "un cadeau", "à son frère"],
        answer: 2,
        explanation: "'Un cadeau' répond à 'offre quoi ?', c'est le COD.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase combine correctement l'imparfait (description) et le passé composé (action) ?",
        options: ["Il pleuvait quand elle est sortie.", "Il a plu quand elle sortait.", "Il pleut quand elle sort.", "Il pleuvra quand elle sortira."],
        answer: 0,
        explanation: "'Il pleuvait' (imparfait, décor) et 'elle est sortie' (passé composé, action ponctuelle) illustrent la combinaison classique de ces deux temps dans un récit.",
      },
    ],
    quiz: [
      { question: "Quel type de proposition dépend d'une principale ?", options: ["indépendante", "subordonnée", "aucune", "toutes les propositions"], answer: 1 },
      { question: "Le COD répond à quelle question ?", options: ["où ?", "quoi ?/qui ?", "quand ?", "comment ?"], answer: 1 },
      { question: "Quel temps exprime la politesse ou un souhait ?", options: ["le présent", "le conditionnel", "l'imparfait seul", "le passé composé"], answer: 1 },
      { question: "Un synonyme de 'content' est :", options: ["triste", "joyeux", "fatigué", "en colère"], answer: 1 },
      { question: "Quel pronom relatif remplace un complément introduit par 'de' ?", options: ["qui", "que", "où", "dont"], answer: 3 },
    ],
  },

  l24: {
    summary:
      "Préparation finale à l'évaluation de fin d'année : révision combinée de la compréhension de texte (identifier structure, personnages, sens), de l'expression écrite (rédiger un texte narratif ou descriptif structuré), et de la grammaire (tous les points étudiés durant l'année).",
    keyPoints: [
      "Compréhension : identifier le type de texte, sa structure, les personnages, et répondre avec des phrases complètes",
      "Expression écrite : structurer un texte avec une introduction, un développement, et une conclusion cohérente",
      "Grammaire : revoir les classes de mots, les fonctions, les temps verbaux, et les types de propositions",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Lors d'une évaluation de compréhension, les réponses doivent être :",
        options: ["des phrases complètes justifiées", "un seul mot toujours", "des devinettes", "des copies du texte entier"],
        answer: 0,
        explanation: "Les réponses aux questions de compréhension doivent être rédigées en phrases complètes et justifiées par le texte.",
      },
      {
        difficulty: "moyen",
        question: "Un bon texte narratif pour l'évaluation doit inclure :",
        options: ["une situation initiale, des péripéties, une situation finale", "seulement des dialogues", "aucune structure particulière", "uniquement des descriptions"], 
        answer: 0,
        explanation: "La structure classique du récit (situation initiale, péripéties, situation finale) est attendue dans un texte narratif structuré.",
      },
      {
        difficulty: "difficile",
        question: "Complète cette phrase d'examen : 'Quand elle ___ (arriver), il ___ (déjà partir).'",
        options: ["est arrivée / était déjà parti", "arrive / part déjà", "arrivait / partira", "arrivera / est parti"],
        answer: 0,
        explanation: "'Est arrivée' (passé composé, action ponctuelle) et 'était déjà parti' (plus-que-parfait, action antérieure) montrent une séquence logique d'événements passés.",
      },
    ],
    quiz: [
      { question: "Quelle est la structure classique d'un texte narratif ?", options: ["situation initiale, péripéties, situation finale", "seulement une description", "seulement un dialogue", "aucune structure"], answer: 0 },
      { question: "Pour bien répondre à une question de compréhension, il faut :", options: ["justifier sa réponse en s'appuyant sur le texte", "deviner sans lire", "copier tout le texte", "ignorer la question"], answer: 0 },
      { question: "Quel temps est souvent utilisé pour la description dans un récit ?", options: ["l'imparfait", "le futur", "le conditionnel", "l'impératif"], answer: 0 },
      { question: "Une bonne expression écrite nécessite :", options: ["une organisation claire (introduction, développement, conclusion)", "aucune organisation", "seulement des phrases courtes", "uniquement des questions"], answer: 0 },
      { question: "Quelle fonction grammaticale répond à 'qui est-ce qui fait l'action ?'", options: ["le sujet", "le COD", "le COI", "l'attribut"], answer: 0 },
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