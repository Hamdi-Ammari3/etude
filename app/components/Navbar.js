"use client";

import "./navbar.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { IoFlame, IoStar } from "react-icons/io5";
import { logoutUser } from "../../lib/auth";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";

export default function Navbar() {

    const router = useRouter();

    const pathname = usePathname();

    const { user } = useAuth();

    const { userData } = useUser();

    //Logout
    async function handleLogout() {

        try {

            await logoutUser();

            router.replace("/login");

        } catch (error) {

            console.log(error);

        }
    }

    return (
        <nav className="dashboard-navbar">

            <div className="dashboard-navbar-content">

                {/* LEFT SIDE */}
                <div className="dashboard-navbar-left">

                    <Link
                        href="/dashboard"
                        className="dashboard-logo"
                    >
                        Droussy TN
                    </Link>

                    <div className="dashboard-navbar-links">

                        <Link
                            href="/dashboard"
                            className={pathname === "/dashboard" ? "dashboard-nav-link active-link" : "dashboard-nav-link"}
                        >
                            Apprendre
                        </Link>

                        {
                        /* 
                        <Link
                            href="/leaderboard"
                            className={ pathname === "/leaderboard" ? "dashboard-nav-link active-link" : "dashboard-nav-link"}
                        >
                            Classement
                        </Link>
                        */
                        }
                       
                        <Link
                            href="/abonnement"
                            className={pathname === "/abonnement" ? "dashboard-nav-link active-link" : "dashboard-nav-link"}
                        >
                            Abonnement
                        </Link>

                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="dashboard-navbar-right">

                    <div className="dashboard-stat-pill">

                        <IoStar className="dashboard-stat-icon xp-icon" />

                        <span>{userData?.xp || 0} XP</span>

                    </div>
                    
                    {/*
                    <div className="dashboard-stat-pill">

                        <IoFlame className="dashboard-stat-icon flame-icon" />

                        <span>0 J</span>

                    </div>
                    */}

                    <button
                        className="dashboard-logout-button"
                        onClick={handleLogout}
                        title="Déconnexion"
                    >

                        <FiLogOut />

                    </button>

                    {
                        user?.photoURL ? (

                            <img
                                src={user.photoURL}
                                alt="profile"
                                className="dashboard-user-image"
                            />

                        ) : (

                            <div className="dashboard-user-avatar">

                                {
                                    (
                                        userData?.name?.charAt(0) ||
                                        user?.displayName?.charAt(0) ||
                                        user?.email?.charAt(0) ||
                                        "U"
                                    ).toUpperCase()
                                }

                            </div>

                        )
                    }

                </div>

            </div>

        </nav>
    );
}