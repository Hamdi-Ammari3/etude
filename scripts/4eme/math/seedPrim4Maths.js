// scripts/seedPrim4Maths.js
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
const SUBJECT_ID = "maths";

// Real Tunisian 4ème année primaire math curriculum, sourced from a teacher-shared
// class platform (classi.tn) — cross-check against the official CNP manuel before
// treating this as final; trimestre grouping (1–10 / 11–20 / 21–30) is inferred
// from lesson order, not an explicit label in the source.
const LESSONS = [
  { title: "أتصرف في القطع النقدية و الأوراق المالية ذات 5 دنانير و 10 دنانير", trimestre: 1 },
  { title: "أقارن الأعداد ذات 5 أرقام و أرتبها", trimestre: 1 },
  { title: "أتصرف في الأعداد ذات 5 أرقام: بعض أرقامها صفر", trimestre: 1 },
  { title: "أتصرف في القطع النقدية و الأوراق المالية 10-20-30", trimestre: 1 },
  { title: "أعرف المستقيم و نصف المستقيم و قطعة المستقيم", trimestre: 1 },
  { title: "أوظف الجمع و الطرح و الضرب على الأعداد ذات 5 أرقام", trimestre: 1 },
  { title: "أتصرف في وحدات قيس الأطوال: المتر و أجزاؤه", trimestre: 1 },
  { title: "أنجز عملية الضرب في عقد أو مائة كاملة", trimestre: 1 },
  { title: "أوظف التعامد و التوازي في تصنيف المضلعات و رسمها", trimestre: 1 },
  { title: "أتعرف المسالك المختصرة و موقع العقدة على الشبكة", trimestre: 1 },

  { title: "أتصرف في وحدات قيس الأطوال: المتر و مضاعفاته", trimestre: 2 },
  { title: "أنجز عملية الضرب في عدد ذي رقمين", trimestre: 2 },
  { title: "أرسم المستطيل و المربع باعتماد خاصيات الأضلاع و الزوايا", trimestre: 2 },
  { title: "أتصرف في وحدات قيس السعة: اللتر و أجزاؤه", trimestre: 2 },
  { title: "أكوّن الأعداد ذات 6 أرقام و أفككها و أركبها", trimestre: 2 },
  { title: "أتصرف في وحدات قيس الكتل: الكيلوغرام و الغرام", trimestre: 2 },
  { title: "أقارن الأعداد ذات 6 أرقام و أرتبها", trimestre: 2 },
  { title: "أحسب قيس محيط شكل مكوّن من مستطيلات و مربعات", trimestre: 2 },
  { title: "أوظف الجمع و الطرح و الضرب على الأعداد ذات 6 أرقام", trimestre: 2 },
  { title: "أنجز عملية الضرب في عدد ذي 3 أرقام", trimestre: 2 },

  { title: "أتعرف مساحة شكل مستو", trimestre: 3 },
  { title: "أتصرف في الأعداد ذات 6 أرقام: بعض أرقامها صفر", trimestre: 3 },
  { title: "مضاعفات عدد صحيح طبيعي", trimestre: 3 },
  { title: "القسمة الإقليدية", trimestre: 3 },
  { title: "أنجز عملية قسمة قاسمها عدد ذو رقم واحد", trimestre: 3 },
  { title: "مساحة كل من المستطيل و المربع", trimestre: 3 },
  { title: "أحدد الزمن بالساعة و الدقيقة", trimestre: 3 },
  { title: "درس الزوايا", trimestre: 3 },
  { title: "حساب ذهني", trimestre: 3 },
  { title: "الكسور", trimestre: 3 },
];

async function seedPrim4Maths() {
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
  console.log(`✔ seedPrim4Maths: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedPrim4Maths();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});