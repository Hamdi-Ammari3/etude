"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { DB, auth } from "../../lib/firebaseConfig";
import { logoutUser, useUser } from "../../lib/auth";
import { getLevelsWithGrades } from "../../lib/curriculum";
import { ALL_SUBJECTS } from "../../lib/liveSubjects";
import MonthCalendar from "../components/MonthCalendar";
import LoadingSpinner from "../components/LoadingSpinner";
import "../homePage.css";
import "./profil.css";

// Same small per-grade emoji map used on /lecons — duplicated locally
// since there's no shared module for it yet across these two pages.
function getGradeEmoji(gradeId) {
  const map = {
    "prim-4": "🐬",
    "prim-5": "🦁",
    "prim-6": "🚀",
    "col-7": "📘",
    "col-8": "🔬",
    "col-9": "📐",
  };
  return map[gradeId] || "📘";
}

function getInitial(name) {
  return name?.trim()?.[0]?.toUpperCase() || "?";
}

function getSubjectEmoji(subjectId) {
  return ALL_SUBJECTS.find((s) => s.id === subjectId)?.emoji || "📚";
}

// What the "join session" button shows/allows, based on real status —
// there's no live video room built yet, so even the "enabled" state
// below leads to an honest placeholder, not a fake working link.
function getSessionJoinState(status) {
  if (status === "started") return { canJoin: true, label: "Rejoindre la séance" };
  if (status === "finished") return { canJoin: false, label: "Terminée" };
  return { canJoin: false, label: "Pas encore commencée" };
}

