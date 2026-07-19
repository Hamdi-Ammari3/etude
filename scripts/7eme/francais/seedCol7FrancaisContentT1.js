// scripts/seedCol7FrancaisContentT1.js
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

// Trimestre 1 — lessons l1 through l8
const LESSON_CONTENT = {
  l1: {
    summary:
      "Révision et approfondissement des classes de mots fondamentales : le nom (désigne une personne, un lieu ou une chose), le verbe (exprime une action ou un état), l'adjectif (qualifie le nom), et le déterminant (précède et précise le nom).",
    keyPoints: [
      "Le nom : commun (table, chien) ou propre (Sami, Tunis)",
      "Le verbe : exprime une action (courir) ou un état (être, sembler)",
      "L'adjectif qualificatif : donne une caractéristique au nom (grand, joli)",
      "Le déterminant : précède le nom et le précise (le, un, mon, ce)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle est la classe grammaticale du mot 'joli' dans 'un joli jardin' ?",
        options: ["nom", "verbe", "adjectif", "déterminant"],
        answer: 2,
        explanation: "'Joli' qualifie le nom 'jardin', c'est un adjectif.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Le chat dort', quelle est la classe grammaticale de 'dort' ?",
        options: ["nom", "verbe", "adjectif", "déterminant"],
        answer: 1,
        explanation: "'Dort' exprime une action/état, c'est un verbe conjugué.",
      },
      {
        difficulty: "difficile",
        question: "Dans la phrase 'Cette grande maison appartient à mon oncle', identifie toutes les classes de mots pour 'Cette', 'grande', 'maison', 'appartient' :",
        options: ["déterminant, adjectif, nom, verbe", "nom, adjectif, déterminant, verbe", "adjectif, déterminant, verbe, nom", "verbe, nom, adjectif, déterminant"],
        answer: 0,
        explanation: "'Cette' est un déterminant démonstratif, 'grande' un adjectif, 'maison' un nom, et 'appartient' un verbe conjugué.",
      },
    ],
    quiz: [
      { question: "Quelle est la classe grammaticale de 'table' ?", options: ["nom", "verbe", "adjectif", "déterminant"], answer: 0 },
      { question: "Quelle est la classe grammaticale de 'le' dans 'le livre' ?", options: ["nom", "verbe", "adjectif", "déterminant"], answer: 3 },
      { question: "Quelle est la classe grammaticale de 'chanter' ?", options: ["nom", "verbe", "adjectif", "déterminant"], answer: 1 },
      { question: "Le nom propre s'écrit toujours avec :", options: ["une minuscule", "une majuscule", "un article", "un adjectif"], answer: 1 },
      { question: "Quelle est la classe grammaticale de 'rapide' ?", options: ["nom", "verbe", "adjectif", "déterminant"], answer: 2 },
    ],
  },

  l2: {
    summary:
      "La phrase simple contient un seul verbe conjugué (une seule proposition), tandis que la phrase complexe contient plusieurs verbes conjugués, donc plusieurs propositions reliées entre elles.",
    keyPoints: [
      "Phrase simple : un seul verbe conjugué, une seule proposition (Le chat dort.)",
      "Phrase complexe : plusieurs verbes conjugués, plusieurs propositions (Le chat dort et le chien joue.)",
      "Pour compter les propositions, on compte le nombre de verbes conjugués dans la phrase",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Combien de verbes conjugués dans 'Le soleil brille' ?",
        options: ["0", "1", "2", "3"],
        answer: 1,
        explanation: "'Brille' est le seul verbe conjugué, donc c'est une phrase simple.",
      },
      {
        difficulty: "moyen",
        question: "'Il pleut et je reste à la maison' est une phrase :",
        options: ["simple", "complexe", "ni simple ni complexe", "sans verbe"],
        answer: 1,
        explanation: "Deux verbes conjugués (pleut, reste), donc deux propositions : c'est une phrase complexe.",
      },
      {
        difficulty: "difficile",
        question: "Combien de propositions dans 'Quand il fait beau, nous sortons et nous jouons au parc' ?",
        options: ["1", "2", "3", "4"],
        answer: 2,
        explanation: "Trois verbes conjugués (fait, sortons, jouons) donnent trois propositions.",
      },
    ],
    quiz: [
      { question: "Une phrase simple contient :", options: ["un seul verbe conjugué", "plusieurs verbes conjugués", "aucun verbe", "toujours deux noms"], answer: 0 },
      { question: "'Elle chante' est une phrase :", options: ["simple", "complexe", "incomplète", "négative uniquement"], answer: 0 },
      { question: "Pour identifier les propositions, on compte :", options: ["les noms", "les verbes conjugués", "les adjectifs", "les déterminants"], answer: 1 },
      { question: "'Je mange, puis je dors' contient combien de propositions ?", options: ["1", "2", "3", "0"], answer: 1 },
      { question: "Une phrase complexe contient :", options: ["un seul verbe", "plusieurs propositions", "aucune proposition", "toujours une négation"], answer: 1 },
    ],
  },

  l3: {
    summary:
      "Les propositions indépendantes peuvent être coordonnées (reliées par une conjonction de coordination comme et, ou, mais, donc, car) ou juxtaposées (reliées simplement par une virgule ou un point-virgule, sans mot de liaison).",
    keyPoints: [
      "Coordination : proposition + conjonction (et, ou, mais, donc, car, ni, or) + proposition",
      "Juxtaposition : proposition + virgule/point-virgule + proposition, sans mot de liaison",
      "Les deux types relient des propositions indépendantes de même niveau (aucune ne dépend de l'autre)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Il fait froid, je mets un manteau', comment les propositions sont-elles reliées ?",
        options: ["par coordination", "par juxtaposition", "elles ne sont pas reliées", "par subordination"],
        answer: 1,
        explanation: "Une simple virgule relie les deux propositions sans conjonction, c'est une juxtaposition.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Il fait froid, donc je mets un manteau', comment les propositions sont-elles reliées ?",
        options: ["par coordination", "par juxtaposition", "elles ne sont pas reliées", "par subordination"],
        answer: 0,
        explanation: "'Donc' est une conjonction de coordination qui relie les deux propositions.",
      },
      {
        difficulty: "difficile",
        question: "Quelle est la différence essentielle entre coordination et juxtaposition ?",
        options: ["aucune différence", "la coordination utilise un mot de liaison (conjonction), la juxtaposition utilise seulement la ponctuation", "la juxtaposition est plus longue", "la coordination n'existe qu'à l'oral"],
        answer: 1,
        explanation: "La coordination emploie une conjonction explicite (et, mais, donc...), tandis que la juxtaposition relie les propositions uniquement par la ponctuation, sans mot de liaison.",
      },
    ],
    quiz: [
      { question: "Quelle conjonction exprime une opposition ?", options: ["et", "mais", "donc", "ni"], answer: 1 },
      { question: "Quelle conjonction exprime une cause ?", options: ["et", "ou", "car", "mais"], answer: 2 },
      { question: "'Je cours, je saute, je danse' utilise :", options: ["la coordination", "la juxtaposition", "aucune liaison possible", "la subordination"], answer: 1 },
      { question: "Quelle conjonction exprime une conséquence ?", options: ["car", "donc", "mais", "ni"], answer: 1 },
      { question: "Combien de conjonctions de coordination y a-t-il en français (les plus courantes) ?", options: ["3", "5", "7", "10"], answer: 2 },
    ],
  },

  l4: {
    summary:
      "Le groupe nominal peut être enrichi par des expansions qui apportent des précisions sur le nom : l'adjectif qualificatif (épithète) et le complément du nom (introduit par une préposition, souvent 'de').",
    keyPoints: [
      "Expansion par adjectif épithète : le grand jardin",
      "Expansion par complément du nom : le jardin de mon voisin",
      "Un nom peut avoir plusieurs expansions à la fois : le grand jardin de mon voisin",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'la voiture rouge', quelle est l'expansion du nom ?",
        options: ["la", "voiture", "rouge", "aucune"],
        answer: 2,
        explanation: "'Rouge' est l'adjectif épithète qui étend le nom 'voiture'.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'le sac de sport', quel type d'expansion est 'de sport' ?",
        options: ["un adjectif épithète", "un complément du nom", "un déterminant", "un verbe"],
        answer: 1,
        explanation: "'De sport' est un complément du nom introduit par la préposition 'de'.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'la belle maison de mes grands-parents', identifie toutes les expansions du nom 'maison' :",
        options: ["'belle' (adjectif) et 'de mes grands-parents' (complément du nom)", "seulement 'belle'", "seulement 'de mes grands-parents'", "aucune expansion"],
        answer: 0,
        explanation: "Le nom 'maison' est enrichi par deux expansions : l'adjectif épithète 'belle' et le complément du nom 'de mes grands-parents'.",
      },
    ],
    quiz: [
      { question: "Le groupe nominal minimal contient :", options: ["un déterminant et un nom", "un verbe et un nom", "un adjectif seul", "une préposition seule"], answer: 0 },
      { question: "Quelle expansion introduit souvent 'de' ?", options: ["un adjectif", "un complément du nom", "un article", "un pronom"], answer: 1 },
      { question: "Dans 'le chapeau de mon père', quelle est l'expansion ?", options: ["le", "chapeau", "de mon père", "aucune"], answer: 2 },
      { question: "Un nom peut-il avoir plusieurs expansions à la fois ?", options: ["oui", "non, une seule maximum", "jamais", "seulement au pluriel"], answer: 0 },
      { question: "Dans 'la petite table en bois', quelles sont les expansions ?", options: ["'petite' et 'en bois'", "seulement 'petite'", "seulement 'en bois'", "aucune"], answer: 0 },
    ],
  },

  l5: {
    summary:
      "Approfondissement du présent de l'indicatif pour les trois groupes de verbes : réguliers en -er (1er groupe), réguliers en -ir/-issant (2ème groupe), et irréguliers (3ème groupe), avec attention particulière aux verbes fréquents et leurs particularités.",
    keyPoints: [
      "1er groupe (-er) : terminaisons -e, -es, -e, -ons, -ez, -ent",
      "2ème groupe (-ir/-issant) : terminaisons -is, -is, -it, -issons, -issez, -issent",
      "3ème groupe : verbes irréguliers, chacun avec sa conjugaison propre à mémoriser (prendre, venir, pouvoir, vouloir...)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Nous ___ (finir) notre travail.",
        options: ["finit", "finissons", "finis", "finissez"],
        answer: 1,
        explanation: "1ère personne du pluriel pour un verbe du 2ème groupe : finissons.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Ils ___ (pouvoir) venir demain.",
        options: ["peuvent", "pouvons", "peux", "pouvez"],
        answer: 0,
        explanation: "'Pouvoir' est irrégulier (3ème groupe) : je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent.",
      },
      {
        difficulty: "difficile",
        question: "Complète : Vous ___ (vouloir) partir, mais elle ___ (prendre) son temps.",
        options: ["voulez / prend", "voulons / prends", "veut / prenons", "veux / prend"],
        answer: 0,
        explanation: "'Vouloir' à la 2ème personne du pluriel : voulez ; 'prendre' à la 3ème personne du singulier : prend.",
      },
    ],
    quiz: [
      { question: "Complète : Tu ___ (choisir) une couleur.", options: ["choisis", "choisit", "choisissons", "choisissent"], answer: 0 },
      { question: "Complète : Elle ___ (venir) demain.", options: ["viens", "vient", "venons", "viennent"], answer: 1 },
      { question: "Complète : Je ___ (parler) doucement.", options: ["parle", "parles", "parlons", "parlent"], answer: 0 },
      { question: "Le 3ème groupe regroupe :", options: ["tous les verbes en -er", "tous les verbes réguliers en -ir", "les verbes irréguliers", "aucun verbe"], answer: 2 },
      { question: "Complète : Nous ___ (voir) un beau film.", options: ["voyons", "voyez", "voient", "vois"], answer: 0 },
    ],
  },

  l6: {
    summary:
      "Approfondissement des fonctions grammaticales dans la phrase : le sujet (fait l'action), le COD/COI (complètent le verbe), et l'attribut du sujet (relié au sujet par un verbe d'état, décrit le sujet).",
    keyPoints: [
      "Sujet : répond à 'qui est-ce qui...?' avant le verbe",
      "COD : répond à 'quoi/qui' sans préposition après le verbe",
      "COI : répond à 'à quoi/à qui/de quoi' avec préposition",
      "Attribut du sujet : relié au sujet par un verbe d'état (être, sembler, devenir), décrit une qualité du sujet",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Elle est fatiguée', quelle est la fonction de 'fatiguée' ?",
        options: ["COD", "COI", "attribut du sujet", "sujet"],
        answer: 2,
        explanation: "'Fatiguée' est relié au sujet 'Elle' par le verbe d'état 'est', c'est l'attribut du sujet.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Il offre un cadeau à sa mère', identifie le COD et le COI :",
        options: ["COD : un cadeau / COI : à sa mère", "COD : à sa mère / COI : un cadeau", "les deux sont des COD", "les deux sont des COI"],
        answer: 0,
        explanation: "'Un cadeau' répond à 'offre quoi ?' (COD), et 'à sa mère' répond à 'offre à qui ?' (COI).",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Le ciel semble menaçant ce soir', identifie le sujet et l'attribut du sujet :",
        options: ["Sujet : Le ciel / Attribut : menaçant", "Sujet : menaçant / Attribut : Le ciel", "Sujet : ce soir / Attribut : menaçant", "pas d'attribut dans cette phrase"],
        answer: 0,
        explanation: "'Le ciel' est le sujet, et 'menaçant' est l'attribut du sujet relié par le verbe d'état 'semble'.",
      },
    ],
    quiz: [
      { question: "Le sujet répond à quelle question ?", options: ["Qui est-ce qui...?", "Quoi ?", "Où ?", "Comment ?"], answer: 0 },
      { question: "Le COD répond à quelle question ?", options: ["Où ?", "Quoi/Qui (sans préposition) ?", "Quand ?", "Comment ?"], answer: 1 },
      { question: "L'attribut du sujet est relié par :", options: ["un verbe d'action", "un verbe d'état", "une préposition seule", "rien du tout"], answer: 1 },
      { question: "Dans 'Elle mange une pomme', quel est le COD ?", options: ["Elle", "mange", "une pomme", "aucun"], answer: 2 },
      { question: "Dans 'Il devient médecin', quelle est la fonction de 'médecin' ?", options: ["COD", "COI", "attribut du sujet", "sujet"], answer: 2 },
    ],
  },

  l7: {
    summary:
      "La formation des mots en français repose sur des éléments combinables : le radical (sens de base), les préfixes (ajoutés avant, changent le sens), et les suffixes (ajoutés après, changent souvent la classe grammaticale ou nuancent le sens).",
    keyPoints: [
      "Radical : partie de base porteuse du sens principal (port dans transporter, apporter)",
      "Préfixe : ajouté avant le radical, modifie le sens (in-, dé-, re-, im-)",
      "Suffixe : ajouté après le radical, change souvent la classe grammaticale (-tion, -able, -ment)",
      "Exemple : re- + faire = refaire (faire à nouveau)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'refaire', quel est le préfixe ?",
        options: ["re-", "faire", "-aire", "fai-"],
        answer: 0,
        explanation: "'Re-' est le préfixe ajouté au radical 'faire', signifiant 'à nouveau'.",
      },
      {
        difficulty: "moyen",
        question: "Quel suffixe transforme souvent un adjectif en nom exprimant une qualité (comme dans 'beauté') ?",
        options: ["-able", "-té", "-eux", "-ment"], 
        answer: 1,
        explanation: "'-té' transforme l'adjectif 'beau' en nom 'beauté'.",
      },
      {
        difficulty: "difficile",
        question: "Décompose le mot 'impossible' en ses éléments :",
        options: ["préfixe 'im-' (négation) + radical 'possible'", "suffixe seul", "aucun préfixe, aucun suffixe", "radical 'im' + suffixe 'possible'"],
        answer: 0,
        explanation: "'Im-' est un préfixe de négation (comme 'in-'), ajouté au radical 'possible' pour former son contraire.",
      },
    ],
    quiz: [
      { question: "Quel élément se place avant le radical ?", options: ["le suffixe", "le préfixe", "la terminaison", "rien"], answer: 1 },
      { question: "Quel élément se place après le radical ?", options: ["le préfixe", "le suffixe", "rien", "toujours un verbe"], answer: 1 },
      { question: "Quel préfixe exprime souvent la négation ?", options: ["re-", "in-/im-", "pré-", "sur-"], answer: 1 },
      { question: "Quel suffixe forme souvent un adverbe ?", options: ["-tion", "-ment", "-eux", "-able"], answer: 1 },
      { question: "Le radical porte :", options: ["le sens de base du mot", "aucun sens", "toujours la négation", "seulement la terminaison verbale"], answer: 0 },
    ],
  },

  l8: {
    summary:
      "Le texte narratif raconte une histoire organisée selon une structure classique en trois parties : la situation initiale (présentation du décor et des personnages), l'élément perturbateur suivi des péripéties (les événements), et la situation finale (la résolution).",
    keyPoints: [
      "Situation initiale : présente les personnages, le lieu, le temps (avant que l'histoire ne commence vraiment)",
      "Élément perturbateur et péripéties : l'événement qui déclenche l'action, puis les événements qui suivent",
      "Situation finale : la résolution, comment l'histoire se termine",
      "Les temps du récit combinent souvent l'imparfait (description) et le passé composé/simple (actions)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle partie du récit présente les personnages et le décor ?",
        options: ["la situation initiale", "l'élément perturbateur", "les péripéties", "la situation finale"],
        answer: 0,
        explanation: "La situation initiale pose le décor et présente les personnages avant que l'action ne commence.",
      },
      {
        difficulty: "moyen",
        question: "Que déclenche l'élément perturbateur ?",
        options: ["la fin de l'histoire", "le début des péripéties (les événements de l'histoire)", "rien de particulier", "la présentation des personnages"],
        answer: 1,
        explanation: "L'élément perturbateur est ce qui vient bouleverser la situation initiale et lance les péripéties.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi utilise-t-on souvent l'imparfait pour la situation initiale et le passé composé pour les péripéties ?",
        options: ["par hasard, sans raison", "l'imparfait décrit une situation stable qui durait, tandis que le passé composé marque les actions ponctuelles qui font avancer l'histoire", "c'est une règle sans justification", "les deux temps sont interchangeables sans nuance"],
        answer: 1,
        explanation: "L'imparfait convient à la description d'un état durable (le décor, les habitudes), tandis que le passé composé marque des actions précises et ponctuelles qui font progresser le récit.",
      },
    ],
    quiz: [
      { question: "Combien de parties structure classiquement un texte narratif ?", options: ["2", "3", "5", "1"], answer: 1 },
      { question: "La situation finale correspond à :", options: ["le début de l'histoire", "la résolution de l'histoire", "les péripéties", "aucune de ces réponses"], answer: 1 },
      { question: "Quel temps décrit souvent le décor initial ?", options: ["le futur", "l'imparfait", "le présent uniquement", "le conditionnel"], answer: 1 },
      { question: "Les péripéties sont :", options: ["les événements de l'histoire", "seulement le décor", "la fin de l'histoire", "les personnages"], answer: 0 },
      { question: "Quel temps marque souvent les actions ponctuelles du récit ?", options: ["l'imparfait", "le passé composé", "le présent", "l'infinitif"], answer: 1 },
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