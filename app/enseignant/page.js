"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { DB, auth } from "../../lib/firebaseConfig";
import { completeLogin, logoutUser, useUser } from "../../lib/auth";
import { ALL_GRADES, GRADE_GROUPS, GRADES_WITH_SPECIALIZATION, SPECIALIZATIONS } from "../../lib/liveGrades";
import { getSubjectsForGrade } from "../../lib/liveSubjects";
import {
  VIEW_RATE_DT,
  PAYOUT_THRESHOLD_DT,
  TEACHER_FIELDS,
  millimesToDT,
  REQUIRE_REVIEW,
  MIN_DURATION_SEC,
  MAX_VIDEO_BYTES,
  DEFAULT_THUMBNAIL_URL,
  TITLE_MIN,
  TITLE_MAX,
  TRIMESTRES,
  STATUS_LABELS,
  IN_PROGRESS_STATUSES,
} from "../../lib/videoConfig";
import {
  isInAppBrowser,
  isVideoFile,
  probeFileStart,
  readVideoDuration,
  startVideoUpload,
  keepScreenAwake,
  formatEta,
  formatSpeed,
} from "../../lib/mobileUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import "../homePage.css";
import "./enseignantPage.css";

const TEACHER_WHATSAPP = "2165110183";
const WHATSAPP_MESSAGE = "Bonjour Droussy TN, je souhaite devenir enseignant sur la plateforme.";

const THUMB_COLORS = ["sun", "coral", "sky", "mint", "grape"];
const STATUS_POLL_MS = 15000;
const POLL_WINDOW_MS = 24 * 60 * 60 * 1000; // only poll videos created in the last 24h

// ---------- Helpers ----------

function toJsDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  return new Date(value);
}

