"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLevelsWithGrades, getAllSubjectsByGrade } from "../lib/curriculum";
import { useUser } from "../lib/auth";
import { getLocalProgress, gradeProgress } from "../lib/progress";
import ProgressBar from "./components/ProgressBar";
import LoadingSpinner from './components/LoadingSpinner';
import "./style.css";

export default function HomePage() {
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

  // A grade counts as "started" if the progress map has any entry for it at all.
  const startedGradeIds = hydrated ? Object.keys(progress).filter((gId) => progress[gId] && Object.keys(progress[gId]).length > 0) : [];

  function findGradeInLevels(gradeId) {
    for (const level of levels) {
      const grade = level.grades.find((g) => g.id === gradeId);
      if (grade) return { level, grade };
    }
    return null;
  }

  function getGradeProgress(gradeId) {
    const subjects = subjectsByGrade.get(gradeId);
    if (!subjects || subjects.length === 0) return 0;
    return gradeProgress(progress, gradeId, subjects);
  }

  return (
    <div className="page-container">

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {hydrated && startedGradeIds.length > 0 && (
            <section className="continue-section">
              <h2 className="section-label">Continuer là où vous en êtes</h2>
              <div className="continue-grid">
                {startedGradeIds.slice(0, 6).map((gradeId) => {
                  const found = findGradeInLevels(gradeId);
                  if (!found) return null;
                  const { level, grade } = found;
                  const p = getGradeProgress(gradeId);
                  const isPurchased = purchasedGrades.includes(gradeId);
                  return (
                    <Link
                      key={gradeId}
                      href={`/grade/${gradeId}`}
                      className={`continue-card ${isPurchased ? "continue-card-purchased" : ""}`}
                    >
                      <div className="continue-card-top">
                        <div>
                          <p className="continue-level-name">{level.name}</p>
                          <p className="continue-grade-name">{grade.name}</p>
                        </div>
                        {isPurchased && <span className="badge-purchased">✓ Acheté</span>}
                      </div>
                      <div className="continue-card-progress">
                        <ProgressBar value={p} size="sm" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="levels-section">
            <div>
              <h2 className="levels-title">Choisissez votre niveau</h2>
              <p className="levels-subtitle">Sélectionnez d'abord un cycle, puis votre classe.</p>
            </div>

            {levels.map((level) => (
              <div key={level.id} className="level-block">
                <div className="level-header">
                  <div>
                    <h3 className="level-name">{level.name}</h3>
                  </div>
                  <span className="level-count">{level.grades.length} classes</span>
                </div>
                <div className="grade-grid">
                  {level.grades.map((grade) => {
                    const isStarted = startedGradeIds.includes(grade.id);
                    const isPurchased = purchasedGrades.includes(grade.id);
                    const p = hydrated ? getGradeProgress(grade.id) : 0;
                    return (
                      <Link
                        key={grade.id}
                        href={`/grade/${grade.id}`}
                        className={`grade-card ${isPurchased ? "grade-card-purchased" : ""}`}
                      >
                        <div className="grade-card-top">
                          <div>
                            <p className="grade-level-label">{level.name}</p>
                            <p className="grade-name">{grade.name}</p>
                          </div>
                          {isPurchased ? (
                            <span className="badge-purchased">✓ Acheté</span>
                          ) : (
                            isStarted && <span className="badge-in-progress">En cours</span>
                          )}
                        </div>
                        {isStarted && (
                          <div className="grade-card-progress">
                            <ProgressBar value={p} size="sm" />
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}