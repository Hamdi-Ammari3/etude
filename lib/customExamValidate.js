// lib/customExamValidate.js

// Expected shape (after JSON.parse of the model's output):
// {
//   sections: [
//     {
//       title: string,
//       points: number,                 // must equal sum of question points in this section
//       supportText: string | null,     // optional passage/problem statement the section is based on
//       questions: [
//         {
//           type: "ouverte" | "structuree" | "qcm",
//           question: string,           // for "structuree", this is the shared intro/context
//           points: number,             // for "structuree", must equal sum of subQuestions' points
//           // --- ouverte only ---
//           bareme: string,
//           explanation: string,
//           // --- qcm only ---
//           options: string[],          // at least 2 options
//           answer: number,             // valid index into options
//           explanation: string,
//           // --- structuree only ---
//           subQuestions: [
//             {
//               label: string,          // e.g. "a)", "1)"
//               question: string,
//               points: number,
//               bareme: string,
//               explanation: string,
//             }
//           ],
//         }
//       ]
//     }
//   ]
// }

const VALID_TYPES = ["ouverte", "structuree", "qcm"];

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isFiniteNumber(v) {
  return typeof v === "number" && Number.isFinite(v);
}

// Validates one sub-question of a "structuree" question (e.g. the "a)"
// or "b)" part).
function validateSubQuestion(sq, path, errors) {
  if (sq === null || typeof sq !== "object") {
    errors.push(`${path}: n'est pas un objet`);
    return;
  }

  if (!isNonEmptyString(sq.label)) {
    errors.push(`${path}.label: manquant ou vide (ex: "a)", "1)")`);
  }
  if (!isNonEmptyString(sq.question)) {
    errors.push(`${path}.question: texte manquant ou vide`);
  }
  if (!isFiniteNumber(sq.points) || sq.points <= 0) {
    errors.push(`${path}.points: doit être un nombre positif (reçu: ${JSON.stringify(sq.points)})`);
  }
  if (!isNonEmptyString(sq.bareme)) {
    errors.push(`${path}.bareme: barème manquant ou vide`);
  }
  if (!isNonEmptyString(sq.explanation)) {
    errors.push(`${path}.explanation: explication manquante ou vide`);
  }

  // Sub-questions must not carry fields belonging to other question types.
  ["options", "answer", "subQuestions"].forEach((field) => {
    if (field in sq) {
      errors.push(`${path}.${field}: ne doit pas être présent dans une sous-question`);
    }
  });
}

// Validates one question object. Pushes human-readable error strings into
// `errors` (with a path prefix so you can tell exactly which question
// failed and why) rather than just returning a boolean.
function validateQuestion(q, path, errors) {
  if (q === null || typeof q !== "object") {
    errors.push(`${path}: n'est pas un objet`);
    return;
  }

  if (!VALID_TYPES.includes(q.type)) {
    errors.push(`${path}.type: doit être "ouverte", "structuree" ou "qcm" (reçu: ${JSON.stringify(q.type)})`);
  }

  if (!isNonEmptyString(q.question)) {
    errors.push(`${path}.question: texte de question manquant ou vide`);
  }

  if (!isFiniteNumber(q.points) || q.points <= 0) {
    errors.push(`${path}.points: doit être un nombre positif (reçu: ${JSON.stringify(q.points)})`);
  }

  if (q.type === "qcm") {
    if (!isNonEmptyString(q.explanation)) {
      errors.push(`${path}.explanation: explication manquante ou vide`);
    }

    if (!Array.isArray(q.options) || q.options.length < 2) {
      errors.push(`${path}.options: doit être un tableau d'au moins 2 choix`);
    } else if (!q.options.every(isNonEmptyString)) {
      errors.push(`${path}.options: contient une option vide ou non textuelle`);
    }

    if (
      !isFiniteNumber(q.answer) ||
      !Number.isInteger(q.answer) ||
      (Array.isArray(q.options) && (q.answer < 0 || q.answer >= q.options.length))
    ) {
      errors.push(`${path}.answer: doit être un index valide dans "options" (reçu: ${JSON.stringify(q.answer)})`);
    }

    ["bareme", "subQuestions"].forEach((field) => {
      if (field in q) {
        errors.push(`${path}.${field}: ne doit pas être présent pour une question de type "qcm"`);
      }
    });
  }

  if (q.type === "ouverte") {
    if (!isNonEmptyString(q.bareme)) {
      errors.push(`${path}.bareme: barème manquant ou vide pour une question ouverte`);
    }
    if (!isNonEmptyString(q.explanation)) {
      errors.push(`${path}.explanation: explication manquante ou vide`);
    }

    ["options", "answer", "subQuestions"].forEach((field) => {
      if (field in q) {
        errors.push(`${path}.${field}: ne doit pas être présent pour une question de type "ouverte"`);
      }
    });
  }

  if (q.type === "structuree") {
    if (!Array.isArray(q.subQuestions) || q.subQuestions.length < 2) {
      errors.push(`${path}.subQuestions: doit être un tableau d'au moins 2 sous-questions`);
    } else {
      q.subQuestions.forEach((sq, sqi) =>
        validateSubQuestion(sq, `${path}.subQuestions[${sqi}]`, errors)
      );

      // Check that the parent question's points equal the sum of its
      // sub-questions' points — only if every sub-question at least had
      // a numeric points field, to avoid a confusing secondary error.
      const allSubQuestionsHavePoints = q.subQuestions.every((sq) => isFiniteNumber(sq?.points));
      if (allSubQuestionsHavePoints && isFiniteNumber(q.points)) {
        const sum = q.subQuestions.reduce((acc, sq) => acc + sq.points, 0);
        if (Math.abs(sum - q.points) > 0.001) {
          errors.push(
            `${path}: la somme des points des sous-questions (${sum}) ne correspond pas à question.points (${q.points})`
          );
        }
      }
    }

    ["bareme", "explanation", "options", "answer"].forEach((field) => {
      if (field in q) {
        errors.push(`${path}.${field}: ne doit pas être présent pour une question de type "structuree" (utilisez subQuestions)`);
      }
    });
  }
}

