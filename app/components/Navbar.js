"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, logoutUser } from "../../lib/auth";

export default function Navbar() {
  const { user, hydrated } = useUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleLogout() {
    logoutUser();
    setOpen(false);
    router.push("/");
  }

  const initial = user?.name?.trim()?.[0]?.toUpperCase() || "?";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          Droussy <span className="navbar-brand-accent">TN</span>
        </Link>

        <div className="navbar-actions">
          {!hydrated ? null : user ? (
            <div className="navbar-user" ref={menuRef}>
              <button
                type="button"
                className="navbar-avatar"
                onClick={() => setOpen((o) => !o)}
                aria-label="Menu du compte"
              >
                {initial}
              </button>
              {open && (
                <div className="navbar-menu">
                  <div className="navbar-menu-info">
                    <p className="navbar-menu-name">{user.name}</p>
                    <p className="navbar-menu-phone">{user.phone}</p>
                  </div>
                  <button
                    type="button"
                    className="navbar-menu-logout"
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="navbar-login-btn">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}