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
import "../../Subjectstyle.css";

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
      <div className="loading-page">
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
    <div className="home-page">
    <div className="grd-page">
      <Link href={`/grade/${gradeId}/subject/${subjectId}`} className="subj-back-link">
        ← {subject.name}
      </Link>

      <div className="tri-list-header">
        <span className={`tri-card-tag tri-card-tag-${tri.tagTone} tri-list-tag`}>{tri.tag}</span>
        <h1 className="subj-header-title">
          {tri.emoji} {tri.label}
        </h1>
        <p className="tri-list-meta">
          {subject.name} · {grade.name} · {tri.period}
        </p>
      </div>

      <ul className="tri-lesson-list">
        {tri.lessons.map((l, i) => {
          const lessonIndexInSubject = l.order - 1;
          const accessible = canAccessLesson(user, gradeId, lessonIndexInSubject);
          const status = getLessonStatus(l.lessonId);
          const ctaLabel = status === "done" ? "Revoir" : status === "in-progress" ? "Continuer" : "Ouvrir";
          const number = String(tri.offset + i + 1).padStart(2, "0");

          const rowInner = (
            <>
              <span className={`tri-lesson-row-icon tri-lesson-row-icon-${status}`}>{number}</span>
              <div className="tri-lesson-row-info">
                <p className="tri-lesson-row-title">
                  {l.title}
                  {accessible && status === "done" && (
                    <span className="lesson-status-badge lesson-status-badge-done">Terminée</span>
                  )}
                  {accessible && status === "in-progress" && (
                    <span className="lesson-status-badge lesson-status-badge-progress">En cours</span>
                  )}
                </p>
                <p className="tri-lesson-row-meta">📖 Résumé · 🎯 3 exercices · ⏱ Test 10 min</p>
              </div>
            </>
          );

          if (!accessible) {
            return (
              <li key={l.id}>
                <div className="tri-lesson-row tri-lesson-row-locked" role="button" aria-disabled="true" tabIndex={-1}>
                  {rowInner}
                  <span className="tri-lesson-row-locked-badge">🔒 Verrouillée</span>
                </div>
              </li>
            );
          }

          return (
            <li key={l.id}>
              <Link href={`/grade/${gradeId}/subject/${subjectId}/lesson/${l.lessonId}`} className="tri-lesson-row">
                {rowInner}
                <span className={`tri-lesson-row-cta tri-lesson-row-cta-${status}`}>{ctaLabel}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
    </div>
  );
}