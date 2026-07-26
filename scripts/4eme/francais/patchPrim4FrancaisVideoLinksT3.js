// scripts/patchPrim4FrancaisVideoLinksT3.js
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
// lessonContent docs.
//
// PART 1: Trimestre 3 (l19–l27) — all 9 lessons found good matches this
// time, mostly Maître Lucas (CE1-CE2), a couple from other kid-oriented
// channels where topically exact.
//
// PART 2 (bonus): fills the T2 l14 gap flagged previously — a genuine
// CE2-CM1 video for "verbes en -ger et -cer" surfaced on a later search
// pass that I'd missed the first time.
const VIDEO_LINKS_T3 = {
  l19: [
    {
      title: "COD - Complément d'Objet Direct : Grammaire française CE2",
      url: "https://www.youtube.com/watch?v=fV8cBjc1QYc",
    },
  ],
  l20: [
    {
      title: "Le présent des verbes du deuxième groupe - CE2",
      channel: "Petits Savants",
      url: "https://www.youtube.com/watch?v=QdHUE4RU3wY",
    },
  ],
  l21: [
    {
      title: "Avoir mal à + les parties du corps en français. Exprimer la douleur",
      url: "https://www.youtube.com/watch?v=QrlJ1muGBao",
    },
  ],
  l22: [
    {
      title: "Les mots invariables (CE2)",
      url: "https://www.youtube.com/watch?v=p3awrIyRgZY",
    },
  ],
  l23: [
    {
      title: "Le futur des verbes du 1er groupe CE1 - CE2",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=0iFzmqlNXiA",
    },
  ],
  l24: [
    {
      title: "Les homophones es, est, et | Cours CE1-CE2",
      url: "https://www.youtube.com/watch?v=mDSTKPzXsqQ",
    },
  ],
  l25: [
    {
      title: "Les types de phrases CE1 - CE2 - CP - Cycle 2",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=aGW2DfMLhCY",
    },
  ],
  l26: [
    {
      title: "Futur des verbes être et avoir CE1 - CE2",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=RLZXVVOHGb4",
    },
  ],
  l27: [
    {
      title: "Les saisons CP - CE1 - CE2 - Cycle 2 - Questionner le monde",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=W7kfkC5Ru6Y",
    },
  ],
};

// Bonus fix for Trimestre 2, l14 (previously left unresolved)
const VIDEO_LINKS_T2_FIX = {
  l14: [
    {
      title: "Le présent des verbes en -ger et -cer CE2 - CM1",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=v529twta4T8",
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

  for (const [lessonId, videoLinks] of Object.entries(VIDEO_LINKS_T2_FIX)) {
    const docId = `${GRADE_ID}_${SUBJECT_ID}_${lessonId}`;
    const ref = db.collection("lessonContent").doc(docId);
    batch.set(ref, { videoLinks }, { merge: true });
    count++;
  }

  await batch.commit();
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID}`);
  console.log(`  (9 lessons in Trimestre 3 + 1 bonus fix for Trimestre 2 l14)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});