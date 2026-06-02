import { NextResponse } from "next/server";
import {getExerciseHistory,completeExercise} from "../../../services/exerciseService";
import {getUserData,awardXP,updateLevel,increaseStreak} from "../../../services/userService";

export async function POST(request) {

    try {

        const body = await request.json();

        const {historyId,answer} = body;

        if (!historyId) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Missing historyId",
                },
                {
                    status: 400,
                }
            );

        }

        // GET HISTORY
        const history = await getExerciseHistory(historyId);

        if (!history) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Exercise not found",
                },
                {
                    status: 404,
                }
            );

        }

        // ALREADY COMPLETED

        if (history.completed) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Exercise already completed",
                },
                {
                    status: 400,
                }
            );

        }

        // SAVE COMPLETION
        const completed = await completeExercise(historyId,100,answer);

        if (!completed) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to complete exercise",
                },
                {
                    status: 500,
                }
            );

        }

        // XP REWARD
        const xpEarned = history.xpReward || 10;

        await awardXP(history.userId,xpEarned);

        // GET UPDATED USER
        const updatedUser = await getUserData(history.userId);

        let levelUp = false;

        let newLevel = updatedUser?.level || 1;

        // LEVEL SYSTEM
        const requiredXp = newLevel * 200;

        if (updatedUser?.xp >= requiredXp) {

            newLevel += 1;

            await updateLevel(history.userId,newLevel);

            levelUp = true;

        }

        // STREAK

        await increaseStreak(history.userId);

        return NextResponse.json({

            success: true,

            xpEarned,

            levelUp,

            newLevel,

        });

    } catch (error) {

        console.log("Complete Exercise Error:",error);

        return NextResponse.json(
            {
                success: false,
                error:
                    error.message ||
                    "Internal server error",
            },
            {
                status: 500,
            }
        );

    }

}