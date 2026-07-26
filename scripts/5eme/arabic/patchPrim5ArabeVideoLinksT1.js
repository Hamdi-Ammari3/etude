// scripts/patchPrim5ArabeVideoLinksT1.js
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
const SUBJECT_ID = "arabe";

const VIDEO_LINKS = {
  l1: [
    {
      title: "النكرة والمعرفة | الصف الخامس | الاسم وأقسامه",
      channel: "مدرسة (Madrasa)",
      url: "https://www.youtube.com/watch?v=ld_i7ZHOyo8",
    },
  ],
  l2: [
    {
      title: "الفعل المجرد والمزيد: تعلم الفرق بينهم بخطوات بسيطة (سنة خامسة ابتدائي)",
      url: "https://www.youtube.com/watch?v=B9IEFv1UCs0",
    },
  ],
  l3: [
    {
      title: "الفعل الصحيح والفعل المعتل — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=v46-Eu2bSIM",
    },
  ],
  l4: [
    {
      title: "المركب بالإضافة والمركب بالجر — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=qVvZ1u6ApFY",
    },
  ],
  l5: [
    {
      title: "المركب النعتي والمركب العطفي — سنة خامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=bBTzMyaqLtI",
    },
  ],
  l6: [
    {
      title: "الفعل المهموز — السنة 5/6 عربية",
      url: "https://www.youtube.com/watch?v=0g8ek_a0n5k",
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
  console.log(`  (l4, l5 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});