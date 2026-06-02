import {collection,addDoc,getDoc,getDocs,doc,query,where,updateDoc,increment,serverTimestamp,limit} from "firebase/firestore";
import { DB } from "../lib/firebaseConfig";

// BUILD EXERCISE KEY
export function buildExerciseKey(grade,subject,trimester,lesson,difficulty) {

    return `${grade}_${subject}_${trimester}_${lesson}_${difficulty}`.toLowerCase().replace(/\s+/g, "_");
    
}


// FIND AVAILABLE EXERCISE
export async function findAvailableExercise(userId,grade,subject,trimester,lesson,difficulty) {
    try {
        const exerciseKey = buildExerciseKey(grade,subject,trimester,lesson,difficulty);

        // GET TEMPLATES FOR THIS KEY
        const templatesSnapshot = await getDocs(
            query(
                collection(DB, "exerciseTemplates"),
                where("key", "==", exerciseKey)
            )
        );

        if (templatesSnapshot.empty) {
            return null;
        }

        const templates = templatesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // GET ONLY THIS USER HISTORY FOR THIS KEY
        const historySnapshot = await getDocs(
            query(
                collection(DB, "exerciseHistory"),
                where("userId", "==", userId),
                where("key", "==", exerciseKey)
            )
        );

        const usedTemplateIds = new Set(
            historySnapshot.docs.map(
                (doc) => doc.data().exerciseTemplateId
            )
        );

        const availableTemplates = templates.filter(
            (template) => !usedTemplateIds.has(template.id)
        );

        if (availableTemplates.length === 0) {
            return null;
        }

        // RANDOM PICK
        const randomIndex = Math.floor(
            Math.random() * availableTemplates.length
        );

        return availableTemplates[randomIndex];

    } catch (error) {
        console.log(error);

        return null;
    }
}


// CREATE EXERCISE TEMPLATE
export async function createExerciseTemplate(data) {

    try {
        const exerciseKey = buildExerciseKey(data.grade,data.subject,data.trimester,data.lesson,data.difficulty);

        const docRef = await addDoc(collection(DB, "exerciseTemplates"),{

            key: exerciseKey,

            grade: data.grade,

            subject: data.subject,

            trimester: data.trimester,

            lesson: data.lesson,

            difficulty: data.difficulty,

            exerciseText: data.exerciseText,

            correctionText: data.correctionText,

            explanationText: data.explanationText,

            usageCount: 0,

            createdAt: serverTimestamp(),

            lastUsedAt: null,
        });

        return docRef.id;

    } catch (error) {
        console.log(error);

        return null;
    }
}


// UPDATE TEMPLATE USAGE
export async function increaseTemplateUsage(templateId) {

    try {
        const templateRef = doc(DB,"exerciseTemplates",templateId);

        await updateDoc(templateRef, {
            usageCount: increment(1),

            lastUsedAt: serverTimestamp(),
        });

        return true;

    } catch (error) {
        console.log(error);

        return false;
    }
}


// CREATE EXERCISE HISTORY
export async function createExerciseHistory(userId,template) {

    try {
        const docRef = await addDoc(collection(DB, "exerciseHistory"),{
            userId,

            exerciseTemplateId: template.id,

            key: template.key,

            grade: template.grade,

            subject: template.subject,

            trimester: template.trimester,

            lesson: template.lesson,

            difficulty: template.difficulty,

            exerciseText: template.exerciseText,

            correctionText: template.correctionText,

            explanationText: template.explanationText,

            userAnswer: null,

            completed: false,

            score: null,

            xpReward: 10,

            generatedAt: serverTimestamp(),

            completedAt: null,
        });

        return docRef.id;

    } catch (error) {
        console.log(error);

        return null;
    }
}


// COMPLETE EXERCISE
export async function completeExercise(historyId,score,userAnswer) {

    try {
        const historyRef = doc(DB,"exerciseHistory",historyId);

        await updateDoc(historyRef, {
            completed: true,

            score,

            userAnswer,

            completedAt: serverTimestamp(),
        });

        return true;

    } catch (error) {
        console.log(error);

        return false;
    }
}


// CHECK IF USER ALREADY RECEIVED TEMPLATE
export async function hasUserSeenTemplate(userId,templateId) {

    try {
        const snapshot = await getDocs(
            query(
                collection(DB, "exerciseHistory"),
                where("userId", "==", userId),
                where("exerciseTemplateId","==",templateId),
                limit(1)
            )
        );

        return !snapshot.empty;

    } catch (error) {
        console.log(error);

        return false;
    }
}

// GET EXERCISE HISTORY
export async function getExerciseHistory(historyId) {

    try {

        const historyRef = doc(DB,"exerciseHistory",historyId);

        const historySnap = await getDoc(historyRef);

        if (!historySnap.exists()) {

            return null;

        }

        return {

            id: historySnap.id,

            ...historySnap.data(),

        };

    } catch (error) {

        console.log(error);

        return null;

    }

}