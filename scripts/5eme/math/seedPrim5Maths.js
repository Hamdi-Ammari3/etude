// scripts/seedPrim5Maths.js
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

// Sourced directly from i-learning.tn's official annual program (البرنامج السنوي)
// for السنة الخامسة ابتدائي — الرياضيات: 24 lessons (المحور 1-24), explicitly
// grouped by trimestre with real school-year dates. Higher confidence than
// reconstructed lists — this is an actual stated curriculum structure.
const LESSONS = [
  { title: "الأعداد ذات 7 أرقام فأكثر", trimestre: 1 },
  { title: "تحديد الإحداثيات ورسم الأشكال على الشبكة", trimestre: 1 },
  { title: "الجمع والطرح والضرب في مجموعة الأعداد الصحيحة الطبيعية", trimestre: 1 },
  { title: "القسمة في مجموعة الأعداد الصحيحة الطبيعية", trimestre: 1 },
  { title: "التصرف في وحدات قيس الكتل (الطن والقنطار)", trimestre: 1 },
  { title: "أتعرف الدائرة والقرص الدائري", trimestre: 1 },
  { title: "أرسم الموسط العمودي لقطعة مستقيم", trimestre: 1 },
  { title: "أوظف الدائرة في البناءات الهندسية", trimestre: 1 },
  { title: "أرسم المستقيمات المتعامدة والمتوازية", trimestre: 1 },

  { title: "أتعرف التناسب الطردي وخاصياته", trimestre: 2 },
  { title: "التصرف في الأعداد الكسرية تكوينا وكتابة وقراءة", trimestre: 2 },
  { title: "التصرف في وحدات قيس المساحة", trimestre: 2 },
  { title: "أرسم الزوايا وأقيسها وأرسم منصفها", trimestre: 2 },
  { title: "التصرف في وحدات القيس الفلاحية", trimestre: 2 },
  { title: "أكون الأعداد العشرية وأكتبها وأقرؤها", trimestre: 2 },
  { title: "أفكك الأعداد العشرية وأركبها وأقارنها وأرتبها", trimestre: 2 },
  { title: "الجمع والطرح في مجموعة الأعداد العشرية", trimestre: 2 },
  { title: "الجمع والطرح في نطاق الأعداد التي تقيس الزمن", trimestre: 2 },

  { title: "الجمع والضرب والطرح في مجموعة الأعداد العشرية", trimestre: 3 },
  { title: "القسمة في مجموعة الأعداد العشرية", trimestre: 3 },
  { title: "أرسم المستطيل والمربع", trimestre: 3 },
  { title: "أنجز عملية قسمة قاسمها عدد عشري", trimestre: 3 },
  { title: "المثلثات", trimestre: 3 },
  { title: "أضرب الأعداد التي تقيس الزمن", trimestre: 3 },
];

async function seedPrim5Maths() {
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
  console.log(`✔ seedPrim5Maths: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim5Maths();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});