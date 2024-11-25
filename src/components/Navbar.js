import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../assets/logo.jpg';
import UserDropdown from './UserDropdown';
import './Navbar.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../context/translations';
import OnSaleDropdown from './OnSaleDropdown'; // Import OnSaleDropdown
import { useWishlist } from '../context/WishlistContext'; // Import Wishlist
import { useOnSale } from '../context/OnSaleContext'; // Import OnSale context

function Navbar() {
  const { cartItems, getCartCount, removeFromCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { onSaleVisible, toggleOnSale, onSaleProducts } = useOnSale(); // Use OnSale context
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { language } = useLanguage();
  const [cartVisible, setCartVisible] = useState(false);
  const [wishlistVisible, setWishlistVisible] = useState(false);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [userInfoVisible, setUserInfoVisible] = useState(false);

  const handleSignUp = useCallback(() => {
    navigate('/signup');
  }, [navigate]);

  const toggleCart = useCallback(() => {
    setCartVisible((prev) => !prev);
    setUserInfoVisible(false);
  }, []);

  const toggleWishlist = useCallback(() => {
    setWishlistVisible((prev) => !prev);
    setUserInfoVisible(false);
  }, []);

  const toggleCategories = useCallback(() => {
    setCategoriesVisible((prev) => !prev);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
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
    setCartVisible(false);
  }, []);

  const getTranslation = (key) => translations[language][key];

  return (
    <nav className="navbar">
      <div className="logo-container" onClick={navigateHome}>
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="title">HemiMerce</h2>
      </div>
      <div className="nav-items">
        <button onClick={toggleCategories} className="products-button">
          {getTranslation('products')}
        </button>
        {categoriesVisible && (
          <div className="categories-dropdown">
            <button onClick={() => navigate('/kitchenware')} className="category-button">
              {getTranslation('kitchenwareHeader')}
            </button>
            <button onClick={() => navigate('/toys')} className="category-button">
              {getTranslation('toysHeader')}
            </button>
          </div>
        )}
  
        {/* On Sale Button */}
        <div className="navbar-onsale-button-wrapper" style={{ position: 'relative' }}>
          <button onClick={toggleOnSale} className="navbar-sales-button">
            {getTranslation('onSale')}
          </button>
          {onSaleVisible && (
            <div className="onsale-container">
              <OnSaleDropdown onSaleProducts={onSaleProducts} navigate={navigate} />
            </div>
          )}
        </div>
  
        {currentUser && (
          <>
            <button onClick={() => navigate('/orders')} className="orders-button">
              {getTranslation('yourOrders')}
            </button>
            <button onClick={toggleCart} className="cart-button">
              🛒 ({getCartCount()})
            </button>
            <button onClick={toggleWishlist} className="wishlist-button">
              💖 Wishlist
            </button>
            {cartVisible && (
              <div className="cart-dropdown">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <span>{item.name}</span>
                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      {getTranslation('cartRemoveConfirm')}
                    </button>
                  </div>
                ))}
                <button className="checkout-button" onClick={handleCheckout}>
                  {getTranslation('checkoutTitle')}
                </button>
              </div>
            )}
  
            {wishlistVisible && (
              <div className="wishlist-dropdown">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="wishlist-item">
                    <span>{item.name}</span>
                    <button
                      className="remove-wishlist-button"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
  
        {!currentUser ? (
          <button className="signup-button" onClick={handleSignUp}>
            {getTranslation('login')}
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
