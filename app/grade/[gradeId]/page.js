"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { findGrade, findSubjectsForGrade } from "../../../lib/curriculum";
import { useUser } from "../../../lib/auth";
import { isGradeUnlocked } from "../../../lib/access";
import { getLocalProgress, subjectProgress, gradeProgress } from "../../../lib/progress";
import ProgressBar from "../../components/ProgressBar";
import LoadingSpinner from '../../components/LoadingSpinner';
import './gradeStyle.css';

const SUBJECT_VISUALS = {
  maths: { image: "/subject-math.jpg", accent: "#2F6FED" },
  physique: { image: "/subject-sciences.jpg", accent: "#2F6FED" },
  francais: { image: "/subject-francais.jpg", accent: "#2F6FED" },
  arabe: { image: "/subject-arabe.jpg", accent: "#2F6FED" },
  anglais: { image: "/subject-anglais.jpg", accent: "#2F6FED" },
};

function getSubjectVisual(subjectId) {
  return SUBJECT_VISUALS[subjectId] || { image: null, accent: "#2F6FED" };
}

// Fixed display order: maths, physique, arabe, francais, anglais — left to
// right on desktop, and since the grid collapses to one column on mobile,
// this same order reads top to bottom there too. Any subject not listed
// here (shouldn't normally happen) is pushed to the end rather than
// breaking the sort.
const SUBJECT_ORDER = ["maths", "physique", "arabe", "francais", "anglais"];

function sortSubjectsByFixedOrder(subjects) {
  return [...subjects].sort((a, b) => {
    const indexA = SUBJECT_ORDER.indexOf(a.subjectId);
    const indexB = SUBJECT_ORDER.indexOf(b.subjectId);
    const rankA = indexA === -1 ? SUBJECT_ORDER.length : indexA;
    const rankB = indexB === -1 ? SUBJECT_ORDER.length : indexB;
    return rankA - rankB;
  });
}

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
        <LoadingSpinner />
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
    <div className="page-container subj-page">
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

      <section className="subj-grid">
        {sortSubjectsByFixedOrder(subjects).map((subject) => {
          const p = subjectProgress(progress, gradeId, subject.subjectId, subject.lessonCount);
          const visual = getSubjectVisual(subject.subjectId);
          return (
            <Link
              key={subject.id}
              href={`/grade/${gradeId}/subject/${subject.subjectId}`}
              className="subj-card"
              style={{ "--subj-accent": visual.accent }}
            >
              <div className="subj-card-image-wrap">
                {visual.image ? (
                  <img
                    src={visual.image}
                    alt=""
                    className="subj-card-image"
                    width={400}
                    height={260}
                  />
                ) : (
                  <span className="subj-card-fallback-icon">{subject.icon}</span>
                )}
              </div>

              <div className="subj-card-body">
                <p className="subj-card-name">{subject.name}</p>
                <p className="subj-card-meta">{subject.lessonCount} leçons · exercices et tests</p>

                <div className="subj-card-progress">
                  <ProgressBar value={p} size="sm" />
                </div>

                <span className="subj-card-cta">
                  Réviser cette matière
                  <svg viewBox="0 0 20 20" fill="currentColor" className="subj-card-cta-icon">
                    <path
                      fillRule="evenodd"
                      d="M7.29 5.21a.75.75 0 011.06-.02l4.25 4.29a.75.75 0 010 1.06l-4.25 4.29a.75.75 0 11-1.06-1.06L11.02 10 7.29 6.27a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}