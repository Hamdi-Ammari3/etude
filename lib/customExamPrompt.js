// lib/customExamPrompt.js

const DURATION_TO_POINTS = {
  15: 10,
  30: 20,
  45: 30,
  60: 40,
};

const DIFFICULTY_GUIDANCE = {
  facile: "Toutes les questions doivent être de niveau facile, pour consolider les bases.",
  moyen: "Toutes les questions doivent être de niveau moyen.",
  difficile: "Toutes les questions doivent être de niveau difficile, pour un élève déjà à l'aise avec la leçon.",
  mixte:
    "Mélangez les niveaux : environ 40% de questions faciles, 40% de niveau moyen, et 20% de niveau difficile.",
};

// Subjects whose exams must ALWAYS be generated in Arabic, regardless of
// anything else — this matches how these subjects are actually taught in
// the Tunisian curriculum (maths and physique are taught in Arabic
// through collège), independent of any inference from lesson content.
const FORCED_ARABIC_SUBJECT_IDS = ["maths", "physique"];

const JSON_SCHEMA_INSTRUCTIONS = `
Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après, sans balises markdown
(pas de \`\`\`json), respectant EXACTEMENT cette structure :

{
  "sections": [
    {
      "title": "string — titre de la section (ex: nom d'un exercice ou d'une leçon)",
      "points": number,
      "supportText": "string ou null — texte, document, ou énoncé de contexte sur lequel portent
        les questions de la section. Utilise ce champ pour un texte de lecture (français/arabe),
        un énoncé de problème (maths/physique), ou laisse null si la section n'a pas besoin de
        support (question directe).",
      "questions": [
        {
          "type": "ouverte" | "structuree" | "qcm",
          "question": "string — l'énoncé de la question. Pour le type 'structuree', c'est
            l'introduction/le contexte commun avant les sous-questions.",
          "points": number,
          "bareme": "string — UNIQUEMENT pour 'ouverte', critères de notation clairs et
            vérifiables par l'élève lui-même",
          "explanation": "string — UNIQUEMENT pour 'ouverte' et 'qcm', corrigé détaillé",
          "options": ["string", "..."],   // UNIQUEMENT pour 'qcm', au moins 2 choix
          "answer": number,                // UNIQUEMENT pour 'qcm', index de la bonne réponse (0-based)
          "subQuestions": [                // UNIQUEMENT pour 'structuree'
            {
              "label": "string — ex: 'a)', 'b)', '1)', '2)'",
              "question": "string",
              "points": number,
              "bareme": "string",
              "explanation": "string"
            }
          ]
        }
      ]
    }
  ]
}

Règles strictes sur le JSON :
- Type "ouverte" : a "bareme" et "explanation". N'a JAMAIS "options", "answer", ni "subQuestions".
- Type "structuree" : a "subQuestions" (au moins 2 éléments). N'a JAMAIS "bareme", "options",
  "answer", ni "explanation" au niveau de la question elle-même — chaque sous-question a son
  propre "bareme" et "explanation". La "points" de la question "structuree" doit être exactement
  égale à la somme des "points" de ses "subQuestions".
- Type "qcm" : a "options" et "answer". N'a JAMAIS "bareme" ni "subQuestions".
- La "points" de chaque section doit être exactement égale à la somme des "points" de ses
  questions (en comptant les questions "structuree" par leur total, pas par sous-question).
- N'ajoute aucun champ en dehors de ceux listés ci-dessus.
`.trim();

// Builds the grounding block: one entry per selected lesson, using only
// what's already verified/seeded in Firestore.
function buildGroundingBlock(lessons) {
  return lessons
    .map((lesson, i) => {
      const keyPoints = (lesson.keyPoints || []).map((k) => `  - ${k}`).join("\n");

      const sampleExercises = (lesson.exercises || [])
        .slice(0, 2)
        .map(
          (ex, ei) =>
            `  Exemple ${ei + 1} (niveau ${ex.difficulty}) : ${ex.question}\n` +
            `  Explication : ${ex.explanation}`
        )
        .join("\n\n");

      return (
        `--- Leçon ${i + 1} : ${lesson.title} ---\n` +
        `Résumé :\n${lesson.summary}\n\n` +
        `Points clés :\n${keyPoints}\n\n` +
        (sampleExercises
          ? `Exemples d'exercices déjà utilisés (à ne PAS recopier à l'identique, seulement pour calibrer le niveau et le style) :\n${sampleExercises}\n`
          : "")
      );
    })
    .join("\n\n");
}

