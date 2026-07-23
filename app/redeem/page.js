"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../../lib/auth";
import { auth } from "../../lib/firebaseConfig";
import "../style.css";

const STEPS = [
  { id: "input", label: "Code" },
  { id: "preview", label: "Confirmation" },
  { id: "done", label: "Terminé" },
];

function StepIndicator({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="redeem-steps">
  {STEPS.map((s, i) => {
    const state = i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming";
    return (
      <div key={s.id} className="redeem-step-wrap">
        <div className="redeem-step-dot-col">
          <div className={`redeem-step-dot redeem-step-dot-${state}`}>
            {state === "done" ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="redeem-step-check">
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          <span className={`redeem-step-label redeem-step-label-${state}`}>{s.label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`redeem-step-line redeem-step-line-${state === "done" ? "done" : "upcoming"}`} />
        )}
      </div>
    );
  })}
</div>
  );
}

function formatCodeInput(raw) {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  return clean.match(/.{1,4}/g)?.join("-") || clean;
}

export default function RedeemPage() {
  const router = useRouter();
  const { user, hydrated } = useUser();

  const [code, setCode] = useState("");
  const [step, setStep] = useState("input"); // input | preview | done
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function authedFetch(url, body) {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(body),
    });
    return { res, data: await res.json() };
  }

  async function handleCheck(e) {
    e.preventDefault();
    setError(null);

    if (!hydrated) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const cleaned = code.trim().toUpperCase();
    if (!cleaned) {
      setError("Veuillez entrer un code.");
      return;
    }

    setLoading(true);
    try {
      const { res, data } = await authedFetch("/api/redeem/check", { code: cleaned });
      if (!res.ok) {
        setError(data.error || "Code invalide.");
        return;
      }
      setPreview(data);
      setStep("preview");
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    setError(null);
    setLoading(true);
    try {
      const { res, data } = await authedFetch("/api/redeem/confirm", { code: code.trim().toUpperCase() });
      if (!res.ok) {
        setError(data.error || "Erreur lors de la validation.");
        setStep("input");
        return;
      }
      setStep("done");
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="redeem-container">
      <div className="redeem-header">
        <div className="redeem-header-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 7H4a1 1 0 00-1 1v3a2 2 0 010 4v3a1 1 0 001 1h16a1 1 0 001-1v-3a2 2 0 010-4V8a1 1 0 00-1-1z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M9 7v10" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 2" />
          </svg>
        </div>
        <h1 className="redeem-title">Ajouter une classe</h1>
        <p className="redeem-subtitle">
          {step === "input" && "Entrez le code reçu avec votre commande."}
          {step === "preview" && "Vérifiez que tout est correct avant de continuer."}
          {step === "done" && "Votre classe a été ajoutée avec succès !"}
        </p>
      </div>

      <StepIndicator current={step} />

      <div className="redeem-card">
        {step === "input" && (
          <form onSubmit={handleCheck} className="redeem-form">
            <label className="field">
              <span className="field-label">Code de la carte</span>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(formatCodeInput(e.target.value))}
                placeholder="XXXX-XXXX-XXXX"
                autoFocus
                className="redeem-code-input"
                maxLength={14}
              />
              <span className="redeem-code-hint">Le code se trouve sur la carte reçue avec votre commande.</span>
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" disabled={loading || code.length < 14} className="btn btn-primary btn-block btn-lg">
              {loading ? "Vérification..." : "Vérifier le code"}
            </button>
          </form>
        )}

        {step === "preview" && preview && (
          <div className="redeem-preview">
            <div className="redeem-preview-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 19.5A2.5 2.5 0 016.5 17H20"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="redeem-preview-label">Ce code ajoutera l'accès à :</p>
            <p className="redeem-preview-grade">{preview.gradeName}</p>
            <p className="redeem-preview-note">Valable 1 an à partir d'aujourd'hui.</p>

            {error && <p className="form-error">{error}</p>}

            <button onClick={handleConfirm} disabled={loading} className="btn btn-primary btn-block btn-lg">
              {loading ? "Ajout en cours..." : "Confirmer et ajouter"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("input");
                setPreview(null);
                setError(null);
              }}
              className="btn-text-muted"
            >
              ← Utiliser un autre code
            </button>
          </div>
        )}

        {step === "done" && preview && (
          <div className="redeem-success">
            <div className="redeem-success-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M8 12.5l2.5 2.5L16 9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="redeem-success-title">Classe ajoutée avec succès</p>
            <p className="redeem-success-text">
              Vous avez maintenant accès à toutes les leçons et examens de <strong>{preview.gradeName}</strong>.
            </p>
            <Link href="/" className="btn btn-primary btn-block btn-lg">
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}