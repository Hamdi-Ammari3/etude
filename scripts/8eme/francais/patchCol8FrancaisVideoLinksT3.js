// scripts/patchCol8FrancaisVideoLinksT3.js
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

const GRADE_ID = "col-8";
const SUBJECT_ID = "francais";

const VIDEO_LINKS = {
  l17: [
    {
      title: "La concordance des temps dans le discours rapporté",
      channel: "Bien Écrire",
      url: "https://www.youtube.com/watch?v=QM2IgXosJ6I",
    },
  ],
  l18: [
    {
      title: "Figures de style avancées : antithèse, hyperbole, gradation — 8ème année",
      url: "https://www.youtube.com/watch?v=dlanKCos_ag",
    },
  ],
  l19: [
    {
      title: "L'expression de l'hypothèse : si + présent/imparfait/plus-que-parfait — 8ème année",
      url: "https://www.youtube.com/watch?v=3VtyH_nr_ZU",
    },
  ],
  l20: [
    {
      title: "La ponctuation expressive : points de suspension, tirets, guillemets stylistiques — 8ème année",
      url: "https://www.youtube.com/watch?v=5M7l2cYaiac",
    },
  ],
  l21: [
    {
      title: "Le registre soutenu et le registre familier — 8ème année",
      url: "https://www.youtube.com/watch?v=suvnfmghg8U&t=91s",
    },
  ],
  l22: [
    {
      title: "Le point de vue narratif : interne, externe, omniscient — 8ème année",
      url: "https://www.youtube.com/watch?v=SVoqehi7UdE&t=82s",
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
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 3)`);
  console.log(`  (l18, l19, l20, l21, l22, l23, l24 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});