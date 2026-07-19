// scripts/seedPrim4FrancaisContentT2.js
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

// Trimestre 2 — lessons l10 through l18
const LESSON_CONTENT = {
  l10: {
    summary:
      "L'adjectif qualificatif donne une information sur le nom qu'il accompagne : sa couleur, sa taille, sa forme, son caractère... Il s'accorde toujours en genre et en nombre avec ce nom.",
    keyPoints: [
      "L'adjectif qualificatif décrit une qualité du nom (grand, petit, rouge, gentil...)",
      "Il peut se placer avant ou après le nom : une grande maison / une maison bleue",
      "Il s'accorde en genre (masculin/féminin) et en nombre (singulier/pluriel) avec le nom",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'un ballon rouge', quel mot est l'adjectif ?",
        options: ["un", "ballon", "rouge", "aucun"],
        answer: 2,
        explanation: "'Rouge' décrit la couleur du ballon, c'est donc l'adjectif.",
      },
      {
        difficulty: "moyen",
        question: "Accorde : une fille (gentil) ___.",
        options: ["gentil", "gentille", "gentils", "gentilles"],
        answer: 1,
        explanation: "'Fille' est féminin singulier, l'adjectif s'accorde donc en 'gentille'.",
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

  l11: {
    summary:
      "Les verbes du 1er groupe se terminent par -er à l'infinitif (parler, jouer, manger...). Au présent, ils suivent tous les mêmes terminaisons régulières : -e, -es, -e, -ons, -ez, -ent.",
    keyPoints: [
      "Infinitif en -er : parler, jouer, manger, chanter, aimer...",
      "Terminaisons au présent : je -e, tu -es, il/elle -e, nous -ons, vous -ez, ils/elles -ent",
      "Exemple avec 'jouer' : je joue, tu joues, il joue, nous jouons, vous jouez, ils jouent",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Je ___ (jouer) avec mes amis.",
        options: ["joue", "joues", "jouons", "jouent"],
        answer: 0,
        explanation: "À la 1ère personne du singulier, la terminaison est -e : je joue.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Nous ___ (chanter) une belle chanson.",
        options: ["chante", "chantes", "chantons", "chantent"],
        answer: 2,
        explanation: "À la 1ère personne du pluriel, la terminaison est -ons : nous chantons.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase est correctement conjuguée ?",
        options: ["Ils parle beaucoup", "Vous parlez bien", "Tu parlons vite", "Elle parlent doucement"],
        answer: 1,
        explanation: "'Vous parlez' est correct : à la 2ème personne du pluriel, la terminaison est -ez.",
      },
    ],
    quiz: [
      { question: "Complète : Tu ___ (aimer) le chocolat.", options: ["aime", "aimes", "aimons", "aiment"], answer: 1 },
      { question: "Complète : Elle ___ (manger) une pomme.", options: ["mange", "manges", "mangeons", "mangent"], answer: 0 },
      { question: "Complète : Vous ___ (regarder) la télévision.", options: ["regarde", "regardes", "regardez", "regardent"], answer: 2 },
      { question: "Complète : Ils ___ (danser) bien.", options: ["danse", "dansons", "dansez", "dansent"], answer: 3 },
      { question: "Quelle terminaison utilise-t-on à 'nous' pour un verbe en -er ?", options: ["-e", "-es", "-ons", "-ent"], answer: 2 },
    ],
  },

  l12: {
    summary:
      "Le pluriel des noms se forme le plus souvent en ajoutant un -s à la fin du nom singulier. Certains noms ont des règles particulières qui seront vues plus tard, mais la règle générale reste l'ajout du -s.",
    keyPoints: [
      "Règle générale : nom singulier + s = nom pluriel (un livre → des livres)",
      "Le déterminant change aussi au pluriel : le/la → les, un/une → des",
      "Si le nom se termine déjà par -s, -x ou -z au singulier, il ne change pas au pluriel",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel est le pluriel de 'un arbre' ?",
        options: ["un arbres", "des arbre", "des arbres", "les arbre"],
        answer: 2,
        explanation: "On ajoute -s au nom et 'un' devient 'des' : des arbres.",
      },
      {
        difficulty: "moyen",
        question: "Quel est le pluriel de 'la fleur' ?",
        options: ["la fleurs", "les fleur", "les fleurs", "des fleur"],
        answer: 2,
        explanation: "'La' devient 'les' et on ajoute -s au nom : les fleurs.",
      },
      {
        difficulty: "difficile",
        question: "Quel nom reste identique au pluriel ?",
        options: ["chat", "bureau", "nez", "table"],
        answer: 2,
        explanation: "'Nez' se termine déjà par -z au singulier, il ne change donc pas au pluriel.",
      },
    ],
    quiz: [
      { question: "Quel est le pluriel de 'le crayon' ?", options: ["les crayon", "les crayons", "le crayons", "des crayon"], answer: 1 },
      { question: "Quel est le pluriel de 'une maison' ?", options: ["des maisons", "des maison", "les maison", "une maisons"], answer: 0 },
      { question: "Comment forme-t-on le pluriel en général ?", options: ["en ajoutant -e", "en ajoutant -s", "en changeant la fin", "en enlevant une lettre"], answer: 1 },
      { question: "Quel nom singulier reste identique au pluriel ?", options: ["ami", "bras", "livre", "chien"], answer: 1 },
      { question: "Quel est le pluriel de 'un oiseau' ?", options: ["des oiseau", "des oiseaus", "des oiseaux", "les oiseau"], answer: 2 },
    ],
  },

  l13: {
    summary:
      "La phrase affirmative exprime un fait de façon positive. La phrase négative exprime le contraire, en utilisant les mots 'ne...pas' (ou ne...plus, ne...jamais) placés autour du verbe.",
    keyPoints: [
      "Phrase affirmative : Je mange des pommes.",
      "Phrase négative : Je ne mange pas de pommes.",
      "La négation encadre le verbe : ne + verbe + pas",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle phrase est négative ?",
        options: ["Il aime le sport.", "Il n'aime pas le sport.", "Il adore le sport.", "Il joue au sport."],
        answer: 1,
        explanation: "'Il n'aime pas le sport' contient la négation 'ne...pas', c'est donc une phrase négative.",
      },
      {
        difficulty: "moyen",
        question: "Transforme en négative : 'Elle regarde la télévision.'",
        options: ["Elle ne regarde la télévision.", "Elle regarde pas la télévision.", "Elle ne regarde pas la télévision.", "Elle ne pas regarde la télévision."],
        answer: 2,
        explanation: "La négation encadre correctement le verbe : 'ne regarde pas'.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase utilise correctement une négation avec 'jamais' ?",
        options: ["Il ne mange jamais de légumes.", "Il mange ne jamais de légumes.", "Il ne mange pas jamais de légumes.", "Il jamais mange de légumes."],
        answer: 0,
        explanation: "'Ne...jamais' encadre correctement le verbe, comme 'ne...pas' : Il ne mange jamais de légumes.",
      },
    ],
    quiz: [
      { question: "Quels mots forment une négation simple ?", options: ["ne...pas", "et...ou", "le...la", "un...des"], answer: 0 },
      { question: "Transforme en négative : 'Je vais à l'école.'", options: ["Je vais pas à l'école.", "Je ne vais pas à l'école.", "Je ne vais à l'école.", "Ne je vais pas à l'école."], answer: 1 },
      { question: "Quelle phrase est affirmative ?", options: ["Je ne sais pas.", "Il ne vient pas.", "Elle chante bien.", "Nous ne partons pas."], answer: 2 },
      { question: "Où se place 'ne' dans une phrase négative ?", options: ["après le verbe", "avant le verbe", "à la fin", "n'importe où"], answer: 1 },
      { question: "Quelle négation signifie 'plus jamais depuis maintenant' ?", options: ["ne...pas", "ne...plus", "ne...que", "ne...guère"], answer: 1 },
    ],
  },

  l14: {
    summary:
      "Certains verbes du 1er groupe changent légèrement d'orthographe à certaines personnes pour garder le même son. Les verbes en -ger prennent un -e devant -ons (nous mangeons), et les verbes en -cer prennent une cédille devant -ons (nous commençons).",
    keyPoints: [
      "Verbes en -ger : on garde le son [j] en ajoutant un -e devant -ons (nous mangeons, nous nageons)",
      "Verbes en -cer : on garde le son [s] avec une cédille devant -ons (nous commençons, nous plaçons)",
      "Ce changement ne concerne que la personne 'nous' au présent",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Nous ___ (manger) à midi.",
        options: ["mangons", "mangeons", "mengons", "mangeont"],
        answer: 1,
        explanation: "Pour garder le son [j], on ajoute un -e : nous mangeons.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Nous ___ (commencer) le travail.",
        options: ["commencons", "commençons", "commencions", "commencont"],
        answer: 1,
        explanation: "Pour garder le son [s], on ajoute une cédille au c : nous commençons.",
      },
      {
        difficulty: "difficile",
        question: "Quelle conjugaison est correcte à la personne 'nous' ?",
        options: ["nous nageons et nous commençons", "nous nagons et nous commencons", "nous nageons et nous commencons", "nous nagons et nous commençons"],
        answer: 0,
        explanation: "Les deux règles s'appliquent ensemble : nageons (verbe en -ger) et commençons (verbe en -cer).",
      },
    ],
    quiz: [
      { question: "Complète : Nous ___ (nager) dans la piscine.", options: ["nagons", "nageons", "nageont", "nagont"], answer: 1 },
      { question: "Complète : Nous ___ (placer) les livres.", options: ["placons", "plaçons", "placions", "placont"], answer: 1 },
      { question: "Pourquoi ajoute-t-on un -e dans 'nous mangeons' ?", options: ["pour faire joli", "pour garder le son [j]", "c'est une erreur", "pour marquer le pluriel"], answer: 1 },
      { question: "Quelle lettre reçoit une cédille dans les verbes en -cer à 'nous' ?", options: ["le e", "le c", "le n", "le s"], answer: 1 },
      { question: "Complète : Nous ___ (voyager) souvent.", options: ["voyagons", "voyageons", "voyageont", "voyagont"], answer: 1 },
    ],
  },

  l15: {
    summary:
      "Découverte du vocabulaire lié à la famille : les membres proches et éloignés, pour permettre de décrire sa propre famille et de comprendre des textes qui en parlent.",
    keyPoints: [
      "Famille proche : le père, la mère, le frère, la sœur",
      "Famille élargie : le grand-père, la grand-mère, l'oncle, la tante, le cousin, la cousine",
      "On peut utiliser ces mots pour se présenter et présenter sa famille",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Comment appelle-t-on le frère de son père ou de sa mère ?",
        options: ["le cousin", "l'oncle", "le grand-père", "le frère"],
        answer: 1,
        explanation: "'L'oncle' est le frère du père ou de la mère.",
      },
      {
        difficulty: "moyen",
        question: "Quel est le féminin de 'le cousin' ?",
        options: ["la cousine", "la tante", "la cousin", "la sœur"],
        answer: 0,
        explanation: "'La cousine' est le féminin de 'le cousin'.",
      },
      {
        difficulty: "difficile",
        question: "Dans la phrase 'Mon oncle est le frère de ma mère', quel lien de parenté est décrit ?",
        options: ["Le mari de la mère", "Le frère de la mère", "Le fils de la mère", "Le père de la mère"],
        answer: 1,
        explanation: "La phrase indique explicitement que l'oncle est le frère de la mère.",
      },
    ],
    quiz: [
      { question: "Comment appelle-t-on la mère de son père ou de sa mère ?", options: ["la tante", "la cousine", "la grand-mère", "la sœur"], answer: 2 },
      { question: "Quel est le masculin de 'la tante' ?", options: ["l'oncle", "le père", "le cousin", "le frère"], answer: 0 },
      { question: "Comment appelle-t-on le fils de son oncle ou de sa tante ?", options: ["le frère", "le cousin", "le neveu", "le père"], answer: 1 },
      { question: "Qui sont les parents ?", options: ["le père et la mère", "le frère et la sœur", "l'oncle et la tante", "le cousin et la cousine"], answer: 0 },
      { question: "Comment appelle-t-on la sœur de son père ou de sa mère ?", options: ["la cousine", "la grand-mère", "la tante", "la sœur"], answer: 2 },
    ],
  },

  l16: {
    summary:
      "Les pronoms personnels sujets remplacent un nom ou un groupe nominal sujet pour éviter les répétitions. Ils sont : je, tu, il, elle, nous, vous, ils, elles.",
    keyPoints: [
      "Je (1ère pers. sing.), tu (2ème pers. sing.), il/elle (3ème pers. sing.)",
      "Nous (1ère pers. plur.), vous (2ème pers. plur.), ils/elles (3ème pers. plur.)",
      "On utilise 'il' pour remplacer un nom masculin, 'elle' pour un nom féminin",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Par quel pronom remplace-t-on 'Sami' dans 'Sami joue au foot' ?",
        options: ["Elle", "Il", "Nous", "Ils"],
        answer: 1,
        explanation: "'Sami' est un prénom masculin singulier, on le remplace donc par 'il'.",
      },
      {
        difficulty: "moyen",
        question: "Par quel pronom remplace-t-on 'les filles' dans 'Les filles chantent' ?",
        options: ["Il", "Elle", "Ils", "Elles"],
        answer: 3,
        explanation: "'Les filles' est un groupe féminin pluriel, on le remplace par 'elles'.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Mon frère et moi allons au marché', par quel pronom peut-on remplacer 'Mon frère et moi' ?",
        options: ["Il", "Ils", "Nous", "Vous"],
        answer: 2,
        explanation: "'Mon frère et moi' inclut la personne qui parle et une autre personne, donc on utilise 'nous' (1ère personne du pluriel).",
      },
    ],
    quiz: [
      { question: "Quel pronom remplace un nom féminin singulier ?", options: ["il", "elle", "ils", "elles"], answer: 1 },
      { question: "Quel pronom utilise-t-on pour parler de soi-même ?", options: ["tu", "il", "je", "vous"], answer: 2 },
      { question: "Quel pronom remplace 'les garçons' ?", options: ["il", "elle", "ils", "elles"], answer: 2 },
      { question: "Quel pronom utilise-t-on pour s'adresser à plusieurs personnes ?", options: ["tu", "vous", "il", "je"], answer: 1 },
      { question: "Combien de pronoms personnels sujets existe-t-il en français ?", options: ["4", "6", "8", "10"], answer: 1 },
    ],
  },

  l17: {
    summary:
      "Révision complète de la conjugaison des verbes du 1er groupe au présent, avec les terminaisons régulières et les cas particuliers des verbes en -ger et -cer, pour consolider les acquis avant d'aborder d'autres groupes de verbes.",
    keyPoints: [
      "Terminaisons régulières : -e, -es, -e, -ons, -ez, -ent",
      "Cas particulier -ger : nous mangeons, nous nageons",
      "Cas particulier -cer : nous commençons, nous plaçons",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète : Elle ___ (danser) très bien.",
        options: ["danse", "danses", "dansons", "dansent"],
        answer: 0,
        explanation: "À la 3ème personne du singulier, la terminaison est -e : elle danse.",
      },
      {
        difficulty: "moyen",
        question: "Complète : Nous ___ (voyager) chaque été.",
        options: ["voyagons", "voyageons", "voyagez", "voyagent"],
        answer: 1,
        explanation: "Verbe en -ger : on ajoute un -e devant -ons pour garder le son [j] : nous voyageons.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase est entièrement bien conjuguée ?",
        options: ["Nous commencons et vous chantez", "Nous commençons et vous chantez", "Nous commençons et vous chantes", "Nous commencons et vous chante"],
        answer: 1,
        explanation: "'Nous commençons' (cédille pour garder le son [s]) et 'vous chantez' (terminaison -ez) sont tous deux corrects.",
      },
    ],
    quiz: [
      { question: "Complète : Tu ___ (regarder) un film.", options: ["regarde", "regardes", "regardons", "regardent"], answer: 1 },
      { question: "Complète : Ils ___ (jouer) au ballon.", options: ["joue", "joues", "jouons", "jouent"], answer: 3 },
      { question: "Complète : Nous ___ (lancer) la balle.", options: ["lancons", "lançons", "lancions", "lancont"], answer: 1 },
      { question: "Complète : Vous ___ (parler) fort.", options: ["parle", "parles", "parlez", "parlent"], answer: 2 },
      { question: "Quelle terminaison utilise-t-on à 'ils/elles' pour un verbe en -er ?", options: ["-e", "-es", "-ons", "-ent"], answer: 3 },
    ],
  },

  l18: {
    summary:
      "Comme les noms, les adjectifs qualificatifs changent de forme au féminin. La règle générale est l'ajout d'un -e, mais certains adjectifs suivent des règles particulières (comme le doublement d'une consonne ou un changement complet).",
    keyPoints: [
      "Règle générale : adjectif masculin + e = adjectif féminin (petit → petite)",
      "Certains adjectifs doublent la consonne finale : gentil → gentille, bon → bonne",
      "Certains adjectifs changent complètement : blanc → blanche, heureux → heureuse",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel est le féminin de 'petit' ?",
        options: ["petit", "petite", "petits", "petites"],
        answer: 1,
        explanation: "On ajoute un -e : petit → petite.",
      },
      {
        difficulty: "moyen",
        question: "Quel est le féminin de 'bon' ?",
        options: ["bone", "bonne", "bons", "bonnes"],
        answer: 1,
        explanation: "'Bon' double sa consonne finale au féminin : bon → bonne.",
      },
      {
        difficulty: "difficile",
        question: "Quel est le féminin de 'heureux' ?",
        options: ["heureuxe", "heureuse", "heureuxs", "heureuce"],
        answer: 1,
        explanation: "'Heureux' change complètement au féminin : heureux → heureuse (le -x devient -se).",
      },
    ],
    quiz: [
      { question: "Quel est le féminin de 'grand' ?", options: ["grand", "grande", "grandes", "grandi"], answer: 1 },
      { question: "Quel est le féminin de 'gentil' ?", options: ["gentile", "gentille", "gentil", "gentills"], answer: 1 },
      { question: "Quel est le féminin de 'blanc' ?", options: ["blance", "blanche", "blancs", "blanque"], answer: 1 },
      { question: "Quelle est la règle générale du féminin des adjectifs ?", options: ["ajouter -s", "ajouter -e", "enlever une lettre", "ne rien changer"], answer: 1 },
      { question: "Quel est le féminin de 'joli' ?", options: ["joli", "jolie", "jolis", "jolies"], answer: 1 },
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