import { adminDb, requireTeacher, jsonError, FieldValue } from "../../../../lib/videoServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BIO_MAX = 600;
const ADDRESS_MAX = 120;

function cleanText(value, max) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

/**
 * PATCH /api/teachers/profile
 * Body: { contactPhone, whatsapp, address, bio }
 *
 * Saves the teacher's public information in users/{uid}.publicProfile.
 * The login phone (users/{uid}.phone) and the name are never changed here:
 * the phone is the teacher's login, and the name is printed on every
 * published video/PDF.
 */
export async function PATCH(request) {
  let teacher;
  try {
    teacher = await requireTeacher(request);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Requête invalide.");
  }

  const contactPhone = String(body.contactPhone ?? "").replace(/\D/g, "");
  if (!/^[2-9]\d{7}$/.test(contactPhone)) {
    return jsonError("Numéro tunisien invalide (8 chiffres).");
  }

  const publicProfile = {
    contactPhone,
    whatsapp: body.whatsapp === true,
    address: cleanText(body.address, ADDRESS_MAX),
    bio: cleanText(body.bio, BIO_MAX),
  };

  await adminDb()
    .collection("users")
    .doc(teacher.uid)
    .set(
      {
        publicProfile: { ...publicProfile, updatedAt: FieldValue.serverTimestamp() },
      },
      { merge: true }
    );

  return Response.json({ publicProfile });
}