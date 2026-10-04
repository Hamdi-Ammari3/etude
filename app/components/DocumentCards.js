"use client";

// Shared by the documents catalog (home page "/") and the teacher profile page
// (/enseignants/[id]): the card, the video player, the PDF reader, the
// "locked" window, and the clickable teacher name.

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "../../lib/firebaseConfig";
import { CONTENT_TYPES, contentTypeOf, getPdfCategory } from "../../lib/videoConfig";
import { getSubjectEmoji, shortGradeLabel } from "../../lib/videoDisplay";
import { ALL_GRADES } from "../../lib/liveGrades";
import LoadingSpinner from "./LoadingSpinner";
import TrackedVideoPlayer from "./TrackedVideoPlayer";
import ProtectedPdfViewer from "./ProtectedPdfViewer";
import VideoThumbnail from "./VideoThumbnail";
import "../videos/videos.css";

const DROUSSY_WHATSAPP = "21651510183";

// ---------- Helpers ----------

export const isPdf = (item) => contentTypeOf(item) === CONTENT_TYPES.PDF;

export function formatDuration(sec) {
  if (!Number.isFinite(sec) || sec <= 0) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export function formatViews(n = 0) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "").replace(".", ",")} k`;
  return String(n);
}

function gradeName(item) {
  return item.gradeName || ALL_GRADES.find((g) => g.id === item.gradeId)?.name || "";
}

export const teacherProfileHref = (teacherId) => `/enseignants/${encodeURIComponent(teacherId)}`;

export function subscribeLink(gName) {
  return `https://wa.me/${DROUSSY_WHATSAPP}?text=${encodeURIComponent(
    `Bonjour Droussy TN, je souhaite m'abonner au niveau ${gName}.`
  )}`;
}

/** Teacher name styled as a link → his public profile. Plain text when `link` is false. */
export function TeacherLink({ teacherId, name, link = true }) {
  if (!name) return null;
  if (!link || !teacherId) return <span>{name}</span>;
  return (
    <Link href={teacherProfileHref(teacherId)} className="vid-teacher-link" title={`Voir le profil de ${name}`}>
      {name}
    </Link>
  );
}

// =========================================================
// CARD (video or PDF)
// =========================================================

export function ContentCard({ item, locked, isLoggedIn, showGrade, showSection, onClick }) {
  const pdf = isPdf(item);
  const category = pdf ? getPdfCategory(item.pdfCategory) : null;
  // The "🎬 Vidéo / 📄 PDF" tag is on the thumbnail; the corner badge gives the length.
  const badge = pdf
    ? item.pageCount
      ? `${item.pageCount} page${item.pageCount > 1 ? "s" : ""}`
      : ""
    : formatDuration(item.durationSec);

  const fullGrade = gradeName(item);
  const spec = item.specializationName || "";
  // Which level chip to show: grade (+ section) in "all grades" view,
  // section alone when one grade with sections is selected.
  const levelChip = showGrade
    ? [shortGradeLabel(fullGrade), spec].filter(Boolean).join(" · ")
    : showSection
    ? spec
    : "";
  const levelTooltip = [fullGrade, spec].filter(Boolean).join(" · ");
  const subjectLabel = `${getSubjectEmoji(item.subjectId, item.subjectEmoji)} ${item.subjectName || ""}`.trim();

  // PDFs: the document type comes first on the 2nd line ("✏️ Série d'exercices · ✅ Corrigé · Prof").
  const secondLine = pdf
    ? [category && `${category.emoji} ${category.label}`, item.hasCorrection && "✅ Corrigé", item.teacherName]
        .filter(Boolean)
        .join(" · ")
    : item.teacherName;

  return (
    <button type="button" onClick={onClick} className="vid-card" title={item.title}>
      <div className="vid-thumb">
        <VideoThumbnail video={item} />
        {badge && <span className={`vid-duration ${pdf ? "vid-badge-pdf" : ""}`}>{badge}</span>}
        {locked ? (
          // Visitors: light lock so they can still read what's on offer.
          <span className={`vid-locked-overlay ${isLoggedIn ? "" : "vid-locked-soft"}`}>
            <span>{isLoggedIn ? "🔓 À débloquer" : "🔒 Connecte-toi"}</span>
          </span>
        ) : (
          <span className="vid-play-overlay">
            <span>{pdf ? "📖" : "▶"}</span>
          </span>
        )}
      </div>
      <div className="vid-card-body">
        <p className="vid-card-title">{item.title}</p>
        <p className={`vid-card-teacher ${pdf ? "vid-card-doctype" : ""}`}>{secondLine || " "}</p>
        <div className="vid-card-meta">
          {levelChip && (
            <span className="vid-chip-grade" title={levelTooltip}>
              {levelChip}
            </span>
          )}
          <span className="vid-chip-subject" title={item.subjectName}>
            {subjectLabel}
          </span>
          <span className="vid-card-views">👁 {formatViews(item.views || 0)}</span>
        </div>
      </div>
    </button>
  );
}

// =========================================================
// OPEN A DOCUMENT — one component for the 3 cases:
// locked (not logged in / grade not subscribed), video, PDF.
// =========================================================

export function DocumentViewer({ item, locked, isLoggedIn, onClose, linkTeacher = true }) {
  if (!item) return null;
  if (locked) return <LockedModal item={item} isLoggedIn={isLoggedIn} onClose={onClose} />;
  if (isPdf(item)) return <PdfReaderModal pdf={item} onClose={onClose} linkTeacher={linkTeacher} />;
  return <PlayerModal video={item} onClose={onClose} linkTeacher={linkTeacher} />;
}

// =========================================================
// PLAYER (short-lived signed Bunny URL + view tracking)
// =========================================================

export function PlayerModal({ video, onClose, linkTeacher = true }) {
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
        {video.teacherName && (
          <>
            <TeacherLink teacherId={video.teacherId} name={video.teacherName} link={linkTeacher} />
            {" · "}
          </>
        )}
        {getSubjectEmoji(video.subjectId, video.subjectEmoji)} {video.subjectName} · 👁 {formatViews(video.views || 0)}
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
// PDF READER (protected viewer, full screen on phones)
// =========================================================

export function PdfReaderModal({ pdf, onClose, linkTeacher = true }) {
  const category = getPdfCategory(pdf.pdfCategory);
  const before = [category && `${category.emoji} ${category.label}`, pdf.hasCorrection && "✅ Corrigé"].filter(Boolean);
  const subject = `${getSubjectEmoji(pdf.subjectId, pdf.subjectEmoji)} ${pdf.subjectName || ""}`.trim();
  return (
    <Modal onClose={onClose} size="pdf" labelledBy="vid-reader-title">
      <h2 id="vid-reader-title" className="vid-modal-title vid-modal-title-left vid-reader-title">
        {pdf.title}
      </h2>
      <p className="vid-modal-desc vid-reader-desc">
        {pdf.teacherName && (
          <>
            <TeacherLink teacherId={pdf.teacherId} name={pdf.teacherName} link={linkTeacher} />
            {" · "}
          </>
        )}
        
        {before.length > 0 && `${before.join(" · ")} · `}
        
        {subject}
      </p>
      <div className="vid-reader">
        <ProtectedPdfViewer docId={pdf.id} />
      </div>
    </Modal>
  );
}

// =========================================================
// LOCKED (same rules as the catalog)
// =========================================================

export function LockedModal({ item, isLoggedIn, onClose }) {
  const pdf = isPdf(item);
  const gName = gradeName(item);
  return (
    <Modal onClose={onClose} size="sm" labelledBy="vid-locked-title">
      <div className="vid-locked">
        <div className="vid-locked-icon">{isLoggedIn ? "🔓" : "🔒"}</div>
        <h2 id="vid-locked-title" className="vid-modal-title">
          {pdf ? "PDF" : "Vidéo"} de {gName}
        </h2>
        <p className="vid-locked-text">
          {isLoggedIn
            ? `${
                pdf ? "Ce PDF n'est pas" : "Cette vidéo n'est pas"
              } dans le niveau de ton compte. Un autre enfant dans ce niveau ? Ajoutez un abonnement pour tout débloquer.`
            : `Connecte-toi avec ton compte pour ${pdf ? "lire les PDF" : "regarder les vidéos"} de ta classe.`}
        </p>
        {isLoggedIn ? (
          <a href={subscribeLink(gName)} target="_blank" rel="noopener noreferrer" className="vid-btn-primary">
            S'abonner à ce niveau
          </a>
        ) : (
          <Link href="/login" className="vid-btn-primary">
            Connexion
          </Link>
        )}
      </div>
    </Modal>
  );
}

// =========================================================
// MODAL SHELL
// =========================================================

export function Modal({ children, onClose, size = "md", labelledBy }) {
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
      className={`vid-modal-backdrop vid-modal-backdrop-${size}`}
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