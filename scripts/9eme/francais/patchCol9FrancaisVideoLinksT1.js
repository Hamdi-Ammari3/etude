// scripts/patchCol9FrancaisVideoLinksT1.js
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
  l2: [
    {
      title: "L'expression du temps",
      url: "https://www.youtube.com/watch?v=FYtS8TXOeTw",
    },
  ],
  l3: [
    {
      title: "Le passé simple du 1er et 2e groupe",
      url: "https://www.youtube.com/watch?v=j6vqRM9FOMc",
    },
  ],
  l4: [
    {
      title: "Quel(s)/Quelle(s) et l'homophone qu'elle(s)",
      url: "https://www.youtube.com/watch?v=Vr5S8ABo_Nc",
    },
  ],
  l5: [
    {
      title: "Produire un récit avec dialogue : ponctuation et verbes de parole",
      url: "https://www.youtube.com/watch?v=tH_NLX43ibo&t=51s",
    },
  ],
  l6: [
    {
      title: "Le texte descriptif : portraits et comportements",
      url: "https://www.youtube.com/watch?v=Fm5z_8jHcHg",
    },
  ],
  l7: [
    {
      title: "Synonymie, sens propre et figuré, comparaison et métaphore",
      url: "https://www.youtube.com/watch?v=vzKihYl5WG8",
    },
  ],
  l8: [
    {
      title: "Expansions du groupe nominal et l'attribut du sujet",
      url: "https://www.youtube.com/watch?v=t3CzNICEHW4",
    },
  ],
  l9: [
    {
      title: "Imparfait et plus-que-parfait dans le récit",
      url: "https://www.youtube.com/watch?v=73wgXwkfFMs",
    },
  ],
  l10: [
    {
      title: "L'accord des adjectifs de couleur",
      url: "https://www.youtube.com/watch?v=HGjzTJvzDaU",
    },
  ],
  l11: [
    {
      title: "Intégrer une description dans un récit",
      url: "https://www.youtube.com/watch?v=MC7aitwqOnI",
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
  console.log(`  (l1, l2, l4, l5, l6, l7, l8, l9, l10, l11, l12 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});