"use client";

import Link from "next/link";

export default function AccessRequiredModal({ variant = "login", gradeId, onClose }) {
  const isLogin = variant === "login";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-icon">🔒</p>
        <h2 className="modal-title">
          {isLogin ? "Connectez-vous pour continuer" : "Cette classe n'est pas incluse dans votre compte"}
        </h2>
        <p className="modal-text">
          {isLogin
            ? "La génération d'examens personnalisés est réservée aux comptes actifs. Connectez-vous pour créer votre examen sur mesure."
            : "Débloquez cette classe pour générer des examens personnalisés et accéder à toutes ses leçons."}
        </p>
        <div className="modal-actions">
          {isLogin ? (
            <Link href="/login" className="btn btn-primary btn-block">
              Se connecter
            </Link>
          ) : (
            <Link href="/" className="btn btn-primary btn-block">
              Retour
            </Link>
          )}
          <button type="button" onClick={onClose} className="btn-text-muted">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}