"use client";

import {createContext,useContext,useEffect,useState} from "react";
import { useAuth } from "./AuthContext";
import { getUserData,subscribeToUser } from "../services/userService";
import { checkAndResetQuota } from "../services/subscriptionService";

const UserContext = createContext();

export function UserProvider({ children }) {

    const { user } = useAuth();

    const [userData, setUserData] = useState(null);
    const [loadingUserData, setLoadingUserData] = useState(true);

    async function fetchUserData() {

        if (!user?.uid) {

            setUserData(null);

            setLoadingUserData(false);

            return;
        }

        try {

            setLoadingUserData(true);

            const data = await getUserData(user.uid);

            setUserData(data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoadingUserData(false);

        }
    }

    /*
    useEffect(() => {

        fetchUserData();

    }, [user]);
    */

    useEffect(() => {

        if (!user?.uid) {

            setUserData(null);

            setLoadingUserData(false);

            return;
        }

        setLoadingUserData(true);

        const unsubscribe = subscribeToUser(user.uid,(data) => {

            setUserData(data);

            setLoadingUserData(false);

        });

        return () => unsubscribe();

    }, [user]);

    //Reset daily quota
    useEffect(() => {

        if (!user?.uid) {

            setUserData(null);

            setLoadingUserData(false);

            return;
        }

        async function initializeUser() {

            const data = await getUserData(user.uid);

            await checkAndResetQuota(
                user.uid,
                data
            );

            const unsubscribe = subscribeToUser(user.uid,(updatedData) => {

                setUserData(updatedData);

                setLoadingUserData(false);

            });

            return unsubscribe;
        }

        let unsubscribe;

        initializeUser().then((unsub) => {

            unsubscribe = unsub;

        });

        return () => {

            if (unsubscribe) {

                unsubscribe();

            }

        };

    }, [user]);

    return (
        <UserContext.Provider
            value={{
                userData,
                loadingUserData,
                refreshUserData: fetchUserData,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}