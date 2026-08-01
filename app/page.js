"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLevelsWithGrades, getAllSubjectsByGrade } from "../lib/curriculum";
import { useUser } from "../lib/auth";
import { getLocalProgress, gradeProgress } from "../lib/progress";
import ProgressBar from "./components/ProgressBar";
import LoadingSpinner from './components/LoadingSpinner';
import "./homePage.css";
//import './style.css';

// Maps a level to its illustration + color wash. Add an `images/level-*.jpg`
// and a case here for any future level (e.g. lycée) — falls back to a
// plain color wash with no image if nothing matches.
function getLevelVisual(level) {
  const id = (level.id || "").toLowerCase();
  const name = (level.name || "").toLowerCase();
  if (id.includes("prim") || name.includes("primaire")) {
    return { image: "/level-primaire.jpg", wash: "home-wash-blue" };
  }
  if (id.includes("coll") || name.includes("collège") || name.includes("college")) {
    return { image: "/level-college.jpg", wash: "home-wash-coral" };
  }
  return { image: null, wash: "home-wash-blue" };
}

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

  function getGradeProgress(gradeId) {
    const subjects = subjectsByGrade.get(gradeId);
    if (!subjects || subjects.length === 0) return 0;
    return gradeProgress(progress, gradeId, subjects);
  }

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-blob" aria-hidden="true" />
        <span className="home-hero-star home-hero-star-1" aria-hidden="true">★</span>
        <span className="home-hero-star home-hero-star-2" aria-hidden="true">★</span>
        <span className="home-hero-star home-hero-star-3" aria-hidden="true">★</span>

        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <span className="home-hero-badge">🎒 Pour les élèves tunisiens</span>
            <h1 className="home-hero-title">
              Réviser devient <em>un jeu d'enfant.</em>
            </h1>
            <p className="home-hero-sub">
              Des leçons illustrées, des exercices ludiques et des tests chronométrés pour
              toutes les classes, du primaire au collège. Choisissez une classe et c'est parti.
            </p>
            <a href="#niveaux" className="home-hero-cta">
              Choisir ma classe
              <svg viewBox="0 0 20 20" fill="currentColor" className="home-hero-cta-icon">
                <path
                  fillRule="evenodd"
                  d="M7.29 5.21a.75.75 0 011.06-.02l4.25 4.29a.75.75 0 010 1.06l-4.25 4.29a.75.75 0 11-1.06-1.06L11.02 10 7.29 6.27a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <img
            src='./hero-kids.jpg'
            alt="Deux enfants qui apprennent en s'amusant sur une tablette"
            className="home-hero-image"
            width={640}
            height={480}
          />
        </div>
      </section>

      
      {/* Continue where you left off 
      {hydrated && startedGradeIds.length > 0 && (
        <section className="home-continue">
          <h2 className="home-section-eyebrow">Continuer là où vous en êtes</h2>
          <div className="home-continue-grid">
            {startedGradeIds.slice(0, 6).map((gradeId) => {
              const level = levels.find((l) => l.grades.some((g) => g.id === gradeId));
              const grade = level?.grades.find((g) => g.id === gradeId);
              if (!level || !grade) return null;
              const p = getGradeProgress(gradeId);
              const pct = Math.round(p * 100);
              return (
                <Link key={gradeId} href={`/grade/${gradeId}`} className="home-continue-card">
                  <div className="home-continue-card-top">
                    <p className="home-continue-level">{level.name}</p>
                    <p className="home-continue-grade">{grade.name}</p>
                  </div>
                  <div className="home-continue-progress-row">
                    <ProgressBar value={p} showLabel={false} size="sm" />
                    <span className="home-continue-pct">{pct}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
      */}

      {/* Levels & grades */}
      <section id="niveaux" className="home-levels">
        <div className="home-levels-header">
          <h2 className="home-levels-title">Choisissez votre niveau</h2>
          <p className="home-levels-sub">Sélectionnez d'abord un cycle, puis votre classe.</p>
        </div>

        {levels.map((level) => {
          const visual = getLevelVisual(level);
          return (
            <div key={level.id} className="home-level-block">
              <div className={`home-level-banner ${visual.wash}`}>
                {visual.image && (
                  <img
                    src={visual.image}
                    alt=""
                    className="home-level-banner-img"
                    width={480}
                    height={320}
                  />
                )}
                <div className="home-level-banner-copy">
                  <h3 className="home-level-name">{level.name}</h3>
                  {level.description && <p className="home-level-desc">{level.description}</p>}
                  <span className="home-level-count">{level.grades.length} classes</span>
                </div>
              </div>

              <div className="home-grade-grid">
                {level.grades.map((grade) => {
                  const isStarted = startedGradeIds.includes(grade.id);
                  const isPurchased = purchasedGrades.includes(grade.id);
                  const p = hydrated ? getGradeProgress(grade.id) : 0;
                  return (
                    <Link
                      key={grade.id}
                      href={`/grade/${grade.id}`}
                      className={`home-grade-card ${isPurchased ? "home-grade-card-purchased" : ""}`}
                    >
                      <div className="home-grade-card-top">
                        <p className="home-grade-name">{grade.name}</p>
                        {isPurchased ? (
                          <span className="home-badge home-badge-purchased">✓ Acheté</span>
                        ) : (
                          isStarted && <span className="home-badge home-badge-progress">En cours</span>
                        )}
                      </div>
                      {isStarted && (
                        <div className="home-grade-card-progress">
                          <ProgressBar value={p} size="sm" />
                        </div>
                      )}
                      <span className="home-grade-cta">
                        Explorer
                        <svg viewBox="0 0 20 20" fill="currentColor" className="home-grade-cta-icon">
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
        })}
      </section>
    </div>
  );
}