// Builds the language instruction block. For maths/physique, this is a
// hard, non-negotiable override to Arabic — independent of whatever
// language the lesson content happens to be stored in. For every other
// subject, the instruction is to mirror the lesson content's language.
function buildLanguageInstructions(subjectId) {
  if (FORCED_ARABIC_SUBJECT_IDS.includes(subjectId)) {
    return `
IMPORTANT — LANGUE (RÈGLE ABSOLUE, NON NÉGOCIABLE) : cette matière (mathématiques ou sciences
physiques) est enseignée en ARABE dans le programme tunisien. Tu dois rédiger la TOTALITÉ de
l'examen — questions, supports, énoncés, barèmes, explications — EN ARABE, quelle que soit la
langue du contenu de leçon fourni ci-dessous (même s'il est partiellement en français ou contient
des termes en français). Seuls les symboles mathématiques, chiffres, unités (كغ، سم، م²، etc.) et
noms de champs JSON restent tels quels. Ne rédige JAMAIS l'examen en français ou en anglais pour
cette matière.
`.trim();
  }

  return `
IMPORTANT — LANGUE : écris toutes les questions, supports, barèmes et explications dans la MÊME
LANGUE que le contenu des leçons fourni (ne traduis jamais). Si le contenu est en arabe, réponds
entièrement en arabe. Si le contenu est en français, réponds en français. Si le contenu est en
anglais, réponds en anglais. Seuls les noms de champs JSON ("sections", "title", "points", etc.)
restent en anglais.
`.trim();
}

function buildCustomExamPrompt({ subjectId, subjectName, gradeName, lessons, difficulty, durationMinutes }) {
  const totalPoints = DURATION_TO_POINTS[durationMinutes] || DURATION_TO_POINTS[30];
  const difficultyText = DIFFICULTY_GUIDANCE[difficulty] || DIFFICULTY_GUIDANCE.mixte;
  const languageInstructions = buildLanguageInstructions(subjectId);

  const systemPrompt = `
Tu es un professeur qui rédige des sujets d'examen officiels pour le programme scolaire tunisien
(du primaire au collège), dans le style exact d'un "devoir de contrôle" ou "devoir de synthèse"
que l'élève recevrait réellement en classe. Ce n'est PAS un quiz ludique — c'est un examen
académique sérieux et professionnel.

RÈGLE ESSENTIELLE SUR LE FORMAT :
- Privilégie très largement les questions ouvertes ("ouverte") et les exercices à sous-questions
  ("structuree", avec des parties a), b), c)...), exactement comme dans un vrai examen papier où
  l'élève rédige ses réponses.
- Pour les matières scientifiques (mathématiques, sciences physiques) : structure les exercices
  en plusieurs sous-questions qui s'enchaînent logiquement (ex: a) calculer..., b) en déduire...,
  c) résoudre...), comme dans un exercice de devoir de synthèse réel.
- Pour les matières littéraires (français, arabe, anglais) : utilise "supportText" pour fournir un
  texte de lecture ou un support, suivi de questions de compréhension et de langue portant sur ce
  texte, éventuellement suivies d'une question de production écrite (rédaction courte).
- N'utilise "qcm" que très rarement (au maximum une question sur tout l'examen), et seulement si
  cela correspond à un usage réellement observé dans les examens officiels (ex: vrai/faux). Ne
  construis JAMAIS un examen majoritairement composé de QCM.

Tu crées ces questions UNIQUEMENT à partir du contenu de leçon fourni par l'utilisateur. Tu
n'inventes AUCUNE règle, formule, date, fait ou exemple qui n'apparaît pas dans ce contenu.

${languageInstructions}

${JSON_SCHEMA_INSTRUCTIONS}
`.trim();

  const userPrompt = `
Matière : ${subjectName}
Niveau : ${gradeName}
Durée de l'examen : ${durationMinutes} minutes
Total de points attendu : ${totalPoints}
Niveau de difficulté : ${difficultyText}

Contenu des leçons sélectionnées (source unique de vérité — n'invente rien en dehors de ceci) :

${buildGroundingBlock(lessons)}

Génère maintenant l'examen complet au format JSON demandé, dans le style d'un vrai devoir de
contrôle/synthèse tunisien (questions ouvertes et exercices à sous-questions en priorité, QCM très
rare ou absent), couvrant l'ensemble des leçons ci-dessus de façon équilibrée, pour un total de
${totalPoints} points.
`.trim();

  return { systemPrompt, userPrompt, totalPoints };
}

module.exports = { buildCustomExamPrompt, DURATION_TO_POINTS };