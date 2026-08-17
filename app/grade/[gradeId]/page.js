"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { findGrade, findSubjectsForGrade } from "../../../lib/curriculum";
import { useUser } from "../../../lib/auth";
import { isGradeUnlocked } from "../../../lib/access";
import { getLocalProgress, subjectProgress, gradeProgress } from "../../../lib/progress";
import ProgressBar from "../../components/ProgressBar";
import LoadingSpinner from "../../components/LoadingSpinner";
import "../../homePage.css";
import "./gradeStyle.css";

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

const SUBJECT_EMOJIS = {
  maths: "➗",
  physique: "🔬",
  francais: "🇫🇷",
  arabe: "📜",
  anglais: "🗣️",
};

function getSubjectEmoji(subject) {
  return SUBJECT_EMOJIS[subject.subjectId] || subject.icon || "📚";
}

const SUBJECT_ORDER = ["maths", "arabe", "francais", "anglais","physique"];

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
      <div className="loading-page">
        <LoadingSpinner />
      </div>
    );
  }

  const { grade } = found;
  const progress = userHydrated ? (user ? user.progress || {} : getLocalProgress()) : {};
  const overall = gradeProgress(
    progress,
    gradeId,
    subjects.map((s) => ({ subjectId: s.subjectId, lessonCount: s.lessonCount }))
  );
  const unlocked = isGradeUnlocked(user, gradeId);
  const gradeEmoji = getGradeEmoji(grade);

  return (
    <div className="home-page">
    <div className="grd-page">
      <Link href="/lecons" className="grd-back-link">
        ← Tous les niveaux
      </Link>

      <h1 className="grd-title">
        {gradeEmoji} {grade.name} — choisis ta matière
      </h1>

      {overall > 0 && (
        <div className="grd-overall-progress">
          <span className="grd-overall-label">Progression globale</span>
          <ProgressBar value={overall} size="sm" />
        </div>
      )}

      <div className="grd-subject-grid">
        {sortSubjectsByFixedOrder(subjects).map((subject) => {
          const p = subjectProgress(progress, gradeId, subject.subjectId, subject.lessonCount);
          const isStarted = p > 0;
          const emoji = getSubjectEmoji(subject);
          return (
            <Link key={subject.id} href={`/grade/${gradeId}/subject/${subject.subjectId}`} className="grd-subject-card">
              <span className="grd-subject-emoji">{emoji}</span>
              <span className="grd-subject-label">{subject.name}</span>
              {isStarted && (
                <div className="grd-subject-progress">
                  <ProgressBar value={p} size="sm" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
    </div>
  );
}