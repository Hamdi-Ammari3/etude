// scripts/seedPrim5Ikadh.js
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
const SUBJECT_ID = "physique"; // display name at this grade is "إيقاظ علمي"

// l1 and l2 are confirmed real Trimestre-1 topics sourced from i-learning.tn's
// annual program sidebar for السنة الخامسة ابتدائي — الإيقاظ العلمي (فيزياء:
// الضوء; فيزياء: انتشار الضوء). The remaining lessons are built from standard
// éveil scientifique / physique progression for this level — not individually
// verified. Recommend teacher review before treating as final.
const LESSONS = [
  { title: "الضوء (مصادره وخصائصه)", trimestre: 1 },
  { title: "انتشار الضوء", trimestre: 1 },
  { title: "الأجسام الشفافة والمعتمة وشبه الشفافة", trimestre: 1 },
  { title: "تكون الظل", trimestre: 1 },
  { title: "انعكاس الضوء", trimestre: 1 },
  { title: "حماية العين من الضوء القوي", trimestre: 1 },
  { title: "جسم الإنسان: الجهاز الهضمي", trimestre: 1 },
  { title: "التغذية والصحة", trimestre: 1 },

  { title: "حالات المادة وتغيراتها", trimestre: 2 },
  { title: "دورة الماء في الطبيعة", trimestre: 2 },
  { title: "تلوث الماء والهواء", trimestre: 2 },
  { title: "الكائنات الحية في وسطها البيئي", trimestre: 2 },
  { title: "التوازن البيئي والسلاسل الغذائية", trimestre: 2 },
  { title: "الحيوانات: التكيف مع البيئة", trimestre: 2 },
  { title: "النباتات: التكاثر والانتشار", trimestre: 2 },
  { title: "الطاقة: مصادرها المتجددة وغير المتجددة", trimestre: 2 },

  { title: "الدارة الكهربائية: المكونات الأساسية", trimestre: 3 },
  { title: "الموصلات والعوازل الكهربائية", trimestre: 3 },
  { title: "الدارة الكهربائية: التسلسل والتوازي", trimestre: 3 },
  { title: "المغناطيس وتطبيقاته", trimestre: 3 },
  { title: "الصوت: المصدر والانتشار", trimestre: 3 },
  { title: "الحرارة وتأثيرها على المادة", trimestre: 3 },
  { title: "الأمن والسلامة المنزلية (الكهرباء والنار)", trimestre: 3 },
  { title: "المراجعة الشاملة: الفيزياء والبيئة والكهرباء", trimestre: 3 },
];

async function seedPrim5Ikadh() {
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
  console.log(`✔ seedPrim5Ikadh: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim5Ikadh();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});