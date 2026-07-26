// scripts/patchPrim4FrancaisVideoLinksT2.js
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
// lessonContent docs for Trimestre 2 (l10–l18).
//
// CONFIDENCE NOTES:
// - Most videos are from "Maître Lucas" (CE1-CE2/Cycle 2), the closest
//   French-system equivalent to Tunisian prim-4.
// - l11 and l17 share the SAME video (verbes du 1er groupe au présent) —
//   genuinely appropriate for both introducing and revising the topic.
// - l12 reuses the same video already patched for T1 l1 (pluriel des
//   noms), since both lessons cover the identical rule.
// - l15: not from Maître Lucas, but a dedicated kids' vocabulary video on
//   family vocabulary/family tree, well-suited to the lesson content.
// - l14: ⚠️ NO VIDEO FOUND at the right grade level. The -ger/-cer spelling
//   rule (nous mangeons, nous commençons) seems to be taught starting CM1
//   in the French system — all dedicated videos found were CM1-CM2 (2
//   grade levels above prim-4/CE1-CE2). Left without a videoLinks field
//   rather than use a meaningfully-too-advanced video.
const VIDEO_LINKS = {
  l10: [
    {
      title: "Les adjectifs qualificatifs CE1 - CE2 - CM1 - CM2",
      url: "https://www.youtube.com/watch?v=NDhlU-p900Q",
    },
  ],
  l11: [
    {
      title: "La conjugaison des verbes en -er au présent CE1 - CE2",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=luyObngrtJg",
    },
  ],
  l12: [
    {
      title: "Le pluriel des noms CE2 - CM1 - Cycle 2 et 3 - Français - Orthographe",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=5F-oqTRKT_0",
    },
  ],
  l13: [
    {
      title: "Phrases affirmatives et négatives CE1 - CE2 - Cycle 2 - Français",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=zNHm9LvsxqE",
    },
  ],
  // l14: intentionally omitted — no CE1-CE2-level video found
  l15: [
    {
      title: "La famille - L'arbre généalogique pour enfants - Vocabulaire",
      url: "https://www.youtube.com/watch?v=dw-05yO2hn4",
    },
  ],
  l16: [
    {
      title: "Les pronoms personnels sujets CP - CE1 - Cycle 2 - Français",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=pAs6wipv3R4",
    },
  ],
  l17: [
    {
      title: "La conjugaison des verbes en -er au présent CE1 - CE2",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=luyObngrtJg",
    },
  ],
  l18: [
    {
      title: "CE2 Orthographe 17 : le féminin des adjectifs",
      url: "https://www.youtube.com/watch?v=1UeoOKuHrRI",
    },
  ],
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
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 2)`);
  console.log(`  (l14 skipped — no suitable grade-appropriate video found)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});