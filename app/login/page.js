"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeLogin, useUser } from "../../lib/auth";
import "../style.css";

function Field({ label, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, hydrated } = useUser();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && user) router.push("/");
  }, [hydrated, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!/^\d{8}$/.test(phone.trim())) {
      return setError("Numéro invalide (8 chiffres).");
    }
    if (!/^\d{4}$/.test(password.trim())) {
      return setError("Le code doit contenir 4 chiffres.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }
      await completeLogin(data.token);
      router.push("/");
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="login-title">Bienvenue</h1>
        <p className="login-subtitle">Connectez-vous pour suivre votre progression</p>
      </div>

      <div className="login-card">
        <form onSubmit={handleSubmit} className="login-form">
          <Field label="Numéro de téléphone">
            <div className="phone-input-wrap">
              <span className="phone-prefix">+216</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="22942420"
                autoFocus
                className="phone-input"
              />
            </div>
          </Field>
          <Field label="Code secret (4 chiffres)">
            <input
              type="tel"
              inputMode="numeric"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
              className="text-input"
            />
          </Field>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>

      <p className="login-back-link">
        Pas encore de compte ? Contactez-nous sur WhatsApp pour créer le vôtre.
      </p>
      <p className="login-back-link">
        <Link href="/">Retour à l'accueil</Link>
      </p>
    </div>
  );
}