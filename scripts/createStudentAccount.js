// node scripts/createStudentAccount.js
//
// Creates a student account with a subscription:
// access to every document of the platform until the end date.
// After the end date the student can still log in, but can't open any
// video or PDF until the subscription is renewed with:
//   node scripts/setSubscription.js activate <phone>
require("dotenv").config();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
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
const NAME = "Mohamed Cherif";
const RAW_PHONE = "23761433";
const MONTHS = 12; // subscription length
// ---------------------------------------------------------------------------

// Same value as DOC_QUOTA in lib/subscription.js (never shown to students).
const DOC_QUOTA = 1000;

function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

const formatDate = (d) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

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
  const now = new Date();
  const endsAt = addMonths(now, MONTHS);

  await db.collection("users").doc(uid).set({
    name: NAME,
    phone: canonicalPhone,
    password: pin,
    role: "student",
    subscription: {
      active: true,
      cycleId: `c${now.getTime()}`,
      quota: DOC_QUOTA,
      used: 0,
      startedAt: Timestamp.fromDate(now),
      endsAt: Timestamp.fromDate(endsAt),
    },
    createdAt: now.toISOString(),
  });

  console.log("✔ Account created");
  console.log(`  Name:    ${NAME}`);
  console.log(`  Phone:   ${canonicalPhone}  (send as-is, no +216 needed for login)`);
  console.log(`  PIN:     ${pin}`);
  console.log(`  Abonnement valable jusqu'au ${formatDate(endsAt)}`);
  console.log(`  → Send these lines to the parent via WhatsApp.`);
}

createAccount()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed:", err.message);
    process.exit(1);
  });