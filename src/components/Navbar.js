import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import useProducts from '../context/useProducts';
import logo from '../assets/logo.jpg';
import UserDropdown from './UserDropdown';
import './Navbar.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../context/translations';
import OnSaleDropdown from './OnSaleDropdown'; // Import OnSaleDropdown here
import { useWishlist } from '../context/WishlistContext'; // Import the useWishlist hook


function Navbar() {
  const { cartItems, getCartCount, removeFromCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist(); // Get wishlistItems and removeFromWishlist from context
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { language } = useLanguage();
  const { onSaleProducts } = useProducts(); // Get on sale products from context
  const [cartVisible, setCartVisible] = useState(false);
  const [wishlistVisible, setWishlistVisible] = useState(false); // State for wishlist dropdown
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [onSaleVisible, setOnSaleVisible] = useState(false); // State for controlling on sale dropdown visibility

  const handleSignUp = useCallback(() => {
    navigate('/signup');
  }, [navigate]);

  const toggleCart = useCallback(() => {
    setCartVisible((prev) => !prev);
    if (!cartVisible) {
      setUserInfoVisible(false);
    }
  }, [cartVisible]);

  const toggleWishlist = useCallback(() => {
    setWishlistVisible((prev) => !prev);
    if (!wishlistVisible) {
      setUserInfoVisible(false);
    }
  }, [wishlistVisible]);

  const toggleCategories = useCallback(() => {
    setCategoriesVisible((prev) => !prev);
  }, []);

  const toggleOnSale = useCallback(() => {
    setOnSaleVisible((prev) => !prev);
    console.log('Toggled On Sale visibility:', !onSaleVisible); // Debug log
  }, [onSaleVisible]);

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
    if (!userInfoVisible) {
      setCartVisible(false);
    }
  }, [userInfoVisible]);

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

        {/* On Sale Button Inside Navbar */}
        <button onClick={toggleOnSale} className="navbar-sales-button">
          {getTranslation('onSale')}
        </button>

        {/* Cart Button Logic */}
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
                {cartItems.length > 0 ? (
                  <>
                    {cartItems.map((item) => (
                      <div key={item.id} className="cart-item">
                        <span>{item.name}</span>
                        <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                          {getTranslation('cartRemoveConfirm')}
                        </button>
                      </div>
                    ))}
                    <button className="checkout-button" onClick={handleCheckout}>
                      {getTranslation('checkoutTitle')}
                    </button>
                  </>
                ) : (
                  <div className="empty-cart">{getTranslation('cartEmpty')}</div>
                )}
              </div>
            )}

            {/* Wishlist Dropdown */}
            {wishlistVisible && (
              <div className="wishlist-dropdown">
                {wishlistItems.length > 0 ? (
                  wishlistItems.map((item) => (
                    <div key={item.id} className="wishlist-item">
                      <span>{item.name}</span>
                      <button
                        className="remove-wishlist-button"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div>{getTranslation('wishlistEmpty')}</div>
                )}
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
                userInfoVisible={userInfoVisible}
                handleSignOut={handleSignOut}
              />
            )}
          </div>
        )}
      </div>

      {/* On Sale Dropdown should be outside the Navbar, but controlled by the navbar button */}
      {onSaleVisible && (
        <div className="onsale-container">
          <OnSaleDropdown
            onSaleProducts={onSaleProducts}
            navigate={navigate} // To navigate to product details when clicked
          />
        </div>
      )}
    </nav>
  );
}

export default Navbar;








