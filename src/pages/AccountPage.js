import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase'; // Import storage
import { ref, get, update } from 'firebase/database';
import { useUser } from '../context/UserContext';
import { updatePassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar'; // Import Navbar
import './AccountPage.css';

const AccountPage = () => {
    const { currentUser } = useUser();
    const [userInfo, setUserInfo] = useState(null);
    const [cartInfo, setCartInfo] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [newValue, setNewValue] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            const userRef = ref(db, 'users/' + currentUser.uid);
            get(userRef).then(snapshot => {
                const data = snapshot.val();
                if (data) setUserInfo(data);
            }).catch(error => console.error("Error fetching user info:", error));

            const cartRef = ref(db, 'carts/' + currentUser.uid);
            get(cartRef).then(snapshot => {
                const cartData = snapshot.val();
                if (cartData) setCartInfo(cartData);
            }).catch(error => console.error("Error fetching cart info:", error));
        }
    }, [currentUser]);

    const handleEdit = (field) => {
        setEditingField(field);
        setNewValue(userInfo[field] || '');
        setConfirmPassword('');
    };

    const handleUpdate = async () => {
        try {
            if (editingField === 'password') {
                if (newValue.length < 6 || newValue !== confirmPassword) {
                    setError(newValue.length < 6 ? 'Password must be at least 6 characters long.' : 'Passwords do not match.');
                    return;
                }
                await updatePassword(currentUser, newValue);
                setError('Password updated successfully!');
            } else {
                const userRef = ref(db, 'users/' + currentUser.uid);
                await update(userRef, { [editingField]: newValue });
                setUserInfo((prev) => ({ ...prev, [editingField]: newValue }));
            }
            setEditingField(null);
            setNewValue('');
            setConfirmPassword('');
            setError('');
        } catch (error) {
            console.error("Error updating user info:", error);
            setError(error.message);
        }
    };

    const handleUploadProfilePicture = async () => {
        if (!selectedFile) return;

        try {
            const profilePicRef = storageRef(storage, `profilePictures/${currentUser.uid}`);
            await uploadBytes(profilePicRef, selectedFile); // Upload the file to Firebase Storage

            const photoURL = await getDownloadURL(profilePicRef); // Get the download URL
            await updateProfile(currentUser, { photoURL }); // Update the profile picture URL in Firebase Auth
            setUserInfo((prev) => ({ ...prev, photoURL })); // Update the local state with the new URL
            setSelectedFile(null);
            setShowPopup(false); // Close popup after upload
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            setError("Failed to upload profile picture. Please try again.");
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    if (!currentUser) {
        return <div>Please log in to view your account details.</div>;
    }

    return (
        <>
            <Navbar /> {/* Add Navbar here */}

            <div className="accountinfo-profile">
                {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" className="accountinfo-profile-img" />
                ) : (
                    <div className="accountinfo-blank-profile" />
                )}
                <button onClick={() => setShowPopup(true)} className="accountpage-change-profile-button">Change profile picture</button>
            </div>

            {showPopup && (
                <div className="accountpage-popup-container">
                    <div className="accountpage-popup-content">
                        <h2>Change Profile Picture</h2>
                        <img src={currentUser.photoURL || ''} alt="Current Profile" className="accountpage-popup-profile-img" />
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleUploadProfilePicture} className="accountpage-popup-update-button">Update</button>
                        <button onClick={() => setShowPopup(false)} className="accountpage-popup-cancel-button">Cancel</button>
                    </div>
                </div>
            )}

            <h1 className="accountinfo-h1">Account Page</h1>
            {userInfo ? (
                <div className="accountinfo-details">
                    <div className="accountinfo-field">
                        <span>Name: {userInfo.userName}</span>
                        {editingField === 'userName' ? (
                            <input
                                type="text"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="accountinfo-input"
                            />
                        ) : (
                            <button onClick={() => handleEdit('userName')} className="accountinfo-edit-button">Edit</button>
                        )}
                    </div>
                    <div className="accountinfo-field">
                        <span>Email: {userInfo.email}</span>
                        {editingField === 'email' ? (
                            <input
                                type="email"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="accountinfo-input"
                            />
                        ) : (
                            <button onClick={() => handleEdit('email')} className="accountinfo-edit-button">Edit</button>
                        )}
                    </div>
                    <div className="accountinfo-field">
                        <span>Password: {editingField === 'password' ? "********" : "N/A"}</span>
                        {editingField === 'password' ? (
                            <>
                                <input
                                    type="password"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    placeholder="New Password"
                                    className="accountinfo-input"
                                />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm New Password"
                                    className="accountinfo-input"
                                />
                            </>
                        ) : (
                            <button onClick={() => handleEdit('password')} className="accountinfo-edit-button">Edit</button>
                        )}
                    </div>
                    {editingField && (
                        <button onClick={handleUpdate} className="accountinfo-update-button">Update</button>
                    )}
                    {error && <p className="accountinfo-error">{error}</p>}
                </div>
            ) : (
                <p>Loading user information...</p>
            )}
            {cartInfo ? (
                <div>
                    <h2 className="accountinfo-h2">Your Cart</h2>
                    {Object.keys(cartInfo.items || {}).length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <ul>
                            {Object.entries(cartInfo.items).map(([id, item]) => (
                                <li key={id}>
                                    {item.name} - ${item.price} (Quantity: {item.quantity})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <p>Loading cart information...</p>
            )}

            <button 
                onClick={() => navigate('/')} 
                className="accountpage-backbutton"
            >
                Back to Home
            </button>

            <Footer />
        </>
    );
};

export default AccountPage;



