// UserContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase'; // Import db for database operations
import { ref, get } from 'firebase/database'; // Import ref and get from the database

// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component to wrap the app and provide user data
export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userRef = ref(db, 'users/' + user.uid);
                    const snapshot = await get(userRef);
    
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        // Merge userName into the Firebase Auth user object without overwriting it
                        const fullUser = { ...user, userName: userData.userName };
                        console.log(fullUser); // Log the full user object
                        setCurrentUser(fullUser); // Store the full user object, including Firebase methods
                    } else {
                        setCurrentUser({ ...user, userName: "N/A" });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setCurrentUser(user); // Fallback to using the user object without additional data
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);
    
    if (loading) {
        return <div>Loading user data...</div>; // Show a loading spinner or message
    }

    return (
        <UserContext.Provider value={{ currentUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);





