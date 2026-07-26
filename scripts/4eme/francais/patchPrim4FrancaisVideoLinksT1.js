// scripts/patchPrim4FrancaisVideoLinksT1.js
require("dotenv").config();
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

const GRADE_ID = "prim-4";
const SUBJECT_ID = "francais";

// This is a MERGE-ONLY patch — it does NOT touch summary/keyPoints/
// exercises/quiz on any lesson. It only adds videoLinks to existing
// lessonContent docs for Trimestre 1 (l1–l9).
//
// CONFIDENCE NOTES:
// - All 8 videos are from "Maître Lucas", a well-established French
//   primary-education YouTube channel, explicitly pitched at CE1-CE2
//   (Cycle 2) — the closest French-system equivalent to Tunisian prim-4.
// - l2, l5, l8 share the SAME video, since Maître Lucas covers être and
//   avoir together in one lesson — genuinely appropriate for all three
//   (introducing être, introducing avoir, and revising both).
// - l9: ⚠️ NO VIDEO FOUND. "Vocabulaire de l'école" is a vocabulary-themed
//   lesson rather than a grammar point, and these are far less commonly
//   covered by dedicated YouTube videos than grammar/conjugation topics.
//   Left without a videoLinks field for now.
const VIDEO_LINKS = {
  l1: [
    {
      title: "Le pluriel des noms CE2 - CM1 - Cycle 2 et 3 - Français - Orthographe",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=5F-oqTRKT_0",
    },
  ],
  l2: [
    {
      title: "La conjugaison des verbes être et avoir CE1 - CE2 - Cycle 2 - Français",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=Ca2zBTr3caw",
    },
  ],
  l3: [
    {
      title: "Différence entre article défini et indéfini + exercice (CE1 CE2 CM1 CM2)",
      url: "https://www.youtube.com/watch?v=4pQ5Xdb91FI",
    },
  ],
  l4: [
    {
      title: "Les constituants de la phrase (sujet, verbe, complément) CE1 - CE2",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=OduDKcXAXoo",
    },
  ],
  l5: [
    {
      title: "La conjugaison des verbes être et avoir CE1 - CE2 - Cycle 2 - Français",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=Ca2zBTr3caw",
    },
  ],
  l6: [
    {
      title: "La ponctuation CE1 - CE2 - Cycle 2 - Français",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=mP5vHhqqEnM",
    },
  ],
  l7: [
    {
      title: "C'est quoi le groupe nominal ? CE1 - CE2 - Cycle 2 - Français - Grammaire",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=p-jXhoJczzI",
    },
  ],
  l8: [
    {
      title: "La conjugaison des verbes être et avoir CE1 - CE2 - Cycle 2 - Français",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=Ca2zBTr3caw",
    },
  ],
  // l9: intentionally omitted — no good vocabulary-specific video found
};

async function patchVideoLinks() {
  const batch = db.batch();
  let count = 0;

  for (const [lessonId, videoLinks] of Object.entries(VIDEO_LINKS)) {
    const docId = `${GRADE_ID}_${SUBJECT_ID}_${lessonId}`;
    const ref = db.collection("lessonContent").doc(docId);
    batch.set(ref, { videoLinks }, { merge: true });
    count++;
  }

  await batch.commit();
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1)`);
  console.log(`  (l9 skipped — no suitable video found)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});