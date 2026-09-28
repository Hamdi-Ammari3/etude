"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { DB, auth } from "../../lib/firebaseConfig";
import { useUser } from "../../lib/auth";
import { ALL_GRADES, GRADE_GROUPS, GRADES_WITH_SPECIALIZATION, SPECIALIZATIONS } from "../../lib/liveGrades";
import { getAccessibleGradeIds } from "../../lib/videoAccess";
import LoadingSpinner from "../components/LoadingSpinner";
import TrackedVideoPlayer from "../components/TrackedVideoPlayer";
import VideoThumbnail from "../components/VideoThumbnail";
import { getGradeEmoji, getSubjectEmoji, shortGradeLabel } from "../../lib/videoDisplay";
import "../homePage.css";
import "./videos.css";

const DROUSSY_WHATSAPP = "2165110183";
const PAGE_SIZE = 12;
const MAX_VIDEOS_LOADED = 500; // plenty for launch; move to server-side paging later
// Grades in curriculum order (1ère année → Bac).
const ORDERED_GRADES = GRADE_GROUPS.flatMap((group) =>
  group.grades.map((g) => ({ ...g, levelName: group.levelName }))
);

// ---------- Helpers ----------

function normalize(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function toMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  return new Date(value).getTime() || 0;
}

function formatDuration(sec) {
  if (!Number.isFinite(sec) || sec <= 0) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

function formatViews(n = 0) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "").replace(".", ",")} k`;
  return String(n);
}

function gradeById(id) {
  return ORDERED_GRADES.find((g) => g.id === id) || ALL_GRADES.find((g) => g.id === id) || null;
}

function gradeEmoji(id) {
  return getGradeEmoji(id);
}

function publishedTime(v) {
  return toMillis(v.publishedAt || v.encodedAt || v.createdAt);
}

// Filters live in the URL (?niveau=col-7&matiere=maths&tri=recentes) so the
// back button, refresh and shared links keep the same view. We use the
// History API directly to avoid Next's useSearchParams Suspense requirement.
function readUrlFilters() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    grade: p.get("niveau") || null,
    section: p.get("section") || "all",
    subject: p.get("matiere") || "all",
    sort: p.get("tri") === "recentes" ? "recentes" : "populaires",
    q: p.get("q") || "",
  };
}

function writeUrlFilters({ grade, section, subject, sort, search }) {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams();
  if (grade && grade !== "all") p.set("niveau", grade);
  if (section !== "all") p.set("section", section);
  if (subject !== "all") p.set("matiere", subject);
  if (sort !== "populaires") p.set("tri", sort);
  if (search.trim()) p.set("q", search.trim());
  const qs = p.toString();
  const next = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
  if (next !== `${window.location.pathname}${window.location.search}`) {
    window.history.replaceState(null, "", next);
  }
}

// =========================================================
// PAGE
// =========================================================

export default function VideosPage() {
  const { user, hydrated } = useUser();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [grade, setGrade] = useState("all");
  const [section, setSection] = useState("all");
  const [subject, setSubject] = useState("all");
  const [sort, setSort] = useState("populaires");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersReady, setFiltersReady] = useState(false);

  const [playing, setPlaying] = useState(null);
  const [lockedVideo, setLockedVideo] = useState(null);

  const accessible = useMemo(() => getAccessibleGradeIds(user), [user]);
  const isStudent = !!user && user.role !== "teacher";
  const firstName = user?.name?.split(" ")[0];

  // ---- Load published videos ----
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const snap = await getDocs(
          query(collection(DB, "videos"), where("status", "==", "published"), limit(MAX_VIDEOS_LOADED))
        );
        if (!cancelled) setVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
        if (!cancelled) setLoadError("Impossible de charger les vidéos. Réessayez plus tard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [hydrated, user?.uid]);

  // ---- Initial filters: URL first, otherwise the student's own grade ----
  useEffect(() => {
    if (!hydrated || filtersReady) return;
    const fromUrl = readUrlFilters();
    const myFirstGrade = ORDERED_GRADES.find((g) => accessible.has(g.id))?.id;
    setGrade(fromUrl.grade || (isStudent && myFirstGrade) || "all");
    setSection(fromUrl.section);
    setSubject(fromUrl.subject);
    setSort(fromUrl.sort);
    setSearch(fromUrl.q);
    setFiltersReady(true);
  }, [hydrated, filtersReady, accessible, isStudent]);

  // Keep the URL in sync, and restart paging whenever a filter changes.
  useEffect(() => {
    if (!filtersReady) return;
    writeUrlFilters({ grade, section, subject, sort, search });
    setVisible(PAGE_SIZE);
  }, [filtersReady, grade, section, subject, sort, search]);

  const hasSections = grade !== "all" && GRADES_WITH_SPECIALIZATION.has(grade);
  useEffect(() => {
    if (!hasSections && section !== "all") setSection("all");
  }, [hasSections, section]);

  // ---- Counts per grade (for the select + "explore" cards) ----
  const countsByGrade = useMemo(() => {
    const map = new Map();
    videos.forEach((v) => map.set(v.gradeId, (map.get(v.gradeId) || 0) + 1));
    return map;
  }, [videos]);

  // Grades offered in the select: those with videos + the student's own grades.
  const gradeGroups = useMemo(
    () =>
      GRADE_GROUPS.map((group) => ({
        levelName: group.levelName,
        grades: group.grades.filter((g) => countsByGrade.has(g.id) || accessible.has(g.id)),
      })).filter((group) => group.grades.length > 0),
    [countsByGrade, accessible]
  );

  // Videos matching grade + section (the base for subject counts).
  const inScope = useMemo(
    () =>
      videos.filter(
        (v) =>
          (grade === "all" || v.gradeId === grade) && (section === "all" || v.specializationId === section)
      ),
    [videos, grade, section]
  );

  const sectionCounts = useMemo(() => {
    const map = new Map();
    if (!hasSections) return map;
    videos
      .filter((v) => v.gradeId === grade && v.specializationId)
      .forEach((v) => map.set(v.specializationId, (map.get(v.specializationId) || 0) + 1));
    return map;
  }, [videos, grade, hasSections]);

  const subjectChips = useMemo(() => {
    const map = new Map();
    inScope.forEach((v) => {
      if (!v.subjectId) return;
      const cur = map.get(v.subjectId) || {
        id: v.subjectId,
        name: v.subjectName || v.subjectId,
        emoji: getSubjectEmoji(v.subjectId, v.subjectEmoji),
        count: 0,
      };
      cur.count += 1;
      map.set(v.subjectId, cur);
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [inScope]);

  // If the chosen subject has no video in the new grade, fall back to "all".
  useEffect(() => {
    if (!filtersReady || loading || subject === "all") return;
    if (!subjectChips.some((s) => s.id === subject)) setSubject("all");
  }, [filtersReady, loading, subject, subjectChips]);

  // ---- Final results ----
  const results = useMemo(() => {
    const q = normalize(search.trim());
    const list = inScope.filter(
      (v) =>
        (subject === "all" || v.subjectId === subject) &&
        (!q || normalize(`${v.title} ${v.teacherName} ${v.subjectName}`).includes(q))
    );
    return list.sort((a, b) =>
      sort === "populaires"
        ? (b.views || 0) - (a.views || 0) || publishedTime(b) - publishedTime(a)
        : publishedTime(b) - publishedTime(a)
    );
  }, [inScope, subject, search, sort]);

  const currentGrade = grade !== "all" ? gradeById(grade) : null;
  const currentSubject = subjectChips.find((s) => s.id === subject);
  const gradeLocked = !!user && grade !== "all" && !accessible.has(grade);
  const activeFilters = (section !== "all" ? 1 : 0) + (subject !== "all" ? 1 : 0) + (search.trim() ? 1 : 0);
  const gradesWithVideos = countsByGrade.size;

  const exploreGrades = ORDERED_GRADES.filter((g) => !accessible.has(g.id) && countsByGrade.has(g.id));
  const showExplore = isStudent && grade !== "all" && !gradeLocked && exploreGrades.length > 0;

  const isLocked = useCallback(
    (v) => !(accessible.has(v.gradeId) || (user && v.teacherId === user.uid)),
    [accessible, user]
  );

  function openVideo(v) {
    if (isLocked(v)) setLockedVideo(v);
    else setPlaying(v);
  }

  function clearFilters() {
    setSection("all");
    setSubject("all");
    setSearch("");
  }

  function jumpToGrade(id) {
    setGrade(id);
    setSubject("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const subscribeLink = (gName) =>
    `https://wa.me/${DROUSSY_WHATSAPP}?text=${encodeURIComponent(
      `Bonjour Droussy TN, je souhaite m'abonner au niveau ${gName}.`
    )}`;

  // =========================================================
  // RENDER
  // =========================================================

  if (!hydrated) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* ---------- Hero ---------- */}
      <section className="vid-hero">
        <div className="vid-container">
          <p className="vid-eyebrow">Vidéos à la demande 🎬</p>
          <h1 className="vid-title">
            {isStudent && firstName ? `Salut ${firstName} ! Qu'apprend-on aujourd'hui ?` : "Toutes nos vidéos de cours"}
          </h1>
          <p className="vid-subtitle">
            {loading
              ? "Chargement du catalogue..."
              : `${videos.length} vidéo${videos.length > 1 ? "s" : ""} · ${gradesWithVideos} niveau${
                  gradesWithVideos > 1 ? "x" : ""
                } · des enseignants tunisiens passionnés`}
          </p>
        </div>
      </section>

      {/* ---------- Sticky filter bar ---------- */}
      <div className="vid-filterbar">
        <div className="vid-container vid-filterbar-inner">
          <div className="vid-filter-row">
            <select
              value={grade}
              onChange={(e) => {
                setGrade(e.target.value);
                setSubject("all");
              }}
              aria-label="Niveau"
              className="vid-select vid-select-grade"
            >
              <option value="all">🎒 Tous les niveaux</option>
              {gradeGroups.map((group) => (
                <optgroup key={group.levelName} label={group.levelName}>
                  {group.grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {gradeEmoji(g.id)} {g.name}
                      {accessible.has(g.id) ? " ✓" : ""} ({countsByGrade.get(g.id) || 0})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Leçon ou enseignant…"
              aria-label="Chercher une leçon ou un enseignant"
              className="vid-search"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Trier"
              className="vid-select vid-select-sort"
            >
              <option value="populaires">🔥 Populaires</option>
              <option value="recentes">🆕 Récentes</option>
            </select>
          </div>

          {hasSections && sectionCounts.size > 0 && (
            <div className="vid-chip-row" aria-label="Filtrer par section">
              <span className="vid-chip-label">Section :</span>
              <Chip small active={section === "all"} onClick={() => setSection("all")}>
                Toutes
              </Chip>
              {SPECIALIZATIONS.filter((s) => sectionCounts.has(s.id)).map((s) => (
                <Chip small key={s.id} active={section === s.id} onClick={() => setSection(s.id)}>
                  {s.name}
                </Chip>
              ))}
            </div>
          )}

          {subjectChips.length > 0 && (
            <div className="vid-chip-row" aria-label="Filtrer par matière">
              <Chip active={subject === "all"} onClick={() => setSubject("all")}>
                ✨ Toutes les matières
              </Chip>
              {subjectChips.map((s) => (
                <Chip key={s.id} active={subject === s.id} onClick={() => setSubject(s.id)}>
                  {s.emoji} {s.name}
                  <span className="vid-chip-count">{s.count}</span>
                </Chip>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------- Results ---------- */}
      <div className="vid-container vid-body">

        {/* 
        {!user && (
          <Banner
            emoji="👋"
            title="Connecte-toi pour regarder les vidéos de ta classe"
            text="Tu peux déjà parcourir tout notre catalogue."
          >
            <Link href="/login" className="vid-btn-primary">
              Connexion
            </Link>
          </Banner>
        )}
        */}

        {gradeLocked && currentGrade && (
          <Banner
            emoji="👨‍👩‍👧"
            title={`${currentGrade.name} n'est pas inclus dans ton abonnement`}
            text="Un autre enfant dans ce niveau ? Ajoutez-le et débloquez toutes ses vidéos."
          >
            <a href={subscribeLink(currentGrade.name)} target="_blank" rel="noopener noreferrer" className="vid-btn-primary">
              S'abonner
            </a>
          </Banner>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : loadError ? (
          <p className="vid-error">{loadError}</p>
        ) : videos.length === 0 ? (
          <EmptyState emoji="🎬" title="Les premières vidéos arrivent très bientôt">
            Nos enseignants préparent leurs cours. Revenez dans quelques jours !
          </EmptyState>
        ) : (
          <>
            <div className="vid-results-head">
              <h2 className="vid-results-title">
                {currentGrade ? `${gradeEmoji(currentGrade.id)} ${currentGrade.name}` : "Tous les niveaux"}
                {currentSubject && <span className="vid-results-accent"> · {currentSubject.name}</span>}
              </h2>
              <div className="vid-results-meta">
                <span>
                  {results.length} vidéo{results.length > 1 ? "s" : ""}
                </span>
                {activeFilters > 0 && (
                  <button type="button" onClick={clearFilters} className="vid-link-btn">
                    Effacer les filtres
                  </button>
                )}
              </div>
            </div>

            {results.length === 0 ? (
              activeFilters > 0 ? (
                <EmptyState emoji="🔎" title="Aucune vidéo ne correspond à ces filtres.">
                  <button type="button" onClick={clearFilters} className="vid-btn-secondary">
                    Effacer les filtres
                  </button>
                </EmptyState>
              ) : (
                <EmptyState emoji="🎬" title="Pas encore de vidéos pour ce niveau">
                  Elles arrivent très bientôt !
                  <br />
                  <button type="button" onClick={() => jumpToGrade("all")} className="vid-btn-secondary">
                    Voir tous les niveaux
                  </button>
                </EmptyState>
              )
            ) : (
              <>
                <div className="vid-grid">
                  {results.slice(0, visible).map((v) => (
                    <VideoCard
                      key={v.id}
                      video={v}
                      locked={isLocked(v)}
                      isLoggedIn={!!user}
                      showGrade={grade === "all"}
                      showSection={hasSections && section === "all"}
                      onClick={() => openVideo(v)}
                    />
                  ))}
                </div>

                {visible < results.length && (
                  <div className="vid-more">
                    <button type="button" onClick={() => setVisible((n) => n + PAGE_SIZE)} className="vid-btn-secondary">
                      Voir plus de vidéos
                    </button>
                    <p className="vid-more-count">
                      {Math.min(visible, results.length)} sur {results.length}
                    </p>
                  </div>
                )}
              </>
            )}

            {showExplore && (
              <section className="vid-explore">
                <h2 className="vid-results-title">🌍 Explore les autres niveaux</h2>
                <p className="vid-section-sub">Un frère ou une sœur ? Toutes les classes sont disponibles.</p>
                <div className="vid-explore-grid">
                  {exploreGrades.map((g) => (
                    <button key={g.id} type="button" onClick={() => jumpToGrade(g.id)} className="vid-explore-card">
                      <span className="vid-explore-emoji">{gradeEmoji(g.id)}</span>
                      <span className="vid-explore-name">{g.name}</span>
                      <span className="vid-explore-count">
                        {countsByGrade.get(g.id)} vidéo{countsByGrade.get(g.id) > 1 ? "s" : ""}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {playing && <PlayerModal video={playing} onClose={() => setPlaying(null)} />}

      {lockedVideo && (
        <Modal onClose={() => setLockedVideo(null)} size="sm" labelledBy="vid-locked-title">
          <div className="vid-locked">
            <div className="vid-locked-icon">{user ? "🔓" : "🔒"}</div>
            <h2 id="vid-locked-title" className="vid-modal-title">
              Vidéo de {lockedVideo.gradeName || gradeById(lockedVideo.gradeId)?.name}
            </h2>
            <p className="vid-locked-text">
              {user
                ? "Cette vidéo n'est pas dans le niveau de ton compte. Un autre enfant dans ce niveau ? Ajoutez un abonnement pour tout débloquer."
                : "Connecte-toi avec ton compte pour regarder les vidéos de ta classe."}
            </p>
            {user ? (
              <a
                href={subscribeLink(lockedVideo.gradeName || gradeById(lockedVideo.gradeId)?.name || "")}
                target="_blank"
                rel="noopener noreferrer"
                className="vid-btn-primary"
              >
                S'abonner à ce niveau
              </a>
            ) : (
              <Link href="/login" className="vid-btn-primary">
                Connexion
              </Link>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// =========================================================
// VIDEO CARD
// =========================================================

function VideoCard({ video, locked, isLoggedIn, showGrade, showSection, onClick }) {
  const duration = formatDuration(video.durationSec);

  const fullGrade = video.gradeName || gradeById(video.gradeId)?.name || "";
  const spec = video.specializationName || "";
  // Which level chip to show: grade (+ section) in "all grades" view,
  // section alone when one grade with sections is selected.
  const levelChip = showGrade
    ? [shortGradeLabel(fullGrade), spec].filter(Boolean).join(" · ")
    : showSection
    ? spec
    : "";
  const levelTooltip = [fullGrade, spec].filter(Boolean).join(" · ");
  const subjectLabel = `${getSubjectEmoji(video.subjectId, video.subjectEmoji)} ${video.subjectName || ""}`.trim();

  return (
    <button type="button" onClick={onClick} className="vid-card" title={video.title}>
      <div className="vid-thumb">
        <VideoThumbnail video={video} />
        {duration && <span className="vid-duration">{duration}</span>}
        {locked ? (
          <span className="vid-locked-overlay">
            <span>{isLoggedIn ? "🔓 À débloquer" : "🔒 Connecte-toi"}</span>
          </span>
        ) : (
          <span className="vid-play-overlay">
            <span>▶</span>
          </span>
        )}
      </div>
      <div className="vid-card-body">
        <p className="vid-card-title">{video.title}</p>
        <p className="vid-card-teacher">{video.teacherName || " "}</p>
        <div className="vid-card-meta">
          {levelChip && (
            <span className="vid-chip-grade" title={levelTooltip}>
              {levelChip}
            </span>
          )}
          <span className="vid-chip-subject" title={video.subjectName}>
            {subjectLabel}
          </span>
          <span className="vid-card-views">👁 {formatViews(video.views || 0)}</span>
        </div>
      </div>
    </button>
  );
}

// =========================================================
// PLAYER (short-lived signed Bunny URL + view tracking)
// =========================================================

function PlayerModal({ video, onClose }) {
  const [embedUrl, setEmbedUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setEmbedUrl(null);
      setError(null);
      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) throw new Error("Connecte-toi pour regarder cette vidéo.");
        const res = await fetch(`/api/videos/${video.id}/play`, {
          method: "POST",
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Lecture impossible pour le moment.");
        if (!cancelled) setEmbedUrl(data.embedUrl);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [video.id]);

  return (
    <Modal onClose={onClose} size="lg" labelledBy="vid-player-title">
      <h2 id="vid-player-title" className="vid-modal-title vid-modal-title-left">
        {video.title}
      </h2>
      <p className="vid-modal-desc">
        {video.teacherName} · {getSubjectEmoji(video.subjectId, video.subjectEmoji)} {video.subjectName} · 👁 {formatViews(video.views || 0)}
      </p>
      <div className="vid-player">
        {error ? (
          <div className="vid-player-msg">
            <p>⚠️ {error}</p>
          </div>
        ) : embedUrl ? (
          <TrackedVideoPlayer videoId={video.id} embedUrl={embedUrl} title={video.title} />
        ) : (
          <div className="vid-player-msg">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </Modal>
  );
}

// =========================================================
// SMALL UI PIECES
// =========================================================

function Modal({ children, onClose, size = "md", labelledBy }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="vid-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`vid-modal vid-modal-${size}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button type="button" className="vid-modal-close" onClick={onClose} aria-label="Fermer">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

function Banner({ emoji, title, text, children }) {
  return (
    <div className="vid-banner">
      <span className="vid-banner-emoji">{emoji}</span>
      <div className="vid-banner-text">
        <p className="vid-banner-title">{title}</p>
        <p className="vid-banner-sub">{text}</p>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ emoji, title, children }) {
  return (
    <div className="vid-empty">
      <p className="vid-empty-emoji">{emoji}</p>
      <p className="vid-empty-title">{title}</p>
      {children && <div className="vid-empty-text">{children}</div>}
    </div>
  );
}

function Chip({ active, onClick, children, small }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`vid-chip ${small ? "vid-chip-sm" : ""} ${active ? "vid-chip-active" : ""}`}
    >
      {children}
    </button>
  );
}