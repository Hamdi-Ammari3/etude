"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, doc, updateDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { DB, auth } from "../../lib/firebaseConfig";
import { completeLogin, logoutUser, useUser } from "../../lib/auth";
import { ALL_GRADES, GRADE_GROUPS, GRADES_WITH_SPECIALIZATION, SPECIALIZATIONS } from "../../lib/liveGrades";
import { getSubjectsForGrade } from "../../lib/liveSubjects";
import { buildTunisiaDateTime, expandSlotsForMonth, getNextOccurrence, getTunisiaFields } from "../../lib/recurrence";
import MonthCalendar from "../components/MonthCalendar";
import LoadingSpinner from "../components/LoadingSpinner";
import "../homePage.css";
import "./enseignantPage.css";

const TEACHER_WHATSAPP = "2165110183";
const WHATSAPP_MESSAGE = "Bonjour Droussy TN, je souhaite devenir enseignant sur la plateforme.";

const WEEK_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const WEEKS_PER_MONTH = 4;

const SESSION_STATUS_LABELS = {
  subscribed: "À venir",
  started: "En cours",
  finished: "Terminée",
};

function toJsDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  return new Date(value);
}

// Compares purely via extracted Tunisia-local calendar fields — never
// reconstructs a `new Date(y, m, d)` for comparison, since even for an
// already-correct sessionTime, reading .getFullYear()/.getMonth()/
// .getDate() back off it is still machine-timezone-dependent (that
// read happens in whatever timezone the browser is configured to, not
// necessarily Tunisia's — this was the root cause of the same course
// showing a different day/status on different computers).
function getSessionTimingState(sessionTime) {
  const now = new Date();
  const sessionFields = getTunisiaFields(sessionTime);
  const nowFields = getTunisiaFields(now);

  const sessionDayValue = sessionFields.year * 10000 + sessionFields.month * 100 + sessionFields.date;
  const todayValue = nowFields.year * 10000 + nowFields.month * 100 + nowFields.date;

  if (sessionDayValue < todayValue) return "past";
  if (sessionDayValue > todayValue) return "upcoming";
  return now >= sessionTime ? "ready" : "upcoming";
}

// Sort key for "Mes séances": each course's EARLIEST weekly slot
// (day-of-week first, then time), so a Monday 18:00 course sorts before
// a Monday 20:30 course, which sorts before a Tuesday 18:00 course — a
// course with multiple slots in a week is ordered by whichever slot
// comes first. Courses with no slots at all sort last (shouldn't happen
// in practice, but avoids crashing on malformed data).
function getEarliestSlotKey(weeklySlots) {
  if (!weeklySlots || weeklySlots.length === 0) return { day: 7, time: "99:99" };
  return [...weeklySlots].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return (a.time || "").localeCompare(b.time || "");
  })[0];
}

function compareCoursesBySlot(a, b) {
  const aKey = getEarliestSlotKey(a.weeklySlots);
  const bKey = getEarliestSlotKey(b.weeklySlots);
  if (aKey.day !== bKey.day) return aKey.day - bKey.day;
  return (aKey.time || "").localeCompare(bKey.time || "");
}

