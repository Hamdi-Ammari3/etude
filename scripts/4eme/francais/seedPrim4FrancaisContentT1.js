// scripts/seedPrim4FrancaisContentT1.js
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

// Trimestre 1 — lessons l1 through l9
const LESSON_CONTENT = {
  l1: {
    summary:
      "Le nom peut être masculin ou féminin, singulier ou pluriel. On reconnaît souvent le féminin grâce au -e ajouté au nom masculin, et le pluriel grâce au -s ajouté au singulier. Le déterminant qui accompagne le nom s'accorde toujours avec lui.",
    keyPoints: [
      "Un nom masculin : le garçon, un chat, le stylo",
      "Un nom féminin : la fille, une chatte, la table",
      "Le pluriel se forme souvent en ajoutant -s : un livre → des livres",
      "Le déterminant s'accorde avec le nom : le/la, un/une, les/des",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel est le féminin de 'un ami' ?",
        options: ["un amis", "une amie", "un amie", "une ami"],
        answer: 1,
        explanation: "On ajoute un -e au nom masculin pour former le féminin : ami → amie.",
      },
      {
        difficulty: "moyen",
        question: "Quel est le pluriel de 'le cahier' ?",
        options: ["le cahiers", "les cahier", "les cahiers", "des cahier"],
        answer: 2,
        explanation: "Au pluriel, le déterminant 'le' devient 'les', et on ajoute -s au nom : les cahiers.",
      },
      {
        difficulty: "difficile",
        question: "Dans la phrase 'Les enfants jouent avec leurs ballons', quel mot est un nom au pluriel ?",
        options: ["Les", "enfants", "jouent", "avec"],
        answer: 1,
        explanation: "'Enfants' est un nom commun au pluriel (avec un -s), désignant plusieurs personnes.",
      },
    ],
    quiz: [
      { question: "Quel est le féminin de 'un voisin' ?", options: ["une voisine", "un voisine", "une voisin", "un voisins"], answer: 0 },
      { question: "Quel est le pluriel de 'la table' ?", options: ["le tables", "les table", "les tables", "des table"], answer: 2 },
      { question: "'Chat' est un nom :", options: ["féminin", "masculin", "ni l'un ni l'autre", "toujours pluriel"], answer: 1 },
      { question: "Quel déterminant accompagne un nom féminin singulier ?", options: ["le", "la", "les", "un"], answer: 1 },
      { question: "Quel est le pluriel de 'un stylo' ?", options: ["un stylos", "des stylo", "des stylos", "les stylo"], answer: 2 },
    ],
  },

  l2: {
    summary:
      "Le verbe être est un verbe très fréquent qui se conjugue de façon irrégulière au présent. Il sert à décrire, identifier ou situer une personne ou une chose. Il faut mémoriser sa conjugaison à toutes les personnes.",
    keyPoints: [
      "Je suis, tu es, il/elle est",
      "Nous sommes, vous êtes, ils/elles sont",
      "Le verbe être sert à décrire (Je suis grand) ou à identifier (C'est mon frère)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Je ___ content.",
        options: ["es", "suis", "est", "sommes"],
        answer: 1,
        explanation: "À la 1ère personne du singulier, le verbe être se conjugue 'suis' : Je suis content.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Nous ___ à l'école.",
        options: ["sommes", "êtes", "sont", "es"],
        answer: 0,
        explanation: "À la 1ère personne du pluriel, on utilise 'sommes' : Nous sommes à l'école.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase est correctement conjuguée ?",
        options: ["Ils est fatigués", "Vous êtes fatigué", "Elles est fatiguées", "Tu sommes fatigué"],
        answer: 1,
        explanation: "'Vous êtes' est la forme correcte à la 2ème personne du pluriel.",
      },
    ],
    quiz: [
      { question: "Complète : Tu ___ mon ami.", options: ["es", "est", "suis", "sommes"], answer: 0 },
      { question: "Complète : Elle ___ intelligente.", options: ["es", "est", "sont", "êtes"], answer: 1 },
      { question: "Complète : Vous ___ en retard.", options: ["sommes", "êtes", "sont", "es"], answer: 1 },
      { question: "Complète : Ils ___ contents.", options: ["est", "sont", "êtes", "suis"], answer: 1 },
      { question: "Quelle est la 1ère personne du singulier du verbe être ?", options: ["es", "est", "suis", "sommes"], answer: 2 },
    ],
  },

  l3: {
    summary:
      "Les articles sont des petits mots placés devant le nom. Les articles définis (le, la, les) désignent une chose précise déjà connue. Les articles indéfinis (un, une, des) désignent une chose non précisée.",
    keyPoints: [
      "Articles définis : le, la, l', les — pour une chose précise",
      "Articles indéfinis : un, une, des — pour une chose non précisée",
      "Exemple : 'Le chat' (ce chat précis) / 'Un chat' (un chat parmi d'autres)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel article est indéfini ?",
        options: ["le", "la", "un", "les"],
        answer: 2,
        explanation: "'Un' est un article indéfini, utilisé pour une chose non précisée.",
      },
      {
        difficulty: "moyen",
        question: "Complète : ___ maison de mon ami est grande.",
        options: ["Un", "La", "Le", "Des"],
        answer: 1,
        explanation: "On utilise l'article défini féminin 'La' car on parle d'une maison précise (celle de l'ami).",
      },
      {
        difficulty: "difficile",
        question: "Dans la phrase 'J'ai vu un oiseau, l'oiseau chantait joliment', pourquoi utilise-t-on 'l'oiseau' la deuxième fois ?",
        options: ["Parce que c'est un nom féminin", "Parce que l'oiseau est maintenant connu et précis", "Parce que c'est une erreur", "Parce que c'est au pluriel"],
        answer: 1,
        explanation: "Une fois l'oiseau mentionné une première fois avec 'un', il devient précis et connu, donc on utilise l'article défini 'l'' la deuxième fois.",
      },
    ],
    quiz: [
      { question: "'Les' est un article :", options: ["indéfini singulier", "défini pluriel", "indéfini pluriel", "défini singulier"], answer: 1 },
      { question: "Complète : J'ai ___ chien.", options: ["le", "un", "les", "la"], answer: 1 },
      { question: "Quel article utilise-t-on devant un nom commençant par une voyelle ?", options: ["le", "la", "l'", "les"], answer: 2 },
      { question: "'Des' est un article :", options: ["défini singulier", "indéfini pluriel", "défini pluriel", "indéfini singulier"], answer: 1 },
      { question: "Complète : ___ élève travaille bien.", options: ["Le", "L'", "Les", "Des"], answer: 1 },
    ],
  },

  l4: {
    summary:
      "Une phrase simple est composée d'un sujet (qui fait l'action) et d'un verbe (l'action elle-même). On peut identifier le sujet en posant la question 'Qui est-ce qui fait l'action ?' avant le verbe.",
    keyPoints: [
      "Le sujet répond à la question 'Qui est-ce qui...?' avant le verbe",
      "Le verbe exprime l'action ou l'état",
      "Exemple : 'Le chat (sujet) dort (verbe).'",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans la phrase 'Le chien court', quel est le sujet ?",
        options: ["Le", "chien", "Le chien", "court"],
        answer: 2,
        explanation: "'Le chien' est le groupe sujet complet qui fait l'action de courir.",
      },
      {
        difficulty: "moyen",
        question: "Dans la phrase 'Les enfants chantent une chanson', quel est le verbe ?",
        options: ["Les", "enfants", "chantent", "chanson"],
        answer: 2,
        explanation: "'Chantent' est le verbe conjugué qui exprime l'action.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase a un sujet composé de plusieurs mots ?",
        options: ["Il dort.", "Le petit garçon joue.", "Elle chante.", "Nous partons."],
        answer: 1,
        explanation: "'Le petit garçon' est un groupe sujet composé de trois mots (déterminant + adjectif + nom).",
      },
    ],
    quiz: [
      { question: "Le sujet répond à la question :", options: ["Où ?", "Qui est-ce qui... ?", "Quand ?", "Comment ?"], answer: 1 },
      { question: "Dans 'La maîtresse explique la leçon', quel est le sujet ?", options: ["La maîtresse", "explique", "la leçon", "leçon"], answer: 0 },
      { question: "Dans 'Il pleut', quel est le verbe ?", options: ["Il", "pleut", "aucun", "les deux"], answer: 1 },
      { question: "Une phrase simple contient au minimum :", options: ["un sujet et un verbe", "trois mots", "un adjectif", "un article"], answer: 0 },
      { question: "Dans 'Mon frère aime le football', quel est le sujet ?", options: ["Mon frère", "aime", "le football", "football"], answer: 0 },
    ],
  },

  l5: {
    summary:
      "Le verbe avoir, comme être, est très fréquent et irrégulier au présent. Il sert à exprimer la possession (j'ai un livre) ou certaines sensations (j'ai faim, j'ai froid).",
    keyPoints: [
      "J'ai, tu as, il/elle a",
      "Nous avons, vous avez, ils/elles ont",
      "Le verbe avoir exprime la possession : J'ai un vélo",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : J'___ un chat.",
        options: ["ai", "as", "a", "avons"],
        answer: 0,
        explanation: "À la 1ère personne du singulier, on utilise 'ai' : J'ai un chat.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Ils ___ beaucoup de jouets.",
        options: ["a", "ont", "avez", "as"],
        answer: 1,
        explanation: "À la 3ème personne du pluriel, le verbe avoir se conjugue 'ont' : Ils ont beaucoup de jouets.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase utilise correctement le verbe avoir ?",
        options: ["Nous a faim", "Vous avons soif", "Elle a peur", "Tu ont raison"],
        answer: 2,
        explanation: "'Elle a peur' est correct : à la 3ème personne du singulier, on utilise 'a'.",
      },
    ],
    quiz: [
      { question: "Complète : Tu ___ un beau cahier.", options: ["ai", "as", "a", "avez"], answer: 1 },
      { question: "Complète : Nous ___ de la chance.", options: ["avons", "avez", "ont", "as"], answer: 0 },
      { question: "Complète : Vous ___ raison.", options: ["avons", "avez", "ont", "a"], answer: 1 },
      { question: "Quelle est la 3ème personne du singulier du verbe avoir ?", options: ["as", "a", "ont", "ai"], answer: 1 },
      { question: "Complète : Elles ___ soif.", options: ["a", "as", "ont", "ai"], answer: 2 },
    ],
  },

  l6: {
    summary:
      "La ponctuation permet de donner du sens et du rythme à une phrase. Le point (.) marque la fin d'une phrase déclarative, la virgule (,) marque une petite pause, et le point d'interrogation (?) marque une question.",
    keyPoints: [
      "Le point (.) termine une phrase affirmative ou négative",
      "La virgule (,) sépare des éléments dans une énumération ou marque une pause",
      "Le point d'interrogation (?) termine une question",
      "Le point d'exclamation (!) exprime une émotion forte",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel signe utilise-t-on à la fin d'une question ?",
        options: [".", ",", "?", "!"],
        answer: 2,
        explanation: "Le point d'interrogation (?) marque la fin d'une phrase interrogative.",
      },
      {
        difficulty: "moyen",
        question: "Complète : 'J'ai acheté des pommes___ des bananes et des oranges.'",
        options: [".", ",", "?", "!"],
        answer: 1,
        explanation: "La virgule sépare les éléments d'une énumération.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase utilise correctement la ponctuation ?",
        options: ["Comment vas-tu.", "Quel beau jour?", "Comment vas-tu ?", "Il fait beau,"],
        answer: 2,
        explanation: "'Comment vas-tu ?' est une question, elle se termine donc correctement par un point d'interrogation.",
      },
    ],
    quiz: [
      { question: "Quel signe marque une émotion forte ?", options: [".", ",", "?", "!"], answer: 3 },
      { question: "Quel signe termine une phrase déclarative normale ?", options: [".", ",", "?", "!"], answer: 0 },
      { question: "La virgule sert à :", options: ["terminer une phrase", "marquer une pause ou séparer des éléments", "poser une question", "exprimer la surprise"], answer: 1 },
      { question: "Quelle phrase est une question ?", options: ["Il fait chaud.", "Quelle heure est-il ?", "Quel beau temps !", "Je vais bien."], answer: 1 },
      { question: "Combien de signes de ponctuation principaux avons-nous appris ?", options: ["2", "3", "4", "5"], answer: 2 },
    ],
  },

  l7: {
    summary:
      "Le groupe nominal est formé d'un déterminant, d'un nom, et parfois d'un adjectif qui le complète. L'adjectif s'accorde toujours en genre et en nombre avec le nom qu'il accompagne.",
    keyPoints: [
      "Groupe nominal minimal : déterminant + nom (le livre)",
      "Groupe nominal étendu : déterminant + nom + adjectif (le grand livre)",
      "L'adjectif s'accorde avec le nom : une petite fille, un petit garçon",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'la belle maison', quel mot est l'adjectif ?",
        options: ["la", "belle", "maison", "aucun"],
        answer: 1,
        explanation: "'Belle' est l'adjectif qui décrit le nom 'maison'.",
      },
      {
        difficulty: "moyen",
        question: "Complète en accordant : un ___ (grand) jardin.",
        options: ["grand", "grande", "grands", "grandes"],
        answer: 0,
        explanation: "'Jardin' est masculin singulier, donc l'adjectif reste 'grand' sans accord supplémentaire.",
      },
      {
        difficulty: "difficile",
        question: "Quel groupe nominal est correctement accordé ?",
        options: ["une chat noir", "un fille intelligent", "une fille intelligente", "un garçon intelligente"],
        answer: 2,
        explanation: "'Une fille intelligente' : le déterminant, le nom et l'adjectif sont tous au féminin singulier.",
      },
    ],
    quiz: [
      { question: "Dans 'les petits enfants', quel mot est le déterminant ?", options: ["les", "petits", "enfants", "aucun"], answer: 0 },
      { question: "L'adjectif s'accorde avec :", options: ["le verbe", "le sujet", "le nom qu'il accompagne", "rien"], answer: 2 },
      { question: "Complète : une ___ (joli) fleur.", options: ["joli", "jolie", "jolis", "jolies"], answer: 1 },
      { question: "Quel est le groupe nominal dans 'Le chien noir aboie' ?", options: ["Le chien noir", "aboie", "noir", "Le"], answer: 0 },
      { question: "Complète : des ___ (beau) jardins.", options: ["beau", "belle", "beaux", "belles"], answer: 2 },
    ],
  },

  l8: {
    summary:
      "Révision des conjugaisons des verbes être et avoir au présent, pour bien fixer ces deux verbes essentiels avant d'aborder les verbes réguliers du premier groupe.",
    keyPoints: [
      "Être : je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont",
      "Avoir : j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont",
      "Ne pas confondre 'est' (verbe être) et 'et' (mot de liaison)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Nous ___ heureux.",
        options: ["sommes", "avons", "êtes", "sont"],
        answer: 0,
        explanation: "'Sommes' est la forme du verbe être à la 1ère personne du pluriel.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Ils ___ trois chats.",
        options: ["sont", "ont", "êtes", "avons"],
        answer: 1,
        explanation: "'Ont' (verbe avoir) exprime la possession : Ils ont trois chats.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase mélange correctement être et avoir ?",
        options: ["Elle est un vélo rouge", "Elle a un vélo rouge et elle est contente", "Elle a contente", "Elle est a un vélo"],
        answer: 1,
        explanation: "'Elle a un vélo' (possession, verbe avoir) et 'elle est contente' (état, verbe être) sont tous deux corrects.",
      },
    ],
    quiz: [
      { question: "Complète : Tu ___ un beau sourire.", options: ["es", "as", "est", "a"], answer: 1 },
      { question: "Complète : Vous ___ gentils.", options: ["êtes", "avez", "sont", "ont"], answer: 0 },
      { question: "Quel verbe utilise-t-on pour exprimer la possession ?", options: ["être", "avoir", "aller", "faire"], answer: 1 },
      { question: "Complète : Je ___ faim.", options: ["suis", "ai", "es", "as"], answer: 1 },
      { question: "Complète : Elles ___ musiciennes.", options: ["sont", "ont", "êtes", "avons"], answer: 0 },
    ],
  },

  l9: {
    summary:
      "Découverte et mémorisation du vocabulaire lié à l'école : les objets de la classe, les personnes qui y travaillent, et les actions courantes qu'on y fait, pour enrichir l'expression écrite et orale.",
    keyPoints: [
      "Objets de classe : le cahier, le stylo, la trousse, le tableau, le bureau",
      "Personnes : le maître/la maîtresse, l'élève, le directeur",
      "Actions : apprendre, écrire, lire, écouter, réciter",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel mot désigne un objet de la classe ?",
        options: ["le directeur", "le cahier", "apprendre", "l'élève"],
        answer: 1,
        explanation: "'Le cahier' est un objet utilisé en classe.",
      },
      {
        difficulty: "moyen",
        question: "Quel verbe correspond à l'action de regarder un texte pour le comprendre ?",
        options: ["écrire", "lire", "dessiner", "chanter"],
        answer: 1,
        explanation: "'Lire' est l'action de regarder un texte pour en comprendre le sens.",
      },
      {
        difficulty: "difficile",
        question: "Dans la phrase 'La maîtresse demande aux élèves de réciter la poésie', quel mot désigne l'action demandée ?",
        options: ["maîtresse", "élèves", "réciter", "poésie"],
        answer: 2,
        explanation: "'Réciter' est le verbe qui désigne l'action que les élèves doivent faire.",
      },
    ],
    quiz: [
      { question: "Qui dirige l'école ?", options: ["l'élève", "le directeur", "le cahier", "la trousse"], answer: 1 },
      { question: "Quel objet sert à écrire ?", options: ["le tableau", "le stylo", "le bureau", "la classe"], answer: 1 },
      { question: "Quel verbe signifie 'faire des lettres sur le papier' ?", options: ["lire", "écrire", "écouter", "réciter"], answer: 1 },
      { question: "Où range-t-on ses stylos et crayons ?", options: ["dans la trousse", "dans le tableau", "dans le bureau", "dans le cahier"], answer: 0 },
      { question: "Quel mot désigne la personne qui apprend en classe ?", options: ["le maître", "l'élève", "le directeur", "la classe"], answer: 1 },
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