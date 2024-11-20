import React, { useState, useContext } from 'react';
import { auth, db } from '../firebase'; // Ensure db is imported
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Firebase v9+ modular imports
import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database'; // Firebase v9+ modular imports
import { useNavigate, Link } from 'react-router-dom';
import { translations } from '../context/translations'; // Import translations context
import './SignUpPage.css';

function SignUpPage() {
  const { translations, language } = useContext(translations); // Access translation context
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const CreateUser = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    try {
      console.log("Step 1: Checking if username exists in the database.");

      // Check if the username exists in the Realtime Database
      const usernameQuery = query(
        ref(db, 'users'),
        orderByChild('userName'),
        equalTo(username)
      );
      const usernameSnapshot = await get(usernameQuery);

      if (usernameSnapshot.exists()) {
        setError(translations[language].usernameTaken); // Use translated error message
        console.log("Username exists in the database, cannot proceed with signup.");
        return;
      }

      console.log("Step 2: Attempting to create user with email and password.");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Step 3: User created successfully. Updating profile with username.");
      await updateProfile(user, { displayName: username });

      console.log("Step 4: Saving user information to the database.");
      await set(ref(db, `users/${user.uid}`), {
        userName: username,
        email: user.email,
        cart: { items: {} },
      });

      console.log("Step 5: User data saved successfully in the database. Redirecting to home.");
      navigate('/');
    } catch (error) {
      console.error("Error during sign up process:", error);

      if (error.code === 'auth/email-already-in-use') {
        setError(translations[language].emailInUse); // Translated error message
      } else if (error.code === 'auth/invalid-email') {
        setError(translations[language].invalidEmail); // Translated error message
      } else if (error.code === 'auth/weak-password') {
        setError(translations[language].weakPassword); // Translated error message
      } else {
        setError(translations[language].genericError); // Translated generic error message
      }
    }
  };

  return (
    <div className="container">
      <div className="headerContainer">
        <Link to="/" className="siteName">HemiMerce</Link>
        <Link to="/login" className="loginButton">{translations[language].login}</Link>
      </div>
      <h2 className="header">{translations[language].signUp}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={CreateUser} className="form">
        <div className="formGroup">
          <label className="label">{translations[language].username}</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="formGroup">
          <label className="label">{translations[language].email}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="formGroup">
          <label className="label">{translations[language].password}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <button type="submit" className="button">{translations[language].signUp}</button>
      </form>
    </div>
  );
}
export default SignUpPage;

   


