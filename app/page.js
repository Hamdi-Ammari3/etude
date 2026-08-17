import Link from "next/link";
import MonthCalendar from "./components/MonthCalendar";
import "./homePage.css";

export default function HomePage() {
  // TODO: once live-session bookings exist, replace this with the user's
  // actual upcoming sessions for the current month.
  const liveSessionEvents = [];

  return (
    <div className="home-page">
      {/* Hero — the two entry points: live sessions vs. static lessons */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <span className="home-hero-badge">🇹🇳 La plateforme d'apprentissage des enfants tunisiens</span>
          <h1 className="home-hero-title">
            Apprendre, c'est <em>amusant</em> !
          </h1>
          <p className="home-hero-sub">
            Des cours en direct avec de super enseignants et des fiches de révision pleines de
            couleurs, du primaire jusqu'au collège.
          </p>

          <div className="home-hero-cards">
            <Link href="/direct" className="home-service-card">
              <div className="home-service-icon home-service-icon-sky">🎥</div>
              <h2 className="home-service-title">Cours en direct</h2>
              <p className="home-service-text">
                Rejoins un enseignant en ligne, en petit groupe, chaque semaine.
              </p>
              <span className="home-service-cta home-service-cta-primary">Je commence</span>
            </Link>

            <Link href="/lecons" className="home-service-card">
              <div className="home-service-icon home-service-icon-sun">📚</div>
              <h2 className="home-service-title">Leçons &amp; exercices</h2>
              <p className="home-service-text">
                Résumés de cours et exercices corrigés à lire et à réviser.
              </p>
              <span className="home-service-cta home-service-cta-coral">Je révise</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Calendar — upcoming live sessions for the month 
      <section className="home-calendar-section">
        <h2 className="home-section-title">🗓️ Mon mois d'apprentissage</h2>
        <p className="home-section-sub">Toutes tes séances en direct du mois, en un coup d'œil.</p>
        <MonthCalendar events={liveSessionEvents} />
      </section>
      */}

      {/* Become a teacher */}
      <section className="home-teacher-section">
        <div className="home-teacher-card">
          <h2 className="home-teacher-title">Vous êtes enseignant ?</h2>
          <p className="home-teacher-text">
            Rejoignez Droussy TN, créez vos séances en direct, choisissez vos horaires, le nombre
            d'élèves et votre tarif mensuel. Nous nous occupons du reste.
          </p>
          <div className="home-teacher-actions">
            <a
              href="https://wa.me/21651510183?text=Bonjour%2C%20je%20souhaite%20devenir%20enseignant%20sur%20Droussy%20TN"
              target="_blank"
              rel="noopener noreferrer"
              className="home-teacher-btn home-teacher-btn-primary"
            >
              💬 Nous contacter sur WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}