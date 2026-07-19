// scripts/seedPrim4FrancaisContentT3.js
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

const GRADE_ID = "prim-4";
const SUBJECT_ID = "francais";

// Trimestre 3 — lessons l19 through l27
const LESSON_CONTENT = {
  l19: {
    summary:
      "Le complément d'objet direct (COD) complète le verbe sans préposition et répond à la question 'quoi ?' ou 'qui ?' posée après le verbe. Il est essentiel pour bien comprendre le sens d'une phrase.",
    keyPoints: [
      "Le COD répond à la question 'qui ?' ou 'quoi ?' après le verbe",
      "Exemple : Je mange une pomme. (Je mange quoi ? Une pomme = COD)",
      "Le COD est directement relié au verbe, sans mot de liaison comme 'à' ou 'de'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Il lit un livre', quel est le COD ?",
        options: ["Il", "lit", "un livre", "aucun"],
        answer: 2,
        explanation: "'Un livre' répond à la question 'il lit quoi ?', c'est donc le COD.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'La maîtresse explique la leçon', quel est le COD ?",
        options: ["La maîtresse", "explique", "la leçon", "aucun"],
        answer: 2,
        explanation: "'La leçon' répond à 'explique quoi ?', c'est le COD.",
      },
      {
        difficulty: "difficile",
        question: "Dans quelle phrase y a-t-il un COD ?",
        options: ["Il parle à son ami.", "Elle regarde la télévision.", "Nous allons à l'école.", "Ils pensent à leurs vacances."],
        answer: 1,
        explanation: "'La télévision' est directement reliée au verbe 'regarde' sans préposition, c'est un COD. Les autres phrases utilisent des compléments avec 'à', donc ce ne sont pas des COD.",
      },
    ],
    quiz: [
      { question: "Le COD répond à quelle question après le verbe ?", options: ["où ?", "quand ?", "quoi ?/qui ?", "comment ?"], answer: 2 },
      { question: "Dans 'Elle mange une glace', quel est le COD ?", options: ["Elle", "mange", "une glace", "aucun"], answer: 2 },
      { question: "Dans 'Nous regardons un film', quel est le COD ?", options: ["Nous", "regardons", "un film", "aucun"], answer: 2 },
      { question: "Le COD est-il relié au verbe par une préposition ?", options: ["oui, toujours", "non, jamais", "parfois seulement", "cela dépend du sujet"], answer: 1 },
      { question: "Dans 'Le garçon ferme la porte', quel est le COD ?", options: ["Le garçon", "ferme", "la porte", "aucun"], answer: 2 },
    ],
  },

  l20: {
    summary:
      "Les verbes du 2ème groupe se terminent par -ir à l'infinitif et forment leur participe présent en -issant (finir → finissant). Au présent, ils suivent des terminaisons régulières propres à ce groupe.",
    keyPoints: [
      "Infinitif en -ir avec participe présent en -issant : finir, choisir, grandir, réussir",
      "Terminaisons au présent : -is, -is, -it, -issons, -issez, -issent",
      "Exemple avec 'finir' : je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Je ___ (finir) mon travail.",
        options: ["finis", "finit", "finissons", "finissent"],
        answer: 0,
        explanation: "À la 1ère personne du singulier, la terminaison est -is : je finis.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Nous ___ (choisir) un cadeau.",
        options: ["choisis", "choisit", "choisissons", "choisissent"],
        answer: 2,
        explanation: "À la 1ère personne du pluriel, la terminaison est -issons : nous choisissons.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase est correctement conjuguée ?",
        options: ["Ils grandissent vite", "Ils grandit vite", "Ils grandis vite", "Ils grandissons vite"],
        answer: 0,
        explanation: "'Ils grandissent' est correct : à la 3ème personne du pluriel, la terminaison est -issent.",
      },
    ],
    quiz: [
      { question: "Complète : Tu ___ (réussir) ton examen.", options: ["réussis", "réussit", "réussissons", "réussissent"], answer: 0 },
      { question: "Complète : Elle ___ (finir) son repas.", options: ["finis", "finit", "finissons", "finissent"], answer: 1 },
      { question: "Complète : Vous ___ (choisir) une couleur.", options: ["choisis", "choisit", "choisissez", "choisissent"], answer: 2 },
      { question: "Quelle terminaison utilise-t-on à 'nous' pour un verbe du 2ème groupe ?", options: ["-ons", "-issons", "-ez", "-ent"], answer: 1 },
      { question: "Quel verbe appartient au 2ème groupe ?", options: ["parler", "manger", "grandir", "être"], answer: 2 },
    ],
  },

  l21: {
    summary:
      "Découverte du vocabulaire lié au corps humain et à la santé, pour permettre de décrire son corps, exprimer une douleur, et comprendre des consignes liées à l'hygiène et à la santé.",
    keyPoints: [
      "Parties du corps : la tête, les bras, les jambes, le ventre, le dos",
      "Expressions de la santé : avoir mal à..., être malade, se sentir bien/mal",
      "Vocabulaire de l'hygiène : se laver, se brosser les dents, se reposer",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle partie du corps utilise-t-on pour marcher ?",
        options: ["les bras", "les jambes", "la tête", "le dos"],
        answer: 1,
        explanation: "On utilise les jambes pour marcher.",
      },
      {
        difficulty: "moyen",
        question: "Comment dit-on qu'on a une douleur à la tête ?",
        options: ["J'ai mal à la tête", "Je suis la tête", "J'ai la tête malade", "Ma tête est mal"],
        answer: 0,
        explanation: "L'expression correcte est 'avoir mal à' + partie du corps : J'ai mal à la tête.",
      },
      {
        difficulty: "difficile",
        question: "Que doit-on faire pour rester en bonne santé, selon le vocabulaire appris ?",
        options: ["Ne jamais se laver", "Se brosser les dents et se reposer", "Ne pas dormir", "Manger uniquement des bonbons"],
        answer: 1,
        explanation: "Se brosser les dents et se reposer font partie des bonnes habitudes d'hygiène et de santé.",
      },
    ],
    quiz: [
      { question: "Quelle partie du corps se trouve entre la tête et les bras ?", options: ["le cou", "les jambes", "les pieds", "le ventre"], answer: 0 },
      { question: "Comment dit-on qu'on est en mauvaise santé ?", options: ["être malade", "être content", "être fatigué de jouer", "être en vacances"], answer: 0 },
      { question: "Que fait-on pour nettoyer ses dents ?", options: ["se laver les mains", "se brosser les dents", "se reposer", "manger"], answer: 1 },
      { question: "Quelle expression signifie 'avoir une douleur au ventre' ?", options: ["J'ai mal au ventre", "Je suis au ventre", "Mon ventre est content", "J'aime le ventre"], answer: 0 },
      { question: "Quelle partie du corps protège le cerveau ?", options: ["le dos", "la tête", "les bras", "les jambes"], answer: 1 },
    ],
  },

  l22: {
    summary:
      "Les mots invariables ne changent jamais de forme, quel que soit le genre, le nombre ou la personne. Les prépositions simples (à, de, dans, sur, sous, avec, pour...) sont des mots invariables très fréquents qui introduisent un complément.",
    keyPoints: [
      "Un mot invariable ne prend jamais de -e, -s ou autre marque d'accord",
      "Prépositions simples courantes : à, de, dans, sur, sous, avec, pour, chez, sans",
      "Les prépositions introduisent souvent un lieu, un moyen ou une compagnie",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel mot est une préposition ?",
        options: ["grand", "dans", "chante", "les"],
        answer: 1,
        explanation: "'Dans' est une préposition simple, un mot invariable.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Le chat dort ___ le canapé.",
        options: ["sur", "grand", "les", "chante"],
        answer: 0,
        explanation: "'Sur' est la préposition qui convient pour indiquer la position du chat.",
      },
      {
        difficulty: "difficile",
        question: "Dans la phrase 'Je vais chez mon ami avec ma sœur', combien de prépositions y a-t-il ?",
        options: ["1", "2", "3", "0"],
        answer: 1,
        explanation: "Il y a deux prépositions : 'chez' et 'avec'.",
      },
    ],
    quiz: [
      { question: "Un mot invariable :", options: ["change selon le genre", "change selon le nombre", "ne change jamais", "change selon la personne"], answer: 2 },
      { question: "Quelle est une préposition simple ?", options: ["petit", "avec", "jouons", "les"], answer: 1 },
      { question: "Complète : Le livre est ___ la table.", options: ["sur", "petit", "chantent", "les"], answer: 0 },
      { question: "Quel mot introduit souvent un lieu ?", options: ["une préposition", "un verbe", "un adjectif", "un pronom"], answer: 0 },
      { question: "Quelle phrase contient une préposition ?", options: ["Il court vite.", "Elle chante bien.", "Le stylo est sous le cahier.", "Nous sommes contents."], answer: 2 },
    ],
  },

  l23: {
    summary:
      "Le futur simple sert à exprimer une action qui aura lieu plus tard. Pour les verbes du 1er groupe, on forme le futur en ajoutant les terminaisons -ai, -as, -a, -ons, -ez, -ont à l'infinitif du verbe.",
    keyPoints: [
      "Le futur simple exprime une action à venir",
      "Formation : infinitif du verbe + terminaison (-ai, -as, -a, -ons, -ez, -ont)",
      "Exemple avec 'parler' : je parlerai, tu parleras, il parlera, nous parlerons, vous parlerez, ils parleront",
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
        question: "Complète au futur : Nous ___ (regarder) un film ce soir.",
        options: ["regardons", "regarderons", "regardions", "regarderiez"],
        answer: 1,
        explanation: "Au futur, on ajoute -ons à l'infinitif : nous regarderons.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase est correctement conjuguée au futur ?",
        options: ["Ils chanteront une chanson demain", "Ils chantera une chanson demain", "Ils chantent une chanson demain", "Ils chanterai une chanson demain"],
        answer: 0,
        explanation: "'Ils chanteront' est correct : à la 3ème personne du pluriel au futur, la terminaison est -ont.",
      },
    ],
    quiz: [
      { question: "Complète au futur : Tu ___ (manger) une pomme.", options: ["manges", "mangeras", "mangais", "mangerait"], answer: 1 },
      { question: "Complète au futur : Elle ___ (chanter) demain.", options: ["chante", "chantera", "chantait", "chanterait"], answer: 1 },
      { question: "Complète au futur : Vous ___ (parler) au directeur.", options: ["parlez", "parlerez", "parliez", "parleriez"], answer: 1 },
      { question: "Quelle terminaison utilise-t-on à 'je' au futur simple ?", options: ["-e", "-ai", "-as", "-ons"], answer: 1 },
      { question: "Comment forme-t-on le futur simple des verbes du 1er groupe ?", options: ["infinitif + terminaison", "on enlève -er", "radical + -ait", "cela ne change pas"], answer: 0 },
    ],
  },

  l24: {
    summary:
      "Les homophones sont des mots qui se prononcent de la même façon mais qui s'écrivent différemment et n'ont pas le même sens. Il est important de bien les distinguer pour éviter les fautes d'orthographe, notamment 'a/à' et 'et/est'.",
    keyPoints: [
      "'a' (verbe avoir) se remplace par 'avait' : Il a un vélo → Il avait un vélo",
      "'à' (préposition) ne se remplace pas par 'avait' : Il va à l'école",
      "'et' (mot de liaison) se remplace par 'et puis' : Le chat et le chien",
      "'est' (verbe être) se remplace par 'était' : Il est grand → Il était grand",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Il ___ un joli sourire. (a/à)",
        options: ["a", "à"],
        answer: 0,
        explanation: "On peut remplacer par 'avait' : Il avait un joli sourire. C'est donc 'a' (verbe avoir).",
      },
      {
        difficulty: "moyen",
        question: "Complète : Elle va ___ l'école. (a/à)",
        options: ["a", "à"],
        answer: 1,
        explanation: "On ne peut pas dire 'Elle va avait l'école', donc c'est la préposition 'à'.",
      },
      {
        difficulty: "difficile",
        question: "Complète les deux mots : Mon frère ___ ma sœur ___ à la maison. (et/est)",
        options: ["et / est", "est / et", "et / et", "est / est"],
        answer: 0,
        explanation: "'Mon frère et ma sœur' (liaison, remplaçable par 'et puis') et 'sont à la maison'... en fait la phrase correcte utilise 'et' pour lier les deux personnes et 'est' comme verbe être, remplaçable par 'était'.",
      },
    ],
    quiz: [
      { question: "Comment vérifie-t-on si c'est 'a' ou 'à' ?", options: ["en remplaçant par 'avait'", "en remplaçant par 'et'", "cela ne se vérifie pas", "en comptant les lettres"], answer: 0 },
      { question: "Complète : Le chat ___ le chien jouent. (et/est)", options: ["et", "est"], answer: 0 },
      { question: "Complète : Elle ___ fatiguée. (et/est)", options: ["et", "est"], answer: 1 },
      { question: "Comment vérifie-t-on si c'est 'et' ou 'est' ?", options: ["en remplaçant par 'était'", "en remplaçant par 'avait'", "les deux se remplacent pareil", "cela ne se vérifie pas"], answer: 0 },
      { question: "Complète : Sami ___ un beau vélo. (a/à)", options: ["a", "à"], answer: 0 },
    ],
  },

  l27_placeholder_unused: null, // (kept out intentionally — see l25-l27 below)

  l25: {
    summary:
      "Révision des trois grands types de phrases étudiés : la phrase déclarative (affirmative/négative), la phrase interrogative, et la phrase exclamative, pour bien les reconnaître et les utiliser à l'écrit comme à l'oral.",
    keyPoints: [
      "Phrase déclarative : donne une information, se termine par un point (Il fait beau.)",
      "Phrase interrogative : pose une question, se termine par un point d'interrogation (Fait-il beau ?)",
      "Phrase exclamative : exprime une émotion forte, se termine par un point d'exclamation (Quel beau temps !)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel type de phrase est 'Il fait chaud aujourd'hui.' ?",
        options: ["déclarative", "interrogative", "exclamative", "négative uniquement"],
        answer: 0,
        explanation: "Cette phrase donne une information simple, c'est une phrase déclarative.",
      },
      {
        difficulty: "moyen",
        question: "Quel type de phrase est 'Quelle belle journée !' ?",
        options: ["déclarative", "interrogative", "exclamative", "négative"],
        answer: 2,
        explanation: "Cette phrase exprime une émotion forte et se termine par un point d'exclamation, c'est une phrase exclamative.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase est à la fois négative et interrogative ?",
        options: ["Il ne vient pas.", "Vient-il ?", "Ne vient-il pas ?", "Quel dommage !"],
        answer: 2,
        explanation: "'Ne vient-il pas ?' combine la négation (ne...pas) et la forme interrogative (inversion + point d'interrogation).",
      },
    ],
    quiz: [
      { question: "Quel signe termine une phrase interrogative ?", options: [".", "!", "?", ","], answer: 2 },
      { question: "Quel type de phrase exprime une émotion forte ?", options: ["déclarative", "interrogative", "exclamative", "négative"], answer: 2 },
      { question: "'Aimes-tu le chocolat ?' est une phrase :", options: ["déclarative", "interrogative", "exclamative", "négative"], answer: 1 },
      { question: "'Je n'aime pas les épinards.' est une phrase :", options: ["interrogative", "exclamative", "négative", "aucune de ces réponses"], answer: 2 },
      { question: "Combien de grands types de phrases avons-nous révisés ?", options: ["2", "3", "4", "5"], answer: 1 },
    ],
  },

  l26: {
    summary:
      "Les verbes être et avoir, comme les autres verbes, ont leur propre conjugaison au futur simple, différente de celle des verbes réguliers du 1er groupe. Il faut mémoriser ces formes irrégulières.",
    keyPoints: [
      "Être au futur : je serai, tu seras, il/elle sera, nous serons, vous serez, ils/elles seront",
      "Avoir au futur : j'aurai, tu auras, il/elle aura, nous aurons, vous aurez, ils/elles auront",
      "Ces conjugaisons sont irrégulières et doivent être mémorisées",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au futur : Je ___ (être) content demain.",
        options: ["suis", "serai", "étais", "serais"],
        answer: 1,
        explanation: "Au futur, le verbe être devient 'serai' à la 1ère personne du singulier.",
      },
      {
        difficulty: "moyen",
        question: "Complète au futur : Nous ___ (avoir) une surprise.",
        options: ["avons", "aurons", "avions", "aurions"],
        answer: 1,
        explanation: "Au futur, le verbe avoir devient 'aurons' à la 1ère personne du pluriel.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase combine correctement être et avoir au futur ?",
        options: ["Il sera content et il aura un cadeau", "Il serai content et il auras un cadeau", "Il est content et il aura un cadeau", "Il sera content et il a un cadeau"],
        answer: 0,
        explanation: "'Il sera' et 'il aura' sont les formes correctes du futur simple à la 3ème personne du singulier.",
      },
    ],
    quiz: [
      { question: "Complète au futur : Tu ___ (être) fier de toi.", options: ["es", "seras", "étais", "serais"], answer: 1 },
      { question: "Complète au futur : Vous ___ (avoir) de la chance.", options: ["avez", "aurez", "aviez", "auriez"], answer: 1 },
      { question: "Complète au futur : Elles ___ (être) heureuses.", options: ["sont", "seront", "étaient", "seraient"], answer: 1 },
      { question: "Complète au futur : Ils ___ (avoir) un nouveau vélo.", options: ["ont", "auront", "avaient", "auraient"], answer: 1 },
      { question: "Quelle est la 1ère personne du singulier du verbe être au futur ?", options: ["suis", "serai", "étais", "sera"], answer: 1 },
    ],
  },

  l27: {
    summary:
      "Découverte du vocabulaire lié au temps qu'il fait et aux quatre saisons de l'année, pour pouvoir décrire la météo et situer les événements dans l'année.",
    keyPoints: [
      "Les quatre saisons : le printemps, l'été, l'automne, l'hiver",
      "Vocabulaire de la météo : il fait chaud/froid, il pleut, il neige, il y a du soleil, il y a du vent",
      "Chaque saison a des caractéristiques propres : l'été est chaud, l'hiver est froid",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle saison vient après l'hiver ?",
        options: ["l'été", "le printemps", "l'automne", "l'hiver revient"],
        answer: 1,
        explanation: "L'ordre des saisons est : printemps, été, automne, hiver. Le printemps suit l'hiver.",
      },
      {
        difficulty: "moyen",
        question: "Quelle expression décrit un temps froid avec des flocons blancs ?",
        options: ["Il fait chaud", "Il pleut", "Il neige", "Il y a du soleil"],
        answer: 2,
        explanation: "'Il neige' décrit la chute de flocons de neige, typique de l'hiver.",
      },
      {
        difficulty: "difficile",
        question: "En quelle saison fait-il généralement le plus chaud en Tunisie ?",
        options: ["l'hiver", "le printemps", "l'été", "l'automne"],
        answer: 2,
        explanation: "L'été est la saison la plus chaude de l'année en Tunisie.",
      },
    ],
    quiz: [
      { question: "Combien de saisons y a-t-il dans une année ?", options: ["2", "3", "4", "5"], answer: 2 },
      { question: "Quelle saison précède l'été ?", options: ["l'hiver", "le printemps", "l'automne", "aucune"], answer: 1 },
      { question: "Quelle expression signifie qu'il y a beaucoup de vent ?", options: ["il fait chaud", "il y a du vent", "il neige", "il fait froid"], answer: 1 },
      { question: "Quelle saison vient après l'été ?", options: ["le printemps", "l'automne", "l'hiver", "l'été recommence"], answer: 1 },
      { question: "Quelle expression utilise-t-on quand le ciel est dégagé et ensoleillé ?", options: ["il pleut", "il y a du soleil", "il neige", "il fait froid"], answer: 1 },
    ],
  },
};

async function seedContent() {
  const batch = db.batch();
  let count = 0;

  for (const [lessonId, content] of Object.entries(LESSON_CONTENT)) {
    if (lessonId === "l27_placeholder_unused") continue; // skip the stray placeholder key
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