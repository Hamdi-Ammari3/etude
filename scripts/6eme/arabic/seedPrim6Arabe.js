// scripts/seedPrim6Arabe.js
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
const SUBJECT_ID = "arabe";

// Sourced from a real Tunisian teacher's curriculum planning document (شكيب
// بن مسعود), same source family as prim-5 arabe, prim-6 maths, and prim-6
// français. This list is complete (items 1-15, no gaps). Mapped 2 فترات per
// trimestre: فترة1+2 → T1 (6 lessons), فترة3+4 → T2 (5 lessons),
// فترة5+6 → T3 (4 lessons).
const LESSONS = [
  // الفترة 1
  { title: "تمييز الأسماء النكرة من الأسماء المعارف", trimestre: 1 },
  { title: "أصرف الفعل المضاعف في الماضي والمضارع والأمر", trimestre: 1 },
  { title: "أصرف الفعل الناقص في الماضي والمضارع المرفوع والمنصوب", trimestre: 1 },
  { title: "أصرف الفعل الناقص في المضارع المجزوم والأمر", trimestre: 1 },
  { title: "رسم التنوين: الأسماء المقصورة النكرة", trimestre: 1 },
  { title: "تغيير ترتيب عناصر الجملة الاسمية", trimestre: 1 },

  { title: "المصدر من الفعل الثلاثي المزيد", trimestre: 2 },
  { title: "المفعول المطلق", trimestre: 2 },
  { title: "أرسم الهمزة المتطرفة (في آخر الكلمة)", trimestre: 2 },
  { title: "أشتق من الفعل الثلاثي بعض الأسماء (اسم الفاعل واسم المفعول)", trimestre: 2 },
  { title: "أرسم الهمزة المتوسطة (في وسط الكلمة)", trimestre: 2 },

  { title: "الإعراب", trimestre: 3 },
  { title: "الرسم (الواو والياء والتاء)", trimestre: 3 },
  { title: "التراكيب الجزئية (المركب التمييزي - المركب الموصولي)", trimestre: 3 },
  { title: "اسم الفاعل واسم المفعول من الثلاثي المزيد", trimestre: 3 },
];

async function seedPrim6Arabe() {
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
  console.log(`✔ seedPrim6Arabe: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim6Arabe();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});