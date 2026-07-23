import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "../../../../lib/firebaseAdmin";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const idToken = authHeader.replace("Bearer ", "");
    if (!idToken) {
      return NextResponse.json({ error: "Connectez-vous d'abord." }, { status: 401 });
    }
    await adminAuth.verifyIdToken(idToken);

    const { code } = await request.json();
    const normalizedCode = String(code || "").trim().toUpperCase();
    if (!normalizedCode) {
      return NextResponse.json({ error: "Veuillez entrer un code." }, { status: 400 });
    }

    const codeSnap = await adminDB.collection("redemptionCodes").doc(normalizedCode).get();
    if (!codeSnap.exists) {
      return NextResponse.json({ error: "Ce code n'existe pas." }, { status: 404 });
    }

    const codeData = codeSnap.data();
    if (codeData.status === "used") {
      return NextResponse.json({ error: "Ce code a déjà été utilisé." }, { status: 409 });
    }
    if (codeData.status === "voided") {
      return NextResponse.json({ error: "Ce code n'est plus valide." }, { status: 409 });
    }

    const gradeSnap = await adminDB.collection("grades").doc(codeData.gradeId).get();
    const gradeName = gradeSnap.exists ? gradeSnap.data().name : codeData.gradeId;

    return NextResponse.json({ gradeId: codeData.gradeId, gradeName });
  } catch (err) {
    console.error("redeem/check error:", err);
    return NextResponse.json({ error: "Erreur lors de la vérification du code." }, { status: 500 });
  }
}