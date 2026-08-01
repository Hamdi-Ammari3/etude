// scripts/patchPrim6AnglaisVideoLinksT2.js
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
  l9: [
    {
      title: "Irregular verbs in the past tense: go/went, eat/ate, see/saw",
      url: "https://www.youtube.com/watch?v=oJZdkhclusQ",
    },
  ],
  l10: [
    {
      title: "Places in town vocabulary: hospital, bank, library, post office",
      url: "https://www.youtube.com/watch?v=EsWIJj04oQw",
    },
  ],
  l11: [
    {
      title: "The imperative: giving instructions and orders in English",
      url: "https://www.youtube.com/watch?v=uL-Vwtcn9wY",
    },
  ],
  l12: [
    {
      title: "Jobs and professions vocabulary: What does he/she do?",
      url: "https://www.youtube.com/watch?v=ugsRzHMIF2o",
    },
  ],
  l13: [
    {
      title: "Modal Verbs in English for Kids | Can, Could, May, Might, Must, Should",
      url: "https://www.youtube.com/watch?v=udmQXJn5ZyA",
    },
  ],
  l14: [
    {
      title: "Will vs Be Going to — Future Tense Trick (English Grammar Lesson)",
      url: "https://www.youtube.com/watch?v=jGjgS6tBuXM",
    },
  ],
  l15: [
    {
      title: "Sequencing words: First, Then, Next, Finally",
      url: "https://www.youtube.com/watch?v=4AMptAmS_xM",
    },
  ],
  l16: [
    {
      title: "Technology and communication vocabulary: computer, phone, email, video call",
      url: "https://www.youtube.com/watch?v=difvQyWFmxw",
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
  console.log(`  (l9, l10, l11, l12, l15, l16 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});