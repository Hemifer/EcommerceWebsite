// src/pages/AccountPage.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase'; // Import your Firebase config
import { onValue, ref, set } from 'firebase/database';

const AccountPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const user = auth.currentUser; // Get the current user

    useEffect(() => {
        if (user) {
            const userRef = ref(db, 'users/' + user.uid); // Reference to the user's data
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                setUserInfo(data); // Set the user info
            });
        }
    }, [user]);

    const handleUpdate = () => {
        if (user) {
            const userRef = ref(db, 'users/' + user.uid);
            // Example of updating user data (e.g., userName)
            set(userRef, {
                userName: "New Name", // Replace with actual data
                email: user.email,
                // Add any other fields you want to update
            });
        }
    };

    return (
        <div>
            <h1>Account Page</h1>
            {userInfo ? (
                <div>
                    <p>Name: {userInfo.userName}</p>
                    <p>Email: {userInfo.email}</p>
                    <button onClick={handleUpdate}>Update Profile</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default AccountPage;


