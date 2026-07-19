// scripts/seedCol9MathsContentT1.js
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
const SUBJECT_ID = "maths";

// Trimestre 1 — lessons l1 through l5
// Chapter titles are confirmed from the real textbook فهرس (user-provided
// photos). Content itself is reconstructed from standard knowledge of this
// long-established Tunisian 9ème curriculum — NOT verified against the
// actual textbook pages. Given برفوي exam stakes, this is a priority
// candidate for a full page-by-page check against the real book before
// treating as final.
const LESSON_CONTENT = {
  l1: {
    summary:
      "مراجعة وتعميق مهارات التعداد (العد، الترتيب) والحساب الأساسي (العمليات الأربع) على الأعداد الصحيحة والكسرية، مع تطبيقات في حساب النسب المئوية والتناسب، تأسيسا لبقية مفاهيم السنة.",
    keyPoints: [
      "مراجعة العمليات الأربع (جمع، طرح، ضرب، قسمة) على الأعداد الصحيحة والكسرية والعشرية",
      "أولوية العمليات: الأقواس، ثم الضرب والقسمة، ثم الجمع والطرح",
      "توظيف النسبة المئوية والتناسب في حل مسائل حسابية متنوعة",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "ما ناتج 15 - 3 × 4؟",
        options: ["3", "48", "12", "45"],
        answer: 0,
        explanation: "الضرب أولا: 3×4=12، ثم الطرح: 15-12=3.",
      },
      {
        difficulty: "moyen",
        question: "ما ناتج (2/3) + (1/4)؟",
        options: ["11/12", "3/7", "2/12", "3/12"],
        answer: 0,
        explanation: "المضاعف المشترك لـ3 و4 هو 12: 8/12+3/12=11/12.",
      },
      {
        difficulty: "difficile",
        question: "سلعة ثمنها 250 دينارا، عليها تخفيض 12%. ما ثمنها الجديد؟",
        options: ["220 دينارا", "238 دينارا", "230 دينارا", "225 دينارا"],
        answer: 0,
        explanation:"قيمة التخفيض=(12÷100)×250=30 دينارا. الثمن الجديد=250-30=220 دينارا."
      },
    ],
    quiz: [
      { question: "ما ناتج 20 ÷ 4 + 3 × 2؟", options: ["11", "16", "13", "26"], answer: 0 },
      { question: "ما ناتج (3/5) - (1/5)؟", options: ["2/5", "2/10", "4/5", "1/5"], answer: 0 },
      { question: "ما هو 25% من 400؟", options: ["100", "25", "125", "75"], answer: 0 },
      { question: "ما ناتج (1/2) × (2/3)؟", options: ["1/3", "2/6", "3/5", "2/5"], answer: 0 },
      { question: "أي عملية تُجرى أولا في غياب الأقواس؟", options: ["الضرب أو القسمة", "الجمع", "الطرح", "لا ترتيب محدد"], answer: 0 },
    ],
  },

  l2: {
    summary:
      "مجموعة الأعداد الحقيقية IR تضم كل الأعداد المعروفة سابقا (الصحيحة الطبيعية N، الصحيحة النسبية Z، الكسرية Q) بالإضافة إلى الأعداد غير الكسرية (اللانسبية) كجذر 2 والعدد π، والتي لا يمكن التعبير عنها ككسر بسط ومقام صحيحين.",
    keyPoints: [
      "التسلسل: N (طبيعية) ⊂ Z (نسبية) ⊂ Q (كسرية) ⊂ IR (حقيقية)",
      "الأعداد اللانسبية: لا يمكن كتابتها ككسر بسط ومقام صحيحين، مثل: √2، π",
      "كل عدد حقيقي يمكن تمثيله بنقطة على مستقيم الأعداد (المستقيم الحقيقي)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "أي مجموعة من هذه أكبر (تحتوي الأخرى)؟",
        options: ["IR", "Q", "Z", "N"],
        answer: 0,
        explanation: "IR (الأعداد الحقيقية) تحتوي جميع المجموعات الأخرى: N⊂Z⊂Q⊂IR.",
      },
      {
        difficulty: "moyen",
        question: "أي عدد من هذه لانسبي؟",
        options: ["3/4", "5", "√2", "0.75"],
        answer: 2,
        explanation: "√2 عدد لانسبي، لا يمكن كتابته ككسر بسط ومقام صحيحين.",
      },
      {
        difficulty: "difficile",
        question: "لماذا يعتبر العدد π لانسبيا رغم أننا نستعمل غالبا التقريب 3.14 له؟",
        options: ["لأن قيمته الحقيقية لا تنتهي ولا تتكرر بشكل دوري، فلا يمكن التعبير عنها بكسر دقيق مهما كان، و3.14 مجرد تقريب مبسط", "لأن π ليس عددا حقيقيا أصلا", "لأن 3.14 هو القيمة الدقيقة لـπ", "لا فرق بين الأعداد النسبية واللانسبية"],
        answer: 0,
        explanation: "π عدد لانسبي لأن أرقامه العشرية لا نهائية وغير دورية (لا تتكرر بنمط ثابت)، فلا يمكن كتابته ككسر دقيق، و3.14 هو مجرد تقريب عملي مستعمل في الحسابات.",
      },
    ],
    quiz: [
      { question: "أي مجموعة أصغر (محتواة في البقية)؟", options: ["N", "Z", "Q", "IR"], answer: 0 },
      { question: "أي عدد نسبي (وليس لانسبيا)؟", options: ["√2", "π", "3/7", "√3"], answer: 2 },
      { question: "الأعداد اللانسبية:", options: ["لا يمكن كتابتها ككسر بسط ومقام صحيحين", "كلها أعداد صحيحة", "لا وجود لها فعليا", "هي نفسها الأعداد الطبيعية"], answer: 0 },
      { question: "كل عدد حقيقي يمكن تمثيله بـ:", options: ["نقطة على مستقيم الأعداد", "لا يمكن تمثيله بصريا", "شكل هندسي فقط", "لا علاقة له بالهندسة"], answer: 0 },
      { question: "أي عدد من هذه لانسبي؟", options: ["√9", "√2", "4/5", "0.5"], answer: 1 },
    ],
  },

  l3: {
    summary:
      "تعميق العمليات الأربع (الجمع، الطرح، الضرب، القسمة) داخل مجموعة الأعداد الحقيقية IR، بما فيها التعامل مع الأعداد الجذرية (كجذر 2) وقواعد تبسيطها وإجراء العمليات عليها.",
    keyPoints: [
      "يمكن جمع أو طرح جذرين متشابهين (لهما نفس العدد تحت الجذر): 2√3+5√3=7√3",
      "لضرب جذرين: √أ × √ب = √(أ×ب)",
      "لتبسيط جذر: نستخرج العوامل المربعة الكاملة من تحت الجذر",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "ما ناتج 3√2 + 5√2؟",
        options: ["8√2", "8√4", "15√2", "8"],
        answer: 0,
        explanation: "جذران متشابهان: نجمع المعاملات: 3+5=8، فالناتج 8√2.",
      },
      {
        difficulty: "moyen",
        question: "ما ناتج √3 × √12؟",
        options: ["6", "√15", "√36", "15"],
        answer: 0,
        explanation: "√3×√12=√(3×12)=√36=6.",
      },
      {
        difficulty: "difficile",
        question: "بسّط العبارة: √50 - √18 + √8",
        options: ["6√2", "5√2", "4√2", "3√2"],
        answer: 2,
        explanation: "√50=5√2، √18=3√2، √8=2√2. العبارة=5√2-3√2+2√2=4√2"
      },
    ],
    quiz: [
      { question: "ما ناتج 4√5 - 2√5؟", options: ["2√5", "2√10", "2", "6√5"], answer: 0 },
      { question: "ما ناتج √2 × √8؟", options: ["4", "√10", "√16", "16"], answer: 0 },
      { question: "بسّط √20:", options: ["2√5", "4√5", "√20", "10√2"], answer: 0 },
      { question: "ما ناتج √9 + √16؟", options: ["7", "√25", "5", "25"], answer: 0 },
      { question: "ما ناتج √27 - √12؟", options: ["√5", "√15", "3√3-2√3=√3", "لا يمكن تبسيطه"], answer: 2 },
    ],
  },

  l4: {
    summary:
      "القوى في مجموعة الأعداد الحقيقية تشمل الأسس الصحيحة الموجبة والسالبة، مع قواعد الضرب والقسمة والقوة لقوة: أ^م × أ^ن = أ^(م+ن)، أ^م ÷ أ^ن = أ^(م-ن)، (أ^م)^ن = أ^(م×ن).",
    keyPoints: [
      "أ^م × أ^ن = أ^(م+ن)",
      "أ^م ÷ أ^ن = أ^(م-ن)",
      "(أ^م)^ن = أ^(م×ن)",
      "أ^(-ن) = 1/أ^ن (الأس السالب يعني القلب)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "ما ناتج 2³ × 2²؟",
        options: ["2⁵=32", "2⁶=64", "4⁵", "2¹"],
        answer: 0,
        explanation: "2³×2²=2^(3+2)=2⁵=32.",
      },
      {
        difficulty: "moyen",
        question: "ما ناتج 3⁵ ÷ 3²؟",
        options: ["3³=27", "3⁷", "1", "3²=9"],
        answer: 0,
        explanation: "3⁵÷3²=3^(5-2)=3³=27.",
      },
      {
        difficulty: "difficile",
        question: "احسب: (2³)² × 2⁻⁴",
        options: ["2²=4", "2¹⁰", "2⁻¹", "2⁰=1"],
        answer: 0,
        explanation: "(2³)²=2⁶. ثم 2⁶×2⁻⁴=2^(6-4)=2²=4.",
      },
    ],
    quiz: [
      { question: "ما ناتج 5² × 5³؟", options: ["5⁵", "5⁶", "5¹", "25⁵"], answer: 0 },
      { question: "ما ناتج 4⁴ ÷ 4²؟", options: ["4²=16", "4⁶", "4⁸", "1"], answer: 0 },
      { question: "ما ناتج (2²)³؟", options: ["2⁶=64", "2⁵", "2¹", "4³"], answer: 0 },
      { question: "ما قيمة 3⁻²؟", options: ["1/9", "-9", "-6", "9"], answer: 0 },
      { question: "ما ناتج 10³ × 10⁻¹؟", options: ["10²=100", "10⁴", "10⁻²", "10⁻⁴"], answer: 0 },
    ],
  },

  l5: {
    summary:
      "الترتيب في مجموعة الأعداد الحقيقية يشمل مقارنة الأعداد (بما فيها الجذرية)، بينما المقاربة تعني إيجاد قيمة تقريبية لعدد حقيقي (خاصة اللانسبي) بحصره بين عددين عشريين متتاليين، أو بتقريبه لأقرب منزلة عشرية.",
    keyPoints: [
      "لمقارنة عددين جذريين، يمكن مقارنة مربعيهما (إذا كانا موجبين، الأكبر مربعا هو الأكبر)",
      "المقاربة العشرية: تقريب عدد لانسبي بعدد عشري قريب منه (√2≈1.41)",
      "الحصر: إيجاد عددين عشريين متتاليين يقع العدد الحقيقي بينهما (1.41<√2<1.42)",
    ],
    exercises: [
      {
        difficulty: "facile",
        question: "أي عدد أكبر: √10 أم 3؟",
        options: ["√10", "3", "متساويان", "لا يمكن المقارنة"],
        answer: 0,
        explanation: "نقارن المربعين: (√10)²=10، و3²=9. بما أن 10>9، فإن √10>3.",
      },
      {
        difficulty: "moyen",
        question: "احصر العدد √7 بين عددين صحيحين متتاليين:",
        options: ["2<√7<3", "1<√7<2", "3<√7<4", "4<√7<5"],
        answer: 0,
        explanation: "2²=4 و3²=9، وبما أن 4<7<9، فإن 2<√7<3.",
      },
      {
        difficulty: "difficile",
        question: "قيمة تقريبية لـ√5 هي 2.236. احصر √5 بين عددين عشريين متتاليين بمنزلة عشرية واحدة:",
        options: ["2.2<√5<2.3", "2.1<√5<2.2", "2.3<√5<2.4", "2.0<√5<2.1"],
        answer: 0,
        explanation: "بما أن √5≈2.236، فهو محصور بين 2.2 و2.3 (بتقريب لمنزلة عشرية واحدة).",
      },
    ],
    quiz: [
      { question: "أي عدد أصغر: √15 أم 4؟", options: ["√15", "4", "متساويان", "غير ممكن"], answer: 0 },
      { question: "احصر √20 بين عددين صحيحين متتاليين:", options: ["4<√20<5", "3<√20<4", "5<√20<6", "2<√20<3"], answer: 0 },
      { question: "أي عدد أكبر: √50 أم 7؟", options: ["√50", "7", "متساويان", "غير ممكن"], answer: 0 },
      { question: "المقاربة تعني:", options: ["إيجاد قيمة تقريبية لعدد", "حساب دقيق تماما دائما", "لا معنى محدد لها", "استحالة تقريب أي عدد"], answer: 0 },
      { question: "احصر √30 بين عددين صحيحين متتاليين:", options: ["5<√30<6", "4<√30<5", "6<√30<7", "3<√30<4"], answer: 0 },
    ],
  },
};

async function seedContent() {
  const batch = db.batch();
  let count = 0;

  for (const [lessonId, content] of Object.entries(LESSON_CONTENT)) {
    const docId = `${GRADE_ID}_${SUBJECT_ID}_${lessonId}`;
    const ref = db.collection("lessonContent").doc(docId);
    batch.set(ref, content);
    count++;
  }

  await batch.commit();
  console.log(`✔ seedContent: wrote ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1)`);
}

async function main() {
  await seedContent();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});