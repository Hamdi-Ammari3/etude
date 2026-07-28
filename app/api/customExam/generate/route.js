import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";
import { buildCustomExamPrompt, DURATION_TO_POINTS } from "../../../../lib/customExamPrompt";
import { generateCustomExamCompletion, CUSTOM_EXAM_MODEL } from "../../../../lib/openai";
import { validateExamShape } from "../../../../lib/customExamValidate";
import {
  generateExamId,
  saveCustomExam,
  getMonthlyGenerationCount,
  incrementMonthlyGenerationCount,
  logGenerationUsage,
} from "../../../../lib/customExam";
import { findSubject, findLessonsForSubject } from "../../../../lib/curriculum";

// Total allowed generations per user, tracked as a rolling sum across
// monthly buckets (see lib/customExam.js). Expressed here as a yearly
// figure per your business decision, checked against the sum of all
// month keys currently on the user doc.
const YEARLY_EXAM_LIMIT = 100;

const MAX_LESSONS_PER_EXAM = 6;

export async function POST(request) {
  try {
    const body = await request.json();
    const { gradeId, subjectId, lessonIds, difficulty, durationMinutes } = body;

    // --- Basic input validation ---
    if (!gradeId || !subjectId) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }
    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return NextResponse.json(
        { error: "Sélectionnez au moins une leçon." },
        { status: 400 }
      );
    }
    if (lessonIds.length > MAX_LESSONS_PER_EXAM) {
      return NextResponse.json(
        { error: `Vous pouvez sélectionner au maximum ${MAX_LESSONS_PER_EXAM} leçons par examen.` },
        { status: 400 }
      );
    }
    if (!DURATION_TO_POINTS[durationMinutes]) {
      return NextResponse.json({ error: "Durée d'examen invalide." }, { status: 400 });
    }

    // --- Auth check ---
    const authHeader = request.headers.get("authorization") || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!idToken) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: "Session invalide. Reconnectez-vous." }, { status: 401 });
    }
    const uid = decodedToken.uid;

    // --- Grade access check — a logged-in user only has access to the
    // grade(s) they purchased, not every grade on the platform. ---
    const userSnap = await adminDB.collection("users").doc(uid).get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "Compte introuvable." }, { status: 404 });
    }
    const userData = userSnap.data();
    const purchasedGrades = userData.purchasedGrades || [];
    if (!purchasedGrades.includes(gradeId)) {
      return NextResponse.json(
        { error: "Vous n'avez pas accès à cette classe." },
        { status: 403 }
      );
    }

    // --- Rate limit check (yearly cap, summed across monthly buckets) ---
    const usageMap = userData.customExamUsage || {};
    const totalUsedThisYear = Object.entries(usageMap)
      .filter(([monthKey]) => monthKey.startsWith(String(new Date().getUTCFullYear())))
      .reduce((sum, [, count]) => sum + count, 0);

    if (totalUsedThisYear >= YEARLY_EXAM_LIMIT) {
      return NextResponse.json(
        { error: "Vous avez atteint votre nombre maximal d'examens générés pour cette année." },
        { status: 429 }
      );
    }

    // --- Fetch subject + lesson content for grounding ---
    const subjectResult = await findSubject(gradeId, subjectId);
    if (!subjectResult) {
      return NextResponse.json({ error: "Matière introuvable." }, { status: 404 });
    }

    const allLessons = await findLessonsForSubject(gradeId, subjectId);
    const selectedLessons = allLessons.filter((l) => lessonIds.includes(l.lessonId));

    if (selectedLessons.length === 0) {
      return NextResponse.json({ error: "Leçons sélectionnées introuvables." }, { status: 404 });
    }

    // --- Build the prompt ---
    const { systemPrompt, userPrompt, totalPoints } = buildCustomExamPrompt({
      subjectId,
      subjectName: subjectResult.subject.name,
      gradeName: subjectResult.grade.name,
      lessons: selectedLessons,
      difficulty: difficulty || "mixte",
      durationMinutes,
    });

    // --- Call the model, with one retry if the output doesn't validate ---
    let parsed = null;
    let validation = { valid: false, errors: ["Non tenté"] };
    let usage = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 2;

    while (attempts < MAX_ATTEMPTS && !validation.valid) {
      attempts += 1;

      const isRetry = attempts > 1;
      const retryNote = isRetry
        ? `\n\nATTENTION : ta réponse précédente était invalide pour les raisons suivantes, corrige-les strictement :\n${validation.errors.join("\n")}`
        : "";

      let completion;
      try {
        completion = await generateCustomExamCompletion({
          systemPrompt,
          userPrompt: userPrompt + retryNote,
        });
      } catch (apiErr) {
        console.error("OpenAI generation error:", apiErr);
        return NextResponse.json(
          { error: "Le service de génération est momentanément indisponible. Réessayez." },
          { status: 502 }
        );
      }

      usage = completion.usage;

      try {
        parsed = JSON.parse(completion.rawContent);
      } catch {
        validation = { valid: false, errors: ["Réponse non conforme au format JSON."] };
        continue;
      }

      validation = validateExamShape(parsed, totalPoints);
    }

    if (!validation.valid) {
      // Log the failure for visibility even though we're not saving an
      // exam doc — useful to notice if a particular subject/grade
      // combination is consistently failing validation.
      await logGenerationUsage({
        examId: null,
        uid,
        gradeId,
        subjectId,
        model: CUSTOM_EXAM_MODEL,
        usage,
        valid: false,
      });

      return NextResponse.json(
        { error: "La génération de l'examen a échoué. Réessayez dans un instant." },
        { status: 500 }
      );
    }

    // --- Save the exam ---
    const examId = generateExamId();
    const title = `Examen personnalisé — ${subjectResult.subject.name}`;

    await saveCustomExam({
      examId,
      meta: {
        uid,
        gradeId,
        subjectId,
        lessonIds,
        title,
        totalPoints,
        durationMinutes,
        difficulty: difficulty || "mixte",
        model: CUSTOM_EXAM_MODEL,
      },
      content: { sections: parsed.sections },
    });

    // --- Update usage counter + log ---
    await incrementMonthlyGenerationCount(uid);
    await logGenerationUsage({
      examId,
      uid,
      gradeId,
      subjectId,
      model: CUSTOM_EXAM_MODEL,
      usage,
      valid: true,
    });

    return NextResponse.json({ examId });
  } catch (err) {
    console.error("customExam/generate error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessayez." }, { status: 500 });
  }
}