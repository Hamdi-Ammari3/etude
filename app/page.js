import DocumentsCatalog from "./components/DocumentsCatalog";

// The documents catalog IS the home page: visitors see the real videos and
// PDFs straight away instead of a description of them.
export const metadata = {
  title: "Droussy TN — Vidéos et PDF de cours, du primaire au bac",
  description:
    "Des leçons en vidéo, des séries d'exercices et des devoirs corrigés en PDF par des enseignants tunisiens, de la 1ère année au bac.",
};

export default function HomePage() {
  return <DocumentsCatalog />;
}