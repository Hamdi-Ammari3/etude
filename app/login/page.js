"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeLogin, useUser } from "../../lib/auth";
import "../style.css";
import "../homePage.css";
import "./loginPage.css";

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
        body: JSON.stringify({ phone: phone.trim(), password: password.trim(), loginAs: "student" }),
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
    <div className="login-page">
      <div className="login-wrap">
        <span className="login-icon-badge">🔑</span>
        <h1 className="login-title">Connexion</h1>
        <p className="login-subtitle">Connectez-vous pour suivre votre progression</p>

        <div className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label htmlFor="phone" className="login-field-label">
                📱 Numéro de téléphone
              </label>
              <div className="login-phone-row">
                <span className="login-phone-prefix">🇹🇳 +216</span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="username"
                  maxLength={8}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  placeholder="22942420"
                  autoFocus
                  className="login-phone-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="login-field-label">
                🔒 Code secret (4 chiffres)
              </label>
              <input
                id="password"
                type="text"
                inputMode="numeric"
                autoComplete="current-password"
                maxLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="1234"
                className="login-password-input"
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="login-hint">Pas encore de compte ? Contactez-nous sur WhatsApp pour créer le vôtre.</p>
        <p className="login-hint">
          <Link href="/">Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  );
}