import {doc,updateDoc,Timestamp} from "firebase/firestore";
import { DB } from "../lib/firebaseConfig";

//USER PREMUIM SUBS CHECK
export function isPremium(userData) {

    if (!userData) {
        return false;
    }

    if (userData.plan !== "premium") {
        return false;
    }

    if (!userData.subscriptionEnd) {
        return false;
    }

    const now = new Date();

    const endDate = userData.subscriptionEnd.toDate();

    return endDate > now;
}

//Check and Reset Quota
export async function checkAndResetQuota(uid,userData) {

    if (!userData) {
        return false;
    }

    const lastReset = userData.lastDailyReset?.toDate();

    if (!lastReset) {

        const userRef = doc(DB, "users", uid);

        await updateDoc(userRef, {
            dailyExercisesGenerated: 0,
            lastDailyReset: Timestamp.now(),
        });

        return true;
    }

    const now = new Date();

    const sameDay =
        now.getDate() === lastReset.getDate() &&
        now.getMonth() === lastReset.getMonth() &&
        now.getFullYear() === lastReset.getFullYear();

    if (sameDay) {
        return false;
    }

    const userRef = doc(DB, "users", uid);

    await updateDoc(userRef, {

        dailyExercisesGenerated: 0,

        lastDailyReset: Timestamp.now(),

    });

    return true;
}

// USER CAN GENERATE EXERCISE ?
export function canGenerateExercise(userData) {

    if (!userData) {
        return false;
    }

    const FREE_DAILY_LIMIT = 3;

    const PREMIUM_DAILY_LIMIT = 30;

    const limit = isPremium(userData) ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

    return userData.dailyExercisesGenerated < limit;

}

// GET USER REMAINING QUOTA
export function getRemainingDailyQuota(userData) {

    if (!userData) {
        return 0;
    }

    const FREE_DAILY_LIMIT = 3;

    const PREMIUM_DAILY_LIMIT = 30;

    const limit = isPremium(userData)
        ? PREMIUM_DAILY_LIMIT
        : FREE_DAILY_LIMIT;

    return Math.max(0, limit - (userData.dailyExercisesGenerated || 0));

}

//RESET DAILY ENERGY
export async function resetDailyUsageIfNeeded(uid,userData) {

    if (!userData) {
        return;
    }

    const lastReset = userData.lastDailyReset?.toDate();

    if (!lastReset) {
        return;
    }

    const today = new Date();

    const isSameDay = today.getDate() === lastReset.getDate() && today.getMonth() === lastReset.getMonth() && today.getFullYear() === lastReset.getFullYear();

    if (isSameDay) {
        return false;
    }

    const userRef = doc(DB, "users", uid);

    await updateDoc(userRef, {

        dailyExercisesGenerated: 0,

        lastDailyReset: Timestamp.now(),

    });

    return true;

}