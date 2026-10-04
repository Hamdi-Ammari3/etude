"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "../../../lib/auth";
import { getAccessibleGradeIds } from "../../../lib/videoAccess";
import { CONTENT_TYPES, contentTypeOf } from "../../../lib/videoConfig";
import { ContentCard, DocumentViewer, isPdf } from "../../components/DocumentCards";
import "../../homePage.css";
import "./teacherProfile.css";

const KIND_FILTERS = [
  { id: "all", emoji: "✨", label: "Tout" },
  { id: CONTENT_TYPES.VIDEO, emoji: "🎬", label: "Vidéos" },
  { id: CONTENT_TYPES.PDF, emoji: "📄", label: "PDF" },
];

// "20112233" → "20 112 233"
function formatPhone(d = "") {
  return d.length === 8 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}` : d;
}

export default function TeacherProfileClient({ teacher, items }) {
  const { user, hydrated } = useUser();
  const [kind, setKind] = useState("all");
  const [opened, setOpened] = useState(null);
  const [shareMsg, setShareMsg] = useState(null);

  const accessible = useMemo(() => getAccessibleGradeIds(user), [user]);
  const isOwner = !!user && user.uid === teacher.id;

  // Same rules as the documents page: logged in + grade subscribed (or own content).
  const isLocked = useCallback(
    (v) => !user || !(accessible.has(String(v.gradeId)) || v.teacherId === user.uid),
    [accessible, user]
  );

  const counts = useMemo(() => {
    const pdfs = items.filter(isPdf).length;
    return { all: items.length, [CONTENT_TYPES.VIDEO]: items.length - pdfs, [CONTENT_TYPES.PDF]: pdfs };
  }, [items]);

  const shown = useMemo(
    () => (kind === "all" ? items : items.filter((v) => contentTypeOf(v) === kind)),
    [items, kind]
  );

  const totalViews = useMemo(() => items.reduce((sum, v) => sum + (v.views || 0), 0), [items]);

  const whatsappHref = teacher.phone
    ? `https://wa.me/216${teacher.phone}?text=${encodeURIComponent(
        `Bonjour ${teacher.name}, je vous contacte depuis Droussy TN.`
      )}`
    : null;

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${teacher.name} — Droussy TN`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMsg("Lien du profil copié ! 🔗");
    } catch (err) {
      if (err?.name === "AbortError") return; // share sheet closed
      setShareMsg("Impossible de copier le lien.");
    }
    setTimeout(() => setShareMsg(null), 3000);
  }

  const openedLocked = opened ? isLocked(opened) : false;

  return (
    <div className="home-page">
      {/* ---------- Hero ---------- */}
      <section className="tp-hero">
        <div className="tp-container">
          <div className="tp-card">
            <span className="tp-avatar" aria-hidden="true">
              🏫
            </span>

            <div className="tp-main">
              <h1 className="tp-name">{teacher.name}</h1>
              {teacher.bio && <p className="tp-bio">{teacher.bio}</p>}

              <div className="tp-chips">
                {teacher.phone && (
                  <a href={`tel:+216${teacher.phone}`} className="tp-chip tp-chip-phone">
                    📱 +216 {formatPhone(teacher.phone)}
                  </a>
                )}
                {teacher.address && <span className="tp-chip">📍 {teacher.address}</span>}
                {teacher.whatsapp && whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="tp-chip tp-chip-whatsapp">
                    💬 WhatsApp
                  </a>
                )}
              </div>

              <p className="tp-stats">
                {counts[CONTENT_TYPES.VIDEO]} vidéo{counts[CONTENT_TYPES.VIDEO] > 1 ? "s" : ""} ·{" "}
                {counts[CONTENT_TYPES.PDF]} PDF · 👁 {totalViews.toLocaleString("fr-FR")} vue{totalViews > 1 ? "s" : ""}
              </p>
            </div>

            <div className="tp-actions">
              <button type="button" onClick={share} className="tp-btn-primary">
                🔗 Partager le profil
              </button>
              {isOwner && (
                <Link href="/enseignant" className="tp-btn-ghost">
                  ✏️ Modifier mes informations
                </Link>
              )}
              {shareMsg && (
                <p className="tp-share-msg" role="status">
                  {shareMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Documents ---------- */}
      <div className="tp-container tp-body">
        <div className="tp-list-head">
          <h2 className="tp-list-title">Documents publiés</h2>
          {items.length > 0 && (
            <div className="tp-filters" role="radiogroup" aria-label="Type de document">
              {KIND_FILTERS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  role="radio"
                  aria-checked={kind === k.id}
                  onClick={() => setKind(k.id)}
                  className={`tp-filter ${kind === k.id ? "tp-filter-active" : ""}`}
                >
                  {k.emoji} {k.label}
                  <span className="tp-filter-count">{counts[k.id] || 0}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* 
        {hydrated && !user && items.length > 0 && (
          <div className="tp-banner">
            <span className="tp-banner-emoji">👋</span>
            <p className="tp-banner-text">Connecte-toi pour ouvrir les vidéos et les PDF de ta classe.</p>
            <Link href="/login" className="tp-btn-primary">
              Connexion
            </Link>
          </div>
        )}
        */}

        {shown.length === 0 ? (
          <p className="tp-empty">
            {kind === CONTENT_TYPES.PDF
              ? "Aucun PDF pour l'instant."
              : kind === CONTENT_TYPES.VIDEO
              ? "Aucune vidéo pour l'instant."
              : "Aucun document pour l'instant."}
          </p>
        ) : (
          <div className="vid-grid tp-grid">
            {shown.map((v) => (
              <ContentCard
                key={v.id}
                item={v}
                locked={hydrated ? isLocked(v) : true}
                isLoggedIn={!!user}
                showGrade
                onClick={() => setOpened(v)}
              />
            ))}
          </div>
        )}
      </div>

      {opened && (
        <DocumentViewer
          item={opened}
          locked={openedLocked}
          isLoggedIn={!!user}
          linkTeacher={false} // already on this teacher's page
          onClose={() => setOpened(null)}
        />
      )}
    </div>
  );
}