// scripts/patchPrim5FrancaisVideoLinksT3.js
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

const GRADE_ID = "prim-5";
const SUBJECT_ID = "francais";

// PART 1: Trimestre 3 (l17–l24). 6 of 8 confirmed with grade-appropriate
// videos; l23/l24 get a title only (empty url) for manual search.
const VIDEO_LINKS_T3 = {
  l17: [
    {
      title: "GRAMMAIRE CM2 : Le discours direct et le discours indirect",
      url: "https://www.youtube.com/watch?v=cxorSghI9ew",
    },
  ],
  l18: [
    {
      title: "Pronom relatif : définition, liste et exemples (CM1, CM2)",
      url: "https://www.youtube.com/watch?v=1jHkHF-Gx48",
    },
  ],
  l19: [
    {
      title: "Le futur simple des verbes du 3e groupe (être, avoir, aller, faire, venir, voir...)",
      url: "https://www.youtube.com/watch?v=Jakwv0L_c-g",
    },
  ],
  l20: [
    {
      title: "Les adverbes - CM1, CM2 et 6ème - Leçon, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=79occxK19DI",
    },
  ],
  l21: [
    {
      title: "Les prépositions - CM1, CM2 et 6ème - Leçon, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=WDruvu5IXV0",
    },
  ],
  l22: [
    {
      title: "Le conditionnel présent - CM1 - CM2 - 6ème - Cours, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=38wnY7FxD20",
    },
  ],
  l23: [
    {
      title: "L'emploi de l'imparfait et du passé composé dans le récit — CM1 CM2",
      url: "https://www.youtube.com/watch?v=4IexZtlIqF0&t=471s",
    },
  ],
};

// PART 2 (bonus): fills the T1 l5 gap flagged previously (futur simple
// des verbes du 1er et 2e groupe) — found on this later search pass.
const VIDEO_LINKS_T1_FIX = {
  l5: [
    {
      title: "Le futur des verbes des 1er et 2e groupes CM1 - CM2 - Cycle 3 - Français - Conjugaison",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=cSYxB8LvCDI",
    },
  ],
};

async function patchVideoLinks() {
  const batch = db.batch();
  let count = 0;

  for (const [lessonId, videoLinks] of Object.entries(VIDEO_LINKS_T3)) {
    const docId = `${GRADE_ID}_${SUBJECT_ID}_${lessonId}`;
    const ref = db.collection("lessonContent").doc(docId);
    batch.set(ref, { videoLinks }, { merge: true });
    count++;
  }

  for (const [lessonId, videoLinks] of Object.entries(VIDEO_LINKS_T1_FIX)) {
    const docId = `${GRADE_ID}_${SUBJECT_ID}_${lessonId}`;
    const ref = db.collection("lessonContent").doc(docId);
    batch.set(ref, { videoLinks }, { merge: true });
    count++;
  }

  await batch.commit();
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID}`);
  console.log(`  (8 lessons in Trimestre 3 [l23, l24 title-only] + 1 bonus fix for Trimestre 1 l5)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});