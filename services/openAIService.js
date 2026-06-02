import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// GENERATE EXERCISE WITH AI
export async function generateExerciseWithAI({grade,subject,trimester,lesson,difficulty,language}) {

    try {

        const languageInstruction = {

            arabic: "اكتب التمرين والإصلاح والشرح باللغة العربية.",

            french: "Écris l'exercice, la correction et l'explication en français.",

            english: "Write the exercise, correction and explanation in English.",

        }[language];

        //- استعمل الحروف العربية (أ، ب، ج، د، هـ) بدلاً من (A, B, C, D, E).
        //- تجنب خلط العربية مع الفرنسية أو الإنجليزية.
        //- إذا احتوى التمرين على مقادير أو متغيرات رياضية فاستخدم (أ، ب، ج) بدلاً من الأحرف اللاتينية.

        const arabicRules = language === "arabic"
            ? `
             قواعد إضافية للغة العربية:

                
                - استعمل الكلمات العربية في الأمثلة والأسماء.
                - اجعل جميع التعليمات والتمارين والإصلاحات باللغة العربية فقط.
                
                
                - اكتب التمرين بطريقة مناسبة للقراءة من اليمين إلى اليسار.
                - مهم جداً: استعمل الأرقام المستعملة في تونس (0 1 2 3 4 5 6 7 8 9).
                - لا تستعمل أبداً الأرقام المشرقية (٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩).
                - في جميع التمارين والحلول والشروحات الرياضية استعمل حصراً الأرقام: 0 1 2 3 4 5 6 7 8 9.
            `
        : "";

        const prompt = `
            Tu es un enseignant tunisien expert.

            Génère un exercice scolaire adapté au programme tunisien.

            Informations :

                - Niveau : ${grade}
                - Matière : ${subject}
                - Trimestre : ${trimester}
                - Leçon : ${lesson}
                - Difficulté : ${difficulty}
                - Langue demandée : ${languageInstruction}

            ${arabicRules}

            IMPORTANT :

                Retourne UNIQUEMENT un objet JSON valide.

            Format :

                {
                    "exerciseText": "...",
                    "correctionText": "...",
                    "explanationText": "..."
                }

            Règles :

                - Exercice adapté à l'âge de l'élève.
                - Correction complète.
                - Explication pédagogique simple.
                - Pas de markdown.
                - Pas de texte avant ou après le JSON.
        `;

        const response = await openai.responses.create({

            model: "gpt-5.4-mini",

            input: prompt,

        });

        const content = response.output_text;

        if (!content) {

            throw new Error(
                "Empty response from OpenAI"
            );

        }

        let parsed;

        try {

            parsed = JSON.parse(content);

        } catch {

            throw new Error(
                "Invalid JSON returned by OpenAI"
            );

        }

        if (!parsed.exerciseText || !parsed.correctionText || !parsed.explanationText) {

            throw new Error(
                "Missing fields in OpenAI response"
            );

        }

        return {

            success: true,

            exerciseText: parsed.exerciseText,

            correctionText: parsed.correctionText,

            explanationText: parsed.explanationText,

        };

    } catch (error) {

        console.log("OpenAI Generation Error:",error);

        return {

            success: false,

            error: error.message || "Exercise generation failed",

        };

    }

}