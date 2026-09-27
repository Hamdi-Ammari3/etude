"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { DB } from "../../lib/firebaseConfig";
import { logoutUser, useUser } from "../../lib/auth";
import { getLevelsWithGrades } from "../../lib/curriculum";
import { ALL_GRADES } from "../../lib/liveGrades";
import LoadingSpinner from "../components/LoadingSpinner";
import "../homePage.css";
import "./profil.css";

const DROUSSY_WHATSAPP = "2165110183";

function getGradeEmoji(gradeId) {
  const map = {
    "prim-4": "🐬",
    "prim-5": "🦁",
    "prim-6": "🚀",
    "col-7": "📘",
    "col-8": "🔬",
    "col-9": "📐",
  };
  return map[gradeId] || "🎒";
}

function getInitial(name) {
  return name?.trim()?.[0]?.toUpperCase() || "?";
}

export default function ProfilePage() {
  const { user, hydrated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.push("/login");
  }, [hydrated, user, router]);

  const purchased = user?.purchasedGrades || [];
  const purchasedKey = purchased.join(",");

  // ---- Documents: owned grades resolved against the curriculum ----
  const [docGrades, setDocGrades] = useState([]);
  const [docsLoading, setDocsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      setDocsLoading(true);
      try {
        const levels = await getLevelsWithGrades();
        if (cancelled) return;
        const all = levels.flatMap((l) => l.grades);
        setDocGrades(purchased.map((gid) => all.find((g) => g.id === gid)).filter(Boolean));
      } catch (err) {
        console.error(err);
        if (!cancelled) setDocGrades([]);
      } finally {
        if (!cancelled) setDocsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, purchasedKey]);

  // ---- Videos: count of published videos per subscribed grade ----
  const [videoCounts, setVideoCounts] = useState({});
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      setCountsLoading(true);
      const entries = await Promise.all(
        purchased.map(async (gid) => {
          try {
            const snap = await getCountFromServer(
              query(collection(DB, "videos"), where("gradeId", "==", gid), where("status", "==", "published"))
            );
            return [gid, snap.data().count];
          } catch (err) {
            console.warn("Video count failed for", gid, err);
            return [gid, null];
          }
        })
      );
      if (!cancelled) {
        setVideoCounts(Object.fromEntries(entries));
        setCountsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, purchasedKey]);

  function handleLogout() {
    logoutUser();
    router.push("/");
  }

  function gradeLabel(gid) {
    return ALL_GRADES.find((g) => g.id === gid)?.name || docGrades.find((g) => g.id === gid)?.name || gid;
  }

  if (!hydrated || !user) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="profil-page">
        {/* ---------- Identity ---------- */}
        <div className="profil-header-card">
          <span className="profil-avatar">{getInitial(user.name)}</span>
          <div className="profil-header-info">
            <h1 className="profil-name">{user.name}</h1>
            {user.phone && <p className="profil-phone">📱 +216 {user.phone}</p>}
          </div>
          <button type="button" onClick={handleLogout} className="profil-logout-btn">
            Se déconnecter
          </button>
        </div>

        {/* ---------- Video subscriptions ---------- */}
        <section className="profil-section">
          <h2 className="profil-section-title">🎬 Mes abonnements vidéo</h2>
          {purchased.length > 0 && (
            <p className="profil-section-sub">
              Chaque abonnement débloque toutes les vidéos du niveau, pour toutes les matières.
            </p>
          )}

          {purchased.length === 0 ? (
            <div className="profil-empty-box">
              <p className="profil-empty-text">Tu n'as aucun abonnement vidéo pour l'instant.</p>
              <Link href="/videos" className="profil-empty-cta profil-empty-cta-primary">
                Découvrir les vidéos
              </Link>
            </div>
          ) : (
            <ul className="profil-sub-list">
              {purchased.map((gid) => {
                const count = videoCounts[gid];
                return (
                  <li key={gid} className="profil-sub-card">
                    <span className="profil-sub-emoji">{getGradeEmoji(gid)}</span>
                    <div className="profil-sub-info">
                      <p className="profil-sub-name">Vidéos — {gradeLabel(gid)}</p>
                      <p className="profil-sub-hint">
                        {countsLoading
                          ? "Chargement..."
                          : count == null
                          ? "Toutes matières débloquées"
                          : count === 0
                          ? "Les premières vidéos arrivent bientôt"
                          : `${count} vidéo${count > 1 ? "s" : ""} débloquée${count > 1 ? "s" : ""}, toutes matières`}
                      </p>
                    </div>
                    <Link href="/videos" className="profil-watch-btn">
                      ▶ Regarder
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <a
            href={`https://wa.me/${DROUSSY_WHATSAPP}?text=${encodeURIComponent(
              "Bonjour Droussy TN, je souhaite ajouter un niveau à mon compte."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="profil-add-grade"
          >
            👨‍👩‍👧 Un autre enfant ? Ajouter un niveau via WhatsApp
          </a>
        </section>

        {/* ---------- Documents ---------- */}
        <section className="profil-section">
          <h2 className="profil-section-title">📚 Mes documents</h2>
          {docsLoading ? (
            <LoadingSpinner />
          ) : docGrades.length === 0 ? (
            <div className="profil-empty-box">
              <p className="profil-empty-text">Tu n'as encore acheté aucun niveau de documents.</p>
              <Link href="/lecons" className="profil-empty-cta profil-empty-cta-coral">
                Voir les leçons &amp; exercices
              </Link>
            </div>
          ) : (
            <div className="profil-grade-grid">
              {docGrades.map((g) => (
                <Link key={g.id} href={`/grade/${g.id}`} className="profil-grade-card">
                  <span className="profil-grade-emoji">{getGradeEmoji(g.id)}</span>
                  <div>
                    <p className="profil-grade-name">{g.name}</p>
                    <p className="profil-grade-hint">Leçons et exercices corrigés débloqués</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}