// scripts/seedCol9FrancaisContentT1a.js
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

// Trimestre 1, part A — lessons l1 through l6 (Module 1 + début Module 2)
// Titles confirmed from the real textbook's tableau synoptique. Content
// reconstructed from standard knowledge of French grammar/conjugaison at
// this level — NOT verified against actual textbook pages/exercises.
const LESSON_CONTENT = {
  l1: {
    summary:
      "Le texte narratif du Module 1 (« Causes à défendre ») s'appuie sur des récits mettant en scène des enfants défendant une cause. Comprendre un tel texte implique d'identifier les personnages, la cause défendue, les événements clés, et le message ou la morale qui s'en dégage.",
    keyPoints: [
      "Un récit engagé présente souvent un personnage confronté à une injustice ou un défi social",
      "Identifier la cause défendue aide à comprendre le message du texte",
      "La structure narrative classique (situation initiale, péripéties, résolution) reste la base d'analyse",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans un récit engagé, la 'cause défendue' correspond à :",
        options: ["l'enjeu ou l'injustice que le personnage cherche à combattre", "le lieu de l'histoire uniquement", "le nom de l'auteur", "la longueur du texte"],
        answer: 0,
        explanation: "La cause défendue est l'enjeu central (souvent une injustice) autour duquel s'organise le récit engagé.",
      },
      {
        difficulty: "moyen",
        question: "Pour dégager le message d'un récit engagé, il faut surtout observer :",
        options: ["les choix et les conséquences des actions du personnage principal", "uniquement la couverture du livre", "le nombre de chapitres", "la couleur du texte"],
        answer: 0,
        explanation: "Le message se dégage souvent des choix du personnage et de ce que ces choix révèlent ou changent.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi les récits sur des enfants défendant une cause sont-ils souvent efficaces pour sensibiliser le lecteur ?",
        options: ["parce qu'un narrateur ou personnage jeune crée une proximité et une identification plus fortes chez le lecteur, rendant l'injustice plus tangible", "parce que les enfants ne peuvent jamais être des personnages crédibles", "parce que ces récits n'ont aucun impact particulier", "parce qu'ils sont toujours plus courts que les autres récits"],
        answer: 0,
        explanation: "Un protagoniste enfant facilite souvent l'identification du lecteur (surtout jeune), rendant l'injustice ou le combat plus immédiat et touchant.",
      },
    ],
    quiz: [
      { question: "Le récit engagé met en scène :", options: ["un personnage face à un enjeu ou une injustice", "uniquement des descriptions de paysages", "des dialogues sans aucune action", "aucun personnage précis"], answer: 0 },
      { question: "La structure narrative classique commence par :", options: ["la situation initiale", "la résolution", "les péripéties", "la morale seule"], answer: 0 },
      { question: "Quel élément aide à identifier le message d'un texte narratif engagé ?", options: ["les choix du personnage", "la couverture du livre", "le prix du livre", "la police de caractère"], answer: 0 },
      { question: "'Enfants de tous les pays' (centre d'intérêt du Module 1) suggère un thème :", options: ["universel et social", "purement scientifique", "sans rapport avec les personnages", "uniquement historique"], answer: 0 },
      { question: "Un bon lecteur de récit engagé doit :", options: ["identifier la cause et le message", "ignorer les personnages", "se concentrer seulement sur la ponctuation", "lire uniquement le titre"], answer: 0 },
    ],
  },

  l2: {
    summary:
      "L'expression du temps précise quand se déroule une action, aussi bien dans une phrase simple (par un complément circonstanciel de temps) que dans une phrase complexe (par une proposition subordonnée introduite par quand, lorsque, dès que, avant que, après que).",
    keyPoints: [
      "Phrase simple : complément de temps (Il est arrivé hier soir.)",
      "Phrase complexe : proposition subordonnée de temps (Quand il est arrivé, nous dînions déjà.)",
      "Le choix de la conjonction précise la relation temporelle : simultanéité (quand, pendant que), antériorité (avant que), postériorité (après que, dès que)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Il est parti tôt ce matin', quel est le complément de temps ?",
        options: ["tôt ce matin", "Il est parti", "aucun", "il"],
        answer: 0,
        explanation: "'Tôt ce matin' répond à la question 'quand ?', c'est le complément de temps.",
      },
      {
        difficulty: "moyen",
        question: "Quelle conjonction exprime la simultanéité ?",
        options: ["pendant que", "avant que", "après que", "afin que"],
        answer: 0,
        explanation: "'Pendant que' exprime que deux actions se déroulent en même temps.",
      },
      {
        difficulty: "difficile",
        question: "Complète en respectant la relation temporelle demandée (antériorité) : '___ le film ne commence, nous avons acheté du pop-corn.'",
        options: ["Avant que", "Après que", "Pendant que", "Dès que"],
        answer: 0,
        explanation: "'Avant que' exprime que l'achat du pop-corn a eu lieu avant le début du film (antériorité par rapport à la principale).",
      },
    ],
    quiz: [
      { question: "Quelle conjonction exprime l'antériorité ?", options: ["avant que", "après que", "pendant que", "quand"], answer: 0 },
      { question: "Quelle conjonction exprime la postériorité immédiate ?", options: ["dès que", "avant que", "pendant que", "bien que"], answer: 0 },
      { question: "Le complément de temps répond à la question :", options: ["quand ?", "pourquoi ?", "comment ?", "où ?"], answer: 0 },
      { question: "'Lorsque' introduit une proposition subordonnée de :", options: ["temps", "cause", "but", "opposition"], answer: 0 },
      { question: "Complète : 'Nous sommes sortis ___ il pleuvait.' (simultanéité)", options: ["pendant qu'", "avant qu'", "afin qu'", "bien qu'"], answer: 0 },
    ],
  },

  l3: {
    summary:
      "Le passé simple, temps littéraire du récit, exprime des actions ponctuelles et achevées dans le passé (il se conjugue surtout à la 3ème personne dans les textes narratifs), tandis que l'imparfait décrit le décor et les habitudes. Ces deux temps se combinent classiquement dans le récit écrit.",
    keyPoints: [
      "Passé simple 1er groupe : il parla, ils parlèrent. 2ème groupe : il finit, ils finirent",
      "Passé simple, verbes irréguliers fréquents : il fut (être), il eut (avoir), il vint (venir), il fit (faire)",
      "Le passé simple s'utilise surtout à l'écrit littéraire, contrairement au passé composé plus courant à l'oral",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au passé simple : Il ___ (parler) doucement.",
        options: ["parla", "parlait", "a parlé", "parlera"],
        answer: 0,
        explanation: "Passé simple du 1er groupe à la 3ème personne du singulier : il parla.",
      },
      {
        difficulty: "moyen",
        question: "Complète au passé simple : Ils ___ (venir) nous voir.",
        options: ["vinrent", "venaient", "sont venus", "viendront"],
        answer: 0,
        explanation: "Passé simple irrégulier de 'venir' à la 3ème personne du pluriel : ils vinrent.",
      },
      {
        difficulty: "difficile",
        question: "Complète en combinant les deux temps : 'Le ciel ___ (être) gris quand elle ___ (sortir) enfin de la maison.'",
        options: ["était / sortit", "fut / sortait", "est / sort", "sera / sortira"],
        answer: 0,
        explanation: "'Était' (imparfait, décor) décrit le ciel, et 'sortit' (passé simple, action ponctuelle) marque l'événement précis.",
      },
    ],
    quiz: [
      { question: "Quel est le passé simple de 'être' à la 3ème pers. sing. ?", options: ["fut", "était", "a été", "sera"], answer: 0 },
      { question: "Quel est le passé simple de 'avoir' à la 3ème pers. sing. ?", options: ["eut", "avait", "a eu", "aura"], answer: 0 },
      { question: "Complète : Elle ___ (finir) son travail avant midi.", options: ["finit", "finissait", "a fini", "finira"], answer: 0 },
      { question: "Le passé simple s'utilise principalement :", options: ["à l'écrit littéraire", "à l'oral quotidien", "jamais dans les récits", "uniquement au futur"], answer: 0 },
      { question: "Quel est le passé simple de 'faire' à la 3ème pers. pl. ?", options: ["firent", "faisaient", "ont fait", "feront"], answer: 0 },
    ],
  },

  l4: {
    summary:
      "L'accord des adjectifs interrogatifs et exclamatifs (quel, quelle, quels, quelles) se fait en genre et en nombre avec le nom qu'ils accompagnent. Il faut les distinguer des homophones « qu'elle(s) » (que + elle/elles), qui contiennent le pronom personnel elle.",
    keyPoints: [
      "Quel(s)/Quelle(s) : adjectif interrogatif ou exclamatif, s'accorde avec le nom (Quelle heure est-il ? Quels beaux paysages !)",
      "Qu'elle(s) : 'que' + pronom 'elle/elles' (Je pense qu'elle viendra. / Je sais qu'elles partiront.)",
      "Pour distinguer : remplacer par 'il/ils' — si la phrase garde son sens, c'est 'qu'il(s)'/'qu'elle(s)'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : '___ belle journée !' (exclamatif)",
        options: ["Quelle", "Qu'elle", "Quels", "Qu'ils"],
        answer: 0,
        explanation: "'Quelle' est l'adjectif exclamatif, féminin singulier, accordé avec 'journée'.",
      },
      {
        difficulty: "moyen",
        question: "Complète : 'Je pense ___ arrivera bientôt.'",
        options: ["qu'elle", "quelle", "quels", "quelles"],
        answer: 0,
        explanation: "'Qu'elle' = que + elle (pronom), remplaçable par 'qu'il' : Je pense qu'il arrivera.",
      },
      {
        difficulty: "difficile",
        question: "Complète les deux mots : '___ chance ___ a eue de gagner !'",
        options: ["Quelle / qu'elle", "Qu'elle / quelle", "Quelle / quelle", "Qu'elle / qu'elle"],
        answer: 0,
        explanation: "'Quelle chance' (adjectif exclamatif accordé avec 'chance') et 'qu'elle a eue' (que + pronom elle, sujet de 'a eue').",
      },
    ],
    quiz: [
      { question: "Complète : 'Je sais ___ partira demain.'", options: ["qu'elle", "quelle", "quels", "quelles"], answer: 0 },
      { question: "Complète : '___ heure est-il ?'", options: ["Quelle", "Qu'elle", "Quels", "Qu'ils"], answer: 0 },
      { question: "Pour vérifier 'qu'elle', on peut remplacer par :", options: ["qu'il", "quel", "quels", "aucun remplacement possible"], answer: 0 },
      { question: "Complète : '___ beaux tableaux !' (pluriel masculin)", options: ["Quels", "Quelles", "Qu'ils", "Qu'elles"], answer: 0 },
      { question: "'Quel(s)/Quelle(s)' s'accorde avec :", options: ["le nom qu'il accompagne", "le verbe uniquement", "rien de particulier", "toujours au masculin"], answer: 0 },
    ],
  },

  l5: {
    summary:
      "Produire un récit intégrant un dialogue nécessite de combiner narration (au passé simple/imparfait) et discours direct (paroles rapportées entre guillemets, avec tirets pour les changements de locuteur), en veillant à la cohérence des temps et à la ponctuation.",
    keyPoints: [
      "Le dialogue s'insère dans le récit avec des verbes de parole variés (dit-il, répondit-elle, s'exclama-t-il)",
      "Ponctuation : guillemets pour ouvrir/fermer le dialogue, tirets pour chaque changement de locuteur",
      "Le récit autour du dialogue reste au passé simple/imparfait, cohérent avec le reste du texte",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel signe encadre un dialogue rapporté dans un récit ?",
        options: ["les guillemets", "les parenthèses", "les crochets", "aucun signe"],
        answer: 0,
        explanation: "Les guillemets « » encadrent l'ensemble du dialogue rapporté.",
      },
      {
        difficulty: "moyen",
        question: "Quel signe marque un changement de locuteur dans un dialogue ?",
        options: ["le tiret en début de ligne", "la virgule", "le point d'exclamation", "les parenthèses"],
        answer: 0,
        explanation: "Le tiret en début de ligne indique qu'un nouveau personnage prend la parole.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi est-il important de varier les verbes de parole (dit-il, s'exclama-t-elle, murmura-t-il) dans un dialogue narratif ?",
        options: ["cela évite la répétition monotone de 'dire' et apporte des nuances sur le ton ou l'émotion du personnage qui parle", "cela n'a aucune importance stylistique", "il est interdit d'utiliser plus d'un verbe de parole dans un texte", "cela change le sens des paroles rapportées"],
        answer: 0,
        explanation: "Varier les verbes de parole évite la monotonie et enrichit le texte en suggérant le ton, l'émotion, ou l'attitude du personnage qui s'exprime.",
      },
    ],
    quiz: [
      { question: "Quel verbe de parole suggère la colère ?", options: ["s'écria-t-il", "murmura-t-il", "chuchota-t-il", "dit-il calmement"], answer: 0 },
      { question: "Le récit autour du dialogue est généralement au :", options: ["passé simple/imparfait", "présent uniquement", "futur uniquement", "impératif"], answer: 0 },
      { question: "Où se place le tiret dans un dialogue ?", options: ["en début de ligne", "en fin de ligne", "au milieu du mot", "nulle part en particulier"], answer: 0 },
      { question: "Un bon dialogue narratif doit :", options: ["varier les verbes de parole et respecter la ponctuation", "utiliser toujours le même verbe 'dire'", "éviter toute ponctuation", "être écrit au futur uniquement"], answer: 0 },
      { question: "Les guillemets encadrent :", options: ["l'ensemble du dialogue rapporté", "seulement le premier mot", "seulement le verbe de parole", "rien de précis"], answer: 0 },
    ],
  },

  l6: {
    summary:
      "Le texte descriptif du Module 2 (« Vivre ensemble ») s'appuie sur des portraits et comportements, nécessitant la maîtrise de techniques descriptives : ordre logique de présentation, vocabulaire précis, et choix des détails pertinents pour caractériser une personne ou une situation sociale.",
    keyPoints: [
      "Un bon texte descriptif suit un ordre logique (des traits généraux aux détails, ou l'inverse)",
      "Le vocabulaire précis (adjectifs variés, verbes d'état) rend la description vivante",
      "Le thème 'Portraits et comportements' invite à décrire à la fois l'apparence physique et les attitudes sociales d'une personne",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Un texte descriptif de portrait décrit généralement :",
        options: ["l'apparence physique et le caractère d'une personne", "uniquement des lieux", "uniquement des événements", "aucun élément précis"],
        answer: 0,
        explanation: "Le portrait combine description physique et traits de caractère ou comportement.",
      },
      {
        difficulty: "moyen",
        question: "Quel ordre est souvent utilisé pour structurer une description ?",
        options: ["des traits généraux aux détails précis", "toujours aléatoire", "de la fin vers le début", "sans aucun ordre"],
        answer: 0,
        explanation: "Un ordre logique (du général au particulier, ou l'inverse) aide le lecteur à suivre la description clairement.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi le thème 'Portraits et comportements' pourrait-il inclure une dimension sociale au-delà de la simple apparence physique ?",
        options: ["parce que décrire le comportement d'une personne (sa façon d'agir avec les autres) révèle des aspects sociaux et relationnels plus profonds que la seule apparence", "parce que le comportement n'a aucun lien avec la description", "parce que 'vivre ensemble' ne concerne que les lieux physiques", "parce que l'apparence physique est le seul aspect pertinent d'un portrait"],
        answer: 0,
        explanation: "Le comportement (attitudes, manières d'interagir) révèle des dimensions sociales et relationnelles, en lien direct avec le thème 'Vivre ensemble', au-delà du simple aspect physique.",
      },
    ],
    quiz: [
      { question: "Un portrait complet inclut :", options: ["l'apparence physique et le caractère", "uniquement les vêtements", "uniquement l'âge", "aucun détail précis"], answer: 0 },
      { question: "Le vocabulaire précis dans une description sert à :", options: ["rendre le texte plus vivant et clair", "compliquer inutilement le texte", "raccourcir le texte", "remplacer la grammaire"], answer: 0 },
      { question: "Quel type d'adjectif enrichit une description ?", options: ["des adjectifs variés et précis", "toujours le même adjectif répété", "aucun adjectif", "seulement des adjectifs négatifs"], answer: 0 },
      { question: "'Vivre ensemble' comme centre d'intérêt suggère un thème :", options: ["social et relationnel", "purement scientifique", "historique uniquement", "sans rapport avec les personnes"], answer: 0 },
      { question: "Décrire le comportement d'une personne révèle souvent :", options: ["des aspects sociaux et relationnels", "uniquement sa taille", "uniquement sa couleur de cheveux", "rien de particulier"], answer: 0 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1, part A)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});