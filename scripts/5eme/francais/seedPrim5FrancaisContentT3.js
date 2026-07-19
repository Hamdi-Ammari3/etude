// scripts/seedPrim5FrancaisContentT3.js
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

// Trimestre 3 — lessons l17 through l24
const LESSON_CONTENT = {
  l17: {
    summary:
      "Le discours direct rapporte exactement les paroles d'une personne, encadrées par des guillemets, souvent introduites par deux points et un verbe de parole. La ponctuation (guillemets, tirets pour un dialogue) est essentielle pour bien le distinguer du récit.",
    keyPoints: [
      "Le discours direct rapporte les paroles exactes, entre guillemets : Il dit : « Je suis fatigué. »",
      "Dans un dialogue, chaque changement de locuteur est marqué par un tiret (-) en début de ligne",
      "Les verbes de parole (dire, demander, répondre...) introduisent souvent le discours direct",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel signe encadre les paroles rapportées dans le discours direct ?",
        options: ["les parenthèses", "les guillemets", "les crochets", "les points-virgules"],
        answer: 1,
        explanation: "Les guillemets « » encadrent les paroles rapportées exactement dans le discours direct.",
      },
      {
        difficulty: "moyen",
        question: "Quelle phrase est au discours direct ?",
        options: ["Il a dit qu'il était fatigué.", "Il dit : « Je suis fatigué. »", "Il semblait fatigué.", "Sa fatigue était visible."],
        answer: 1,
        explanation: "'Il dit : « Je suis fatigué. »' rapporte les paroles exactes entre guillemets, c'est le discours direct.",
      },
      {
        difficulty: "difficile",
        question: "Dans un dialogue écrit, comment marque-t-on le changement de personne qui parle ?",
        options: ["avec une virgule", "avec un tiret en début de ligne", "en changeant de couleur", "on ne le marque pas"],
        answer: 1,
        explanation: "Le tiret (-) en début de ligne indique un changement de locuteur dans un dialogue écrit.",
      },
    ],
    quiz: [
      { question: "Le discours direct rapporte :", options: ["un résumé des paroles", "les paroles exactes", "les pensées uniquement", "rien de précis"], answer: 1 },
      { question: "Quel signe introduit souvent le discours direct après un verbe de parole ?", options: ["les deux points", "le point-virgule", "la virgule seule", "aucun signe"], answer: 0 },
      { question: "Quel est un verbe de parole ?", options: ["marcher", "dire", "manger", "courir"], answer: 1 },
      { question: "Dans un dialogue, chaque réplique commence par :", options: ["une majuscule uniquement", "un tiret", "un point d'exclamation", "rien de particulier"], answer: 1 },
      { question: "Les guillemets français ressemblent à :", options: ["( )", "[ ]", "« »", "{ }"], answer: 2 },
    ],
  },

  l18: {
    summary:
      "Les pronoms relatifs (qui, que, où) remplacent un nom déjà mentionné et introduisent une proposition relative qui apporte des précisions sur ce nom. 'Qui' remplace un sujet, 'que' remplace un complément d'objet, et 'où' indique un lieu ou un temps.",
    keyPoints: [
      "'Qui' remplace le sujet de la proposition relative : Le garçon qui court est mon frère.",
      "'Que' remplace le complément d'objet direct : Le livre que je lis est passionnant.",
      "'Où' indique un lieu ou un moment : La ville où j'habite est belle.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Le chat ___ dort est noir.",
        options: ["qui", "que", "où", "dont"],
        answer: 0,
        explanation: "'Qui' remplace le sujet de la relative (le chat, qui fait l'action de dormir).",
      },
      {
        difficulty: "moyen",
        question: "Complète : Le film ___ j'ai vu était excellent.",
        options: ["qui", "que", "où", "dont"],
        answer: 1,
        explanation: "'Que' remplace le complément d'objet direct (j'ai vu le film).",
      },
      {
        difficulty: "difficile",
        question: "Complète : La maison ___ je suis né se trouve à Tunis.",
        options: ["qui", "que", "où", "dont"],
        answer: 2,
        explanation: "'Où' indique le lieu (je suis né dans cette maison), c'est le pronom relatif approprié.",
      },
    ],
    quiz: [
      { question: "'Qui' remplace généralement :", options: ["le sujet", "le complément d'objet", "un lieu", "rien"], answer: 0 },
      { question: "'Que' remplace généralement :", options: ["le sujet", "le complément d'objet direct", "un lieu", "rien"], answer: 1 },
      { question: "'Où' indique généralement :", options: ["une personne", "un lieu ou un temps", "une couleur", "rien de précis"], answer: 1 },
      { question: "Complète : La fille ___ chante est ma sœur.", options: ["qui", "que", "où", "dont"], answer: 0 },
      { question: "Complète : Le jour ___ je suis né était un lundi.", options: ["qui", "que", "où", "dont"], answer: 2 },
    ],
  },

  l19: {
    summary:
      "Certains verbes très fréquents ont un radical irrégulier au futur simple, qu'il faut mémoriser séparément, même si les terminaisons restent les mêmes (-ai, -as, -a, -ons, -ez, -ont).",
    keyPoints: [
      "Être → je serai, avoir → j'aurai, aller → j'irai, faire → je ferai",
      "Venir → je viendrai, voir → je verrai, pouvoir → je pourrai, vouloir → je voudrai",
      "Les terminaisons du futur restent régulières, seul le radical change pour ces verbes",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au futur : Demain, je ___ (être) en vacances.",
        options: ["suis", "serai", "étais", "serais"],
        answer: 1,
        explanation: "Le futur du verbe être a un radical irrégulier : je serai.",
      },
      {
        difficulty: "moyen",
        question: "Complète au futur : Nous ___ (aller) au marché.",
        options: ["allons", "irons", "allions", "irions"],
        answer: 1,
        explanation: "Le futur du verbe aller a un radical irrégulier (ir-) : nous irons.",
      },
      {
        difficulty: "difficile",
        question: "Complète au futur : Ils ___ (pouvoir) venir demain.",
        options: ["peuvent", "pourront", "pouvaient", "pourraient"],
        answer: 1,
        explanation: "Le futur du verbe pouvoir a un radical irrégulier (pourr-) : ils pourront.",
      },
    ],
    quiz: [
      { question: "Complète au futur : Tu ___ (avoir) de la chance.", options: ["as", "auras", "avais", "aurais"], answer: 1 },
      { question: "Complète au futur : Elle ___ (faire) ses devoirs.", options: ["fait", "fera", "faisait", "ferait"], answer: 1 },
      { question: "Complète au futur : Vous ___ (venir) nous voir.", options: ["venez", "viendrez", "veniez", "viendriez"], answer: 1 },
      { question: "Complète au futur : Je ___ (voir) ce film bientôt.", options: ["vois", "verrai", "voyais", "verrais"], answer: 1 },
      { question: "Le radical du futur de 'vouloir' est :", options: ["voul-", "voudr-", "veu-", "voudra-"], answer: 1 },
    ],
  },

  l20: {
    summary:
      "L'adverbe est un mot invariable qui modifie le sens d'un verbe, d'un adjectif, ou d'un autre adverbe. Il peut exprimer la manière (-ment), le temps, le lieu, la quantité, ou l'intensité.",
    keyPoints: [
      "L'adverbe est invariable : il ne s'accorde jamais",
      "Adverbes de manière : lentement, rapidement, joyeusement (souvent en -ment)",
      "Adverbes de temps : hier, aujourd'hui, demain, toujours",
      "Adverbes de lieu : ici, là, dehors, partout",
      "Adverbes de quantité/intensité : beaucoup, très, peu, trop",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel mot est un adverbe dans 'Il court rapidement' ?",
        options: ["Il", "court", "rapidement", "aucun"],
        answer: 2,
        explanation: "'Rapidement' modifie le verbe 'court' et indique la manière, c'est un adverbe.",
      },
      {
        difficulty: "moyen",
        question: "Quel adverbe exprime le temps ?",
        options: ["ici", "beaucoup", "hier", "lentement"],
        answer: 2,
        explanation: "'Hier' est un adverbe de temps.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Elle est très intelligente', l'adverbe 'très' modifie :",
        options: ["le verbe 'est'", "l'adjectif 'intelligente'", "le sujet 'Elle'", "rien du tout"],
        answer: 1,
        explanation: "'Très' modifie l'adjectif 'intelligente' en renforçant son intensité.",
      },
    ],
    quiz: [
      { question: "Un adverbe est :", options: ["variable", "invariable", "parfois variable", "toujours au pluriel"], answer: 1 },
      { question: "Quel suffixe forme souvent un adverbe de manière ?", options: ["-tion", "-ment", "-eux", "-able"], answer: 1 },
      { question: "Quel mot est un adverbe de lieu ?", options: ["demain", "ici", "beaucoup", "joyeusement"], answer: 1 },
      { question: "Quel mot est un adverbe de quantité ?", options: ["hier", "beaucoup", "ici", "lentement"], answer: 1 },
      { question: "L'adverbe peut modifier :", options: ["seulement un verbe", "un verbe, un adjectif, ou un autre adverbe", "seulement un nom", "rien du tout"], answer: 1 },
    ],
  },

  l21: {
    summary:
      "Les prépositions sont des mots invariables qui introduisent un complément (nom, pronom, ou verbe à l'infinitif) et expriment des relations comme le lieu, le temps, ou la manière. Exemples : à, de, dans, sur, sous, avec, pour, chez.",
    keyPoints: [
      "Les prépositions sont invariables et introduisent un complément",
      "Prépositions courantes : à, de, dans, sur, sous, avec, pour, chez, sans, entre",
      "Une préposition peut introduire un lieu (dans la maison), un temps (avant midi), ou un moyen (avec un stylo)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel mot est une préposition dans 'Le livre est sur la table' ?",
        options: ["Le", "livre", "sur", "table"],
        answer: 2,
        explanation: "'Sur' est une préposition qui indique la position.",
      },
      {
        difficulty: "moyen",
        question: "Complète avec la préposition appropriée : 'Je vais ___ l'école.'",
        options: ["à", "de", "sur", "sous"],
        answer: 0,
        explanation: "'À' est la préposition appropriée pour indiquer une destination.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Il travaille chez son oncle avec passion', combien de prépositions y a-t-il ?",
        options: ["1", "2", "3", "0"],
        answer: 1,
        explanation: "Il y a deux prépositions : 'chez' et 'avec'.",
      },
    ],
    quiz: [
      { question: "Les prépositions sont :", options: ["variables", "invariables", "parfois variables", "toujours au pluriel"], answer: 1 },
      { question: "Quelle est une préposition de lieu ?", options: ["dans", "toujours", "rapidement", "beaucoup"], answer: 0 },
      { question: "Complète : Le stylo est ___ le tiroir.", options: ["dans", "rapidement", "beaucoup", "toujours"], answer: 0 },
      { question: "Quelle préposition introduit souvent un moyen ?", options: ["avec", "chez", "sous", "entre"], answer: 0 },
      { question: "Une préposition peut introduire :", options: ["seulement un nom", "un nom, un pronom, ou un infinitif", "seulement un adjectif", "rien"], answer: 1 },
    ],
  },

  l22: {
    summary:
      "Le conditionnel présent exprime un souhait, une politesse, une hypothèse, ou une action soumise à une condition. Il se forme avec le radical du futur simple, suivi des terminaisons de l'imparfait (-ais, -ais, -ait, -ions, -iez, -aient).",
    keyPoints: [
      "Formation : radical du futur + terminaisons de l'imparfait",
      "Exemple avec 'parler' : je parlerais, tu parlerais, il parlerait, nous parlerions...",
      "Utilisé pour la politesse : Je voudrais un café, s'il vous plaît.",
      "Utilisé pour un souhait ou une hypothèse : J'aimerais voyager. Si j'avais de l'argent, je voyagerais.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au conditionnel : Je ___ (vouloir) un verre d'eau, s'il vous plaît.",
        options: ["veux", "voudrai", "voudrais", "voulais"],
        answer: 2,
        explanation: "'Voudrais' est le conditionnel présent, utilisé ici par politesse.",
      },
      {
        difficulty: "moyen",
        question: "Complète au conditionnel : Nous ___ (aimer) partir en vacances.",
        options: ["aimons", "aimerons", "aimerions", "aimions"],
        answer: 2,
        explanation: "Au conditionnel, à la 1ère personne du pluriel : nous aimerions.",
      },
      {
        difficulty: "difficile",
        question: "Complète au conditionnel : Si j'avais des ailes, je ___ (voler) comme un oiseau.",
        options: ["vole", "volerai", "volerais", "volais"],
        answer: 2,
        explanation: "Dans une phrase hypothétique avec 'si + imparfait', on utilise le conditionnel présent dans la proposition principale : je volerais.",
      },
    ],
    quiz: [
      { question: "Le conditionnel présent se forme avec :", options: ["le radical du présent + terminaisons du futur", "le radical du futur + terminaisons de l'imparfait", "l'infinitif seul", "aucune règle fixe"], answer: 1 },
      { question: "Complète : Tu ___ (pouvoir) m'aider ?", options: ["peux", "pourras", "pourrais", "pouvais"], answer: 2 },
      { question: "Le conditionnel s'utilise souvent pour :", options: ["donner un ordre", "exprimer la politesse ou un souhait", "raconter le passé uniquement", "rien de particulier"], answer: 1 },
      { question: "Complète : Elle ___ (être) contente de te voir.", options: ["est", "sera", "serait", "était"], answer: 2 },
      { question: "Quelle terminaison utilise le conditionnel à 'nous' ?", options: ["-ons", "-ions", "-ez", "-ont"], answer: 1 },
    ],
  },

  l23: {
    summary:
      "Le passé composé et l'imparfait sont les deux temps principaux du récit au passé. Le passé composé exprime des actions ponctuelles qui font avancer l'histoire, tandis que l'imparfait sert à décrire le décor, les personnages, ou les habitudes.",
    keyPoints: [
      "Passé composé : actions ponctuelles, événements qui font avancer le récit",
      "Imparfait : descriptions, situations installées, actions habituelles dans le passé",
      "Dans un récit, les deux temps se combinent souvent : 'Il pleuvait (imparfait, décor) quand elle est sortie (passé composé, action).'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel temps utilise-t-on pour décrire le décor d'une histoire ?",
        options: ["le passé composé", "l'imparfait", "le futur", "le présent uniquement"],
        answer: 1,
        explanation: "L'imparfait est utilisé pour les descriptions et le décor dans un récit.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Il ___ (faire) beau quand nous ___ (partir) en promenade.",
        options: ["faisait / sommes partis", "a fait / partions", "faisait / partions", "a fait / sommes partis"],
        answer: 0,
        explanation: "'Faisait' (imparfait) décrit le temps qu'il faisait, et 'sommes partis' (passé composé) exprime l'action ponctuelle de partir.",
      },
      {
        difficulty: "difficile",
        question: "Dans la phrase 'Elle lisait tranquillement quand le téléphone a sonné', pourquoi utilise-t-on l'imparfait puis le passé composé ?",
        options: ["Par hasard, sans raison précise", "L'imparfait décrit une action en cours, interrompue par l'action ponctuelle au passé composé", "C'est une erreur grammaticale", "Les deux temps sont interchangeables ici"],
        answer: 1,
        explanation: "'Lisait' (imparfait) exprime une action en cours qui durait, et 'a sonné' (passé composé) exprime l'événement ponctuel qui interrompt cette action.",
      },
    ],
    quiz: [
      { question: "Le passé composé exprime souvent :", options: ["une description", "une action ponctuelle", "une habitude uniquement", "rien de précis"], answer: 1 },
      { question: "L'imparfait exprime souvent :", options: ["une action ponctuelle unique", "une description ou habitude passée", "le futur", "le présent"], answer: 1 },
      { question: "Complète : Le ciel ___ (être) bleu ce jour-là.", options: ["est", "était", "sera", "a été"], answer: 1 },
      { question: "Complète : Soudain, elle ___ (crier) de joie.", options: ["criait", "a crié", "crie", "criera"], answer: 1 },
      { question: "Dans un récit, ces deux temps se combinent souvent pour :", options: ["créer de la confusion", "distinguer le décor de l'action", "rien de particulier", "éviter la conjugaison"], answer: 1 },
    ],
  },

  l24: {
    summary:
      "Révision générale des principaux acquis de l'année : les types et formes de phrases, les fonctions grammaticales (sujet, COD, COI, compléments circonstanciels), les temps de conjugaison (présent, futur, passé composé, imparfait, conditionnel), et le vocabulaire (synonymes, antonymes, familles de mots).",
    keyPoints: [
      "Grammaire : types de phrases, formes affirmative/négative, groupe nominal, fonctions (sujet, COD, COI, compléments circonstanciels)",
      "Conjugaison : présent, futur simple, passé composé, imparfait, conditionnel présent",
      "Vocabulaire : synonymes, antonymes, familles de mots, homophones grammaticaux",
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
      { question: "Quel type de phrase pose une question ?", options: ["déclarative", "interrogative", "exclamative", "impérative"], answer: 1 },
      { question: "Le COD répond à quelle question ?", options: ["où ?", "quoi ?/qui ?", "quand ?", "comment ?"], answer: 1 },
      { question: "Quel temps exprime la politesse ou un souhait ?", options: ["le présent", "le conditionnel", "l'imparfait seul", "le passé composé"], answer: 1 },
      { question: "Un synonyme de 'content' est :", options: ["triste", "joyeux", "fatigué", "en colère"], answer: 1 },
      { question: "Quel pronom relatif remplace un lieu ?", options: ["qui", "que", "où", "dont"], answer: 2 },
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