// scripts/patchPrim6FrancaisVideoLinksT1.js
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
const SUBJECT_ID = "francais";

const VIDEO_LINKS = {
  l1: [
    {
      title: "Les pronoms personnels — CM1 - CM2 - Cycle 3 - Français, Étude de la langue",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=30jTpBaBI_k",
    },
  ],
  l2: [
    {
      title: "Adjectif qualificatif - épithète - attribut du sujet — CM1-CM2-Cycle 3",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=jJ0ZsRqluCU",
    },
  ],
  l3: [
    {
      title: "Passé composé des verbes être et avoir — CE2 - CM1 - Cycle 2 et 3",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=0hadpvyN0PY",
    },
    {
      title: "Futur des verbes être et avoir — CE1 - CE2 - Cycle 2",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=RLZXVVOHGb4",
    },
  ],
  l4: [
    {
      title: "Homophones grammaticaux — CM1 - CM2 - 6ème - Cycle 3 - Français - Grammaire",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=iq_NpmADtr4",
    },
  ],
  l5: [
    {
      title: "La négation : ne...plus, ne...jamais — CM1 CM2",
      url: "https://www.youtube.com/watch?v=Vs5CHtxy360",
    },
  ],
  l6: [
    {
      title: "Verbes du 2e groupe (type finir) au passé composé et au futur — CM1 CM2",
      url: "https://www.youtube.com/watch?v=BwAzHKJ6stQ",
    },
  ],
  l7: [
    {
      title: "Homophones grammaticaux — CM1 - CM2 - 6ème - Cycle 3 - Français - Grammaire",
      channel: "Maître Lucas",
      url: "https://www.youtube.com/watch?v=iq_NpmADtr4",
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
  console.log(`  (l5, l6 have a title but empty url — search manually)`);
}

async function main() {
  await patchVideoLinks();
  process.exit(0);
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});