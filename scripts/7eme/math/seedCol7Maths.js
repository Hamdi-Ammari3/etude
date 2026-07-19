// scripts/seedCol7Maths.js
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

const GRADE_ID = "col-7";
const SUBJECT_ID = "maths";

// Could not verify an official 7ème année (collège) maths curriculum list —
// i-learning.tn's platform covers primaire (ابتدائي) only. This list is
// reconstructed from standard Tunisian collège math progression, building on
// confirmed prim-6 maths topics. Corrected to Arabic per user confirmation
// that 7ème année maths is still taught in Arabic (not yet switched to
// French). Lower confidence than sourced lists — recommend teacher review
// before treating as final, and worth separately confirming at which grade
// the French switch actually happens (8ème? 9ème?) before assuming for later
// collège grades.
const LESSONS = [
  { title: "الأعداد الصحيحة الطبيعية: أولوية العمليات", trimestre: 1 },
  { title: "مضاعفات وقواسم عدد صحيح طبيعي", trimestre: 1 },
  { title: "الأعداد الأولية", trimestre: 1 },
  { title: "الأعداد الكسرية: التبسيط والمقارنة", trimestre: 1 },
  { title: "العمليات على الكسور: الجمع والطرح", trimestre: 1 },
  { title: "العمليات على الكسور: الضرب والقسمة", trimestre: 1 },
  { title: "التناظر المحوري: الإنشاءات الهندسية", trimestre: 1 },
  { title: "المستقيمات والزوايا: التعامد والتوازي", trimestre: 1 },

  { title: "التعرف على الأعداد الصحيحة النسبية", trimestre: 2 },
  { title: "الجمع والطرح في مجموعة الأعداد النسبية", trimestre: 2 },
  { title: "التناسب: الجداول ومعامل التناسب", trimestre: 2 },
  { title: "النسبة المئوية والسلم", trimestre: 2 },
  { title: "الدائرة: نصف القطر والقطر والمحيط", trimestre: 2 },
  { title: "المثلثات: الإنشاء والخاصيات", trimestre: 2 },
  { title: "الأشكال الرباعية الخاصة", trimestre: 2 },
  { title: "مساحات الأشكال الاعتيادية", trimestre: 2 },

  { title: "قوى عدد", trimestre: 3 },
  { title: "الإحصاء: الجداول والتمثيلات البيانية", trimestre: 3 },
  { title: "متوازي المستطيلات والمكعب: الفرش", trimestre: 3 },
  { title: "حجم متوازي المستطيلات والمكعب", trimestre: 3 },
  { title: "مبادئ في المعادلات البسيطة", trimestre: 3 },
  { title: "التناظر المركزي (تمهيد)", trimestre: 3 },
  { title: "حل مسائل: تركيب هندسي شامل", trimestre: 3 },
  { title: "المراجعة الشاملة لآخر السنة", trimestre: 3 },
];

async function seedCol7Maths() {
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
  console.log(`✔ seedCol7Maths: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol7Maths();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});