export default function EnseignantDashboard() {
  const { user, hydrated } = useUser();
  const router = useRouter();

  // ---- Login form state ----
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError(null);

    if (!/^\d{8}$/.test(phone.trim())) {
      return setLoginError("Le numéro doit contenir exactement 8 chiffres.");
    }
    if (!/^\d{4}$/.test(password.trim())) {
      return setLoginError("La clé enseignant doit contenir 4 chiffres.");
    }

    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password: password.trim(), loginAs: "teacher" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Connexion impossible.");
        return;
      }
      await completeLogin(data.token);
      router.push("/enseignant");
    } catch {
      setLoginError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  // ---- Create-course form state ----
  const [gradeId, setGradeId] = useState(ALL_GRADES[0].id);
  const [subjectId, setSubjectId] = useState("");
  const [specializationId, setSpecializationId] = useState("");
  const [perWeek, setPerWeekRaw] = useState(1);
  const [maxStudents, setMaxStudents] = useState(1);
  const [monthlyPrice, setMonthlyPrice] = useState(60);
  const [slots, setSlots] = useState([{ day: 0, time: "" }]);

  const needsSpecialization = GRADES_WITH_SPECIALIZATION.has(gradeId);
  const subjectsForGrade = getSubjectsForGrade(gradeId);

  useEffect(() => {
    if (!needsSpecialization) setSpecializationId("");
  }, [needsSpecialization]);

  useEffect(() => {
    if (subjectsForGrade.length === 0) {
      setSubjectId("");
      return;
    }
    if (!subjectsForGrade.some((s) => s.id === subjectId)) {
      setSubjectId(subjectsForGrade[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeId]);

  const [myCourses, setMyCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const nowInit = new Date();
  const [calYear, setCalYear] = useState(nowInit.getFullYear());
  const [calMonth, setCalMonth] = useState(nowInit.getMonth());

  function handleCalendarMonthChange(year, month) {
    setCalYear(year);
    setCalMonth(month);
  }

  // Which calendar day is currently selected, and start-session state.
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [startingKey, setStartingKey] = useState(null);
  const [startMsg, setStartMsg] = useState(null);
  const [startError, setStartError] = useState(null);

  function handleDayClick(dateKey) {
    setStartMsg(null);
    setStartError(null);
    setSelectedDateKey(dateKey);
  }

  const [teacherSessions, setTeacherSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const isTeacher = hydrated && user?.role === "teacher";

  const sessionsPerMonth = perWeek * WEEKS_PER_MONTH;
  const pricePerSession = sessionsPerMonth > 0 ? monthlyPrice / sessionsPerMonth : 0;

  function setPerWeek(n) {
    const count = Math.max(1, Math.min(7, n || 1));
    setPerWeekRaw(count);
    setSlots((prev) => Array.from({ length: count }, (_, i) => prev[i] ?? { day: 0, time: "" }));
  }

  function updateSlotDay(i, day) {
    setSlots((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], day };
      return next;
    });
  }

  function updateSlotTime(i, time) {
    setSlots((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], time };
      return next;
    });
  }

  useEffect(() => {
    if (!isTeacher) return;
    let cancelled = false;
    async function loadCourses() {
      setCoursesLoading(true);
      const q = query(
        collection(DB, "courses"),
        where("teacherId", "==", user.uid),
        where("status", "==", "active")
      );
      const snap = await getDocs(q);
      if (cancelled) return;
      setMyCourses(
        snap.docs.map((d) => {
          const data = d.data();
          return { id: d.id, ...data, createdAt: toJsDate(data.createdAt) };
        })
      );
      setCoursesLoading(false);
    }
    loadCourses();
    return () => {
      cancelled = true;
    };
  }, [isTeacher, user?.uid]);

  useEffect(() => {
    if (!isTeacher) return;
    let cancelled = false;
    async function loadSessions() {
      setSessionsLoading(true);
      const q = query(collection(DB, "sessions"), where("teacherId", "==", user.uid));
      const snap = await getDocs(q);
      if (cancelled) return;
      setTeacherSessions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setSessionsLoading(false);
    }
    loadSessions();
    return () => {
      cancelled = true;
    };
  }, [isTeacher, user?.uid]);

  async function handleCreateCourse(e) {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!subjectId) {
      return setFormError("Choisissez une matière.");
    }
    if (needsSpecialization && !specializationId) {
      return setFormError("Merci de choisir une spécialité pour ce niveau.");
    }
    if (slots.some((s) => !s.time)) {
      return setFormError("Merci de choisir le jour et l'heure de chaque séance hebdomadaire.");
    }
    if (!monthlyPrice || monthlyPrice <= 0) {
      return setFormError("Le prix doit être supérieur à 0.");
    }

    const grade = ALL_GRADES.find((g) => g.id === gradeId);
    const subject = subjectsForGrade.find((s) => s.id === subjectId);
    const specialization = needsSpecialization ? SPECIALIZATIONS.find((s) => s.id === specializationId) : null;
    const roundedPricePerSession = Math.round(pricePerSession * 100) / 100;

    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(DB, "courses"), {
        teacherId: user.uid,
        teacherName: user.name,
        teacherBio: user.bio || "",
        teacherSex: user.sex || null,
        gradeId,
        gradeName: grade?.name || "",
        specializationId: specialization?.id || null,
        specializationName: specialization?.name || null,
        subjectId,
        subjectName: subject?.name || "",
        subjectEmoji: subject?.emoji || "📚",
        weeklySlots: slots,
        sessionsPerWeek: perWeek,
        sessionsPerMonth,
        maxStudents,
        monthlyPrice,
        pricePerSession: roundedPricePerSession,
        enrolledCount: 0,
        status: "active",
        createdAt: serverTimestamp(),
      });

      setMyCourses((prev) => [
        ...prev,
        {
          id: docRef.id,
          teacherId: user.uid,
          gradeName: grade?.name,
          specializationName: specialization?.name || null,
          subjectName: subject?.name,
          subjectEmoji: subject?.emoji,
          weeklySlots: slots,
          sessionsPerWeek: perWeek,
          sessionsPerMonth,
          maxStudents,
          monthlyPrice,
          pricePerSession: roundedPricePerSession,
          enrolledCount: 0,
          status: "active",
          createdAt: new Date(),
        },
      ]);
      setSuccessMsg("Séance hebdomadaire publiée ! Elle se répète chaque semaine 🎉");
      setSlots(Array.from({ length: perWeek }, () => ({ day: 0, time: "" })));
    } catch (err) {
      console.error(err);
      setFormError("Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancelCourse(courseId) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment annuler cette séance ? Elle ne sera plus visible par les élèves."
    );
    if (!confirmed) return;

    setCancellingId(courseId);
    try {
      await updateDoc(doc(DB, "courses", courseId), { status: "cancelled" });
      setMyCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, status: "cancelled" } : c)));
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de l'annulation. Réessayez.");
    } finally {
      setCancellingId(null);
    }
  }

  async function handleStartSession(courseId, dateIso) {
    setStartMsg(null);
    setStartError(null);
    const key = `${courseId}_${dateIso}`;
    setStartingKey(key);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/sessions/start", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ courseId, date: dateIso }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStartError(data.error || "Une erreur est survenue.");
        return;
      }

      // Straight into the room — no reason to make the teacher click
      // twice once the session has actually started.
      router.push(`/room/${data.roomId}`);
    } catch (err) {
      console.error(err);
      setStartError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setStartingKey(null);
    }
  }

  const patternEvents = myCourses
    .filter((c) => c.status !== "cancelled")
    .flatMap((c) =>
      expandSlotsForMonth(c.weeklySlots || [], calYear, calMonth, c.createdAt).map((occ) => ({
        date: occ.dateKey,
        title: `${c.subjectName} · ${c.gradeName}`,
      }))
    );

  const bookingEvents = teacherSessions
    .filter((s) => s.status !== "cancelled" && s.date)
    .filter((s) => {
      // Tunisia-local fields, not machine-local — a session near a
      // month boundary must land in the same calendar month regardless
      // of which computer is viewing it.
      const { year, month } = getTunisiaFields(new Date(s.date));
      return year === calYear && month === calMonth;
    })
    .map((s) => ({
      date: s.date.slice(0, 10),
      title: `${s.subjectName || "Séance"} · ${s.gradeName || ""}`,
    }));

  const calendarEvents = [...patternEvents, ...bookingEvents];

  const finishedSessions = teacherSessions.filter((s) => s.status === "finished");
  const unpaidFinishedSessions = finishedSessions.filter((s) => !s.payed);

  const totalRevenue = finishedSessions.reduce((sum, s) => sum + (s.price || 0), 0);
  const unpaidAmount = unpaidFinishedSessions.reduce((sum, s) => sum + (s.price || 0), 0);

  // Counts distinct class occurrences, not student-session docs — a
  // class with 5 students subscribed produces 5 separate session docs
  // sharing the same (courseId, date), which should count as ONE
  // finished class, not five.
  const finishedOccurrenceKeys = new Set(finishedSessions.map((s) => `${s.courseId}_${s.date}`));
  const finishedCount = finishedOccurrenceKeys.size;

  // One card per course whose weekly pattern lands on the selected day,
  // PLUS any real session for that day not already covered by an active
  // course's pattern. That second part matters specifically for a
  // course that was cancelled AFTER it already had real (including
  // finished) sessions — a course can only be cancelled once
  // enrolledCount is 0, but that doesn't erase the history of sessions
  // that already happened before everyone left. Without this fallback,
  // those sessions would still show a dot on the calendar (the dot
  // logic reads teacherSessions directly, unaffected by course status)
  // but vanish from the day-panel entirely once their course was
  // cancelled, which is the exact bug this fixes.
  const selectedDayCourseCards = (() => {
    if (!selectedDateKey) return [];

    const [y, m, d] = selectedDateKey.split("-").map(Number);
    // UTC noon anchor avoids any midnight-boundary edge case when
    // reading the weekday back — same technique as expandSlotsForMonth
    // in lib/recurrence.js.
    const { weekday: idx } = getTunisiaFields(new Date(Date.UTC(y, m - 1, d, 12, 0)));

    const cards = [];
    const coveredKeys = new Set();

    for (const c of myCourses) {
      if (c.status === "cancelled") continue;
      const matchingSlots = (c.weeklySlots || []).filter((slot) => slot.day === idx && slot.time);
      for (const slot of matchingSlots) {
        const [h, min] = slot.time.split(":").map(Number);
        const occurrence = buildTunisiaDateTime(y, m - 1, d, h, min || 0);
        if (c.createdAt && occurrence < c.createdAt) continue;

        const occurrenceIso = occurrence.toISOString();
        const realSessions = teacherSessions.filter(
          (s) => s.status !== "cancelled" && s.courseId === c.id && s.date === occurrenceIso
        );

        coveredKeys.add(`${c.id}_${occurrenceIso}`);

        cards.push({
          courseId: c.id,
          subjectName: c.subjectName,
          gradeName: c.gradeName,
          specializationName: c.specializationName,
          date: occurrenceIso,
          dateTime: occurrence,
          studentCount: realSessions.length,
          status: realSessions[0]?.status || null,
          liveRoomId: realSessions[0]?.liveRoomId || null,
        });
      }
    }

    // Fallback pass — real sessions for this date whose (courseId, date)
    // wasn't already produced above, using the session doc's OWN
    // denormalized fields directly, since the parent course may no
    // longer be active (or, in principle, no longer exist at all).
    const daySessions = teacherSessions.filter(
      (s) => s.status !== "cancelled" && s.date?.slice(0, 10) === selectedDateKey
    );
    const orphanGroups = new Map();
    for (const s of daySessions) {
      const key = `${s.courseId}_${s.date}`;
      if (coveredKeys.has(key)) continue;
      if (!orphanGroups.has(key)) {
        orphanGroups.set(key, {
          courseId: s.courseId,
          subjectName: s.subjectName,
          gradeName: s.gradeName,
          specializationName: s.specializationName,
          date: s.date,
          dateTime: new Date(s.date),
          studentCount: 0,
          status: s.status,
          liveRoomId: s.liveRoomId || null,
        });
      }
      orphanGroups.get(key).studentCount += 1;
    }
    cards.push(...orphanGroups.values());

    return cards.sort((a, b) => a.dateTime - b.dateTime);
  })();

  // "Mes séances" ordering: earliest weekly slot first (Monday 18:00,
  // then Monday 20:30, then Tuesday 18:00, ...) instead of Firestore's
  // fetch order.
  const sortedMyCourses = [...myCourses].sort(compareCoursesBySlot);

  if (!hydrated) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="home-page">
        <div className="ens-login-page">
          <div className="ens-login-grid">
            <div className="ens-login-intro">
              <span className="ens-login-badge">Espace professionnel</span>
              <h1 className="ens-login-intro-title">🏫 Connexion enseignant</h1>
              <p className="ens-login-intro-text">
                Gérez vos séances en direct, vos tarifs mensuels et votre solde depuis votre tableau de
                bord.
              </p>
              <ul className="ens-login-features">
                <li>📅 Planning du mois interactif</li>
                <li>💰 Suivi de vos revenus</li>
                <li>🎓 Publication de nouvelles séances</li>
              </ul>
              <a
                href={`https://wa.me/${TEACHER_WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ens-login-whatsapp-btn"
              >
                💬 Créer un compte via WhatsApp
              </a>
            </div>

            <form onSubmit={handleLogin} className="ens-login-form-card">
              <h2 className="ens-login-form-title">Accès à votre compte</h2>
              <p className="ens-login-form-sub">Réservé aux enseignants partenaires de Droussy TN.</p>

              <div className="ens-login-field">
                <label htmlFor="tphone" className="ens-login-label">
                  📱 Numéro de téléphone
                </label>
                <div className="ens-login-phone-row">
                  <span className="ens-login-phone-prefix">🇹🇳 +216</span>
                  <input
                    id="tphone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="username"
                    maxLength={8}
                    placeholder="20112233"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    className="ens-login-phone-input"
                  />
                </div>
              </div>

              <div className="ens-login-field">
                <label htmlFor="tkey" className="ens-login-label">
                  🔐 Clé enseignant (4 chiffres)
                </label>
                <input
                  id="tkey"
                  type="text"
                  inputMode="numeric"
                  autoComplete="current-password"
                  maxLength={4}
                  placeholder="1234"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="ens-login-password-input"
                />
              </div>

              {loginError && <p className="ens-login-error">{loginError}</p>}

              <button type="submit" disabled={loginLoading} className="ens-login-submit-btn">
                {loginLoading ? "Connexion..." : "Accéder à mon tableau de bord"}
              </button>

              <p className="ens-login-switch">
                Vous êtes élève ?{" "}
                <a href="/login" className="ens-login-switch-link">
                  Connexion élève
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "teacher") {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="ens-board">
        <div className="ens-board-header">
          <div>
            <h1 className="ens-board-title">🏫 Bonjour {user.name?.split(" ")[0]}</h1>
            <p className="ens-board-sub">Créez vos séances, fixez vos tarifs et suivez votre mois.</p>
          </div>

          {/**
            <button type="button" onClick={handleLogout} className="ens-logout-btn">
              Déconnexion
            </button>
          */}
          
        </div>

        <section className="ens-stats-grid">
          <div className="ens-stat-card ens-stat-card-mint">
            <p className="ens-stat-label">💰 Revenu total</p>
            <p className="ens-stat-value">{totalRevenue} DT</p>
            <p className="ens-stat-hint">Séances terminées, payées et non payées</p>
          </div>
          <div className="ens-stat-card ens-stat-card-sun">
            <p className="ens-stat-label">⏳ pas encore payées</p>
            <p className="ens-stat-value">{unpaidAmount} DT</p>
            <p className="ens-stat-hint">Séances terminées, pas encore payées</p>
          </div>
          <div className="ens-stat-card">
            <p className="ens-stat-label">✅ Séances terminées</p>
            <p className="ens-stat-value">{finishedCount}</p>
            <p className="ens-stat-hint">Payées et non payées confondues</p>
          </div>
        </section>

        <div className="ens-main-grid">
          <form onSubmit={handleCreateCourse} className="ens-form-card">
            <h2 className="ens-form-title">Ajouter une nouvelle séance</h2>

            <div className="ens-form-grid">
              <label className="ens-field">
                <span className="ens-field-label">Niveau</span>
                <select value={gradeId} onChange={(e) => setGradeId(e.target.value)} className="ens-select">
                  {GRADE_GROUPS.map((group) => (
                    <optgroup key={group.levelName} label={group.levelName}>
                      {group.grades.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>

              {needsSpecialization && (
                <label className="ens-field">
                  <span className="ens-field-label">Spécialité</span>
                  <select
                    value={specializationId}
                    onChange={(e) => setSpecializationId(e.target.value)}
                    className="ens-select"
                  >
                    <option value="">— Choisir —</option>
                    {SPECIALIZATIONS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="ens-field">
                <span className="ens-field-label">Matière</span>
                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="ens-select">
                  {subjectsForGrade.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.emoji} {s.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ens-field">
                <span className="ens-field-label">Séances par semaine</span>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={perWeek}
                  onChange={(e) => setPerWeek(Number(e.target.value))}
                  className="ens-input"
                />
                <p className="ens-field-hint">≈ {sessionsPerMonth} séances / mois</p>
              </label>

              <label className="ens-field">
                <span className="ens-field-label">Élèves max / séance</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(Number(e.target.value))}
                  className="ens-input"
                />
              </label>

              <label className="ens-field ens-field-full">
                <span className="ens-field-label">Prix abonnement mensuel (DT)</span>
                <input
                  type="number"
                  min={0}
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                  className="ens-input"
                />
                <p className="ens-field-hint">soit ≈ {pricePerSession.toFixed(2)} DT / séance</p>
              </label>
            </div>

            <fieldset className="ens-dates-fieldset">
              <legend className="ens-field-label">Jour et heure de chaque séance (chaque semaine)</legend>
              <div className="ens-dates-grid">
                {slots.map((s, i) => (
                  <div key={i} className="ens-slot-row">
                    <span className="ens-date-index">{i + 1}.</span>
                    <select
                      value={s.day}
                      onChange={(e) => updateSlotDay(i, Number(e.target.value))}
                      className="ens-select ens-slot-day"
                    >
                      {WEEK_DAYS.map((w, idx) => (
                        <option key={w} value={idx}>
                          {w}
                        </option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={s.time}
                      onChange={(e) => updateSlotTime(i, e.target.value)}
                      className="ens-input ens-slot-time"
                    />
                  </div>
                ))}
              </div>
              <p className="ens-field-hint">Ces créneaux se répètent chaque semaine jusqu'à l'arrêt du cours.</p>
            </fieldset>

            {formError && <p className="ens-login-error">{formError}</p>}
            {successMsg && <p className="ens-success-banner">{successMsg}</p>}

            <button type="submit" disabled={submitting} className="ens-publish-btn">
              {submitting ? "Publication..." : "Publier la séance"}
            </button>
          </form>

          <div>
            <MonthCalendar
              events={calendarEvents}
              emptyMessage="Aucune séance programmée ce mois-ci."
              onMonthChange={handleCalendarMonthChange}
              onDayClick={handleDayClick}
              selectedDateKey={selectedDateKey}
            />

            {selectedDateKey && (
              <div className="ens-day-panel">
                <div className="ens-day-panel-header">
                  <p className="ens-day-panel-title">
                    {new Date(`${selectedDateKey}T00:00:00`).toLocaleDateString("fr-TN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedDateKey(null)}
                    className="ens-day-panel-close"
                    aria-label="Fermer"
                  >
                    ✕
                  </button>
                </div>

                {selectedDayCourseCards.length === 0 ? (
                  <p className="ens-day-panel-empty">Aucune séance programmée ce jour-là.</p>
                ) : (
                  <ul className="ens-day-session-list">
                    {selectedDayCourseCards.map((g, i) => {
                      const groupKey = `${g.courseId}_${g.date}`;
                      const hasStudents = g.studentCount > 0;
                      const timingState = getSessionTimingState(g.dateTime);
                      const isStarting = startingKey === groupKey;

                      return (
                        <li key={i} className="ens-day-session-card">
                          <div className="ens-day-session-info">
                            <p className="ens-day-session-subject">
                              {g.subjectName} · {g.gradeName}
                              {g.specializationName ? ` (${g.specializationName})` : ""}
                            </p>
                            <p className="ens-day-session-meta">
                              {g.dateTime.toLocaleString("fr-TN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                              {hasStudents
                                ? ` · ${g.studentCount} élève${g.studentCount > 1 ? "s" : ""} inscrit${
                                    g.studentCount > 1 ? "s" : ""
                                  }`
                                : ""}
                            </p>
                          </div>

                          {!hasStudents ? (
                            <p className="ens-day-session-empty-msg">
                              Aucun élève inscrit à une séance ce jour-là.
                            </p>
                          ) : g.status === "finished" ? (
                            <span className="ens-day-session-status">
                              {SESSION_STATUS_LABELS[g.status] || g.status}
                            </span>
                          ) : g.status === "started" ? (
                            <button
                              type="button"
                              onClick={() => router.push(`/room/${g.liveRoomId}`)}
                              className="ens-day-session-start-btn"
                            >
                              Rejoindre la séance
                            </button>
                          ) : timingState === "past" ? (
                            <span className="ens-day-session-status ens-day-session-status-missed">
                              Séance passée
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={timingState !== "ready" || isStarting}
                              onClick={() => handleStartSession(g.courseId, g.date)}
                              className="ens-day-session-start-btn"
                            >
                              {isStarting
                                ? "Démarrage..."
                                : timingState === "ready"
                                ? "Démarrer la séance"
                                : "Pas encore l'heure"}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {startMsg && <p className="ens-day-panel-msg">{startMsg}</p>}
                {startError && <p className="ens-day-panel-error">{startError}</p>}
              </div>
            )}
          </div>
        </div>

        <h2 className="ens-courses-title">Mes séances</h2>
        {coursesLoading ? (
          <LoadingSpinner />
        ) : myCourses.length === 0 ? (
          <p className="ens-empty-text">Vous n'avez pas encore publié de séance.</p>
        ) : (
          <div className="ens-courses-grid">
            {sortedMyCourses.map((c) => {
              const isCancelled = c.status === "cancelled";
              const hasEnrolled = (c.enrolledCount || 0) > 0;
              const next = !isCancelled ? getNextOccurrence(c.weeklySlots || []) : null;
              return (
                <article key={c.id} className={`ens-course-card ${isCancelled ? "ens-course-card-cancelled" : ""}`}>
                  <p className="ens-course-name">
                    {c.subjectEmoji} {c.subjectName} · {c.gradeName}
                    {c.specializationName ? ` (${c.specializationName})` : ""}
                  </p>
                  <p className="ens-course-meta">
                    {c.sessionsPerWeek} séance{c.sessionsPerWeek > 1 ? "s" : ""} / semaine · ≈{" "}
                    {c.sessionsPerMonth} / mois · {c.enrolledCount || 0}/{c.maxStudents} élèves
                  </p>
                  <p className="ens-course-slots">
                    {(c.weeklySlots || []).map((s) => `${WEEK_DAYS[s.day]} ${s.time}`).join(" · ")}
                  </p>
                  {next && (
                    <p className="ens-course-next">
                      Prochaine :{" "}
                      {next.toLocaleString("fr-TN", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  )}
                  <p className="ens-course-price">
                    {c.monthlyPrice} DT / mois
                    <span className="ens-course-price-per-session">
                      {" "}
                      ({c.pricePerSession?.toFixed(2)} DT / séance)
                    </span>
                  </p>

                  {isCancelled ? (
                    <span className="ens-course-cancelled-badge">Annulée</span>
                  ) : hasEnrolled ? (
                    <p className="ens-course-cancel-blocked">
                      Annulation impossible : des élèves sont inscrits.
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCancelCourse(c.id)}
                      disabled={cancellingId === c.id}
                      className="ens-course-cancel-btn"
                    >
                      {cancellingId === c.id ? "Annulation..." : "Annuler la séance"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}