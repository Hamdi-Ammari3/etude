import Link from "next/link";
import { GRADE_GROUPS } from "../../lib/liveGrades";
import "../homePage.css";
import "./directMain.css";

export default function DirectGradesPage() {
  return (
    <div className="home-page">
      <div className="direct-header">
        <p className="direct-eyebrow">Cours en direct 🎥</p>
        <h1 className="direct-title">Choisis ton niveau</h1>
        <p className="direct-sub">Ensuite tu choisiras ta matière, puis ton enseignant.</p>
      </div>

      {GRADE_GROUPS.map((group) => (
        <section key={group.levelName} className="direct-level-section">
          <h2 className="direct-level-heading">{group.levelName}</h2>
          <div className="direct-grade-grid">
            {group.grades.map((g) => (
              <Link key={g.id} href={`/direct/${g.id}`} className="direct-grade-card">
                <span className="direct-grade-emoji">{g.emoji}</span>
                <span className="direct-grade-label">{g.name}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}