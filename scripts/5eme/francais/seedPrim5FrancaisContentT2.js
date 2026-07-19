// scripts/seedPrim5FrancaisContentT2.js
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

// Trimestre 2 — lessons l9 through l16
const LESSON_CONTENT = {
  l9: {
    summary:
      "Dans une phrase, le sujet est le groupe de mots qui fait l'action ou dont on parle, et le verbe exprime cette action ou cet état. Le sujet se trouve en posant la question 'Qui est-ce qui...?' avant le verbe.",
    keyPoints: [
      "Le sujet répond à la question 'Qui est-ce qui...?' avant le verbe",
      "Le verbe s'accorde toujours avec son sujet en personne et en nombre",
      "Le sujet peut être un nom, un groupe nominal, ou un pronom",
      "Exemple : 'Les enfants (sujet) jouent (verbe) dans le jardin.'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Le chien aboie', quel est le sujet ?",
        options: ["Le", "chien", "Le chien", "aboie"],
        answer: 2,
        explanation: "'Le chien' est le groupe sujet complet qui fait l'action d'aboyer.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Mes parents travaillent beaucoup', quel est le verbe ?",
        options: ["Mes", "parents", "travaillent", "beaucoup"],
        answer: 2,
        explanation: "'Travaillent' est le verbe conjugué qui exprime l'action.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Le petit chat noir dort paisiblement', quel est le groupe sujet complet ?",
        options: ["Le petit chat noir", "chat noir", "dort paisiblement", "Le petit"],
        answer: 0,
        explanation: "'Le petit chat noir' est le groupe sujet complet (déterminant + adjectif + nom + adjectif).",
      },
    ],
    quiz: [
      { question: "Le sujet répond à la question :", options: ["Où ?", "Qui est-ce qui... ?", "Quand ?", "Comment ?"], answer: 1 },
      { question: "Le verbe s'accorde avec :", options: ["le complément", "le sujet", "l'adjectif", "rien de particulier"], answer: 1 },
      { question: "Dans 'Elle chante', quel est le sujet ?", options: ["Elle", "chante", "les deux", "aucun"], answer: 0 },
      { question: "Le sujet peut être :", options: ["seulement un nom", "un nom, un groupe nominal, ou un pronom", "seulement un verbe", "seulement un adjectif"], answer: 1 },
      { question: "Dans 'La maîtresse explique la leçon', quel est le sujet ?", options: ["La maîtresse", "explique", "la leçon", "leçon"], answer: 0 },
    ],
  },

  l10: {
    summary:
      "Le complément d'objet direct (COD) complète le verbe sans préposition et répond à 'quoi ?' ou 'qui ?'. Le complément d'objet indirect (COI) est relié au verbe par une préposition (à, de) et répond à 'à quoi ?', 'à qui ?', 'de quoi ?'.",
    keyPoints: [
      "COD : répond à 'quoi ?' ou 'qui ?' sans préposition — Il mange une pomme.",
      "COI : répond à 'à qui ?', 'à quoi ?', 'de quoi ?' avec préposition — Il parle à son ami.",
      "Certains verbes se construisent avec un COD, d'autres avec un COI, selon le verbe",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Il lit un livre', quel est le COD ?",
        options: ["Il", "lit", "un livre", "aucun"],
        answer: 2,
        explanation: "'Un livre' répond à 'il lit quoi ?', sans préposition, c'est le COD.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Elle parle à sa sœur', quel est le COI ?",
        options: ["Elle", "parle", "à sa sœur", "aucun"],
        answer: 2,
        explanation: "'À sa sœur' répond à 'elle parle à qui ?' et est introduit par la préposition 'à', c'est le COI.",
      },
      {
        difficulty: "difficile",
        question: "Dans la phrase 'Il offre un cadeau à sa mère', identifie le COD et le COI :",
        options: ["COD : un cadeau / COI : à sa mère", "COD : à sa mère / COI : un cadeau", "les deux sont des COD", "les deux sont des COI"],
        answer: 0,
        explanation: "'Un cadeau' est le COD (offre quoi ?) et 'à sa mère' est le COI (offre à qui ?).",
      },
    ],
    quiz: [
      { question: "Le COD répond à quelle question ?", options: ["où ?", "quoi ?/qui ?", "quand ?", "comment ?"], answer: 1 },
      { question: "Le COI est toujours introduit par :", options: ["rien", "une préposition", "un article", "un adjectif"], answer: 1 },
      { question: "Dans 'Nous pensons à nos vacances', quel est le COI ?", options: ["Nous", "pensons", "à nos vacances", "aucun"], answer: 2 },
      { question: "Dans 'Elle mange une glace', quel est le COD ?", options: ["Elle", "mange", "une glace", "aucun"], answer: 2 },
      { question: "Le COD est-il relié au verbe par une préposition ?", options: ["oui, toujours", "non, jamais", "parfois seulement", "cela dépend du sujet"], answer: 1 },
    ],
  },

  l11: {
    summary:
      "L'adjectif qualificatif donne une information sur le nom qu'il accompagne. Il s'accorde toujours en genre et en nombre avec ce nom, et peut se placer avant ou après le nom selon l'adjectif.",
    keyPoints: [
      "L'adjectif s'accorde en genre (masculin/féminin) et en nombre (singulier/pluriel) avec le nom",
      "Règle générale du féminin : ajout d'un -e (petit → petite)",
      "Règle générale du pluriel : ajout d'un -s (grand → grands)",
      "Certains adjectifs se placent avant le nom (un joli chat), d'autres après (un chat noir)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Accorde : une fille (grand) ___.",
        options: ["grand", "grande", "grands", "grandes"],
        answer: 1,
        explanation: "'Fille' est féminin singulier, l'adjectif s'accorde donc en 'grande'.",
      },
      {
        difficulty: "moyen",
        question: "Accorde : des maisons (blanc) ___.",
        options: ["blanc", "blanche", "blancs", "blanches"],
        answer: 3,
        explanation: "'Maisons' est féminin pluriel, l'adjectif s'accorde en 'blanches'.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase est correctement accordée ?",
        options: ["Des fleurs jaune", "Des fleurs jaunes", "Des fleur jaunes", "Un fleurs jaune"],
        answer: 1,
        explanation: "'Fleurs' est féminin pluriel, l'adjectif 'jaune' doit donc prendre un -s : jaunes.",
      },
    ],
    quiz: [
      { question: "Quel mot est un adjectif qualificatif ?", options: ["maison", "petite", "chante", "avec"], answer: 1 },
      { question: "Accorde : des voitures (rapide) ___.", options: ["rapide", "rapides", "rapide", "rapids"], answer: 1 },
      { question: "Accorde : un garçon (heureux) ___.", options: ["heureux", "heureuse", "heureuses", "heureu"], answer: 0 },
      { question: "L'adjectif s'accorde en :", options: ["temps seulement", "genre et nombre", "personne", "lieu"], answer: 1 },
      { question: "Accorde : une robe (blanc) ___.", options: ["blanc", "blanche", "blancs", "blanches"], answer: 1 },
    ],
  },

  l12: {
    summary:
      "Les verbes du 2ème groupe (infinitif en -ir, participe présent en -issant) et du 3ème groupe (verbes irréguliers comme prendre, venir, voir) ont des conjugaisons spécifiques au présent qu'il faut mémoriser.",
    keyPoints: [
      "2ème groupe (-ir/-issant) : je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent",
      "3ème groupe : verbes irréguliers, chacun avec sa propre conjugaison (prendre : je prends, nous prenons)",
      "Le 3ème groupe regroupe tous les verbes qui ne suivent pas les règles du 1er ou 2ème groupe",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Je ___ (finir) mon repas.",
        options: ["finis", "finit", "finissons", "finissent"],
        answer: 0,
        explanation: "À la 1ère personne du singulier pour un verbe du 2ème groupe, la terminaison est -is.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Nous ___ (prendre) le bus.",
        options: ["prends", "prend", "prenons", "prennent"],
        answer: 2,
        explanation: "'Prendre' (3ème groupe) : nous prenons.",
      },
      {
        difficulty: "difficile",
        question: "Complète : Ils ___ (voir) un beau film ce soir.",
        options: ["voient", "voyent", "voit", "voir"],
        answer: 0,
        explanation: "'Voir' (3ème groupe irrégulier) : je vois, tu vois, il voit, nous voyons, vous voyez, ils voient.",
      },
    ],
    quiz: [
      { question: "Complète : Tu ___ (choisir) une couleur.", options: ["choisis", "choisit", "choisissons", "choisissent"], answer: 0 },
      { question: "Complète : Elle ___ (venir) demain.", options: ["viens", "vient", "venons", "viennent"], answer: 1 },
      { question: "Complète : Vous ___ (grandir) vite.", options: ["grandis", "grandit", "grandissez", "grandissent"], answer: 2 },
      { question: "Le 3ème groupe regroupe :", options: ["tous les verbes en -er", "tous les verbes réguliers en -ir", "les verbes irréguliers", "aucun verbe"], answer: 2 },
      { question: "Complète : Je ___ (prendre) mon cartable.", options: ["prends", "prend", "prenons", "prennent"], answer: 0 },
    ],
  },

  l13: {
    summary:
      "Les compléments circonstanciels donnent des précisions sur les circonstances de l'action : le lieu (où ?), le temps (quand ?), ou la manière (comment ?). Contrairement au COD et au COI, ils peuvent souvent être déplacés ou supprimés sans rendre la phrase incorrecte.",
    keyPoints: [
      "Complément de lieu : répond à 'où ?' — Il joue dans le jardin.",
      "Complément de temps : répond à 'quand ?' — Il joue le matin.",
      "Complément de manière : répond à 'comment ?' — Il joue joyeusement.",
      "Ces compléments peuvent souvent être déplacés dans la phrase sans en changer le sens",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Elle dort dans sa chambre', quel type de complément est 'dans sa chambre' ?",
        options: ["de lieu", "de temps", "de manière", "COD"],
        answer: 0,
        explanation: "'Dans sa chambre' répond à 'où ?', c'est un complément circonstanciel de lieu.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Il travaille rapidement', quel type de complément est 'rapidement' ?",
        options: ["de lieu", "de temps", "de manière", "COD"],
        answer: 2,
        explanation: "'Rapidement' répond à 'comment ?', c'est un complément circonstanciel de manière.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Demain, nous partirons en voyage joyeusement', combien de compléments circonstanciels différents identifie-t-on ?",
        options: ["1", "2", "3", "0"],
        answer: 2,
        explanation: "'Demain' (temps), 'en voyage' (lieu), et 'joyeusement' (manière) sont trois compléments circonstanciels différents.",
      },
    ],
    quiz: [
      { question: "Le complément de temps répond à :", options: ["où ?", "quand ?", "comment ?", "pourquoi ?"], answer: 1 },
      { question: "Le complément de manière répond à :", options: ["où ?", "quand ?", "comment ?", "pourquoi ?"], answer: 2 },
      { question: "Le complément de lieu répond à :", options: ["où ?", "quand ?", "comment ?", "pourquoi ?"], answer: 0 },
      { question: "Ces compléments peuvent souvent être :", options: ["ni déplacés ni supprimés", "déplacés ou supprimés sans rendre la phrase incorrecte", "seulement supprimés", "seulement déplacés"], answer: 1 },
      { question: "Dans 'Il chante le soir', quel complément est 'le soir' ?", options: ["de lieu", "de temps", "de manière", "COD"], answer: 1 },
    ],
  },

  l14: {
    summary:
      "L'imparfait est un temps du passé qui exprime une action habituelle, une description, ou une action qui durait dans le passé, sans indication précise de début ou de fin. Il se forme à partir du radical de 'nous' au présent, avec des terminaisons régulières.",
    keyPoints: [
      "L'imparfait exprime une habitude passée, une description, ou une action en cours dans le passé",
      "Formation : radical de 'nous' au présent + terminaisons -ais, -ais, -ait, -ions, -iez, -aient",
      "Exemple avec 'parler' (nous parlons) : je parlais, tu parlais, il parlait, nous parlions, vous parliez, ils parlaient",
      "Le verbe être est irrégulier à l'imparfait dans son radical : j'étais, tu étais...",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète à l'imparfait : Quand j'étais petit, je ___ (jouer) tous les jours.",
        options: ["joue", "jouais", "jouerai", "ai joué"],
        answer: 1,
        explanation: "L'imparfait exprime une habitude passée : je jouais.",
      },
      {
        difficulty: "moyen",
        question: "Complète à l'imparfait : Nous ___ (finir) toujours nos devoirs avant le dîner.",
        options: ["finissons", "finissions", "finirons", "avons fini"],
        answer: 1,
        explanation: "À l'imparfait, à la 1ère personne du pluriel : nous finissions.",
      },
      {
        difficulty: "difficile",
        question: "Complète à l'imparfait : Le ciel ___ (être) gris ce jour-là.",
        options: ["est", "était", "sera", "a été"],
        answer: 1,
        explanation: "'Être' à l'imparfait, 3ème personne du singulier : il était (utilisé ici pour décrire une situation passée).",
      },
    ],
    quiz: [
      { question: "L'imparfait exprime souvent :", options: ["une action future", "une habitude ou description passée", "un ordre", "une question"], answer: 1 },
      { question: "Complète : Tu ___ (chanter) chaque matin.", options: ["chantes", "chantais", "chanteras", "as chanté"], answer: 1 },
      { question: "Quelle terminaison utilise-t-on à 'nous' à l'imparfait ?", options: ["-ons", "-ions", "-ais", "-aient"], answer: 1 },
      { question: "Complète : Ils ___ (avoir) souvent peur du noir.", options: ["ont", "avaient", "auront", "ont eu"], answer: 1 },
      { question: "Le radical de l'imparfait vient généralement de :", options: ["l'infinitif", "le 'nous' du présent", "le futur", "le passé composé"], answer: 1 },
    ],
  },

  l15: {
    summary:
      "Une famille de mots regroupe des mots qui partagent la même racine et donc un lien de sens, même s'ils ont des natures grammaticales différentes (nom, verbe, adjectif). Exemple : la famille de 'terre' inclut terrain, terrestre, atterrir.",
    keyPoints: [
      "Une famille de mots partage une racine commune",
      "Les mots d'une même famille peuvent être des noms, verbes, ou adjectifs",
      "Exemple : chant (nom) → chanter (verbe) → chanteur (nom) → chantant (adjectif)",
      "Reconnaître les familles de mots aide à deviner le sens de mots nouveaux",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel mot appartient à la famille de 'jardin' ?",
        options: ["jardinier", "maison", "fleur", "arbre"],
        answer: 0,
        explanation: "'Jardinier' partage la racine 'jardin' et appartient à la même famille de mots.",
      },
      {
        difficulty: "moyen",
        question: "Quel mot n'appartient PAS à la famille de 'dent' ?",
        options: ["dentiste", "dentaire", "dentelle", "dentier"],
        answer: 2,
        explanation: "'Dentelle' n'a pas de lien de sens avec 'dent' malgré une ressemblance de son, contrairement à dentiste, dentaire, et dentier.",
      },
      {
        difficulty: "difficile",
        question: "Quelle famille de mots regroupe 'terre', 'terrain', 'terrestre', et 'atterrir' ?",
        options: ["la famille du mot 'terre'", "aucune famille commune", "la famille du mot 'air'", "la famille du mot 'eau'"],
        answer: 0,
        explanation: "Tous ces mots partagent la racine 'terr-' liée au mot 'terre' et à son sens.",
      },
    ],
    quiz: [
      { question: "Une famille de mots regroupe des mots qui partagent :", options: ["le même son uniquement", "une racine commune et un lien de sens", "la même longueur", "rien de particulier"], answer: 1 },
      { question: "Quel mot appartient à la famille de 'fleur' ?", options: ["fleuriste", "feuille", "arbre", "jardin"], answer: 0 },
      { question: "Les mots d'une même famille peuvent être :", options: ["seulement des noms", "noms, verbes, ou adjectifs", "seulement des verbes", "seulement des adjectifs"], answer: 1 },
      { question: "Quel mot appartient à la famille de 'chant' ?", options: ["chanteur", "champ", "chance", "changer"], answer: 0 },
      { question: "Reconnaître les familles de mots aide à :", options: ["deviner le sens de mots nouveaux", "compter les lettres", "rien de particulier", "conjuguer les verbes"], answer: 0 },
    ],
  },

  l16: {
    summary:
      "Les homophones grammaticaux sont des mots qui se prononcent de la même façon mais ont un sens et une orthographe différents. Il faut apprendre à les distinguer : son/sont, on/ont, ce/se, pour éviter les fautes d'orthographe.",
    keyPoints: [
      "'Son' (déterminant possessif) / 'sont' (verbe être, 3ème pers. pluriel du présent)",
      "'On' (pronom indéfini, = quelqu'un/nous) / 'ont' (verbe avoir, 3ème pers. pluriel du présent)",
      "'Ce' (déterminant démonstratif) / 'se' (pronom réfléchi)",
      "Pour vérifier, on peut remplacer 'sont' par 'étaient' et 'ont' par 'avaient'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Il joue avec ___ ballon. (son/sont)",
        options: ["son", "sont"],
        answer: 0,
        explanation: "'Son' est un déterminant possessif ici, devant le nom 'ballon'.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Mes amis ___ contents. (son/sont)",
        options: ["son", "sont"],
        answer: 1,
        explanation: "On peut remplacer par 'étaient' : Mes amis étaient contents, donc c'est 'sont' (verbe être).",
      },
      {
        difficulty: "difficile",
        question: "Complète les deux mots : ___ dit qu'ils ___ beaucoup de chance. (on/ont)",
        options: ["On / ont", "Ont / on", "On / on", "Ont / ont"],
        answer: 0,
        explanation: "'On dit' (pronom, remplaçable par 'il/elle') et 'ils ont' (verbe avoir, remplaçable par 'avaient') : On dit qu'ils ont beaucoup de chance.",
      },
    ],
    quiz: [
      { question: "Comment vérifie-t-on si c'est 'son' ou 'sont' ?", options: ["en remplaçant par 'étaient'", "en remplaçant par 'avaient'", "cela ne se vérifie pas", "en comptant les lettres"], answer: 0 },
      { question: "Complète : Le chat lèche ___ pelage. (se/ce)", options: ["se", "ce"], answer: 0 },
      { question: "Complète : ___ livre est intéressant. (se/ce)", options: ["se", "ce"], answer: 1 },
      { question: "Comment vérifie-t-on si c'est 'on' ou 'ont' ?", options: ["en remplaçant par 'avaient'", "en remplaçant par 'étaient'", "les deux se remplacent pareil", "cela ne se vérifie pas"], answer: 0 },
      { question: "Complète : Ils ___ un nouveau vélo. (on/ont)", options: ["on", "ont"], answer: 1 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 2)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});