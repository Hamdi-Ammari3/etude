// scripts/seedCol7FrancaisContentT2.js
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

const GRADE_ID = "col-7";
const SUBJECT_ID = "francais";

// Trimestre 2 — lessons l9 through l16
const LESSON_CONTENT = {
  l9: {
    summary:
      "Dans un récit, l'imparfait décrit le décor, les personnages, et les actions habituelles ou en cours, tandis que le passé composé marque les actions ponctuelles qui font avancer l'histoire. Ces deux temps se combinent souvent dans une même phrase.",
    keyPoints: [
      "Imparfait : description, décor, habitudes passées (Il faisait beau, les oiseaux chantaient)",
      "Passé composé : actions ponctuelles, événements (Soudain, elle a crié)",
      "Combinaison typique : 'Il pleuvait (imparfait) quand elle est sortie (passé composé)'",
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
        explanation: "'Faisait' (imparfait) décrit le temps, et 'sommes partis' (passé composé) exprime l'action ponctuelle.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi utilise-t-on l'imparfait puis le passé composé dans 'Elle lisait tranquillement quand le téléphone a sonné' ?",
        options: ["par hasard", "l'imparfait décrit une action en cours, interrompue par l'action ponctuelle au passé composé", "c'est une erreur", "les deux temps sont interchangeables ici"],
        answer: 1,
        explanation: "'Lisait' (imparfait) exprime une action en cours, et 'a sonné' (passé composé) exprime l'événement ponctuel qui l'interrompt.",
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

  l10: {
    summary:
      "Le discours direct rapporte les paroles exactes entre guillemets, tandis que le discours indirect les rapporte de façon rapportée, introduites par un verbe de parole suivi de 'que', avec des changements de pronoms et parfois de temps.",
    keyPoints: [
      "Discours direct : « Je suis fatigué », dit-il. (paroles exactes, entre guillemets)",
      "Discours indirect : Il dit qu'il est fatigué. (paroles rapportées, sans guillemets, introduites par 'que')",
      "Passage du direct à l'indirect : changement de pronoms (je → il) et parfois de temps",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quelle phrase est au discours direct ?",
        options: ["Il a dit qu'il était fatigué.", "Il dit : « Je suis fatigué. »", "Il semblait fatigué.", "Sa fatigue était visible."],
        answer: 1,
        explanation: "'Il dit : « Je suis fatigué. »' rapporte les paroles exactes entre guillemets.",
      },
      {
        difficulty: "moyen",
        question: "Transforme au discours indirect : Elle dit : « Je viendrai demain. »",
        options: ["Elle dit qu'elle viendra demain.", "Elle dit : je viendrai demain.", "Elle a dit je viens demain.", "Elle dit qu'elle vient demain."],
        answer: 0,
        explanation: "Au discours indirect, 'je' devient 'elle', et la phrase est introduite par 'que' sans guillemets : Elle dit qu'elle viendra demain.",
      },
      {
        difficulty: "difficile",
        question: "Transforme au discours indirect : Il demande : « Où vas-tu ? »",
        options: ["Il demande où je vais.", "Il demande où tu vas.", "Il demande où il va.", "Il demande : où vas-tu."],
        answer: 2,
        explanation: "Au discours indirect, le pronom change selon le contexte narratif ; ici 'tu' devient 'il' car on rapporte la question posée à une autre personne mentionnée : Il demande où il va.",
      },
    ],
    quiz: [
      { question: "Le discours direct rapporte :", options: ["un résumé des paroles", "les paroles exactes", "les pensées uniquement", "rien de précis"], answer: 1 },
      { question: "Quel mot introduit souvent le discours indirect ?", options: ["que", "et", "mais", "donc"], answer: 0 },
      { question: "Quel signe encadre les paroles au discours direct ?", options: ["les guillemets", "les parenthèses", "les crochets", "aucun signe"], answer: 0 },
      { question: "Au discours indirect, le pronom 'je' devient souvent :", options: ["tu", "il/elle", "nous", "ils"], answer: 1 },
      { question: "Transforme : Il dit : « J'ai faim. » → Il dit qu'___ faim.", options: ["il a", "il avait", "j'ai", "il aura"], answer: 0 },
    ],
  },

  l11: {
    summary:
      "Les propositions subordonnées relatives sont introduites par un pronom relatif (qui, que, où, dont) et complètent un nom en apportant une précision, formant ainsi un lien de dépendance avec la proposition principale.",
    keyPoints: [
      "'Qui' remplace le sujet de la relative : Le garçon qui court est mon frère.",
      "'Que' remplace le COD : Le livre que je lis est passionnant.",
      "'Où' indique un lieu ou un temps : La ville où j'habite est belle.",
      "'Dont' remplace un complément introduit par 'de' : Le livre dont je parle est intéressant.",
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
        question: "Complète : Le livre ___ je parle est passionnant.",
        options: ["qui", "que", "où", "dont"],
        answer: 3,
        explanation: "'Dont' remplace un complément introduit par 'de' (je parle DE ce livre).",
      },
      {
        difficulty: "difficile",
        question: "Dans 'La maison où je suis né se trouve à Tunis, et dont je me souviens encore', identifie les deux pronoms relatifs et leur rôle :",
        options: ["'où' (lieu) et 'dont' (complément avec 'de')", "'où' et 'dont' ont le même rôle", "il n'y a qu'un seul pronom relatif", "les deux remplacent le sujet"],
        answer: 0,
        explanation: "'Où' indique le lieu de naissance, et 'dont' remplace 'je me souviens DE cette maison', un complément introduit par 'de'.",
      },
    ],
    quiz: [
      { question: "'Qui' remplace généralement :", options: ["le sujet", "le complément d'objet", "un lieu", "rien"], answer: 0 },
      { question: "'Que' remplace généralement :", options: ["le sujet", "le complément d'objet direct", "un lieu", "rien"], answer: 1 },
      { question: "'Dont' remplace un complément introduit par :", options: ["à", "de", "sur", "sous"], answer: 1 },
      { question: "Complète : La fille ___ chante est ma sœur.", options: ["qui", "que", "où", "dont"], answer: 0 },
      { question: "Complète : Le jour ___ je suis né était un lundi.", options: ["qui", "que", "où", "dont"], answer: 2 },
    ],
  },

  l12: {
    summary:
      "Les compléments circonstanciels précisent les circonstances d'une action : le lieu (où ?), le temps (quand ?), la manière (comment ?), et la cause (pourquoi ?). Ils enrichissent la phrase sans être indispensables à sa structure de base.",
    keyPoints: [
      "Complément de lieu : répond à 'où ?' — Il travaille à Tunis.",
      "Complément de temps : répond à 'quand ?' — Il travaille le matin.",
      "Complément de manière : répond à 'comment ?' — Il travaille rapidement.",
      "Complément de cause : répond à 'pourquoi ?' — Il travaille par nécessité / parce qu'il aime cela.",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Dans 'Elle dort dans sa chambre', quel type de complément est 'dans sa chambre' ?",
        options: ["de lieu", "de temps", "de manière", "de cause"],
        answer: 0,
        explanation: "'Dans sa chambre' répond à 'où ?', c'est un complément circonstanciel de lieu.",
      },
      {
        difficulty: "moyen",
        question: "Dans 'Il pleure de joie', quel type de complément est 'de joie' ?",
        options: ["de lieu", "de temps", "de manière", "de cause"],
        answer: 3,
        explanation: "'De joie' répond à 'pourquoi pleure-t-il ?', c'est un complément de cause.",
      },
      {
        difficulty: "difficile",
        question: "Dans 'Demain, à cause de la pluie, nous resterons prudemment à la maison', identifie tous les compléments circonstanciels :",
        options: ["'Demain' (temps), 'à cause de la pluie' (cause), 'prudemment' (manière), 'à la maison' (lieu)", "seulement 'Demain'", "seulement 'à la maison'", "aucun complément circonstanciel"],
        answer: 0,
        explanation: "La phrase contient quatre compléments circonstanciels de types différents : temps, cause, manière, et lieu.",
      },
    ],
    quiz: [
      { question: "Le complément de cause répond à :", options: ["où ?", "quand ?", "comment ?", "pourquoi ?"], answer: 3 },
      { question: "Le complément de manière répond à :", options: ["où ?", "quand ?", "comment ?", "pourquoi ?"], answer: 2 },
      { question: "Dans 'Il chante le soir', quel complément est 'le soir' ?", options: ["de lieu", "de temps", "de manière", "de cause"], answer: 1 },
      { question: "Dans 'Il tremble de peur', quel complément est 'de peur' ?", options: ["de lieu", "de temps", "de manière", "de cause"], answer: 3 },
      { question: "Ces compléments peuvent souvent être :", options: ["supprimés sans rendre la phrase incorrecte", "jamais supprimés", "seulement au début de la phrase", "confondus avec le sujet"], answer: 0 },
    ],
  },

  l13: {
    summary:
      "Le futur simple exprime une action à venir de façon générale, tandis que le futur proche (aller + infinitif) exprime une action imminente ou une intention déjà décidée, plus proche du moment présent.",
    keyPoints: [
      "Futur simple : radical + terminaisons -ai, -as, -a, -ons, -ez, -ont (je partirai)",
      "Futur proche : aller (au présent) + infinitif (je vais partir)",
      "Le futur proche insiste sur la proximité ou la certitude de l'action, souvent utilisé à l'oral",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Complète au futur simple : Demain, je ___ (partir) tôt.",
        options: ["partirai", "vais partir", "pars", "partais"],
        answer: 0,
        explanation: "Le futur simple se forme avec le radical + terminaison : je partirai.",
      },
      {
        difficulty: "moyen",
        question: "Complète au futur proche : Attention, tu ___ (tomber) !",
        options: ["tomberas", "vas tomber", "tombes", "tombais"],
        answer: 1,
        explanation: "Le futur proche (aller + infinitif) exprime une action imminente : tu vas tomber.",
      },
      {
        difficulty: "difficile",
        question: "Quelle phrase illustre le mieux la nuance entre futur simple et futur proche ?",
        options: ["'Il pleuvra la semaine prochaine' (prévision générale) vs 'Il va pleuvoir, regarde les nuages' (imminent, certain)", "les deux temps sont toujours identiques", "le futur proche n'existe qu'au passé", "le futur simple est plus proche dans le temps"],
        answer: 0,
        explanation: "Le futur simple convient à une prévision plus générale ou lointaine, tandis que le futur proche marque une action perçue comme imminente ou certaine dans l'instant.",
      },
    ],
    quiz: [
      { question: "Comment se forme le futur proche ?", options: ["aller au présent + infinitif", "avoir + participe passé", "radical + terminaisons", "être + participe passé"], answer: 0 },
      { question: "Complète au futur simple : Nous ___ (finir) bientôt.", options: ["finirons", "allons finir", "finissons", "finissions"], answer: 0 },
      { question: "Complète au futur proche : Elle ___ (manger).", options: ["mangera", "va manger", "mange", "mangeait"], answer: 1 },
      { question: "Quel futur est souvent utilisé à l'oral pour une action imminente ?", options: ["le futur simple", "le futur proche", "les deux également", "aucun des deux"], answer: 1 },
      { question: "Complète au futur simple : Ils ___ (voyager) l'année prochaine.", options: ["voyageront", "vont voyager", "voyagent", "voyageaient"], answer: 0 },
    ],
  },

  l14: {
    summary:
      "Approfondissement du vocabulaire : les synonymes (sens proche), les antonymes (sens opposé), et les homonymes (même prononciation, sens et souvent orthographe différents), pour enrichir l'expression et éviter les confusions.",
    keyPoints: [
      "Synonyme : mot de sens proche (content = joyeux)",
      "Antonyme : mot de sens opposé (chaud ≠ froid)",
      "Homonyme : même prononciation, sens différent, orthographe parfois différente (mer/mère/maire)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel est un synonyme de 'content' ?",
        options: ["triste", "joyeux", "fatigué", "en colère"],
        answer: 1,
        explanation: "'Joyeux' a un sens très proche de 'content'.",
      },
      {
        difficulty: "moyen",
        question: "Quel est un antonyme de 'rapide' ?",
        options: ["vite", "lent", "pressé", "actif"],
        answer: 1,
        explanation: "'Lent' est l'opposé de 'rapide'.",
      },
      {
        difficulty: "difficile",
        question: "'Mer', 'mère', et 'maire' sont des :",
        options: ["synonymes", "antonymes", "homonymes", "aucune de ces réponses"],
        answer: 2,
        explanation: "Ces trois mots se prononcent de la même façon mais ont des sens et souvent des orthographes différents, ce sont des homonymes.",
      },
    ],
    quiz: [
      { question: "Un synonyme de 'grand' est :", options: ["petit", "immense", "court", "faible"], answer: 1 },
      { question: "Un antonyme de 'jour' est :", options: ["matin", "nuit", "soleil", "heure"], answer: 1 },
      { question: "'Vert' et 'vers' sont des :", options: ["synonymes", "antonymes", "homonymes", "aucune de ces réponses"], answer: 2 },
      { question: "Un antonyme de 'facile' est :", options: ["simple", "difficile", "rapide", "clair"], answer: 1 },
      { question: "Deux mots synonymes ont un sens :", options: ["opposé", "proche ou identique", "sans rapport", "toujours identique en tout contexte"], answer: 1 },
    ],
  },

  l15: {
    summary:
      "La ponctuation et la mise en page structurent un dialogue écrit : les guillemets encadrent l'ensemble de l'échange, et un tiret en début de ligne marque chaque changement d'interlocuteur, facilitant la lecture.",
    keyPoints: [
      "Les guillemets « » encadrent le dialogue dans son ensemble",
      "Le tiret (—) en début de ligne marque un changement de locuteur",
      "Les verbes de parole (dire, demander, répondre, s'exclamer) accompagnent souvent les répliques",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Quel signe marque un changement de locuteur dans un dialogue ?",
        options: ["la virgule", "le tiret en début de ligne", "les parenthèses", "le point d'exclamation"],
        answer: 1,
        explanation: "Le tiret (—) en début de ligne indique qu'un nouveau personnage prend la parole.",
      },
      {
        difficulty: "moyen",
        question: "Quel signe encadre l'ensemble d'un dialogue rapporté ?",
        options: ["les parenthèses", "les crochets", "les guillemets", "aucun signe"],
        answer: 2,
        explanation: "Les guillemets « » encadrent le dialogue dans son intégralité.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi la ponctuation est-elle essentielle dans un dialogue écrit ?",
        options: ["elle n'a pas d'importance particulière", "elle permet au lecteur de distinguer clairement qui parle et d'suivre l'échange sans confusion", "elle sert uniquement à décorer le texte", "elle remplace les verbes de parole"],
        answer: 1,
        explanation: "Sans ponctuation claire (tirets, guillemets), le lecteur ne pourrait pas distinguer les répliques des différents personnages, rendant le dialogue confus.",
      },
    ],
    quiz: [
      { question: "Quel verbe est un verbe de parole ?", options: ["marcher", "dire", "manger", "courir"], answer: 1 },
      { question: "Le tiret se place :", options: ["à la fin de la ligne", "en début de ligne", "au milieu du mot", "nulle part en particulier"], answer: 1 },
      { question: "Les guillemets français ressemblent à :", options: ["( )", "[ ]", "« »", "{ }"], answer: 2 },
      { question: "Un dialogue bien ponctué aide à :", options: ["compliquer la lecture", "distinguer clairement les locuteurs", "rien de particulier", "remplacer la grammaire"], answer: 1 },
      { question: "Quel signe peut aussi introduire une réplique après un verbe de parole ?", options: ["les deux points", "le point-virgule", "la virgule seule", "aucun signe"], answer: 0 },
    ],
  },

  l16: {
    summary:
      "La description (portrait ou paysage) utilise un vocabulaire précis et varié pour donner à voir : le portrait décrit une personne (physique et caractère), le paysage décrit un lieu (éléments visuels, ambiance), tous deux enrichis par des adjectifs et des comparaisons.",
    keyPoints: [
      "Le portrait : décrit l'apparence physique et le caractère d'une personne",
      "Le paysage : décrit un lieu, ses éléments visuels, son atmosphère",
      "Les deux emploient des adjectifs variés, des comparaisons, et un vocabulaire sensoriel (couleurs, sons, sensations)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "Que décrit un portrait ?",
        options: ["un lieu", "une personne", "un objet seul", "un événement"],
        answer: 1,
        explanation: "Le portrait décrit l'apparence physique et/ou le caractère d'une personne.",
      },
      {
        difficulty: "moyen",
        question: "Quel type de vocabulaire enrichit une description de paysage ?",
        options: ["des verbes d'action uniquement", "des adjectifs et un vocabulaire sensoriel (couleurs, sons)", "seulement des chiffres", "aucun vocabulaire particulier"],
        answer: 1,
        explanation: "Les descriptions de paysage utilisent des adjectifs variés et un vocabulaire sensoriel pour évoquer les couleurs, les sons, les sensations.",
      },
      {
        difficulty: "difficile",
        question: "Pourquoi les comparaisons sont-elles utiles dans une description ?",
        options: ["elles n'ont aucune utilité", "elles aident le lecteur à mieux visualiser en reliant l'inconnu à quelque chose de familier", "elles compliquent inutilement le texte", "elles remplacent les adjectifs"],
        answer: 1,
        explanation: "Une comparaison (comme 'ses yeux brillaient comme des étoiles') aide le lecteur à se représenter plus vivement ce qui est décrit, en le reliant à une image familière.",
      },
    ],
    quiz: [
      { question: "Que décrit un paysage ?", options: ["une personne", "un lieu", "un dialogue", "une action seule"], answer: 1 },
      { question: "Quels éléments compose souvent un bon portrait ?", options: ["l'apparence physique et le caractère", "seulement des chiffres", "seulement des lieux", "aucun élément particulier"], answer: 0 },
      { question: "Une comparaison relie généralement deux éléments par :", options: ["comme, tel que, pareil à", "et, ou, mais", "donc, car", "ne...pas"], answer: 0 },
      { question: "Le vocabulaire sensoriel évoque :", options: ["les couleurs, sons, sensations", "seulement les nombres", "seulement les noms propres", "rien de précis"], answer: 0 },
      { question: "Une bonne description privilégie :", options: ["des adjectifs variés et précis", "la répétition des mêmes mots", "l'absence d'adjectifs", "seulement des verbes"], answer: 0 },
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