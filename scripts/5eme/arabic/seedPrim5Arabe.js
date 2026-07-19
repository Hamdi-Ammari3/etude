// scripts/seedPrim5Arabe.js
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
const SUBJECT_ID = "arabe";

// Sourced directly from a real Tunisian teacher's curriculum planning document
// (شكيب بن مسعود) organized by "فترة" (period). Mapped 2 فترات per trimestre
// (standard structure: فترة 1+2 → T1, فترة 3+4 → T2, فترة 5+6 → T3).
// NOTE: item #7 was missing from the source list itself (numbering jumps 6→8);
// this is preserved as-is rather than inventing a replacement lesson — 18 real
// lessons total, not 19.
const LESSONS = [
  { title: "الاسم النكرة والاسم المعرف بـ«الـ» والاسم العلم", trimestre: 1 },
  { title: "أصنف الفعل الثلاثي إلى مجرد ومزيد", trimestre: 1 },
  { title: "أميز بين الفعل الثلاثي الصحيح والمعتل", trimestre: 1 },
  { title: "المركب بالإضافة والمركب بالجر", trimestre: 1 },
  { title: "المركب النعتي والمركب العطفي", trimestre: 1 },
  { title: "الفعل المهموز في الماضي والمضارع والأمر", trimestre: 1 },

  { title: "المفعول فيه (للزمان / للمكان)", trimestre: 2 },
  { title: "الفعل المثال في الماضي والمضارع والأمر", trimestre: 2 },
  { title: "متممات الجملة الفعلية: الحال والمفعول لأجله", trimestre: 2 },
  { title: "اسم الفاعل واسم المفعول من الفعل الصحيح السالم والمهموز والمثال", trimestre: 2 },
  { title: "اسم المفعول من الفعل الصحيح السالم والمهموز والمثال", trimestre: 2 },
  { title: "رسم الهمزة في وسط الكلمة", trimestre: 2 },

  { title: "الجملة الاسمية (المبتدأ والخبر)", trimestre: 3 },
  { title: "الفعل الأجوف في الماضي والمضارع", trimestre: 3 },
  { title: "النواسخ الفعلية والحرفية", trimestre: 3 },
  { title: "النواسخ الحرفية", trimestre: 3 },
  { title: "الفعل الأجوف في المضارع المجزوم والأمر", trimestre: 3 },
  { title: "رسم الهمزة في آخر الكلمة", trimestre: 3 },
];

async function seedPrim5Arabe() {
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
  console.log(`✔ seedPrim5Arabe: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim5Arabe();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});