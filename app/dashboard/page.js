"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import {isPremium} from "../../services/subscriptionService";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsCards from "../components/StatsCards";
import ExerciseGenerator from'../components/ExerciseGenerator';
import LeaderboardCard from '../components/LeaderboardCard';
import PremiumCard from '../components/PremiumCard';
import StatisticsCard from "../components/StatisticsCard";
import {FiLoader} from "react-icons/fi";
import './dashboard.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const {userData,loadingUserData} = useUser();
  const router = useRouter();

  if (loadingUserData) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="spin-div">
          <FiLoader className="spin-icon" />
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

  const quotaLimit = premiumActive ? 30 : 3;

  const usedToday = userData?.dailyExercisesGenerated || 0;

  const xp = userData?.xp || 0;

  const xpInLevel = xp % 200;

  const pct = Math.round((xpInLevel / 200) * 100);

  const stats = Object.entries(userData?.stats?.combinations || {}).map(([key, count]) => {

    const [subject, grade] = key.split("__");

    return {
      subject,
      grade,
      count,
    };

  }).sort((a, b) => b.count - a.count);

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
          isPremium={premiumActive}
          premiumDaysLeft={premiumDaysLeft}
          quotaLimit={quotaLimit}
          usedToday={usedToday}
        />

      </section>

      <section className="dashboard-content">

        <div className="dashboard-left">
          <ExerciseGenerator />
        </div>

        <div className="dashboard-right">
          {!premiumActive && (
            <PremiumCard />
          )}
          

          <StatisticsCard
            stats={stats}
            totalExercises={userData?.stats?.totalExercises || 0}
          />
          
          {/* <LeaderboardCard /> */}
        </div>

      </section>

    </ProtectedRoute>
  );
}
