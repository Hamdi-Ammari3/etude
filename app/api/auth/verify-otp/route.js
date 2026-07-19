import { NextResponse } from "next/server";
import { getTwilioClient, VERIFY_SERVICE_SID, toE164Tunisia } from "../../../../lib/twilio";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";

export async function POST(request) {
  try {
    const { phone, code, name } = await request.json();

    const e164 = toE164Tunisia(phone || "");
    if (!e164) {
      return NextResponse.json({ error: "Numéro invalide." }, { status: 400 });
    }
    if (!/^\d{4,6}$/.test(String(code || "").trim())) {
      return NextResponse.json({ error: "Code invalide." }, { status: 400 });
    }

    const client = getTwilioClient();
    const check = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: e164, code: String(code).trim() });

    if (check.status !== "approved") {
      return NextResponse.json({ error: "Code incorrect ou expiré." }, { status: 401 });
    }

    const uid = `tn${e164.replace("+", "")}`;
    const userRef = adminDB.collection("users").doc(uid);
    const existing = await userRef.get();

    if (existing.exists) {
      await userRef.update({ lastLoginAt: new Date().toISOString() });
    } else {
      await userRef.set({
        name: (name || "").trim() || "Utilisateur",
        phone: e164,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        purchasedGrades: [],
        progress: {},
      });
    }

    const userDoc = (await userRef.get()).data();
    const customToken = await adminAuth.createCustomToken(uid);

    return NextResponse.json({
      token: customToken,
      user: {
        uid,
        name: userDoc.name,
        phone: userDoc.phone,
        purchasedGrades: userDoc.purchasedGrades || [],
      },
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    if (err.code === 60200) {
      return NextResponse.json({ error: "Numéro invalide." }, { status: 400 });
    }
    if (err.code === 20404) {
      return NextResponse.json(
        { error: "Aucun code en attente pour ce numéro." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Échec de la vérification." }, { status: 500 });
  }
}