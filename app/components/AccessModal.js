"use client";

// What a visitor / non-subscribed student sees when he opens a document —
// and the "usage limit" window (the limit itself is never shown to students).

import Link from "next/link";
import { Modal, isPdf } from "./DocumentCards";
import { SUBSCRIPTION_PRICE_DT } from "../../lib/subscription";

const DROUSSY_WHATSAPP = "21651510183";

export function subscribeHref(kind = "new") {
  const text =
    kind === "renew"
      ? "Bonjour Droussy TN, je souhaite renouveler mon abonnement."
      : kind === "limit"
      ? "Bonjour Droussy TN, mon compte a atteint sa limite d'utilisation."
      : "Bonjour Droussy TN, je souhaite m'abonner pour accéder à tous les documents.";
  return `https://wa.me/${DROUSSY_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

/** reason: "login" | "none" | "expired" | "inactive" | "quota" */
export function AccessModal({ item, reason, onClose }) {
  const pdf = item ? isPdf(item) : false;
  const what = pdf ? "ce PDF" : "cette vidéo";

  const content = {
    login: {
      icon: "🔒",
      title: "Connecte-toi pour continuer",
      text: `Connecte-toi avec ton compte pour ouvrir ${what}.`,
      cta: (
        <Link href="/login" className="vid-btn-primary">
          Connexion
        </Link>
      ),
    },
    none: {
      icon: "🔓",
      title: "Débloque tous les documents",
      text: `Avec l'abonnement, tu ouvres les vidéos et les PDF de tous les niveaux et de toutes les matières, pour ${SUBSCRIPTION_PRICE_DT} DT par an.`,
      cta: (
        <a href={subscribeHref("new")} target="_blank" rel="noopener noreferrer" className="vid-btn-primary">
          💬 S'abonner
        </a>
      ),
    },
    expired: {
      icon: "⏰",
      title: "Ton abonnement a expiré",
      text: "Renouvelle-le pour continuer à ouvrir les vidéos et les PDF.",
      cta: (
        <a href={subscribeHref("renew")} target="_blank" rel="noopener noreferrer" className="vid-btn-primary">
          💬 Renouveler
        </a>
      ),
    },
    inactive: {
      icon: "⏸️",
      title: "Abonnement suspendu",
      text: "Contacte Droussy TN sur WhatsApp pour le réactiver.",
      cta: (
        <a href={subscribeHref("renew")} target="_blank" rel="noopener noreferrer" className="vid-btn-primary">
          💬 Nous contacter
        </a>
      ),
    },
    quota: {
      icon: "⛔",
      title: "Limite d'utilisation atteinte",
      text: "Ton compte a atteint sa limite d'utilisation. Contacte Droussy TN sur WhatsApp pour continuer.",
      cta: (
        <a href={subscribeHref("limit")} target="_blank" rel="noopener noreferrer" className="vid-btn-primary">
          💬 Contacter Droussy TN
        </a>
      ),
    },
  }[reason] || null;

  if (!content) return null;

  return (
    <Modal onClose={onClose} size="sm" labelledBy="vid-access-title">
      <div className="vid-locked">
        <div className="vid-locked-icon">{content.icon}</div>
        <h2 id="vid-access-title" className="vid-modal-title">
          {content.title}
        </h2>
        <p className="vid-locked-text">{content.text}</p>
        {content.cta}
      </div>
    </Modal>
  );
}