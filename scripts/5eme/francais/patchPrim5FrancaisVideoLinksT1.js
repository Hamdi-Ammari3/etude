// scripts/patchPrim5FrancaisVideoLinksT1.js
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

const VIDEO_LINKS = {
  l1: [
    {
      title: "Les types de phrases - CM1, CM2 et 6ème - Leçon, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=IYIh57ZJ0Qo",
    },
  ],
  l2: [
    {
      title: "FRANCAIS - CM1 CM2 - Identifier les formes de phrases (affirmative/négative)",
      url: "https://www.youtube.com/watch?v=LLki3pS-7NI",
    },
  ],
  l3: [
    {
      title: "FRANCAIS - CM1 CM2 - Je sais identifier le groupe nominal",
      url: "https://www.youtube.com/watch?v=4BRA6rVMF6c",
    },
  ],
  l4: [
    {
      title: "Le présent des verbes des 1er et 2e groupes — CM1 - CM2 - Cycle 3 - Français - Conjugaison",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=KmWZZ1V0UV0",
    },
  ],
  l5: [
    {
      title: "Le futur simple des verbes du 1er et 2e groupe — CM1 CM2",
      url: "https://www.youtube.com/watch?v=RR9cev0qIck",
    },
  ],
  l6: [
    {
      title: "Passé composé des verbes être et avoir — CE2 - CM1 - Cycle 2 et 3 - Français - Conjugaison",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=0hadpvyN0PY",
    },
  ],
  l7: [
    {
      title: "Les déterminants : articles, possessifs, démonstratifs — CM1 CM2",
      url: "https://www.youtube.com/watch?v=cph7C-6i09s",
    },
  ],
  l8: [
    {
      title: "Les synonymes et les antonymes — CM1 CM2",
      url: "https://www.youtube.com/watch?v=vfSanCdQ0Ng",
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
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1)`);
  console.log(`  (l5, l7, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});