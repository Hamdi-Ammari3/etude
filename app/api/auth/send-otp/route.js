import { NextResponse } from "next/server";
import { sendVerificationPreferWhatsapp, toE164Tunisia } from "../../../../lib/twilio";

export async function POST(request) {
  try {
    const { phone } = await request.json();

    const e164 = toE164Tunisia(phone || "");
    if (!e164) {
      return NextResponse.json(
        { error: "Numéro invalide (8 chiffres attendus)." },
        { status: 400 }
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