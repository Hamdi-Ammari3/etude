"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams, notFound } from "next/navigation";
import { findSubject, findLessonsForSubject } from "../../../../../../lib/curriculum";
import { useUser } from "../../../../../../lib/auth";
import { auth } from "../../../../../../lib/firebaseConfig";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import AccessRequiredModal from "../../../../../components/AccessRequiredModal";
//import "../../../../../style.css";
import "../../../../../homePage.css";
import "../Subjectstyle.css";
import "./examenPage.css";

const DIFFICULTIES = [
  { id: "facile", label: "Facile" },
  { id: "moyen", label: "Moyen" },
  { id: "difficile", label: "Difficile" },
  { id: "mixte", label: "Mixte" },
];

const DURATIONS = [15, 30, 45, 60];

export default function ExamenPage() {
  const { gradeId, subjectId } = useParams();
  const router = useRouter();
  const { user, hydrated: userHydrated } = useUser();

  const [found, setFound] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  const [selected, setSelected] = useState([]);
  const [difficulty, setDifficulty] = useState("mixte");
  const [duration, setDuration] = useState(30);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [accessModal, setAccessModal] = useState(null); // null | "login" | "upgrade"

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

  if (loading || !found || !userHydrated) {
    return (
      <div className="loading-page">
        <LoadingSpinner />
      </div>
    );
  }

  const { subject } = found;

  const allSelected = lessons.length > 0 && selected.length === lessons.length;

  const toggleLesson = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  async function handleGenerate() {
    setError(null);

    // Logged-out visitors can browse and configure freely — the account
    // requirement only surfaces at the moment they actually try to
    // generate, via the modal, rather than blocking the whole page.
    if (!user) {
      setAccessModal("login");
      return;
    }
    if (selected.length === 0) return;

    setGenerating(true);
    try {
      if (!auth.currentUser) {
        setAccessModal("login");
        setGenerating(false);
        return;
      }

      const idToken = await auth.currentUser.getIdToken();

      const res = await fetch("/api/customExam/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          gradeId,
          subjectId,
          lessonIds: selected,
          difficulty,
          durationMinutes: duration,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setAccessModal("upgrade");
          setGenerating(false);
          return;
        }
        setError(data.error || "Une erreur est survenue. Réessayez.");
        setGenerating(false);
        return;
      }
      router.push(`/grade/${gradeId}/subject/${subjectId}/examen/${data.examId}`);
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau.");
      setGenerating(false);
    }
  }

  return (
    <div className="home-page">
      <div className="grd-page">
      <Link href={`/grade/${gradeId}/subject/${subjectId}`} className="subj-back-link">
        ← {subject.name}
      </Link>

      <header className="exam-header">
        <span className="exam-header-badge">✨ Nouveau · Généré automatiquement</span>
        <h1 className="exam-header-title">Créer mon examen sur mesure</h1>
        <p className="exam-header-sub">
          Choisissez simplement les leçons que vous voulez réviser. Nous préparons un examen de{" "}
          {subject.name} adapté, avec la correction détaillée que vous pourrez afficher quand vous le
          souhaitez.
        </p>
      </header>

      <ol className="exam-steps">
        <StepBadge n={1} label="Choisir les leçons" active />
        <StepBadge n={2} label="Régler l'examen" active />
        <StepBadge n={3} label="Passer l'examen" active={false} />
      </ol>

      <section className="exam-panel">
        <div className="exam-panel-header">
          <div>
            <h2 className="exam-section-title">1. Quelles leçons voulez-vous réviser ?</h2>
            <p className="exam-panel-sub">Cochez une ou plusieurs leçons ci-dessous.</p>
          </div>
          <button
            type="button"
            onClick={() => setSelected(allSelected ? [] : lessons.map((l) => l.lessonId))}
            className="btn-pill btn-pill-outline"
          >
            {allSelected ? "Tout décocher" : "Tout sélectionner"}
          </button>
        </div>

        <div className="exam-lesson-list">
          {lessons.map((l, i) => {
            const checked = selected.includes(l.lessonId);
            return (
              <button
                key={l.lessonId}
                type="button"
                aria-pressed={checked}
                onClick={() => toggleLesson(l.lessonId)}
                className={`exam-lesson-row ${checked ? "exam-lesson-row-checked" : ""}`}
              >
                <span className={`exam-lesson-check ${checked ? "exam-lesson-check-on" : ""}`}>✓</span>
                <span className="exam-lesson-info">
                  <span className="exam-lesson-title">
                    <span className="exam-lesson-number">{String(i + 1).padStart(2, "0")}</span>
                    {l.title}
                  </span>
                  {l.summary && <span className="exam-lesson-summary">{l.summary}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="exam-panel">
        <h2 className="exam-section-title">2. Réglez votre examen</h2>
        <div className="exam-settings-grid">
          <div>
            <p className="exam-settings-label">Niveau de difficulté</p>
            <div className="exam-pill-row">
              {DIFFICULTIES.map((d) => (
                <Pill key={d.id} active={difficulty === d.id} onClick={() => setDifficulty(d.id)}>
                  {d.label}
                </Pill>
              ))}
            </div>
          </div>
          <div>
            <p className="exam-settings-label">Durée de l'examen</p>
            <div className="exam-pill-row">
              {DURATIONS.map((d) => (
                <Pill key={d} active={duration === d} onClick={() => setDuration(d)}>
                  {d} min
                </Pill>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="exam-generate-card">
        <p className="exam-generate-hint">
          {selected.length === 0
            ? "Sélectionnez au moins une leçon pour commencer."
            : `${selected.length} leçon${selected.length > 1 ? "s" : ""} sélectionnée${
                selected.length > 1 ? "s" : ""
              } · ${duration} min`}
        </p>

        {error && <p className="exam-error">{error}</p>}

        <button
          type="button"
          disabled={selected.length === 0 || generating}
          onClick={handleGenerate}
          className="btn-pill btn-pill-primary btn-pill-lg"
        >
          {generating ? "Génération en cours…" : "Générer mon examen"}
        </button>

        {generating && <p className="exam-generating-text">Préparation des questions à partir de vos leçons…</p>}
      </div>

      {accessModal && (
        <AccessRequiredModal variant={accessModal} gradeId={gradeId} onClose={() => setAccessModal(null)} />
      )}
    </div>
    </div>
  );
}

function StepBadge({ n, label, active }) {
  return (
    <li className={`exam-step-badge ${active ? "exam-step-badge-active" : ""}`}>
      <span className="exam-step-number">{n}</span>
      {label}
    </li>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={`exam-pill ${active ? "exam-pill-active" : ""}`}>
      {children}
    </button>
  );
}