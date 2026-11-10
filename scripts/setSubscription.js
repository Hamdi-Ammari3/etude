// Manage student subscriptions (all grades + all subjects, max 1000 different documents).
//
// Usage (from the project root):
//   node scripts/setSubscription.js show <phone>
//       → subscription, documents opened / quota, end date, last opened documents
//   node scripts/setSubscription.js activate <phone> [--months 12] [--quota 1000]
//       → new subscription (or renewal): counter back to 0, ends in N months
//   node scripts/setSubscription.js add-quota <phone> <n>
//       → adds n documents to the current subscription (gesture, compensation…)
//   node scripts/setSubscription.js cancel <phone>
//       → suspends the subscription (documents can't be opened any more)
//   node scripts/setSubscription.js migrate-legacy [--write]
//       → students who bought a grade before the switch (purchasedGrades) get a
//         12-month subscription starting today. Dry run unless --write.
//
// Renewing starts a NEW cycle: documents opened before count again from 0.
// The previous subscription is saved in users/{uid}/subscriptionHistory.

require("dotenv").config();
const admin = require("firebase-admin");
const { normalizePhone, buildUid } = require("../lib/phone");

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
const { FieldValue, Timestamp } = admin.firestore;

// Same values as lib/subscription.js
const DOC_QUOTA = 1000;
const SUBSCRIPTION_MONTHS = 12;

// ---------- Helpers ----------

