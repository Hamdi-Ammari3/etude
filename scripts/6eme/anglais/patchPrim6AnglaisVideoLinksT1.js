// scripts/patchPrim6AnglaisVideoLinksT1.js
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
const SUBJECT_ID = "anglais";

const VIDEO_LINKS = {
  l1: [
    {
      title: "Suggestions with Let's — song for kids | English grammar for kids",
      channel: "Aprende con Víctor",
      url: "https://www.youtube.com/watch?v=TcB4yBnzD9I",
    },
  ],
  l2: [
    {
      title: "Free time activities and hobbies: I like/love/enjoy + verb-ing",
      url: "https://www.youtube.com/watch?v=LkhVNg4z27g",
    },
  ],
  l3: [
    {
      title: "A day out: zoo, beach, park, museum — talking about a past outing",
      url: "https://www.youtube.com/watch?v=B_PgnuiPLi8",
    },
  ],
  l4: [
    {
      title: "Easy English Learning! Present Simple vs Present Continuous",
      url: "https://www.youtube.com/watch?v=IL9ImXyvL-E",
    },
  ],
  l5: [
    {
      title: "Feelings and opinions: happy, bored, amazing, terrible",
      url: "https://www.youtube.com/watch?v=jetoWelJJJk",
    },
  ],
  l6: [
    {
      title: "Question words review: who, what, where, when, why, how",
      url: "https://www.youtube.com/watch?v=x_4AjSwTXdc",
    },
  ],
  l7: [
    {
      title: "Sports and games vocabulary: play vs do",
      url: "https://www.youtube.com/watch?v=9AOAH0j14qQ",
    },
  ],
  l8: [
    {
      title: "Past Simple Regular Verbs | English Grammar Videos",
      url: "https://www.youtube.com/watch?v=sYRbVTJXH64",
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
  console.log(`  (l2, l3, l5, l6, l7 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});