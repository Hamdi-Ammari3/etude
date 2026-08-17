"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { findLesson } from "../../../../../../../lib/curriculum";
import { TRIMESTRE_META } from "../../../../../../../lib/trimestres";
import {getLocalProgress,saveLocalProgress,updateLessonProgress,lessonCompletion} from "../../../../../../../lib/progress";
import ProgressBar from "../../../../../../components/ProgressBar";
import { useUser } from "../../../../../../../lib/auth";
import { canAccessLesson } from "../../../../../../../lib/access";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import "../../../../../../style.css";
import "../../Subjectstyle.css";
import "./lessonPage.css";

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
      <div className="loading-page">
        <LoadingSpinner />
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
    <div className="home-page">
      <div className="grd-page">
      {lesson.trimestre && (
        <Link
          href={`/grade/${gradeId}/subject/${subjectId}/trimestre/${lesson.trimestre}`}
          className="subj-back-link"
        >
          ← {TRIMESTRE_META[lesson.trimestre]?.label || `Trimestre ${lesson.trimestre}`}
        </Link>
      )}

      <header className="lesson-header">
        <h1 className="lesson-title">{lesson.title}</h1>
        <div className="lesson-progress-wrap">
          <ProgressBar value={pct} />
        </div>
      </header>

      {!accessible ? (
        <div className="lesson-locked-card">
          <p className="lesson-locked-emoji">🔒</p>
          <p className="lesson-locked-title">Cette leçon est verrouillée</p>
          <p className="lesson-locked-text">
            Débloquez la classe {grade.name} pour accéder à cette leçon, ses exercices et son test.
          </p>
          <Link href={`/grade/${gradeId}/unlock`} className="btn-pill btn-pill-primary">
            Débloquer la classe
          </Link>
        </div>
      ) : (
        <>
          <div className="lesson-tabs">
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
                  className={`lesson-tab ${active ? "lesson-tab-active" : ""}`}
                >
                  <span className="lesson-tab-content">
                    {t.label}
                    {done && <span className="lesson-tab-dot" />}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="lesson-panel">
            {tab === "resume" && (
              <SummarySection
                summary={lesson.summary}
                keyPoints={lesson.keyPoints}
                videoLinks={lesson.videoLinks}
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
    </div>
  );
}

function SummarySection({ summary, keyPoints, videoLinks, done, onDone, onNext }) {
  return (
    <article>
      <h2 className="lesson-section-heading">📖 Résumé de la leçon</h2>
      <p className="lesson-summary-text">{summary}</p>

      <h3 className="lesson-subheading">✨ Points clés</h3>
      <ul className="lesson-keypoints">
        {keyPoints.map((k, i) => (
          <li key={i} className="lesson-keypoint-item">
            <span className="lesson-keypoint-dot" />
            <span>{k}</span>
          </li>
        ))}
      </ul>

      {videoLinks?.length > 0 && (
        <>
          <h3 className="lesson-subheading">🎬 Vidéos complémentaires</h3>
          <div className="lesson-video-list">
            {videoLinks.map((v, i) => (
              <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" className="lesson-video-row">
                <span className="lesson-video-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <div className="lesson-video-info">
                  <p className="lesson-video-title">{v.title}</p>
                  {v.channel && <p className="lesson-video-channel">{v.channel}</p>}
                </div>
                <span className="lesson-video-external">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586L8.293 10.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </>
      )}

      <div className="lesson-action-row">
        {!done ? (
          <button
            onClick={() => {
              onDone();
              onNext();
            }}
            className="btn-pill btn-pill-primary"
          >
            J'ai compris — Passer aux exercices
          </button>
        ) : (
          <>
            <span className="lesson-status-chip">✓ Résumé lu</span>
            <button onClick={onNext} className="btn-pill btn-pill-primary">
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
      <span className="lesson-level-badge">Niveau · {label}</span>
      <h2 className="lesson-exercise-question">{exercise.question}</h2>

      <div className="lesson-options">
        {exercise.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = submitted && i === exercise.answer;
          const isWrong = submitted && isSelected && i !== exercise.answer;
          let cls = "lesson-option";
          if (isCorrect) cls += " lesson-option-correct";
          else if (isWrong) cls += " lesson-option-wrong";
          else if (isSelected) cls += " lesson-option-selected";
          return (
            <button key={i} onClick={() => !submitted && setSelected(i)} disabled={submitted} className={cls}>
              <span className="lesson-option-letter">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className={`lesson-feedback ${correct ? "lesson-feedback-correct" : "lesson-feedback-wrong"}`}>
          <p className="lesson-feedback-title">{correct ? "Bonne réponse !" : "Ce n'est pas la bonne réponse."}</p>
          <p className="lesson-feedback-text">{exercise.explanation}</p>
        </div>
      )}

      <div className="lesson-action-row">
        {!submitted ? (
          <button onClick={() => setSubmitted(true)} disabled={selected === null} className="btn-pill btn-pill-primary">
            Valider ma réponse
          </button>
        ) : correct ? (
          <button onClick={onNext} className="btn-pill btn-pill-primary">
            Continuer →
          </button>
        ) : (
          <button
            onClick={() => {
              setSelected(null);
              setSubmitted(false);
            }}
            className="btn-pill btn-pill-outline"
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
      <div className="lesson-quiz-intro">
        <p className="lesson-quiz-intro-title">Petit test final</p>
        <p className="lesson-quiz-intro-text">
          {questions.length} questions à choix multiple. Vous disposez de{" "}
          <span className="lesson-quiz-highlight">10 minutes</span>. Le test se termine automatiquement à la fin du
          temps.
        </p>
        <button onClick={() => setStarted(true)} className="btn-pill btn-pill-primary btn-pill-lg">
          Commencer le test
        </button>
      </div>
    );
  }

  if (finished) {
    const pass = score / questions.length >= 0.6;
    return (
      <div className="lesson-quiz-intro">
        <p className="lesson-quiz-intro-title">Test terminé</p>
        <p className="lesson-quiz-score">
          {score}
          <span className="lesson-quiz-score-total">/{questions.length}</span>
        </p>
        <p className="lesson-quiz-intro-text">
          {pass ? "Excellent travail ! Leçon validée." : "Continuez à réviser et retentez le test."}
        </p>
        <button
          onClick={() => {
            setAnswers(questions.map(() => null));
            setRemaining(QUIZ_DURATION);
            setFinished(false);
            setStarted(false);
          }}
          className="btn-pill btn-pill-outline"
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
      <div className="lesson-quiz-timer-bar">
        <div className="lesson-quiz-progress-text">
          {answered} / {questions.length} répondues
        </div>
        <div className={`lesson-quiz-timer ${remaining < 60 ? "lesson-quiz-timer-low" : ""}`}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      <div className="lesson-quiz-questions">
        {questions.map((q, qi) => (
          <div key={qi} className="lesson-quiz-question-card">
            <p className="lesson-quiz-question-number">Question {qi + 1}</p>
            <p className="lesson-quiz-question-text">{q.question}</p>
            <div className="lesson-quiz-options-grid">
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
                    className={`lesson-quiz-option ${sel ? "lesson-quiz-option-selected" : ""}`}
                  >
                    <span className="lesson-option-letter">{String.fromCharCode(65 + oi)}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="lesson-quiz-submit-row">
        <button
          onClick={() => {
            setFinished(true);
            onFinish(score, questions.length);
          }}
          className="btn-pill btn-pill-primary"
        >
          Terminer le test
        </button>
      </div>
    </div>
  );
}