"use client";

import "./LeaderboardCard.css";
import { FiAward } from "react-icons/fi";

export default function LeaderboardCard() {

  return (
    <div className="leaderboard-card">

      <div className="leaderboard-header">

        <FiAward />

        <h3>
          Top élèves
        </h3>

      </div>

      <div className="leaderboard-empty">

        Sois le premier au classement !

      </div>

    </div>
  );
}