// scripts/seedCol8Maths.js
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
const SUBJECT_ID = "maths";

// Confirmed real topics sourced from tunisiecollege.net and Tadris.TN for
// السنة الثامنة أساسي — رياضيات (l1, l3, l4, l9, l17 correspond to genuinely
// listed topics: مقارنة الأعداد الصحيحة النسبية، الضرب والقسمة في الأعداد
// الكسرية النسبية، مقارنة عددين كسريين بجذاء الطرفين والوسطين، الزوايا
// الحاصلة عن تقاطع مستقيم مع مستقيمين متوازيين، معادلات الدرجة الأولى ذات
// مجهول واحد). Remaining lessons fill gaps using standard progression,
// taught in Arabic per user confirmation. Recommend teacher review before
// treating as final.
const LESSONS = [
  { title: "مقارنة الأعداد الصحيحة النسبية", trimestre: 1 },
  { title: "الجمع والطرح في مجموعة الأعداد الصحيحة النسبية", trimestre: 1 },
  { title: "الضرب والقسمة في مجموعة الأعداد الكسرية النسبية", trimestre: 1 },
  { title: "مقارنة عددين كسريين من خلال جذاء الطرفين وجذاء الوسطين", trimestre: 1 },
  { title: "الجمع والطرح في مجموعة الأعداد الكسرية النسبية", trimestre: 1 },
  { title: "حساب حرفي: المقادير الجبرية البسيطة", trimestre: 1 },
  { title: "تبسيط العبارات الجبرية", trimestre: 1 },
  { title: "حل مسائل: توظيف الأعداد النسبية", trimestre: 1 },

  { title: "الزوايا الحاصلة عن تقاطع مستقيم مع مستقيمين متوازيين", trimestre: 2 },
  { title: "الزوايا المتبادلة والمتناظرة", trimestre: 2 },
  { title: "مجموع زوايا المثلث", trimestre: 2 },
  { title: "المثلثات الخاصة: متساوي الساقين ومتساوي الأضلاع", trimestre: 2 },
  { title: "المستقيمات المتوازية والمتعامدة: تعميق", trimestre: 2 },
  { title: "تناظر الأشكال الهندسية (محوري ومركزي)", trimestre: 2 },
  { title: "حساب المساحات والمحيطات: تطبيقات", trimestre: 2 },
  { title: "القرص الدائري ومساحته", trimestre: 2 },

  { title: "معادلات يؤول حلها إلى معادلة من الدرجة الأولى ذات مجهول واحد", trimestre: 3 },
  { title: "حل معادلات بسيطة وتطبيقاتها", trimestre: 3 },
  { title: "التناسب والدالة الخطية (تمهيد)", trimestre: 3 },
  { title: "الإحصاء: المعدل الحسابي", trimestre: 3 },
  { title: "حجم المنشور القائم والأسطوانة", trimestre: 3 },
  { title: "حل مسائل مركبة: الجبر والهندسة معا", trimestre: 3 },
  { title: "مراجعة شاملة لآخر السنة", trimestre: 3 },
  { title: "تحضير للامتحان النهائي", trimestre: 3 },
];

async function seedCol8Maths() {
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
  console.log(`✔ seedCol8Maths: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol8Maths();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});