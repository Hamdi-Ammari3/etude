// scripts/patchCol9FrancaisVideoLinksT2.js
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

const GRADE_ID = "col-9";
const SUBJECT_ID = "francais";

const VIDEO_LINKS = {
  l13: [
    {
      title: "Le texte informatif",
      url: "https://www.youtube.com/watch?v=Gr2ncTpeIVQ",
    },
  ],
  l14: [
    {
      title: "Pronoms COD/COI",
      url: "https://www.youtube.com/watch?v=ias_lZDHeCg",
    },
  ],
  l15: [
    {
      title: "Le futur simple et le futur antérieur — 9ème année",
      url: "https://www.youtube.com/watch?v=R9-TM9NRQ5M",
    },
  ],
  l16: [
    {
      title: "Les homophones quand/quant/qu'en — 9ème année",
      url: "https://www.youtube.com/watch?v=Zc5lIvg25I0",
    },
  ],
  l18: [
    {
      title: "Le texte argumentatif et la participation à un débat",
      url: "https://www.youtube.com/watch?v=zspsTLOzs6c",
    },
  ],
  l19: [
    {
      title: "Synonymie et polysémie",
      url: "https://www.youtube.com/watch?v=XsYyZ0fMCPc",
    },
  ],
  l20: [
    {
      title: "Expression de l'opinion",
      url: "https://www.youtube.com/watch?v=VZKGpbdlAV0&t=18s",
    },
    {
      title: "La cause et de la conséquence",
      url: "https://www.youtube.com/watch?v=yyVUzzYz6x4",
    },
  ],
  l21: [
    {
      title: "Les temps du subjonctif",
      url: "https://www.youtube.com/watch?v=zQ6TgrqfkpQ",
    },
  ],
  l22: [
    {
      title: "L'accord de « tout » (déterminant, adverbe, pronom)",
      url: "https://www.youtube.com/watch?v=c7_D4ojFV6I&t=33s",
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
  console.log(`  (l13, l14, l15, l16, l17, l18, l19, l20, l22, l23 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});