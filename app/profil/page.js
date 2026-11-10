"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser, useUser } from "../../lib/auth";
import { useSubscription } from "../../lib/useSubscription";
import { SUBSCRIPTION_PRICE_DT } from "../../lib/subscription";
import LoadingSpinner from "../components/LoadingSpinner";
import "../homePage.css";
import "./profil.css";

const DROUSSY_WHATSAPP = "21651510183";
const DAY_MS = 24 * 60 * 60 * 1000;
const EXPIRING_SOON_DAYS = 30; // "expire bientôt" + renew button from 30 days before the end

const waLink = (text) => `https://wa.me/${DROUSSY_WHATSAPP}?text=${encodeURIComponent(text)}`;

function getInitial(name) {
  return name?.trim()?.[0]?.toUpperCase() || "?";
}

function formatDate(ms) {
  return new Date(ms).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// "22942420" → "22 942 420"
function formatPhone(d = "") {
  return d.length === 8 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}` : d;
}

/**
 * Everything the subscription card shows, from subscriptionStatus().
 * Only dates are shown — never the hidden documents counter
 * (except during the free trial, whose 30 documents are part of the offer).
 */
function describeSubscription(status, now = Date.now()) {
  if (!status) return null;
  const { state, startedAt, endsAt } = status;
  const daysLeft = endsAt ? Math.max(0, Math.ceil((endsAt - now) / DAY_MS)) : null;

  if (status.trial) {
    const subscribe = { label: "💬 S'abonner sur WhatsApp", href: waLink("Bonjour Droussy TN, je suis en essai gratuit et je souhaite m'abonner.") };
    const over = state !== "active" || status.remaining <= 0;
    if (over) {
      return {
        tone: "expired",
        pill: "🎓 Essai terminé",
        title: "Ton essai gratuit est terminé",
        text: `Abonne-toi pour continuer : toutes les vidéos et tous les PDF, de tous les niveaux, pour ${SUBSCRIPTION_PRICE_DT} DT par an.`,
        startedAt,
        endsAt,
        daysLeft: null,
        elapsedPct: null,
        cta: subscribe,
      };
    }
    const elapsed = startedAt && endsAt && endsAt > startedAt ? ((now - startedAt) / (endsAt - startedAt)) * 100 : null;
    return {
      tone: "soon",
      pill: "🧪 Essai gratuit",
      title: `Encore ${status.remaining} document${status.remaining > 1 ? "s" : ""} à découvrir`,
      text: `Ton essai te permet d'ouvrir ${status.quota} vidéos ou PDF jusqu'au ${new Date(endsAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}. Abonne-toi quand tu veux pour tout débloquer pendant un an.`,
      startedAt,
      endsAt,
      daysLeft,
      elapsedPct: elapsed === null ? null : Math.min(100, Math.max(0, elapsed)),
      cta: subscribe,
    };
  }
  const expiringSoon = state === "active" && daysLeft !== null && daysLeft <= EXPIRING_SOON_DAYS;

  // Share of the subscription period already gone (time only).
  let elapsedPct = null;
  if (state === "active" && startedAt && endsAt && endsAt > startedAt) {
    elapsedPct = Math.min(100, Math.max(0, ((now - startedAt) / (endsAt - startedAt)) * 100));
  }

  if (state === "active") {
    return {
      tone: expiringSoon ? "soon" : "active",
      pill: expiringSoon ? "⏳ Expire bientôt" : "✅ Actif",
      title: "Ton abonnement est actif",
      text: "Tu as accès à toutes les vidéos et à tous les PDF de Droussy TN.",
      startedAt,
      endsAt,
      daysLeft,
      elapsedPct,
      cta: expiringSoon
        ? { label: "💬 Renouveler sur WhatsApp", href: waLink("Bonjour Droussy TN, je souhaite renouveler mon abonnement.") }
        : null,
    };
  }
  if (state === "expired") {
    return {
      tone: "expired",
      pill: "⏰ Expiré",
      title: "Ton abonnement a expiré",
      text: "Renouvelle-le pour continuer à regarder les vidéos et à lire les PDF.",
      startedAt,
      endsAt,
      daysLeft: null,
      elapsedPct: null,
      cta: { label: "💬 Renouveler sur WhatsApp", href: waLink("Bonjour Droussy TN, mon abonnement a expiré, je souhaite le renouveler.") },
    };
  }
  if (state === "inactive") {
    return {
      tone: "inactive",
      pill: "⏸️ Suspendu",
      title: "Ton abonnement est suspendu",
      text: "Contacte Droussy TN sur WhatsApp pour le réactiver.",
      startedAt,
      endsAt,
      daysLeft: null,
      elapsedPct: null,
      cta: { label: "💬 Contacter Droussy TN", href: waLink("Bonjour Droussy TN, mon abonnement est suspendu.") },
    };
  }
  return {
    tone: "none",
    pill: "Aucun abonnement",
    title: "Tu n'as pas encore d'abonnement",
    text: "Abonne-toi pour débloquer toutes les vidéos et tous les PDF. En attendant, les documents gratuits sont ouverts à tous.",
    startedAt: null,
    endsAt: null,
    daysLeft: null,
    elapsedPct: null,
    cta: { label: "💬 S'abonner sur WhatsApp", href: waLink("Bonjour Droussy TN, je souhaite m'abonner.") },
  };
}

const INCLUDED = [
  { icon: "🎒", text: "Tous les niveaux, du primaire au bac" },
  { icon: "📚", text: "Toutes les matières" },
  { icon: "🎬", text: "Les vidéos et les PDF (cours, séries, devoirs)" },
];

export default function ProfilePage() {
  const { user, hydrated } = useUser();
  const router = useRouter();
  const { status } = useSubscription(user);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.push("/login");
    else if (user.role === "teacher") router.replace("/enseignant"); // teachers have their own space
  }, [hydrated, user, router]);

  function handleLogout() {
    logoutUser();
    router.push("/");
  }

  if (!hydrated || !user || user.role === "teacher") {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  const sub = describeSubscription(status);

  return (
    <div className="home-page">
      <div className="profil-page">
        {/* ---------- Identity ---------- */}
        <div className="profil-header-card">
          <span className="profil-avatar">{getInitial(user.name)}</span>
          <div className="profil-header-info">
            <h1 className="profil-name">{user.name}</h1>
            {user.phone && <p className="profil-phone">📱 +216 {formatPhone(user.phone)}</p>}
          </div>
          <button type="button" onClick={handleLogout} className="profil-logout-btn">
            Se déconnecter
          </button>
        </div>

        {/* ---------- Subscription ---------- */}
        <section className="profil-section">
          <h2 className="profil-section-title">⭐ Mon abonnement</h2>

          {!sub ? (
            <div className="profil-sub-loading">
              <LoadingSpinner />
            </div>
          ) : (
            <div className={`profil-plan profil-plan-${sub.tone}`}>
              <div className="profil-plan-head">
                <span className={`profil-plan-pill profil-plan-pill-${sub.tone}`}>{sub.pill}</span>
                <h3 className="profil-plan-title">{sub.title}</h3>
                <p className="profil-plan-text">{sub.text}</p>
              </div>

              {(sub.startedAt || sub.endsAt) && (
                <div className="profil-plan-dates">
                  {sub.startedAt && (
                    <div className="profil-plan-date">
                      <span className="profil-plan-date-label">Début</span>
                      <span className="profil-plan-date-value">{formatDate(sub.startedAt)}</span>
                    </div>
                  )}
                  {sub.endsAt && (
                    <div className="profil-plan-date">
                      <span className="profil-plan-date-label">{sub.tone === "expired" ? "Terminé le" : "Fin"}</span>
                      <span className="profil-plan-date-value">{formatDate(sub.endsAt)}</span>
                    </div>
                  )}
                  {sub.daysLeft !== null && (
                    <div className="profil-plan-date">
                      <span className="profil-plan-date-label">Reste</span>
                      <span className="profil-plan-date-value profil-plan-days">
                        {sub.daysLeft === 0 ? "Dernier jour" : `${sub.daysLeft} jour${sub.daysLeft > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {sub.elapsedPct !== null && (
                <div
                  className="profil-plan-bar"
                  role="progressbar"
                  aria-label="Durée de l'abonnement écoulée"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(sub.elapsedPct)}
                >
                  <span style={{ width: `${sub.elapsedPct}%` }} />
                </div>
              )}

              <ul className="profil-plan-included">
                {INCLUDED.map((item) => (
                  <li key={item.text}>
                    <span aria-hidden="true">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>

              <div className="profil-plan-actions">
                <Link href="/" className="profil-btn profil-btn-primary">
                  {sub.tone === "active" || sub.tone === "soon" ? "▶ Accéder aux documents" : "Voir les documents gratuits"}
                </Link>
                {sub.cta && (
                  <a href={sub.cta.href} target="_blank" rel="noopener noreferrer" className="profil-btn profil-btn-ghost">
                    {sub.cta.label}
                  </a>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ---------- Help ---------- */}
        <section className="profil-section">
          <h2 className="profil-section-title">💬 Besoin d'aide ?</h2>
          <div className="profil-help-grid">
            <a
              href={waLink("Bonjour Droussy TN, j'ai une question.")}
              target="_blank"
              rel="noopener noreferrer"
              className="profil-help-card"
            >
              <span className="profil-help-emoji" aria-hidden="true">
                💬
              </span>
              <span>
                <span className="profil-help-title">Une question ?</span>
                <span className="profil-help-hint">Écris-nous sur WhatsApp, on te répond vite.</span>
              </span>
            </a>
            <a
              href={waLink("Bonjour Droussy TN, je souhaite créer un compte pour un autre enfant.")}
              target="_blank"
              rel="noopener noreferrer"
              className="profil-help-card"
            >
              <span className="profil-help-emoji" aria-hidden="true">
                👨‍👩‍👧
              </span>
              <span>
                <span className="profil-help-title">Un autre enfant ?</span>
                <span className="profil-help-hint">Chaque élève a son propre compte. Demande-le sur WhatsApp.</span>
              </span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}