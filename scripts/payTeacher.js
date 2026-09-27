// Records a payout to a teacher and deducts it from their video balance.
//
// Usage (from the project root):
//   node scripts/payTeacher.js <phone>                 → pays the full current balance
//   node scripts/payTeacher.js <phone> <amountDT>      → pays a specific amount (e.g. 100)
//   node scripts/payTeacher.js <phone> <amountDT> "D17 réf 123456"   → with a note
//   node scripts/payTeacher.js <phone> --show          → only shows the balance
//
// Why subtract instead of "reset to 0": if a student's view is counted while
// you are sending the money, a reset would erase that 0,1 DT. Subtracting the
// exact amount paid, inside a transaction, never loses a view.
//
// ⚠️ Admin SDK init: this mirrors a standard service-account setup. If your
// scripts/createUserAccount.js initialises firebase-admin differently, copy
// its init block over the one below.

const path = require("path");
const admin = require("firebase-admin");

const SERVICE_ACCOUNT_PATH =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, "..", "serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(require(SERVICE_ACCOUNT_PATH)) });
}
const db = admin.firestore();
const { FieldValue } = admin.firestore;

const F = {
  BALANCE: "videoBalanceMillimes",
  PAID_TOTAL: "videoPaidMillimes",
};

const dt = (millimes) => `${((Number(millimes) || 0) / 1000).toFixed(3)} DT`;

async function main() {
  const [phoneArg, amountArg, noteArg] = process.argv.slice(2);
  const uid = String(phoneArg || "").replace(/\D/g, "");
  if (!/^\d{8}$/.test(uid)) {
    console.error("Usage: node scripts/payTeacher.js <8-digit phone> [amountDT | --show] [note]");
    process.exit(1);
  }

  const userRef = db.collection("users").doc(uid);
  const snap = await userRef.get();
  if (!snap.exists) throw new Error(`No user ${uid}`);
  const user = snap.data();
  if (user.role !== "teacher") throw new Error(`${uid} is not a teacher (role: ${user.role})`);

  const balance = Number(user[F.BALANCE]) || 0;
  console.log(`\n👩‍🏫 ${user.name || uid} (${uid})`);
  console.log(`   Solde actuel     : ${dt(balance)}`);
  console.log(`   Vues totales     : ${user.videoViewsTotal || 0}`);
  console.log(`   Gagné au total   : ${dt(user.videoEarnedMillimes)}`);
  console.log(`   Déjà versé       : ${dt(user[F.PAID_TOTAL])}\n`);

  if (amountArg === "--show") return;

  const amountMillimes =
    amountArg === undefined ? balance : Math.round(Number(String(amountArg).replace(",", ".")) * 1000);

  if (!Number.isFinite(amountMillimes) || amountMillimes <= 0) throw new Error("Amount must be > 0");

  const payoutRef = db.collection("payouts").doc();
  const result = await db.runTransaction(async (tx) => {
    const fresh = await tx.get(userRef);
    const current = Number(fresh.data()[F.BALANCE]) || 0;
    if (amountMillimes > current) {
      throw new Error(`Amount ${dt(amountMillimes)} is more than the balance ${dt(current)}`);
    }
    tx.update(userRef, {
      [F.BALANCE]: FieldValue.increment(-amountMillimes),
      [F.PAID_TOTAL]: FieldValue.increment(amountMillimes),
      videoLastPaidAt: FieldValue.serverTimestamp(),
    });
    tx.set(payoutRef, {
      teacherId: uid,
      teacherName: user.name || "",
      amountMillimes,
      balanceBeforeMillimes: current,
      note: noteArg || "",
      paidAt: FieldValue.serverTimestamp(),
    });
    return { before: current, after: current - amountMillimes };
  });

  console.log(`✅ Versement enregistré : ${dt(amountMillimes)} (payouts/${payoutRef.id})`);
  console.log(`   Solde : ${dt(result.before)} → ${dt(result.after)}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌", err.message);
    process.exit(1);
  });