// scripts/seedCol7Arabe.js
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
const SUBJECT_ID = "arabe";

// Confirmed real topics sourced from Tadris.TN's program listing for
// السنة السابعة أساسي — عربية (l1, l2, l3, l4, l5, l7, l9, l10, l11, l12,
// l13, l14, l17, l18, l19, l20, l21 correspond to genuinely listed topics:
// أشكال الجملة الفعلية، إنتاج نص سردي، أنواع الشخصيات، النواسخ الحرفية،
// وتصريف الفعل المجرد من مختلف الجذور). Remaining lessons (vocabulary review,
// dictée, production écrite practice, final review) fill gaps using standard
// progression. Not a complete verified ordered program — recommend teacher
// review before treating as final.
const LESSONS = [
  { title: "الأشكال الأساسية للجملة الفعلية: فعل لازم + فاعل", trimestre: 1 },
  { title: "الأشكال الأساسية للجملة الفعلية: فعل متعدٍّ + فاعل + مفعول به", trimestre: 1 },
  { title: "إنتاج نص سردي ذي بناء ثلاثي", trimestre: 1 },
  { title: "علاقة الإطارين المكاني والزماني بالأحداث والشخصيات", trimestre: 1 },
  { title: "أنواع الشخصيات: شخصية البطل (مواصفاتها)", trimestre: 1 },
  { title: "الشخصيات الثانوية: شخصيات مساعدة", trimestre: 1 },
  { title: "العلاقات بين الشخصيات (الاتصال والانفصال، الحب والكراهية)", trimestre: 1 },
  { title: "مراجعة: المرادف والضد وإثراء الرصيد اللغوي", trimestre: 1 },

  { title: "الجملة الاسمية المسبوقة بناسخ حرفي: تمهيد", trimestre: 2 },
  { title: "استكشاف النواسخ الحرفية", trimestre: 2 },
  { title: "معاني النواسخ الحرفية", trimestre: 2 },
  { title: "تصريف الفعل المجرد المشتق من الجذر السالم", trimestre: 2 },
  { title: "تصريف الفعل المجرد من الجذر المهموز", trimestre: 2 },
  { title: "تصريف الفعل المجرد المشتق من الجذر المضاعف", trimestre: 2 },
  { title: "الإملاء: مراجعة قواعد الهمزة", trimestre: 2 },
  { title: "إنتاج كتابي: وصف شخصية", trimestre: 2 },

  { title: "جذور غير سالمة: الجذر المعتل — الجذر المثال", trimestre: 3 },
  { title: "تصريف الفعل المجرد المشتق من الجذر المثال", trimestre: 3 },
  { title: "جذور غير سالمة: الجذر المعتل — الجذر الأجوف", trimestre: 3 },
  { title: "تصريف الفعل المجرد المشتق من جذر أجوف", trimestre: 3 },
  { title: "جذور غير سالمة: اللفيف المفروق والمقرون", trimestre: 3 },
  { title: "مراجعة شاملة: النواسخ الحرفية وتصريف الأفعال", trimestre: 3 },
  { title: "إنتاج كتابي: نص سردي متكامل", trimestre: 3 },
  { title: "المراجعة النهائية لآخر السنة", trimestre: 3 },
];

async function seedCol7Arabe() {
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
  console.log(`✔ seedCol7Arabe: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol7Arabe();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});