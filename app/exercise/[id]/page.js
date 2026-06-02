"use client";

import "./exercise.css";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getExerciseHistory } from "../../../services/exerciseService";
import { FiArrowLeft } from "react-icons/fi";
import { FiLock } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";

export default function ExercisePage() {

    const params = useParams();

    const router = useRouter();

    const historyId = params.id;

    const [exercise, setExercise] = useState(null);

    const [answer, setAnswer] = useState("");

    const [submitted, setSubmitted] = useState(false);

    const [revealed, setRevealed] = useState(false);

    const [busy, setBusy] = useState(false);

    const [result, setResult] = useState(null);

    useEffect(() => {

        fetchExercise();

    }, [historyId]);

    async function fetchExercise() {

        try {

            const data = await getExerciseHistory(historyId);

            if (!data) {

                router.push("/dashboard");

                return;

            }

            setExercise(data);

            setAnswer(data.userAnswer || "");

            setSubmitted(data.completed || false);

            setRevealed(data.completed || false);

        } catch (error) {

            console.log(error);

        }

    }

    async function finish(score) {

        try {

            setBusy(true);

            const response = await fetch(
                "/api/complete-exercise",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({

                        historyId,

                        answer,

                        score,

                    }),
                }
            );

            const data = await response.json();

            if (!data.success) {

                alert(
                    data.error ||
                    "Erreur"
                );

                return;

            }

            setSubmitted(true);

            setRevealed(true);

            setResult({

                xpEarned: data.xpEarned,

                newLevel: data.newLevel,

                levelUp: data.levelUp,

            });

            fetchExercise();

        } catch (error) {

            console.log(error);

        } finally {

            setBusy(false);

        }

    }

    function isArabicText(text) {

        return /[\u0600-\u06FF]/.test(text);

    }

    if (!exercise) {

        return (

            <ProtectedRoute>

                <div className="exercise-loading-page">

                    <Navbar />

                    <div className="exercise-spinner"></div>

                </div>

            </ProtectedRoute>

        );

    }

    return (

        <ProtectedRoute>

            <div className="exercise-page">

                <Navbar />

                <main className="exercise-container">

                    <button
                        className="back-button"
                        onClick={() =>
                            router.push(
                                "/dashboard"
                            )
                        }
                    >
                        <FiArrowLeft />

                        Retour au tableau de bord
                    </button>

                    <div className="exercise-top">

                        <h2>
                            Exercice actuel
                        </h2>

                        <span className="exercise-tag">

                            {
                                exercise.subject
                            }

                            {" • "}

                            {
                                exercise.lesson
                            }

                            {" • "}

                            {
                                exercise.difficulty
                            }

                        </span>

                    </div>

                    <div className="exercise-card">

                        <div className="exercise-content">

                            <div className={`exercise-question ${isArabicText(exercise.exerciseText) ? "rtl-content": ""}`}>

                                <p>

                                    {exercise.exerciseText}

                                </p>

                            </div>

                            <div className="exercise-answer-section">

                                <textarea
                                    value={
                                        answer
                                    }
                                    onChange={(e) =>
                                        setAnswer(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        submitted
                                    }
                                    placeholder="Tape ta réponse ici..."
                                />

                                {!submitted && (

                                    <div className="exercise-actions">

                                        <button
                                            className="finish-btn"
                                            disabled={
                                                busy ||
                                                !answer.trim()
                                            }
                                            onClick={() =>
                                                finish(
                                                    100
                                                )
                                            }
                                        >

                                            {busy
                                                ? "Validation..."
                                                : "J'ai fini, voir la correction"}

                                        </button>

                                        <button
                                            className="giveup-btn"
                                            disabled={
                                                busy
                                            }
                                            onClick={() =>
                                                finish(
                                                    0
                                                )
                                            }
                                        >

                                            <FiLock />

                                            Abandonner & voir

                                        </button>

                                    </div>

                                )}

                            </div>

                            {revealed && (

                                <div className="correction-section">

                                    <div className="correction-header">

                                        <FiCheckCircle />

                                        <h3>
                                            Correction
                                        </h3>

                                    </div>

                                    <div className={`correction-box ${isArabicText(exercise.correctionText) ? "rtl-content" : ""}`}>

                                        <p>

                                            {exercise.correctionText}

                                        </p>

                                    </div>

                                    <div className={`explanation-box ${isArabicText(exercise.explanationText) ? "rtl-content" : ""}`}>

                                        <h4>
                                            Explication
                                        </h4>

                                        <p>

                                            {exercise.explanationText}

                                        </p>

                                    </div>

                                    {result && (

                                        <div className="xp-earned">

                                            +
                                            {
                                                result.xpEarned
                                            }
                                            XP ⭐

                                        </div>

                                    )}

                                    <button
                                        className="new-exercise-btn"
                                        onClick={() =>router.push("/dashboard")}
                                    >

                                        Faire un autre exercice

                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </main>

            </div>

        </ProtectedRoute>

    );

}