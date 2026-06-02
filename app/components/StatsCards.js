"use client";

import "./StatsCards.css";

export default function StatsCards({level,progressPercent,lastBadge,isPremium,premiumDaysLeft,quotaText}) {

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

      {/* BADGE CARD */}
      <div className="stats-card badge-card">
        
        <div className="badge-icon">
          {lastBadge?.icon ?? "🎯"}
        </div>

        <div>

          <p className="stats-label">
            Dernier badge
          </p>

          <p className="badge-name">
            {lastBadge?.name ?? "Nouveau membre"}
          </p>

        </div>

      </div>

      {/* QUOTA CARD */}

      <div className="quota-card">

        <p className="quota-label">
          {isPremium
            ? "Plan Premium"
            : "Quota quotidien"}
        </p>

        <div className="quota-content">

          <span className="quota-number">
            {quotaText}
          </span>

          <span className="quota-subtitle">
            {isPremium
              ? `${premiumDaysLeft}j restants`
              : "exercices restants"}
          </span>

        </div>

      </div>

    </div>
  );
}