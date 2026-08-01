"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { findSubject, findLessonsForSubject } from "../../../../../lib/curriculum";
import { trimestreGroups } from "../../../../../lib/trimestres";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import "../../../../style.css";
import "../Subjectstyle.css";

function Stat({ label, value }) {
  return (
    <div className="stat">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

export default function SubjectPage() {
  const { gradeId, subjectId } = useParams();

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

  if (notFoundFlag) {
    notFound();
  }

  if (loading || !found) {
    return (
      <div className="page-container page-container-md">
        <LoadingSpinner />
      </div>
    );
  }

  const { level, grade, subject } = found;
  const total = lessons.length;
  const groups = trimestreGroups(lessons);

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
            <p className="lessons-subtitle">Choisis ton trimestre pour découvrir les leçons 🎒</p>
          </div>
        </div>
        <div className="lessons-stats">
          <Stat label="Leçons" value={String(total)} />
          <Stat label="Exercices" value={String(total * 3)} />
          <Stat label="Tests" value={String(total)} />
        </div>
      </header>

      <section className="tri-grid">
        {groups.map((g) => (
          <Link
            key={g.id}
            href={`/grade/${gradeId}/subject/${subjectId}/trimestre/${g.id}`}
            className="tri-card"
          >
            <div className="tri-card-image-wrap">
              <img
                src={g.image}
                alt=""
                className="tri-card-image"
                width={400}
                height={260}
              />
              <span className={`tri-card-tag tri-card-tag-${g.tagTone}`}>{g.tag}</span>
            </div>

            <div className="tri-card-body">
              <p className="tri-card-label">
                <span className="tri-card-emoji">{g.emoji}</span>
                {g.label}
              </p>
              <p className="tri-card-period">{g.period}</p>
              <p className="tri-card-meta">
                {g.lessons.length} leçons · {g.lessons.length * 3} exercices · {g.lessons.length} tests
              </p>

              <span className="tri-card-cta">
                Voir les leçons
                <svg viewBox="0 0 20 20" fill="currentColor" className="tri-card-cta-icon">
                  <path
                    fillRule="evenodd"
                    d="M7.29 5.21a.75.75 0 011.06-.02l4.25 4.29a.75.75 0 010 1.06l-4.25 4.29a.75.75 0 11-1.06-1.06L11.02 10 7.29 6.27a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="custom-exam-card">
        <div className="custom-exam-card-info">
          <p className="custom-exam-badge">✨ Examen à la demande</p>
          <h2 className="custom-exam-title">Créez un examen sur mesure en 1 minute</h2>
          <p className="custom-exam-text">
            Choisissez les leçons que vous voulez réviser et obtenez un examen personnalisé, avec la
            correction que vous affichez seulement quand vous le souhaitez.
          </p>
        </div>
        <Link
          href={`/grade/${gradeId}/subject/${subjectId}/examen`}
          className="custom-exam-cta"
        >
          <span className="custom-exam-cta-shimmer" />
          <span className="custom-exam-cta-label">Créer mon examen →</span>
        </Link>
      </section>
    </div>
  );
}