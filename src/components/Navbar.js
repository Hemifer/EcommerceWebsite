import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../CartContext';
import { useUser } from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../assets/logo.jpg';
import './Navbar.css';

function Navbar() {
  const { cartItems, getCartCount, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useUser();
  const [categoriesVisible, setCategoriesVisible] = useState(false);

  const handleSignUp = () => {
    navigate('/signup');
  };

  const toggleCategories = () => {
    setCategoriesVisible(!categoriesVisible);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  const handleLogoClick = () => {
    navigate('/'); // Navigate to homepage when logo is clicked
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <button onClick={handleLogoClick} className="logo-button">
          <img src={logo} alt="Logo" className="logo" />
          <h2 className="title">HemiMerce</h2>
        </button>
      </div>
      <div className="nav-items">
        <button onClick={toggleCategories} className="products-button">
          Products
        </button>
        {categoriesVisible && (
          <div className="categories-dropdown">
            <button onClick={() => navigate('/kitchenware')} className="category-button">
              Kitchenware
            </button>
            <button onClick={() => navigate('/toys')} className="category-button">
              Toys
            </button>
          </div>
        )}
        {/* Cart button removed */}
        {!currentUser ? (
          <button className="signup-button" onClick={handleSignUp}>
            Sign Up
          </button>
        ) : (
          <button className="signup-button" onClick={handleSignOut}>
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;























