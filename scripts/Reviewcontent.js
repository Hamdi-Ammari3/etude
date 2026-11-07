// Review teachers' documents waiting for validation ("pending").
//
// Usage (from the project root):
//   node scripts/reviewContent.js list                          → documents waiting for validation
//   node scripts/reviewContent.js publish                       → publishes ALL of them
//   node scripts/reviewContent.js publish <docId> ...           → only these documents
//   node scripts/reviewContent.js publish --teacher <uid>       → all of one teacher's documents
//   node scripts/reviewContent.js reject <docId> ... [--reason "texte"]
//                                                               → refuses these documents
//
// "publish" sets, for each document (one transaction each, so a document is
// never published twice or published after the teacher deleted it):
//   status: "published", publishedAt, reviewedAt, updatedAt
// The document then appears in the catalog right away.
//
// "reject" sets status: "rejected" (+ rejectionReason, reviewedAt). If the
// rejected document was the teacher's free (open) one and he has none left,
// his oldest published document becomes free — same rule as the platform
// (lib/openDocs.js: every teacher keeps at least 1 free document).

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

// Same values as lib/openDocs.js
const OPEN_DOCS_MIN = 1;
const OPEN_ALIVE = ["uploading", "encoding", "pending", "published"];

// ---------- Helpers ----------

const isPdf = (d) => d.type === "pdf";
const short = (s, n = 40) => (String(s || "").length > n ? `${String(s).slice(0, n - 1)}…` : String(s || ""));
const ms = (ts) => (ts?.toMillis ? ts.toMillis() : ts ? new Date(ts).getTime() : 0);
const fmtDate = (ts) => {
  const t = ms(ts);
  return t ? new Date(t).toLocaleString("fr-FR", { timeZone: "Africa/Tunis", dateStyle: "short", timeStyle: "short" }) : "—";
};
const fmtDuration = (sec) => {
  const s = Math.round(Number(sec) || 0);
  return s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "—";
};

function parseArgs(args) {
  const ids = [];
  let teacher = null;
  let reason = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--teacher") teacher = args[++i] || null;
    else if (args[i] === "--reason") reason = args[++i] || null;
    else ids.push(args[i]);
  }
  return { ids, teacher, reason };
}

async function pendingDocs({ ids = [], teacher = null } = {}) {
  if (ids.length) {
    const snaps = await Promise.all(ids.map((id) => db.collection("videos").doc(id).get()));
    return snaps
      .filter((s) => {
        if (!s.exists) console.log(`⚠️  ${s.id} : document introuvable — ignoré`);
        return s.exists;
      })
      .map((s) => ({ id: s.id, ...s.data() }))
      .filter((d) => {
        if (d.status !== "pending") console.log(`⚠️  ${d.id} : ignoré (statut "${d.status}") — seuls les documents "pending" sont traités`);
        return d.status === "pending";
      });
  }
  let q = db.collection("videos").where("status", "==", "pending");
  if (teacher) q = q.where("teacherId", "==", teacher);
  const snap = await q.get();
  return snap.docs.map((s) => ({ id: s.id, ...s.data() })).sort((a, b) => ms(a.createdAt) - ms(b.createdAt)); // oldest first
}

function printDocs(docs, title) {
  console.log(`\n📚 ${title} (${docs.length})`);
  if (!docs.length) return;
  console.table(
    docs.map((d) => ({
      id: d.id,
      type: isPdf(d) ? "📄 PDF" : "🎬 Vidéo",
      titre: short(d.title),
      enseignant: short(d.teacherName, 22),
      niveau: short(d.gradeName, 16),
      matière: short(d.subjectName, 16),
      taille: isPdf(d) ? `${d.pageCount || "?"} pages` : fmtDuration(d.durationSec),
      gratuit: d.isOpen ? "🔓 oui" : "",
      envoyé: fmtDate(d.uploadedAt || d.createdAt),
    }))
  );
}

/** Teacher has no free document left → his oldest published (or pending) one becomes free. */
async function ensureOpenDoc(teacherId) {
  const openSnap = await db.collection("videos").where("teacherId", "==", teacherId).where("isOpen", "==", true).get();
  if (openSnap.docs.filter((d) => OPEN_ALIVE.includes(d.data().status)).length >= OPEN_DOCS_MIN) return null;

  const snap = await db.collection("videos").where("teacherId", "==", teacherId).where("status", "in", ["published", "pending"]).get();
  if (snap.empty) return null;
  const byAge = [...snap.docs].sort((a, b) => ms(a.data().createdAt) - ms(b.data().createdAt));
  const pick = byAge.find((d) => d.data().status === "published") || byAge[0];
  await pick.ref.update({
    isOpen: true,
    openChangedAt: FieldValue.serverTimestamp(),
    openAutoReason: "replacement",
    updatedAt: FieldValue.serverTimestamp(),
  });
  return { id: pick.id, ...pick.data() };
}

