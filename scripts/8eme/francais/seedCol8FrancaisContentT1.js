// scripts/seedCol8FrancaisContentT1.js
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

// Trimestre 1 — lessons l1 through l8
const LESSON_CONTENT = {
  l1: {
    summary:
      "Approfondissement des quatre types de phrases (déclarative, interrogative, exclamative, impérative) et de leurs formes (affirmative/négative), avec des cas plus complexes comme les questions à choix multiples ou les phrases combinant plusieurs formes.",
    keyPoints: [
      "Rappel : déclarative, interrogative, exclamative, impérative — chaque type peut être affirmatif ou négatif",
      "Question totale (réponse oui/non) vs question partielle (avec un mot interrogatif)",
      "Une phrase peut combiner plusieurs négations : Je ne mange jamais rien le matin.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle phrase est une question partielle ?",
        options: ["Aimes-tu le café ?", "Où habites-tu ?", "Il fait beau.", "Range ta chambre !"],
        answer: 1,
        explanation: "'Où habites-tu ?' contient un mot interrogatif (où), c'est une question partielle.",
      },
      {
        difficulty: "moyen",
        question: "Quelle phrase est une question totale ?",
        options: ["Où vas-tu ?", "Que fais-tu ?", "As-tu fini ?", "Pourquoi pleures-tu ?"],
        answer: 2,
        explanation: "'As-tu fini ?' se répond par oui ou non, c'est une question totale.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase combine une forme interrogative et négative correctement ?",
        options: ["Ne viens-tu pas ?", "Viens tu ne pas ?", "Ne pas viens-tu ?", "Tu ne viens ?"],
        answer: 0,
        explanation: "'Ne viens-tu pas ?' combine correctement l'inversion interrogative avec la négation encadrant le verbe.",
      },
    ],
    quiz: [
      { question: "Quel signe termine une phrase exclamative ?", options: [".", "!", "?", ","], answer: 1 },
      { question: "'Est-ce que tu viens ?' est une question :", options: ["totale", "partielle", "ni l'une ni l'autre", "négative"], answer: 0 },
      { question: "Quel mot introduit une question partielle ?", options: ["est-ce que", "quand", "oui", "non"], answer: 1 },
      { question: "Quelle phrase est impérative ?", options: ["Il vient.", "Vient-il ?", "Viens ici !", "Quel bonheur !"], answer: 2 },
      { question: "Une phrase peut-elle être à la fois interrogative et négative ?", options: ["oui", "non, jamais", "seulement à l'écrit", "seulement à l'oral"], answer: 0 },
    ],
  },

  l2: {
    summary:
      "Les propositions subordonnées circonstancielles de temps sont introduites par des conjonctions comme quand, lorsque, dès que, avant que, après que, et précisent le moment où se déroule l'action de la principale.",
    keyPoints: [
      "Conjonctions de temps : quand, lorsque, dès que, avant que, après que, pendant que",
      "'Avant que' et 'jusqu'à ce que' sont suivis du subjonctif",
      "La subordonnée de temps répond à la question 'quand ?'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle conjonction introduit une subordonnée de temps ?",
        options: ["parce que", "quand", "afin que", "bien que"],
        answer: 1,
        explanation: "'Quand' est une conjonction de temps typique.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Il est parti dès que la cloche a sonné', quelle est la subordonnée de temps ?",
        options: ["Il est parti", "dès que la cloche a sonné", "toute la phrase", "aucune"],
        answer: 1,
        explanation: "'Dès que la cloche a sonné' est introduite par 'dès que' et indique le moment de l'action.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi 'avant que' est-il suivi du subjonctif alors que 'après que' est suivi de l'indicatif ?",
        options: ["'Avant que' exprime une action non encore réalisée au moment de la principale (incertaine), tandis que 'après que' exprime une action déjà accomplie (certaine)", "il n'y a pas de raison, c'est arbitraire", "les deux sont suivis du même mode", "'après que' est toujours suivi du subjonctif aussi"],
        answer: 0,
        explanation: "'Avant que' introduit une action future par rapport à la principale, donc incertaine (subjonctif), tandis que 'après que' introduit une action déjà réalisée, donc certaine (indicatif).",
      },
    ],
    quiz: [
      { question: "Quelle conjonction signifie 'au moment où' ?", options: ["parce que", "lorsque", "bien que", "afin que"], answer: 1 },
      { question: "La subordonnée de temps répond à :", options: ["quand ?", "pourquoi ?", "comment ?", "où ?"], answer: 0 },
      { question: "Quelle conjonction est suivie du subjonctif ?", options: ["après que", "avant que", "dès que", "quand"], answer: 1 },
      { question: "Complète : '___ il pleuvait, nous sommes restés à la maison.' (pendant que)", options: ["Pendant que", "Parce que", "Afin que", "Bien que"], answer: 0 },
      { question: "Quelle conjonction signifie 'immédiatement après' ?", options: ["dès que", "avant que", "bien que", "afin que"], answer: 0 },
    ],
  },

  l3: {
    summary:
      "Les propositions subordonnées circonstancielles de cause (introduites par parce que, comme, puisque) expliquent pourquoi une action se produit, tandis que celles de conséquence (introduites par si bien que, de sorte que) expriment le résultat de cette action.",
    keyPoints: [
      "Cause : parce que, car, comme, puisque — répond à 'pourquoi ?'",
      "Conséquence : si bien que, de sorte que, donc, alors — exprime le résultat",
      "'Comme' se place toujours en début de phrase quand il exprime la cause",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle conjonction exprime la cause ?",
        options: ["parce que", "donc", "de sorte que", "si bien que"],
        answer: 0,
        explanation: "'Parce que' introduit la cause d'une action.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Il a beaucoup travaillé, si bien qu'il a réussi', quelle est la subordonnée de conséquence ?",
        options: ["Il a beaucoup travaillé", "si bien qu'il a réussi", "toute la phrase", "aucune"],
        answer: 1,
        explanation: "'Si bien qu'il a réussi' exprime le résultat (la conséquence) du fait d'avoir beaucoup travaillé.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase illustre correctement l'usage de 'comme' pour exprimer la cause ?",
        options: ["Comme il pleuvait, nous sommes restés à la maison.", "Nous sommes restés à la maison comme il pleuvait.", "Il pleuvait comme nous sommes restés.", "Comme nous sommes restés, il pleuvait."],
        answer: 0,
        explanation: "'Comme' exprimant la cause se place en début de phrase : Comme il pleuvait, nous sommes restés à la maison.",
      },
    ],
    quiz: [
      { question: "Quelle conjonction exprime la conséquence ?", options: ["parce que", "de sorte que", "puisque", "comme"], answer: 1 },
      { question: "La subordonnée de cause répond à :", options: ["pourquoi ?", "quand ?", "comment ?", "où ?"], answer: 0 },
      { question: "Où se place généralement 'comme' exprimant la cause ?", options: ["en début de phrase", "en fin de phrase", "au milieu seulement", "n'importe où"], answer: 0 },
      { question: "Complète : 'Il est arrivé en retard, ___ il a manqué le début.' (conséquence)", options: ["de sorte que", "parce que", "comme", "puisque"], answer: 0 },
      { question: "Quelle conjonction exprime la cause ?", options: ["si bien que", "puisque", "donc", "alors"], answer: 1 },
    ],
  },

  l4: {
    summary:
      "Le plus-que-parfait exprime une action passée antérieure à une autre action passée (une action 'avant le passé'). Il se forme avec l'auxiliaire être ou avoir à l'imparfait, suivi du participe passé.",
    keyPoints: [
      "Formation : auxiliaire (être/avoir) à l'imparfait + participe passé",
      "Exemple : j'avais mangé, elle était partie",
      "Usage : exprime une action antérieure à une autre action passée (Quand je suis arrivé, il était déjà parti)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au plus-que-parfait : J'___ (manger) avant de sortir.",
        options: ["ai mangé", "avais mangé", "mangeais", "mangerai"],
        answer: 1,
        explanation: "Plus-que-parfait : avais (imparfait de avoir) + mangé (participe passé).",
      },
      {
        difficulty: "moyen",
        question: "Complète au plus-que-parfait : Elle ___ (partir) quand je suis arrivé.",
        options: ["est partie", "était partie", "partait", "part"],
        answer: 1,
        explanation: "'Partir' utilise être à l'imparfait : était partie.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi utilise-t-on le plus-que-parfait dans 'Quand je suis arrivé, il était déjà parti' ?",
        options: ["parce que l'action de partir (plus-que-parfait) s'est produite avant l'action d'arriver (passé composé), donc plus loin dans le passé", "par hasard, sans règle précise", "les deux temps sont interchangeables ici", "le plus-que-parfait n'a aucune fonction spécifique"],
        answer: 0,
        explanation: "Le plus-que-parfait marque l'antériorité : l'action de 'partir' a eu lieu avant celle d'arriver, qui elle-même est déjà au passé (passé composé).",
      },
    ],
    quiz: [
      { question: "Le plus-que-parfait exprime :", options: ["une action antérieure à une autre action passée", "une action future", "une action présente", "une action habituelle"], answer: 0 },
      { question: "Complète : Tu ___ (finir) tes devoirs avant le dîner.", options: ["as fini", "avais fini", "finissais", "finiras"], answer: 1 },
      { question: "Comment se forme le plus-que-parfait ?", options: ["auxiliaire à l'imparfait + participe passé", "auxiliaire au présent + participe passé", "radical + terminaisons", "infinitif seul"], answer: 0 },
      { question: "Complète : Nous ___ (voir) ce film avant.", options: ["avons vu", "avions vu", "voyions", "verrons"], answer: 1 },
      { question: "Complète : Ils ___ (arriver) tôt ce matin-là.", options: ["sont arrivés", "étaient arrivés", "arrivaient", "arriveront"], answer: 1 },
    ],
  },

  l5: {
    summary:
      "Approfondissement des fonctions possibles du groupe nominal dans la phrase : sujet, COD, COI, complément circonstanciel, ou attribut, avec attention particulière aux groupes nominaux complexes contenant plusieurs expansions.",
    keyPoints: [
      "Le groupe nominal peut occuper plusieurs fonctions selon sa place et son rôle dans la phrase",
      "Un même groupe nominal enrichi de plusieurs expansions (adjectif + complément du nom) garde une seule fonction dans la phrase",
      "Identifier la fonction nécessite de repérer le verbe et de poser les bonnes questions",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Le grand chien noir aboie', quelle est la fonction de 'Le grand chien noir' ?",
        options: ["sujet", "COD", "COI", "attribut"],
        answer: 0,
        explanation: "'Le grand chien noir' répond à 'qui est-ce qui aboie ?', c'est le sujet.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Elle a acheté une belle robe rouge', quelle est la fonction de 'une belle robe rouge' ?",
        options: ["sujet", "COD", "COI", "attribut"],
        answer: 1,
        explanation: "'Une belle robe rouge' répond à 'a acheté quoi ?', c'est le COD.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Le professeur de mathématiques que j'admire beaucoup est absent aujourd'hui', quelle est la fonction du groupe nominal complexe 'Le professeur de mathématiques que j'admire beaucoup' ?",
        options: ["sujet", "COD", "COI", "attribut"],
        answer: 0,
        explanation: "Malgré sa longueur et ses expansions (complément du nom + proposition relative), ce groupe nominal complexe reste le sujet de 'est absent'.",
      },
    ],
    quiz: [
      { question: "Un groupe nominal peut-il avoir plusieurs expansions ?", options: ["oui", "non, une seule maximum", "jamais", "seulement au pluriel"], answer: 0 },
      { question: "Dans 'Il offre un cadeau à sa sœur', quelle est la fonction de 'à sa sœur' ?", options: ["sujet", "COD", "COI", "attribut"], answer: 2 },
      { question: "Pour identifier la fonction d'un groupe nominal, on doit repérer :", options: ["le verbe et poser les bonnes questions", "seulement sa longueur", "seulement sa position", "rien de particulier"], answer: 0 },
      { question: "Dans 'Elle semble fatiguée', quelle est la fonction de 'fatiguée' ?", options: ["sujet", "COD", "COI", "attribut du sujet"], answer: 3 },
      { question: "Un groupe nominal complexe avec plusieurs expansions garde :", options: ["une seule fonction dans la phrase", "plusieurs fonctions différentes", "aucune fonction précise", "toujours la fonction sujet"], answer: 0 },
    ],
  },

  l6: {
    summary:
      "Les mots peuvent se former par dérivation (ajout de préfixes/suffixes à un radical) ou par composition (assemblage de deux mots existants pour en créer un nouveau, comme 'porte-monnaie' ou 'grand-mère').",
    keyPoints: [
      "Dérivation : radical + préfixe et/ou suffixe (heureux → malheureux, malheureusement)",
      "Composition : assemblage de deux mots existants (porte-monnaie, grand-mère, tire-bouchon)",
      "Les mots composés s'écrivent souvent avec un trait d'union",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel mot est formé par dérivation ?",
        options: ["porte-monnaie", "malheureux", "grand-mère", "tire-bouchon"],
        answer: 1,
        explanation: "'Malheureux' est formé par dérivation : préfixe 'mal-' + radical 'heureux'.",
      },
      {
        difficulty: "moyen",
        question: "Quel mot est formé par composition ?",
        options: ["impossible", "gentillesse", "porte-clés", "rapidement"],
        answer: 2,
        explanation: "'Porte-clés' est formé par composition : assemblage de 'porte' et 'clés'.",
      },
      {
        difficulty: "difficile",
        question: "Décompose 'malheureusement' en ses éléments de dérivation :",
        options: ["préfixe 'mal-' + radical 'heureux' + suffixe '-ement'", "aucune décomposition possible", "composition de deux mots seulement", "suffixe seul sans préfixe"],
        answer: 0,
        explanation: "'Malheureusement' combine le préfixe 'mal-' (négation), le radical 'heureux', et le suffixe '-ement' (formant un adverbe).",
      },
    ],
    quiz: [
      { question: "La composition assemble :", options: ["deux mots existants", "un préfixe et un radical seulement", "rien de particulier", "toujours trois mots"], answer: 0 },
      { question: "Quel mot est composé ?", options: ["rapidement", "grand-père", "impossible", "gentillesse"], answer: 1 },
      { question: "Les mots composés s'écrivent souvent avec :", options: ["un trait d'union", "une majuscule", "un accent", "rien de spécial"], answer: 0 },
      { question: "Quel mot est dérivé du radical 'possible' ?", options: ["impossible", "porte-monnaie", "grand-mère", "tire-bouchon"], answer: 0 },
      { question: "La dérivation utilise :", options: ["préfixes et/ou suffixes", "assemblage de deux mots complets", "rien de particulier", "toujours des chiffres"], answer: 0 },
    ],
  },

  l7: {
    summary:
      "Les paronymes sont des mots dont la prononciation est proche mais pas identique, et dont le sens diffère (comme 'conjecture' et 'conjoncture'). Les niveaux de langue (familier, courant, soutenu) permettent d'adapter son expression au contexte.",
    keyPoints: [
      "Paronymes : mots de prononciation proche mais de sens différent (éminent/imminent, allusion/illusion)",
      "Niveau familier : langage relâché, utilisé entre proches",
      "Niveau courant : langage standard, utilisé au quotidien",
      "Niveau soutenu : langage recherché, utilisé à l'écrit formel",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quels mots sont des paronymes ?",
        options: ["chat / chien", "éminent / imminent", "grand / petit", "content / joyeux"],
        answer: 1,
        explanation: "'Éminent' et 'imminent' se prononcent de façon proche mais ont des sens différents : ce sont des paronymes.",
      },
      {
        difficulty: "moyen",
        question: "Quel registre convient à une lettre administrative ?",
        options: ["familier", "courant", "soutenu", "aucun registre particulier"],
        answer: 2,
        explanation: "Le registre soutenu convient aux écrits formels comme les lettres administratives.",
      },
      {
        difficulty: "difficile",
        question: "Quelle est la différence de sens entre 'allusion' et 'illusion' ?",
        options: ["'Allusion' désigne une référence indirecte à quelque chose, tandis qu''illusion' désigne une perception ou croyance fausse", "les deux mots ont exactement le même sens", "'illusion' désigne une référence indirecte", "aucune différence de sens n'existe"],
        answer: 0,
        explanation: "Ces deux paronymes ont des sens bien distincts : 'allusion' est une évocation indirecte, tandis qu''illusion' est une perception trompeuse de la réalité.",
      },
    ],
    quiz: [
      { question: "Quel registre est utilisé entre amis proches ?", options: ["familier", "courant", "soutenu", "aucun"], answer: 0 },
      { question: "Les paronymes ont une prononciation :", options: ["identique", "proche mais pas identique", "totalement différente", "sans importance"], answer: 1 },
      { question: "Quel registre est utilisé au quotidien de façon standard ?", options: ["familier", "courant", "soutenu", "aucun"], answer: 1 },
      { question: "Quels mots sont des paronymes ?", options: ["conjecture / conjoncture", "beau / laid", "chat / souris", "vite / lentement"], answer: 0 },
      { question: "Adapter son registre de langue dépend :", options: ["du contexte et du destinataire", "de rien en particulier", "toujours du même registre", "de la météo"], answer: 0 },
    ],
  },

  l8: {
    summary:
      "Écrire un récit cohérent au passé nécessite de maintenir une cohérence temporelle : combiner correctement l'imparfait (description, actions habituelles) et le passé composé ou simple (actions ponctuelles) tout au long du texte, sans mélanger les repères temporels de façon incohérente.",
    keyPoints: [
      "Cohérence des temps : ne pas mélanger arbitrairement passé composé, imparfait, et présent dans un même récit",
      "L'imparfait installe le décor et les habitudes ; le passé composé fait avancer l'action",
      "Relire son texte pour vérifier que les temps sont utilisés de façon cohérente du début à la fin",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Pourquoi est-il important de maintenir une cohérence des temps dans un récit ?",
        options: ["pour que le lecteur suive facilement la chronologie et la logique du récit", "ce n'est pas important", "pour rendre le texte plus long", "pour éviter d'utiliser des adjectifs"],
        answer: 0,
        explanation: "La cohérence des temps permet au lecteur de comprendre clairement quand se déroulent les événements et leur ordre chronologique.",
      },
      {
        difficulty: "moyen",
        question: "Quelle phrase illustre une bonne cohérence temporelle dans un récit au passé ?",
        options: ["Il pleuvait fort quand elle est sortie sans parapluie.", "Il pleut fort quand elle était sortie sans parapluie.", "Il pleuvait fort quand elle sort sans parapluie.", "Il a plu fort quand elle sortira sans parapluie."],
        answer: 0,
        explanation: "'Il pleuvait' (imparfait, décor) et 'elle est sortie' (passé composé, action) sont cohérents et bien combinés dans un récit au passé.",
      },
      {
        difficulty: "difficile",
        question: "Dans un récit au passé, pourquoi éviter de basculer soudainement au présent sans raison stylistique claire ?",
        options: ["cela peut créer une confusion temporelle chez le lecteur, sauf si ce changement est volontaire et stylistiquement justifié (comme le 'présent de narration')", "il est toujours interdit d'utiliser le présent dans un récit", "le présent et le passé sont toujours interchangeables sans conséquence", "cela n'a aucune importance pour la compréhension"],
        answer: 0,
        explanation: "Un changement de temps non justifié peut perturber la compréhension du lecteur ; cependant, le 'présent de narration' est parfois utilisé volontairement pour dynamiser un récit, mais cela reste un choix stylistique conscient et non un mélange accidentel.",
      },
    ],
    quiz: [
      { question: "L'imparfait s'utilise généralement pour :", options: ["la description et les habitudes passées", "les actions ponctuelles uniquement", "le futur", "les questions"], answer: 0 },
      { question: "Le passé composé s'utilise généralement pour :", options: ["la description", "les actions ponctuelles qui font avancer le récit", "les habitudes présentes", "les hypothèses"], answer: 1 },
      { question: "Relire son texte aide à :", options: ["vérifier la cohérence des temps", "rien de particulier", "allonger le texte", "compliquer l'histoire"], answer: 0 },
      { question: "Un mélange incohérent des temps peut :", options: ["créer de la confusion chez le lecteur", "améliorer automatiquement le texte", "n'avoir aucun effet", "raccourcir le récit"], answer: 0 },
      { question: "Le 'présent de narration' est :", options: ["un choix stylistique volontaire dans un récit au passé", "toujours une erreur", "obligatoire dans tout récit", "impossible à utiliser"], answer: 0 },
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