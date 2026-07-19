import Link from "next/link";

export default function GradeNotFound() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">Classe introuvable</h1>
      <Link href="/" className="not-found-link">
        Retour à l'accueil
      </Link>
    </div>
  );
}