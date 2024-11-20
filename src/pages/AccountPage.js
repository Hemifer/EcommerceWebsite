import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import { ref, get, update } from 'firebase/database';
import { onAuthStateChanged, updatePassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../context/translations';
import './AccountPage.css';

const AccountPage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [cartInfo, setCartInfo] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [newValue, setNewValue] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();
    const { language } = useLanguage(); // Access the current language
    const t = translations[language]; // Fetch translations for the current language

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                const userRef = ref(db, `users/${user.uid}`);
                get(userRef)
                    .then(snapshot => {
                        const data = snapshot.val();
                        if (data) setUserInfo(data);
                    })
                    .catch(error => console.error(t.genericError, error));

                const cartRef = ref(db, `carts/${user.uid}`);
                get(cartRef)
                    .then(snapshot => {
                        const cartData = snapshot.val();
                        if (cartData) setCartInfo(cartData);
                    })
                    .catch(error => console.error(t.genericError, error));
            } else {
                setCurrentUser(null);
                setUserInfo(null);
                setCartInfo(null);
            }
        });

        return () => unsubscribe();
    }, [t.genericError]);

    const handleEdit = (field) => {
        setEditingField(field);
        setNewValue(userInfo[field] || '');
        setConfirmPassword('');
    };

    const handleUpdate = async () => {
        try {
            if (editingField === 'password') {
                if (newValue.length < 6 || newValue !== confirmPassword) {
                    setError(
                        newValue.length < 6
                            ? t.weakPassword
                            : t.passwordMismatch
                    );
                    return;
                }

                if (currentUser) {
                    await updatePassword(currentUser, newValue);
                    setError(t.passwordUpdated);
                } else {
                    throw new Error(t.notAuthenticated);
                }
            } else {
                const userRef = ref(db, `users/${currentUser.uid}`);
                await update(userRef, { [editingField]: newValue });
                setUserInfo(prev => ({ ...prev, [editingField]: newValue }));
            }
            setEditingField(null);
            setNewValue('');
            setConfirmPassword('');
            setError('');
        } catch (error) {
            console.error(t.genericError, error);
            setError(t.genericError);
        }
    };

    const handleUploadProfilePicture = async () => {
        if (!selectedFile) return;

        try {
            const profilePicRef = storageRef(storage, `profilePictures/${currentUser.uid}`);
            await uploadBytes(profilePicRef, selectedFile);

            const photoURL = await getDownloadURL(profilePicRef);
            await updateProfile(currentUser, { photoURL });
            setUserInfo(prev => ({ ...prev, photoURL }));
            setSelectedFile(null);
            setShowPopup(false);
        } catch (error) {
            console.error(t.uploadError, error);
            setError(t.uploadError);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    if (!currentUser) {
        return <div>{t.loginToView}</div>;
    }

    return (
        <>
            <Navbar />

            <div className="accountinfo-profile">
                {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt={t.profilePic} className="accountinfo-profile-img" />
                ) : (
                    <div className="accountinfo-blank-profile" />
                )}
                <button onClick={() => setShowPopup(true)} className="accountpage-change-profile-button">
                    {t.changeProfilePicture}
                </button>
            </div>

            {showPopup && (
                <div className="accountpage-popup-container">
                    <div className="accountpage-popup-content">
                        <h2>{t.changeProfilePicture}</h2>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleUploadProfilePicture} className="accountpage-popup-update-button">
                            {t.update}
                        </button>
                        <button onClick={() => setShowPopup(false)} className="accountpage-popup-cancel-button">
                            {t.cancel}
                        </button>
                    </div>
                </div>
            )}

            <h1 className="accountinfo-h1">{t.accountPageTitle}</h1>
            {userInfo ? (
                <div className="accountinfo-details">
                    <div className="accountinfo-field">
                        <span>{t.username}: {userInfo.userName}</span>
                        {editingField === 'userName' ? (
                            <input
                                type="text"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="accountinfo-input"
                            />
                        ) : (
                            <button onClick={() => handleEdit('userName')} className="accountinfo-edit-button">
                                {t.edit}
                            </button>
                        )}
                    </div>
                    <div className="accountinfo-field">
                        <span>{t.email}: {userInfo.email}</span>
                        {editingField === 'email' ? (
                            <input
                                type="email"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="accountinfo-input"
                            />
                        ) : (
                            <button onClick={() => handleEdit('email')} className="accountinfo-edit-button">
                                {t.edit}
                            </button>
                        )}
                    </div>
                    <div className="accountinfo-field">
                        <span>{t.password}: {editingField === 'password' ? '********' : 'N/A'}</span>
                        {editingField === 'password' ? (
                            <>
                                <input
                                    type="password"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    placeholder={t.newPassword}
                                    className="accountinfo-input"
                                />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t.confirmNewPassword}
                                    className="accountinfo-input"
                                />
                            </>
                        ) : (
                            <button onClick={() => handleEdit('password')} className="accountinfo-edit-button">
                                {t.edit}
                            </button>
                        )}
                    </div>
                    {editingField && (
                        <button onClick={handleUpdate} className="accountinfo-update-button">
                            {t.update}
                        </button>
                    )}
                    {error && <p className="accountinfo-error">{error}</p>}
                </div>
            ) : (
                <p>{t.loadingUserInfo}</p>
            )}
            {cartInfo ? (
                <div>
                    <h2 className="accountinfo-h2">{t.yourCart}</h2>
                    {Object.keys(cartInfo.items || {}).length === 0 ? (
                        <p>{t.cartEmpty}</p>
                    ) : (
                        <ul>
                            {Object.entries(cartInfo.items).map(([id, item]) => (
                                <li key={id}>
                                    {item.name} - ${item.price} ({t.quantity}: {item.quantity})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <p>{t.loadingCart}</p>
            )}

            <Footer />
        </>
    );
};

export default AccountPage;

