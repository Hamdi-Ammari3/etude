// scripts/patchCol7FrancaisVideoLinksT2.js
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

const GRADE_ID = "col-7";
const SUBJECT_ID = "francais";

const VIDEO_LINKS = {
  l9: [
    {
      title: "L'imparfait (CE1 - CE2 - CM1 - CM2)",
      url: "https://www.youtube.com/watch?v=C6caY0y06Qc",
    },
  ],
  l10: [
    {
      title: "GRAMMAIRE CM2 : Le discours direct et le discours indirect",
      url: "https://www.youtube.com/watch?v=GWkl7ycY-84",
    },
  ],
  l11: [
    {
      title: "Pronom relatif : définition, liste et exemples (CM1, CM2)",
      url: "https://www.youtube.com/watch?v=VQj17RvR8fE",
    },
  ],
  l12: [
    {
      title: "Les compléments circonstanciels — CM1 - CM2 - Cycle 3 - Français - Grammaire",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=sdBR0imeOSY",
    },
  ],
  l13: [
    {
      title: "Futur simple ou futur proche ?",
      url: "https://www.youtube.com/watch?v=1z4vQn95Egs",
    },
  ],
  l14: [
    {
      title: "Synonymes, antonymes et homonymes — 6ème",
      url: "https://www.youtube.com/watch?v=om2DmpdQ9V8",
    },
  ],
  l15: [
    {
      title: "Ponctuation et mise en page d'un dialogue écrit — 6ème",
      url: "https://www.youtube.com/watch?v=tH_NLX43ibo",
    },
  ],
  l16: [
    {
      title: "Écrire une description : le portrait et le paysage — 6ème",
      url: "https://www.youtube.com/watch?v=f2hzFIxdZp8",
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
  console.log(`  (l14, l15, l16 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});