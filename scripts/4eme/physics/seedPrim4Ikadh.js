// scripts/seedPrim4Ikadh.js
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
const SUBJECT_ID = "physique"; // kept as "physique" for cross-grade consistency;
// the subject's DISPLAY NAME is "إيقاظ علمي" at this grade level (set via the
// subjects doc), while the subjectId itself stays stable across all grades.

// "الحواس الخمس" (l1) is a confirmed real Tunisian 4ème année topic, sourced in
// detail from a Tunisian teaching resource (medrassatouna.com). The remaining
// lessons are built from standard éveil scientifique topics for this level
// (human body, living things, matter, simple physical phenomena) — not
// individually verified against the official textbook. Recommend teacher review
// before treating as final, especially for lesson ordering across trimestres.
const LESSONS = [
  { title: "الحواس الخمس", trimestre: 1 },
  { title: "أعضاء جسم الإنسان", trimestre: 1 },
  { title: "الأسنان وأنواعها والعناية بها", trimestre: 1 },
  { title: "الهيكل العظمي", trimestre: 1 },
  { title: "التنفس عند الإنسان", trimestre: 1 },
  { title: "الغذاء المتوازن", trimestre: 1 },
  { title: "النظافة الشخصية والوقاية من الأمراض", trimestre: 1 },
  { title: "الأعضاء الحسية ووظائفها", trimestre: 1 },

  { title: "الحيوانات: التصنيف حسب الغذاء", trimestre: 2 },
  { title: "النباتات: أجزاء النبتة ووظائفها", trimestre: 2 },
  { title: "دورة حياة النبات (الإنبات)", trimestre: 2 },
  { title: "تكاثر الحيوانات: بيوضة وولودة", trimestre: 2 },
  { title: "البيئة والتلوث", trimestre: 2 },
  { title: "الماء: أهميته ومصادره", trimestre: 2 },
  { title: "حالات المادة (صلبة، سائلة، غازية)", trimestre: 2 },
  { title: "الهواء وخصائصه", trimestre: 2 },

  { title: "الضوء ومصادره", trimestre: 3 },
  { title: "الظل وتكونه", trimestre: 3 },
  { title: "الصوت وانتشاره", trimestre: 3 },
  { title: "المغناطيس وخصائصه", trimestre: 3 },
  { title: "الدارة الكهربائية البسيطة", trimestre: 3 },
  { title: "الفصول الأربعة وتعاقبها", trimestre: 3 },
  { title: "الليل والنهار", trimestre: 3 },
  { title: "المراجعة الشاملة: جسم الإنسان والبيئة والظواهر الفيزيائية", trimestre: 3 },
];

async function seedPrim4Ikadh() {
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
  console.log(`✔ seedPrim4Ikadh: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim4Ikadh();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});