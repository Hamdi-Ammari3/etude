// scripts/patchPrim4ArabeVideoLinksT1.js
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
// lessonContent docs for Trimestre 1 (l1–l8).
//
// CONFIDENCE NOTES:
// - l1, l4, l8: confirmed exact grade match ("السنة الرابعة ابتدائي"
//   explicitly stated in the video title/description).
// - l6: explicitly states "مستوى السنة الرابعة والخامسة ابتدائي" — exact
//   grade match, exact topic match.
// - l2: from "مدرسة" (Madrasa) platform (Mohammed bin Rashid Al Maktoum
//   Initiative, a credible official educational source), labeled "الصف
//   الرابع" — exact grade match.
// - l3: general punctuation explainer (النقطة، التعجب، الاستفهام), not
//   grade-specific but topically exact.
// - l5: ⚠️ IMPERFECT MATCH — same "مدرسة" platform series, but this
//   specific video is labeled "الصف الثاني" (2nd grade), not 4th. The
//   concept (مذكر/مؤنث) doesn't fundamentally change between grades, but
//   the video's pacing/examples may feel too basic for a 4th grade student.
//   Consider replacing if you find/verify a better grade-4-specific option.
// - l7: ⚠️ NO VIDEO FOUND. I could not find a good match for "فهم الحوار"
//   (reading comprehension of a written dialogue text with الشرطة
//   punctuation) at this grade level — most results were either about
//   spoken-dialogue etiquette (a civics topic, not Arabic language) or for
//   the wrong grade. Left without a videoLinks field for now rather than
//   force a mismatch.
const VIDEO_LINKS = {
  l1: [
    {
      title: "الجملة الاسمية المبتدأ والخبر السنة الرابعة ابتدائي",
      url: "https://www.youtube.com/watch?v=J3anvEmNCN0",
    },
  ],
  l2: [
    {
      title: "عناصر الجملة الفعلية | الصف الرابع | النحو",
      channel: "مدرسة (Madrasa)",
      url: "https://www.youtube.com/watch?v=6ieDuhI__bU",
    },
  ],
  l3: [
    {
      title: "شرح علامات الترقيم ( . ! ؟ )",
      url: "https://www.youtube.com/watch?v=jjz4bJU4RTE",
    },
  ],
  l4: [
    {
      title: "المفرد والمثنى والجمع شرح وحل تدريبات ص28 للصف الرابع الابتدائي",
      url: "https://www.youtube.com/watch?v=YuwTAz1RlW0",
    },
  ],
  l5: [
    {
      title: "المذكر والمؤنث | الصف الثاني | النحو",
      channel: "مدرسة (Madrasa)",
      url: "https://www.youtube.com/watch?v=hLMRU45o1w8",
    },
  ],
  l6: [
    {
      title: "تصريف الفعل الماضي مع جميع الضمائر (مستوى السنة الرابعة والخامسة ابتدائي)",
      url: "https://www.youtube.com/watch?v=1jMLHAJhSow",
    },
  ],
  // l7: intentionally omitted — no good match found
  l8: [
    {
      title: "المفعول به للسنة الرابعة ابتدائي",
      url: "https://www.youtube.com/watch?v=knWZCyL7hw4",
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
  console.log(`  (l7 skipped — no suitable video found)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});