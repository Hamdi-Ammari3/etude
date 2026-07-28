"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { DB } from "../../../../../../../lib/firebaseConfig";
import { findSubject } from "../../../../../../../lib/curriculum";
import { useUser } from "../../../../../../../lib/auth";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import AccessRequiredModal from "../../../../../../components/AccessRequiredModal";
import '../../../../../../style.css';

export default function CustomExamPage() {
  const { gradeId, subjectId, examId } = useParams();
  const { user, hydrated: userHydrated } = useUser();

  const [found, setFound] = useState(null);
  const [exam, setExam] = useState(null);
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const [phase, setPhase] = useState("intro"); // "intro" | "taking" | "correction"

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      const subjectResult = await findSubject(gradeId, subjectId);
      if (cancelled) return;
      if (!subjectResult) {
        setNotFoundFlag(true);
        setLoading(false);
        return;
      }

      if (!user) {
        setFound(subjectResult);
        setLoading(false);
        return;
      }

      const examSnap = await getDoc(doc(DB, "customExams", examId));
      const contentSnap = await getDoc(doc(DB, "customExamContent", examId));

      if (cancelled) return;

      if (!examSnap.exists() || !contentSnap.exists()) {
        setNotFoundFlag(true);
        setLoading(false);
        return;
      }

      const examData = examSnap.data();

      if (examData.uid !== user.uid) {
        setForbidden(true);
        setLoading(false);
        return;
      }

      setFound(subjectResult);
      setExam({ id: examId, ...examData });
      setSections(contentSnap.data().sections);

      if (examData.result) {
        setPhase("correction");
      }

      setLoading(false);
    }

    if (userHydrated) load();
    return () => {
      cancelled = true;
    };
  }, [gradeId, subjectId, examId, user, userHydrated]);

  if (notFoundFlag) {
    notFound();
  }

  if (loading || !userHydrated || !found) {
    return (
      <div className="page-container page-container-sm">
        <LoadingSpinner />
      </div>
    );
  }

  const { grade, subject } = found;

  if (!user) {
    return (
      <div className="page-container page-container-sm">
        <nav className="breadcrumb">
          <Link href="/" className="breadcrumb-link">Accueil</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href={`/grade/${gradeId}`} className="breadcrumb-link">{grade.name}</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href={`/grade/${gradeId}/subject/${subjectId}`} className="breadcrumb-link">
            {subject.name}
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Examen à la demande</span>
        </nav>

        <div className="quiz-intro" style={{ marginTop: "1.5rem" }}>
          <p className="quiz-intro-title">Votre examen vous attend</p>
          <p className="quiz-intro-text">
            Connectez-vous pour accéder à votre examen personnalisé de {subject.name}, avec sa
            correction détaillée.
          </p>
        </div>

        <AccessRequiredModal variant="login" gradeId={gradeId} onClose={() => {}} />
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="page-container page-container-sm">
        <div className="lesson-locked">
          <p className="lesson-locked-title">Examen introuvable</p>
          <p className="lesson-locked-text">
            Cet examen n'existe pas ou ne vous appartient pas.
          </p>
          <Link href="/" className="btn btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  if (!exam || !sections) {
    return (
      <div className="page-container page-container-sm">
        <LoadingSpinner />
      </div>
    );
  }

  async function saveResult(result) {
    await updateDoc(doc(DB, "customExams", examId), {
      result,
      completedAt: new Date().toISOString(),
    });
    setExam((e) => ({ ...e, result }));
  }

  return (
    <div className="page-container page-container-sm">
      <nav className="breadcrumb">
        <Link href="/" className="breadcrumb-link">Accueil</Link>
        <span className="breadcrumb-sep">/</span>
        <Link href={`/grade/${gradeId}`} className="breadcrumb-link">{grade.name}</Link>
        <span className="breadcrumb-sep">/</span>
        <Link href={`/grade/${gradeId}/subject/${subjectId}`} className="breadcrumb-link">
          {subject.name}
        </Link>
        <span className="breadcrumb-sep">/</span>
        <Link href={`/grade/${gradeId}/subject/${subjectId}/examen`} className="breadcrumb-link">
          Examen à la demande
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{exam.title}</span>
      </nav>

      {phase === "intro" && (
        <ExamIntro exam={exam} sections={sections} onStart={() => setPhase("taking")} />
      )}

      {phase === "taking" && (
        <ExamTaking
          exam={exam}
          sections={sections}
          onFinish={() => setPhase("correction")}
        />
      )}

      {phase === "correction" && (
        <ExamCorrection
          exam={exam}
          sections={sections}
          onSave={saveResult}
        />
      )}
    </div>
  );
}

