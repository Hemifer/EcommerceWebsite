// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth'; // This import remains the same
import Navbar from '../components/Navbar';
import { kitchenwareProducts } from './KitchenwarePage'; // Import the product list
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useCart } from '../context/CartContext'; // Import CartContext
import { useLanguage } from '../context/LanguageContext'; // Import useLanguage
import { translations } from '../context/translations'; // Import translations
import './HomePage.css';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(kitchenwareProducts.slice(0, 8)); // Default to first 8 products

  const navigate = useNavigate(); // Use navigate
  const { removeFromCart } = useCart(); // Access remove function
  const { language } = useLanguage(); // Get current language
  const t = translations[language]; // Get translations based on current language

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Update logged-in state
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    if (searchValue === '') {
      setFilteredProducts(kitchenwareProducts.slice(0, 8)); // Reset to first 8 products
    } else {
      setFilteredProducts(kitchenwareProducts.filter(product => 
        product.name.toLowerCase().includes(searchValue) // Filter based on search term
      ));
    }
  };

  return (
    <div className="homepage-background">
      <Navbar />
      <h1 className="homepage-header">{t.welcomeMessage}</h1>
      <p className="homepage-secondtext">
        {t.productDescription}
      </p>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={t.searchPlaceholder}
        className="searchBar"
      />
      <div className="productResults">
        {filteredProducts.map(product => (
          <button 
            key={product.id} 
            className="productCard" 
            onClick={() => navigate(`/products/${product.id}`)} // Navigate to product details on card click
          >
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

