// scripts/generateRedemptionCodes.js
require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);

// ---- Configure each run ----
const GRADE_ID = "prim-6";
const QUANTITY = 50;
const BATCH_ID = `${GRADE_ID}-${new Date().toISOString().slice(0, 10)}`;
// ----------------------------

// Alphabet excludes visually ambiguous characters (0/O, 1/I/L) since these
// codes get hand-typed off a printed paper.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateCode() {
  const raw = Array.from({ length: 12 }, () => ALPHABET[crypto.randomInt(ALPHABET.length)]).join("");
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

async function generateCodes() {
  const codes = [];

  for (let i = 0; i < QUANTITY; i++) {
    let code;
    let created = false;

    // Retry on the (extremely unlikely) event of a collision — .create()
    // fails if a doc with this ID already exists, so this is safe even
    // under concurrent script runs.
    while (!created) {
      code = generateCode();
      try {
        await db.collection("redemptionCodes").doc(code).create({
          code,
          gradeId: GRADE_ID,
          status: "unused",
          batchId: BATCH_ID,
          createdAt: new Date().toISOString(),
          usedAt: null,
          usedByUid: null,
          accessExpiresAt: null,
        });
        created = true;
      } catch (err) {
        if (err.code !== 6 /* ALREADY_EXISTS */) throw err;
        // collision — loop and try a new random code
      }
    }

    codes.push(code);
    process.stdout.write(`\r✔ Generated ${i + 1}/${QUANTITY}`);
  }

  console.log(`\n\nBatch: ${BATCH_ID} — ${QUANTITY} codes for ${GRADE_ID}`);

  const csvPath = `./generated-codes-${BATCH_ID}.csv`;
  fs.writeFileSync(csvPath, "code,gradeId,batchId\n" + codes.map((c) => `${c},${GRADE_ID},${BATCH_ID}`).join("\n"));
  console.log(`✔ Saved to ${csvPath} — ready for printing.`);
}

generateCodes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Generation failed:", err);
    process.exit(1);
  });