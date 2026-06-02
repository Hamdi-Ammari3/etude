"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import {isPremium,getRemainingDailyQuota} from "../../services/subscriptionService";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsCards from "../components/StatsCards";
import ExerciseGenerator from'../components/ExerciseGenerator';
import LeaderboardCard from '../components/LeaderboardCard';
import PremiumCard from '../components/PremiumCard';
import './dashboard.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const {userData,loadingUserData} = useUser();
  const router = useRouter();

  if (loadingUserData) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div>
          Chargement...
        </div>
      </ProtectedRoute>
    );
  }

  const firstName = userData?.name?.split(" ")[0] || "";
  const premiumActive = isPremium(userData);

  let premiumDaysLeft = 0;

  if (premiumActive && userData?.subscriptionEnd) {

    premiumDaysLeft = Math.max(
      0,
      Math.ceil((userData.subscriptionEnd.toDate().getTime() - Date.now()) / 86400000)
    );

  }

  const quotaText = getRemainingDailyQuota(userData);

  const xp = userData?.xp || 0;

  const xpInLevel = xp % 200;

  const pct = Math.round((xpInLevel / 200) * 100);

  return (
    <ProtectedRoute>

      <div>
        <Navbar/>        
      </div>

      <section className="dashboard-top-section">

        <HeroSection
          firstName={firstName}
          isPremium={premiumActive}
          premiumDaysLeft={premiumDaysLeft}
          usedExercises={userData?.dailyExercisesGenerated || 0}
        />

        <StatsCards
          level={userData?.level || 1}
          progressPercent={pct}
          lastBadge={null}
          isPremium={premiumActive}
          premiumDaysLeft={premiumDaysLeft}
          quotaText={quotaText}
        />

      </section>

      <section className="dashboard-content">

        <div className="dashboard-left">
          <ExerciseGenerator />
        </div>

        <div className="dashboard-right">
          <PremiumCard />
          {/* <LeaderboardCard /> */}
        </div>

      </section>

    </ProtectedRoute>
  );
}
