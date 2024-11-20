// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { auth } from '../firebase'; // Use the auth from firebase.js
import { signInWithEmailAndPassword } from 'firebase/auth'; // No need for getAuth since we are using the imported auth
import { useNavigate } from 'react-router-dom'; // Import TranslationsContext
import './LoginPage.css'; // Import the CSS file

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Use the context to get translations
  const { translations, language } = useContext(translations);
  const t = translations[language]; // Current language translations

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    const { email, password } = formData;

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validate Email format using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError(t.invalidEmail);
      return;
    }

    // Validate Password length (minimum of 6 characters)
    if (trimmedPassword.length < 6) {
      setError(t.weakPassword);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      navigate('/'); // Redirect to the home page after successful login
    } catch (error) {
      // Firebase error code handling
      switch (error.code) {
        case 'auth/user-not-found':
          setError(t.emailInUse);
          break;
        case 'auth/wrong-password':
          setError(t.genericError);
          break;
        case 'auth/invalid-credential':
          setError(t.genericError);
          break;
        case 'auth/too-many-requests':
          setError(t.genericError);
          break;
        default:
          setError(t.genericError);
      }
    }
  };

  return (
    <div className="container">
      <h2 className="header">{t.login}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="formGroup">
          <label className="label">{t.email}</label>
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
          <label className="label">{t.password}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <button type="submit" className="button">{t.login}</button>
      </form>
    </div>
  );
}

export default LoginPage;
