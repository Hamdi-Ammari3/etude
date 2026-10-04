// Adds starter ("fake") views to published documents that still have 0 views,
// and credits the teacher exactly like real views do.
//
// Usage (from the project root):
//   node scripts/fakeViews.js list              → published documents with 0 views (+ their teachers)
//   node scripts/fakeViews.js add               → adds 5–10 views to EVERY one of them
//   node scripts/fakeViews.js add <docId> ...   → only these documents
//
// Price per view (same as the real counting):
//   video → 100 millimes (0,1 DT)
//   PDF   → the rate saved on the PDF (viewRateMillimes), 50 millimes (0,05 DT) by default
//
// What "add" changes, for each document, in ONE transaction:
//   videos/{id}                         views +n, monthlyViews[YYYY-MM] +n, seededViews +n
//   users/{teacherId}                   videoViewsTotal +n, videoBalanceMillimes +n×rate,
//                                       videoEarnedMillimes +n×rate (created if missing)
//   teacherEarnings/{teacherId}_YYYY-MM views +n, amountMillimes +n×rate, seededViews +n
// `seededViews` marks how many views were added by this script, so they can be
// told apart from real ones (or removed) later.
//
// ⚠️ These views go into the teacher's balance: once it reaches the payout
// threshold, it is money you owe like any other view.

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

// ---- Same values as lib/videoConfig.js ----
const VIDEO_RATE_MILLIMES = 100;
const PDF_RATE_MILLIMES = 50;
const F = {
  VIEWS_TOTAL: "videoViewsTotal",
  BALANCE: "videoBalanceMillimes",
  EARNED_TOTAL: "videoEarnedMillimes",
};
const MIN_VIEWS = 5;
const MAX_VIEWS = 10;

// ---------- Helpers ----------

const isPdf = (d) => d.type === "pdf";
const rateOf = (d) => (isPdf(d) ? Math.min(VIDEO_RATE_MILLIMES, Number(d.viewRateMillimes) || PDF_RATE_MILLIMES) : VIDEO_RATE_MILLIMES);
const randomViews = () => MIN_VIEWS + Math.floor(Math.random() * (MAX_VIEWS - MIN_VIEWS + 1));
const dt = (m) => (m === undefined || m === null ? "— (absent)" : `${((Number(m) || 0) / 1000).toFixed(3)} DT`);
const num = (v) => (v === undefined || v === null ? "— (absent)" : String(v));
const money = (v) => (v === undefined || v === null ? "— (absent)" : `${v} (${dt(v)})`);
const short = (s, n = 40) => (String(s || "").length > n ? `${String(s).slice(0, n - 1)}…` : String(s || ""));

function monthKeyTunis(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Tunis", year: "numeric", month: "2-digit" }).formatToParts(date);
  return `${parts.find((p) => p.type === "year").value}-${parts.find((p) => p.type === "month").value}`;
}

async function zeroViewDocs(onlyIds) {
  if (onlyIds.length) {
    const snaps = await Promise.all(onlyIds.map((id) => db.collection("videos").doc(id).get()));
    return snaps
      .filter((s) => {
        if (!s.exists) console.log(`⚠️  ${s.id} : document introuvable — ignoré`);
        return s.exists;
      })
      .map((s) => ({ id: s.id, ...s.data() }))
      .filter((d) => {
        const ok = d.status === "published" && !(Number(d.views) > 0);
        if (!ok) console.log(`⚠️  ${d.id} : ignoré (statut "${d.status}", ${d.views || 0} vues) — seuls les documents publiés à 0 vue sont modifiés`);
        return ok;
      });
  }
  const snap = await db.collection("videos").where("status", "==", "published").get();
  return snap.docs.map((s) => ({ id: s.id, ...s.data() })).filter((d) => !(Number(d.views) > 0));
}

async function loadTeachers(ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  const snaps = await Promise.all(unique.map((id) => db.collection("users").doc(id).get()));
  return new Map(snaps.map((s) => [s.id, s.exists ? s.data() : null]));
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
      niveau: short(d.gradeName, 18),
      matière: short(d.subjectName, 16),
      vues: d.views ?? 0,
      "prix/vue": `${rateOf(d)} mill.`,
      ...(d.seededViews ? { "dont ajoutées": d.seededViews } : {}),
    }))
  );
}

function printTeachers(teachers, title) {
  console.log(`\n👩‍🏫 ${title}`);
  console.table(
    [...teachers.entries()].map(([uid, t]) => ({
      uid,
      nom: t ? short(t.name, 24) : "⚠️ introuvable",
      [F.VIEWS_TOTAL]: t ? num(t[F.VIEWS_TOTAL]) : "—",
      [F.BALANCE]: t ? money(t[F.BALANCE]) : "—",
      [F.EARNED_TOTAL]: t ? money(t[F.EARNED_TOTAL]) : "—",
    }))
  );
}

// ---------- Commands ----------

async function list() {
  const docs = await zeroViewDocs([]);
  printDocs(docs, "Documents publiés à 0 vue");
  if (!docs.length) return;
  printTeachers(await loadTeachers(docs.map((d) => d.teacherId)), "Leurs enseignants (valeurs actuelles)");
  console.log("\n→ Pour ajouter des vues : node scripts/fakeViews.js add   (ou add <docId> ...)\n");
}

