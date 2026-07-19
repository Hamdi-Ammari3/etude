// scripts/seedCol9Maths.js
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
const SUBJECT_ID = "maths";

// Sourced directly from the official 9ème année math textbook's table of
// contents (الفهرس), provided by the user as photographs of the actual book.
// This is the highest-confidence source used for any subject on this
// platform — the real published textbook itself, not a reconstruction.
// UPDATED: chapter 8 (الإحصاء والاحتمالات) was split into two lessons
// (l8: الإحصاء, l9: الاحتمالات) after reviewing textbook photos showing this
// single فهرس chapter actually covers enough distinct material (descriptive
// stats + grouped data/cumulative frequency + graphical median + real
// probability problems) to warrant separate lessons. This shifts all
// subsequent lesson IDs by one (old l9→l10, l10→l11, l11→l12, l12→l13,
// l13→l14). Total is now 14 lessons instead of 13.
const LESSONS = [
  { title: "التعداد والحساب", trimestre: 1 },
  { title: "مجموعة الأعداد الحقيقية IR", trimestre: 1 },
  { title: "العمليات في مجموعة الأعداد الحقيقية", trimestre: 1 },
  { title: "القوى في مجموعة الأعداد الحقيقية", trimestre: 1 },
  { title: "الترتيب والمقاربة", trimestre: 1 },

  { title: "الجذاءات المعتبرة والعبارات الجبرية", trimestre: 2 },
  { title: "المعادلات والمتراجحات من الدرجة الأولى", trimestre: 2 },
  { title: "الإحصاء", trimestre: 2 },
  { title: "الاحتمالات", trimestre: 2 },
  { title: "التعيين في المستوى", trimestre: 2 },

  { title: "مبرهنة طالس وتطبيقاتها", trimestre: 3 },
  { title: "العلاقات القياسية في المثلث القائم", trimestre: 3 },
  { title: "أنشطة حول الرباعيات", trimestre: 3 },
  { title: "التعامد في الفضاء", trimestre: 3 },
];

async function seedCol9Maths() {
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
  console.log(`✔ seedCol9Maths: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol9Maths();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});