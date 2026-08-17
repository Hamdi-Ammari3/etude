"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, logoutUser } from "../../lib/auth";
import "./navbar.css";

const STUDENT_NAV_ITEMS = [
  { href: "/direct", label: "Cours en direct" },
  { href: "/lecons", label: "Documents" },
];

export default function Navbar() {
  const { user, hydrated } = useUser();

  if (hydrated && user?.role === "teacher") {
    return <TeacherNavbar user={user} />;
  }

  return <PublicNavbar user={user} hydrated={hydrated} />;
}

function PublicNavbar({ user, hydrated }) {
  const pathname = usePathname();

  function isActive(href) {
    if (href === "/lecons") return pathname.startsWith("/lecons") || pathname.startsWith("/grade");
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const firstName = user?.name?.trim()?.split(" ")[0] || "";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="navbar-logo-badge">🎒</span>
          <span className="navbar-wordmark">
            Droussy <span className="navbar-brand-accent">TN</span>
          </span>
        </Link>

        <nav className="navbar-links">
          <span className="navbar-row-break" aria-hidden="true" />

          {STUDENT_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-link ${isActive(item.href) ? "navbar-link-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}

          {!user && (
            <Link href="/enseignant" className={`navbar-link ${isActive("/enseignant") ? "navbar-link-active" : ""}`}>
              Espace enseignant
            </Link>
          )}

          {!hydrated ? null : user ? (
            <Link
              href="/profil"
              className={`navbar-user-chip ${isActive("/profil") ? "navbar-user-chip-active" : ""}`}
            >
              <span className="navbar-user-chip-name">{firstName}</span>
            </Link>
          ) : (
            <Link href="/login" className="navbar-login-btn">
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function TeacherNavbar({ user }) {
  const router = useRouter();

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner teacher-navbar">
        <Link href="/enseignant" className="navbar-brand">
          <span className="navbar-logo-badge">🎒</span>
          <span className="navbar-wordmark">
            Droussy <span className="navbar-brand-accent">TN</span>
          </span>
        </Link>

        <nav className="navbar-links">
          <button type="button" className="navbar-logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </nav>
      </div>
    </header>
  );
}