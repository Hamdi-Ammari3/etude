// scripts/createUserAccount.js
require("dotenv").config();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { normalizePhone, buildUid } = require("../lib/phone");

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);

// EDIT THESE FOR EACH NEW ACCOUNT ------------------------------------------
const NAME = "Sami Ben Ali";
const RAW_PHONE = "22942420";
const GRADES = ["prim-4"]; // grade ids the user purchased
// ---------------------------------------------------------------------------

function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function createAccount() {
  const canonicalPhone = normalizePhone(RAW_PHONE);
  if (!canonicalPhone) {
    throw new Error(`Invalid phone number: ${RAW_PHONE}`);
  }

  const uid = buildUid(canonicalPhone);
  const existing = await db.collection("users").doc(uid).get();
  if (existing.exists) {
    throw new Error(`Account already exists for ${canonicalPhone} (uid: ${uid})`);
  }

  const pin = generatePin();

  await db.collection("users").doc(uid).set({
    name: NAME,
    phone: canonicalPhone, // plain 8-digit number, no "tn", no "216", e.g. "51510183"
    password: pin, // stored in plain text intentionally — retrievable for support lookups
    purchasedGrades: GRADES,
    progress: {},
    createdAt: new Date().toISOString(),
  });

  console.log("✔ Account created");
  console.log(`  Name:  ${NAME}`);
  console.log(`  Phone: ${canonicalPhone}  (send as-is, no +216 needed for login)`);
  console.log(`  PIN:   ${pin}`);
  console.log(`  → Send these two lines to the parent via WhatsApp.`);
}

createAccount()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed:", err.message);
    process.exit(1);
  });