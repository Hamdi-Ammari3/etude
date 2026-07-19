// scripts/seedCol8Arabe.js
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

// Confirmed real topics sourced from Tadris.TN for السنة الثامنة أساسي —
// عربية (l3, l4, l9/l10, l11, l13, l17 correspond to genuinely listed
// topics: نائب الفاعل مركبا موصوليا حرفيا أو اسميا؛ نوع المركب الموصولي
// اسمي أو حرفي؛ المفعول به مركبا موصوليا؛ خبر الناسخ مركبا موصوليا؛ إنتاج
// نص وصفي موضوعه المكان المفتوح، قنوات الوصف وأساليبه). Remaining lessons
// fill gaps using standard progression building on confirmed col-7 arabe
// topics. Recommend teacher review before treating as final, given the
// linguistic difficulty of this grade's focus on نائب الفاعل and المركبات
// الموصولية.
const LESSONS = [
  { title: "نائب الفاعل: تعريفه وشروط بنائه", trimestre: 1 },
  { title: "نائب الفاعل مركبا اسميا", trimestre: 1 },
  { title: "نائب الفاعل مركبا موصوليا اسميا", trimestre: 1 },
  { title: "نائب الفاعل مركبا موصوليا حرفيا", trimestre: 1 },
  { title: "صيغ الفعل المبني للمجهول", trimestre: 1 },
  { title: "الأفعال التي لا تُبنى للمجهول", trimestre: 1 },
  { title: "مراجعة: الجملة الفعلية وتحويلها للمبني للمجهول", trimestre: 1 },
  { title: "الإملاء: مراجعة شاملة لرسم الهمزة", trimestre: 1 },

  { title: "المركب الموصولي الاسمي: صلة الموصول جملة اسمية", trimestre: 2 },
  { title: "المركب الموصولي الفعلي: صلة الموصول جملة فعلية", trimestre: 2 },
  { title: "المفعول به مركبا موصوليا", trimestre: 2 },
  { title: "الخبر مركبا إسناديا", trimestre: 2 },
  { title: "خبر الناسخ مركبا موصوليا", trimestre: 2 },
  { title: "تمييز نوع المركب الموصولي (اسمي أو حرفي)", trimestre: 2 },
  { title: "المرادف والضد في السياق الأدبي", trimestre: 2 },
  { title: "إنتاج نص وصفي: المكان المغلق", trimestre: 2 },

  { title: "إنتاج نص وصفي: المكان المفتوح", trimestre: 3 },
  { title: "قنوات الوصف وأساليبه", trimestre: 3 },
  { title: "الصفات الحسية والمعنوية في الوصف", trimestre: 3 },
  { title: "التشبيه والاستعارة في النص الوصفي", trimestre: 3 },
  { title: "تحليل نص وصفي نموذجي", trimestre: 3 },
  { title: "مراجعة شاملة: التراكيب الموصولية ونائب الفاعل", trimestre: 3 },
  { title: "مراجعة شاملة: الإنتاج الكتابي", trimestre: 3 },
  { title: "تحضير للامتحان النهائي", trimestre: 3 },
];

async function seedCol8Arabe() {
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
  console.log(`✔ seedCol8Arabe: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol8Arabe();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});