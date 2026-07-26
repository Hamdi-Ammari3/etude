// scripts/patchPrim4MathsVideoLinksT1.js
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

const VIDEO_LINKS = {
  l1: [
    {
      title: "أتصرف في القطع النقدية و الأوراق النقدية ذات 5 د و10 د (السنة الرابعة ابتدائي)",
      url: "https://www.youtube.com/watch?v=zeJ6Iwbc5BY",
    },
  ],
  l2: [
    {
      title: "الدّرس: مقارنة وترتيب الأعداد ذات 5 أرقام (سنة رابعة)",
      url: "https://www.youtube.com/watch?v=H9oPcqWukbw",
    },
  ],
  l3: [
    {
      title: "الأعداد ذات 5 أرقام بعض أرقامها صفر",
      url: "https://www.youtube.com/watch?v=kHKQTg6T4kA",
    },
  ],
  l4: [
    {
      title: "التّصرّف في القطع النّقديّة 5 – 10 – 20 – 50 - 100",
      url: "https://www.youtube.com/watch?v=VquG7rd765w",
    },
  ],
  l5: [
    {
      title: "درس المستقيم، نصف المستقيم، قطعة المستقيم (سنة رابعة)",
      url: "https://www.youtube.com/watch?v=tOF70XIlhO4",
    },
  ],
  l6: [
    {
      title: "توظيف العمليات الأساسية (الجمع، الطرح، الضرب) على الأعداد ذات 5 أرقام",
      url: "https://www.youtube.com/watch?v=l2LBXCHeU9E",
    },
  ],
  l7: [
    {
      title: "أنواع وحدات قياس الطول والتحويل بينهما",
      url: "https://www.youtube.com/watch?v=UV7wHim9wvI",
    },
  ],
  l8: [
    {
      title: "ﺿﺮﺏ ﻋﺪﺩ ﻓﻲ ﻋﻘﺪ ﺃﻭ ﻣﺎﺋﺔ ﻛﺎﻣﻠﺔ",
      url: "https://www.youtube.com/watch?v=LIfkN40qBVQ",
    },
  ],
    l9: [
    {
      title: "التعرف على مفهومي التعامد والتوازي وتوظيفهما.",
      url: "https://www.youtube.com/watch?v=wz_LOl69kAU",
    },
  ],
  l10: [
    {
      title: "رياضيات سنة رابعة (هندسة): أتعرف المسالك المختصرة وموقع عقدة على الشبكة",
      url: "https://www.youtube.com/watch?v=sx0M1J0N-VM",
    },
  ],
};

async function patchVideoLinks() {
  const batch = db.batch();
  let count = 0;

  for (const [lessonId, videoLinks] of Object.entries(VIDEO_LINKS)) {
    const docId = `${GRADE_ID}_${SUBJECT_ID}_${lessonId}`;
    const ref = db.collection("lessonContent").doc(docId);
    batch.set(ref, { videoLinks }, { merge: true });
    count++;
  }

  await batch.commit();
  console.log(`✔ patched videoLinks on ${count} lessonContent docs for ${GRADE_ID}_${SUBJECT_ID} (Trimestre 1)`);
  console.log(`  (l1, l4, l6, l8, l9 skipped — no suitable video found)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});