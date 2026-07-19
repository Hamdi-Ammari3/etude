// scripts/seedPrim6FrancaisContentT1.js
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

const GRADE_ID = "prim-6";
const SUBJECT_ID = "francais";

// Trimestre 1 — lessons l1 through l7
const LESSON_CONTENT = {
  l1: {
    summary:
      "Révision et approfondissement de trois notions fondamentales : les déterminants (qui précisent le nom), les noms (communs ou propres), et les pronoms personnels (qui remplacent un nom pour éviter les répétitions).",
    keyPoints: [
      "Déterminants : articles (le, la, un, une), possessifs (mon, ta...), démonstratifs (ce, cette...)",
      "Noms : communs (chien, table) ou propres (Sami, Tunis), toujours précédés d'un déterminant sauf exceptions",
      "Pronoms personnels sujets : je, tu, il/elle, nous, vous, ils/elles — remplacent un nom déjà mentionné",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel mot est un déterminant dans 'la maison' ?",
        options: ["la", "maison", "les deux", "aucun"],
        answer: 0,
        explanation: "'La' est le déterminant qui précède le nom 'maison'.",
      },
      {
        difficulty: "moyen",
        question: "Par quel pronom remplace-t-on 'Sami et Amira' ?",
        options: ["Il", "Elle", "Ils", "Nous"],
        answer: 2,
        explanation: "'Sami et Amira' forme un groupe pluriel mixte, on le remplace par 'ils'.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Mon frère aime son chat', quels sont les déterminants ?",
        options: ["Mon et son", "frère et chat", "aime", "Mon uniquement"],
        answer: 0,
        explanation: "'Mon' précède 'frère' et 'son' précède 'chat', ce sont les deux déterminants possessifs de la phrase.",
      },
    ],
    quiz: [
      { question: "Quel est un nom propre ?", options: ["chien", "Tunis", "table", "voiture"], answer: 1 },
      { question: "Quel pronom remplace un nom féminin singulier ?", options: ["il", "elle", "ils", "elles"], answer: 1 },
      { question: "Quel mot est un déterminant démonstratif ?", options: ["mon", "cette", "le", "les"], answer: 1 },
      { question: "Quel est un nom commun ?", options: ["Sami", "Tunis", "voiture", "France"], answer: 2 },
      { question: "Par quel pronom remplace-t-on 'les enfants' ?", options: ["il", "elle", "ils", "elles"], answer: 2 },
    ],
  },

  l2: {
    summary:
      "Les adjectifs qualificatifs peuvent occuper deux fonctions différentes dans la phrase : épithète (placé directement à côté du nom, sans verbe entre eux) ou attribut (relié au sujet par un verbe d'état comme être, sembler, paraître).",
    keyPoints: [
      "Adjectif épithète : collé au nom, sans verbe entre eux (une jolie fleur)",
      "Adjectif attribut : relié au sujet par un verbe d'état (La fleur est jolie)",
      "Dans les deux fonctions, l'adjectif s'accorde toujours avec le nom ou le sujet qu'il qualifie",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'une grande maison', quelle est la fonction de 'grande' ?",
        options: ["épithète", "attribut", "sujet", "verbe"],
        answer: 0,
        explanation: "'Grande' est directement collé au nom 'maison' sans verbe entre eux, c'est un adjectif épithète.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'La maison est grande', quelle est la fonction de 'grande' ?",
        options: ["épithète", "attribut", "sujet", "complément"],
        answer: 1,
        explanation: "'Grande' est relié au sujet 'La maison' par le verbe d'état 'est', c'est un adjectif attribut.",
      },
      {
        difficulty: "difficile",
        question: "Dans la phrase 'Le ciel semble nuageux ce matin', quelle est la fonction de 'nuageux' ?",
        options: ["épithète", "attribut du sujet", "complément d'objet", "adverbe"],
        answer: 1,
        explanation: "'Nuageux' est relié au sujet 'Le ciel' par le verbe d'état 'semble', c'est donc un adjectif attribut.",
      },
    ],
    quiz: [
      { question: "L'adjectif épithète est-il séparé du nom par un verbe ?", options: ["oui, toujours", "non, il est collé au nom", "parfois", "cela dépend de la phrase"], answer: 1 },
      { question: "Quel verbe relie souvent l'adjectif attribut au sujet ?", options: ["manger", "être", "courir", "jouer"], answer: 1 },
      { question: "Dans 'Il est fatigué', quelle est la fonction de 'fatigué' ?", options: ["épithète", "attribut", "sujet", "complément"], answer: 1 },
      { question: "Dans 'un beau jardin', quelle est la fonction de 'beau' ?", options: ["épithète", "attribut", "sujet", "verbe"], answer: 0 },
      { question: "L'adjectif attribut s'accorde avec :", options: ["le verbe", "le sujet", "rien", "le complément"], answer: 1 },
    ],
  },

  l3: {
    summary:
      "Conjugaison des verbes être et avoir au passé composé (auxiliaire avoir + participe passé été/eu) et au futur simple (radicaux irréguliers serai.../aurai...), deux temps essentiels déjà vus partiellement en 5ème année.",
    keyPoints: [
      "Être au passé composé : j'ai été, tu as été, il a été, nous avons été, vous avez été, ils ont été",
      "Avoir au passé composé : j'ai eu, tu as eu, il a eu, nous avons eu, vous avez eu, ils ont eu",
      "Être au futur : je serai, tu seras, il sera, nous serons, vous serez, ils seront",
      "Avoir au futur : j'aurai, tu auras, il aura, nous aurons, vous aurez, ils auront",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au passé composé : J'___ (être) content hier.",
        options: ["ai été", "étais", "serai", "suis"],
        answer: 0,
        explanation: "Passé composé de 'être' : j'ai été.",
      },
      {
        difficulty: "moyen",
        question: "Complète au futur : Demain, nous ___ (avoir) une surprise.",
        options: ["avons", "avions", "aurons", "avons eu"],
        answer: 2,
        explanation: "Futur simple de 'avoir' à la 1ère personne du pluriel : nous aurons.",
      },
      {
        difficulty: "difficile",
        question: "Complète au futur : Ils ___ (être) fiers de leur travail.",
        options: ["sont", "seront", "ont été", "étaient"],
        answer: 1,
        explanation: "Futur simple de 'être' à la 3ème personne du pluriel : ils seront.",
      },
    ],
    quiz: [
      { question: "Complète au passé composé : Tu ___ (avoir) de la chance.", options: ["as eu", "avais", "auras", "as"], answer: 0 },
      { question: "Complète au futur : Elle ___ (être) heureuse.", options: ["est", "sera", "a été", "était"], answer: 1 },
      { question: "Quel est le participe passé de 'être' ?", options: ["été", "eu", "étant", "ayant"], answer: 0 },
      { question: "Quel est le participe passé de 'avoir' ?", options: ["été", "eu", "avant", "ayant"], answer: 1 },
      { question: "Complète au passé composé : Vous ___ (être) en retard.", options: ["avez été", "étiez", "serez", "êtes"], answer: 0 },
    ],
  },

  l4: {
    summary:
      "Les homophones 'son' et 'sont' se prononcent pareil mais ont des rôles différents. 'Son' est un déterminant possessif (remplaçable par 'ton' ou 'mon'), tandis que 'sont' est le verbe être conjugué (remplaçable par 'étaient').",
    keyPoints: [
      "'Son' (déterminant possessif) : peut être remplacé par 'ton' ou 'mon' — Il a son livre → Il a ton livre",
      "'Sont' (verbe être, 3ème pers. pluriel) : peut être remplacé par 'étaient' — Ils sont contents → Ils étaient contents",
      "Pour vérifier lequel utiliser, on essaie de remplacer par ces mots tests",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Il joue avec ___ ballon. (son/sont)",
        options: ["son", "sont"],
        answer: 0,
        explanation: "On peut remplacer par 'ton' : Il joue avec ton ballon. C'est donc 'son' (déterminant possessif).",
      },
      {
        difficulty: "moyen",
        question: "Complète : Mes amis ___ contents. (son/sont)",
        options: ["son", "sont"],
        answer: 1,
        explanation: "On peut remplacer par 'étaient' : Mes amis étaient contents. C'est donc 'sont' (verbe être).",
      },
      {
        difficulty: "difficile",
        question: "Complète les deux mots : Ils ___ venus avec ___ chien. (sont/son)",
        options: ["sont / son", "son / sont", "sont / sont", "son / son"],
        answer: 0,
        explanation: "'Ils sont venus' (remplaçable par 'étaient') et 'avec son chien' (remplaçable par 'ton chien') : Ils sont venus avec son chien.",
      },
    ],
    quiz: [
      { question: "Comment vérifie-t-on si c'est 'son' ou 'sont' ?", options: ["en remplaçant par 'ton'/'étaient'", "en remplaçant par 'avait'", "cela ne se vérifie pas", "en comptant les lettres"], answer: 0 },
      { question: "Complète : Elle prend ___ cahier. (son/sont)", options: ["son", "sont"], answer: 0 },
      { question: "Complète : Les enfants ___ dans le jardin. (son/sont)", options: ["son", "sont"], answer: 1 },
      { question: "'Son' est un :", options: ["verbe", "déterminant possessif", "pronom", "adjectif"], answer: 1 },
      { question: "'Sont' est une forme du verbe :", options: ["avoir", "être", "aller", "faire"], answer: 1 },
    ],
  },

  l5: {
    summary:
      "Approfondissement de la phrase négative avec 'ne...plus' (qui indique la fin d'une action ou d'un état) et 'ne...jamais' (qui indique une absence totale et permanente dans le temps), en plus de 'ne...pas' déjà connu.",
    keyPoints: [
      "'Ne...pas' : négation simple d'un fait — Je ne mange pas.",
      "'Ne...plus' : indique que quelque chose s'est arrêté — Je ne mange plus de bonbons (j'en mangeais avant, mais plus maintenant).",
      "'Ne...jamais' : indique que quelque chose ne s'est jamais produit — Je ne mange jamais de bonbons (à aucun moment).",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle négation convient si quelque chose s'est arrêté ?",
        options: ["ne...pas", "ne...plus", "ne...jamais", "ne...que"],
        answer: 1,
        explanation: "'Ne...plus' indique qu'une action ou un état a cessé.",
      },
      {
        difficulty: "moyen",
        question: "Complète : 'Je ___ mange ___ de poisson.' (je n'en ai jamais mangé)",
        options: ["ne / plus", "ne / jamais", "ne / pas", "ne / que"],
        answer: 1,
        explanation: "'Ne...jamais' convient car l'action ne s'est produite à aucun moment.",
      },
      {
        difficulty: "difficile",
        question: "Quelle est la différence entre 'Il ne fume plus' et 'Il ne fume jamais' ?",
        options: ["aucune différence", "'ne...plus' signifie qu'il fumait avant et a arrêté; 'ne...jamais' signifie qu'il n'a jamais fumé", "'ne...jamais' signifie qu'il a arrêté", "les deux signifient la même absence totale"],
        answer: 1,
        explanation: "'Ne...plus' implique une habitude passée qui s'est arrêtée, tandis que 'ne...jamais' implique qu'aucune occurrence n'a jamais eu lieu.",
      },
    ],
    quiz: [
      { question: "'Ne...jamais' signifie :", options: ["à aucun moment", "pas maintenant seulement", "avant oui, maintenant non", "toujours"], answer: 0 },
      { question: "Complète : 'Elle ___ joue ___ au ballon.' (elle a arrêté)", options: ["ne / plus", "ne / jamais", "ne / que", "ne / très"], answer: 0 },
      { question: "'Ne...plus' indique :", options: ["la fin d'une action", "le début d'une action", "une action future", "aucune de ces réponses"], answer: 0 },
      { question: "Quelle phrase utilise 'ne...jamais' correctement ?", options: ["Il ne dort jamais avant minuit.", "Il jamais ne dort.", "Il ne dort avant minuit jamais.", "Jamais il dort ne."], answer: 0 },
      { question: "La négation encadre généralement :", options: ["le sujet", "le verbe", "le complément", "l'adjectif"], answer: 1 },
    ],
  },

  l6: {
    summary:
      "Conjugaison des verbes usuels du type 'finir' (2ème groupe) au passé composé (auxiliaire avoir + participe passé en -i) et au futur simple, pour élargir la maîtrise de ces deux temps à un groupe de verbes très fréquent.",
    keyPoints: [
      "Participe passé des verbes en -ir (type finir) : finir → fini, choisir → choisi, grandir → grandi",
      "Passé composé : j'ai fini, tu as fini, il a fini, nous avons fini, vous avez fini, ils ont fini",
      "Futur simple : je finirai, tu finiras, il finira, nous finirons, vous finirez, ils finiront",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au passé composé : J'___ (finir) mon travail.",
        options: ["ai fini", "finissais", "finirai", "finis"],
        answer: 0,
        explanation: "Passé composé de 'finir' à la 1ère personne : j'ai fini.",
      },
      {
        difficulty: "moyen",
        question: "Complète au futur : Nous ___ (choisir) un cadeau demain.",
        options: ["choisissons", "choisirons", "avons choisi", "choisissions"],
        answer: 1,
        explanation: "Futur simple de 'choisir' à la 1ère personne du pluriel : nous choisirons.",
      },
      {
        difficulty: "difficile",
        question: "Complète au passé composé : Elle ___ (grandir) beaucoup cette année.",
        options: ["a grandi", "grandissait", "grandira", "grandit"],
        answer: 0,
        explanation: "Passé composé de 'grandir' : elle a grandi (participe passé en -i, invariable ici car pas d'accord avec avoir sans COD antéposé).",
      },
    ],
    quiz: [
      { question: "Quel est le participe passé de 'finir' ?", options: ["fini", "finit", "finissant", "finira"], answer: 0 },
      { question: "Complète au futur : Tu ___ (réussir) ton examen.", options: ["réussis", "réussiras", "as réussi", "réussissais"], answer: 1 },
      { question: "Complète au passé composé : Ils ___ (choisir) une belle maison.", options: ["ont choisi", "choisissaient", "choisiront", "choisissent"], answer: 0 },
      { question: "Complète au futur : Vous ___ (finir) à temps.", options: ["finissez", "finirez", "avez fini", "finissiez"], answer: 1 },
      { question: "Les verbes du type 'finir' appartiennent au :", options: ["1er groupe", "2ème groupe", "3ème groupe", "aucun groupe"], answer: 1 },
    ],
  },

  l7: {
    summary:
      "Les homophones 'et' et 'est' se prononcent pareil mais ont des rôles différents. 'Et' est un mot de liaison (remplaçable par 'et puis'), tandis que 'est' est le verbe être conjugué (remplaçable par 'était').",
    keyPoints: [
      "'Et' (mot de liaison) : relie deux mots ou groupes — Le chat et le chien jouent.",
      "'Est' (verbe être, 3ème pers. singulier) : peut être remplacé par 'était' — Il est grand → Il était grand",
      "Pour vérifier, on essaie de remplacer 'est' par 'était' ; si ça marche, c'est le verbe",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Mon frère ___ ma sœur jouent. (et/est)",
        options: ["et", "est"],
        answer: 0,
        explanation: "'Et' relie 'mon frère' et 'ma sœur', c'est le mot de liaison.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Elle ___ fatiguée. (et/est)",
        options: ["et", "est"],
        answer: 1,
        explanation: "On peut remplacer par 'était' : Elle était fatiguée. C'est donc 'est' (verbe être).",
      },
      {
        difficulty: "difficile",
        question: "Complète : Le chien ___ content ___ il joue dans le jardin. (est/et)",
        options: ["est / et", "et / est", "est / est", "et / et"],
        answer: 0,
        explanation: "'Le chien est content' (remplaçable par 'était') utilise le verbe 'est', et 'et il joue' relie les deux idées avec le mot de liaison 'et'.",
      },
    ],
    quiz: [
      { question: "Comment vérifie-t-on si c'est 'et' ou 'est' ?", options: ["en remplaçant par 'était'", "en remplaçant par 'avait'", "les deux se remplacent pareil", "cela ne se vérifie pas"], answer: 0 },
      { question: "Complète : Il ___ content. (et/est)", options: ["et", "est"], answer: 1 },
      { question: "Complète : J'aime le pain ___ le fromage. (et/est)", options: ["et", "est"], answer: 0 },
      { question: "'Et' relie :", options: ["deux mots ou groupes", "un sujet et un verbe", "rien de particulier", "seulement des adjectifs"], answer: 0 },
      { question: "'Est' est une forme du verbe :", options: ["avoir", "être", "aller", "faire"], answer: 1 },
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