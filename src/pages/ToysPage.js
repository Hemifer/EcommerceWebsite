import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Navbar import
import { useLanguage } from '../context/LanguageContext'; // Language context
import { translations } from '../context/translations'; // Translations
import { ProductsProvider } from '../context/ProductsContext'; // Import the ProductsProvider
import './ToysPage.css';

export const toyProducts = [
  { id: 101, name: "Lego Set", price: 49.99, image: "https://via.placeholder.com/150", description: "A fun Lego set for all ages." },
  { id: 102, name: "Barbie Doll", price: 29.99, image: "https://via.placeholder.com/150", description: "Classic Barbie doll." },
  { id: 103, name: "Hot Wheels", price: 19.99, image: "https://via.placeholder.com/150", description: "Hot Wheels cars set." },
  { id: 104, name: "Dog Cat Thing Plushie", price: 15.99, image: "https://via.placeholder.com/150", description: "A soft and cuddly plush toy." },
];

function ToysPage() {
  const navigate = useNavigate();
  const { language } = useLanguage(); // Current language
  const t = translations[language]; // Translations based on language

  const handleProductClick = (id) => {
    navigate(`/product/${id}`, { state: { category: 'toys' } });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <ProductsProvider kitchenwareProducts={[]} toyProducts={toyProducts}>
      <div className="toys-page">
        <Navbar />
        <button onClick={handleBackToHome} className="back-to-home-button">
          {t.backToHome}
        </button>
        <h1 className="products-header">{t.toysHeader}</h1>
        <div className="products-grid">
          {toyProducts.map((product) => (
            <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-description">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </ProductsProvider>
  );
}

export default ToysPage;







