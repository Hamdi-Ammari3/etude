// scripts/seedCol9Physique.js
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

const GRADE_ID = "col-9";
const SUBJECT_ID = "physique";

// Sourced directly from the official 9ème année علوم فيزيائية textbook's
// table of contents, provided by the user as photographs of the actual
// book, complete with page numbers and stated pedagogical objectives
// (الأهداف) for each lesson. Same highest-confidence tier as col-9 maths/
// français/anglais — the real published textbook, not a reconstruction.
// 30 real lessons across 8 thematic units: التيار الكهربائي المتغير،
// الكهرباء المنزلية، الكهرباء الساكنة، المحروقات والاحتراق، الذرة والرموز
// الكيميائية، المحاليل الشاردية (acidity/pH), الضوء، الطاقة الضوئية. This
// replaces the earlier reconstructed 20-lesson version entirely.
const LESSONS = [
  { title: "مفهوم التيار الكهربائي المتغير", trimestre: 1 },
  { title: "التيار المتناوب", trimestre: 1 },
  { title: "خصائص التيار المتناوب الجيبي", trimestre: 1 },
  { title: "الكهرباء المنزلية", trimestre: 1 },
  { title: "التكهرب بالاحتكاك", trimestre: 1 },
  { title: "التكهرب بالتماس", trimestre: 1 },
  { title: "الشحنة الكهربائية الساكنة", trimestre: 1 },
  { title: "المحروقات: أنواعها، مصادرها واستعمالاتها", trimestre: 1 },
  { title: "نقل المحروقات وتخزينها والحماية من مخاطرها", trimestre: 1 },
  { title: "التفاعل الكيميائي", trimestre: 1 },

  { title: "الذرّة", trimestre: 2 },
  { title: "بنية الذرّة", trimestre: 2 },
  { title: "رمز الذرة والصيغ الكيميائية", trimestre: 2 },
  { title: "معادلات التفاعلات الكيميائية", trimestre: 2 },
  { title: "ناقلية المحاليل المائية للكهرباء", trimestre: 2 },
  { title: "تأثير التركيز على ناقلية المحلول الشاردي للكهرباء", trimestre: 2 },
  { title: "الأنيونات والكتيونات", trimestre: 2 },
  { title: "المحلول المائي الحامضي والمحلول المائي القلوي", trimestre: 2 },
  { title: "قيس pH", trimestre: 2 },
  { title: "درجة حموضة محلول مائي حامضي", trimestre: 2 },

  { title: "درجة قلوية محلول مائي قلوي", trimestre: 3 },
  { title: "المحلول المتعادل", trimestre: 3 },
  { title: "انعكاس الضوء", trimestre: 3 },
  { title: "المرآة المسطحة", trimestre: 3 },
  { title: "انكسار الضوء", trimestre: 3 },
  { title: "الانكسار الحدي والانعكاس الكلي", trimestre: 3 },
  { title: "تطبيقات لتغير مسار الضوء", trimestre: 3 },
  { title: "الأضواء المرئية والضوء الأبيض", trimestre: 3 },
  { title: "مفهوم الطاقة الضوئية", trimestre: 3 },
  { title: "الطاقة الشمسية", trimestre: 3 },
];

async function seedCol9Physique() {
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
  console.log(`✔ seedCol9Physique: wrote ${LESSONS.length} lesson docs for ${GRADE_ID}_${SUBJECT_ID}`);
}

async function main() {
  await seedCol9Physique();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});