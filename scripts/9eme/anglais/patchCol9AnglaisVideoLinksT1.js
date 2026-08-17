// scripts/patchCol9AnglaisVideoLinksT1.js
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
  l1: [
    {
      title: "Question words (who, whose, why)",
      url: "https://www.youtube.com/watch?v=PUyOzCZ9XJE",
    },
  ],
  l2: [
    {
      title: "Comparatives/superlatives",
      url: "https://www.youtube.com/watch?v=jz8Fy5qQXu8&t=44s",
    },
  ],
  l3: [
    {
      title: "The Generation Gap: compound adjectives",
      url: "https://www.youtube.com/watch?v=MMb9R8-NbLE",
    },
  ],
  l4: [
    {
      title: "Pocket money vocabulary",
      url: "https://www.youtube.com/watch?v=rBXMTQ3iBZQ",
    },
  ],
  l5: [
    {
      title: "while and whereas for contrast",
      url: "https://www.youtube.com/watch?v=t0YF1oD6o-E",
    },
  ],
  l6: [
    {
      title: "The Genitive Case: Apostrophe S for Possession",
      url: "https://www.youtube.com/watch?v=eF-B9KsUaPE",
    },
  ],
  l7: [
    {
      title: "Reflexive pronouns",
      url: "https://www.youtube.com/watch?v=e6V5FuDkMG4",
    },
  ],
  l8: [
    {
      title: "First day at school: past simple and irregular verbs",
      url: "https://www.youtube.com/watch?v=oJZdkhclusQ&t=61s",
    },
  ],
  l9: [
    {
      title: "Need to, Must, Have to, Should - Obligations in English",
      url: "https://www.youtube.com/watch?v=ShhULh7mYyg",
    },
  ],
  l10: [
    {
      title: "Going to, intend to, will",
      url: "https://www.youtube.com/watch?v=IWAS5aszaGo",
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
  console.log(`  (l1, l2, l3, l4, l5, l7, l8, l9, l10 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});