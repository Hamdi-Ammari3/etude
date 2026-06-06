import { NextResponse } from "next/server";
import {getUserData} from '../../../services/userService'
import {canGenerateExercise,isPremium} from "../../../services/subscriptionService";
import {findAvailableExercise,createExerciseTemplate,createExerciseHistory,increaseTemplateUsage,buildExerciseKey } from "../../../services/exerciseService";
import { addDailyExercise,addExerciseStat } from "../../../services/userService";
import { generateExerciseWithAI } from "../../../services/openAIService";

export async function POST(request) {
    try {
        const body = await request.json();

        const {userId,grade,subject,trimester,lesson,difficulty,language} = body;

        // VALIDATION
        if (!userId || !grade || !subject || !trimester || !lesson || !difficulty || !language) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required fields",
                },
                {
                    status: 400,
                }
            );
        }

        // GET USER
        let userData = await getUserData(userId);

        if (!userData) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        // CHECK QUOTA
        if (!canGenerateExercise(userData)) {

            const premiumUser = isPremium(userData);

            return NextResponse.json(
                {
                    success: false,
                    quotaReached: true,
                    isPremium: premiumUser,
                    limit: premiumUser ? 30 : 3,
                    error: "Limite quotidienne atteinte.",
                },
                {
                    status: 403,
                }
            );
        }

        // TRY CACHE FIRST
        const cachedExercise = await findAvailableExercise(userId,grade,subject,trimester,lesson,difficulty);

        if (cachedExercise) { 

            const [historyId] = await Promise.all([
                createExerciseHistory(userId,cachedExercise),

                increaseTemplateUsage(cachedExercise.id),

                addDailyExercise(userId),

                addExerciseStat(userId,subject,grade),
            ]);

            return NextResponse.json({
                success: true,

                source: "cache",

                historyId,

                //exercise: cachedExercise,
            });
        }

        // GENERATE WITH OPENAI
        const aiResult = await generateExerciseWithAI({grade,subject,trimester,lesson,difficulty,language});

        if (!aiResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: aiResult.error || "AI generation failed",
                },
                {
                    status: 500,
                }
            );
        }

        // SAVE TEMPLATE
        const templateId = await createExerciseTemplate({
            grade,
            subject,
            trimester,
            lesson,
            difficulty,
            language,

            exerciseText: aiResult.exerciseText,

            correctionText: aiResult.correctionText,

            explanationText: aiResult.explanationText,
        });

        if (!templateId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to save exercise template",
                },
                {
                    status: 500,
                }
            );
        }

        // BUILD TEMPLATE OBJECT
        const template = {
            id: templateId,
            key: buildExerciseKey(grade,subject,trimester,lesson,difficulty),

            grade,
            subject,
            trimester,
            lesson,
            difficulty,
            language,

            exerciseText: aiResult.exerciseText,

            correctionText: aiResult.correctionText,

            explanationText: aiResult.explanationText,
        };

        // SAVE HISTORY + USAGE
        const [historyId] = await Promise.all([
            createExerciseHistory(userId,template),

            addDailyExercise(userId),

            addExerciseStat(userId,subject,grade),
        ]);

        // RETURN RESULT
        return NextResponse.json({
            success: true,

            source: "ai",

            historyId,

            //exercise: template,
        })
    } catch (error) {

        console.log("Generate Exercise Route Error:",error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error", 
            },
            {
                status: 500,
            }
        );
    }
}