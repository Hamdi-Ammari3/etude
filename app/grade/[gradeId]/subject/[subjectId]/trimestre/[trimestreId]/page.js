"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { findSubject, findLessonsForSubject } from "../../../../../../../lib/curriculum";
import { findTrimestre } from "../../../../../../../lib/trimestres";
import { useUser } from "../../../../../../../lib/auth";
import { canAccessLesson } from "../../../../../../../lib/access";
import { getLocalProgress, lessonCompletion } from "../../../../../../../lib/progress";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import "../../../../../../style.css";
import "../../../Subjectstyle.css";

function Chip({ icon, children }) {
  return (
    <span className="chip">
      <span className="chip-icon">{icon}</span>
      {children}
    </span>
  );
}

export default function TrimestrePage() {
  const { gradeId, subjectId, trimestreId } = useParams();
  const { user, hydrated: userHydrated } = useUser();

  const [found, setFound] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

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

  if (loading || !found) {
    if (notFoundFlag) {
      notFound();
    }
    return (
      <div className="page-container page-container-md">
        <LoadingSpinner />
      </div>
    );
  }

  const { grade, subject } = found;
  const tri = findTrimestre(lessons, trimestreId);

  if (!tri) {
    notFound();
  }

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

  return (
    <div className="page-container page-container-md">
      <nav className="breadcrumb">
        <Link href="/" className="breadcrumb-link">Accueil</Link>
        <span className="breadcrumb-sep">/</span>
        <Link href={`/grade/${gradeId}`} className="breadcrumb-link">{grade.name}</Link>
        <span className="breadcrumb-sep">/</span>
        <Link href={`/grade/${gradeId}/subject/${subjectId}`} className="breadcrumb-link">
          {subject.name}
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{tri.label}</span>
      </nav>

      <header className="tri-hero">
        <div className="tri-hero-copy">
          <span className={`tri-card-tag tri-card-tag-${tri.tagTone} tri-hero-tag`}>{tri.tag}</span>
          <h1 className="tri-hero-title">
            <span className="tri-card-emoji">{tri.emoji}</span>
            {tri.label}
          </h1>
          <p className="tri-hero-meta">{subject.name} · {grade.name} · {tri.period}</p>
          <p className="tri-hero-sub">
            {tri.lessons.length} leçons à découvrir. Clique sur une leçon pour l'ouvrir 👇
          </p>
        </div>
        <img src={tri.image} alt="" className="tri-hero-image" width={480} height={320} />
      </header>

      <div className="tri-lesson-grid">
        {tri.lessons.map((l, i) => {
          const lessonIndexInSubject = l.order - 1;
          const accessible = canAccessLesson(user, gradeId, lessonIndexInSubject);
          const status = getLessonStatus(l.lessonId);
          const ctaLabel = status === "done" ? "Revoir" : status === "in-progress" ? "Continuer" : "Ouvrir la leçon";
          const number = String(tri.offset + i + 1).padStart(2, "0");

          const cardInner = (
            <>
              <div className="tri-lesson-card-top">
                <span className={`tri-lesson-number tri-lesson-number-${status}`}>{number}</span>
                <p className="tri-lesson-title">
                  {l.title}
                  {accessible && status === "done" && (
                    <span className="lesson-status-badge lesson-status-badge-done">Terminée</span>
                  )}
                  {accessible && status === "in-progress" && (
                    <span className="lesson-status-badge lesson-status-badge-progress">En cours</span>
                  )}
                </p>
              </div>
              {l.summary && <p className="tri-lesson-summary">{l.summary}</p>}
              <div className="tri-lesson-chips">
                <Chip icon="📖">Résumé</Chip>
                <Chip icon="🎯">3 exercices</Chip>
                <Chip icon="⏱">Test · 10 min</Chip>
              </div>
            </>
          );

          if (!accessible) {
            return (
              <div
                key={l.id}
                className="tri-lesson-card tri-lesson-card-locked"
                role="button"
                aria-disabled="true"
                tabIndex={-1}
              >
                {cardInner}
                <span className="tri-lesson-locked-hint">🔒 Verrouillée</span>
              </div>
            );
          }

          return (
            <Link
              key={l.id}
              href={`/grade/${gradeId}/subject/${subjectId}/lesson/${l.lessonId}`}
              className="tri-lesson-card"
            >
              {cardInner}
              <span className={`tri-lesson-cta tri-lesson-cta-${status}`}>
                <span className="tri-lesson-cta-shimmer" />
                <span className="tri-lesson-cta-label">{ctaLabel}</span>
                <svg viewBox="0 0 20 20" fill="currentColor" className="tri-lesson-cta-icon">
                  <path
                    fillRule="evenodd"
                    d="M7.29 5.21a.75.75 0 011.06-.02l4.25 4.29a.75.75 0 010 1.06l-4.25 4.29a.75.75 0 11-1.06-1.06L11.02 10 7.29 6.27a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}