// Validates one section object, including that its declared `points`
// matches the sum of its questions' individual points, and that
// `supportText` (if present) is a string or null.
function validateSection(section, path, errors) {
  if (section === null || typeof section !== "object") {
    errors.push(`${path}: n'est pas un objet`);
    return;
  }

  if (!isNonEmptyString(section.title)) {
    errors.push(`${path}.title: titre de section manquant ou vide`);
  }

  if (!isFiniteNumber(section.points) || section.points <= 0) {
    errors.push(`${path}.points: doit être un nombre positif (reçu: ${JSON.stringify(section.points)})`);
  }

  if ("supportText" in section && section.supportText !== null && !isNonEmptyString(section.supportText)) {
    errors.push(`${path}.supportText: doit être une chaîne non vide ou null (reçu: ${JSON.stringify(section.supportText)})`);
  }

  if (!Array.isArray(section.questions) || section.questions.length === 0) {
    errors.push(`${path}.questions: doit être un tableau non vide`);
    return; // no point checking sums if there are no valid questions
  }

  section.questions.forEach((q, qi) => validateQuestion(q, `${path}.questions[${qi}]`, errors));

  // Only check the points sum if every question at least had a numeric
  // points field — otherwise this check would just produce a confusing
  // secondary error on top of the missing-field error already logged.
  const allQuestionsHavePoints = section.questions.every((q) => isFiniteNumber(q?.points));
  if (allQuestionsHavePoints) {
    const sum = section.questions.reduce((acc, q) => acc + q.points, 0);
    if (Math.abs(sum - section.points) > 0.001) {
      errors.push(
        `${path}: la somme des points des questions (${sum}) ne correspond pas à section.points (${section.points})`
      );
    }
  }
}

// Main entry point. Returns { valid: boolean, errors: string[] }.
// `expectedTotalPoints` is optional — pass it when you know the target
// total (e.g. from the generation request) to enforce it strictly;
// omit it to skip that specific check.
function validateExamShape(parsed, expectedTotalPoints) {
  const errors = [];

  if (parsed === null || typeof parsed !== "object") {
    return { valid: false, errors: ["La réponse n'est pas un objet JSON valide"] };
  }

  if (!Array.isArray(parsed.sections) || parsed.sections.length === 0) {
    return { valid: false, errors: ["sections: doit être un tableau non vide"] };
  }

  parsed.sections.forEach((section, si) => validateSection(section, `sections[${si}]`, errors));

  // Only check the overall total if every section at least had a numeric
  // points field — same reasoning as above, avoid a noisy secondary error.
  const allSectionsHavePoints = parsed.sections.every((s) => isFiniteNumber(s?.points));
  if (allSectionsHavePoints && isFiniteNumber(expectedTotalPoints)) {
    const total = parsed.sections.reduce((acc, s) => acc + s.points, 0);
    if (Math.abs(total - expectedTotalPoints) > 0.001) {
      errors.push(
        `Total: la somme des points de toutes les sections (${total}) ne correspond pas au total attendu (${expectedTotalPoints})`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateExamShape };