import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Ensure db is imported
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Firebase v9+ modular imports
import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database'; // Firebase v9+ modular imports
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; // Use LanguageContext
import './SignUpPage.css';

function SignUpPage() {
  const { language } = useLanguage(); // Access language and translations
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const translations = {
    en: {
      signUp: 'Sign Up',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      usernameTaken: 'Username already taken!',
      emailInUse: 'Email already in use!',
      invalidEmail: 'Invalid email address!',
      weakPassword: 'Password should be at least 6 characters.',
      genericError: 'An error occurred. Please try again.',
    },
    fr: {
      signUp: 'Inscription',
      username: "Nom d'utilisateur",
      email: 'Email',
      password: 'Mot de passe',
      login: 'Connexion',
      usernameTaken: "Nom d'utilisateur déjà pris!",
      emailInUse: 'Email déjà utilisé!',
      invalidEmail: 'Adresse email invalide!',
      weakPassword: 'Le mot de passe doit comporter au moins 6 caractères.',
      genericError: 'Une erreur s’est produite. Veuillez réessayer.',
    },
  };

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
      const usernameQuery = query(
        ref(db, 'users'),
        orderByChild('userName'),
        equalTo(username)
      );
      const usernameSnapshot = await get(usernameQuery);

      if (usernameSnapshot.exists()) {
        setError(translations[language].usernameTaken);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      await set(ref(db, `users/${user.uid}`), {
        userName: username,
        email: user.email,
        cart: { items: {} },
      });

      navigate('/');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError(translations[language].emailInUse);
      } else if (error.code === 'auth/invalid-email') {
        setError(translations[language].invalidEmail);
      } else if (error.code === 'auth/weak-password') {
        setError(translations[language].weakPassword);
      } else {
        setError(translations[language].genericError);
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


   


