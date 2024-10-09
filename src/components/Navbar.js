// src/components/Navbar.js
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
  const [cartVisible, setCartVisible] = useState(false);
  const [categoriesVisible, setCategoriesVisible] = useState(false);

  const handleSignUp = () => {
    navigate('/signup');
  };

  const toggleCart = () => {
    setCartVisible(!cartVisible);
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

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="title">HemiMerce</h2>
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
            <button onClick={() => navigate('/toys')} className="category-button"> {/* New Toys category */}
            Toys
            </button>
          </div>
        )}
        <button onClick={toggleCart} className="cart-button">
          🛒 Cart ({getCartCount()})
        </button>
        {cartVisible && (
          <div className="cart-dropdown">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <span>{item.name}</span>
                  <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-cart">Cart is empty</div>
            )}
          </div>
        )}
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





















