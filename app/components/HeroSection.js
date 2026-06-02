"use client";
import "./HeroSection.css";

export default function HeroSection({firstName,isPremium,premiumDaysLeft,usedExercises}) {

  return (

    <div className="hero-section">

      <h1 className="hero-title">
        Bonjour{firstName ? `, ${firstName}` : ""} !
        <br />
        Prêt pour tes défis du jour ?
      </h1>

      <p className="hero-description">
        {isPremium
          ? `Abonnement Premium actif — ${premiumDaysLeft} jour${premiumDaysLeft > 1 ? "s" : ""} restant${premiumDaysLeft > 1 ? "s" : ""}.`
          : `Tu as fait ${usedExercises} exercice${usedExercises > 1 ? "s" : ""} sur 5 aujourd'hui.`}
      </p>

    </div>
    
  );

}