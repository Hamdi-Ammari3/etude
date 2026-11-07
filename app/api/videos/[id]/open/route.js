import { adminDb, requireTeacher, jsonError } from "../../../../../lib/videoServer";
import { setDocOpen } from "../../../../../lib/openDocsServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/videos/{id}/open   { open: true | false }
 * The teacher makes one of HIS documents open (free for everyone, never paid)
 * or paid again. He always keeps between 1 and 3 open documents
 * (lib/openDocs.js) — checked here, in one transaction.
 *
 * → 200 { id, isOpen, openCount }   or   4xx { error }
 */
export async function POST(request, { params }) {
  let teacher;
  try {
    teacher = await requireTeacher(request);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  const { id } = await params;
  if (!id || typeof id !== "string" || id.length > 64) return jsonError("Document introuvable.", 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Requête invalide.");
  }
  if (typeof body.open !== "boolean") return jsonError("Requête invalide.");

  try {
    const result = await setDocOpen(adminDb(), teacher.uid, id, body.open);
    if (!result.ok) return jsonError(result.error, result.status);
    return Response.json({ id, isOpen: result.isOpen, openCount: result.openCount });
  } catch (err) {
    console.error("setDocOpen failed", id, teacher.uid, err);
    return jsonError("Erreur temporaire. Réessayez dans un instant.", 500);
  }
}