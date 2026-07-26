// scripts/patchPrim4ArabeVideoLinksT3.js
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

const GRADE_ID = "prim-4";
const SUBJECT_ID = "arabe";

// This is a MERGE-ONLY patch — it does NOT touch summary/keyPoints/
// exercises/quiz on any lesson. It only adds videoLinks to existing
// lessonContent docs for Trimestre 3 (l17–l24).
//
// CONFIDENCE NOTES:
// - l17, l19, l20, l21, l22, l24: confirmed exact grade match ("السنة
//   الرابعة" or "الصف الرابع" explicitly in the video title/description).
// - l23: from "مدرسة" (Madrasa) platform (credible official source), but
//   labeled "الصف الثالث" (3rd grade, one grade below). Concept doesn't
//   fundamentally change, but pacing may feel slightly basic.
// - l18: ⚠️ NO VIDEO FOUND. Search results for "التمييز" at the primary
//   level kept surfacing content explicitly for "السنة الرابعة متوسط"
//   (Algerian middle school, roughly equivalent to 8th grade — NOT the
//   same "رابعة" as this platform's prim-4/رابعة ابتدائي). Rather than use
//   a video pitched 4 grade-levels too advanced, this lesson is left
//   without a videoLinks field for now.
const VIDEO_LINKS = {
  l17: [
    {
      title: "تصحيح تدريب فعل الأمر و إعرابه (السنة الرابعة ابتدائي)",
      url: "https://www.youtube.com/watch?v=Mik9wxqWMpM",
    },
  ],
  // l18: intentionally omitted — no good grade-appropriate match found
  l19: [
    {
      title: "الأسماء الموصولة للسنة الرابعة و الخامسة ابتدائي",
      url: "https://www.youtube.com/watch?v=T3voXaImkXY",
    },
  ],
  l20: [
    {
      title: "أدوات النفي لم – لن – لا | الشرح السهل مع تمارين تطبيقية",
      url: "https://www.youtube.com/watch?v=0cHCJzDCFRg",
    },
  ],
  l21: [
    {
      title: "تمارين نهاية الأسبوع: إعراب المثنى (السنة 4 ابتدائي)",
      url: "https://www.youtube.com/watch?v=9rNj-BSB2yg",
    },
  ],
  l22: [
    {
      title: "إعراب جمع المذكر السالم (السنة الرابعة ابتدائي)",
      url: "https://www.youtube.com/watch?v=5widECQTY0Q",
    },
  ],
  l23: [
    {
      title: "أسلوب التعجب | الصف الثالث | النحو",
      channel: "مدرسة (Madrasa)",
      url: "https://www.youtube.com/watch?v=u6M2giwSK4o",
    },
  ],
  l24: [
    {
      title: "الجملة الاسمية والجملة الفعلية للصف الرابع الابتدائى",
      url: "https://www.youtube.com/watch?v=kWAkAJj3pHE",
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
  console.log(`  (l18 skipped — no suitable grade-appropriate video found)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});