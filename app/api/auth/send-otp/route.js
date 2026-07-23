import { NextResponse } from "next/server";
import { sendVerificationPreferWhatsapp, toE164Tunisia } from "../../../../lib/twilio";
import { adminDB } from "../../../../lib/firebaseAdmin";

export async function POST(request) {
  try {
    const { phone, mode } = await request.json();

    const e164 = toE164Tunisia(phone || "");
    if (!e164) {
      return NextResponse.json(
        { error: "Numéro invalide (8 chiffres attendus)." },
        { status: 400 }
      );
    }

    const normalizedMode = mode === "signup" ? "signup" : "login";

    const uid = `tn${e164.replace("+", "")}`;
    const existing = await adminDB.collection("users").doc(uid).get();

    if (normalizedMode === "login" && !existing.exists) {
      return NextResponse.json(
        { error: "Aucun compte trouvé avec ce numéro. Créez un compte." },
        { status: 404 }
      );
    }

    if (normalizedMode === "signup" && existing.exists) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec ce numéro. Connectez-vous." },
        { status: 409 }
      );
    }

    const { channel } = await sendVerificationPreferWhatsapp(e164);

    return NextResponse.json({ ok: true, channel });
  } catch (err) {
    console.error("send-otp error:", err);
    if (err.code === 60203) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez plus tard." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Impossible d'envoyer le code. Réessayez." },
      { status: 500 }
    );
  }
}