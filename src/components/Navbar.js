import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { signOut } from 'firebase/auth'; // Correct for new SDK
import { auth } from '../firebase';
import logo from '../assets/logo.jpg';
import UserDropdown from './UserDropdown';
import './Navbar.css';

function Navbar() {
  const { cartItems, getCartCount, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [cartVisible, setCartVisible] = useState(false);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [userInfoVisible, setUserInfoVisible] = useState(false);

  const handleSignUp = useCallback(() => {
    navigate('/signup');
  }, [navigate]);

  const toggleCart = useCallback(() => {
    setCartVisible((prev) => !prev);
    if (!cartVisible) {
      setUserInfoVisible(false);
    }
  }, [cartVisible]);

  const toggleCategories = useCallback(() => {
    setCategoriesVisible((prev) => !prev);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);  // This line is fine
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [navigate]);

  const handleCheckout = useCallback(() => {
    navigate('/checkout');
  }, [navigate]);

  const navigateHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const toggleUserInfo = useCallback(() => {
    setUserInfoVisible((prev) => !prev);
    if (!userInfoVisible) {
      setCartVisible(false);
    }
  }, [userInfoVisible]);

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
        {currentUser && (
          <>
            <button onClick={() => navigate('/orders')} className="orders-button">
              Orders
            </button>
            <button onClick={toggleCart} className="cart-button">
              🛒 Cart ({getCartCount()})
            </button>
            {cartVisible && (
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
          </>
        )}
        {!currentUser ? (
          <button className="signup-button" onClick={handleSignUp}>
            Sign Up
          </button>
        ) : (
          <div className="account-container">
            <div className="profile-picture" onClick={toggleUserInfo}>
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="profile-img" />
              ) : (
                <div className="blank-profile" />
              )}
            </div>
            {userInfoVisible && (
              <UserDropdown
                currentUser={currentUser}
                toggleUserInfo={toggleUserInfo}
                userInfoVisible={userInfoVisible}
                handleSignOut={handleSignOut}
              />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
