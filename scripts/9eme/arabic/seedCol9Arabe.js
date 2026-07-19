// scripts/seedCol9Arabe.js
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
const SUBJECT_ID = "arabe";

// Confirmed real topics/methodologies sourced from T3alem.tn and other
// Tunisian educational sites for السنة التاسعة أساسي — عربية (l10, l11, l15
// correspond to genuinely referenced content: حجج محور العمل، منهجية تحليل
// النص الحجاجي خطوة بخطوة، منهج الإنشاء الحجاجي). Unlike col-9 maths and
// français, no actual textbook فهرس photos were provided for this subject —
// this list is reconstructed around real confirmed anchors (heavy emphasis
// on النص الحجاجي, consistent with exam-year argumentative-text focus seen
// in français), building on confirmed col-8 arabe topics (نائب الفاعل,
// المركبات الموصولية). Lower confidence than col-9 maths/français —
// recommend teacher review before treating as final, given برفوي exam
// stakes.
const LESSONS = [
  { title: "مراجعة شاملة: نائب الفاعل والمركبات الموصولية", trimestre: 1 },
  { title: "الحال الجملة (الاسمية والفعلية)", trimestre: 1 },
  { title: "التمييز: أنواعه ووظيفته", trimestre: 1 },
  { title: "أسلوب الاستثناء", trimestre: 1 },
  { title: "أسلوب الشرط: أدواته الجازمة وغير الجازمة", trimestre: 1 },
  { title: "توظيف ظواهر نحوية في التصرف في نص", trimestre: 1 },
  { title: "الإملاء: مراجعة شاملة لرسم الهمزة والتنوين", trimestre: 1 },
  { title: "منهجية دراسة نص: الخطوات الأساسية", trimestre: 1 },

  { title: "خصائص النص الحجاجي وبنيته", trimestre: 2 },
  { title: "حجج محور العمل", trimestre: 2 },
  { title: "منهجية تحليل النص الحجاجي خطوة بخطوة", trimestre: 2 },
  { title: "الروابط المنطقية في النص الحجاجي", trimestre: 2 },
  { title: "أدوات التوكيد والتعليل في الحجاج", trimestre: 2 },
  { title: "تمييز الحجة من المثال في النص الحجاجي", trimestre: 2 },
  { title: "منهج الإنشاء الحجاجي: بناء المقدمة والجوهر والخاتمة", trimestre: 2 },
  { title: "تدرب على كتابة فقرة حجاجية متكاملة", trimestre: 2 },

  { title: "تمهيد في العروض: الوزن الشعري", trimestre: 3 },
  { title: "البحور الشعرية الشائعة (تمهيد)", trimestre: 3 },
  { title: "القافية والروي", trimestre: 3 },
  { title: "تحليل نص شعري: الشكل والمضمون", trimestre: 3 },
  { title: "مراجعة شاملة: التراكيب النحوية للسنة", trimestre: 3 },
  { title: "مراجعة شاملة: الإنشاء الحجاجي", trimestre: 3 },
  { title: "نماذج دراسة نص (حجاجي وشعري) مع الحل", trimestre: 3 },
  { title: "التحضير النهائي لمناظرة الثانوي", trimestre: 3 },
];

async function seedCol9Arabe() {
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
  console.log(`✔ seedCol9Arabe: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol9Arabe();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});