"use client";

import "./StatisticsCard.css";

export default function StatisticsCard({stats,totalExercises}) {

    const SUBJECT_META = {

        math: {
            label: "Mathématiques",
            emoji: "➗",
        },

        french: {
            label: "Français",
            emoji: "📘",
        },

        english: {
            label: "English",
            emoji: "🌍",
        },

        physics: {
            label: "Physique",
            emoji: "⚡",
        },

    };

    const GRADE_META = {

        primaire_1: "1ère Année",
        primaire_2: "2ème Année",
        primaire_3: "3ème Année",
        primaire_4: "4ème Année",
        primaire_5: "5ème Année",
        primaire_6: "6ème Année",

        "7eme": "7ème Année",
        "8eme": "8ème Année",
        "9eme": "9ème Année",

    };

    function getSubjectMeta(subject, grade) {

        if (subject === "physics" && grade?.startsWith("primaire_")) {

            return {
                label: "Éveil Scientifique",
                emoji: "🔬",
            };

        }

        return SUBJECT_META[subject];

    }

    return (

        <div className="dashboard-stats-card">

            <div className="dashboard-stats-header">

                <div className="stats-title">

                    📊

                    <h3>
                        Tes statistiques
                    </h3>

                </div>

                <span>

                    {totalExercises} exercices

                </span>

            </div>

            <div className="dashboard-stats-list">

                {stats.length === 0 ? (

                    <p className="empty-stats">

                        Commence un exercice pour voir tes statistiques.

                    </p>

                ) : (

                    stats.map((row) => {

                        //const subjectMeta = SUBJECT_META[row.subject];

                        const subjectMeta = getSubjectMeta(row.subject,row.grade);

                        const max = stats[0]?.count || 1;

                        const percent = Math.round((row.count / max) * 100);

                        return (

                            <div
                                key={`${row.subject}-${row.grade}`}
                                className="stats-row"
                            >

                                <div className="stats-row-top">

                                    <div className="stats-row-info">

                                        <span className="stats-emoji">

                                            {subjectMeta?.emoji || "📚"}

                                        </span>

                                        <span className="stats-subject">

                                            {subjectMeta?.label || row.subject}

                                        </span>

                                        <span className="stats-grade">

                                            · {GRADE_META[row.grade] || row.grade}

                                        </span>

                                    </div>

                                    <span className="stats-count">

                                        {row.count}

                                    </span>

                                </div>

                                <div className="stats-progress">

                                    <div
                                        className="stats-progress-fill"
                                        style={{width: `${percent}%`,}}
                                    />

                                </div>

                            </div>

                        );

                    })

                )}

            </div>

        </div>

    );

}