async function add(onlyIds) {
  // ---------- BEFORE ----------
  const docs = await zeroViewDocs(onlyIds);
  printDocs(docs, "AVANT — documents publiés à 0 vue");
  if (!docs.length) {
    console.log("\nRien à faire.\n");
    return;
  }
  const teacherIds = docs.map((d) => d.teacherId);
  const before = await loadTeachers(teacherIds);
  printTeachers(before, "AVANT — enseignants");

  const missingTeacher = docs.filter((d) => !d.teacherId || !before.get(d.teacherId));
  if (missingTeacher.length) {
    console.log(`\n⚠️  ${missingTeacher.length} document(s) sans enseignant valide — ignorés :`, missingTeacher.map((d) => d.id).join(", "));
  }
  const todo = docs.filter((d) => d.teacherId && before.get(d.teacherId));

  // ---------- CHANGES ----------
  const monthKey = monthKeyTunis();
  const plan = [];
  console.log(`\n✍️  Ajout des vues (mois ${monthKey})…`);

  for (const d of todo) {
    const n = randomViews();
    const rate = rateOf(d);
    const amount = n * rate;
    const docRef = db.collection("videos").doc(d.id);
    const teacherRef = db.collection("users").doc(d.teacherId);
    const earningsRef = db.collection("teacherEarnings").doc(`${d.teacherId}_${monthKey}`);

    try {
      await db.runTransaction(async (tx) => {
        const fresh = await tx.get(docRef);
        const cur = fresh.data() || {};
        // Re-check inside the transaction: never add twice (two runs, real view meanwhile…).
        if (cur.status !== "published" || Number(cur.views) > 0) {
          throw Object.assign(new Error("skip"), { skip: `a déjà ${cur.views || 0} vue(s) ou n'est plus publié` });
        }
        tx.update(docRef, {
          views: FieldValue.increment(n),
          [`monthlyViews.${monthKey}`]: FieldValue.increment(n),
          seededViews: FieldValue.increment(n),
        });
        // increment() on a missing field starts from 0 → works for a teacher's very first view.
        tx.set(
          teacherRef,
          {
            [F.VIEWS_TOTAL]: FieldValue.increment(n),
            [F.BALANCE]: FieldValue.increment(amount),
            [F.EARNED_TOTAL]: FieldValue.increment(amount),
          },
          { merge: true }
        );
        tx.set(
          earningsRef,
          {
            teacherId: d.teacherId,
            monthKey,
            views: FieldValue.increment(n),
            amountMillimes: FieldValue.increment(amount),
            seededViews: FieldValue.increment(n),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      });
      plan.push({ ...d, added: n, rate, amount });
      console.log(`   ✔ ${d.id}  +${n} vues × ${rate} mill. = +${amount} mill.  (${short(d.title, 50)})`);
    } catch (err) {
      if (err.skip) console.log(`   ↷ ${d.id} ignoré : ${err.skip}`);
      else console.error(`   ✖ ${d.id} : ${err.message}`);
    }
  }

  if (!plan.length) {
    console.log("\nAucun document modifié.\n");
    return;
  }

  // ---------- AFTER ----------
  const afterDocs = await Promise.all(plan.map((p) => db.collection("videos").doc(p.id).get()));
  console.log(`\n📚 APRÈS — documents modifiés (${plan.length})`);
  console.table(
    plan.map((p, i) => {
      const d = afterDocs[i].data() || {};
      return {
        id: p.id,
        type: isPdf(p) ? "📄 PDF" : "🎬 Vidéo",
        titre: short(p.title),
        "vues avant": 0,
        ajoutées: p.added,
        "vues après": d.views,
        "gain enseignant": `${p.amount} mill. (${dt(p.amount)})`,
      };
    })
  );

  const after = await loadTeachers([...new Set(plan.map((p) => p.teacherId))]);
  console.log("\n👩‍🏫 APRÈS — enseignants (avant → après)");
  console.table(
    [...after.entries()].map(([uid, t]) => {
      const b = before.get(uid) || {};
      const mine = plan.filter((p) => p.teacherId === uid);
      const addedViews = mine.reduce((s, p) => s + p.added, 0);
      const addedMoney = mine.reduce((s, p) => s + p.amount, 0);
      return {
        nom: short(t?.name, 24),
        documents: mine.length,
        [F.VIEWS_TOTAL]: `${num(b[F.VIEWS_TOTAL])} → ${t?.[F.VIEWS_TOTAL]}  (+${addedViews})`,
        [F.BALANCE]: `${num(b[F.BALANCE])} → ${t?.[F.BALANCE]}  (+${addedMoney} = ${dt(t?.[F.BALANCE])})`,
        [F.EARNED_TOTAL]: `${num(b[F.EARNED_TOTAL])} → ${t?.[F.EARNED_TOTAL]}  (${dt(t?.[F.EARNED_TOTAL])})`,
      };
    })
  );

  const totalViews = plan.reduce((s, p) => s + p.added, 0);
  const totalMoney = plan.reduce((s, p) => s + p.amount, 0);
  console.log(`\n✅ ${plan.length} document(s) · +${totalViews} vues · +${totalMoney} millimes (${dt(totalMoney)}) crédités aux enseignants.\n`);
}

// ---------- Entry ----------

const [command, ...ids] = process.argv.slice(2);
const run = command === "list" ? list() : command === "add" ? add(ids) : null;

if (!run) {
  console.log(
    "Usage :\n" +
      "  node scripts/fakeViews.js list              → documents publiés à 0 vue\n" +
      "  node scripts/fakeViews.js add               → +5 à 10 vues sur chacun\n" +
      "  node scripts/fakeViews.js add <docId> ...   → seulement ces documents"
  );
  process.exit(1);
}

run.then(
  () => process.exit(0),
  (err) => {
    console.error("Échec :", err.message);
    process.exit(1);
  }
);