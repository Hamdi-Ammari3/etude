import { doc,getDoc,updateDoc,increment,onSnapshot,Timestamp } from "firebase/firestore";
import { DB } from "../lib/firebaseConfig";

//GET USER DATA
export async function getUserData(uid) {

    try {

        const userRef = doc(DB, "users", uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return null;
        }

        return userSnap.data();

    } catch (error) {

        console.log("Error fetching user data:", error);

        return null;

    }
}

// REALTIME USER LISTENER
export function subscribeToUser(uid, callback) {

    const userRef = doc(DB, "users", uid);

    return onSnapshot(
        userRef,
        (snapshot) => {

            if (!snapshot.exists()) {

                callback(null);

                return;
            }

            callback(snapshot.data());

        },
        (error) => {

            console.log(
                "Realtime User Error:",
                error
            );

            callback(null);

        }
    );
}

// GENERIC UPDATE FUNCTION
export async function updateUserData(uid, data) {

    try {

        const userRef = doc(DB, "users", uid);

        await updateDoc(userRef, data);

        return true;

    } catch (error) {

        console.log("Error updating user:", error);

        return false;

    }

}

// UPDATE XP
export async function awardXP(uid, amount) {

    try {

        const userRef = doc(DB, "users", uid);

        await updateDoc(userRef, {
            xp: increment(amount),
        });

        return true;

    } catch (error) {

        console.log("Error awarding XP:", error);

        return false;

    }

}

//INCREASE STREAK
export async function increaseStreak(uid) {

    try {

        const userRef = doc(DB, "users", uid);

        await updateDoc(userRef, {
            streak: increment(1),
        });

        return true;

    } catch (error) {

        console.log("Error updating streak:", error);

        return false;

    } 

}

//EXERCICE COUNTER
export async function addDailyExercise(uid) {

    try {

        const userRef = doc(DB, "users", uid);

        await updateDoc(userRef, {
            dailyExercisesGenerated: increment(1),
        });

        return true;

    } catch (error) {

        console.log(error);

        return false;

    }

}


// UPDATE LEVEL
export async function updateLevel(uid, level) {

    return await updateUserData(uid, {
        level,
    });

}

// UPDATE PLAN
export async function updatePlan(uid, plan) {

  return await updateUserData(uid, {
    plan,
  });

}


// UPDATE SUBSCRIPTION
export async function updateSubscription(uid,subscriptionStart,subscriptionEnd) {

    return await updateUserData(uid, {

        subscriptionStart,

        subscriptionEnd,

    });
}