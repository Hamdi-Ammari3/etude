"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { DB } from "../../../lib/firebaseConfig";
import { ALL_GRADES } from "../../../lib/liveGrades";
import { getSubjectsForGrade } from "../../../lib/liveSubjects";
import LoadingSpinner from "../../components/LoadingSpinner";
import "../../homePage.css";
import "./directGrade.css";

const SHOW_ONLY_AVAILABLE_SUBJECTS = false;

export default function DirectSubjectsPage() {
  const { gradeId } = useParams();
  const grade = ALL_GRADES.find((g) => g.id === gradeId);
  const subjectsForGrade = grade ? getSubjectsForGrade(gradeId) : [];

  const [courseCounts, setCourseCounts] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!grade) return;
    let cancelled = false;

    async function loadCounts() {
      setLoading(true);
      const q = query(
        collection(DB, "courses"),
        where("gradeId", "==", gradeId),
        where("status", "==", "active")
      );
      const snap = await getDocs(q);
      if (cancelled) return;

      const counts = new Map();
      snap.docs.forEach((d) => {
        const subjectId = d.data().subjectId;
        counts.set(subjectId, (counts.get(subjectId) || 0) + 1);
      });
      setCourseCounts(counts);
      setLoading(false);
    }

    loadCounts();
    return () => {
      cancelled = true;
    };
  }, [grade, gradeId]);

  // Grade lookup is synchronous (static list), so this can resolve
  // immediately without a loading gate — only the course-count fetch
  // above needs one.
  if (!grade) {
    notFound();
  }

  return (
    <div className="home-page">
    <div className="dgrade-page">
      <Link href="/direct" className="dgrade-back-link">
        ← Tous les niveaux
      </Link>

      <h1 className="dgrade-title">
        {grade.emoji} {grade.name} — choisis ta matière
      </h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="dgrade-subject-grid">
          {subjectsForGrade.filter((s) => !SHOW_ONLY_AVAILABLE_SUBJECTS || courseCounts.has(s.id)).map((s) => {
            const count = courseCounts.get(s.id) || 0;
            return (
              <Link key={s.id} href={`/direct/${gradeId}/${s.id}`} className="dgrade-subject-card">
                <span className="dgrade-subject-emoji">{s.emoji}</span>
                <span className="dgrade-subject-label">{s.name}</span>
                <span className={`dgrade-subject-count ${count > 0 ? "dgrade-subject-count-available" : ""}`}>
                  {count > 0 ? `${count} cours disponible${count > 1 ? "s" : ""}` : "Bientôt disponible"}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
    </div>
  );
}