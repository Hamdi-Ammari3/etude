import { notFound } from "next/navigation";
import { loadTeacherProfile } from "../../../lib/teacherProfileServer";
import TeacherProfileClient from "./TeacherProfileClient";

// Always fresh: a teacher who just edited his info sees it at once.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await loadTeacherProfile(id).catch(() => null);
  if (!data) {
    return { title: "Enseignant introuvable | Droussy TN", robots: { index: false } };
  }
  const { teacher } = data;
  const title = `${teacher.name} — Enseignant | Droussy TN`;
  const description =
    teacher.bio.slice(0, 160) || `Vidéos et PDF de cours publiés par ${teacher.name} sur Droussy TN.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "profile" },
    twitter: { card: "summary", title, description },
  };
}

export default async function TeacherProfilePage({ params }) {
  const { id } = await params;
  const data = await loadTeacherProfile(id);
  if (!data) notFound();
  return <TeacherProfileClient teacher={data.teacher} items={data.items} />;
}