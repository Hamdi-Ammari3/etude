// One-time fix: give every existing video doc a `type: "video"` field.
//
// The documents catalog now filters "Vidéos / PDF" inside the Firestore query
// (50 at a time), and Firestore can't match a field that doesn't exist. Videos
// uploaded before the PDF feature have no `type` → they would disappear from
// the "Vidéos" tab and from the video count. New uploads already set it.
//
// Usage (from the project root):
//   node scripts/backfillContentType.js           → dry run, shows what would change
//   node scripts/backfillContentType.js --write   → writes the changes
//
// Admin SDK init — same as scripts/createTeacherAccount.js (reads .env).
require("dotenv").config();
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}
const db = admin.firestore();
const WRITE = process.argv.includes("--write");
const PAGE = 400;

async function main() {
  let last = null;
  let scanned = 0;
  let toFix = 0;
  let written = 0;

  for (;;) {
    let q = db.collection("videos").orderBy(admin.firestore.FieldPath.documentId()).limit(PAGE);
    if (last) q = q.startAfter(last);
    const snap = await q.get();
    if (snap.empty) break;

    const batch = db.batch();
    let inBatch = 0;
    snap.docs.forEach((doc) => {
      scanned++;
      const t = doc.data().type;
      if (t === "video" || t === "pdf") return;
      toFix++;
      if (WRITE) {
        batch.update(doc.ref, { type: "video" });
        inBatch++;
      }
    });
    if (inBatch > 0) {
      await batch.commit();
      written += inBatch;
    }
    last = snap.docs[snap.docs.length - 1];
    if (snap.size < PAGE) break;
  }

  console.log(`Docs scannés : ${scanned}`);
  console.log(`Sans type    : ${toFix}`);
  console.log(WRITE ? `Mis à jour   : ${written}` : "Dry run — relancez avec --write pour enregistrer.");
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);