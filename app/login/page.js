"use client";

import { useEffect, useRef, useState } from "react";
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

function OtpInput({ value, onChange }) {
  const inputRef = useRef(null);
  const digits = value.padEnd(6, " ").slice(0, 6).split("");

  return (
    <div className="otp-wrap">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        autoFocus
        className="otp-hidden-input"
      />
      <div className="otp-boxes" onClick={() => inputRef.current?.focus()}>
        {digits.map((d, i) => (
          <div key={i} className={`otp-box ${value.length === i ? "otp-box-active" : ""}`}>
            {d.trim()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, hydrated } = useUser();

  // "mode" is the outer choice: signing in vs creating an account.
  // "step" is the inner OTP flow state within whichever mode is active.
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [step, setStep] = useState("info");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && user) router.push("/");
  }, [hydrated, user, router]);

  function switchMode(nextMode) {
    setMode(nextMode);
    setStep("info");
    setName("");
    setPhone("");
    setOtp("");
    setError(null);
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    setError(null);
    if (mode === "signup" && name.trim().length < 2) return setError("Veuillez entrer votre prénom.");
    if (!/^\d{8}$/.test(phone.trim())) return setError("Numéro invalide (8 chiffres).");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }
      setStep("otp");
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError(null);
    if (!/^\d{4,6}$/.test(otp.trim())) return setError("Code invalide.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          code: otp.trim(),
          mode,
          ...(mode === "signup" ? { name: name.trim() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Code incorrect.");
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

  const isSignup = mode === "signup";

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="login-title">Bienvenue</h1>
        <p className="login-subtitle">
          {step === "otp"
            ? `Nous avons envoyé un code au +216 ${phone}`
            : isSignup
            ? "Créez votre compte pour commencer"
            : "Connectez-vous pour suivre votre progression"}
        </p>
      </div>

      {step === "info" && (
        <div className="auth-mode-tabs">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`auth-mode-tab ${!isSignup ? "auth-mode-tab-active" : ""}`}
          >
            J'ai déjà un compte
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`auth-mode-tab ${isSignup ? "auth-mode-tab-active" : ""}`}
          >
            Créer un compte
          </button>
        </div>
      )}

      <div className="login-card">
        {step === "info" ? (
          <form onSubmit={handleSendOtp} className="login-form">
            {isSignup && (
              <Field label="Prénom">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amine"
                  autoFocus
                  className="text-input"
                />
              </Field>
            )}
            <Field label="Numéro de téléphone">
              <div className="phone-input-wrap">
                <span className="phone-prefix">+216</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  placeholder="12 345 678"
                  autoFocus={!isSignup}
                  className="phone-input"
                />
              </div>
            </Field>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? "Envoi..." : "Recevoir le code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="login-form">
            <Field label="Code de vérification">
              <OtpInput value={otp} onChange={setOtp} />
            </Field>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? "Vérification..." : "Vérifier et continuer"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("info");
                setOtp("");
                setError(null);
              }}
              className="btn-text-muted"
            >
              ← Modifier le numéro
            </button>
          </form>
        )}
      </div>

      <p className="login-back-link">
        <Link href="/">Retour à l'accueil</Link>
      </p>
    </div>
  );
}