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
import "../../../../../../style.css";
import "../../../../../../homePage.css";
import "../../Subjectstyle.css";
import "../examenPage.css";
import "./examDetailPage.css";

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
      <div className="loading-page">
        <LoadingSpinner />
      </div>
    );
  }

  const { subject } = found;

  if (!user) {
    return (
      <div className="home-page">
      <div className="grd-page">
        <Link href={`/grade/${gradeId}/subject/${subjectId}/examen`} className="subj-back-link">
          ← Examen à la demande
        </Link>

        <div className="exam-notice-card">
          <p className="exam-notice-title">Votre examen vous attend</p>
          <p className="exam-notice-text">
            Connectez-vous pour accéder à votre examen personnalisé de {subject.name}, avec sa correction
            détaillée.
          </p>
        </div>

        <AccessRequiredModal variant="login" gradeId={gradeId} onClose={() => {}} />
      </div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="home-page">
      <div className="grd-page">
        <div className="exam-locked-card">
          <p className="exam-locked-title">Examen introuvable</p>
          <p className="exam-locked-text">Cet examen n'existe pas ou ne vous appartient pas.</p>
          <Link href="/" className="btn-pill btn-pill-primary">
            Retour à l'accueil
          </Link>
        </div>
      </div>
      </div>
    );
  }

  if (!exam || !sections) {
    return (
      <div className="loading-page">
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
    <div className="home-page">
    <div className="grd-page">
      <Link href={`/grade/${gradeId}/subject/${subjectId}/examen`} className="subj-back-link">
        ← Examen à la demande
      </Link>

      {phase === "intro" && <ExamIntro exam={exam} sections={sections} onStart={() => setPhase("taking")} />}

      {phase === "taking" && <ExamTaking exam={exam} sections={sections} onFinish={() => setPhase("correction")} />}

      {phase === "correction" && <ExamCorrection exam={exam} sections={sections} onSave={saveResult} />}
    </div>
    </div>
  );
}

function ExamIntro({ exam, sections, onStart }) {
  const questionCount = sections.reduce((acc, s) => acc + s.questions.length, 0);

  return (
    <div className="exam-intro-card">
      <h1 className="exam-detail-title">{exam.title}</h1>
      <p className="exam-intro-meta">
        {sections.length} section{sections.length > 1 ? "s" : ""} · {questionCount} question
        {questionCount > 1 ? "s" : ""} · <strong>{exam.totalPoints} points</strong>
      </p>
      <p className="exam-intro-meta">
        Durée : <strong>{exam.durationMinutes} minutes</strong>
      </p>
      <p className="exam-intro-hint">
        Répondez sur votre cahier comme pour un vrai devoir. À la fin, vous pourrez consulter la correction
        et vous auto-évaluer.
      </p>
      <button onClick={onStart} className="btn-pill btn-pill-primary btn-pill-lg" style={{ marginTop: "1.5rem" }}>
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
      <div className="exam-timer-bar">
        <span className="exam-timer-label">Examen en cours</span>
        <span className={`exam-timer ${remaining < 60 ? "exam-timer-low" : ""}`}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </div>

      <div className="exam-sections">
        {sections.map((section, si) => (
          <SectionBlock key={si} section={section} sectionIndex={si} showCorrection={false} />
        ))}
      </div>

      <div className="exam-submit-row">
        {!confirmOpen ? (
          <button onClick={() => setConfirmOpen(true)} className="btn-pill btn-pill-primary">
            Terminer l'examen
          </button>
        ) : (
          <div className="exam-confirm-row">
            <span className="exam-confirm-text">Voir la correction maintenant ?</span>
            <button onClick={onFinish} className="btn-pill btn-pill-primary">
              Oui, terminer
            </button>
            <button onClick={() => setConfirmOpen(false)} className="btn-pill btn-pill-outline">
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
    <div className="exam-section-card">
      <p className="exam-section-eyebrow">
        Section {sectionIndex + 1} · {section.points} points
      </p>
      <p className="exam-section-card-title">{section.title}</p>

      {section.supportText && (
        <div className="exam-support-box">
          <p className="exam-support-text">{section.supportText}</p>
        </div>
      )}

      <div className="exam-questions-col">
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
        <p className="exam-question-text">{question.question}</p>
        <div style={{ marginTop: "0.9rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
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
      <div className="exam-question-badge-row">
        <span className="exam-points-badge">{question.points} pts</span>
      </div>
      <p className="exam-question-text">{question.question}</p>

      {question.type === "qcm" && (
        <ul className="exam-qcm-list">
          {question.options.map((opt, oi) => (
            <li key={oi}>{opt}</li>
          ))}
        </ul>
      )}

      {!showCorrection && <p className="exam-answer-hint">Répondez sur votre cahier.</p>}

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
    <div className="exam-subquestion">
      <div className="exam-subquestion-header">
        <span className="exam-subquestion-label">{subQuestion.label}</span>
        <span className="exam-points-badge">{subQuestion.points} pts</span>
      </div>
      <p className="exam-subquestion-text">{subQuestion.question}</p>

      {!showCorrection && <p className="exam-answer-hint">Répondez sur votre cahier.</p>}

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
    <div className="exam-correction-box">
      {correctAnswer && (
        <>
          <p className="exam-correction-title">Bonne réponse</p>
          <p className="exam-correction-text">{correctAnswer}</p>
        </>
      )}
      {bareme && (
        <>
          <p className="exam-correction-title">Barème</p>
          <p className="exam-correction-text">{bareme}</p>
        </>
      )}
      <p className="exam-correction-title">Explication</p>
      <p className="exam-correction-text">{explanation}</p>

      <div className="exam-score-row">
        <label className="exam-score-label">Ma note :</label>
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
          className="exam-score-input"
        />
        <span className="exam-score-max">/ {maxPoints}</span>
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
      <div className="exam-correction-header">
        <h1 className="exam-detail-title">{exam.title}</h1>
        <p className="exam-correction-subtitle">Correction et auto-évaluation</p>
      </div>

      <div className="exam-score-display">
        <p className="exam-score-big">
          {totalEarned}
          <span className="exam-score-big-total">/{exam.totalPoints}</span>
        </p>
        <p className="exam-score-encouragement">
          {pct >= 0.6 ? "Excellent travail !" : "Continuez à réviser cette matière."}
        </p>
      </div>

      <div className="exam-sections" style={{ marginTop: "1.5rem" }}>
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

      <div className="exam-submit-row">
        {saved ? (
          <span className="exam-saved-chip">✓ Score enregistré</span>
        ) : (
          <button onClick={handleSave} className="btn-pill btn-pill-primary">
            Enregistrer mon score
          </button>
        )}
      </div>
    </div>
  );
}