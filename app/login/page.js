"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeLogin, useUser } from "../../lib/auth";
import "../style.css";
import "../homePage.css";
import "./loginPage.css";

// One login for everyone: the account's role (saved in the user doc) decides
// where we go next.
const HOME_BY_ROLE = { teacher: "/enseignant" };
const homeFor = (role) => HOME_BY_ROLE[role] || "/";

async function tryLogin(phone, password, loginAs) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password, loginAs }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export default function LoginPage() {
  const router = useRouter();
  const { user, hydrated } = useUser();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Already logged in (or just logged in): go to the right space for this role.
  useEffect(() => {
    if (hydrated && user) router.replace(homeFor(user.role));
  }, [hydrated, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const p = phone.trim();
    const code = password.trim();
    if (!/^\d{8}$/.test(p)) {
      return setError("Numéro invalide (8 chiffres).");
    }
    if (!/^\d{4}$/.test(code)) {
      return setError("Le code doit contenir 4 chiffres.");
    }

    setLoading(true);
    try {
      // The login API still checks the account type, so we try the student
      // account first, then the teacher account with the same number + code.
      let result = await tryLogin(p, code, "student");
      let role = "student";
      if (!result.ok && result.status >= 400 && result.status < 500) {
        const asTeacher = await tryLogin(p, code, "teacher");
        if (asTeacher.ok) {
          result = asTeacher;
          role = "teacher";
        }
      }

      if (!result.ok) {
        setError(result.data.error || "Numéro ou code incorrect.");
        return;
      }

      await completeLogin(result.data.token);
      router.replace(homeFor(result.data.role || result.data.user?.role || role));
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
        <p className="login-subtitle">Élèves et enseignants : connectez-vous avec votre numéro et votre code</p>

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