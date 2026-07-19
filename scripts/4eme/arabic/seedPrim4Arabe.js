// scripts/seedPrim4Arabe.js
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

const GRADE_ID = "prim-4";
const SUBJECT_ID = "arabe";

// Built from confirmed real Tunisian 4ème année primaire Arabic grammar topics
// (المبتدأ والخبر، النواسخ الفعلية: كان وأخواتها، الفعل المجرد والمزيد، التمييز,
// sourced from medrassatouna.com), combined with standard grammar progression to
// fill out a complete 3-trimestre sequence. Exact module-by-module ordering is
// reconstructed, not verified against the official textbook table of contents —
// recommend teacher review before treating as final.
const LESSONS = [
  { title: "الجملة الاسمية (المبتدأ والخبر)", trimestre: 1 },
  { title: "الجملة الفعلية (الفعل والفاعل)", trimestre: 1 },
  { title: "علامات الترقيم", trimestre: 1 },
  { title: "الاسم المفرد والمثنى والجمع", trimestre: 1 },
  { title: "المذكر والمؤنث", trimestre: 1 },
  { title: "الفعل الماضي وتصريفه", trimestre: 1 },
  { title: "القراءة وفهم المنطوق: الحوار", trimestre: 1 },
  { title: "المفعول به", trimestre: 1 },

  { title: "الفعل المضارع وتصريفه", trimestre: 2 },
  { title: "الفعل المجرد والفعل المزيد", trimestre: 2 },
  { title: "النواسخ الفعلية: كان وأخواتها", trimestre: 2 },
  { title: "الصفة (النعت) وموصوفها", trimestre: 2 },
  { title: "حروف الجر", trimestre: 2 },
  { title: "الضمائر المنفصلة والمتصلة", trimestre: 2 },
  { title: "الاستفهام: أدوات الاستفهام", trimestre: 2 },
  { title: "المرادف والضد", trimestre: 2 },

  { title: "الفعل الأمر", trimestre: 3 },
  { title: "التمييز", trimestre: 3 },
  { title: "الأسماء الموصولة", trimestre: 3 },
  { title: "النفي (لا، لم، لن، ما)", trimestre: 3 },
  { title: "المثنى وإعرابه المبسط", trimestre: 3 },
  { title: "جمع المذكر السالم وجمع المؤنث السالم", trimestre: 3 },
  { title: "أسلوب التعجب", trimestre: 3 },
  { title: "المراجعة الشاملة: أنواع الجمل والأفعال", trimestre: 3 },
];

async function seedPrim4Arabe() {
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
  console.log(`✔ seedPrim4Arabe: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim4Arabe();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});