/** Changes one document's status inside a transaction, only if it is still "pending". */
async function review(d, update) {
  const ref = db.collection("videos").doc(d.id);
  await db.runTransaction(async (tx) => {
    const fresh = await tx.get(ref);
    const cur = fresh.exists ? fresh.data() : null;
    if (!cur || cur.status !== "pending") {
      throw Object.assign(new Error("skip"), { skip: `statut actuel "${cur?.status || "introuvable"}"` });
    }
    tx.update(ref, { ...update, reviewedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  });
}

// ---------- Commands ----------

async function list() {
  const docs = await pendingDocs();
  printDocs(docs, "Documents en attente de validation");
  if (!docs.length) return;
  console.log(
    "\n→ Tout publier :            node scripts/reviewContent.js publish" +
      "\n→ Seulement certains :      node scripts/reviewContent.js publish <docId> ..." +
      '\n→ Refuser :                 node scripts/reviewContent.js reject <docId> ... --reason "texte"\n'
  );
}

async function publish(args) {
  const opts = parseArgs(args);
  const docs = await pendingDocs(opts);
  printDocs(docs, "AVANT — documents à publier");
  if (!docs.length) {
    console.log("\nRien à publier.\n");
    return;
  }

  console.log("\n✍️  Publication…");
  const done = [];
  for (const d of docs) {
    try {
      await review(d, { status: "published", publishedAt: FieldValue.serverTimestamp() });
      done.push(d);
      console.log(`   ✔ ${d.id}  ${isPdf(d) ? "📄" : "🎬"} ${short(d.title, 50)}  (${short(d.teacherName, 24)})`);
    } catch (err) {
      if (err.skip) console.log(`   ↷ ${d.id} ignoré : ${err.skip}`);
      else console.error(`   ✖ ${d.id} : ${err.message}`);
    }
  }

  // ---------- AFTER ----------
  if (done.length) {
    const snaps = await Promise.all(done.map((d) => db.collection("videos").doc(d.id).get()));
    console.log(`\n📚 APRÈS (${done.length})`);
    console.table(
      snaps.map((s) => ({
        id: s.id,
        titre: short(s.data().title),
        statut: `pending → ${s.data().status}`,
        gratuit: s.data().isOpen ? "🔓 oui" : "",
        publié: fmtDate(s.data().publishedAt),
      }))
    );
  }
  const byTeacher = done.reduce((m, d) => m.set(d.teacherName || d.teacherId, (m.get(d.teacherName || d.teacherId) || 0) + 1), new Map());
  console.log(`\n✅ ${done.length} document(s) publié(s)${byTeacher.size ? " — " + [...byTeacher].map(([t, n]) => `${t} : ${n}`).join(", ") : ""}.\n`);
}

async function reject(args) {
  const opts = parseArgs(args);
  if (!opts.ids.length) throw new Error('Indiquez les documents à refuser : reject <docId> ... [--reason "texte"]');
  const docs = await pendingDocs({ ids: opts.ids });
  printDocs(docs, "AVANT — documents à refuser");
  if (!docs.length) {
    console.log("\nRien à refuser.\n");
    return;
  }

  console.log("\n✍️  Refus…");
  const done = [];
  for (const d of docs) {
    try {
      await review(d, { status: "rejected", rejectionReason: opts.reason ? String(opts.reason).slice(0, 500) : null });
      done.push(d);
      console.log(`   ✔ ${d.id}  refusé  (${short(d.title, 50)})${opts.reason ? ` — « ${opts.reason} »` : ""}`);
    } catch (err) {
      if (err.skip) console.log(`   ↷ ${d.id} ignoré : ${err.skip}`);
      else console.error(`   ✖ ${d.id} : ${err.message}`);
    }
  }

  // A refused free document → the teacher keeps at least one free document.
  const teachers = [...new Set(done.filter((d) => d.isOpen).map((d) => d.teacherId))];
  for (const t of teachers) {
    const rep = await ensureOpenDoc(t);
    if (rep) console.log(`   🔓 ${rep.teacherName || t} : « ${short(rep.title, 50)} » devient son document gratuit.`);
    else console.log(`   ℹ️  ${t} : aucun autre document — son prochain envoi sera gratuit automatiquement.`);
  }

  console.log(`\n✅ ${done.length} document(s) refusé(s).\n`);
}

// ---------- Entry ----------

const [command, ...rest] = process.argv.slice(2);
const commands = { list: () => list(), publish: () => publish(rest), reject: () => reject(rest) };

if (!commands[command]) {
  console.log(
    "Usage :\n" +
      "  node scripts/reviewContent.js list                     → documents en attente\n" +
      "  node scripts/reviewContent.js publish                  → les publier tous\n" +
      "  node scripts/reviewContent.js publish <docId> ...      → seulement ces documents\n" +
      "  node scripts/reviewContent.js publish --teacher <uid>  → tous ceux d'un enseignant\n" +
      '  node scripts/reviewContent.js reject <docId> ... [--reason "texte"]'
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