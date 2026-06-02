"use client";

import "./PremiumCard.css";
import { FiStar } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function PremiumCard() {
  const router = useRouter();

  return (
    <div className="premium-card">

      <div className="premium-header">

        <FiStar />

        <h3>
          Passe au niveau Illimité
        </h3>

      </div>

      <p>
        Exercices illimités, accès à toutes les matières — 25 TND/mois.
      </p>

      <button
        onClick={() => router.push("/abonnement")}
      >

        S'abonner maintenant

      </button>

    </div>
  );
}