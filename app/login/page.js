"use client";

import "./login.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { signInWithGoogle } from "../../lib/auth";
import { DB } from "../../lib/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import {FiArrowLeft,FiLoader} from "react-icons/fi";

export default function LoginPage() {

  const router = useRouter();

  const { user, loading } = useAuth();

  const [signing, setSigning] = useState(false);

  useEffect(() => {

    if (!loading && user) {
      router.replace("/dashboard");
    }

  }, [user, loading, router]);

  async function handleGoogleLogin() {

    try {

      setSigning(true);

      const loggedUser = await signInWithGoogle();

      const userRef = doc(DB, "users", loggedUser.uid);

      const userSnap = await getDoc(userRef);

      // CREATE USER DOC IF FIRST LOGIN
      if (!userSnap.exists()) {

        await setDoc(userRef, {

          uid: loggedUser.uid,

          name: loggedUser.displayName || "",

          email: loggedUser.email || "",

          // PLAN
          plan: "free",

          // GAMIFICATION
          xp: 0,
          level: 1,
          streak: 0,

          // DAILY TRACKING
          dailyExercisesGenerated: 0,
          lastDailyReset: serverTimestamp(),

          // SUBSCRIPTION
          subscriptionStart: null,
          subscriptionEnd: null,

          // META
          createdAt: serverTimestamp(),

        });

      }

      router.replace("/dashboard");

    } catch (error) {

      console.log(error);

      alert("Échec de la connexion. Réessayez.");

    } finally {

      setSigning(false);

    }
  }

  if (loading) {

    return (
      <div className="login-loading-container">

        <FiLoader className="spin-icon" />

      </div>
    );
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <div className="login-logo">
            <h1>Etude IA</h1>
          </div>

          <h1 className="login-title">
            Apprends intelligemment avec l'IA.
          </h1>

          <p className="login-description">
            Exercices interactifs adaptés au programme tunisien. 
            Progresse avec des défis, gagne de l'XP et améliore 
            tes résultats chaque jour.
          </p>

        </div>

        <button
          className="google-login-button"
          onClick={handleGoogleLogin}
          disabled={signing}
        >

          {signing ? (
            <>
              <>

                <p>Connexion...</p>
                <FiLoader className="spin-icon" />              

              </>
            </>
          ) : (
            <>
              <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                />
                <p>Continuer avec Google</p>
                
            </>
          )}

        </button>

        <p className="login-footer-text">
          En continuant, vous acceptez nos conditions d'utilisation.
        </p>

      </div>

    </div>
  );
}