const OpenAI = require("openai");

let client = null;

function getOpenAIClient() {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

const CUSTOM_EXAM_MODEL = "gpt-5.4-mini";

async function generateCustomExamCompletion({ systemPrompt, userPrompt }) {
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: CUSTOM_EXAM_MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const rawContent = response.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("Réponse vide reçue du modèle.");
  }

  return {
    rawContent,
    usage: response.usage || null, // { prompt_tokens, completion_tokens, total_tokens }
  };
}

module.exports = { getOpenAIClient, generateCustomExamCompletion, CUSTOM_EXAM_MODEL };