// Open (free) documents — admin tools.
//
// Usage (from the project root):
//   node scripts/openDocs.js list
//       → every teacher and his open documents
//   node scripts/openDocs.js init [--write]
//       → teachers with NO open document: their oldest published document
//         (or oldest pending one) becomes open. Dry run unless --write.
//         Run it once now for existing teachers; safe to run again any time
//         (e.g. after rejecting a teacher's open document).
//   node scripts/openDocs.js set <docId> on|off [--force]
//       → make a document open / paid. Keeps the 1–3 rule unless --force.
//
// Same rules as lib/openDocs.js.

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
const { FieldValue } = admin.firestore;

const OPEN_DOCS_MIN = 1;
const OPEN_DOCS_MAX = 3;
const ALIVE = ["uploading", "encoding", "pending", "published"];

const icon = (d) => (d.type === "pdf" ? "📄" : "🎬");
const createdMs = (d) => d.createdAt?.toMillis?.() || 0;

async function teacherDocs() {
  const snap = await db.collection("videos").where("status", "in", ALIVE).get();
  const byTeacher = new Map();
  snap.docs.forEach((d) => {
    const v = { id: d.id, ref: d.ref, ...d.data() };
    if (!byTeacher.has(v.teacherId)) byTeacher.set(v.teacherId, []);
    byTeacher.get(v.teacherId).push(v);
  });
  return byTeacher;
}

async function list() {
  const byTeacher = await teacherDocs();
  console.log(`\n${byTeacher.size} enseignant(s) avec des documents :\n`);
  for (const [teacherId, docs] of byTeacher) {
    const open = docs.filter((d) => d.isOpen === true);
    const name = docs[0]?.teacherName || teacherId;
    const flag = open.length < OPEN_DOCS_MIN ? "⚠️ aucun" : open.length > OPEN_DOCS_MAX ? "⚠️ trop" : "✅";
    console.log(`👤 ${name} (${teacherId}) — ${open.length} gratuit(s) / ${docs.length} ${flag}`);
    open.forEach((d) => console.log(`   🔓 ${icon(d)} ${d.title}  [${d.status}]  ${d.id}`));
  }
  console.log("");
}

async function init(args) {
  const write = args.includes("--write");
  const byTeacher = await teacherDocs();
  const todo = [];
  for (const [teacherId, docs] of byTeacher) {
    if (docs.some((d) => d.isOpen === true)) continue;
    const candidates = docs
      .filter((d) => d.status === "published" || d.status === "pending")
      .sort((a, b) => createdMs(a) - createdMs(b));
    const pick = candidates.find((d) => d.status === "published") || candidates[0];
    if (pick) todo.push({ teacherId, pick });
  }

  console.log(`\n${todo.length} enseignant(s) sans document gratuit :`);
  todo.forEach(({ teacherId, pick }) =>
    console.log(`   · ${pick.teacherName || teacherId} → 🔓 ${icon(pick)} ${pick.title}  [${pick.status}]`)
  );
  if (!write) {
    console.log("\nDry run — relancez avec --write pour rendre ces documents gratuits.\n");
    return;
  }
  for (let i = 0; i < todo.length; i += 400) {
    const batch = db.batch();
    todo.slice(i, i + 400).forEach(({ pick }) =>
      batch.update(pick.ref, {
        isOpen: true,
        openChangedAt: FieldValue.serverTimestamp(),
        openAutoReason: "init",
        updatedAt: FieldValue.serverTimestamp(),
      })
    );
    await batch.commit();
  }
  console.log(`\n✅ ${todo.length} document(s) rendu(s) gratuit(s).\n`);
}

async function set(docId, value, args) {
  if (!docId || !["on", "off"].includes(value)) throw new Error("Usage : set <docId> on|off [--force]");
  const open = value === "on";
  const force = args.includes("--force");

  const ref = db.collection("videos").doc(docId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error(`Document introuvable : ${docId}`);
  const doc = snap.data();
  if (!ALIVE.includes(doc.status)) throw new Error(`Document ${doc.status} — impossible.`);

  const openSnap = await db.collection("videos").where("teacherId", "==", doc.teacherId).where("isOpen", "==", true).get();
  const openIds = openSnap.docs.filter((d) => ALIVE.includes(d.data().status)).map((d) => d.id);

  if (!force) {
    if (open && !openIds.includes(docId) && openIds.length >= OPEN_DOCS_MAX) {
      throw new Error(`L'enseignant a déjà ${OPEN_DOCS_MAX} documents gratuits (--force pour passer outre).`);
    }
    if (!open && openIds.filter((id) => id !== docId).length < OPEN_DOCS_MIN) {
      throw new Error(`C'est son dernier document gratuit (--force pour passer outre).`);
    }
  }

  await ref.update({ isOpen: open, openChangedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  console.log(`\n${open ? "🔓 Gratuit" : "🔒 Payant"} : ${icon(doc)} ${doc.title} (${doc.teacherName || doc.teacherId})\n`);
}

// ---------- Entry ----------

const [command, ...rest] = process.argv.slice(2);
const commands = {
  list: () => list(),
  init: () => init(rest),
  set: () => set(rest[0], rest[1], rest.slice(2)),
};

if (!commands[command]) {
  console.log(
    "Usage :\n" +
      "  node scripts/openDocs.js list\n" +
      "  node scripts/openDocs.js init [--write]\n" +
      "  node scripts/openDocs.js set <docId> on|off [--force]"
  );
  process.exit(1);
}

commands[command]().then(
  () => process.exit(0),
  (err) => {
    console.error("Échec :", err.message);
    process.exit(1);
  }
);