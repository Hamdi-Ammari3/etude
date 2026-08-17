// scripts/patchCol9AnglaisVideoLinksT3.js
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
const SUBJECT_ID = "anglais";

const VIDEO_LINKS = {
  l21: [
    {
      title: "Expressing uncertainty and certainty",
      url: "https://www.youtube.com/watch?v=d_QO26QtYwM",
    },
  ],
  l22: [
    {
      title: "Exclamations (What a...!, How...!) and expressions of satisfaction",
      url: "https://www.youtube.com/watch?v=kZkfZwTCed8",
    },
  ],
  l23: [
    {
      title: "Where shall we go? Making suggestions",
      url: "https://www.youtube.com/watch?v=vqbUM80kQBk",
    },
  ],
  l24: [
    {
      title: "Expressing regret (I'm so sorry that..., I regret + Ving)",
      url: "https://www.youtube.com/watch?v=CV5i4U9srrs",
    },
  ],
  l25: [
    {
      title: "Expressing interest and indifference",
      url: "https://www.youtube.com/watch?v=SqpFaRqLAfE",
    },
  ],
  l26: [
    {
      title: "Can/cannot for ability and inability",
      url: "https://www.youtube.com/watch?v=_facQiZDrU4",
    },
  ],
  l27: [
    {
      title: "Offering help (Can I help you? / What can I do for you?)",
      url: "https://www.youtube.com/watch?v=PZK3QV_8pgM",
    },
  ],
  l28: [
    {
      title: "The past progressive (was/were + Ving)",
      url: "https://www.youtube.com/watch?v=RlEF3-onNWU",
    },
  ],
  l29: [
    {
      title: "How to Express Your Opinion in English",
      url: "https://www.youtube.com/watch?v=6aUH1R6bIFE&t=18s",
    },
  ],
  l30: [
    {
      title: "Expressing hope (I hope that...)",
      url: "https://www.youtube.com/watch?v=w0U49Tod9N8",
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
  console.log(`  (l21, l22, l23, l24, l25, l26, l27, l28, l30 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});