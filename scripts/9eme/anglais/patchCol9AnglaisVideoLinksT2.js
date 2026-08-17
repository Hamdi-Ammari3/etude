// scripts/patchCol9AnglaisVideoLinksT2.js
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
  l11: [
    {
      title: "Linkers of cause and consequence (because, so, therefore)",
      url: "https://www.youtube.com/watch?v=3qbfcHiUrcI",
    },
  ],
  l12: [
    {
      title: "Modal verbs of possibility (may, might)",
      url: "https://www.youtube.com/watch?v=udmQXJn5ZyA&t=2s",
    },
  ],
  l13: [
    {
      title: "Relative pronouns (who, which, that)",
      url: "https://www.youtube.com/watch?v=wle_MxGeTGg",
    },
  ],
  l14: [
    {
      title: "Modals of obligation and advice (should, must, don't)",
      url: "https://www.youtube.com/watch?v=JUIaJf-x6_U",
    },
  ],
  l15: [
    {
      title: "Forming nouns with the suffix -er",
      url: "https://www.youtube.com/watch?v=RPqxNqO8u-A",
    },
  ],
  l16: [
    {
      title: "Polite requests (Would you mind...? / Could you...?)",
      url: "https://www.youtube.com/watch?v=QWBwCoecvkM",
    },
  ],
  l18: [
    {
      title: "The present perfect for life experiences",
      url: "https://www.youtube.com/watch?v=_ftQpEpKOXo",
    },
  ],
  l19: [
    {
      title: "The First Conditional",
      url: "https://www.youtube.com/watch?v=kpDaqFQ1YCM",
    },
  ],
  l20: [
    {
      title: "Communication: the gerund (-ing form as a noun)",
      url: "https://www.youtube.com/watch?v=lw6nJHmYcaI",
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
  console.log(`  (l11, l12, l13, l14, l15, l16, l17, l18, l20 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});