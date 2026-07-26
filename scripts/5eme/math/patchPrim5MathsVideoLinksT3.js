// scripts/patchPrim5MathsVideoLinksT3.js
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

const GRADE_ID = "prim-5";
const SUBJECT_ID = "maths";

const VIDEO_LINKS = {
  l19: [
    {
      title: "ضرب الأعداد العشرية في عدد صحيح — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=u4nz7r_VWQY",
    },
  ],
  l20: [
    {
      title: "قسمة عدد عشري على عدد صحيح — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=O_qUDsfuZ4c",
    },
  ],
  l21: [
    {
      title: "رسم المستطيل والمربع بالكوس والمسطرة — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=Tuo3jeD4oOg&t=1s",
    },
  ],
  l22: [
    {
      title: "القسمة على قاسم عشري (تحويل القاسم إلى عدد صحيح) — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=ONFTmEmADfY",
    },
  ],
  l23: [
    {
      title: "تصنيف المثلثات حسب الأضلاع والزوايا — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=361cjiuJUdY",
    },
  ],
  l24: [
    {
      title: "ضرب أعداد الزمن (ساعات ودقائق) في عدد صحيح — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=M0r-D1i237A",
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
  console.log(`  (all 6 lessons have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});