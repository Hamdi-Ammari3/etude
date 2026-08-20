"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { DB, auth } from "../../../../lib/firebaseConfig";
import { useUser } from "../../../../lib/auth";
import { ALL_GRADES, GRADES_WITH_SPECIALIZATION, SPECIALIZATIONS } from "../../../../lib/liveGrades";
import { ALL_SUBJECTS, getSubjectsForGrade } from "../../../../lib/liveSubjects";
import { getUpcomingOccurrences } from "../../../../lib/recurrence";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "../../../homePage.css";
import "./directSubject.css";

function sortIsoDates(dates) {
  return [...dates].sort((a, b) => new Date(a) - new Date(b));
}
function getInitial(name) {
  return name?.trim()?.[0]?.toUpperCase() || "?";
}

function getTeacherEmoji(sex) {
  if (sex === "man") return "👨";
  if (sex === "woman") return "👩";
  return null;
}

export default function DirectCoursesPage() {
  const { gradeId, subjectId } = useParams();
  const router = useRouter();
  const { user, hydrated } = useUser();
  const grade = ALL_GRADES.find((g) => g.id === gradeId);
  const subject = ALL_SUBJECTS.find((s) => s.id === subjectId);
  const validCombo = Boolean(grade && subject && getSubjectsForGrade(gradeId).some((s) => s.id === subjectId));
  const needsSpecialization = Boolean(grade && GRADES_WITH_SPECIALIZATION.has(gradeId));
  // Empty string = nothing picked yet. For a specialization grade, this
  // gates whether courses are even fetched — never show a mixed list of
  // Bac Sciences and Bac Économie content before the student has told
  // us which one they're in.
  const [specializationId, setSpecializationId] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [prolongingId, setProlongingId] = useState(null);
  const [leavingId, setLeavingId] = useState(null);
  const [joinMsg, setJoinMsg] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const [subscribedCourseIds, setSubscribedCourseIds] = useState(new Set());
  const [mySessionDatesByCourse, setMySessionDatesByCourse] = useState(new Map());

  // Rating is dynamic (changes every time a student rates a teacher), so
  // unlike teacherName/teacherBio it can't be baked into the course doc
  // at creation time — it has to be read live from the teacher's own
  // user doc. Reads users/{teacherId} directly (allowed for any
  // authenticated reader when the doc's role is "teacher", per the
  // Firestore rules) and uses ratingAvg as the displayed number. Keyed
  // by teacherId since one page can show courses from several teachers.
  const [teacherRatings, setTeacherRatings] = useState(new Map());

  useEffect(() => {
    if (!validCombo) return;
    // Waiting on a required selection — don't fetch anything yet, and
    // don't show stale results from a previous specialization either.
    if (needsSpecialization && !specializationId) {
      setCourses([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function loadCourses() {
      setLoading(true);
      const constraints = [
        where("gradeId", "==", gradeId),
        where("subjectId", "==", subjectId),
        where("status", "==", "active"),
      ];
      if (needsSpecialization) constraints.push(where("specializationId", "==", specializationId));
      const q = query(collection(DB, "courses"), ...constraints);
      const snap = await getDocs(q);
      if (cancelled) return;
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    loadCourses();
    return () => {
      cancelled = true;
    };
  }, [validCombo, gradeId, subjectId, needsSpecialization, specializationId]);

  useEffect(() => {
    if (courses.length === 0) {
      setTeacherRatings(new Map());
      return;
    }
    let cancelled = false;

    async function loadTeacherRatings() {
      const uniqueTeacherIds = [...new Set(courses.map((c) => c.teacherId).filter(Boolean))];
      const entries = await Promise.all(
        uniqueTeacherIds.map(async (teacherId) => {
          try {
            const snap = await getDoc(doc(DB, "users", teacherId));
            const data = snap.exists() ? snap.data() : {};
            return [teacherId, { ratingAvg: data.ratingAvg || 0, ratingCount: data.ratingCount || 0 }];
          } catch {
            return [teacherId, { ratingAvg: 0, ratingCount: 0 }];
          }
        })
      );
      if (cancelled) return;
      setTeacherRatings(new Map(entries));
    }

    loadTeacherRatings();
    return () => {
      cancelled = true;
    };
  }, [courses]);

  useEffect(() => {
    if (!user) {
      setSubscribedCourseIds(new Set());
      setMySessionDatesByCourse(new Map());
      return;
    }
    let cancelled = false;
    async function loadMySubscriptions() {
      const q = query(
        collection(DB, "sessions"),
        where("studentId", "==", user.uid),
        where("status", "==", "subscribed")
      );
      const snap = await getDocs(q);
      if (cancelled) return;
      const byCourse = new Map();
      snap.docs.forEach((d) => {
        const data = d.data();
        if (!byCourse.has(data.courseId)) byCourse.set(data.courseId, []);
        byCourse.get(data.courseId).push(data.date);
      });
      for (const [courseId, dates] of byCourse) {
        byCourse.set(courseId, sortIsoDates(dates));
      }
      setSubscribedCourseIds(new Set(byCourse.keys()));
      setMySessionDatesByCourse(byCourse);
    }
    loadMySubscriptions();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  if (!validCombo) {
    notFound();
  }
  function checkLoginAndRole() {
    if (!hydrated) return false;
    if (!user) {
      router.push("/login");
      return false;
    }
    if (user.role !== "student") {
      setJoinError("Seuls les comptes élèves peuvent s'inscrire à un cours.");
      return false;
    }
    return true;
  }

  async function handleJoinClick(course) {
    setJoinMsg(null);
    setJoinError(null);
    if (!checkLoginAndRole()) return;
    const currentBalance = Number(user.balance) || 0;
    const price = Number(course.monthlyPrice) || 0;
    if (currentBalance < price) {
      setJoinError("Solde insuffisant. Rechargez votre compte pour vous inscrire à ce cours.");
      return;
    }
    setJoiningId(course.id);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/courses/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ courseId: course.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setJoinError(data.error || "Une erreur est survenue.");
        return;
      }
      setJoinMsg(
        `Inscription confirmée ! ${data.sessionCount} séance${data.sessionCount > 1 ? "s" : ""} réservée${
          data.sessionCount > 1 ? "s" : ""
        } avec ${course.teacherName} 🎉`
      );
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, enrolledCount: (c.enrolledCount || 0) + 1 } : c))
      );
      setSubscribedCourseIds((prev) => new Set(prev).add(course.id));
      setMySessionDatesByCourse((prev) => {
        const next = new Map(prev);
        next.set(course.id, sortIsoDates(data.sessionDates || []));
        return next;
      });
    } catch (err) {
      console.error(err);
      setJoinError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setJoiningId(null);
    }
  }

  async function handleProlongClick(course) {
    setJoinMsg(null);
    setJoinError(null);
    if (!checkLoginAndRole()) return;
    const currentBalance = Number(user.balance) || 0;
    const price = Number(course.monthlyPrice) || 0;
    if (currentBalance < price) {
      setJoinError("Solde insuffisant. Rechargez votre compte pour prolonger cet abonnement.");
      return;
    }
    setProlongingId(course.id);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/courses/prolong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ courseId: course.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setJoinError(data.error || "Une erreur est survenue.");
        return;
      }
      setJoinMsg(
        `Abonnement prolongé ! ${data.sessionCount} séance${data.sessionCount > 1 ? "s" : ""} de plus réservée${
          data.sessionCount > 1 ? "s" : ""
        } avec ${course.teacherName} 🎉`
      );
      setMySessionDatesByCourse((prev) => {
        const next = new Map(prev);
        const existing = next.get(course.id) || [];
        next.set(course.id, sortIsoDates([...existing, ...(data.sessionDates || [])]));
        return next;
      });
    } catch (err) {
      console.error(err);
      setJoinError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setProlongingId(null);
    }
  }

  async function handleLeaveClick(course) {
    setJoinMsg(null);
    setJoinError(null);
    const confirmed = window.confirm(
      `Voulez-vous vraiment quitter ce cours avec ${course.teacherName} ? Les séances à venir non commencées seront remboursées sur ton solde.`
    );
    if (!confirmed) return;
    setLeavingId(course.id);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/courses/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ courseId: course.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setJoinError(data.error || "Une erreur est survenue.");
        return;
      }
      setJoinMsg(
        data.refundAmount > 0
          ? `Tu as quitté ce cours. ${data.refundAmount} DT ont été remboursés sur ton solde.`
          : "Tu as quitté ce cours."
      );
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, enrolledCount: Math.max(0, (c.enrolledCount || 0) - 1) } : c
        )
      );
      setSubscribedCourseIds((prev) => {
        const next = new Set(prev);
        next.delete(course.id);
        return next;
      });
      setMySessionDatesByCourse((prev) => {
        const next = new Map(prev);
        next.delete(course.id);
        return next;
      });
    } catch (err) {
      console.error(err);
      setJoinError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setLeavingId(null);
    }
  }
  const waitingOnSpecialization = needsSpecialization && !specializationId;

  return (
    <div className="home-page">
    <div className="dsub-page">
      <Link href={`/direct/${gradeId}`} className="dsub-back-link">
        ← Matières de {grade.name}
      </Link>
      <h1 className="dsub-title">
        {subject.emoji} {subject.name} — {grade.name}
      </h1>
      <p className="dsub-sub">Choisis l'enseignant et l'horaire qui te conviennent.</p>
      {needsSpecialization && (
        <div className="dsub-spec-bar">
          <span className="dsub-spec-label">🎯 Ta spécialité</span>
          <select
            value={specializationId}
            onChange={(e) => setSpecializationId(e.target.value)}
            className="dsub-spec-select"
          >
            <option value="">— Choisis ta spécialité —</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.emoji} {s.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {joinMsg && <p className="dsub-join-toast">{joinMsg}</p>}
      {joinError && <p className="dsub-join-error">{joinError}</p>}
      {waitingOnSpecialization ? (
        <p className="dsub-spec-prompt">
          👆 Choisis ta spécialité ci-dessus pour voir les cours disponibles pour {subject.name}.
        </p>
      ) : loading ? (
        <LoadingSpinner />
      ) : courses.length === 0 ? (
        <p className="dsub-empty">Aucune séance pour le moment. Reviens bientôt ! 🌱</p>
      ) : (
        <div className="dsub-course-grid">
          {courses.map((c) => {
            const isSubscribed = subscribedCourseIds.has(c.id);
            const full = (c.enrolledCount || 0) >= c.maxStudents;
            const isJoining = joiningId === c.id;
            const isProlonging = prolongingId === c.id;
            const isLeaving = leavingId === c.id;
            const upcoming = isSubscribed
              ? (mySessionDatesByCourse.get(c.id) || []).map((iso) => new Date(iso))
              : getUpcomingOccurrences(c.weeklySlots, c.sessionsPerMonth || 4);

            const teacherRating = teacherRatings.get(c.teacherId);
            const teacherEmoji = getTeacherEmoji(c.teacherSex);
            
            return (
              <article key={c.id} className="dsub-course-card">
                <div className="dsub-course-head">
                  <span className="dsub-course-avatar">{teacherEmoji || getInitial(c.teacherName)}</span>
                  <div className="dsub-course-head-info">
                    <div className="dsub-teacher-name-row">
                      <h2 className="dsub-teacher-name">{c.teacherName}</h2>
                      {teacherRating && teacherRating.ratingCount > 0 && (
                        <span className="dsub-teacher-rating">⭐ {teacherRating.ratingAvg.toFixed(1)}</span>
                      )}
                    </div>
                    {c.teacherBio && <p className="dsub-teacher-bio">{c.teacherBio}</p>}
                    <p className="dsub-course-badge">
                      {c.subjectName} · {c.gradeName}
                      {c.specializationName ? ` (${c.specializationName})` : ""}
                    </p>
                  </div>
                </div>
                <div className="dsub-stats-row">
                  <div className="dsub-stat-box">
                    <p className="dsub-stat-label">Séances / mois</p>
                    <p className="dsub-stat-value">{c.sessionsPerMonth}</p>
                  </div>
                  <div className="dsub-stat-box">
                    <p className="dsub-stat-label">Élèves max / séance</p>
                    <p className="dsub-stat-value">{c.maxStudents}</p>
                  </div>
                </div>
                {upcoming.length > 0 && (
                  <div className="dsub-upcoming-box">
                    <p className="dsub-upcoming-label">
                      {isSubscribed ? "Tes prochaines séances" : "Prochaines séances du mois"}
                    </p>
                    <ul className="dsub-upcoming-list">
                      {upcoming.map((d, i) => (
                        <li key={i} className="dsub-upcoming-chip">
                          {d.toLocaleString("fr-TN", {
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
                )}
                <div className="dsub-footer-row">
                  <p className="dsub-price">
                    {c.monthlyPrice} DT<span className="dsub-price-unit"> / mois</span>
                  </p>
                  {isSubscribed ? (
                    <div className="dsub-subscribed-actions">
                      <button
                        type="button"
                        disabled={isProlonging}
                        onClick={() => handleProlongClick(c)}
                        className="dsub-join-btn dsub-prolong-btn"
                      >
                        {isProlonging ? "Prolongation..." : "Prolonger"}
                      </button>
                      <button
                        type="button"
                        disabled={isLeaving}
                        onClick={() => handleLeaveClick(c)}
                        className="dsub-join-btn dsub-leave-btn"
                      >
                        {isLeaving ? "Annulation..." : "Quitter le cours"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={full || isJoining}
                      onClick={() => handleJoinClick(c)}
                      className="dsub-join-btn"
                    >
                      {full ? "Complet" : isJoining ? "Inscription..." : "Rejoindre"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
    </div>
  );
}