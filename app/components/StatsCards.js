"use client";

import "./StatsCards.css";

export default function StatsCards({level,progressPercent,isPremium,premiumDaysLeft,usedToday,quotaLimit}) {

  return (
    <div className="stats-grid">

      {/* LEVEL CARD */}
      <div className="stats-card">

        <div className="stats-card-header">

          <span className="stats-label">
            Niveau {level}
          </span>

          <span className="stats-progress-text">
            {progressPercent}% vers Niv {level + 1}
          </span>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${progressPercent}%`,
            }}
          />

        </div>

      </div>

      {/* PLAN CARD */}
      <div className={`stats-card starts-plan-card ${isPremium ? "premium-plan" : "free-plan"}`}>

        <div className="plan-badge">

          {isPremium ? "⭐" : "🆓"}

        </div>

        <div className="plan-content">

          <p className="stats-label">

            Plan actuel

          </p>

          <div className="stats-label-plan-details">

          <h3 className="plan-title">

            {isPremium ? "Premium" : "Gratuit"}

          </h3>

          <p className="plan-description">

            {isPremium
              ? `${premiumDaysLeft} jour${premiumDaysLeft > 1 ? "s" : ""} restant${premiumDaysLeft > 1 ? "s" : ""}`
              : "3 exercices par jour"}

          </p>
          </div>

        </div>

      </div>

      {/* QUOTA CARD */}
      <div className="quota-card">

        <p className="quota-label">
          Quota quotidien
        </p>

        <div className="quota-content">

          <span className="quota-number">
            {usedToday} / {quotaLimit}
          </span>

          <span className="quota-subtitle">
            générés aujourd'hui
          </span>

        </div>

      </div>

    </div>
  );
}