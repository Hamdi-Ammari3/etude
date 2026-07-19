// scripts/seedPrim5FrancaisContentT1.js
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

const GRADE_ID = "prim-5";
const SUBJECT_ID = "francais";

// Trimestre 1 — lessons l1 through l8
const LESSON_CONTENT = {
  l1: {
    summary:
      "Il existe quatre types de phrases en français, selon l'intention de celui qui parle : la phrase déclarative (donne une information), la phrase interrogative (pose une question), la phrase exclamative (exprime une émotion forte), et la phrase impérative (donne un ordre ou un conseil).",
    keyPoints: [
      "Déclarative : Il fait beau aujourd'hui.",
      "Interrogative : Fait-il beau aujourd'hui ?",
      "Exclamative : Quelle belle journée !",
      "Impérative : Sors te promener !",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel type de phrase est : 'Le chat dort.' ?",
        options: ["Déclarative", "Interrogative", "Exclamative", "Impérative"],
        answer: 0,
        explanation: "Cette phrase donne une information simple, c'est une phrase déclarative.",
      },
      {
        difficulty: "moyen",
        question: "Quel type de phrase est : 'Range ta chambre !' ?",
        options: ["Déclarative", "Interrogative", "Exclamative", "Impérative"],
        answer: 3,
        explanation: "Cette phrase donne un ordre, c'est une phrase impérative.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase est à la fois exclamative et exprime une surprise forte ?",
        options: ["As-tu fini tes devoirs ?", "Range ta chambre.", "Quelle surprise incroyable !", "Je vais à l'école."],
        answer: 2,
        explanation: "'Quelle surprise incroyable !' exprime une émotion forte et se termine par un point d'exclamation, c'est une phrase exclamative.",
      },
    ],
    quiz: [
      { question: "Quel signe termine une phrase interrogative ?", options: [".", "?", "!", ","], answer: 1 },
      { question: "'Viens ici !' est une phrase :", options: ["déclarative", "interrogative", "impérative", "exclamative uniquement"], answer: 2 },
      { question: "Combien de types de phrases avons-nous étudiés ?", options: ["2", "3", "4", "5"], answer: 2 },
      { question: "'Il pleut.' est une phrase :", options: ["déclarative", "interrogative", "exclamative", "impérative"], answer: 0 },
      { question: "'Où vas-tu ?' est une phrase :", options: ["déclarative", "interrogative", "exclamative", "impérative"], answer: 1 },
    ],
  },

  l2: {
    summary:
      "Une phrase peut être affirmative (elle exprime un fait de façon positive) ou négative (elle exprime le contraire, en utilisant des mots comme 'ne...pas', 'ne...plus', ou 'ne...jamais' qui encadrent le verbe).",
    keyPoints: [
      "Phrase affirmative : Je mange des fruits.",
      "Phrase négative : Je ne mange pas de fruits.",
      "La négation encadre le verbe : ne + verbe + pas/plus/jamais",
      "Chaque type de phrase (déclarative, interrogative...) peut être affirmatif ou négatif",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle phrase est négative ?",
        options: ["Il aime le chocolat.", "Il n'aime pas le chocolat.", "Il adore le chocolat.", "Il mange du chocolat."],
        answer: 1,
        explanation: "'Il n'aime pas le chocolat' contient la négation 'ne...pas'.",
      },
      {
        difficulty: "moyen",
        question: "Transforme en négative : 'Elle regarde la télévision.'",
        options: ["Elle ne regarde la télévision.", "Elle regarde pas la télévision.", "Elle ne regarde pas la télévision.", "Elle ne pas regarde la télévision."],
        answer: 2,
        explanation: "La négation encadre correctement le verbe : 'ne regarde pas'.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase combine correctement une forme interrogative et négative ?",
        options: ["Ne viens-tu pas ?", "Viens tu ne pas ?", "Ne pas viens-tu ?", "Tu ne viens ?"],
        answer: 0,
        explanation: "'Ne viens-tu pas ?' combine correctement l'inversion interrogative avec la négation encadrant le verbe.",
      },
    ],
    quiz: [
      { question: "Quels mots forment une négation simple ?", options: ["ne...pas", "et...ou", "le...la", "un...des"], answer: 0 },
      { question: "Transforme en négative : 'Je vais à l'école.'", options: ["Je vais pas à l'école.", "Je ne vais pas à l'école.", "Je ne vais à l'école.", "Ne je vais pas à l'école."], answer: 1 },
      { question: "Quelle phrase est affirmative ?", options: ["Je ne sais pas.", "Il ne vient pas.", "Elle chante bien.", "Nous ne partons pas."], answer: 2 },
      { question: "Où se place 'ne' dans une phrase négative ?", options: ["après le verbe", "avant le verbe", "à la fin", "n'importe où"], answer: 1 },
      { question: "Quelle négation signifie 'plus jamais depuis maintenant' ?", options: ["ne...pas", "ne...plus", "ne...que", "ne...guère"], answer: 1 },
    ],
  },

  l3: {
    summary:
      "Le groupe nominal est formé d'un nom noyau, souvent accompagné d'un déterminant et d'expansions qui l'enrichissent : un adjectif qualificatif, un complément du nom (introduit par 'de'), ou une proposition relative.",
    keyPoints: [
      "Groupe nominal minimal : déterminant + nom (le livre)",
      "Expansion par adjectif : le grand livre",
      "Expansion par complément du nom : le livre de mathématiques",
      "Expansion par proposition relative : le livre que je lis",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'la maison bleue', quelle est l'expansion du nom ?",
        options: ["la", "maison", "bleue", "aucune"],
        answer: 2,
        explanation: "'Bleue' est l'adjectif qui étend le nom 'maison'.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'le sac de sport', quel type d'expansion est 'de sport' ?",
        options: ["un adjectif", "un complément du nom", "une proposition relative", "aucune expansion"],
        answer: 1,
        explanation: "'De sport' est un complément du nom, introduit par la préposition 'de'.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'le garçon qui court vite', quelle est l'expansion du nom 'garçon' ?",
        options: ["qui court vite (proposition relative)", "vite (adverbe seul)", "aucune expansion", "le (déterminant)"],
        answer: 0,
        explanation: "'Qui court vite' est une proposition relative qui complète et enrichit le nom 'garçon'.",
      },
    ],
    quiz: [
      { question: "Le groupe nominal minimal contient :", options: ["un verbe et un nom", "un déterminant et un nom", "un adjectif seul", "une préposition seule"], answer: 1 },
      { question: "Quelle expansion introduit 'de' généralement ?", options: ["un adjectif", "un complément du nom", "un article", "un pronom"], answer: 1 },
      { question: "Dans 'la voiture rouge', quelle est l'expansion ?", options: ["la", "voiture", "rouge", "aucune"], answer: 2 },
      { question: "Une proposition relative commence souvent par :", options: ["un article", "qui, que, où", "une préposition simple", "un adjectif"], answer: 1 },
      { question: "Dans 'le chapeau de mon père', quelle est l'expansion ?", options: ["le", "chapeau", "de mon père", "aucune"], answer: 2 },
    ],
  },

  l4: {
    summary:
      "Le présent de l'indicatif exprime une action qui se déroule au moment où l'on parle, une habitude, ou une vérité générale. Les verbes réguliers (1er groupe -er, 2ème groupe -ir) suivent des terminaisons régulières, tandis que certains verbes fréquents (être, avoir, aller, faire) sont irréguliers.",
    keyPoints: [
      "Le présent exprime une action en cours, une habitude, ou une vérité générale",
      "1er groupe (-er) : je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent",
      "2ème groupe (-ir) : je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent",
      "Verbes irréguliers fréquents : être, avoir, aller, faire — à mémoriser séparément",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au présent : Je ___ (parler) avec mon ami.",
        options: ["parle", "parles", "parlons", "parlent"],
        answer: 0,
        explanation: "À la 1ère personne du singulier, la terminaison est -e : je parle.",
      },
      {
        difficulty: "moyen",
        question: "Complète au présent : Nous ___ (finir) notre travail.",
        options: ["finis", "finit", "finissons", "finissent"],
        answer: 2,
        explanation: "À la 1ère personne du pluriel pour un verbe du 2ème groupe, la terminaison est -issons.",
      },
      {
        difficulty: "difficile",
        question: "Complète au présent : Ils ___ (aller) à l'école tous les jours.",
        options: ["vont", "allent", "vas", "allons"],
        answer: 0,
        explanation: "'Aller' est un verbe irrégulier : je vais, tu vas, il va, nous allons, vous allez, ils vont.",
      },
    ],
    quiz: [
      { question: "Complète : Tu ___ (chanter) très bien.", options: ["chante", "chantes", "chantons", "chantent"], answer: 1 },
      { question: "Complète : Elle ___ (choisir) une robe.", options: ["choisis", "choisit", "choisissons", "choisissent"], answer: 1 },
      { question: "Complète : Vous ___ (être) mes amis.", options: ["es", "êtes", "sont", "sommes"], answer: 1 },
      { question: "Complète : Nous ___ (avoir) de la chance.", options: ["avons", "avez", "ont", "ai"], answer: 0 },
      { question: "Complète : Je ___ (faire) mes devoirs.", options: ["fais", "fait", "faisons", "font"], answer: 0 },
    ],
  },

  l5: {
    summary:
      "Le futur simple exprime une action qui aura lieu plus tard. Pour les verbes réguliers, on forme le futur en ajoutant les terminaisons -ai, -as, -a, -ons, -ez, -ont directement à l'infinitif du verbe.",
    keyPoints: [
      "Formation : infinitif du verbe + terminaison (-ai, -as, -a, -ons, -ez, -ont)",
      "Exemple avec 'parler' : je parlerai, tu parleras, il parlera, nous parlerons, vous parlerez, ils parleront",
      "Exemple avec 'finir' : je finirai, tu finiras, il finira...",
      "Les verbes en -re perdent leur -e final avant d'ajouter la terminaison : prendre → je prendrai",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au futur : Demain, je ___ (jouer) au foot.",
        options: ["joue", "jouerai", "jouais", "jouerais"],
        answer: 1,
        explanation: "Au futur simple, on ajoute -ai à l'infinitif : je jouerai.",
      },
      {
        difficulty: "moyen",
        question: "Complète au futur : Nous ___ (finir) ce livre bientôt.",
        options: ["finissons", "finirons", "finissions", "finiraient"],
        answer: 1,
        explanation: "Au futur, on ajoute -ons à l'infinitif : nous finirons.",
      },
      {
        difficulty: "difficile",
        question: "Complète au futur : Ils ___ (prendre) le train demain.",
        options: ["prendront", "prendreront", "prenderont", "prennent"],
        answer: 0,
        explanation: "'Prendre' perd son -e final avant la terminaison du futur : ils prendront.",
      },
    ],
    quiz: [
      { question: "Complète au futur : Tu ___ (manger) une pomme.", options: ["manges", "mangeras", "mangais", "mangerait"], answer: 1 },
      { question: "Complète au futur : Elle ___ (chanter) demain.", options: ["chante", "chantera", "chantait", "chanterait"], answer: 1 },
      { question: "Complète au futur : Vous ___ (parler) au directeur.", options: ["parlez", "parlerez", "parliez", "parleriez"], answer: 1 },
      { question: "Quelle terminaison utilise-t-on à 'je' au futur simple ?", options: ["-e", "-ai", "-as", "-ons"], answer: 1 },
      { question: "Comment forme-t-on le futur simple des verbes réguliers ?", options: ["infinitif + terminaison", "on enlève -er", "radical + -ait", "cela ne change pas"], answer: 0 },
    ],
  },

  l6: {
    summary:
      "Le passé composé exprime une action achevée dans le passé. Il se forme avec l'auxiliaire 'être' ou 'avoir' au présent, suivi du participe passé du verbe. La plupart des verbes utilisent 'avoir', tandis qu'un groupe limité de verbes de mouvement utilisent 'être'.",
    keyPoints: [
      "Formation : auxiliaire (être ou avoir) au présent + participe passé",
      "Avec avoir : j'ai mangé, tu as fini, il a parlé",
      "Avec être (verbes de mouvement comme aller, venir, partir, arriver) : je suis allé, elle est venue",
      "Avec l'auxiliaire être, le participe passé s'accorde avec le sujet en genre et en nombre",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au passé composé : J'___ (manger) une pomme.",
        options: ["ai mangé", "avais mangé", "mangerai", "mange"],
        answer: 0,
        explanation: "Passé composé de 'manger' à la 1ère personne : j'ai mangé.",
      },
      {
        difficulty: "moyen",
        question: "Complète au passé composé : Elle ___ (aller) à l'école.",
        options: ["a allé", "est allée", "a été", "était allée"],
        answer: 1,
        explanation: "'Aller' utilise l'auxiliaire être, et le participe passé s'accorde au féminin : elle est allée.",
      },
      {
        difficulty: "difficile",
        question: "Complète au passé composé : Ils ___ (partir) tôt ce matin.",
        options: ["ont parti", "sont partis", "ont été partis", "étaient partis"],
        answer: 1,
        explanation: "'Partir' utilise l'auxiliaire être, et le participe passé s'accorde au masculin pluriel : ils sont partis.",
      },
    ],
    quiz: [
      { question: "Le passé composé se forme avec :", options: ["un seul verbe conjugué", "un auxiliaire + participe passé", "l'infinitif seul", "aucune règle fixe"], answer: 1 },
      { question: "Complète : Tu ___ (finir) ton travail.", options: ["as fini", "es fini", "finis", "finissais"], answer: 0 },
      { question: "Quel auxiliaire utilise le verbe 'venir' ?", options: ["avoir", "être", "aucun", "les deux au choix"], answer: 1 },
      { question: "Complète : Nous ___ (arriver) en retard.", options: ["avons arrivé", "sommes arrivés", "arrivions", "arriverons"], answer: 1 },
      { question: "Avec l'auxiliaire être, le participe passé s'accorde avec :", options: ["le complément", "le sujet", "rien, il ne s'accorde jamais", "le verbe suivant"], answer: 1 },
    ],
  },

  l7: {
    summary:
      "Les déterminants sont des mots placés devant le nom pour préciser sa nature : les articles (le, la, un, une), les possessifs (mon, ta, ses...) qui indiquent l'appartenance, et les démonstratifs (ce, cette, ces...) qui désignent quelque chose de précis.",
    keyPoints: [
      "Articles définis/indéfinis : le, la, les, un, une, des",
      "Déterminants possessifs : mon, ma, mes, ton, ta, tes, son, sa, ses, notre, votre, leur",
      "Déterminants démonstratifs : ce, cet, cette, ces",
      "Le déterminant s'accorde toujours en genre et en nombre avec le nom",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel déterminant possessif convient : '___ cahier' (à moi, masculin) ?",
        options: ["ma", "mon", "mes", "ton"],
        answer: 1,
        explanation: "'Mon' est le déterminant possessif masculin singulier de la 1ère personne.",
      },
      {
        difficulty: "moyen",
        question: "Quel déterminant démonstratif convient : '___ fille est ma cousine' ?",
        options: ["ce", "cet", "cette", "ces"],
        answer: 2,
        explanation: "'Cette' s'utilise devant un nom féminin singulier.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi utilise-t-on 'cet' et non 'ce' dans 'cet arbre' ?",
        options: ["'Arbre' est féminin", "'Arbre' commence par une voyelle", "C'est une erreur, il faut dire 'ce arbre'", "'Cet' est toujours utilisé pour le pluriel"],
        answer: 1,
        explanation: "'Cet' remplace 'ce' devant un nom masculin singulier commençant par une voyelle ou un h muet, pour faciliter la prononciation.",
      },
    ],
    quiz: [
      { question: "Quel déterminant convient : '___ maison' (à elle, féminin) ?", options: ["son", "sa", "ses", "leur"], answer: 1 },
      { question: "Quel déterminant démonstratif s'utilise au pluriel ?", options: ["ce", "cet", "cette", "ces"], answer: 3 },
      { question: "Quel déterminant convient : '___ amis' (à nous) ?", options: ["notre", "nos", "votre", "leur"], answer: 1 },
      { question: "Les articles définis sont :", options: ["mon, ta, ses", "le, la, les", "ce, cette, ces", "un, une, des"], answer: 1 },
      { question: "Le déterminant s'accorde avec le nom en :", options: ["temps", "genre et nombre", "personne", "lieu"], answer: 1 },
    ],
  },

  l8: {
    summary:
      "Un synonyme est un mot qui a un sens proche ou identique à un autre mot (content/joyeux). Un antonyme est un mot qui a un sens opposé (grand/petit). Enrichir son vocabulaire avec des synonymes et antonymes permet de varier son expression écrite et orale.",
    keyPoints: [
      "Synonyme : mot de sens proche ou équivalent (beau = joli)",
      "Antonyme : mot de sens opposé (chaud ≠ froid)",
      "Utiliser des synonymes évite la répétition dans un texte",
      "Certains mots ont plusieurs synonymes ou antonymes selon le contexte",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel est un synonyme de 'content' ?",
        options: ["triste", "joyeux", "fatigué", "en colère"],
        answer: 1,
        explanation: "'Joyeux' a un sens très proche de 'content'.",
      },
      {
        difficulty: "moyen",
        question: "Quel est un antonyme de 'rapide' ?",
        options: ["vite", "lent", "pressé", "actif"],
        answer: 1,
        explanation: "'Lent' est l'opposé de 'rapide'.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi est-il utile d'utiliser des synonymes dans un texte ?",
        options: ["Pour rendre le texte plus difficile à comprendre", "Pour éviter les répétitions et enrichir le style", "Cela n'a aucune utilité", "Pour raccourcir le texte"],
        answer: 1,
        explanation: "Utiliser des synonymes permet d'éviter de répéter les mêmes mots et rend le texte plus riche et agréable à lire.",
      },
    ],
    quiz: [
      { question: "Un synonyme de 'grand' est :", options: ["petit", "immense", "court", "faible"], answer: 1 },
      { question: "Un antonyme de 'jour' est :", options: ["matin", "nuit", "soleil", "heure"], answer: 1 },
      { question: "Un synonyme de 'triste' est :", options: ["heureux", "malheureux", "content", "calme"], answer: 1 },
      { question: "Un antonyme de 'facile' est :", options: ["simple", "difficile", "rapide", "clair"], answer: 1 },
      { question: "Deux mots synonymes ont un sens :", options: ["opposé", "proche ou identique", "sans rapport", "toujours identique en tout contexte"], answer: 1 },
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