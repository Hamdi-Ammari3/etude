"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "../../../lib/auth";
import DocumentsCatalog from "../../components/DocumentsCatalog";
import "../../homePage.css";
import "./teacherProfile.css";

// "20112233" → "20 112 233"
function formatPhone(d = "") {
  return d.length === 8 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}` : d;
}

/**
 * Public teacher profile: his card at the top, then his documents with the
 * same catalog as the home page (search, level, subject, type filters,
 * loaded 40 at a time) limited to this teacher.
 */
export default function TeacherProfileClient({ teacher, stats }) {
  const { user } = useUser();
  const [shareMsg, setShareMsg] = useState(null);

  const isOwner = !!user && user.uid === teacher.id;

  const whatsappHref = teacher.phone
    ? `https://wa.me/216${teacher.phone}?text=${encodeURIComponent(
        `Bonjour ${teacher.name}, je vous contacte depuis Droussy TN.`
      )}`
    : null;

  const statsLine = [
    stats?.videos != null && `${stats.videos} vidéo${stats.videos > 1 ? "s" : ""}`,
    stats?.pdfs != null && `${stats.pdfs} PDF`,
    stats?.views != null && `👁 ${stats.views.toLocaleString("fr-FR")} vue${stats.views > 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(" · ");

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}`; // without the filters
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

              {statsLine && <p className="tp-stats">{statsLine}</p>}
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

      {/* ---------- His documents: the home-page catalog, limited to this teacher ---------- */}
      <DocumentsCatalog teacherId={teacher.id} title="Documents publiés" />
    </div>
  );
}