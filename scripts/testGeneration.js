// scripts/testGeneration.js
require("dotenv").config();
const { buildCustomExamPrompt } = require("../lib/customExamPrompt");
const { generateCustomExamCompletion } = require("../lib/openai");
const { validateExamShape } = require("../lib/customExamValidate");

async function run() {
  const { systemPrompt, userPrompt, totalPoints } = buildCustomExamPrompt({
    subjectName: "Français",
    gradeName: "5ème année primaire",
    difficulty: "mixte",
    durationMinutes: 30,
    lessons: [
      {
        title: "Les types de phrases",
        summary: "Il existe quatre types de phrases en français...",
        keyPoints: [
          "Déclarative : Il fait beau aujourd'hui.",
          "Interrogative : Fait-il beau aujourd'hui ?",
          "Exclamative : Quelle belle journée !",
          "Impérative : Sors te promener !",
        ],
        exercises: [
          {
            difficulty: "facile",
            question: "Quel type de phrase est : 'Le chat dort.' ?",
            explanation: "Cette phrase donne une information simple, c'est une phrase déclarative.",
          },
        ],
      },
    ],
  });

  const { rawContent, usage } = await generateCustomExamCompletion({ systemPrompt, userPrompt });

  console.log("--- RAW OUTPUT ---");
  console.log(rawContent);

  const parsed = JSON.parse(rawContent);
  const result = validateExamShape(parsed, totalPoints);

  console.log("\n--- VALIDATION ---");
  console.log(result);

  console.log("\n--- TOKEN USAGE ---");
  console.log(usage);
}

run().catch(console.error);