import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";
import { normalizePhone, buildUid } from "../../../../lib/phone";

const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request) {
  try {
    const { phone, password } = await request.json();

    const canonicalPhone = normalizePhone(phone || "");
    if (!canonicalPhone) {
      return NextResponse.json(
        { error: "Numéro invalide (8 chiffres attendus)." },
        { status: 400 }
      );
    }
    if (!/^\d{4}$/.test(String(password || "").trim())) {
      return NextResponse.json({ error: "Code invalide." }, { status: 400 });
    }

    const uid = buildUid(canonicalPhone);
    const userRef = adminDB.collection("users").doc(uid);
    const snap = await userRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "Aucun compte trouvé avec ce numéro. Contactez-nous pour créer votre compte." },
        { status: 404 }
      );
    }

    const data = snap.data();

    // Rate limiting — protects against repeated PIN guesses against a
    // known phone number.
    const now = Date.now();
    const attempts = data.loginAttempts || { count: 0, windowStart: 0 };
    const withinWindow = now - (attempts.windowStart || 0) < LOCKOUT_WINDOW_MS;

    if (withinWindow && attempts.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 }
      );
    }

    if (!data.password) {
      return NextResponse.json(
        { error: "Compte non configuré. Contactez le support." },
        { status: 500 }
      );
    }

    const valid = String(password).trim() === String(data.password);

    if (!valid) {
      const nextCount = withinWindow ? attempts.count + 1 : 1;
      await userRef.update({
        loginAttempts: { count: nextCount, windowStart: withinWindow ? attempts.windowStart : now },
      });
      return NextResponse.json({ error: "Code incorrect." }, { status: 401 });
    }

    // Success — reset attempts, update last login, mint session token.
    await userRef.update({
      loginAttempts: { count: 0, windowStart: 0 },
      lastLoginAt: new Date().toISOString(),
    });

    const customToken = await adminAuth.createCustomToken(uid);

    return NextResponse.json({
      token: customToken,
      user: {
        uid,
        name: data.name,
        phone: data.phone,
        purchasedGrades: data.purchasedGrades || [],
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json({ error: "Échec de la connexion." }, { status: 500 });
  }
}