export default function ProfilePage() {
  const { user, hydrated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.push("/login");
  }, [hydrated, user, router]);

  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [ownedGrades, setOwnedGrades] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [cancelMsg, setCancelMsg] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [cancellingCourseId, setCancellingCourseId] = useState(null);
  const [prolongingCourseId, setProlongingCourseId] = useState(null);

  // Which calendar day is currently selected (its "YYYY-MM-DD" key), and
  // the message shown when someone taps the (placeholder) join button.
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [joinSessionMsg, setJoinSessionMsg] = useState(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function loadSessions() {
      setSessionsLoading(true);
      const q = query(collection(DB, "sessions"), where("studentId", "==", user.uid));
      const snap = await getDocs(q);
      if (cancelled) return;
      setSessions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setSessionsLoading(false);
    }
    loadSessions();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function loadGrades() {
      setGradesLoading(true);
      const levels = await getLevelsWithGrades();
      if (cancelled) return;
      const allGrades = levels.flatMap((l) => l.grades);
      const owned = (user.purchasedGrades || [])
        .map((gid) => allGrades.find((g) => g.id === gid))
        .filter(Boolean);
      setOwnedGrades(owned);
      setGradesLoading(false);
    }
    loadGrades();
    return () => {
      cancelled = true;
    };
  }, [user?.purchasedGrades]);

  function handleLogout() {
    logoutUser();
    router.push("/");
  }

  async function handleProlongClick(courseId, teacherName, monthlyPrice) {
    setCancelMsg(null);
    setCancelError(null);

    const currentBalance = Number(user.balance) || 0;
    const price = Number(monthlyPrice) || 0;
    if (currentBalance < price) {
      setCancelError("Solde insuffisant. Rechargez ton compte pour prolonger cet abonnement.");
      return;
    }

    setProlongingCourseId(courseId);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/courses/prolong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCancelError(data.error || "Une erreur est survenue.");
        return;
      }

      setCancelMsg(
        `Abonnement prolongé ! ${data.sessionCount} séance${data.sessionCount > 1 ? "s" : ""} de plus réservée${
          data.sessionCount > 1 ? "s" : ""
        } avec ${teacherName} 🎉`
      );

      setSessions((prev) => {
        const template = prev.find((s) => s.courseId === courseId);
        if (!template) return prev;
        const newEntries = (data.sessionDates || []).map((date, i) => ({
          ...template,
          id: `local-${courseId}-${i}-${date}`,
          date,
          status: "subscribed",
          payed: true,
        }));
        return [...prev, ...newEntries];
      });
    } catch (err) {
      console.error(err);
      setCancelError("Connexion impossible. Vérifiez ton réseau.");
    } finally {
      setProlongingCourseId(null);
    }
  }

  async function handleCancelClick(courseId, teacherName) {
    setCancelMsg(null);
    setCancelError(null);

    const confirmed = window.confirm(
      `Voulez-vous vraiment quitter ce cours avec ${teacherName} ? Les séances à venir non commencées seront remboursées sur votre solde.`
    );
    if (!confirmed) return;

    setCancellingCourseId(courseId);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/courses/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCancelError(data.error || "Une erreur est survenue.");
        return;
      }

      setCancelMsg(
        data.refundAmount > 0
          ? `Abonnement annulé. ${data.refundAmount} DT ont été remboursés sur ton solde.`
          : "Abonnement annulé. Aucune séance à venir n'a été trouvée à rembourser."
      );

      setSessions((prev) =>
        prev.map((s) => (s.courseId === courseId && s.status === "subscribed" ? { ...s, status: "cancelled" } : s))
      );
    } catch (err) {
      console.error(err);
      setCancelError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setCancellingCourseId(null);
    }
  }

  function handleDayClick(dateKey) {
    setJoinSessionMsg(null);
    setSelectedDateKey(dateKey);
  }

  function handleJoinSessionClick(session) {
    if (!session.liveRoomId) {
      setJoinSessionMsg("Cette séance n'a pas encore démarré côté enseignant.");
      return;
    }
    router.push(`/room/${session.liveRoomId}`);
  }

  if (!hydrated || !user) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  const sessionsByCourse = new Map();
  for (const s of sessions) {
    if (s.status !== "subscribed") continue;
    if (!sessionsByCourse.has(s.courseId)) sessionsByCourse.set(s.courseId, []);
    sessionsByCourse.get(s.courseId).push(s);
  }

  const myCourses = Array.from(sessionsByCourse.entries()).map(([courseId, list]) => {
    const sorted = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    return {
      courseId,
      teacherName: first.teacherName,
      subjectId: first.subjectId,
      subjectName: first.subjectName,
      gradeName: first.gradeName,
      specializationName: first.specializationName,
      monthlyPrice: first.monthlyPrice,
      dueDate: last.date,
      sessionDates: sorted.map((s) => s.date),
    };
  });

  const monthlyTotal = myCourses.reduce((sum, c) => sum + (c.monthlyPrice || 0), 0);

  const nonCancelledSessions = sessions.filter((s) => s.status !== "cancelled");

  const calendarEvents = nonCancelledSessions.map((s) => ({
    date: s.date.slice(0, 10),
    title: `${s.subjectName || "Séance"} · ${s.teacherName || ""}`,
  }));

  const selectedDaySessions = selectedDateKey
    ? nonCancelledSessions
        .filter((s) => s.date.slice(0, 10) === selectedDateKey)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  return (
    <div className="home-page">
    <div className="profil-page">
      <div className="profil-header-card">
        <span className="profil-avatar">{getInitial(user.name)}</span>
        <div className="profil-header-info">
          <h1 className="profil-name">{user.name}</h1>
          <p className="profil-phone">📱 +216 {user.phone}</p>
        </div>
        <div className="profil-balance-box">
          <p className="profil-balance-label">Mon solde</p>
          <p className="profil-balance-value">{user.balance ?? 0} DT</p>
        </div>
        <button type="button" onClick={handleLogout} className="profil-logout-btn">
          Se déconnecter
        </button>
      </div>

      <section className="profil-section">
        <div className="profil-section-header">
          <h2 className="profil-section-title">🎥 Mes cours en direct</h2>
          {myCourses.length > 0 && <span className="profil-total-badge">Total : {monthlyTotal} DT / mois</span>}
        </div>

        {sessionsLoading ? (
          <LoadingSpinner />
        ) : myCourses.length === 0 ? (
          <div className="profil-empty-box">
            <p className="profil-empty-text">Tu n'es abonné à aucun cours pour l'instant.</p>
            <Link href="/direct" className="profil-empty-cta profil-empty-cta-primary">
              Découvrir les cours
            </Link>
          </div>
        ) : (
          <ul className="profil-course-list">
            {myCourses.map((c) => (
              <li key={c.courseId} className="profil-course-card">
                <div className="profil-course-head">
                  <span className="profil-course-avatar">{getSubjectEmoji(c.subjectId)}</span>
                  <div className="profil-course-head-info">
                    <p className="profil-course-name">
                      {c.subjectName} — {c.teacherName}
                      {c.specializationName ? ` (${c.specializationName})` : ""}
                    </p>
                    <p className="profil-course-grade">{c.gradeName}</p>
                  </div>
                </div>

                <p className="profil-course-due">
                  Abonnement valable jusqu'au{" "}
                  <strong>
                    {new Date(c.dueDate).toLocaleString("fr-TN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                </p>

                <div className="profil-course-sessions-box">
                  <p className="profil-course-sessions-label">Séances réservées</p>
                  <ul className="profil-course-sessions-list">
                    {c.sessionDates.map((date, i) => (
                      <li key={i} className="profil-course-session-chip">
                        {new Date(date).toLocaleString("fr-TN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="profil-course-footer">
                  <span className="profil-course-price">{c.monthlyPrice} DT / mois</span>
                  <div className="profil-course-actions">
                    <button
                      type="button"
                      onClick={() => handleProlongClick(c.courseId, c.teacherName, c.monthlyPrice)}
                      disabled={prolongingCourseId === c.courseId}
                      className="profil-prolong-btn"
                    >
                      {prolongingCourseId === c.courseId ? "Prolongation..." : "Prolonger"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelClick(c.courseId, c.teacherName)}
                      disabled={cancellingCourseId === c.courseId}
                      className="profil-cancel-btn"
                    >
                      {cancellingCourseId === c.courseId ? "Annulation..." : "Quitter le cours"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {cancelMsg && <p className="profil-cancel-msg">{cancelMsg}</p>}
        {cancelError && <p className="profil-cancel-error">{cancelError}</p>}
      </section>

      <section className="profil-section">
        <h2 className="profil-section-title">📚 Mes documents</h2>
        {gradesLoading ? (
          <LoadingSpinner />
        ) : ownedGrades.length === 0 ? (
          <div className="profil-empty-box">
            <p className="profil-empty-text">Tu n'as encore acheté aucun niveau de documents.</p>
            <Link href="/lecons" className="profil-empty-cta profil-empty-cta-coral">
              Voir les leçons &amp; exercices
            </Link>
          </div>
        ) : (
          <div className="profil-grade-grid">
            {ownedGrades.map((g) => (
              <Link key={g.id} href={`/grade/${g.id}`} className="profil-grade-card">
                <span className="profil-grade-emoji">{getGradeEmoji(g.id)}</span>
                <div>
                  <p className="profil-grade-name">{g.name}</p>
                  <p className="profil-grade-hint">Leçons et exercices corrigés débloqués</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="profil-section">
        <h2 className="profil-section-title">🗓️ Mon calendrier</h2>
        <p className="profil-calendar-hint">Clique sur un jour pour voir le détail de tes séances.</p>
        <div className="profil-calendar-wrap">
          <MonthCalendar
            events={calendarEvents}
            emptyMessage="Aucune séance programmée ce mois-ci."
            onDayClick={handleDayClick}
            selectedDateKey={selectedDateKey}
          />
        </div>

        {selectedDateKey && (
          <div className="profil-day-panel">
            <div className="profil-day-panel-header">
              <p className="profil-day-panel-title">
                {new Date(`${selectedDateKey}T00:00:00`).toLocaleDateString("fr-TN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <button
                type="button"
                onClick={() => setSelectedDateKey(null)}
                className="profil-day-panel-close"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {selectedDaySessions.length === 0 ? (
              <p className="profil-day-panel-empty">Aucune séance ce jour-là.</p>
            ) : (
              <ul className="profil-day-session-list">
                {selectedDaySessions.map((s) => {
                  const { canJoin, label } = getSessionJoinState(s.status);
                  return (
                    <li key={s.id} className="profil-day-session-card">
                      <div className="profil-day-session-info">
                        <p className="profil-day-session-subject">
                          {getSubjectEmoji(s.subjectId)} {s.subjectName}
                        </p>
                        <p className="profil-day-session-meta">
                          {s.teacherName} ·{" "}
                          {new Date(s.date).toLocaleString("fr-TN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={!canJoin}
                        onClick={() => handleJoinSessionClick(s)}
                        className="profil-day-session-join-btn"
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {joinSessionMsg && <p className="profil-day-panel-msg">{joinSessionMsg}</p>}
          </div>
        )}
      </section>
    </div>
    </div>
  );
}