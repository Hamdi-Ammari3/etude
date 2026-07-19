"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { findGrade, findSubjectsForGrade } from "../../../lib/curriculum";
import { useUser } from "../../../lib/auth";
import { isGradeUnlocked } from "../../../lib/access";
import { getLocalProgress, subjectProgress, gradeProgress } from "../../../lib/progress";
import ProgressBar from "../../components/ProgressBar";
import "../../style.css";

export default function GradePage() {
  const { gradeId } = useParams();
  const { user, hydrated: userHydrated } = useUser();

  const [found, setFound] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const gradeResult = await findGrade(gradeId);

      if (cancelled) return;

      if (!gradeResult) {
        setNotFoundFlag(true);
        setLoading(false);
        return;
      }

      const subjectsResult = await findSubjectsForGrade(gradeId);
      if (cancelled) return;

      setFound(gradeResult);
      setSubjects(subjectsResult);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [gradeId]);

  if (notFoundFlag) {
    notFound();
  }

  if (loading || !found) {
    return (
      <div className="page-container">
        <p className="loading-text">Chargement...</p>
      </div>
    );
  }

  const { level, grade } = found;
  const progress = userHydrated ? (user ? user.progress || {} : getLocalProgress()) : {};
  const overall = gradeProgress(
    progress,
    gradeId,
    subjects.map((s) => ({ subjectId: s.subjectId, lessonCount: s.lessonCount }))
  );
  const unlocked = isGradeUnlocked(user, gradeId);

  return (
    <div className="page-container">
      <nav className="breadcrumb">
        <Link href="/" className="breadcrumb-link">
          Accueil
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span>{level.name}</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{grade.name}</span>
      </nav>

      <header className="grade-header">
        <div>
          <p className="eyebrow">{level.name}</p>
          <h1 className="grade-header-title">{grade.name}</h1>
          <p className="grade-header-subtitle">
            Choisissez la matière que vous souhaitez réviser.
          </p>
        </div>
        <div className="grade-header-progress">
          <p className="progress-label">Progression globale</p>
          <ProgressBar value={overall} />
        </div>
      </header>

      {
        /*
         {!unlocked && (
        <div className="unlock-banner">
          <div>
            <p className="unlock-banner-title">Classe verrouillée</p>
            <p className="unlock-banner-text">
              Vous avez accès à la première leçon de chaque matière gratuitement.
              Débloquez la classe {grade.name} pour accéder à toutes les leçons, exercices et tests.
            </p>
          </div>
          <Link href={`/grade/${gradeId}/unlock`} className="btn btn-primary">
            Débloquer cette classe
          </Link>
        </div>
      )}
         */
      }
      
      <section className="subject-grid">
        {subjects.map((subject) => {
          const p = subjectProgress(progress, gradeId, subject.subjectId, subject.lessonCount);
          return (
            <Link
              key={subject.id}
              href={`/grade/${gradeId}/subject/${subject.subjectId}`}
              className="subject-card"
            >
              <div className="subject-card-top">
                <span className="subject-icon">{subject.icon}</span>
                <div className="subject-card-info">
                  <p className="subject-name">{subject.name}</p>
                  <p className="subject-lessons-count">{subject.lessonCount} leçons</p>
                </div>
              </div>
              <div className="subject-progress">
                <ProgressBar value={p} size="sm" />
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}