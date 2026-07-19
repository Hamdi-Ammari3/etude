"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { findLesson } from "../../../../../../../lib/curriculum";
import {getLocalProgress,saveLocalProgress,updateLessonProgress,lessonCompletion} from "../../../../../../../lib/progress";
import ProgressBar from "../../../../../../components/ProgressBar";
import { useUser } from "../../../../../../../lib/auth";
import { canAccessLesson } from "../../../../../../../lib/access";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import "../../../../../../style.css";

const TABS = [
  { id: "resume", label: "Résumé" },
  { id: "facile", label: "Facile" },
  { id: "moyen", label: "Moyen" },
  { id: "difficile", label: "Difficile" },
  { id: "test", label: "Test (10 min)" },
];

export default function LessonPage() {
  const { gradeId, subjectId, lessonId } = useParams();
  const { user, hydrated: userHydrated } = useUser();

  const [found, setFound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const [tab, setTab] = useState("resume");

  const [localProgress, setLocalProgress] = useState({});
  useEffect(() => {
    if (userHydrated && !user) {
      setLocalProgress(getLocalProgress());
    }
  }, [userHydrated, user]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const result = await findLesson(gradeId, subjectId, lessonId);
      if (cancelled) return;

      if (!result) {
        setNotFoundFlag(true);
        setLoading(false);
        return;
      }

      setFound(result);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [gradeId, subjectId, lessonId]);

  if (notFoundFlag) {
    notFound();
  }

  if (loading || !found) {
    return (
      <div className="page-container page-container-sm">
        <LoadingSpinner/>
      </div>
    );
  }

  const { grade, subject, lesson } = found;
  const progress = user ? user.progress || {} : localProgress;
  const lp = progress?.[gradeId]?.[subjectId]?.[lessonId];
  const pct = lessonCompletion(lp);

  // lesson.order is 1-based (from the seed script), so index = order - 1.
  const lessonIndex = lesson.order - 1;
  const accessible = canAccessLesson(user, gradeId, lessonIndex);

  async function update(gId, sId, lId, updater) {
    if (user) {
      const current = user.progress?.[gId]?.[sId]?.[lId] || {};
      const patch = updater(current);
      await updateLessonProgress(user.uid, gId, sId, lId, patch);
    } else {
      const current = getLocalProgress();
      const currentLesson = current?.[gId]?.[sId]?.[lId] || {};
      const newLesson = updater(currentLesson);

      const next = structuredClone(current);
      next[gId] = next[gId] || {};
      next[gId][sId] = next[gId][sId] || {};
      next[gId][sId][lId] = newLesson;

      saveLocalProgress(next);
      setLocalProgress(next);
    }
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
      </nav>

      <header className="lesson-page-header">
        <h1 className="lesson-page-title">{lesson.title}</h1>
        <div className="lesson-page-progress">
          <ProgressBar value={pct} />
        </div>
      </header>

      {!accessible ? (
        <div className="lesson-locked">
          <p className="lesson-locked-title">Cette leçon est verrouillée</p>
          <p className="lesson-locked-text">
            Débloquez la classe {grade.name} pour accéder à cette leçon, ses exercices et son test.
          </p>
          <Link href={`/grade/${gradeId}/unlock`} className="btn btn-primary">
            Débloquer la classe
          </Link>
        </div>
      ) : (
        <>
          <div className="tab-bar">
            {TABS.map((t) => {
              const active = tab === t.id;
              const done =
                (t.id === "resume" && lp?.summaryRead) ||
                (t.id === "facile" && lp?.exercises?.facile) ||
                (t.id === "moyen" && lp?.exercises?.moyen) ||
                (t.id === "difficile" && lp?.exercises?.difficile) ||
                (t.id === "test" && lp?.quizTotal && (lp.quizScore ?? 0) / lp.quizTotal >= 0.6);
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`tab-button ${active ? "tab-button-active" : ""}`}
                >
                  <span className="tab-button-content">
                    {t.label}
                    {done && <span className="tab-done-dot" />}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="tab-panel">
            {tab === "resume" && (
              <SummarySection
                summary={lesson.summary}
                keyPoints={lesson.keyPoints}
                done={!!lp?.summaryRead}
                onDone={() => update(gradeId, subjectId, lessonId, (p) => ({ ...p, summaryRead: true }))}
                onNext={() => setTab("facile")}
              />
            )}
            {(tab === "facile" || tab === "moyen" || tab === "difficile") && (
              <ExerciseSection
                key={tab}
                exercise={lesson.exercises.find((e) => e.difficulty === tab)}
                done={!!lp?.exercises?.[tab]}
                onComplete={() =>
                  update(gradeId, subjectId, lessonId, (p) => ({
                    ...p,
                    exercises: { ...(p.exercises || {}), [tab]: true },
                  }))
                }
                onNext={() => setTab(tab === "facile" ? "moyen" : tab === "moyen" ? "difficile" : "test")}
              />
            )}
            {tab === "test" && (
              <QuizSection
                questions={lesson.quiz}
                onFinish={(score, total) =>
                  update(gradeId, subjectId, lessonId, (p) => ({ ...p, quizScore: score, quizTotal: total }))
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SummarySection({ summary, keyPoints, done, onDone, onNext }) {
  return (
    <article className="prose-like">
      <h2 className="prose-heading">Résumé de la leçon</h2>
      <p className="prose-text">{summary}</p>
      <h3 className="prose-subheading">Points clés</h3>
      <ul className="key-points-list">
        {keyPoints.map((k, i) => (
          <li key={i} className="key-point-item">
            <span className="key-point-dot" />
            <span>{k}</span>
          </li>
        ))}
      </ul>
      <div className="action-row">
        {!done ? (
          <button
            onClick={() => {
              onDone();
              onNext();
            }}
            className="btn btn-primary"
          >
            J'ai compris — Passer aux exercices
          </button>
        ) : (
          <>
            <span className="btn-status">✓ Résumé lu</span>
            <button onClick={onNext} className="btn btn-primary">
              Passer aux exercices
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function ExerciseSection({ exercise, done, onComplete, onNext }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const correct = submitted && selected === exercise.answer;

  useEffect(() => {
    if (correct && !done) onComplete();
  }, [correct, done, onComplete]);

  const label =
    exercise.difficulty === "facile" ? "Facile" : exercise.difficulty === "moyen" ? "Moyen" : "Difficile";

  return (
    <div>
      <div className="exercise-badge-row">
        <span className="exercise-level-badge">Niveau · {label}</span>
      </div>
      <h2 className="exercise-question">{exercise.question}</h2>

      <div className="exercise-options">
        {exercise.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = submitted && i === exercise.answer;
          const isWrong = submitted && isSelected && i !== exercise.answer;
          let cls = "exercise-option";
          if (isCorrect) cls += " exercise-option-correct";
          else if (isWrong) cls += " exercise-option-wrong";
          else if (isSelected) cls += " exercise-option-selected";
          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className={cls}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className={`exercise-feedback ${correct ? "exercise-feedback-correct" : "exercise-feedback-wrong"}`}>
          <p className="exercise-feedback-title">
            {correct ? "Bonne réponse !" : "Ce n'est pas la bonne réponse."}
          </p>
          <p className="exercise-feedback-text">{exercise.explanation}</p>
        </div>
      )}

      <div className="action-row">
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={selected === null}
            className="btn btn-primary"
          >
            Valider ma réponse
          </button>
        ) : correct ? (
          <button onClick={onNext} className="btn btn-primary">
            Continuer →
          </button>
        ) : (
          <button
            onClick={() => {
              setSelected(null);
              setSubmitted(false);
            }}
            className="btn btn-outline"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}

const QUIZ_DURATION = 10 * 60;

function QuizSection({ questions, onFinish }) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState(() => questions.map(() => null));
  const [remaining, setRemaining] = useState(QUIZ_DURATION);
  const [finished, setFinished] = useState(false);

  const score = useMemo(
    () => answers.reduce((acc, a, i) => (a === questions[i].answer ? acc + 1 : acc), 0),
    [answers, questions]
  );

  useEffect(() => {
    if (!started || finished) return;
    if (remaining <= 0) {
      setFinished(true);
      onFinish(score, questions.length);
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [started, finished, remaining, score, questions.length, onFinish]);

  if (!started) {
    return (
      <div className="quiz-intro">
        <p className="quiz-intro-title">Petit test final</p>
        <p className="quiz-intro-text">
          {questions.length} questions à choix multiple. Vous disposez de{" "}
          <span className="quiz-intro-highlight">10 minutes</span>. Le test se termine
          automatiquement à la fin du temps.
        </p>
        <button onClick={() => setStarted(true)} className="btn btn-primary btn-lg">
          Commencer le test
        </button>
      </div>
    );
  }

  if (finished) {
    const pass = score / questions.length >= 0.6;
    return (
      <div className="quiz-intro">
        <p className="quiz-intro-title">Test terminé</p>
        <p className="quiz-score">
          {score}
          <span className="quiz-score-total">/{questions.length}</span>
        </p>
        <p className="quiz-intro-text">
          {pass ? "Excellent travail ! Leçon validée." : "Continuez à réviser et retentez le test."}
        </p>
        <button
          onClick={() => {
            setAnswers(questions.map(() => null));
            setRemaining(QUIZ_DURATION);
            setFinished(false);
            setStarted(false);
          }}
          className="btn btn-outline"
        >
          Recommencer
        </button>
      </div>
    );
  }

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const answered = answers.filter((a) => a !== null).length;

  return (
    <div>
      <div className="quiz-timer-bar">
        <div className="quiz-progress-text">{answered} / {questions.length} répondues</div>
        <div className={`quiz-timer ${remaining < 60 ? "quiz-timer-low" : ""}`}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      <div className="quiz-questions">
        {questions.map((q, qi) => (
          <div key={qi} className="quiz-question-card">
            <p className="quiz-question-number">Question {qi + 1}</p>
            <p className="quiz-question-text">{q.question}</p>
            <div className="quiz-options-grid">
              {q.options.map((opt, oi) => {
                const sel = answers[qi] === oi;
                return (
                  <button
                    key={oi}
                    onClick={() =>
                      setAnswers((a) => {
                        const n = [...a];
                        n[qi] = oi;
                        return n;
                      })
                    }
                    className={`quiz-option ${sel ? "quiz-option-selected" : ""}`}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + oi)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="quiz-submit-row">
        <button
          onClick={() => {
            setFinished(true);
            onFinish(score, questions.length);
          }}
          className="btn btn-primary"
        >
          Terminer le test
        </button>
      </div>
    </div>
  );
}