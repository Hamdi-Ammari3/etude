// scripts/seedCol8Physique.js
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
const SUBJECT_ID = "physique";

// Confirmed real topics sourced from Tadris.TN for السنة الثامنة أساسي —
// علوم فيزيائية (l3, l4, l7 correspond to genuinely listed topics: التيارات
// الهوائية، التكهنات الجوية، التوتر الكهربائي). Remaining lessons fill gaps
// using standard progression, taught in Arabic (consistent with col-7
// physique). Recommend teacher review before treating as final.
const LESSONS = [
  { title: "الغلاف الجوي: التركيب والخصائص", trimestre: 1 },
  { title: "الضغط الجوي: مفهومه وقياسه", trimestre: 1 },
  { title: "التيارات الهوائية: أسبابها وأنواعها", trimestre: 1 },
  { title: "التكهنات الجوية: كيف تُعد؟", trimestre: 1 },
  { title: "الرطوبة والتساقطات", trimestre: 1 },
  { title: "حل مسائل: قراءة نشرة جوية", trimestre: 1 },

  { title: "التوتر الكهربائي: مفهومه ووحدة قياسه", trimestre: 2 },
  { title: "قياس التوتر الكهربائي بالفولط متر", trimestre: 2 },
  { title: "شدة التيار الكهربائي: مراجعة وتعميق", trimestre: 2 },
  { title: "العلاقة بين التوتر وشدة التيار", trimestre: 2 },
  { title: "الموصلات الأومية وقانون أوم (تمهيد)", trimestre: 2 },
  { title: "الدارة الكهربائية على التوالي والتوازي: تعميق", trimestre: 2 },
  { title: "المقاومة الكهربائية: مفهومها", trimestre: 2 },
  { title: "حل مسائل: حساب التوتر والشدة", trimestre: 2 },

  { title: "انكسار الضوء", trimestre: 3 },
  { title: "العدسات والمرايا: تمهيد", trimestre: 3 },
  { title: "القوة والحركة: مفاهيم أساسية", trimestre: 3 },
  { title: "الوزن والكتلة: الفرق بينهما", trimestre: 3 },
  { title: "حل مسائل مركبة: الكهرباء والضوء", trimestre: 3 },
  { title: "المراجعة النهائية لآخر السنة", trimestre: 3 },
];

async function seedCol8Physique() {
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
  console.log(`✔ seedCol8Physique: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol8Physique();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});