function argValue(args, name, fallback) {
  const i = args.indexOf(name);
  if (i === -1) return fallback;
  const v = Number(args[i + 1]);
  if (!Number.isFinite(v) || v <= 0) throw new Error(`Valeur invalide pour ${name}`);
  return v;
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

const fmtDate = (ts) => {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return isNaN(d) ? "—" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

async function loadStudent(phoneArg) {
  const canonical = normalizePhone(String(phoneArg || ""));
  if (!canonical) throw new Error(`Numéro invalide : ${phoneArg}`);
  const uid = buildUid(canonical);
  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();
  if (!snap.exists) throw new Error(`Aucun compte pour ${canonical} (uid: ${uid})`);
  return { uid, ref, data: snap.data() };
}

function describe(data) {
  const s = data.subscription;
  if (!s) {
    const legacy = Array.isArray(data.purchasedGrades) && data.purchasedGrades.length > 0;
    return legacy
      ? `ancien abonnement par niveau (${data.purchasedGrades.join(", ")}) — accès à tout, compteur pas encore créé`
      : "aucun abonnement";
  }
  const ended = s.endsAt && (s.endsAt.toMillis ? s.endsAt.toMillis() : new Date(s.endsAt).getTime()) <= Date.now();
  const state = s.active === false ? "⏸️ suspendu" : ended ? "⏰ expiré" : "✅ actif";
  return `${state} · ${s.used || 0} / ${s.quota || DOC_QUOTA} documents ouverts · du ${fmtDate(s.startedAt)} au ${fmtDate(s.endsAt)} · cycle ${s.cycleId}`;
}

// ---------- Commands ----------

async function show(phone) {
  const { uid, ref, data } = await loadStudent(phone);
  console.log(`\n👤 ${data.name || uid} (${uid}) — rôle : ${data.role || "?"}`);
  console.log(`   ${describe(data)}`);
  const cycle = data.subscription?.cycleId;
  if (cycle) {
    const opened = await ref.collection("openedDocs").where("cycleId", "==", cycle).get();
    const last = opened.docs
      .map((d) => d.data())
      .sort((a, b) => (b.openedAt?.toMillis?.() || 0) - (a.openedAt?.toMillis?.() || 0))
      .slice(0, 10);
    if (last.length) {
      console.log("\n   Derniers documents ouverts :");
      last.forEach((d) => console.log(`   · ${fmtDate(d.openedAt)}  ${d.type === "pdf" ? "📄" : "🎬"} ${d.title || d.docId}`));
    }
  }
  console.log("");
}

async function activate(phone, args) {
  const months = argValue(args, "--months", SUBSCRIPTION_MONTHS);
  const quota = argValue(args, "--quota", DOC_QUOTA);
  const { uid, ref, data } = await loadStudent(phone);
  if (data.role === "teacher") throw new Error("Ce compte est un enseignant.");

  const now = new Date();
  const cycleId = `c${now.getTime()}`;
  const subscription = {
    active: true,
    cycleId,
    quota,
    used: 0,
    startedAt: Timestamp.fromDate(now),
    endsAt: Timestamp.fromDate(addMonths(now, months)),
    // Always a paid plan: also turns a free-trial account into a paid one
    // (set with merge keeps nested fields, so "trial" must be overwritten).
    plan: "paid",
    updatedAt: FieldValue.serverTimestamp(),
  };

  const batch = db.batch();
  if (data.subscription) {
    batch.set(ref.collection("subscriptionHistory").doc(String(data.subscription.cycleId || `old-${Date.now()}`)), {
      ...data.subscription,
      archivedAt: FieldValue.serverTimestamp(),
    });
  }
  batch.set(ref, { subscription }, { merge: true });
  await batch.commit();

  console.log(`\n👤 ${data.name || uid}`);
  console.log(`   Avant : ${describe(data)}`);
  console.log(`   Après : ${describe({ ...data, subscription: { ...subscription, startedAt: now, endsAt: addMonths(now, months) } })}\n`);
}

async function addQuota(phone, nArg) {
  const n = Number(nArg);
  if (!Number.isInteger(n) || n <= 0) throw new Error("Usage : add-quota <phone> <nombre>");
  const { uid, ref, data } = await loadStudent(phone);
  if (!data.subscription) throw new Error("Pas d'abonnement à compléter — utilisez « activate ».");
  await ref.set({ subscription: { quota: FieldValue.increment(n), updatedAt: FieldValue.serverTimestamp() } }, { merge: true });
  const after = (await ref.get()).data();
  console.log(`\n👤 ${data.name || uid}\n   Avant : ${describe(data)}\n   Après : ${describe(after)}\n`);
}

async function cancel(phone) {
  const { uid, ref, data } = await loadStudent(phone);
  if (!data.subscription) throw new Error("Pas d'abonnement à suspendre.");
  await ref.set({ subscription: { active: false, updatedAt: FieldValue.serverTimestamp() } }, { merge: true });
  const after = (await ref.get()).data();
  console.log(`\n👤 ${data.name || uid}\n   Avant : ${describe(data)}\n   Après : ${describe(after)}\n`);
}

async function migrateLegacy(args) {
  const write = args.includes("--write");
  const snap = await db.collection("users").get();
  const todo = snap.docs.filter((d) => {
    const u = d.data();
    return u.role !== "teacher" && u.role !== "admin" && !u.subscription && Array.isArray(u.purchasedGrades) && u.purchasedGrades.length > 0;
  });
  console.log(`\n${todo.length} élève(s) avec un ancien abonnement par niveau, sans abonnement global :`);
  todo.forEach((d) => console.log(`   · ${d.data().name || d.id} (${d.id}) — ${d.data().purchasedGrades.join(", ")}`));
  if (!write) {
    console.log("\nDry run — relancez avec --write pour leur créer un abonnement de 12 mois.\n");
    return;
  }
  const now = new Date();
  for (let i = 0; i < todo.length; i += 400) {
    const batch = db.batch();
    todo.slice(i, i + 400).forEach((d) =>
      batch.set(
        d.ref,
        {
          subscription: {
            active: true,
            cycleId: `c${now.getTime()}`,
            quota: DOC_QUOTA,
            used: 0,
            startedAt: Timestamp.fromDate(now),
            endsAt: Timestamp.fromDate(addMonths(now, SUBSCRIPTION_MONTHS)),
            migratedFrom: "purchasedGrades",
            updatedAt: FieldValue.serverTimestamp(),
          },
        },
        { merge: true }
      )
    );
    await batch.commit();
  }
  console.log(`\n✅ ${todo.length} abonnement(s) créé(s), jusqu'au ${fmtDate(addMonths(now, SUBSCRIPTION_MONTHS))}.\n`);
}

// ---------- Entry ----------

const [command, ...rest] = process.argv.slice(2);
const commands = {
  show: () => show(rest[0]),
  activate: () => activate(rest[0], rest.slice(1)),
  "add-quota": () => addQuota(rest[0], rest[1]),
  cancel: () => cancel(rest[0]),
  "migrate-legacy": () => migrateLegacy(rest),
};

if (!commands[command]) {
  console.log(
    "Usage :\n" +
      "  node scripts/setSubscription.js show <phone>\n" +
      "  node scripts/setSubscription.js activate <phone> [--months 12] [--quota 1000]\n" +
      "  node scripts/setSubscription.js add-quota <phone> <n>\n" +
      "  node scripts/setSubscription.js cancel <phone>\n" +
      "  node scripts/setSubscription.js migrate-legacy [--write]"
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