function formatDuration(sec) {
  if (!Number.isFinite(sec) || sec <= 0) return "0:00";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

function formatNumber(n) {
  return (n || 0).toLocaleString("fr-FR");
}

function formatMoney(n) {
  return (n || 0).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function colorFor(key = "") {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return THUMB_COLORS[hash % THUMB_COLORS.length];
}

// Authenticated JSON request to our API (any method).
async function apiRequest(url, { method = "POST", body } = {}) {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error("Session expirée. Reconnectez-vous.");
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${idToken}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
  return data;
}

function authFetch(url, body) {
  return apiRequest(url, { method: "POST", body });
}

// =========================================================
// PAGE
// =========================================================

export default function EnseignantDashboard() {
  const { user, hydrated } = useUser();
  const router = useRouter();

  // ---- Login form state ----
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError(null);

    if (!/^\d{8}$/.test(phone.trim())) {
      return setLoginError("Le numéro doit contenir exactement 8 chiffres.");
    }
    if (!/^\d{4}$/.test(password.trim())) {
      return setLoginError("La clé enseignant doit contenir 4 chiffres.");
    }

    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password: password.trim(), loginAs: "teacher" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Connexion impossible.");
        return;
      }
      await completeLogin(data.token);
      router.push("/enseignant");
    } catch {
      setLoginError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  // ---- Dashboard state ----
  const isTeacher = hydrated && user?.role === "teacher";
  const [myVideos, setMyVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // Card menu, edit and delete
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [deletingVideo, setDeletingVideo] = useState(null);

  useEffect(() => {
    if (!isTeacher) return;
    let cancelled = false;

    async function loadVideos() {
      setVideosLoading(true);
      setVideosError(null);
      try {
        // Single-field query → no composite index needed; sorted client-side.
        const snap = await getDocs(query(collection(DB, "videos"), where("teacherId", "==", user.uid)));
        if (cancelled) return;
        const list = snap.docs
          .map((d) => {
            const data = d.data();
            return { id: d.id, ...data, createdAt: toJsDate(data.createdAt) };
          })
          .filter((v) => v.status !== "deleted" && v.status !== "failed")
          .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        setMyVideos(list);
      } catch (err) {
        console.error(err);
        if (!cancelled) setVideosError("Impossible de charger vos vidéos. Réessayez plus tard.");
      } finally {
        if (!cancelled) setVideosLoading(false);
      }
    }

    loadVideos();
    return () => {
      cancelled = true;
    };
  }, [isTeacher, user?.uid]);

  // ---- Poll Bunny for videos still uploading/encoding ----
  const pollIds = myVideos
    .filter(
      (v) =>
        IN_PROGRESS_STATUSES.includes(v.status) &&
        (!v.createdAt || Date.now() - v.createdAt.getTime() < POLL_WINDOW_MS)
    )
    .map((v) => v.id)
    .slice(0, 10);
  const pollKey = pollIds.join(",");

  useEffect(() => {
    if (!isTeacher || !pollKey) return;
    let cancelled = false;

    async function poll() {
      try {
        const { videos } = await authFetch("/api/videos/sync-status", { videoIds: pollKey.split(",") });
        if (cancelled || !videos) return;
        setMyVideos((prev) =>
          prev
            .map((v) =>
              videos[v.id] && !videos[v.id].error
                ? { ...v, status: videos[v.id].status, durationSec: videos[v.id].durationSec || v.durationSec }
                : v
            )
            .filter((v) => v.status !== "failed")
        );
      } catch (err) {
        console.warn("Status polling failed", err);
      }
    }

    const t = setInterval(poll, STATUS_POLL_MS);
    const first = setTimeout(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(t);
      clearTimeout(first);
    };
  }, [isTeacher, pollKey]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 8000);
    return () => clearTimeout(t);
  }, [successMsg]);

  // ---- Earnings account (fresh read: balance changes as students watch) ----
  const [account, setAccount] = useState(null);
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    if (!isTeacher) return;
    let cancelled = false;
    async function loadAccount() {
      try {
        const [userSnap, payoutSnap] = await Promise.all([
          getDoc(doc(DB, "users", user.uid)),
          getDocs(query(collection(DB, "payouts"), where("teacherId", "==", user.uid))),
        ]);
        if (cancelled) return;
        setAccount(userSnap.exists() ? userSnap.data() : {});
        setPayouts(
          payoutSnap.docs
            .map((d) => ({ id: d.id, ...d.data(), paidAt: toJsDate(d.data().paidAt) }))
            .sort((a, b) => (b.paidAt?.getTime() || 0) - (a.paidAt?.getTime() || 0))
        );
      } catch (err) {
        console.error("Chargement du solde impossible", err);
        if (!cancelled) setAccount({});
      }
    }
    loadAccount();
    return () => {
      cancelled = true;
    };
  }, [isTeacher, user?.uid]);

  function handleUploaded(video) {
    setMyVideos((prev) => [video, ...prev.filter((v) => v.id !== video.id)]);
    setModalOpen(false);
    setSuccessMsg(
      REQUIRE_REVIEW
        ? "Vidéo envoyée ! 🎉 Elle est en cours de traitement, puis sera vérifiée par l'équipe Droussy avant d'être visible."
        : "Vidéo envoyée ! 🎉 Elle sera visible dès la fin du traitement."
    );
  }

  function handleEdited(id, title) {
    setMyVideos((prev) => prev.map((v) => (v.id === id ? { ...v, title } : v)));
    setEditingVideo(null);
    setSuccessMsg("Titre mis à jour ✅");
  }

  function handleDeleted(id) {
    setMyVideos((prev) => prev.filter((v) => v.id !== id));
    setDeletingVideo(null);
    setSuccessMsg("Vidéo supprimée.");
  }

  function closeVideoModal() {
    setModalOpen(false);
    setEditingVideo(null);
  }

  // ---- Stats ----
  // Balance & totals come from the teacher's account (server-written).
  // Falls back to summing video views until the account has been read.
  const summedViews = myVideos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalViews = account?.[TEACHER_FIELDS.VIEWS_TOTAL] ?? summedViews;
  const balanceDT = millimesToDT(account?.[TEACHER_FIELDS.BALANCE]);
  const paidDT = millimesToDT(account?.[TEACHER_FIELDS.PAID_TOTAL]);
  const payoutProgress = Math.min(100, Math.round((balanceDT / PAYOUT_THRESHOLD_DT) * 100));
  const payoutReady = balanceDT >= PAYOUT_THRESHOLD_DT;
  const publishedCount = myVideos.filter((v) => v.status === "published").length;
  const waitingCount = myVideos.filter((v) => ["uploading", "encoding", "pending"].includes(v.status)).length;

  // =========================================================
  // RENDER
  // =========================================================

  if (!hydrated) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="home-page">
        <div className="ens-login-page">
          <div className="ens-login-grid">
            <div className="ens-login-intro">
              <span className="ens-login-badge">Espace professionnel</span>
              <h1 className="ens-login-intro-title">🏫 Connexion enseignant</h1>
              <p className="ens-login-intro-text">
                Publiez vos vidéos de cours, suivez vos vues du mois et vos revenus depuis votre tableau de
                bord.
              </p>
              <ul className="ens-login-features">
                <li>🎬 Publication de vidéos de cours</li>
                <li>👁 Suivi de vos vues chaque mois</li>
                <li>💰 {formatMoney(VIEW_RATE_DT * 100)} DT pour chaque 100 vues</li>
              </ul>
              <a
                href={`https://wa.me/${TEACHER_WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ens-login-whatsapp-btn"
              >
                💬 Créer un compte via WhatsApp
              </a>
            </div>

            <form onSubmit={handleLogin} className="ens-login-form-card">
              <h2 className="ens-login-form-title">Accès à votre compte</h2>
              <p className="ens-login-form-sub">Réservé aux enseignants partenaires de Droussy TN.</p>

              <div className="ens-login-field">
                <label htmlFor="tphone" className="ens-login-label">
                  📱 Numéro de téléphone
                </label>
                <div className="ens-login-phone-row">
                  <span className="ens-login-phone-prefix">🇹🇳 +216</span>
                  <input
                    id="tphone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="username"
                    maxLength={8}
                    placeholder="20112233"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    className="ens-login-phone-input"
                  />
                </div>
              </div>

              <div className="ens-login-field">
                <label htmlFor="tkey" className="ens-login-label">
                  🔐 Clé enseignant (4 chiffres)
                </label>
                <input
                  id="tkey"
                  type="text"
                  inputMode="numeric"
                  autoComplete="current-password"
                  maxLength={4}
                  placeholder="1234"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="ens-login-password-input"
                />
              </div>

              {loginError && <p className="ens-login-error">{loginError}</p>}

              <button type="submit" disabled={loginLoading} className="ens-login-submit-btn">
                {loginLoading ? "Connexion..." : "Accéder à mon tableau de bord"}
              </button>

              <p className="ens-login-switch">
                Vous êtes élève ?{" "}
                <a href="/login" className="ens-login-switch-link">
                  Connexion élève
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "teacher") {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="ens-board">
        {/* ---------- Header ---------- */}
        <div className="ens-board-header">
          <div>
            <h1 className="ens-board-title">🏫 Bonjour {user.name?.split(" ")[0]}</h1>
            <p className="ens-board-sub">Publiez vos vidéos et suivez vos vues du mois.</p>
          </div>

          <div className="ens-header-actions">
            <button type="button" onClick={() => setModalOpen(true)} className="ens-new-video-btn">
              + Publier une vidéo
            </button>
            {/*
            <button type="button" onClick={handleLogout} className="ens-logout-btn">
              Déconnexion
            </button>
            */}
          </div>
        </div>

        {successMsg && <p className="ens-success-banner">{successMsg}</p>}

        {/* ---------- Stats ---------- */}
        <section className="ens-stats-grid">
          <div className="ens-stat-card ens-stat-card-mint">
            <p className="ens-stat-label">💰 Solde à recevoir</p>
            <p className="ens-stat-value">{formatMoney(balanceDT)} DT</p>
            {/*
            <div
              className="ens-payout-track"
              role="progressbar"
              aria-valuenow={payoutProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progression vers le versement de ${PAYOUT_THRESHOLD_DT} DT`}
            >
              <div className="ens-payout-bar" style={{ width: `${payoutProgress}%` }} />
            </div>
            <p className="ens-stat-hint">
              {payoutReady
                ? "🎉 Seuil atteint — votre versement est en préparation"
                : `Versement dès ${PAYOUT_THRESHOLD_DT} DT · encore ${formatMoney(PAYOUT_THRESHOLD_DT - balanceDT)} DT`}
            </p>
            */}
          </div>
          <div className="ens-stat-card ens-stat-card-sun">
            <p className="ens-stat-label">👁 Vues totales</p>
            <p className="ens-stat-value">{formatNumber(totalViews)}</p>
            {/*
            <p className="ens-stat-hint">
              {formatMoney(VIEW_RATE_DT)} DT par vue · 1 élève = 1 vue par vidéo
            </p>
            */}
          </div>
          <div className="ens-stat-card">
            <p className="ens-stat-label">🎬 Vidéos publiées</p>
            <p className="ens-stat-value">{publishedCount}</p>
            {/*
            <p className="ens-stat-hint">
              {waitingCount > 0 ? `+ ${waitingCount} en traitement ou en validation` : "Au total"}
            </p>
            */}
          </div>
        </section>

        {/* ---------- Payouts ---------- */}
        {payouts.length > 0 && (
          <section className="ens-payouts">
            <div className="ens-payouts-head">
              <h2 className="ens-section-title ens-section-title-inline">💸 Mes versements</h2>
              <span className="ens-payouts-total">Total versé : {formatMoney(paidDT)} DT</span>
            </div>
            <ul className="ens-payout-list">
              {payouts.slice(0, 6).map((p) => (
                <li key={p.id} className="ens-payout-item">
                  <span className="ens-payout-date">
                    {p.paidAt
                      ? p.paidAt.toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" })
                      : "—"}
                  </span>
                  <span className="ens-payout-amount">{formatMoney(millimesToDT(p.amountMillimes))} DT</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Videos ---------- */}
        <h2 className="ens-section-title">Mes vidéos</h2>

        {videosLoading ? (
          <LoadingSpinner />
        ) : videosError ? (
          <p className="ens-login-error">{videosError}</p>
        ) : myVideos.length === 0 ? (
          <div className="ens-empty-card">
            <p className="ens-empty-emoji">🎬</p>
            <p className="ens-empty-title">Aucune vidéo pour l'instant</p>
            <p className="ens-empty-text">Publiez votre première leçon et commencez à gagner avec vos vues.</p>
            <button type="button" onClick={() => setModalOpen(true)} className="ens-new-video-btn">
              + Publier une vidéo
            </button>
          </div>
        ) : (
          <div className="ens-video-grid">
            {myVideos.map((v) => (
              <TeacherVideoCard
                key={v.id}
                video={v}
                menuOpen={openMenuId === v.id}
                onToggleMenu={() => setOpenMenuId((cur) => (cur === v.id ? null : v.id))}
                onCloseMenu={() => setOpenMenuId(null)}
                onEdit={() => {
                  setOpenMenuId(null);
                  setEditingVideo(v);
                }}
                onDelete={() => {
                  setOpenMenuId(null);
                  setDeletingVideo(v);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <PublishVideoModal
        open={modalOpen || !!editingVideo}
        editVideo={editingVideo}
        onClose={closeVideoModal}
        user={user}
        onUploaded={handleUploaded}
        onEdited={handleEdited}
      />

      {deletingVideo && (
        <DeleteVideoModal video={deletingVideo} onClose={() => setDeletingVideo(null)} onDeleted={handleDeleted} />
      )}
    </div>
  );
}

// =========================================================
// VIDEO CARD (with ⋮ menu)
// =========================================================

function TeacherVideoCard({ video, menuOpen, onToggleMenu, onCloseMenu, onEdit, onDelete }) {
  const color = colorFor(video.subjectId || video.subjectName);
  const trimestre = TRIMESTRES.find((t) => t.id === video.trimestre);
  const menuRef = useRef(null);

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onCloseMenu();
    }
    function onKey(e) {
      if (e.key === "Escape") onCloseMenu();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, onCloseMenu]);

  return (
    <article className={`ens-video-card ${menuOpen ? "ens-video-card-menu-open" : ""}`}>
      <div className={`ens-video-thumb ens-thumb-${color}`}>
        <img src={video.thumbnailUrl || DEFAULT_THUMBNAIL_URL} alt={video.title} loading="lazy" />

        {video.status && video.status !== "published" && (
          <span className={`ens-video-status ens-video-status-${video.status}`}>
            {STATUS_LABELS[video.status] || video.status}
          </span>
        )}

        <span className="ens-video-duration">{formatDuration(video.durationSec)}</span>
      </div>

      <div className="ens-video-menu-wrap" ref={menuRef}>
        <button
          type="button"
          className="ens-video-menu-btn"
          onClick={onToggleMenu}
          aria-label={`Options pour ${video.title}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="5" r="2" fill="currentColor" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="19" r="2" fill="currentColor" />
          </svg>
        </button>

        {menuOpen && (
          <div className="ens-video-menu" role="menu">
            <button type="button" role="menuitem" className="ens-video-menu-item" onClick={onEdit}>
              <span aria-hidden="true">✏️</span> Modifier le titre
            </button>
            <button
              type="button"
              role="menuitem"
              className="ens-video-menu-item ens-video-menu-item-danger"
              onClick={onDelete}
            >
              <span aria-hidden="true">🗑️</span> Supprimer
            </button>
          </div>
        )}
      </div>

      <p className="ens-video-title">{video.title}</p>
      <div className="ens-video-meta">
        <span className="ens-video-chip">{video.gradeName}</span>
        {video.specializationName && (
          <span className="ens-video-chip ens-video-chip-muted">{video.specializationName}</span>
        )}
        <span className="ens-video-chip ens-video-chip-muted">
          {video.subjectEmoji} {video.subjectName}
        </span>
        {trimestre && <span className="ens-video-chip ens-video-chip-muted">T{trimestre.id}</span>}
      </div>
      <p className="ens-video-views">👁 {formatNumber(video.views)} vues</p>
    </article>
  );
}

// =========================================================
// DELETE CONFIRMATION
// =========================================================

function DeleteVideoModal({ video, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape" && !deleting) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [deleting, onClose]);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await apiRequest(`/api/videos/${video.id}`, { method: "DELETE" });
      onDeleted(video.id);
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  return (
    <div
      className="ens-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !deleting) onClose();
      }}
    >
      <div className="ens-modal ens-modal-sm" role="alertdialog" aria-modal="true" aria-labelledby="ens-del-title">
        <div className="ens-del-icon">🗑️</div>
        <h2 id="ens-del-title" className="ens-modal-title ens-text-center">
          Supprimer cette vidéo ?
        </h2>
        <p className="ens-del-video-title">« {video.title} »</p>
        <p className="ens-del-text">
          Elle ne sera plus visible par les élèves et ne pourra pas être récupérée.
          {(video.views || 0) > 0 && (
            <>
              {" "}
              Les <strong>{formatNumber(video.views)} vues</strong> déjà comptées restent dans votre solde.
            </>
          )}
        </p>

        {error && <p className="ens-login-error">{error}</p>}

        <div className="ens-del-actions">
          <button type="button" onClick={onClose} disabled={deleting} className="ens-btn-ghost">
            Annuler
          </button>
          <button type="button" onClick={handleDelete} disabled={deleting} className="ens-btn-danger">
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// PUBLISH / EDIT MODAL
// In edit mode, everything is shown read-only except the title.
// =========================================================

function PublishVideoModal({ open, onClose, user, onUploaded, editVideo, onEdited }) {
  const isEdit = !!editVideo;

  const [gradeId, setGradeId] = useState(ALL_GRADES[0].id);
  const [specializationId, setSpecializationId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");

  const [videoFile, setVideoFile] = useState(null);
  const [durationSec, setDurationSec] = useState(0);
  const [checkingVideo, setCheckingVideo] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState(""); // human-readable step
  const [netState, setNetState] = useState("uploading"); // uploading | retrying | offline | slow
  const [progress, setProgress] = useState(0);
  const [transfer, setTransfer] = useState(null); // { speedBps, etaSec }
  const [error, setError] = useState(null);

  // A failed video upload can be resumed where it stopped.
  const [resumable, setResumable] = useState(null); // { created, title }

  const pickInputRef = useRef(null); // file chooser (gallery, files, downloads)
  const cameraInputRef = useRef(null); // record now with the camera
  const pickerRef = useRef("files");
  const uploadCtlRef = useRef(null); // { abort, kick }
  const createdRef = useRef(null); // response of /create-upload
  const releaseWakeRef = useRef(null);

  const inAppBrowser = typeof window !== "undefined" && isInAppBrowser();
  const needsSpecialization = GRADES_WITH_SPECIALIZATION.has(gradeId);
  const subjectsForGrade = getSubjectsForGrade(gradeId);

  // Pre-fill the title when editing.
  useEffect(() => {
    if (open && editVideo) {
      setTitle(editVideo.title || "");
      setError(null);
    }
  }, [open, editVideo]);

  useEffect(() => {
    if (!needsSpecialization) setSpecializationId("");
  }, [needsSpecialization]);

  useEffect(() => {
    if (subjectsForGrade.length === 0) {
      setSubjectId("");
      return;
    }
    if (!subjectsForGrade.some((s) => s.id === subjectId)) {
      setSubjectId(subjectsForGrade[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeId]);

  // Escape to close + lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape" && !submitting) handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, submitting]);

  // Warn before leaving the page mid-upload.
  useEffect(() => {
    if (!submitting || isEdit) return;
    function onBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [submitting, isEdit]);

  // Stop everything if the component unmounts mid-upload.
  useEffect(
    () => () => {
      uploadCtlRef.current?.abort();
      releaseWakeRef.current?.();
    },
    []
  );

  function resetForm() {
    setTitle("");
    setVideoFile(null);
    setDurationSec(0);
    setProgress(0);
    setTransfer(null);
    setStage("");
    setNetState("uploading");
    setError(null);
    setResumable(null);
    createdRef.current = null;
    if (pickInputRef.current) pickInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  // Tell the server the half-created video is abandoned (with the reason).
  function abandonCreated(reason, extra = {}) {
    const created = createdRef.current;
    if (!created) return;
    authFetch("/api/videos/sync-status", {
      videoIds: [created.videoId],
      abandon: true,
      reason: String(reason).slice(0, 450),
      clientInfo: {
        fileType: videoFile?.type || "unknown",
        fileSizeMB: videoFile ? Math.round(videoFile.size / (1024 * 1024)) : undefined,
        online: typeof navigator !== "undefined" ? navigator.onLine : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        ...extra,
      },
    }).catch(() => {});
    createdRef.current = null;
  }

  function handleClose() {
    if (submitting) return;
    if (resumable) abandonCreated("closed_after_failed_upload", { stage: "video_upload" });
    resetForm();
    onClose();
  }

  // Sends phone-side problems to /api/uploads/report (Firestore: uploadErrors).
  function reportProblem(where, extra = {}) {
    authFetch("/api/uploads/report", {
      where,
      picker: pickerRef.current,
      online: typeof navigator !== "undefined" ? navigator.onLine : undefined,
      inAppBrowser,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      ...extra,
    }).catch(() => {});
  }

  function openPicker(kind) {
    pickerRef.current = kind;
    setError(null);
    (kind === "camera" ? cameraInputRef : pickInputRef).current?.click();
  }

  async function onVideoChange(e) {
    setError(null);
    setResumable(null);
    const f = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again
    if (!f) return;

    const fileInfo = {
      fileName: f.name,
      fileType: f.type || "",
      fileSizeMB: Math.round((f.size / (1024 * 1024)) * 10) / 10,
      lastModified: f.lastModified || 0,
    };

    if (!isVideoFile(f)) {
      reportProblem("select_not_video", fileInfo);
      setError("Ce fichier n'est pas une vidéo. Choisissez une vidéo (MP4, MOV…).");
      return;
    }
    if (f.size > MAX_VIDEO_BYTES) {
      setError("La vidéo ne doit pas dépasser 2 Go.");
      return;
    }

    setCheckingVideo(true);
    const probe = await probeFileStart(f);
    if (!probe.ok) {
      reportProblem("read_check", { ...fileInfo, errorName: probe.errorName, errorMessage: probe.errorMessage });
      setCheckingVideo(false);
      setVideoFile(null);
      setError(
        pickerRef.current === "camera"
          ? "Impossible de lire la vidéo filmée. Réessayez, ou choisissez-la depuis « Choisir une vidéo »."
          : "Le téléphone ne permet pas de lire cette vidéo depuis le site. Essayez « 🎥 Filmer maintenant », ou choisissez la vidéo depuis l'application « Fichiers » (dossier DCIM › Camera ou Téléchargements)."
      );
      return;
    }
    setVideoFile(f);
    setDurationSec(await readVideoDuration(f));
    setCheckingVideo(false);
  }

  // ---- Edit mode: only the title changes ----
  async function handleSaveTitle(e) {
    e.preventDefault();
    setError(null);
    const cleanTitle = title.trim().replace(/\s+/g, " ");
    if (cleanTitle.length < TITLE_MIN) {
      return setError(`Écrivez un titre clair pour la leçon (${TITLE_MIN} caractères minimum).`);
    }
    if (cleanTitle === editVideo.title) {
      handleClose();
      return;
    }
    setSubmitting(true);
    try {
      const data = await apiRequest(`/api/videos/${editVideo.id}`, { method: "PATCH", body: { title: cleanTitle } });
      setSubmitting(false);
      resetForm();
      onEdited(editVideo.id, data.title || cleanTitle);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  // ---- Video upload (used by the first attempt AND by "Reprendre") ----
  async function runVideoUpload(created, cleanTitle) {
    setStage("Envoi de la vidéo...");
    setNetState("uploading");
    const ctl = startVideoUpload(videoFile, created, {
      title: cleanTitle,
      onProgress: (fraction, info) => {
        setProgress(fraction);
        setTransfer({ speedBps: info.speedBps, etaSec: info.etaSec });
      },
      onState: (s) => setNetState(s),
    });
    uploadCtlRef.current = ctl;
    await ctl.promise;
    uploadCtlRef.current = null;
  }

  async function finishUpload(created) {
    setStage("Finalisation...");
    setProgress(1);
    let status = "encoding";
    try {
      const { videos } = await authFetch("/api/videos/sync-status", { videoIds: [created.videoId] });
      if (videos?.[created.videoId]?.status) status = videos[created.videoId].status;
    } catch {
      /* polling on the dashboard will pick it up */
    }
    const video = {
      ...created.video,
      id: created.videoId,
      status: status === "uploading" ? "encoding" : status,
      createdAt: new Date(),
    };
    createdRef.current = null;
    setSubmitting(false);
    resetForm();
    onUploaded(video);
  }

  function onVideoUploadFailed(err) {
    uploadCtlRef.current = null;
    // Keep the Bunny video: the teacher can resume from where it stopped.
    setResumable({ created: createdRef.current });
    setError(err.message || "L'envoi a été interrompu.");
    setSubmitting(false);
    setStage("");
    // Record why (the video stays "uploading" until resumed or abandoned).
    console.error("Video upload stopped", err?.cause || err);
    reportProblem("video_upload", {
      errorName: err?.cause?.name || err?.name,
      errorMessage: String(err?.cause?.message || err?.message || err).slice(0, 380),
      httpStatus: err?.httpStatus || undefined,
      uploadedPercent: Math.round((err?.fraction || 0) * 100),
      fileType: videoFile?.type || "",
      fileSizeMB: videoFile ? Math.round(videoFile.size / (1024 * 1024)) : undefined,
      videoId: createdRef.current?.videoId,
    });
  }

  // ---- Publish mode ----
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const cleanTitle = title.trim().replace(/\s+/g, " ");
    if (cleanTitle.length < TITLE_MIN) {
      return setError(`Écrivez un titre clair pour la leçon (${TITLE_MIN} caractères minimum).`);
    }
    if (!subjectId) return setError("Choisissez une matière.");
    if (needsSpecialization && !specializationId) return setError("Choisissez une spécialité pour ce niveau.");
    if (!videoFile) return setError("Ajoutez le fichier vidéo.");
    if (checkingVideo) return setError("Vérification de la vidéo en cours, patientez une seconde.");
    if (durationSec > 0 && durationSec < MIN_DURATION_SEC) {
      return setError(`La vidéo doit durer au moins ${Math.round(MIN_DURATION_SEC / 60)} minutes.`);
    }

    const grade = ALL_GRADES.find((g) => g.id === gradeId);
    const subject = subjectsForGrade.find((s) => s.id === subjectId);
    const specialization = needsSpecialization ? SPECIALIZATIONS.find((s) => s.id === specializationId) : null;

    setSubmitting(true);
    setProgress(0);
    setTransfer(null);
    releaseWakeRef.current = keepScreenAwake();
    let stageName = "create";

    try {
      // 1) Server creates the Bunny video + Firestore doc, returns signed upload credentials
      stageName = "create";
      setStage("Préparation de l'envoi...");
      setNetState("uploading");
      const created = await authFetch("/api/videos/create-upload", {
        title: cleanTitle,
        gradeId,
        gradeName: grade?.name || "",
        specializationId: specialization?.id || null,
        specializationName: specialization?.name || null,
        subjectId,
        subjectName: subject?.name || "",
        subjectEmoji: subject?.emoji || "📚",
        clientDurationSec: Math.round(durationSec),
      });
      createdRef.current = created;

      // 2) Video → Bunny (resumable, self-healing)
      stageName = "video_upload";
      await runVideoUpload(created, cleanTitle);

      // 3) Done
      await finishUpload(created);
    } catch (err) {
      if (stageName === "video_upload") {
        onVideoUploadFailed(err);
      } else {
        console.error("Upload failed at stage", stageName, err);
        setError(err?.message || "L'envoi a échoué. Vérifiez votre connexion et réessayez.");
        setSubmitting(false);
        setStage("");
      }
    } finally {
      releaseWakeRef.current?.();
      releaseWakeRef.current = null;
    }
  }

  // "Reprendre l'envoi" — continues the SAME Bunny video from the last byte received.
  async function handleResume() {
    const created = resumable?.created || createdRef.current;
    if (!created || !videoFile) return;
    setError(null);
    setResumable(null);
    setSubmitting(true);
    releaseWakeRef.current = keepScreenAwake();
    try {
      await runVideoUpload(created, title.trim().replace(/\s+/g, " "));
      await finishUpload(created);
    } catch (err) {
      onVideoUploadFailed(err);
    } finally {
      releaseWakeRef.current?.();
      releaseWakeRef.current = null;
    }
  }

  async function handleCancelUpload() {
    const ctl = uploadCtlRef.current;
    uploadCtlRef.current = null;
    await ctl?.abort();
    abandonCreated("cancelled_by_teacher", { stage: "video_upload", uploadedPercent: Math.round(progress * 100) });
    releaseWakeRef.current?.();
    releaseWakeRef.current = null;
    setSubmitting(false);
    setResumable(null);
    setStage("");
    setProgress(0);
    setTransfer(null);
    setError("Envoi annulé.");
  }

  if (!open) return null;

  const percent = Math.round(progress * 100);
  const netLabel =
    netState === "offline"
      ? "📡 Connexion perdue — l'envoi reprendra automatiquement dès le retour du réseau."
      : netState === "retrying"
      ? "🔄 Connexion instable — nouvelle tentative en cours..."
      : netState === "slow"
      ? "🐢 Connexion lente — l'envoi continue, patientez."
      : null;

  return (
    <div
      className="ens-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="ens-modal" role="dialog" aria-modal="true" aria-labelledby="ens-modal-title">
        <div className="ens-modal-header">
          <div>
            <h2 id="ens-modal-title" className="ens-modal-title">
              {isEdit ? "Modifier la vidéo" : "Publier une nouvelle vidéo"}
            </h2>
            <p className="ens-modal-desc">
              {isEdit
                ? "Seul le titre peut être modifié. Pour changer le niveau, la matière ou la vidéo, publiez une nouvelle vidéo."
                : "Choisissez le niveau, la matière, puis ajoutez votre vidéo."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="ens-modal-close"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {isEdit ? (
          /* ---------- EDIT MODE ---------- */
          <form onSubmit={handleSaveTitle} className="ens-modal-form">
            <div className="ens-form-grid">
              <label className="ens-field">
                <span className="ens-field-label">Niveau</span>
                <input value={editVideo.gradeName || ""} disabled readOnly className="ens-input" />
              </label>

              {editVideo.specializationName && (
                <label className="ens-field">
                  <span className="ens-field-label">Spécialité</span>
                  <input value={editVideo.specializationName} disabled readOnly className="ens-input" />
                </label>
              )}

              <label className="ens-field">
                <span className="ens-field-label">Matière</span>
                <input
                  value={`${editVideo.subjectEmoji || ""} ${editVideo.subjectName || ""}`.trim()}
                  disabled
                  readOnly
                  className="ens-input"
                />
              </label>

              <label className="ens-field ens-field-full">
                <span className="ens-field-label">Titre de la leçon</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={TITLE_MAX}
                  disabled={submitting}
                  autoFocus
                  className="ens-input ens-input-editable"
                />
                <p className="ens-field-hint">
                  {title.trim().length}/{TITLE_MAX} caractères
                </p>
              </label>
            </div>

            {editVideo.thumbnailUrl && (
              <div className="ens-field">
                <span className="ens-field-label">Miniature</span>
                <img src={editVideo.thumbnailUrl} alt="" className="ens-thumb-preview ens-thumb-readonly" />
              </div>
            )}

            {error && <p className="ens-login-error">{error}</p>}

            <button type="submit" disabled={submitting} className="ens-publish-btn">
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>
        ) : (
          /* ---------- PUBLISH MODE ---------- */
          <form onSubmit={handleSubmit} className="ens-modal-form">
            {inAppBrowser && (
              <p className="ens-warn-note">
                ⚠️ Vous utilisez le navigateur de Facebook / Instagram. L'envoi de vidéos y fonctionne mal : ouvrez
                cette page dans <strong>Chrome</strong> ou <strong>Safari</strong> (menu ⋮ → « Ouvrir dans le
                navigateur »).
              </p>
            )}

            <div className="ens-form-grid">
              <label className="ens-field">
                <span className="ens-field-label">Niveau</span>
                <select
                  value={gradeId}
                  onChange={(e) => setGradeId(e.target.value)}
                  disabled={submitting || !!resumable}
                  className="ens-select"
                >
                  {GRADE_GROUPS.map((group) => (
                    <optgroup key={group.levelName} label={group.levelName}>
                      {group.grades.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>

              {needsSpecialization && (
                <label className="ens-field">
                  <span className="ens-field-label">Spécialité</span>
                  <select
                    value={specializationId}
                    onChange={(e) => setSpecializationId(e.target.value)}
                    disabled={submitting || !!resumable}
                    className="ens-select"
                  >
                    <option value="">— Choisir —</option>
                    {SPECIALIZATIONS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="ens-field">
                <span className="ens-field-label">Matière</span>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  disabled={submitting || !!resumable}
                  className="ens-select"
                >
                  {subjectsForGrade.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.emoji} {s.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ens-field ens-field-full">
                <span className="ens-field-label">Titre de la leçon</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={TITLE_MAX}
                  disabled={submitting || !!resumable}
                  placeholder="Ex : Les fractions — addition et soustraction"
                  className="ens-input"
                />
                <p className="ens-field-hint">Utilisez le nom de la leçon tel qu'il apparaît dans le programme.</p>
              </label>
            </div>

            <div className="ens-field">
              <span className="ens-field-label">Vidéo de la leçon</span>

              {/* Normal file chooser: gallery, Files app, downloads, WhatsApp… */}
              <input
                ref={pickInputRef}
                type="file"
                accept="video/*,.mp4,.mov,.m4v,.3gp,.webm,.mkv,application/octet-stream"
                onChange={onVideoChange}
                className="ens-hidden-input"
                tabIndex={-1}
                aria-hidden="true"
              />
              {/* Record directly with the phone camera */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                onChange={onVideoChange}
                className="ens-hidden-input"
                tabIndex={-1}
                aria-hidden="true"
              />

              {videoFile ? (
                <div className="ens-file-card">
                  <span className="ens-file-card-icon">🎬</span>
                  <div className="ens-file-card-info">
                    <p className="ens-file-card-name">{videoFile.name || "Vidéo"}</p>
                    <p className="ens-file-card-meta">
                      {(videoFile.size / (1024 * 1024)).toFixed(0)} Mo ·{" "}
                      {durationSec > 0 ? `Durée ${formatDuration(durationSec)}` : "durée calculée après l'envoi"}
                    </p>
                  </div>
                  {!submitting && !resumable && (
                    <button type="button" className="ens-file-card-change" onClick={() => openPicker("files")}>
                      Changer
                    </button>
                  )}
                </div>
              ) : (
                <div className="ens-pick-row">
                  <button
                    type="button"
                    className="ens-pick-btn"
                    onClick={() => openPicker("files")}
                    disabled={submitting || checkingVideo}
                  >
                    <span className="ens-pick-emoji">📁</span>
                    <span className="ens-pick-title">Choisir une vidéo</span>
                    <span className="ens-pick-sub">Galerie, fichiers, téléchargements</span>
                  </button>
                  {/* 
                  <button
                    type="button"
                    className="ens-pick-btn"
                    onClick={() => openPicker("camera")}
                    disabled={submitting || checkingVideo}
                  >
                    <span className="ens-pick-emoji">🎥</span>
                    <span className="ens-pick-title">Filmer maintenant</span>
                    <span className="ens-pick-sub">Avec la caméra du téléphone</span>
                  </button>
                  */}
                </div>
              )}
              <p className="ens-field-hint">
                {checkingVideo
                  ? "Vérification de la vidéo..."
                  : `MP4 recommandé · ${Math.round(MIN_DURATION_SEC / 60)} min minimum · 2 Go maximum`}
              </p>
            </div>

            {REQUIRE_REVIEW && !submitting && !resumable && (
              <p className="ens-review-note">
                🛡️ Votre vidéo sera vérifiée par l'équipe Droussy avant d'être visible par les élèves.
              </p>
            )}

            {submitting && (
              <div className="ens-progress" aria-live="polite">
                <div className="ens-progress-track">
                  <div
                    className={`ens-progress-bar ${netState !== "uploading" ? "ens-progress-bar-waiting" : ""}`}
                    style={{ width: `${Math.max(percent, 2)}%` }}
                  />
                </div>
                <div className="ens-progress-row">
                  <p className="ens-progress-label">
                    {stage} <strong>{percent}%</strong>
                    {transfer?.etaSec != null && netState === "uploading" && percent > 3 && percent < 100 && (
                      <>
                        {" "}
                        · {formatEta(transfer.etaSec)} restantes
                        {transfer.speedBps ? ` (${formatSpeed(transfer.speedBps)})` : ""}
                      </>
                    )}
                  </p>
                  {uploadCtlRef.current && (
                    <button type="button" onClick={handleCancelUpload} className="ens-progress-cancel">
                      Annuler
                    </button>
                  )}
                </div>
                {netLabel && <p className="ens-net-note">{netLabel}</p>}
                <p className="ens-progress-tip">📱 Gardez cette page ouverte et l'écran allumé pendant l'envoi.</p>
              </div>
            )}

            {error && <p className="ens-login-error">{error}</p>}

            {resumable ? (
              <div className="ens-resume-row">
                <button type="button" onClick={handleResume} className="ens-publish-btn">
                  ↻ Reprendre l'envoi ({percent}%)
                </button>
                <button type="button" onClick={handleClose} className="ens-btn-ghost">
                  Abandonner
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={submitting || checkingVideo}
                className="ens-publish-btn"
              >
                {submitting ? `Envoi... ${percent}%` : "Publier"}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}