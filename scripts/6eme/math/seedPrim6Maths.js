// scripts/seedPrim6Maths.js
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
const SUBJECT_ID = "maths";

// Sourced from a real Tunisian teacher's curriculum planning document (شكيب بن
// مسعود), organized by "فترة" (period), same source family as prim-5 arabe.
// The source itself has numbering artifacts (two entries both labeled "8";
// numbers "16" and "21" missing from the list) — preserved faithfully as 23
// real lesson entries using our own sequential l1-l23 IDs rather than forcing
// a clean count. Mapped 2 فترات per trimestre: فترة1+2 → T1 (14 lessons),
// فترة3+4 → T2 (6 lessons), فترة5+6 → T3 (3 lessons; the last item's فترة
// wasn't labeled in the source and is inferred as فترة6).
const LESSONS = [
  // الفترة 1
  { title: "الجمع و الطرح والضرب في مجموعة الأعداد العشرية", trimestre: 1 },
  { title: "القسمة في مجموعة الأعداد العشرية", trimestre: 1 },
  { title: "أتصرف في وحدات قيس المساحة", trimestre: 1 },
  { title: "التعامد والتوازي ومنصف الزاوية", trimestre: 1 },
  { title: "أجمع وأطرح وأضرب الأعداد التي تقيس الزمن", trimestre: 1 },
  { title: "بناء زوايا أقيستها بالدرجة 15-30-45-60-90-120", trimestre: 1 },
  { title: "بناء المثلثات", trimestre: 1 },
  { title: "المضاعفات المشتركة لعددين صحيحين", trimestre: 1 },
  { title: "تعرف شبه المنحرف ورسمه", trimestre: 1 },
  { title: "أوظف التناسب في السلم", trimestre: 1 },
  { title: "تعرف متوازيات الأضلاع وخاصياتها", trimestre: 1 },
  { title: "التصرف في الأعداد الكسرية", trimestre: 1 },
  { title: "أحسب قيس محيط الدائرة", trimestre: 1 },
  { title: "أتدرب على حل المسائل", trimestre: 1 },

  { title: "أتعرف قابلية قسمة عدد صحيح طبيعي على الأعداد 2 و5 و3 و9", trimestre: 2 },
  { title: "محيط شكل مركب من الأشكال المدروسة", trimestre: 2 },
  { title: "أوظف التناسب في تعرف النسبة المئوية", trimestre: 2 },
  { title: "أحسب قيس مساحة المثلث", trimestre: 2 },
  { title: "رسم متوازيات الأضلاع وبناؤها", trimestre: 2 },
  { title: "أجمع الأعداد الكسرية وأطرحها", trimestre: 2 },

  { title: "أوظف التناسب في حساب المسافة والزمن ومعدل السرعة", trimestre: 3 },
  { title: "أوظف الجمع والطرح والضرب في مجموعة الأعداد الكسرية", trimestre: 3 },
  { title: "مساحة شكل مركب من الأشكال المدروسة", trimestre: 3 },
];

async function seedPrim6Maths() {
  const batch = db.batch();

  LESSONS.forEach((lesson, index) => {
    const order = index + 1;
    const lessonId = `l${order}`;
    const docId = `${GRADE_ID}_${SUBJECT_ID}_${lessonId}`;
    const ref = db.collection("lessons").doc(docId);

    batch.set(ref, {
      gradeId: GRADE_ID,
      subjectId: SUBJECT_ID,
      lessonId,
      order,
      title: lesson.title,
      trimestre: lesson.trimestre,
    });
  });

  await batch.commit();
  console.log(`✔ seedPrim6Maths: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim6Maths();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});