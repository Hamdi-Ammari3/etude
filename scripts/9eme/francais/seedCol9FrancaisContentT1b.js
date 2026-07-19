// scripts/seedCol9FrancaisContentT1b.js
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

// Trimestre 1, part B — lessons l7 through l12 (fin Module 2 + module de
// lecture "Nom de plume"). Titles confirmed from the real textbook's
// tableau synoptique. Content reconstructed — NOT verified against actual
// textbook pages. Note on l12: I do not have access to the actual text of
// "Nom de plume" by Micheline La France, so this lesson teaches general
// interview-analysis skills relevant to the module's stated focus (Lire un
// texte informatif, écouter/rendre compte d'une interview) rather than
// content specific to that book — flagged clearly for teacher review.
const LESSON_CONTENT = {
  l7: {
    summary:
      "La synonymie regroupe des mots de sens proche, utiles pour varier l'expression ; le sens propre est le sens premier et concret d'un mot, tandis que le sens figuré est un sens dérivé, souvent imagé. La comparaison et la métaphore sont deux figures de style qui rapprochent deux réalités, avec ou sans mot comparatif.",
    keyPoints: [
      "Synonymie : mots de sens proche (content = joyeux) pour éviter les répétitions",
      "Sens propre : sens concret et premier d'un mot (une main qui tient un objet). Sens figuré : sens dérivé et imagé (donner un coup de main = aider)",
      "Comparaison : relie deux éléments avec un mot comparatif (comme). Métaphore : rapprochement direct sans mot comparatif",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel est un synonyme de 'content' ?",
        options: ["joyeux", "triste", "fatigué", "en colère"],
        answer: 0,
        explanation: "'Joyeux' a un sens très proche de 'content'.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Il a le cœur brisé', le mot 'cœur' est employé au sens :",
        options: ["figuré", "propre", "aucun des deux", "littéral uniquement"],
        answer: 0,
        explanation: "'Cœur brisé' est une expression au sens figuré, exprimant une douleur émotionnelle et non physique.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase contient une métaphore (et non une comparaison) ?",
        options: ["Cet homme est un renard.", "Cet homme est rusé comme un renard.", "Cet homme ressemble à un renard.", "Cet homme est pareil à un renard."],
        answer: 0,
        explanation: "'Cet homme est un renard' rapproche directement l'homme et le renard sans mot comparatif, c'est une métaphore ; les autres phrases utilisent des mots comparatifs (comme, ressemble à, pareil à).",
      },
    ],
    quiz: [
      { question: "Un antonyme de 'grand' est :", options: ["petit", "immense", "haut", "large"], answer: 0 },
      { question: "La comparaison utilise :", options: ["un mot comparatif", "aucun mot de liaison", "toujours une négation", "seulement des chiffres"], answer: 0 },
      { question: "'Elle est douce comme un agneau' est :", options: ["une comparaison", "une métaphore", "aucune figure de style", "une négation"], answer: 0 },
      { question: "Le sens propre d'un mot est :", options: ["son sens concret et premier", "toujours son sens le plus rare", "un sens inventé", "sans rapport avec le mot"], answer: 0 },
      { question: "'Il pleut des cordes' est une expression au sens :", options: ["figuré", "propre", "aucun des deux", "littéral"], answer: 0 },
    ],
  },

  l8: {
    summary:
      "Le groupe nominal peut être enrichi par des expansions (adjectif épithète, complément du nom, proposition relative). L'attribut du sujet, relié par un verbe d'état (être, sembler, devenir, paraître), décrit une qualité ou un état du sujet, contrairement au COD qui désigne ce sur quoi porte l'action.",
    keyPoints: [
      "Expansions du groupe nominal : adjectif épithète, complément du nom, proposition relative",
      "Verbes d'état : être, sembler, devenir, paraître, rester — relient le sujet à son attribut",
      "L'attribut du sujet décrit une qualité du sujet (Elle est fatiguée.), contrairement au COD qui subit l'action (Elle voit un film.)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Le grand jardin fleuri', quelles sont les expansions du nom 'jardin' ?",
        options: ["'grand' et 'fleuri'", "seulement 'grand'", "seulement 'fleuri'", "aucune expansion"],
        answer: 0,
        explanation: "'Grand' (épithète avant le nom) et 'fleuri' (épithète après le nom) sont deux expansions de 'jardin'.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Elle semble épuisée', quelle est la fonction de 'épuisée' ?",
        options: ["attribut du sujet", "COD", "COI", "complément circonstanciel"],
        answer: 0,
        explanation: "'Épuisée' est relié au sujet 'Elle' par le verbe d'état 'semble', c'est l'attribut du sujet.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Le professeur, que tous respectent, devient directeur', identifie l'expansion du nom 'professeur' et la fonction de 'directeur' :",
        options: ["Expansion : 'que tous respectent' (proposition relative) ; fonction de 'directeur' : attribut du sujet", "Expansion : 'directeur' ; fonction : COD", "Aucune expansion, 'directeur' est le sujet", "Les deux sont des attributs du sujet"],
        answer: 0,
        explanation: "'Que tous respectent' est une proposition relative qui étend le nom 'professeur', et 'directeur' est l'attribut du sujet relié par le verbe d'état 'devient'.",
      },
    ],
    quiz: [
      { question: "Quels verbes introduisent un attribut du sujet ?", options: ["les verbes d'état", "les verbes d'action uniquement", "aucun verbe en particulier", "seulement 'avoir'"], answer: 0 },
      { question: "Dans 'Il devient médecin', quelle est la fonction de 'médecin' ?", options: ["attribut du sujet", "COD", "COI", "sujet"], answer: 0 },
      { question: "Le complément du nom est introduit souvent par :", options: ["la préposition 'de'", "aucune préposition", "un verbe", "un adverbe"], answer: 0 },
      { question: "Dans 'la maison de mon oncle', quelle est l'expansion du nom 'maison' ?", options: ["de mon oncle", "la", "maison", "aucune"], answer: 0 },
      { question: "L'attribut du sujet décrit :", options: ["une qualité ou un état du sujet", "l'action subie par un objet", "un lieu uniquement", "un temps uniquement"], answer: 0 },
    ],
  },

  l9: {
    summary:
      "Révision et approfondissement de l'imparfait (description, habitudes passées) et du plus-que-parfait (action antérieure à une autre action passée), deux temps essentiels pour construire un récit cohérent avec plusieurs niveaux temporels.",
    keyPoints: [
      "Imparfait : description, habitudes, actions en cours dans le passé (Il pleuvait, les enfants jouaient.)",
      "Plus-que-parfait : action antérieure à une autre action passée (Quand elle est arrivée, il était déjà parti.)",
      "Formation du plus-que-parfait : auxiliaire à l'imparfait + participe passé (j'avais fini, elle était partie)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète à l'imparfait : Le ciel ___ (être) gris ce jour-là.",
        options: ["était", "fut", "a été", "sera"],
        answer: 0,
        explanation: "Imparfait de 'être' à la 3ème personne du singulier : était.",
      },
      {
        difficulty: "moyen",
        question: "Complète au plus-que-parfait : Elle ___ (partir) quand nous sommes arrivés.",
        options: ["était partie", "partait", "est partie", "partira"],
        answer: 0,
        explanation: "Plus-que-parfait de 'partir' (auxiliaire être à l'imparfait + participe passé) : était partie.",
      },
      {
        difficulty: "difficile",
        question: "Complète en respectant l'antériorité : 'Quand je suis arrivé à la gare, le train ___ (déjà/partir).'",
        options: ["était déjà parti", "partait déjà", "est déjà parti", "partira déjà"],
        answer: 0,
        explanation: "Le plus-que-parfait ('était déjà parti') marque une action antérieure à l'arrivée (passé composé), déjà terminée avant cette arrivée.",
      },
    ],
    quiz: [
      { question: "Le plus-que-parfait exprime :", options: ["une action antérieure à une autre action passée", "une action future", "une habitude présente", "un ordre"], answer: 0 },
      { question: "Comment se forme le plus-que-parfait ?", options: ["auxiliaire à l'imparfait + participe passé", "auxiliaire au présent + participe passé", "radical + terminaisons", "infinitif seul"], answer: 0 },
      { question: "Complète à l'imparfait : Nous ___ (jouer) tous les jours.", options: ["jouions", "jouâmes", "avons joué", "jouerons"], answer: 0 },
      { question: "Complète au plus-que-parfait : Ils ___ (finir) leur travail avant midi.", options: ["avaient fini", "finissaient", "ont fini", "finiront"], answer: 0 },
      { question: "L'imparfait sert souvent à :", options: ["décrire le décor ou une habitude passée", "exprimer une action ponctuelle unique", "donner un ordre", "poser une question"], answer: 0 },
    ],
  },

  l10: {
    summary:
      "L'accord des adjectifs de couleur suit une règle particulière : les adjectifs de couleur simples s'accordent normalement (des robes vertes), mais restent invariables lorsqu'ils sont composés (des yeux bleu-vert) ou dérivés d'un nom (des chemises orange, des murs marron).",
    keyPoints: [
      "Adjectif de couleur simple : s'accorde en genre et en nombre (des fleurs rouges)",
      "Adjectif de couleur composé : reste invariable (des yeux bleu-vert, des cheveux châtain clair)",
      "Adjectif de couleur issu d'un nom (orange, marron, or, argent) : reste invariable (des robes orange), sauf exceptions (rose, mauve, écarlate qui s'accordent)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Accorde : des fleurs ___ (rouge)",
        options: ["rouges", "rouge", "rougent", "rougeur"],
        answer: 0,
        explanation: "'Rouge' est un adjectif de couleur simple, il s'accorde : rouges.",
      },
      {
        difficulty: "moyen",
        question: "Accorde : des chemises ___ (orange)",
        options: ["orange", "oranges", "orangées", "orangeuses"],
        answer: 0,
        explanation: "'Orange' est un nom employé comme adjectif de couleur, il reste invariable : orange.",
      },
      {
        difficulty: "difficile",
        question: "Accorde : des yeux ___ (bleu-vert), et explique pourquoi.",
        options: ["bleu-vert (invariable, car c'est un adjectif de couleur composé)", "bleus-verts (les deux s'accordent)", "bleu-verts (seul le deuxième s'accorde)", "bleus-vert (seul le premier s'accorde)"],
        answer: 0,
        explanation: "Les adjectifs de couleur composés de deux couleurs (ou d'une couleur et d'une nuance) restent invariables dans leur ensemble : des yeux bleu-vert.",
      },
    ],
    quiz: [
      { question: "Accorde : des murs ___ (marron)", options: ["marron", "marrons", "marronnés", "marronneux"], answer: 0 },
      { question: "Accorde : des robes ___ (rose) — exception qui s'accorde", options: ["roses", "rose", "rosées", "roseuses"], answer: 0 },
      { question: "Accorde : des cheveux ___ (châtain clair)", options: ["châtain clair (invariable)", "châtains clairs", "châtain clairs", "châtains clair"], answer: 0 },
      { question: "Les adjectifs de couleur issus d'un nom restent :", options: ["invariables (sauf exceptions)", "toujours accordés", "toujours au masculin pluriel", "sans règle particulière"], answer: 0 },
      { question: "Accorde : des vestes ___ (vert)", options: ["vertes", "vert", "verti", "vertées"], answer: 0 },
    ],
  },

  l11: {
    summary:
      "Produire un récit intégrant une description nécessite d'insérer des passages descriptifs (portrait, paysage) au sein de la trame narrative, généralement à l'imparfait, sans interrompre le rythme du récit, en choisissant des détails qui servent l'histoire (caractériser un lieu ou un personnage important).",
    keyPoints: [
      "Les passages descriptifs s'insèrent souvent lors d'une pause dans l'action (arrivée dans un lieu, présentation d'un personnage)",
      "Le temps privilégié pour la description est l'imparfait, qui installe une image stable",
      "Les détails choisis doivent être pertinents pour l'histoire, pas simplement décoratifs",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel temps est généralement utilisé pour une description dans un récit ?",
        options: ["l'imparfait", "le passé simple", "le futur", "l'impératif"],
        answer: 0,
        explanation: "L'imparfait convient à la description car il installe une image stable, sans marquer une action ponctuelle.",
      },
      {
        difficulty: "moyen",
        question: "Où s'insère généralement un passage descriptif dans un récit ?",
        options: ["lors d'une pause dans l'action, comme l'arrivée dans un nouveau lieu", "au tout début systématiquement", "jamais, la description doit être évitée", "uniquement à la fin du récit"], 
        answer: 0,
        explanation: "Les descriptions s'insèrent souvent à des moments de pause narrative, comme l'arrivée dans un lieu ou la présentation d'un personnage.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi les détails d'une description intégrée à un récit doivent-ils être pertinents pour l'histoire, et pas seulement décoratifs ?",
        options: ["parce qu'une description trop longue ou hors-sujet peut ralentir inutilement le rythme du récit et distraire le lecteur de l'intrigue principale", "les détails décoratifs sont toujours préférables aux détails pertinents", "la description ne doit jamais avoir de lien avec l'histoire", "il n'y a aucune différence entre détails pertinents et décoratifs"],
        answer: 0,
        explanation: "Une description trop longue ou sans lien avec l'intrigue peut ralentir le récit et perdre l'attention du lecteur ; les détails pertinents (qui serviront plus tard, ou qui caractérisent un enjeu) gardent le lecteur engagé.",
      },
    ],
    quiz: [
      { question: "Une description dans un récit sert à :", options: ["caractériser un lieu ou un personnage important", "remplacer toute l'intrigue", "ralentir le récit sans raison", "rien de particulier"], answer: 0 },
      { question: "Quel temps installe une image stable dans une description ?", options: ["l'imparfait", "le passé simple", "le futur simple", "l'impératif"], answer: 0 },
      { question: "Une description trop longue et hors-sujet peut :", options: ["ralentir le récit et distraire le lecteur", "toujours améliorer le récit", "n'avoir aucun effet", "raccourcir automatiquement le texte"], answer: 0 },
      { question: "Un bon moment pour insérer une description est :", options: ["l'arrivée dans un nouveau lieu", "au milieu d'une phrase sans transition", "jamais", "uniquement dans le titre"], answer: 0 },
      { question: "Les détails d'une description intégrée doivent être :", options: ["pertinents pour l'histoire", "uniquement décoratifs", "aléatoires", "sans lien avec le récit"], answer: 0 },
    ],
  },

  l12: {
    summary:
      "Le premier module de lecture porte sur 'Nom de plume' de Micheline La France. Ce module développe les compétences liées à l'écoute et la compréhension d'une interview, ainsi qu'à la préparation et la conduite d'une interview, et à la lecture d'un texte informatif.",
    keyPoints: [
      "Écouter et comprendre une interview : identifier les questions, les réponses, et l'information principale transmise",
      "Préparer une interview : formuler des questions claires et pertinentes en lien avec un sujet ou une personne",
      "Lire un texte informatif : distinguer les faits des opinions, repérer l'idée principale de chaque partie",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Lors de l'écoute d'une interview, il est important de repérer :",
        options: ["les questions posées et les informations principales des réponses", "uniquement le ton de voix", "uniquement la durée de l'interview", "rien de particulier"],
        answer: 0,
        explanation: "Comprendre une interview implique de suivre la logique questions-réponses et d'en extraire l'information essentielle.",
      },
      {
        difficulty: "moyen",
        question: "Pour préparer une bonne interview, il faut d'abord :",
        options: ["définir des questions claires et pertinentes liées au sujet", "improviser sans aucune préparation", "poser des questions sans rapport avec le sujet", "éviter de poser des questions"],
        answer: 0,
        explanation: "Une interview réussie repose sur une préparation avec des questions ciblées et pertinentes.",
      },
      {
        difficulty: "difficile",
        question: "Dans un texte informatif basé sur une interview, comment distinguer un fait d'une opinion exprimée par la personne interviewée ?",
        options: ["un fait est vérifiable et objectif (une date, un événement), tandis qu'une opinion exprime un jugement personnel de l'interviewé, souvent introduit par 'je pense que' ou similaire", "il n'y a aucune différence entre fait et opinion dans une interview", "tout ce que dit l'interviewé est automatiquement un fait", "les opinions sont toujours plus fiables que les faits"],
        answer: 0,
        explanation: "Un fait peut être vérifié objectivement (dates, événements, chiffres), tandis qu'une opinion reflète un point de vue personnel, souvent signalé par des expressions comme 'je pense que' ou 'à mon avis'.",
      },
    ],
    quiz: [
      { question: "Une interview repose sur une structure de :", options: ["questions et réponses", "uniquement des descriptions", "uniquement des dialogues fictifs", "aucune structure particulière"], answer: 0 },
      { question: "Pour rendre compte du contenu d'une interview, il faut :", options: ["résumer les informations principales échangées", "copier mot à mot toute l'interview", "ignorer les réponses", "inventer de nouvelles réponses"], answer: 0 },
      { question: "Un fait vérifiable est :", options: ["objectif et démontrable", "une opinion personnelle", "toujours faux", "sans importance"], answer: 0 },
      { question: "Une bonne question d'interview doit être :", options: ["claire et pertinente par rapport au sujet", "vague et sans rapport avec le sujet", "toujours fermée (oui/non)", "impossible à répondre"], answer: 0 },
      { question: "Lire un texte informatif implique de repérer :", options: ["l'idée principale de chaque partie", "uniquement le titre", "uniquement la signature de l'auteur", "rien de spécifique"], answer: 0 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1, part B)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});