import Link from "next/link";
import "../../homePage.css";
import "./teacherProfile.css";

export default function TeacherNotFound() {
  return (
    <div className="home-page">
      <div className="tp-notfound">
        <p className="tp-notfound-emoji">🤔</p>
        <h1 className="tp-notfound-title">Enseignant introuvable</h1>
        <Link href="/" className="tp-btn-primary">
          Voir les documents
        </Link>
      </div>
    </div>
  );
}