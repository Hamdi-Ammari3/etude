// scripts/seedCol7Physique.js
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
const SUBJECT_ID = "physique";

// Confirmed real topics sourced from classi.tn/Tadris.TN for السنة السابعة
// أساسي — علوم فيزيائية (l1, l7, l8, l13, l14, l17 correspond to genuinely
// listed topics: المادة والتحولات الفيزيائية، أهمية الماء في الحياة، الماء
// مصادره وتحولاته الفيزيائية، التيار الكهربائي، الدارة الكهربائية، المغانط).
// Confirmed subject name: "علوم فيزيائية" (Sciences Physiques), taught in
// Arabic at this grade per user confirmation. Remaining lessons fill gaps
// using standard progression. Recommend teacher review before treating as
// final.
const LESSONS = [
  { title: "المادة والتحولات الفيزيائية", trimestre: 1 },
  { title: "حالات المادة: الصلبة والسائلة والغازية", trimestre: 1 },
  { title: "تغيرات حالة المادة (الانصهار، التبخر، التكاثف، التجمد)", trimestre: 1 },
  { title: "قياس الكتلة والحجم", trimestre: 1 },
  { title: "الكثافة: مفهومها وحسابها", trimestre: 1 },
  { title: "أدوات القياس في المخبر", trimestre: 1 },

  { title: "أهمية الماء في الحياة", trimestre: 2 },
  { title: "الماء: مصادره وتحولاته الفيزيائية", trimestre: 2 },
  { title: "دورة الماء في الطبيعة", trimestre: 2 },
  { title: "مكونات الماء ونقاوته", trimestre: 2 },
  { title: "حل مسائل: تحويلات حالة المادة", trimestre: 2 },
  { title: "المراجعة الشاملة: المادة والماء", trimestre: 2 },

  { title: "التيار الكهربائي: مفهومه ومصادره", trimestre: 3 },
  { title: "الدارة الكهربائية: المكونات الأساسية", trimestre: 3 },
  { title: "الدارة الكهربائية: مفتوحة ومغلقة", trimestre: 3 },
  { title: "الموصلات والعوازل الكهربائية", trimestre: 3 },
  { title: "المغانط: خصائصه واستعمالاته", trimestre: 3 },
  { title: "أقطاب المغناطيس والتجاذب والتنافر", trimestre: 3 },
  { title: "حل مسائل: الدارات الكهربائية البسيطة", trimestre: 3 },
  { title: "المراجعة النهائية لآخر السنة", trimestre: 3 },
];

async function seedCol7Physique() {
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
  console.log(`✔ seedCol7Physique: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol7Physique();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});