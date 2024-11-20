import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { ref, get } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';  // Update to use modular import

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Use the updated onAuthStateChanged from the new modular SDK
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userRef = ref(db, 'users/' + user.uid);
                    const snapshot = await get(userRef);
    
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        // Add custom data as a separate property
                        setCurrentUser({ ...user, additionalData: { userName: userData.userName } });
                    } else {
                        setCurrentUser({ ...user, additionalData: { userName: "N/A" } });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setCurrentUser(user); // Use the base Firebase user object as fallback
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading user data...</div>;
    }

    return (
        <UserContext.Provider value={{ currentUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);







