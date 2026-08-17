import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";
import { normalizePhone, buildUid } from "../../../../lib/phone";

const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const ROLE_LABELS = { student: "élève", teacher: "enseignant" };

export async function POST(request) {
  try {
    const { phone, password, loginAs } = await request.json();

    const canonicalPhone = normalizePhone(phone || "");
    if (!canonicalPhone) {
      return NextResponse.json(
        { error: "Numéro invalide (8 chiffres attendus)." },
        { status: 400 }
      );
    }

    // Digits-only 4-character passcode, shared by both student and
    // teacher accounts.
    if (!/^\d{4}$/.test(String(password || "").trim())) {
      return NextResponse.json({ error: "Code invalide." }, { status: 400 });
    }

    // Defaults to "student" for backward compatibility, though both
    // current callers (student and teacher login pages) always send this.
    const requestedRole = loginAs === "teacher" ? "teacher" : "student";

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

    // Password is correct — now check this account's role against which
    // login page sent the request. Existing docs written before `role`
    // existed default to "student", mirroring the same default used
    // client-side in useUser().
    const accountRole = data.role || "student";

    if (accountRole !== requestedRole) {
      // Credentials were correct — this is a wrong-page mistake, not a
      // guessing attempt, so reset the counter rather than penalizing it.
      await userRef.update({
        loginAttempts: { count: 0, windowStart: 0 },
      });
      return NextResponse.json(
        {
          error: `Ce compte est enregistré comme ${ROLE_LABELS[accountRole]}. Utilisez la connexion ${ROLE_LABELS[accountRole]}.`,
        },
        { status: 403 }
      );
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
        role: accountRole,
        purchasedGrades: data.purchasedGrades || [],
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json({ error: "Échec de la connexion." }, { status: 500 });
  }
}