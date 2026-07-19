// scripts/seedCol9FrancaisContentT2b.js
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

// Trimestre 2, part B — lessons l19 through l23 (fin Module 4)
// Titles confirmed from the real textbook's tableau synoptique. Content
// reconstructed — NOT verified against actual textbook pages.
const LESSON_CONTENT = {
  l19: {
    summary:
      "La synonymie regroupe des mots de sens proche, utile pour varier l'expression argumentative. La polysémie désigne le fait qu'un même mot puisse avoir plusieurs sens différents selon le contexte (le mot 'feuille' peut désigner une feuille d'arbre ou une feuille de papier).",
    keyPoints: [
      "Synonymie : mots de sens proche, utiles pour éviter la répétition dans l'argumentation",
      "Polysémie : un même mot ayant plusieurs sens selon le contexte",
      "Le contexte de la phrase permet de déterminer le sens exact d'un mot polysémique",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel est un synonyme de 'important' ?",
        options: ["essentiel", "négligeable", "petit", "rapide"],
        answer: 0,
        explanation: "'Essentiel' a un sens proche de 'important'.",
      },
      {
        difficulty: "moyen",
        question: "Le mot 'glace' est polysémique car il peut désigner :",
        options: ["un dessert glacé ou un miroir", "toujours la même chose", "uniquement un miroir", "uniquement un dessert"],
        answer: 0,
        explanation: "'Glace' peut désigner un dessert glacé, un miroir, ou de l'eau gelée selon le contexte, c'est un mot polysémique.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Cette entreprise occupe une position dominante sur le marché', quel est le sens du mot 'position' dans ce contexte spécifique ?",
        options: ["un rang ou statut économique, et non un lieu physique", "un lieu géographique précis", "une posture corporelle", "aucun sens particulier"],
        answer: 0,
        explanation: "Dans ce contexte économique, 'position' signifie le rang ou statut de l'entreprise sur le marché, illustrant comment le contexte détermine le sens exact d'un mot polysémique.",
      },
    ],
    quiz: [
      { question: "Un synonyme de 'rapide' est :", options: ["vite", "lent", "gros", "petit"], answer: 0 },
      { question: "La polysémie signifie qu'un mot :", options: ["a plusieurs sens selon le contexte", "n'a qu'un seul sens toujours", "n'existe pas vraiment", "change de genre"], answer: 0 },
      { question: "Le mot 'avocat' peut désigner :", options: ["un fruit ou un métier juridique", "toujours la même chose", "uniquement un fruit", "uniquement un métier"], answer: 0 },
      { question: "Pour déterminer le sens exact d'un mot polysémique, il faut observer :", options: ["le contexte de la phrase", "uniquement sa longueur", "uniquement sa première lettre", "rien de particulier"], answer: 0 },
      { question: "Un synonyme de 'difficile' est :", options: ["compliqué", "facile", "simple", "clair"], answer: 0 },
    ],
  },

  l20: {
    summary:
      "L'expression de l'opinion utilise des verbes et expressions spécifiques (je pense que, à mon avis, il me semble que), tandis que l'expression de la cause (parce que, car, puisque) et de la conséquence (donc, si bien que, par conséquent) structurent le raisonnement argumentatif.",
    keyPoints: [
      "Expression de l'opinion : je pense que, à mon avis, selon moi, il me semble que",
      "Expression de la cause : parce que, car, puisque, comme (répond à 'pourquoi ?')",
      "Expression de la conséquence : donc, par conséquent, si bien que, c'est pourquoi",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle expression introduit une opinion ?",
        options: ["à mon avis", "parce que", "donc", "si bien que"],
        answer: 0,
        explanation: "'À mon avis' introduit clairement un point de vue personnel.",
      },
      {
        difficulty: "moyen",
        question: "Quelle conjonction exprime la cause ?",
        options: ["parce que", "donc", "à mon avis", "par conséquent"],
        answer: 0,
        explanation: "'Parce que' répond à la question 'pourquoi ?' et introduit une cause.",
      },
      {
        difficulty: "difficile",
        question: "Complète en respectant la logique cause-conséquence : 'Il a beaucoup travaillé ___ il a obtenu de très bons résultats, ___ ses professeurs l'ont félicité.'",
        options: ["parce que / si bien que", "donc / parce que", "à mon avis / donc", "si bien que / parce que"],
        answer: 0,
        explanation: "'Parce que' introduit la cause du travail intense, et 'si bien que' introduit la conséquence (les félicitations).",
      },
    ],
    quiz: [
      { question: "Quelle expression introduit une opinion personnelle ?", options: ["il me semble que", "parce que", "donc", "si bien que"], answer: 0 },
      { question: "Quelle conjonction exprime la conséquence ?", options: ["par conséquent", "parce que", "puisque", "car"], answer: 0 },
      { question: "Quelle conjonction exprime la cause ?", options: ["puisque", "donc", "ainsi", "par conséquent"], answer: 0 },
      { question: "Complète : 'Je pense ___ cette idée est excellente.'", options: ["que", "donc", "car", "ainsi"], answer: 0 },
      { question: "'C'est pourquoi' exprime :", options: ["une conséquence", "une cause", "une opinion", "une opposition"], answer: 0 },
    ],
  },

  l21: {
    summary:
      "Le subjonctif présent s'emploie après certaines expressions exprimant le doute, la volonté, le sentiment, ou l'obligation (il faut que, je veux que, je souhaite que, bien que). Il se forme généralement à partir du radical de la 3ème personne du pluriel du présent de l'indicatif + terminaisons -e, -es, -e, -ions, -iez, -ent.",
    keyPoints: [
      "Formation régulière : radical de 'ils' au présent + terminaisons -e, -es, -e, -ions, -iez, -ent",
      "Emplois : après 'il faut que', 'je veux que', 'je souhaite que', 'bien que', 'pour que'",
      "Subjonctifs irréguliers fréquents : que je sois (être), que j'aie (avoir), que je fasse (faire), que je puisse (pouvoir)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au subjonctif présent : Il faut que tu ___ (finir) ton travail.",
        options: ["finisses", "finis", "finiras", "finissais"],
        answer: 0,
        explanation: "Subjonctif présent de 'finir' à la 2ème personne du singulier : que tu finisses.",
      },
      {
        difficulty: "moyen",
        question: "Complète au subjonctif présent : Je veux qu'il ___ (être) à l'heure.",
        options: ["soit", "est", "sera", "était"],
        answer: 0,
        explanation: "Subjonctif présent irrégulier de 'être' à la 3ème personne du singulier : qu'il soit.",
      },
      {
        difficulty: "difficile",
        question: "Complète : 'Bien qu'il ___ (avoir) peu de temps, il ___ (faire) de son mieux.'",
        options: ["ait / fait", "a / fasse", "ait / fasse", "avait / faisait"],
        answer: 2,
        explanation: "'Bien que' impose le subjonctif dans la subordonnée ('ait', subjonctif de avoir), tandis que la principale reste à l'indicatif présent ('fait').",
      },
    ],
    quiz: [
      { question: "Après 'il faut que', quel mode utilise-t-on ?", options: ["le subjonctif", "l'indicatif", "l'impératif", "le conditionnel"], answer: 0 },
      { question: "Complète au subjonctif : Je souhaite qu'elle ___ (réussir).", options: ["réussisse", "réussit", "réussira", "réussissait"], answer: 0 },
      { question: "Quel est le subjonctif présent de 'avoir' à la 1ère personne ?", options: ["que j'aie", "que j'ai", "que j'aurai", "que j'avais"], answer: 0 },
      { question: "Complète : 'Pour qu'il ___ (pouvoir) venir, préviens-le tôt.'", options: ["puisse", "peut", "pourra", "pouvait"], answer: 0 },
      { question: "Le subjonctif présent régulier se forme à partir de :", options: ["radical de 'ils' au présent + terminaisons spécifiques", "l'infinitif seul", "le radical du futur", "le participe passé"], answer: 0 },
    ],
  },

  l22: {
    summary:
      "L'accord de « tout » varie selon sa fonction : adverbe (invariable, sauf devant un adjectif féminin commençant par une consonne ou un h aspiré, où il s'accorde), pronom (variable), ou déterminant (variable, s'accordant avec le nom qu'il précède).",
    keyPoints: [
      "Déterminant : 'tout' s'accorde avec le nom (tous les enfants, toutes les filles)",
      "Adverbe (devant un adjectif) : invariable en général (Elle est tout étonnée.), mais s'accorde devant un adjectif féminin en consonne/h aspiré (Elle est toute contente.)",
      "Pronom : variable (Tous sont venus. / Toutes sont parties.)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Accorde : ___ les élèves sont présents. (déterminant)",
        options: ["Tous", "Tout", "Toute", "Toutes"],
        answer: 0,
        explanation: "'Tous' (déterminant, masculin pluriel) s'accorde avec 'élèves'.",
      },
      {
        difficulty: "moyen",
        question: "Accorde : Elle est ___ étonnée. (adverbe devant adjectif commençant par une voyelle)",
        options: ["tout", "toute", "tous", "toutes"],
        answer: 0,
        explanation: "Devant un adjectif féminin commençant par une voyelle, 'tout' (adverbe) reste invariable : tout étonnée.",
      },
      {
        difficulty: "difficile",
        question: "Accorde et explique : Elle est ___ contente. (adjectif féminin commençant par une consonne)",
        options: ["toute (car devant un adjectif féminin en consonne, l'adverbe 'tout' s'accorde exceptionnellement pour des raisons d'euphonie)", "tout (reste toujours invariable)", "tous", "toutes"],
        answer: 0,
        explanation: "Exception : devant un adjectif féminin commençant par une consonne (ou un h aspiré), 'tout' (adverbe) s'accorde en 'toute' pour des raisons de prononciation.",
      },
    ],
    quiz: [
      { question: "Accorde : ___ les filles sont arrivées. (déterminant)", options: ["Toutes", "Tout", "Tous", "Toute"], answer: 0 },
      { question: "Accorde : Il est ___ heureux. (adverbe, adjectif masculin)", options: ["tout", "toute", "tous", "toutes"], answer: 0 },
      { question: "Accorde : Elles sont ___ ravies. (adverbe devant voyelle)", options: ["tout", "toute", "tous", "toutes"], answer: 0 },
      { question: "Accorde : ___ sont venus. (pronom)", options: ["Tous", "Tout", "Toute", "Toutes"], answer: 0 },
      { question: "'Tout' comme adverbe devant un adjectif féminin en consonne :", options: ["s'accorde exceptionnellement (toute)", "reste toujours invariable", "devient 'tous'", "disparaît"], answer: 0 },
    ],
  },

  l23: {
    summary:
      "Produire un texte argumentatif complet nécessite d'énoncer clairement une thèse, de la soutenir par plusieurs arguments organisés logiquement (avec connecteurs), chacun illustré par un exemple concret, et de conclure en réaffirmant ou nuançant la position défendue.",
    keyPoints: [
      "Structure : introduction (thèse), développement (arguments + exemples), conclusion",
      "Chaque argument doit être distinct et appuyé par un exemple concret et pertinent",
      "Les connecteurs logiques organisent la progression du raisonnement (d'abord, de plus, enfin, cependant)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Un texte argumentatif complet commence généralement par :",
        options: ["l'énoncé de la thèse", "un exemple isolé", "la conclusion", "une description de paysage"],
        answer: 0,
        explanation: "L'introduction pose généralement la thèse (l'opinion défendue) avant de développer les arguments.",
      },
      {
        difficulty: "moyen",
        question: "Quel connecteur pourrait introduire le premier argument ?",
        options: ["d'abord", "cependant", "en conclusion", "malgré tout"],
        answer: 0,
        explanation: "'D'abord' introduit logiquement le premier argument développé dans le texte.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi chaque argument d'un texte argumentatif devrait-il être accompagné d'un exemple concret plutôt que rester purement abstrait ?",
        options: ["parce qu'un exemple concret rend l'argument plus crédible et compréhensible pour le lecteur en l'ancrant dans une réalité vérifiable", "les exemples concrets affaiblissent toujours un argument", "un argument abstrait est toujours plus convaincant qu'un exemple concret", "les exemples n'ont aucune utilité dans un texte argumentatif"],
        answer: 0,
        explanation: "Un exemple concret illustre et rend tangible un argument qui resterait sinon abstrait, renforçant sa crédibilité et sa force de persuasion auprès du lecteur.",
      },
    ],
    quiz: [
      { question: "La conclusion d'un texte argumentatif sert à :", options: ["réaffirmer ou nuancer la thèse défendue", "introduire un nouvel argument principal", "décrire un paysage", "raconter une histoire"], answer: 0 },
      { question: "Chaque argument devrait être illustré par :", options: ["un exemple concret", "rien de particulier", "une description sans lien", "une négation"], answer: 0 },
      { question: "Quel connecteur pourrait introduire la conclusion ?", options: ["en conclusion", "d'abord", "de plus", "ensuite"], answer: 0 },
      { question: "Un texte argumentatif bien structuré a :", options: ["une introduction, un développement, et une conclusion", "aucune structure particulière", "seulement des questions", "seulement des exemples sans arguments"], answer: 0 },
      { question: "Les connecteurs logiques dans un texte argumentatif servent à :", options: ["organiser la progression du raisonnement", "rien de particulier", "remplacer les arguments", "raccourcir le texte"], answer: 0 },
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
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 2, part B)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});