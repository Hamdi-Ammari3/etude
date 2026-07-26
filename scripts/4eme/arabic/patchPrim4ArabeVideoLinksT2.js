// scripts/patchPrim4ArabeVideoLinksT2.js
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
// lessonContent docs for Trimestre 2 (l9–l16).
//
// CONFIDENCE NOTES:
// - l9, l13, l14, l15, l16: confirmed exact grade match ("السنة الرابعة"
//   or "الصف الرابع" explicitly in the video title/description).
// - l12: from "مدرسة" (Madrasa) platform (credible official educational
//   source), grade not explicitly stated in title but same trusted series
//   used successfully for T1.
// - l10, l11: ⚠️ IMPERFECT MATCH — both explicitly labeled "الصف/السنة
//   الخامس/ة" (5th grade, one grade above), not 4th. Concepts (الفعل
//   المجرد والمزيد، كان وأخواتها) are advanced grammar points that may
//   genuinely first appear at grade 5 in some curricula — worth a check
//   against your actual prim-4 program to confirm these two lessons'
//   placement, independent of the video question.
const VIDEO_LINKS = {
  l9: [
    {
      title: "الفعل المضارع للاطفال | شرح الفعل المضارع | قواعد اللغة العربية للمبتدئين",
      url: "https://www.youtube.com/watch?v=_RE6JZIK5SI",
    },
  ],
  l10: [
    {
      title: "الفعل المجرّد و الفعل المزيد، شرح مبسط (السنة الخامسة ابتدائي)",
      url: "https://www.youtube.com/watch?v=7YOjkw3jpT4",
    },
  ],
  l11: [
    {
      title: "كان وأخواتها 1 | الصف الخامس | النحو",
      channel: "مدرسة (Madrasa)",
      url: "https://www.youtube.com/watch?v=evbAyPgYkIk",
    },
  ],
  l12: [
    {
      title: "النعت والمنعوت وإعرابهما",
      channel: "مدرسة (Madrasa)",
      url: "https://www.youtube.com/watch?v=_XFOqjSCREc",
    },
  ],
  l13: [
    {
      title: "حروف الجر و إعراب الإسم المجرور بطريقة لن ينساها إبنك (السنة الرابعة)",
      url: "https://www.youtube.com/watch?v=rZslIn-TZhs",
    },
  ],
  l14: [
    {
      title: "الضمائر المنفصلة والمتصلة والمستترة للصف الرابع الابتدائي",
      url: "https://www.youtube.com/watch?v=h9zzvWhM8GI",
    },
  ],
  l15: [
    {
      title: "شرح درس أدوات الاستفهام بأسلوب شيق وتفاعلي (الصف الرابع الأساسي)",
      url: "https://www.youtube.com/watch?v=rF-6CzTBywE",
    },
  ],
  l16: [
    {
      title: "مرادفات وأضداد الكلمات (السنة الرابعة ابتدائي)",
      url: "https://www.youtube.com/watch?v=3lH5iwVafWI",
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
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});