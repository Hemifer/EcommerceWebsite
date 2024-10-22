import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Correct import path
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database'; // Import ref and set from database
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './SignUpPage.css'; // Import the CSS file

function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get the user object

      // Store user data in Realtime Database
      await set(ref(db, 'users/' + user.uid), {
        userName: username,
        email: user.email,
      });

      console.log('User signed up:', formData);
      navigate('/'); // Redirect to the home page after successful sign-up
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please change your email or log in.');
      } else {
        setError(error.message);
      }
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="container">
      <div className="headerContainer">
        <Link to="/" className="siteName">HemiMerce</Link>
        <Link to="/login" className="loginButton">Log In</Link> {/* Log In button */}
      </div>
      <h2 className="header">Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="formGroup">
          <label className="label">Username</label>
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
          <label className="label">Email</label>
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
          <label className="label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <button type="submit" className="button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpPage;






       


