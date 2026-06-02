"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import { FiCheck,FiAward,FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import "./abonnement.css";

export default function AbonnementPage() {

    const router = useRouter();

    const { userData } = useAuth();

    const isPremium = userData?.subscriptionPlan === "premium";

    const premiumFeatures = [

        "Exercices illimités",

        "Toutes les matières débloquées",

        "Tous les niveaux de difficulté",

        "Historique complet des exercices",

        "Suivi détaillé des progrès",

        "Support prioritaire"

    ];

    return (

        <ProtectedRoute>

            <div className="subscription-page">

                <Navbar />

                <main className="subscription-container">

                    <button
                        className="subscription-back-btn"
                        onClick={() => router.push("/dashboard")}
                    >

                        <FiArrowLeft />

                        Retour au tableau de bord

                    </button>

                    <div className="subscription-header">

                        <h1>
                            Abonnement
                        </h1>

                        <p>

                            {isPremium
                                ? "Vous utilisez actuellement l'abonnement Premium."
                                : "Plan gratuit — 5 exercices par jour."}

                        </p>

                    </div>

                    <div className="plans-grid">

                        {/* FREE */}

                        <div
                            className={`plan-card ${
                                !isPremium
                                    ? "current-plan"
                                    : ""
                            }`}
                        >

                            <div>

                                <h3>
                                    Gratuit
                                </h3>

                                <div className="price">

                                    0

                                    <span>
                                        TND
                                    </span>

                                </div>

                            </div>

                            <ul className="features-list">

                                <li>
                                    <FiCheck />
                                    5 exercices par jour
                                </li>

                                <li>
                                    <FiCheck />
                                    Toutes les matières
                                </li>

                                <li>
                                    <FiCheck />
                                    Classement & badges
                                </li>

                            </ul>

                            {!isPremium && (

                                <p className="current-badge">

                                    Plan actuel

                                </p>

                            )}

                        </div>

                        {/* PREMIUM */}

                        <div
                            className={`plan-card premium-card ${
                                isPremium
                                    ? "premium-active"
                                    : ""
                            }`}
                        >

                            <div className="premium-icon">

                                <FiAward />

                            </div>

                            <div>

                                <h3>
                                    Premium
                                </h3>

                                <div className="price">

                                    25

                                    <span>
                                        TND / mois
                                    </span>

                                </div>

                            </div>

                            <ul className="features-list">

                                {premiumFeatures.map(
                                    (feature) => (

                                        <li
                                            key={feature}
                                        >

                                            <FiCheck />

                                            {feature}

                                        </li>

                                    )
                                )}

                            </ul>

                            {isPremium ? (

                                <button
                                    className="premium-button disabled"
                                >

                                    Abonnement actif

                                </button>

                            ) : (

                                <button
                                    className="whatsapp-button"
                                    style={{background:'#25d366'}}
                                    onClick={() => {

                                        const message = "Bonjour, je souhaite souscrire à l'abonnement Premium de 25 TND/mois.";

                                        const whatsappUrl = `https://wa.me/21651510183?text=${encodeURIComponent(message)}`;

                                        window.open(
                                            whatsappUrl,
                                            "_blank"
                                        );

                                    }}
                                >

                                    <FaWhatsapp size={20}/>

                                    Contactez-nous via WhatsApp

                                </button>

                            )}

                        </div>

                    </div>

                    <p className="subscription-note">

                        Paiement sécurisé.
                        L'intégration Flouci,
                        Konnect, Stripe ou Paddle
                        peut être connectée à cette
                        page.

                    </p>

                </main>

            </div>

        </ProtectedRoute>

    );

}