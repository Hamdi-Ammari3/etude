// scripts/patchCol8ArabeVideoLinksT1.js
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
const SUBJECT_ID = "arabe";

const VIDEO_LINKS = {
  l1: [
    {
      title: "نائب الفاعل والفعل المبني للمجهول",
      url: "https://www.youtube.com/watch?v=PiAOOQJzi9M",
    },
  ],
  l2: [
    {
      title: "نائب الفاعل المركب اسميا (بالإضافة والنعت)",
      url: "https://www.youtube.com/watch?v=sO2Wsz3rBQo",
    },
  ],
  l3: [
    {
      title: "نائب الفاعل المركب موصوليا اسميا (الذي، التي...)",
      url: "https://www.youtube.com/watch?v=1slMiUv4kCQ",
    },
  ],
  l4: [
    {
      title: "نائب الفاعل المركب موصوليا حرفيا (أنّ)",
      url: "https://www.youtube.com/watch?v=1slMiUv4kCQ",
    },
  ],
  l5: [
    {
      title: "تصريف الفعل المبني للمجهول في الماضي والمضارع",
      url: "https://www.youtube.com/watch?v=zk6Urn2iZq8",
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
  console.log(`  (all 8 lessons have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});