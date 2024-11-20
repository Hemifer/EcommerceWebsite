// src/pages/ToysPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component
import { useLanguage } from '../context/LanguageContext'; // Import useLanguage hook
import { translations } from '../context/translations'; // Import translations file
import './ToysPage.css';

export const toyProducts = [
  { id: 101, name: "Lego Set", price: 49.99, image: "https://via.placeholder.com/150", description: "A fun Lego set for all ages." },
  { id: 102, name: "Barbie Doll", price: 29.99, image: "https://via.placeholder.com/150", description: "Classic Barbie doll." },
  { id: 103, name: "Hot Wheels", price: 19.99, image: "https://via.placeholder.com/150", description: "Hot Wheels cars set." },
  { id: 104, name: "MLP Plushie", price: 15.99, image: "https://via.placeholder.com/150", description: "A soft and cuddly plush toy, branded from the popular kids show." }, 
];

function ToysPage() {
  const navigate = useNavigate();
  const { language } = useLanguage(); // Use the language from context
  const t = translations[language]; // Get the translations for the current language

  const handleProductClick = (id) => {
    navigate(`/products/${id}`, { state: { category: 'toys' } });
  };

  const handleBackToHome = () => {
    navigate('/'); 
  };

  return (
    <div className="toys-page">
      <Navbar /> {/* Add Navbar here */}
      <button onClick={handleBackToHome} className="back-to-home-button">{t.backToHome}</button> {/* Back to Home button */}
      <h1 className="products-header">{t.toysHeader}</h1> {/* Translated header */}
      <div className="products-grid">
        {toyProducts.map((product) => (
          <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p className="product-price">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToysPage;






