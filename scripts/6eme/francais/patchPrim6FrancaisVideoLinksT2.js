// scripts/patchPrim6FrancaisVideoLinksT2.js
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

const GRADE_ID = "prim-6";
const SUBJECT_ID = "francais";

const VIDEO_LINKS = {
  l8: [
    {
      title: "Les compléments essentiels et non essentiels (COD/COI vs compléments circonstanciels) — CM1 CM2",
      url: "https://www.youtube.com/watch?v=WU9v-EQaPns",
    },
  ],
  l9: [
    {
      title: "Futur des verbes prendre, venir et voir — CE2",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=m2iS6J6uDAY",
    },
  ],
  l10: [
    {
      title: "L'accord sujet-verbe — CM1, CM2 et 6ème — Leçon, Exercices, Evaluations",
      url: "https://www.youtube.com/watch?v=zGYZkHX0v_I",
    },
  ],
  l11: [
    {
      title: "Le complément circonstanciel de lieu — CM1 CM2",
      url: "https://www.youtube.com/watch?v=sdBR0imeOSY",
    },
  ],
  l12: [
    {
      title: "Aller, venir, voir, faire et dire au futur — CE1 CE2 CM1 CM2",
      url: "https://www.youtube.com/shorts/5mHva4Y6xik",
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
  console.log(`  (l8, l11 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});