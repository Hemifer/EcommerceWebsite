// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import { kitchenwareProducts } from './KitchenwarePage';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../context/translations';
import Footer from '../components/Footer';
import './HomePage.css';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(kitchenwareProducts.slice(0, 8));

  const navigate = useNavigate();
  const { removeFromCart } = useCart();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    if (searchValue === '') {
      setFilteredProducts(kitchenwareProducts.slice(0, 8));
    } else {
      setFilteredProducts(
        kitchenwareProducts.filter((product) =>
          product.name.toLowerCase().includes(searchValue)
        )
      );
    }
  };

  return (
    <div className="homepage-background">
      <Navbar />
      <h1 className="homepage-header">{t.welcomeMessage}</h1>
      <p className="homepage-secondtext">{t.productDescription}</p>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={t.searchPlaceholder}
        className="searchBar"
      />
      <div className="productResults">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            className="productCard"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
          </button>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;


