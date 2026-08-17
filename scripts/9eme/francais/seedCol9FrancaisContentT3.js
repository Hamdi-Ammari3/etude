// scripts/seedCol9FrancaisContentT3.js
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

const LESSON_CONTENT = {
  l24: {
    summary:
      "Le deuxième module de lecture porte sur 'Riquet à la houppe' de Charles Perrault, un conte classique. L'étude d'un conte implique de repérer ses caractéristiques propres (formules d'ouverture/fermeture, éléments merveilleux, moralité), et de développer les compétences de lecture-écriture et de réponse à des questions de compréhension.",
    keyPoints: [
      "Le conte se caractérise par des formules typiques ('Il était une fois...'), des éléments merveilleux (fées, sortilèges), et souvent une moralité finale",
      "Répondre à des questions de compréhension nécessite de justifier ses réponses par des éléments précis du texte",
      "Les contes de Perrault, bien que anciens, abordent souvent des thèmes universels (l'apparence, l'intelligence, la vertu)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle formule ouvre traditionnellement un conte ?",
        options: ["Il était une fois...", "Cher Monsieur...", "Chapitre premier...", "En conclusion..."],
        answer: 0,
        explanation: "'Il était une fois...' est la formule d'ouverture classique des contes traditionnels.",
      },
      {
        difficulty: "moyen",
        question: "Qu'est-ce qu'un élément merveilleux dans un conte ?",
        options: ["un élément surnaturel comme une fée ou un sortilège", "un simple fait historique", "une description réaliste sans magie", "un dialogue ordinaire"],
        answer: 0,
        explanation: "Les éléments merveilleux (fées, sortilèges, transformations magiques) sont typiques du genre du conte.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi les contes classiques comme ceux de Perrault se terminent-ils souvent par une moralité explicite ?",
        options: ["parce que le conte visait traditionnellement à transmettre un enseignement moral ou une leçon de vie au lecteur, en plus de le divertir", "la moralité n'a aucun lien avec le récit du conte", "les contes n'ont jamais de visée éducative", "la moralité remplace toujours l'histoire elle-même"],
        answer: 0,
        explanation: "Le conte classique combine divertissement et enseignement ; la moralité finale explicite la leçon que l'histoire cherche à transmettre au lecteur.",
      },
    ],
    quiz: [
      { question: "Quel élément caractérise souvent un conte ?", options: ["des éléments merveilleux", "uniquement des faits scientifiques", "l'absence totale de personnages", "une structure sans fin"], answer: 0 },
      { question: "Une moralité dans un conte est :", options: ["une leçon ou un enseignement final", "un simple résumé", "une description du décor", "une liste de personnages"], answer: 0 },
      { question: "Répondre à une question de compréhension nécessite de :", options: ["justifier sa réponse par des éléments du texte", "deviner sans justification", "copier tout le texte", "ignorer le texte"], answer: 0 },
      { question: "Charles Perrault est connu pour :", options: ["ses contes classiques", "des romans policiers modernes", "des articles scientifiques", "des pièces de théâtre contemporaines"], answer: 0 },
      { question: "Les thèmes des contes de Perrault sont souvent :", options: ["universels (apparence, intelligence, vertu)", "uniquement techniques", "sans aucun message", "purement historiques"], answer: 0 },
    ],
  },

  l25: {
    summary:
      "L'expression du but précise l'objectif ou l'intention d'une action, souvent introduite par les conjonctions pour que, afin que (suivies du subjonctif), ou par les prépositions pour, afin de (suivies de l'infinitif si le sujet est le même dans les deux propositions).",
    keyPoints: [
      "Pour que / afin que + subjonctif : quand les sujets des deux propositions sont différents (Je lui explique pour qu'il comprenne.)",
      "Pour / afin de + infinitif : quand le sujet est le même dans les deux propositions (Je travaille pour réussir.)",
      "La subordonnée de but répond à la question 'dans quel but ?' ou 'pourquoi faire ?'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Il travaille dur ___ réussir. (même sujet)",
        options: ["pour", "pour que", "afin qu'", "parce que"],
        answer: 0,
        explanation: "Même sujet (il travaille, il réussit) : on utilise 'pour' + infinitif.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Je lui explique la leçon ___ il comprenne. (sujets différents)",
        options: ["pour qu'", "pour", "afin de", "parce qu'"],
        answer: 0,
        explanation: "Sujets différents (je explique, il comprenne) : on utilise 'pour que' + subjonctif.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi utilise-t-on l'infinitif après 'pour' dans 'Elle économise pour voyager', mais le subjonctif après 'pour que' dans 'Elle économise pour que ses enfants voyagent' ?",
        options: ["parce que dans le premier cas le sujet de l'action économiser et voyager est le même (elle), tandis que dans le second cas les sujets sont différents (elle / ses enfants), ce qui impose le subjonctif", "il n'y a aucune règle logique derrière ce choix", "l'infinitif et le subjonctif sont toujours interchangeables sans condition", "le subjonctif s'utilise uniquement quand le sujet est identique"],
        answer: 0,
        explanation: "La règle dépend de l'identité des sujets : même sujet → infinitif (pour + infinitif) ; sujets différents → subjonctif (pour que + subjonctif).",
      },
    ],
    quiz: [
      { question: "Quand utilise-t-on 'pour' + infinitif ?", options: ["quand le sujet est le même dans les deux propositions", "toujours, sans condition", "jamais", "quand les sujets sont différents"], answer: 0 },
      { question: "Quand utilise-t-on 'pour que' + subjonctif ?", options: ["quand les sujets sont différents", "quand le sujet est identique", "jamais", "toujours sans condition"], answer: 0 },
      { question: "La subordonnée de but répond à :", options: ["dans quel but ?", "pourquoi (cause) ?", "quand ?", "comment ?"], answer: 0 },
      { question: "Complète : Nous partons tôt ___ éviter les embouteillages.", options: ["pour", "pour que", "afin qu'", "parce que"], answer: 0 },
      { question: "Complète : Parle plus fort ___ tout le monde t'entende.", options: ["pour que", "pour", "afin de", "parce que"], answer: 0 },
    ],
  },

  l26: {
    summary:
      "Le conditionnel présent exprime un souhait, une politesse, ou une hypothèse (si + imparfait), tandis que le conditionnel passé exprime un regret ou une hypothèse irréelle du passé (si + plus-que-parfait). Ces deux temps, déjà vus, sont ici approfondis et synthétisés.",
    keyPoints: [
      "Conditionnel présent : radical du futur + terminaisons de l'imparfait (je parlerais, elle finirait)",
      "Conditionnel passé : auxiliaire au conditionnel présent + participe passé (j'aurais parlé, elle serait partie)",
      "Emploi : politesse/souhait (conditionnel présent), regret/hypothèse irréelle du passé (conditionnel passé)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au conditionnel présent : Je ___ (vouloir) un renseignement, s'il vous plaît.",
        options: ["voudrais", "veux", "voulais", "voudrai"],
        answer: 0,
        explanation: "'Voudrais' est le conditionnel présent, utilisé par politesse.",
      },
      {
        difficulty: "moyen",
        question: "Complète au conditionnel passé : Si j'avais su, je ___ (venir) t'aider.",
        options: ["serais venu(e)", "viendrais", "venais", "viendrai"],
        answer: 0,
        explanation: "'Si + plus-que-parfait' est suivi du conditionnel passé : serais venu(e).",
      },
      {
        difficulty: "difficile",
        question: "Complète et distingue les deux : 'Si j'avais de l'argent, je ___ (voyager) ; si j'avais économisé plus tôt, je ___ (voyager) déjà cette année.'",
        options: ["voyagerais / aurais voyagé", "aurais voyagé / voyagerais", "voyagerais / voyagerais", "aurais voyagé / aurais voyagé"],
        answer: 0,
        explanation: "'Si + imparfait' → conditionnel présent (voyagerais, hypothèse actuelle) ; 'Si + plus-que-parfait' → conditionnel passé (aurais voyagé, hypothèse irréelle du passé).",
      },
    ],
    quiz: [
      { question: "Comment se forme le conditionnel présent ?", options: ["radical du futur + terminaisons de l'imparfait", "auxiliaire au présent + participe passé", "infinitif seul", "radical du présent + terminaisons du futur"], answer: 0 },
      { question: "Comment se forme le conditionnel passé ?", options: ["auxiliaire au conditionnel présent + participe passé", "radical du futur + terminaisons de l'imparfait", "infinitif seul", "auxiliaire au présent + participe passé"], answer: 0 },
      { question: "Le conditionnel présent exprime souvent :", options: ["la politesse ou un souhait", "un ordre", "une habitude", "un fait certain"], answer: 0 },
      { question: "Le conditionnel passé exprime souvent :", options: ["un regret ou une hypothèse irréelle du passé", "une habitude présente", "un ordre", "une certitude"], answer: 0 },
      { question: "Complète au conditionnel présent : Tu ___ (pouvoir) m'aider ?", options: ["pourrais", "peux", "pouvais", "pourras"], answer: 0 },
    ],
  },

  l27: {
    summary:
      "Les adverbes en -ment se forment généralement à partir du féminin de l'adjectif (lent → lente → lentement), avec des cas particuliers. Les homophones « s'en » (pronom réfléchi 'se' + 'en') et « sans » (préposition marquant l'absence) se distinguent par leur fonction dans la phrase.",
    keyPoints: [
      "Formation des adverbes en -ment : féminin de l'adjectif + ment (lente → lentement), sauf cas particuliers (vrai → vraiment, constant → constamment)",
      "S'en : pronom réfléchi 'se' + pronom 'en' (Il s'en va. / Elle s'en souvient.)",
      "Sans : préposition marquant l'absence (Il part sans bagages.)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel est l'adverbe formé à partir de 'lent' ?",
        options: ["lentement", "lentment", "lenment", "lent"],
        answer: 0,
        explanation: "Féminin de 'lent' = 'lente', + ment = lentement.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Il ___ va sans dire au revoir.",
        options: ["s'en", "sans", "s'an", "cent"],
        answer: 0,
        explanation: "'S'en va' = pronom réfléchi 'se' + 'en', signifiant 'partir'.",
      },
      {
        difficulty: "difficile",
        question: "Complète les deux mots : 'Il part ___ argent, mais il ___ moque.'",
        options: ["sans / s'en", "s'en / sans", "sans / sans", "s'en / s'en"],
        answer: 0,
        explanation: "'Sans argent' (préposition, absence) et 'il s'en moque' (pronom réfléchi + en, 'se moquer de cela').",
      },
    ],
    quiz: [
      { question: "Quel est l'adverbe formé à partir de 'vrai' ? (cas particulier)", options: ["vraiment", "vraiement", "vraiment", "vraiement"], answer: 0 },
      { question: "'Sans' est une :", options: ["préposition marquant l'absence", "un pronom réfléchi", "un adverbe", "une conjonction"], answer: 0 },
      { question: "'S'en' contient :", options: ["le pronom réfléchi 'se' et le pronom 'en'", "uniquement une préposition", "uniquement un adverbe", "rien de particulier"], answer: 0 },
      { question: "Complète : 'Elle ___ souvient encore.' (s'en/sans)", options: ["s'en", "sans"], answer: 0 },
      { question: "Complète : 'Il est parti ___ un mot.' (s'en/sans)", options: ["sans", "s'en"], answer: 0 },
    ],
  },

  l28: {
    summary:
      "Écrire des lettres variées (personnelle, formelle, de motivation) et répondre par écrit à des questions de compréhension nécessitent d'adapter le registre et la structure selon le contexte, tout en formulant des réponses complètes et justifiées pour la compréhension de texte.",
    keyPoints: [
      "Lettre personnelle : registre familier, formules chaleureuses (Cher/Chère..., Grosses bises)",
      "Lettre formelle : registre soutenu, formules codifiées (Madame, Monsieur, Veuillez agréer...)",
      "Répondre à une question de compréhension : phrase complète, reformulation avec ses propres mots, justification par une référence au texte",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle formule convient pour ouvrir une lettre formelle à un inconnu ?",
        options: ["Madame, Monsieur,", "Salut !", "Cher ami,", "Coucou,"],
        answer: 0,
        explanation: "'Madame, Monsieur,' est la formule d'ouverture standard pour une lettre formelle adressée à un destinataire inconnu.",
      },
      {
        difficulty: "moyen",
        question: "Pour répondre à une question de compréhension, il faut :",
        options: ["répondre par une phrase complète et justifiée", "répondre par un seul mot", "copier une phrase du texte sans l'expliquer", "deviner sans lire le texte"],
        answer: 0,
        explanation: "Une bonne réponse de compréhension doit être formulée en phrase complète et appuyée par une justification tirée du texte.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi est-il préférable de reformuler avec ses propres mots plutôt que de recopier telle quelle une phrase du texte lorsqu'on répond à une question de compréhension ?",
        options: ["parce que la reformulation montre une compréhension réelle du contenu, plutôt qu'une simple capacité à repérer et copier une information", "il est toujours interdit de citer le texte, même brièvement", "recopier le texte est toujours la meilleure stratégie", "la reformulation change le sens de la réponse"],
        answer: 0,
        explanation: "Reformuler avec ses propres mots démontre que l'on a compris le sens du passage, et pas seulement localisé une information à copier mécaniquement.",
      },
    ],
    quiz: [
      { question: "Quelle formule convient pour clore une lettre formelle ?", options: ["Veuillez agréer mes salutations distinguées.", "Bisous !", "À plus !", "Salut !"], answer: 0 },
      { question: "Une lettre personnelle utilise un registre :", options: ["familier", "toujours très formel", "administratif", "juridique"], answer: 0 },
      { question: "Une bonne réponse de compréhension doit être :", options: ["complète et justifiée", "un seul mot", "une copie exacte du texte", "vague et sans preuve"], answer: 0 },
      { question: "Le choix du registre d'une lettre dépend :", options: ["du destinataire et du contexte", "de rien en particulier", "toujours du même registre", "de la longueur du texte uniquement"], answer: 0 },
      { question: "Justifier une réponse de compréhension signifie :", options: ["s'appuyer sur un élément précis du texte", "deviner sans preuve", "ignorer le texte", "inventer une réponse"], answer: 0 },
    ],
  },

  l29: {
    summary:
      "Révision générale et préparation finale à l'examen du برفوي : synthèse de tous les acquis de l'année (grammaire, conjugaison, orthographe, vocabulaire, types de textes), avec un focus sur la méthodologie d'examen (gestion du temps, compréhension de texte, production écrite structurée).",
    keyPoints: [
      "Grammaire : subordonnées (temps, cause, conséquence, but, opposition), voix passive, expression de l'opinion",
      "Conjugaison : passé simple, plus-que-parfait, futur antérieur, subjonctif présent, conditionnel présent/passé",
      "Méthodologie d'examen : lire attentivement le texte, répondre avec précision, structurer la production écrite (introduction, développement, conclusion)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel temps exprime une action antérieure à une autre action passée ?",
        options: ["le plus-que-parfait", "le futur simple", "le présent", "l'impératif"],
        answer: 0,
        explanation: "Le plus-que-parfait marque l'antériorité par rapport à une autre action déjà au passé.",
      },
      {
        difficulty: "moyen",
        question: "Complète au subjonctif : Il faut que nous ___ (être) prêts à temps.",
        options: ["soyons", "sommes", "serons", "étions"],
        answer: 0,
        explanation: "Subjonctif présent de 'être' à la 1ère personne du pluriel : que nous soyons.",
      },
      {
        difficulty: "difficile",
        question: "Lors de l'examen, comment structurer efficacement une production écrite argumentative dans le temps imparti ?",
        options: ["consacrer un temps court à un plan rapide (thèse + 2-3 arguments avec exemples), rédiger directement, puis garder quelques minutes pour la relecture finale", "rédiger sans aucun plan pour gagner du temps", "consacrer presque tout le temps à la réflexion sans jamais écrire", "ignorer la relecture pour gagner du temps"],
        answer: 0,
        explanation: "Un plan rapide avant la rédaction organise les idées efficacement, tandis que garder du temps pour la relecture permet de corriger les erreurs avant la remise, une stratégie équilibrée pour un temps d'examen limité.",
      },
    ],
    quiz: [
      { question: "Quelle conjonction introduit une subordonnée de but ?", options: ["pour que", "parce que", "quand", "bien que"], answer: 0 },
      { question: "Quel temps exprime un regret sur le passé ?", options: ["le conditionnel passé", "le futur simple", "le présent", "l'impératif"], answer: 0 },
      { question: "La voix passive utilise l'auxiliaire :", options: ["être", "avoir", "aller", "faire"], answer: 0 },
      { question: "Une bonne gestion du temps à l'examen inclut :", options: ["un plan rapide et une relecture finale", "aucune préparation", "ignorer les consignes", "rédiger sans jamais relire"], answer: 0 },
      { question: "Répondre à une question de compréhension nécessite :", options: ["une justification tirée du texte", "une réponse d'un seul mot", "une copie exacte sans reformulation", "aucune référence au texte"], answer: 0 },
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