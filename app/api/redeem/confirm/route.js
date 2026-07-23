import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const idToken = authHeader.replace("Bearer ", "");
    if (!idToken) {
      return NextResponse.json({ error: "Connectez-vous d'abord." }, { status: 401 });
    }
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const { code } = await request.json();
    const normalizedCode = String(code || "").trim().toUpperCase();
    if (!normalizedCode) {
      return NextResponse.json({ error: "Veuillez entrer un code." }, { status: 400 });
    }

    const userRef = adminDB.collection("users").doc(uid);
    const codeRef = adminDB.collection("redemptionCodes").doc(normalizedCode);

    // --- basic rate limiting, stored on the user doc itself ---
    const userSnapForLimit = await userRef.get();
    const limitData = userSnapForLimit.data()?.redeemAttempts || { count: 0, windowStart: 0 };
    const now = Date.now();
    const windowActive = now - limitData.windowStart < WINDOW_MS;

    if (windowActive && limitData.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 }
      );
    }
    // ------------------------------------------------------------

    const result = await adminDB.runTransaction(async (tx) => {
      // --- ALL reads first ---
      const codeSnap = await tx.get(codeRef);
      const userSnap = await tx.get(userRef);
      // ------------------------

      if (!codeSnap.exists) {
        throw { httpStatus: 404, message: "Ce code n'existe pas." };
      }

      const codeData = codeSnap.data();
      if (codeData.status === "used") {
        throw { httpStatus: 409, message: "Ce code a déjà été utilisé." };
      }
      if (codeData.status === "voided") {
        throw { httpStatus: 409, message: "Ce code n'est plus valide." };
      }

      const usedAt = new Date();
      const expiresAt = new Date(usedAt.getTime() + ONE_YEAR_MS);

      // --- ALL writes after ---
      tx.update(codeRef, {
        status: "used",
        usedByUid: uid,
        usedAt: usedAt.toISOString(),
        accessExpiresAt: expiresAt.toISOString(),
      });

      const currentPurchased = userSnap.data()?.purchasedGrades || [];
      const nextPurchased = currentPurchased.includes(codeData.gradeId)
        ? currentPurchased
        : [...currentPurchased, codeData.gradeId];

      tx.set(
        userRef,
        {
          purchasedGrades: nextPurchased,
          gradeAccess: {
            [codeData.gradeId]: {
              redeemedAt: usedAt.toISOString(),
              expiresAt: expiresAt.toISOString(),
              codeUsed: normalizedCode,
            },
          },
        },
        { merge: true }
      );
      // ------------------------

      return { gradeId: codeData.gradeId, expiresAt: expiresAt.toISOString() };
    });

    // Record the successful attempt too, so repeated successful redemptions
    // still count toward the rate limit window (prevents using "success"
    // as a way to reset the attempt counter for free).
    await userRef.set(
      {
        redeemAttempts: {
          count: windowActive ? limitData.count + 1 : 1,
          windowStart: windowActive ? limitData.windowStart : now,
        },
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err.httpStatus) {
      // record the failed attempt before returning the error
      try {
        const authHeader = request.headers.get("authorization") || "";
        const decoded = await adminAuth.verifyIdToken(authHeader.replace("Bearer ", ""));
        const userRef = adminDB.collection("users").doc(decoded.uid);
        const snap = await userRef.get();
        const limitData = snap.data()?.redeemAttempts || { count: 0, windowStart: 0 };
        const now = Date.now();
        const windowActive = now - limitData.windowStart < WINDOW_MS;
        await userRef.set(
          {
            redeemAttempts: {
              count: windowActive ? limitData.count + 1 : 1,
              windowStart: windowActive ? limitData.windowStart : now,
            },
          },
          { merge: true }
        );
      } catch {
        // best-effort only, don't let this mask the original error
      }
      return NextResponse.json({ error: err.message }, { status: err.httpStatus });
    }
    console.error("redeem/confirm error:", err);
    return NextResponse.json({ error: "Erreur lors de la validation du code." }, { status: 500 });
  }
}