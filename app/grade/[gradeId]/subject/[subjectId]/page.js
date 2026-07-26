"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { findSubject, findLessonsForSubject } from "../../../../../lib/curriculum";
import { useUser } from "../../../../../lib/auth";
import { canAccessLesson } from "../../../../../lib/access";
import { getLocalProgress, lessonCompletion } from "../../../../../lib/progress";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import "../../../../style.css";

const TRIMESTRE_META = {
  1: { label: "Trimestre 1", period: "Septembre — Décembre", tag: "En cours", tagTone: "primary" },
  2: { label: "Trimestre 2", period: "Janvier — Mars", tag: "À venir", tagTone: "muted" },
  3: { label: "Trimestre 3", period: "Avril — Juin", tag: "À venir", tagTone: "muted" },
};

function Stat({ label, value }) {
  return (
    <div className="stat">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

function Chip({ icon, children }) {
  return (
    <span className="chip">
      <span className="chip-icon">{icon}</span>
      {children}
    </span>
  );
}

export default function LessonsPage() {
  const { gradeId, subjectId } = useParams();
  const { user, hydrated: userHydrated } = useUser();

  const [found, setFound] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const [openTrimestre, setOpenTrimestre] = useState(null);

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

      const lessonsResult = await findLessonsForSubject(gradeId, subjectId);
      if (cancelled) return;

      setFound(subjectResult);
      setLessons(lessonsResult);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [gradeId, subjectId]);

  if (notFoundFlag) {
    notFound();
  }

  if (loading || !found) {
    return (
      <div className="page-container page-container-md">
        <LoadingSpinner/>
      </div>
    );
  }

  const { level, grade, subject } = found;
  const total = lessons.length;

  const progress = userHydrated ? (user ? user.progress || {} : getLocalProgress()) : {};
  const subjectProgressMap = progress?.[gradeId]?.[subjectId] || {};

  function getLessonStatus(lessonId) {
    const lp = subjectProgressMap[lessonId];
    if (!lp) return "not-started";
    const pct = lessonCompletion(lp);
    if (pct >= 1) return "done";
    if (pct > 0) return "in-progress";
    return "not-started";
  }

  const groups = [1, 2, 3]
    .map((t) => ({
      id: `t${t}`,
      trimestre: t,
      ...TRIMESTRE_META[t],
      lessons: lessons.filter((l) => l.trimestre === t),
    }))
    .filter((g) => g.lessons.length > 0);

  return (
    <div className="page-container page-container-md">
      <nav className="breadcrumb">
        <Link href="/" className="breadcrumb-link">Accueil</Link>
        <span className="breadcrumb-sep">/</span>
        <Link href={`/grade/${gradeId}`} className="breadcrumb-link">{grade.name}</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{subject.name}</span>
      </nav>

      <header className="lessons-header">
        <div className="lessons-header-main">
          <span className="subject-icon subject-icon-lg">{subject.icon}</span>
          <div>
            <p className="eyebrow">{level.name} · {grade.name}</p>
            <h1 className="lessons-title">{subject.name}</h1>
            <p className="lessons-subtitle">{total} leçons réparties sur 3 trimestres</p>
          </div>
        </div>
        <div className="lessons-stats">
          <Stat label="Leçons" value={String(total)} />
          <Stat label="Exercices" value={String(total * 3)} />
          <Stat label="Tests" value={String(total)} />
        </div>
      </header>

      <div className="trimestre-accordion">
        {groups.map((g, gi) => {
          const open = openTrimestre === g.trimestre;
          return (
            <section
              key={g.id}
              className={`accordion-section ${open ? "accordion-section-open" : ""}`}
            >
              <button
                type="button"
                onClick={() => setOpenTrimestre(open ? null : g.trimestre)}
                className="accordion-trigger"
                aria-expanded={open}
              >
                <span className="accordion-number">{gi + 1}</span>
                <div className="accordion-info">
                  <div className="accordion-label-row">
                    <p className="accordion-label">{g.label}</p>
                    <span className={`accordion-tag accordion-tag-${g.tagTone}`}>{g.tag}</span>
                  </div>
                  <p className="accordion-meta">{g.period} · {g.lessons.length} leçons</p>
                </div>

                <span className="accordion-cta-text">
                  {open ? "Fermer" : "Afficher les leçons"}
                </span>

                <span className={`accordion-chevron-badge ${open ? "accordion-chevron-badge-open" : ""}`}>
                  <svg
                    className={`accordion-chevron ${open ? "" : "accordion-chevron-bounce"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>

              {open && (
                <ol className="lesson-ordered-list lesson-ordered-list-anim">
                  {g.lessons.map((l, i) => {
                    const lessonIndexInSubject = l.order - 1;
                    const accessible = canAccessLesson(user, gradeId, lessonIndexInSubject);
                    const status = getLessonStatus(l.lessonId);
                    const ctaLabel = status === "done" ? "Revoir" : status === "in-progress" ? "Continuer" : "Ouvrir la leçon";

                    const rowNumber = (
                      <span className={`lesson-number lesson-number-${status}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    );

                    const rowInfo = (
                      <div className="lesson-row-info">
                        <p className="lesson-row-title">
                          {l.title}
                          {!accessible && <span className="lock-badge">🔒</span>}
                          {accessible && status === "done" && (
                            <span className="lesson-status-badge lesson-status-badge-done">Terminée</span>
                          )}
                          {accessible && status === "in-progress" && (
                            <span className="lesson-status-badge lesson-status-badge-progress">En cours</span>
                          )}
                        </p>
                        {l.summary && (
                          <p className="lesson-row-summary">{l.summary}</p>
                        )}
                        <div className="lesson-row-chips">
                          <Chip icon="📖">Résumé</Chip>
                          <Chip icon="●">3 exercices</Chip>
                          <Chip icon="⏱">Test · 10 min</Chip>
                        </div>
                      </div>
                    );

                    if (!accessible) {
                      return (
                        <li
                          key={l.id}
                          className="lesson-list-item lesson-list-item-anim"
                          style={{ animationDelay: `${i * 60}ms` }}
                        >
                          <div
                            className="lesson-row lesson-row-locked"
                            role="button"
                            aria-disabled="true"
                            tabIndex={-1}
                          >
                            {rowNumber}
                            {rowInfo}
                            <span className="lesson-row-locked-hint">🔒 Verrouillée</span>
                          </div>
                        </li>
                      );
                    }

                    return (
                      <li
                        key={l.id}
                        className="lesson-list-item lesson-list-item-anim"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <Link
                          href={`/grade/${gradeId}/subject/${subjectId}/lesson/${l.lessonId}`}
                          className={`lesson-row lesson-row-${status}`}
                        >
                          {rowNumber}
                          {rowInfo}
                          <span className={`lesson-row-open lesson-row-open-${status}`}>
                            <span className="lesson-row-open-shimmer" />
                            <span className="lesson-row-open-label">{ctaLabel}</span>
                            <svg className="lesson-row-open-icon" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M7.29 5.21a.75.75 0 011.06-.02l4.25 4.29a.75.75 0 010 1.06l-4.25 4.29a.75.75 0 11-1.06-1.06L11.02 10 7.29 6.27a.75.75 0 010-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}