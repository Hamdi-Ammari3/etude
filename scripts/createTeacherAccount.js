// node scripts/createTeacherAccount.js
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

const NAME = "Hamdi Ammari";
const RAW_PHONE = "51510183";
const COURSES = []; 
const BIO = "";
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
    phone: canonicalPhone, 
    password: pin, 
    role: "teacher",
    courses:COURSES,
    bio: BIO,
    balance:0,
    rating: null,
    totalSessions: 0,
    loginAttempts: { count: 0, windowStart: 0 },
    createdAt: new Date().toISOString(),
  });

  console.log("✔ Teacher account created");
}

createAccount()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed:", err.message);
    process.exit(1);
  });