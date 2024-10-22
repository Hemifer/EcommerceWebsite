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
  const [userInfoVisible, setUserInfoVisible] = useState(false); // State to manage user info dropdown visibility

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

  const handleCheckout = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  const navigateHome = () => {
    navigate('/');
  };

  const toggleUserInfo = () => {
    setUserInfoVisible(!userInfoVisible);
  };

  return (
    <nav className="navbar">
      <div className="logo-container" onClick={navigateHome}>
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
            <button onClick={() => navigate('/toys')} className="category-button">
              Toys
            </button>
          </div>
        )}
        {location.pathname !== '/checkout' && (
          <button onClick={toggleCart} className="cart-button">
            🛒 Cart ({getCartCount()})
          </button>
        )}
        {cartVisible && location.pathname !== '/checkout' && (
          <div className="cart-dropdown">
            {cartItems.length > 0 ? (
              <>
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <span>{item.name}</span>
                    <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button className="checkout-button" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </>
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
          <div className="account-container">
            <div className="profile-picture" onClick={toggleUserInfo}>
              {/* Display profile picture or a blank avatar if none exists */}
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="profile-img" />
              ) : (
                <div className="blank-profile" />
              )}
            </div>
            {userInfoVisible && (
            <div className="user-info-dropdown">
    <h4 className="account-title">Account</h4>
    {currentUser && (
      <>
        <div>Email: {currentUser.email}</div>
        <div>Username: {currentUser.displayName || "N/A"}</div>
        <button className="edit-account-button" onClick={() => navigate('/account')}>
          Edit Account
        </button>
        <button className="sign-out-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </>
    )}
  </div>
)}

          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

























