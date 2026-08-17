// scripts/patchCol9ArabeVideoLinksT1.js
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
const SUBJECT_ID = "arabe";

const VIDEO_LINKS = {
  l1: [
    {
      title: "مراجعة شاملة: نائب الفاعل والمركبات الموصولية",
      url: "https://www.youtube.com/watch?v=1slMiUv4kCQ&t=13s",
    },
  ],
  l2: [
    {
      title: "الحال الجملة (الاسمية والفعلية) والرابط",
      url: "https://www.youtube.com/watch?v=-r3cqT_KRKI",
    },
  ],
  l3: [
    {
      title: "التمييز: تمييز الذات وتمييز النسبة",
      url: "https://www.youtube.com/watch?v=SiE-W4BQ5-8",
    },
  ],
  l4: [
    {
      title: "أسلوب الاستثناء: التام المثبت، التام المنفي، الناقص",
      url: "https://www.youtube.com/watch?v=ackUHbLah2I",
    },
  ],
  l5: [
    {
      title: "أدوات الشرط الجازمة وغير الجازمة",
      url: "https://www.youtube.com/watch?v=qdv4CQQx3bg",
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
  console.log(`  (l1, l2, l3, l4, l6, l7, l8 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});