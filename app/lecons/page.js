"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLevelsWithGrades, getAllSubjectsByGrade } from "../../lib/curriculum";
import { useUser } from "../../lib/auth";
import { getLocalProgress, gradeProgress } from "../../lib/progress";
import ProgressBar from "../components/ProgressBar";
import LoadingSpinner from "../components/LoadingSpinner";
import "../homePage.css";
import "./leconsPage.css";

// One emoji per grade, matching the specific mascot chosen for each class.
// Falls back to a generic book if a new grade is added before this map is
// updated (e.g. a future lycée grade).
function getGradeEmoji(grade) {
  const id = (grade.id || "").toLowerCase();
  const map = {
    "prim-4": "🐬",
    "prim-5": "🦁",
    "prim-6": "🚀",
    "col-7": "📘",
    "col-8": "🔬",
    "col-9": "📐",
  };
  return map[id] || "📘";
}

export default function LeconsPage() {
  const { user, hydrated: userHydrated } = useUser();
  const [levels, setLevels] = useState([]);
  const [subjectsByGrade, setSubjectsByGrade] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getLevelsWithGrades(), getAllSubjectsByGrade()]).then(([levelsResult, subjectsResult]) => {
      if (!cancelled) {
        setLevels(levelsResult);
        setSubjectsByGrade(subjectsResult);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const hydrated = userHydrated && !loading;
  const progress = hydrated ? (user ? user.progress || {} : getLocalProgress()) : {};
  const purchasedGrades = user?.purchasedGrades || [];

  const startedGradeIds = hydrated
    ? Object.keys(progress).filter((gId) => progress[gId] && Object.keys(progress[gId]).length > 0)
    : [];

  function getGradeProgress(gradeId) {
    const subjects = subjectsByGrade.get(gradeId);
    if (!subjects || subjects.length === 0) return 0;
    return gradeProgress(progress, gradeId, subjects);
  }

  if (loading) {
    return (
      <div className="loading-page">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="lecons-header">
        <p className="lecons-eyebrow">Leçons &amp; exercices 📚</p>
        <h1 className="lecons-title">Choisis ton niveau</h1>
        <p className="lecons-sub">Résumés de cours et exercices corrigés à réviser.</p>
      </div>

      {levels.map((level) => (
        <section key={level.id} className="lecons-level-section">
          <h2 className="lecons-level-heading">{level.name}</h2>
          <div className="lecons-grade-grid">
            {level.grades.map((grade) => {
              const isStarted = startedGradeIds.includes(grade.id);
              const isPurchased = purchasedGrades.includes(grade.id);
              const p = hydrated ? getGradeProgress(grade.id) : 0;
              const emoji = getGradeEmoji(grade);
              return (
                <Link
                  key={grade.id}
                  href={`/grade/${grade.id}`}
                  className={`lecons-grade-card ${isPurchased ? "lecons-grade-card-purchased" : ""}`}
                >
                  {isPurchased ? (
                    <span className="lecons-grade-badge lecons-grade-badge-purchased">✓</span>
                  ) : (
                    isStarted && <span className="lecons-grade-badge lecons-grade-badge-progress">En cours</span>
                  )}
                  <div className="lecons-grade-card-row">
                    <span className="lecons-grade-icon">{emoji}</span>
                    <span className="lecons-grade-label">{grade.name}</span>
                  </div>
                  {isStarted && <ProgressBar value={p} size="sm" />}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}