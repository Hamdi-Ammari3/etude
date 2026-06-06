"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import "./ExerciseGenerator.css";
import { FiZap } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { getLessons } from "../../services/curriculumService";

export default function ExerciseGenerator() {

  const router = useRouter();

  const { user } = useAuth();

  const [subject, setSubject] = useState("math");
  const [grade, setGrade] = useState("primaire_1");
  const [trimester, setTrimester] = useState(1);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState("");
  const [difficulty, setDifficulty] = useState("facile");
  const [generating, setGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showPremiumModal,setShowPremiumModal] = useState(false);
  const [quotaModalData, setQuotaModalData] = useState({
    isPremium: false,
    limit: 3,
  });

  useEffect(() => {

    const fetchedLessons = getLessons(subject,grade,trimester);

    setLessons(fetchedLessons);

    if (fetchedLessons.length > 0) {

      setLesson(fetchedLessons[0]);

    }

  }, [subject,grade,trimester]);

  //Exercise Language
  function getExerciseLanguage(subject) {

    switch (subject) {

      case "math":
        return "arabic";

      case "physics":
        return "arabic";

      case "french":
        return "french";

      case "english":
        return "english";

      default:
        return "arabic";

    }

  }

  //Generate Exercise
  async function generateExercise() {

    try {

      if (!user?.uid) {

        alert("Veuillez vous connecter.");

        return;

      }

      if (!lesson) {

        alert("Veuillez sélectionner une leçon.");

        return;

      }

      setGenerating(true);

      const language = getExerciseLanguage(subject);

      const response = await fetch("/api/generate-exercise",{
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          userId: user.uid,

          grade,

          subject,

          trimester,

          lesson,

          difficulty,

          language,

        }),
      });

      const data = await response.json();

      if (!data.success) {

        if (data.quotaReached) {

          setQuotaModalData({
            isPremium: data.isPremium,
            limit: data.limit,
          });

          setShowPremiumModal(true);

          return;

        }

        alert(data.error || "Erreur lors de la génération.");

        return;
      }

      router.push(`/exercise/${data.historyId}`);

    } catch (error) {

      console.log(error);

      alert("Erreur lors de la génération.");

    } finally {

      setGenerating(false);

    }

  }

  //Generate exercise loading
  useEffect(() => {

    if (!generating) return;

    const messages = [

      "🔬 Analyse du programme scolaire...",
      "📚 Préparation de l'exercice...",
      "✍️ Génération de la correction...",
      "🎯 Adaptation au niveau choisi...",
      "✨ Finalisation de l'exercice..."

    ];

    let index = 0;

    setLoadingMessage(messages[0]);

    const interval = setInterval(() => {

      index = (index + 1) % messages.length;

      setLoadingMessage(messages[index]);

    }, 1800);

    return () => clearInterval(interval);

  }, [generating]);

  const isPrimaryGrade = grade.startsWith("primaire_");

  const physicsLabel = isPrimaryGrade ? "🔬 Éveil Scientifique" : "⚡ Physique";

  console.log(quotaModalData)

  return (
    <div className="exercise-generator-card">

      <div className="exercise-generator-header">

        <div className="exercise-generator-icon">
          <FiZap />
        </div>

        <h2>
          Générateur d'exercices
        </h2>

      </div>

      <div className="exercise-generator-form">

        {/* GRADE */}
        <div className="generator-group">

          <label>Année</label>

          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >

            <option value="primaire_1">
             الأولى ابتدائي
            </option>

            <option value="primaire_2">
             الثانية ابتدائي
            </option>

            <option value="primaire_3">
             الثالثة ابتدائي
            </option>

            <option value="primaire_4">
             الرابعة ابتدائي
            </option>

            <option value="primaire_5">
             الخامسة ابتدائي
            </option>

            <option value="primaire_6">
             السادسة ابتدائي
            </option>

            <option value="7eme">
             السابعة أساسي
            </option>

            <option value="8eme">
             الثامنة أساسي
            </option>

            <option value="9eme">
             التاسعة أساسي
            </option>

          </select>

        </div>

        {/* MATIERE */}
        <div className="generator-group">

          <label>Matière</label>

          <div className="subject-buttons">

            <button 
              className={`subject-btn ${subject === "math" ? "active" : ""}`}
              onClick={() => setSubject("math")}
            >
              ➗ Mathématiques
            </button>

            <button
              className={`subject-btn ${subject === "physics" ? "active" : ""}`}
              onClick={() => setSubject("physics")}
            >
              {physicsLabel}
            </button>

            <button
              className={`subject-btn ${subject === "french" ? "active" : ""}`}
              onClick={() => setSubject("french")}
            >
              📘 Français
            </button>

            <button
              className={`subject-btn ${subject === "english" ? "active" : ""}`}
              onClick={() => setSubject("english")}
            >
              🌍 English
            </button>

          </div>

        </div>

        {/* TRIMESTRE */}
        <div className="generator-group">

          <label>Trimestre</label>

          <div className="trimester-buttons">

            <button
              className={trimester === 1 ? "active" : ""}
              onClick={() => setTrimester(1)}
            >
              T1
            </button>

            <button
              className={trimester === 2 ? "active" : ""}
              onClick={() => setTrimester(2)}
            >
              T2
            </button>

            <button
              className={trimester === 3 ? "active" : ""}
              onClick={() => setTrimester(3)}
            >
              T3
            </button>

          </div>

        </div>

        {/* LESSON */}
        <div className="generator-group">

          <label>Leçon</label>

          <select
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
          >
            {lessons.map((currentLesson) => (
              <option
                key={currentLesson}
                value={currentLesson}
              >
                {currentLesson}
              </option>
            ))}
          </select>

        </div>

        {/* DIFFICULTE */}

        <div className="generator-group">

          <label>Difficulté</label>

          <div className="difficulty-buttons">

            <button
              className={difficulty === "facile" ? "active" : ""}
              onClick={() => setDifficulty("facile")}
            >
              Facile
            </button>

            <button
              className={difficulty === "moyen" ? "active" : ""}
              onClick={() => setDifficulty("moyen")}
            >
              Moyen
            </button>

            <button
              className={difficulty === "difficile" ? "active" : ""}
              onClick={() => setDifficulty("difficile")}
            >
              Difficile
            </button>

          </div>

        </div>

        {/* GENERATE */}

        <button
          className="generate-button"
          onClick={generateExercise}
          disabled={generating}
        >

          {generating ? "Génération..." : "Générer mon exercice ✨"}

        </button>

      </div>

      { generating && (

        <div className="exercise-loading-overlay">

          <div className="exercise-loading-content">

            <div className="ai-loader">

              <div className="loader-ring"></div>

              <div className="loader-core">

                <FiZap />

              </div>

            </div>

            <h3>
              Création de votre exercice
            </h3>

            <p>
              {loadingMessage}
            </p>

          </div>

        </div>

      )}

      {showPremiumModal && (

  <div className="premium-modal-overlay">

    <div className="premium-modal">

      <div className="premium-modal-badge">

        {quotaModalData.isPremium ? "PREMIUM" : "GRATUIT"}

      </div>

      <h3>

        {quotaModalData.isPremium
          ? "Quota Premium atteint"
          : "Limite quotidienne atteinte"}

      </h3>

      <p>

        {quotaModalData.isPremium
          ? `Vous avez utilisé vos ${quotaModalData.limit} exercices disponibles aujourd'hui. Votre quota sera automatiquement réinitialisé demain.`
          : `Vous avez utilisé vos ${quotaModalData.limit} exercices gratuits aujourd'hui.`}

      </p>

      {!quotaModalData.isPremium && (

        <>

          <div className="premium-benefits">

            <div>Jusqu'à 30 exercices par jour</div>

            <div>Toutes les matières</div>

            <div>Tous les niveaux</div>

            <div>Historique complet</div>

            <div>Progression détaillée</div>

          </div>

          <div className="premium-price">

            <span className="price-value">

              25 TND / mois

            </span>

          </div>

          <button
            className="premium-whatsapp-btn"
            onClick={() => {

              const message =
                "Bonjour, je souhaite souscrire à l'abonnement Premium Profi.";

              window.open(
                `https://wa.me/21651510183?text=${encodeURIComponent(message)}`,
                "_blank"
              );

            }}
          >

            <FaWhatsapp size={20} />

            Contactez-nous via WhatsApp

          </button>

        </>

      )}

      <button
        className="premium-close-btn"
        onClick={() => setShowPremiumModal(false)}
      >

        {quotaModalData.isPremium
          ? "Compris"
          : "Plus tard"}

      </button>

    </div>

  </div>

)}

    </div>
  );
}