// scripts/seedPrim6Ikadh.js
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
const SUBJECT_ID = "physique"; // display name at this grade is "إيقاظ علمي"

// Sourced directly from i-learning.tn's official annual program (البرنامج
// السنوي) for السنة السادسة ابتدائي — الإيقاظ العلمي: 13 lessons (المحور
// 1-13), explicitly grouped by trimestre/فترة with real school-year dates.
// Highest-confidence source used for this subject across all grades —
// complete, no gaps, real dates given.
const LESSONS = [
  { title: "فيزياء: خصائص الهواء", trimestre: 1 },
  { title: "فيزياء: مكونات الهواء", trimestre: 1 },
  { title: "فيزياء: الهواء ضروري لحياة الإنسان والحيوان والنبات", trimestre: 1 },
  { title: "الفيزياء: الاحتراق في الهواء", trimestre: 1 },
  { title: "علم أحياء: التنفس", trimestre: 1 },

  { title: "علم أحياء: جهاز دوران الدم", trimestre: 2 },
  { title: "علم أحياء: الأمراض الجرثومية والوقاية منها", trimestre: 2 },
  { title: "علم أحياء: التغذية عند الإنسان", trimestre: 2 },

  { title: "علم أحياء: الوسط البيئي", trimestre: 3 },
  { title: "تلوث الأوساط المائية وطرق المحافظة عليها", trimestre: 3 },
  { title: "الأمراض الناتجة عن تلوث المياه والوقاية منها", trimestre: 3 },
  { title: "فيزياء: الطاقة — التيار الكهربائي", trimestre: 3 },
  { title: "المغنط (البوصلة والتأثير المغناطيسي للتيار الكهربائي)", trimestre: 3 },
];

async function seedPrim6Ikadh() {
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
  console.log(`✔ seedPrim6Ikadh: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim6Ikadh();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});