function ExamIntro({ exam, sections, onStart }) {
  const questionCount = sections.reduce((acc, s) => acc + s.questions.length, 0);

  return (
    <div className="quiz-intro" style={{marginTop:'20px'}}>
      <p className="quiz-intro-title">{exam.title}</p>
      <p className="quiz-intro-text">
        {sections.length} section{sections.length > 1 ? "s" : ""} · {questionCount} question
        {questionCount > 1 ? "s" : ""} · <span className="quiz-intro-highlight">{exam.totalPoints} points</span>
        <br />
        Durée : <span className="quiz-intro-highlight">{exam.durationMinutes} minutes</span>
      </p>
      <p className="examen-generating-text" style={{ marginTop: "1rem" }}>
        Répondez sur votre cahier comme pour un vrai devoir. À la fin, vous pourrez consulter la
        correction et vous auto-évaluer.
      </p>
      <button onClick={onStart} className="btn btn-primary btn-lg" style={{ marginTop: "1.5rem" }}>
        Commencer l'examen
      </button>
    </div>
  );
}

function ExamTaking({ exam, sections, onFinish }) {
  const [remaining, setRemaining] = useState(exam.durationMinutes * 60);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (remaining <= 0) {
      onFinish();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onFinish]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div>
      <div className="quiz-timer-bar">
        <div className="quiz-progress-text">Examen en cours</div>
        <div className={`quiz-timer ${remaining < 60 ? "quiz-timer-low" : ""}`}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      <div className="quiz-questions">
        {sections.map((section, si) => (
          <SectionBlock key={si} section={section} sectionIndex={si} showCorrection={false} />
        ))}
      </div>

      <div className="quiz-submit-row">
        {!confirmOpen ? (
          <button onClick={() => setConfirmOpen(true)} className="btn btn-primary">
            Terminer l'examen
          </button>
        ) : (
          <div className="action-row">
            <span className="btn-status">Voir la correction maintenant ?</span>
            <button onClick={onFinish} className="btn btn-primary">
              Oui, terminer
            </button>
            <button onClick={() => setConfirmOpen(false)} className="btn btn-outline">
              Continuer l'examen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionBlock({ section, sectionIndex, showCorrection, scores, onScoreChange }) {
  return (
    <div className="quiz-question-card">
      <p className="quiz-question-number">
        Section {sectionIndex + 1} · {section.points} points
      </p>
      <p className="quiz-question-text">{section.title}</p>

      {section.supportText && (
        <div className="exercise-feedback" style={{ marginTop: "1rem", background: "var(--color-accent)" }}>
          <p className="exercise-feedback-text" style={{ whiteSpace: "pre-line" }}>
            {section.supportText}
          </p>
        </div>
      )}

      <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {section.questions.map((q, qi) => (
          <QuestionBlock
            key={qi}
            question={q}
            path={`${sectionIndex}-${qi}`}
            showCorrection={showCorrection}
            scores={scores}
            onScoreChange={onScoreChange}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionBlock({ question, path, showCorrection, scores, onScoreChange }) {
  if (question.type === "structuree") {
    return (
      <div>
        <p style={{ fontWeight: 500 }}>{question.question}</p>
        <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {question.subQuestions.map((sq, sqi) => (
            <SubQuestionBlock
              key={sqi}
              subQuestion={sq}
              path={`${path}-${sqi}`}
              showCorrection={showCorrection}
              scores={scores}
              onScoreChange={onScoreChange}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="exercise-badge-row">
        <span className="exercise-level-badge">{question.points} pts</span>
      </div>
      <p style={{ marginTop: "0.5rem", fontWeight: 500 }}>{question.question}</p>

      {question.type === "qcm" && (
        <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem", color: "var(--color-muted)" }}>
          {question.options.map((opt, oi) => (
            <li key={oi}>{opt}</li>
          ))}
        </ul>
      )}

      {!showCorrection && (
        <div className="exercise-feedback" style={{ marginTop: "0.75rem" }}>
          <p className="exercise-feedback-text">Répondez sur votre cahier.</p>
        </div>
      )}

      {showCorrection && (
        <CorrectionAndScore
          maxPoints={question.points}
          bareme={question.type === "ouverte" ? question.bareme : null}
          correctAnswer={question.type === "qcm" ? question.options[question.answer] : null}
          explanation={question.explanation}
          path={path}
          scores={scores}
          onScoreChange={onScoreChange}
        />
      )}
    </div>
  );
}

function SubQuestionBlock({ subQuestion, path, showCorrection, scores, onScoreChange }) {
  return (
    <div style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--color-border)" }}>
      <div className="exercise-badge-row">
        <span className="option-letter">{subQuestion.label}</span>
        <span className="exercise-level-badge">{subQuestion.points} pts</span>
      </div>
      <p style={{ marginTop: "0.25rem" }}>{subQuestion.question}</p>

      {!showCorrection && (
        <div className="exercise-feedback" style={{ marginTop: "0.5rem" }}>
          <p className="exercise-feedback-text">Répondez sur votre cahier.</p>
        </div>
      )}

      {showCorrection && (
        <CorrectionAndScore
          maxPoints={subQuestion.points}
          bareme={subQuestion.bareme}
          correctAnswer={null}
          explanation={subQuestion.explanation}
          path={path}
          scores={scores}
          onScoreChange={onScoreChange}
        />
      )}
    </div>
  );
}

function CorrectionAndScore({ maxPoints, bareme, correctAnswer, explanation, path, scores, onScoreChange }) {
  const value = scores[path] ?? "";

  return (
    <div className="exercise-feedback exercise-feedback-correct" style={{ marginTop: "0.75rem" }}>
      {correctAnswer && (
        <p className="exercise-feedback-title">Bonne réponse : {correctAnswer}</p>
      )}
      {bareme && (
        <>
          <p className="exercise-feedback-title">Barème</p>
          <p className="exercise-feedback-text">{bareme}</p>
        </>
      )}
      <p className="exercise-feedback-title" style={{ marginTop: "0.5rem" }}>Explication</p>
      <p className="exercise-feedback-text">{explanation}</p>

      <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <label className="field-label" style={{ margin: 0 }}>Ma note :</label>
        <input
          type="number"
          min={0}
          max={maxPoints}
          step={0.5}
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            const num = raw === "" ? "" : Math.max(0, Math.min(maxPoints, Number(raw)));
            onScoreChange(path, num);
          }}
          className="text-input"
          style={{ width: "5rem" }}
        />
        <span style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>/ {maxPoints}</span>
      </div>
    </div>
  );
}

function ExamCorrection({ exam, sections, onSave }) {
  const [scores, setScores] = useState(() => exam.result?.scores || {});
  const [saved, setSaved] = useState(!!exam.result);

  const onScoreChange = (path, value) => {
    setSaved(false);
    setScores((s) => ({ ...s, [path]: value }));
  };

  const totalEarned = useMemo(
    () => Object.values(scores).reduce((acc, v) => acc + (Number(v) || 0), 0),
    [scores]
  );

  async function handleSave() {
    await onSave({ scores, totalEarned, totalPoints: exam.totalPoints });
    setSaved(true);
  }

  const pct = exam.totalPoints > 0 ? totalEarned / exam.totalPoints : 0;

  return (
    <div>
      <div className="lesson-page-header" style={{ marginTop: 0 }}>
        <h1 className="lesson-page-title">{exam.title}</h1>
        <p className="lessons-subtitle">Correction et auto-évaluation</p>
      </div>

      <div className="quiz-intro" style={{ marginTop: "1.5rem" }}>
        <p className="quiz-score">
          {totalEarned}
          <span className="quiz-score-total">/{exam.totalPoints}</span>
        </p>
        <p className="quiz-intro-text">
          {pct >= 0.6 ? "Excellent travail !" : "Continuez à réviser cette matière."}
        </p>
      </div>

      <div className="quiz-questions" style={{ marginTop: "1.5rem" }}>
        {sections.map((section, si) => (
          <SectionBlock
            key={si}
            section={section}
            sectionIndex={si}
            showCorrection
            scores={scores}
            onScoreChange={onScoreChange}
          />
        ))}
      </div>

      <div className="quiz-submit-row">
        {saved ? (
          <span className="btn-status">✓ Score enregistré</span>
        ) : (
          <button onClick={handleSave} className="btn btn-primary">
            Enregistrer mon score
          </button>
        )}
      </div>
    </div>
  );
}