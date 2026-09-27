import { buildThumbnailUploadParams } from "../../../../lib/cloudinaryServer";
import { requireTeacher, jsonError } from "../../../../lib/videoServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST → { cloudName, apiKey, folder, format, timestamp, transformation, signature }
 * The browser then uploads the image straight to Cloudinary with these values.
 * Signatures are valid for about an hour (Cloudinary checks the timestamp).
 */
export async function POST(request) {
  let teacher;
  try {
    teacher = await requireTeacher(request);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  try {
    return Response.json(buildThumbnailUploadParams(teacher.uid));
  } catch (err) {
    console.error("Cloudinary signature failed", err);
    return jsonError("Le service d'images n'est pas configuré.", 500);
  }
}