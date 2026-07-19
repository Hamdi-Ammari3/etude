import Link from "next/link";

export default function SubjectNotFound() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">Matière introuvable</h1>
      <Link href="/" className="not-found-link">
        Retour à l'accueil
      </Link>
    </div>
  );
}