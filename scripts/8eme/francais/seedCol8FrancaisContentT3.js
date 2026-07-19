// scripts/seedCol8FrancaisContentT3.js
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

// Trimestre 3 — lessons l17 through l24
const LESSON_CONTENT = {
  l17: {
    summary:
      "Le discours rapporté au passé demande une concordance des temps précise : le présent devient imparfait, le passé composé devient plus-que-parfait, le futur devient conditionnel, et les indicateurs temporels/spatiaux changent également (demain→le lendemain, ici→là).",
    keyPoints: [
      "Présent → imparfait : Il dit 'Je pars' → Il a dit qu'il partait.",
      "Passé composé → plus-que-parfait : Il dit 'J'ai fini' → Il a dit qu'il avait fini.",
      "Futur → conditionnel : Il dit 'Je viendrai' → Il a dit qu'il viendrait.",
      "Changements d'indicateurs : demain→le lendemain, hier→la veille, ici→là",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Transforme au discours rapporté (verbe introducteur au passé) : Il dit : « Je suis fatigué. »",
        options: ["Il a dit qu'il était fatigué.", "Il a dit qu'il est fatigué.", "Il dit qu'il était fatigué.", "Il a dit qu'il sera fatigué."],
        answer: 0,
        explanation: "Le présent 'suis' devient imparfait 'était' dans le discours rapporté au passé.",
      },
      {
        difficulty: "moyen",
        question: "Transforme : Elle dit : « J'ai terminé mon travail. »",
        options: ["Elle a dit qu'elle avait terminé son travail.", "Elle a dit qu'elle a terminé son travail.", "Elle dit qu'elle avait terminé.", "Elle a dit qu'elle terminera."],
        answer: 0,
        explanation: "Le passé composé 'ai terminé' devient plus-que-parfait 'avait terminé'.",
      },
      {
        difficulty: "difficile",
        question: "Transforme en tenant compte des indicateurs temporels : Il a dit : « Je viendrai demain. »",
        options: ["Il a dit qu'il viendrait le lendemain.", "Il a dit qu'il viendra demain.", "Il a dit qu'il vient demain.", "Il a dit qu'il viendrait demain."],
        answer: 0,
        explanation: "Le futur 'viendrai' devient conditionnel 'viendrait', et 'demain' devient 'le lendemain' car le repère temporel change.",
      },
    ],
    quiz: [
      { question: "Le présent devient quel temps au discours rapporté du passé ?", options: ["imparfait", "passé composé", "futur", "conditionnel"], answer: 0 },
      { question: "Le futur devient quel temps au discours rapporté du passé ?", options: ["imparfait", "plus-que-parfait", "conditionnel", "présent"], answer: 2 },
      { question: "Comment devient 'hier' au discours rapporté du passé ?", options: ["la veille", "le lendemain", "aujourd'hui", "hier reste identique"], answer: 0 },
      { question: "Le passé composé devient quel temps au discours rapporté du passé ?", options: ["imparfait", "plus-que-parfait", "futur", "conditionnel"], answer: 1 },
      { question: "Comment devient 'ici' au discours rapporté du passé ?", options: ["là", "demain", "hier", "ici reste identique"], answer: 0 },
    ],
  },

  l18: {
    summary:
      "Les figures de style avancées enrichissent l'expression littéraire : l'antithèse oppose deux idées contraires dans la même phrase, l'hyperbole exagère pour insister, et la gradation présente une série d'éléments par intensité croissante ou décroissante.",
    keyPoints: [
      "Antithèse : opposition de deux idées contraires (C'était le meilleur des temps, c'était le pire des temps.)",
      "Hyperbole : exagération pour insister (Je meurs de faim ! J'ai attendu une éternité.)",
      "Gradation : succession d'éléments par intensité croissante ou décroissante (Il pleure, il sanglote, il s'effondre.)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle phrase contient une hyperbole ?",
        options: ["J'ai un peu faim.", "Je meurs de faim !", "Il fait beau aujourd'hui.", "Le ciel est bleu."],
        answer: 1,
        explanation: "'Je meurs de faim !' est une exagération volontaire pour insister sur la faim ressentie, c'est une hyperbole.",
      },
      {
        difficulty: "moyen",
        question: "Quelle phrase contient une antithèse ?",
        options: ["Il est grand et fort.", "Elle rit et pleure en même temps.", "Le soleil brille.", "Il court vite."],
        answer: 1,
        explanation: "'Rit et pleure' oppose deux émotions contraires dans la même phrase, c'est une antithèse.",
      },
      {
        difficulty: "difficile",
        question: "Identifie la figure de style dans 'Il sourit, il rit, il éclate de rire' :",
        options: ["une gradation, car les actions augmentent en intensité", "une antithèse", "une hyperbole seule", "aucune figure de style"],
        answer: 0,
        explanation: "La succession 'sourit → rit → éclate de rire' présente une intensité croissante, c'est une gradation.",
      },
    ],
    quiz: [
      { question: "L'antithèse oppose :", options: ["deux idées contraires", "deux mots identiques", "rien de particulier", "toujours des chiffres"], answer: 0 },
      { question: "L'hyperbole sert à :", options: ["exagérer pour insister", "minimiser un fait", "décrire neutralement", "poser une question"], answer: 0 },
      { question: "La gradation présente une série d'éléments par :", options: ["intensité croissante ou décroissante", "ordre alphabétique", "couleur", "rien de particulier"], answer: 0 },
      { question: "'Une immense petite fille' illustre :", options: ["une antithèse", "une hyperbole seule", "une gradation", "aucune figure de style"], answer: 0 },
      { question: "'J'ai des milliers de choses à te dire' est :", options: ["une hyperbole", "une antithèse", "une gradation", "aucune figure de style"], answer: 0 },
    ],
  },

  l19: {
    summary:
      "L'expression de l'hypothèse varie selon le degré de probabilité : 'si + présent' pour une hypothèse réalisable, 'si + imparfait' pour une hypothèse peu probable ou irréelle au présent, et 'si + plus-que-parfait' pour une hypothèse irréelle dans le passé.",
    keyPoints: [
      "Si + présent → futur simple (réalisable) : Si tu étudies, tu réussiras.",
      "Si + imparfait → conditionnel présent (peu probable/irréel présent) : Si j'avais de l'argent, je voyagerais.",
      "Si + plus-que-parfait → conditionnel passé (irréel du passé) : Si j'avais su, je serais venu.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Si tu ___ (étudier), tu réussiras.",
        options: ["étudies", "étudiais", "avais étudié", "étudierais"],
        answer: 0,
        explanation: "'Si + présent' est suivi du futur dans la principale : si tu étudies, tu réussiras.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Si j'___ (avoir) plus de temps, je voyagerais davantage.",
        options: ["ai", "avais", "aurais", "avais eu"],
        answer: 1,
        explanation: "'Si + imparfait' est suivi du conditionnel présent : si j'avais, je voyagerais.",
      },
      {
        difficulty: "difficile",
        question: "Complète et identifie le degré de probabilité : 'Si j'___ (savoir) plus tôt, je ___ (venir) t'aider.'",
        options: ["avais su / serais venu — hypothèse irréelle du passé", "sais / viendrai — hypothèse réalisable", "savais / viendrais — hypothèse peu probable au présent", "aurais su / viens"],
        answer: 0,
        explanation: "'Si + plus-que-parfait' (avais su) suivi du conditionnel passé (serais venu) exprime une hypothèse irréelle dans le passé — l'action ne s'est pas produite.",
      },
    ],
    quiz: [
      { question: "'Si + présent' est suivi de quel temps ?", options: ["futur simple", "conditionnel présent", "conditionnel passé", "imparfait"], answer: 0 },
      { question: "'Si + imparfait' est suivi de quel temps ?", options: ["futur simple", "conditionnel présent", "conditionnel passé", "présent"], answer: 1 },
      { question: "'Si + plus-que-parfait' est suivi de quel temps ?", options: ["futur simple", "conditionnel présent", "conditionnel passé", "imparfait"], answer: 2 },
      { question: "Complète : Si nous ___ (partir) tôt, nous arriverons à temps.", options: ["partons", "partions", "étions partis", "partirions"], answer: 0 },
      { question: "'Si + imparfait + conditionnel présent' exprime une hypothèse :", options: ["peu probable ou irréelle au présent", "certaine et réalisable", "irréelle du passé uniquement", "aucune hypothèse"], answer: 0 },
    ],
  },

  l20: {
    summary:
      "La ponctuation expressive (points de suspension, tirets, guillemets utilisés stylistiquement) enrichit le texte en créant des effets particuliers : suspense, hésitation, ironie, ou mise en valeur d'un mot ou d'une expression.",
    keyPoints: [
      "Points de suspension (...) : créent une pause, un suspense, ou une hésitation",
      "Tirets d'incise : isolent une remarque ou un commentaire à l'intérieur d'une phrase",
      "Guillemets stylistiques : peuvent signaler une ironie ou un sens détourné d'un mot",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Que suggèrent les points de suspension dans 'Il hésita... puis répondit.' ?",
        options: ["une pause ou une hésitation", "une certitude totale", "la fin définitive du texte", "rien de particulier"],
        answer: 0,
        explanation: "Les points de suspension créent un effet de pause ou d'hésitation dans le récit.",
      },
      {
        difficulty: "moyen",
        question: "Quel est le rôle des tirets dans 'Mon frère – qui est très timide – a refusé de parler.' ?",
        options: ["isoler une remarque à l'intérieur de la phrase", "terminer la phrase", "poser une question", "exprimer une négation"], 
        answer: 0,
        explanation: "Les tirets encadrent une information supplémentaire (une incise) insérée dans la phrase principale.",
      },
      {
        difficulty: "difficile",
        question: "Dans la phrase 'Quel « génie » ! Il a encore tout raté.', que suggèrent les guillemets autour de 'génie' ?",
        options: ["une ironie : le mot est utilisé dans un sens opposé à son sens habituel", "un sens littéral et sincère du mot", "une citation exacte de quelqu'un d'autre", "aucune nuance particulière"],
        answer: 0,
        explanation: "Les guillemets ici signalent une ironie : le locuteur utilise 'génie' de façon sarcastique, sachant que la personne a échoué.",
      },
    ],
    quiz: [
      { question: "Les points de suspension créent souvent :", options: ["une pause ou un suspense", "une certitude absolue", "rien de particulier", "une négation"], answer: 0 },
      { question: "Les tirets d'incise servent à :", options: ["isoler une remarque dans la phrase", "terminer un texte", "poser une question", "remplacer la virgule toujours"], answer: 0 },
      { question: "Des guillemets autour d'un mot peuvent signaler :", options: ["une ironie ou un sens détourné", "toujours une citation exacte", "rien de particulier", "une erreur grammaticale"], answer: 0 },
      { question: "La ponctuation expressive sert à :", options: ["créer des effets stylistiques particuliers", "rien de particulier", "remplacer la grammaire", "simplifier le texte uniquement"], answer: 0 },
      { question: "Quel signe peut suggérer une hésitation dans un dialogue ?", options: ["les points de suspension", "le point final", "la virgule seule", "les parenthèses"], answer: 0 },
    ],
  },

  l21: {
    summary:
      "Le registre soutenu utilise un vocabulaire recherché et une syntaxe élaborée (à l'écrit formel, littéraire), tandis que le registre familier utilise un vocabulaire relâché et des tournures simplifiées (entre proches, à l'oral). Savoir les distinguer aide à analyser et produire des textes adaptés.",
    keyPoints: [
      "Registre soutenu : vocabulaire recherché, syntaxe complexe (Je vous prie de bien vouloir...)",
      "Registre familier : vocabulaire relâché, tournures simplifiées (Envoie-moi ça, steplé)",
      "Le même message peut être exprimé différemment selon le registre choisi",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle phrase est au registre soutenu ?",
        options: ["Je vous prie d'agréer mes salutations distinguées.", "À plus !", "Ça va ou quoi ?", "T'as fini ?"],
        answer: 0,
        explanation: "'Je vous prie d'agréer mes salutations distinguées' utilise un vocabulaire et une syntaxe recherchés, typiques du registre soutenu.",
      },
      {
        difficulty: "moyen",
        question: "Quelle phrase est au registre familier ?",
        options: ["Je souhaiterais vous rencontrer.", "T'as pas fini tes devoirs ?", "Veuillez patienter un instant.", "Je vous remercie infiniment."],
        answer: 1,
        explanation: "'T'as pas fini tes devoirs ?' utilise une contraction typique du langage oral familier ('t'as' pour 'tu as').",
      },
      {
        difficulty: "difficile",
        question: "Réécris au registre soutenu la phrase familière : 'Je peux pas venir, j'ai un truc à faire.'",
        options: ["Je ne peux pas venir, car j'ai un engagement à honorer.", "Je peux pas venir.", "J'ai un truc à faire donc je viens pas.", "Aucune reformulation possible"],
        answer: 0,
        explanation: "Le registre soutenu élimine les contractions orales ('je peux pas' → 'je ne peux pas') et utilise un vocabulaire plus formel ('un truc' → 'un engagement').",
      },
    ],
    quiz: [
      { question: "Le registre soutenu est utilisé :", options: ["à l'écrit formel ou dans la littérature", "seulement entre amis proches", "jamais à l'écrit", "seulement à l'oral"], answer: 0 },
      { question: "Le registre familier est utilisé :", options: ["entre proches, à l'oral", "dans les lettres administratives", "dans les discours officiels", "jamais utilisé"], answer: 0 },
      { question: "Quelle expression est au registre soutenu ?", options: ["Je vous saurais gré de...", "C'est cool", "Ouais", "À plus"], answer: 0 },
      { question: "Adapter son registre dépend :", options: ["du contexte et du destinataire", "de rien en particulier", "toujours du même registre", "de la longueur du texte uniquement"], answer: 0 },
      { question: "'Steplé' est une contraction typique du registre :", options: ["familier", "soutenu", "administratif", "littéraire"], answer: 0 },
    ],
  },

  l22: {
    summary:
      "Le point de vue narratif désigne la perspective à partir de laquelle une histoire est racontée : interne (le narrateur est un personnage, utilise 'je'), externe (le narrateur observe sans connaître les pensées des personnages), ou omniscient (le narrateur connaît tout, y compris les pensées de chacun).",
    keyPoints: [
      "Point de vue interne : le narrateur est un personnage de l'histoire, utilise 'je', ne connaît que ce qu'il vit",
      "Point de vue externe : le narrateur observe de l'extérieur, sans accéder aux pensées des personnages",
      "Point de vue omniscient : le narrateur sait tout, y compris les pensées et sentiments de tous les personnages",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel point de vue utilise 'je' pour raconter l'histoire ?",
        options: ["le point de vue interne", "le point de vue externe", "le point de vue omniscient", "aucun point de vue en particulier"],
        answer: 0,
        explanation: "Le point de vue interne utilise 'je', le narrateur étant lui-même un personnage de l'histoire.",
      },
      {
        difficulty: "moyen",
        question: "Quel point de vue connaît les pensées de tous les personnages ?",
        options: ["le point de vue interne", "le point de vue externe", "le point de vue omniscient", "aucun point de vue"],
        answer: 2,
        explanation: "Le point de vue omniscient donne au narrateur un accès total aux pensées et sentiments de tous les personnages.",
      },
      {
        difficulty: "difficile",
        question: "Dans un texte où le narrateur décrit uniquement les actions visibles des personnages sans jamais révéler leurs pensées intérieures, quel est le point de vue utilisé ?",
        options: ["le point de vue externe", "le point de vue interne", "le point de vue omniscient", "aucun point de vue identifiable"],
        answer: 0,
        explanation: "Le point de vue externe se limite à ce qui est observable de l'extérieur (actions, paroles) sans accès aux pensées intérieures des personnages, contrairement à l'omniscient.",
      },
    ],
    quiz: [
      { question: "Le point de vue interne utilise généralement :", options: ["la première personne (je)", "toujours la troisième personne", "jamais de pronom personnel", "seulement le nous"], answer: 0 },
      { question: "Le point de vue omniscient permet au narrateur de connaître :", options: ["les pensées de tous les personnages", "rien du tout", "seulement ses propres pensées", "seulement les actions visibles"], answer: 0 },
      { question: "Le point de vue externe se limite à :", options: ["ce qui est observable de l'extérieur", "les pensées intérieures des personnages", "rien de précis", "uniquement les dialogues"], answer: 0 },
      { question: "Identifier le point de vue narratif aide à :", options: ["mieux comprendre la perspective du récit", "rien de particulier", "compter les pages", "changer l'histoire"], answer: 0 },
      { question: "Un narrateur qui dit 'je' et vit l'histoire utilise le point de vue :", options: ["interne", "externe", "omniscient", "aucun de ces points de vue"], answer: 0 },
    ],
  },

  l23: {
    summary:
      "Révision générale des principaux acquis de l'année : les propositions subordonnées circonstancielles (temps, cause, conséquence, but, opposition), les temps composés (plus-que-parfait, conditionnel passé), la voix passive, et les techniques argumentatives.",
    keyPoints: [
      "Subordonnées circonstancielles : temps (quand), cause (parce que), conséquence (si bien que), but (afin que), opposition (bien que)",
      "Temps composés : plus-que-parfait (action antérieure), conditionnel passé (regret/hypothèse irréelle)",
      "Argumentation : thèse, arguments, exemples, connecteurs logiques",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle conjonction introduit une subordonnée de but ?",
        options: ["afin que", "parce que", "quand", "bien que"],
        answer: 0,
        explanation: "'Afin que' introduit le but d'une action.",
      },
      {
        difficulty: "moyen",
        question: "Complète au conditionnel passé : Si j'avais su, je ___ (venir).",
        options: ["serais venu(e)", "viendrai", "venais", "viens"],
        answer: 0,
        explanation: "'Si + plus-que-parfait' est suivi du conditionnel passé : serais venu(e).",
      },
      {
        difficulty: "difficile",
        question: "Transforme à la voix passive : 'Les élèves ont réalisé ce projet.'",
        options: ["Ce projet a été réalisé par les élèves.", "Les élèves réalisent ce projet.", "Ce projet réalise les élèves.", "Les élèves ont été réalisés."],
        answer: 0,
        explanation: "À la voix passive, l'objet (ce projet) devient sujet : Ce projet a été réalisé par les élèves.",
      },
    ],
    quiz: [
      { question: "Quelle conjonction introduit une subordonnée de cause ?", options: ["parce que", "afin que", "bien que", "de sorte que"], answer: 0 },
      { question: "Quel temps exprime une action antérieure à une autre action passée ?", options: ["le plus-que-parfait", "le futur simple", "le présent", "l'impératif"], answer: 0 },
      { question: "Un texte argumentatif défend :", options: ["une thèse avec des arguments", "une histoire au passé", "une description neutre", "rien en particulier"], answer: 0 },
      { question: "Quel connecteur exprime l'opposition ?", options: ["cependant", "donc", "en effet", "d'abord"], answer: 0 },
      { question: "La voix passive utilise l'auxiliaire :", options: ["être", "avoir", "aller", "faire"], answer: 0 },
    ],
  },

  l24: {
    summary:
      "Préparation finale à l'évaluation de fin d'année : révision combinée de la compréhension de texte (identifier thèse, arguments, point de vue narratif), de l'expression écrite (rédiger un paragraphe argumentatif structuré), et de la grammaire (tous les points étudiés durant l'année).",
    keyPoints: [
      "Compréhension : identifier la thèse, les arguments, le point de vue narratif, et justifier ses réponses",
      "Expression écrite : structurer un paragraphe argumentatif avec idée, explication, exemple",
      "Grammaire : revoir les subordonnées, les temps composés, la voix passive, et le discours rapporté",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Lors d'une évaluation de compréhension d'un texte argumentatif, il faut identifier :",
        options: ["la thèse et les arguments principaux", "seulement le titre", "rien de particulier", "uniquement les noms propres"],
        answer: 0,
        explanation: "Comprendre un texte argumentatif nécessite d'identifier clairement la thèse défendue et les arguments qui la soutiennent.",
      },
      {
        difficulty: "moyen",
        question: "Un bon paragraphe argumentatif pour l'examen doit inclure :",
        options: ["un argument clair, une explication, et un exemple", "seulement des questions", "aucune structure particulière", "uniquement des citations"],
        answer: 0,
        explanation: "La structure argument-explication-exemple reste la base attendue d'un paragraphe argumentatif bien construit.",
      },
      {
        difficulty: "difficile",
        question: "Complète cette phrase d'examen en respectant la concordance des temps : 'Il a affirmé qu'il ___ (venir) le lendemain si les conditions le ___ (permettre).'",
        options: ["viendrait / permettaient", "vient / permettent", "viendra / permettront", "venait / permettaient"],
        answer: 0,
        explanation: "Le futur 'viendra' devient conditionnel 'viendrait', et le présent 'permettent' devient imparfait 'permettaient', conformément à la concordance des temps au discours rapporté du passé.",
      },
    ],
    quiz: [
      { question: "Pour bien répondre à une question de compréhension, il faut :", options: ["justifier sa réponse en s'appuyant sur le texte", "deviner sans lire", "copier tout le texte", "ignorer la question"], answer: 0 },
      { question: "Quel temps exprime un regret sur une action passée ?", options: ["le conditionnel passé", "le futur simple", "le présent", "l'impératif"], answer: 0 },
      { question: "Une bonne expression écrite nécessite :", options: ["une organisation claire avec arguments et exemples", "aucune organisation", "seulement des phrases courtes", "uniquement des questions"], answer: 0 },
      { question: "Quelle figure de style exagère pour insister ?", options: ["l'hyperbole", "l'antithèse", "la gradation", "aucune de ces réponses"], answer: 0 },
      { question: "Le point de vue narratif omniscient permet de connaître :", options: ["les pensées de tous les personnages", "rien du tout", "seulement les actions visibles", "uniquement le décor"], answer: 0 },
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