// src/pages/KitchenwarePage.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Product from '../components/Product';
import { CartContext } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext'; // Import useLanguage
import { translations } from '../context/translations'; // Import translations
import './KitchenwarePage.css'; 

// Exporting kitchenwareProducts for potential use elsewhere
export const kitchenwareProducts = [
  { id: 1, name: "Chef's Knife", price: 59.99, image: "https://via.placeholder.com/150", description: "A versatile knife for chopping, slicing, and dicing." },
  { id: 2, name: "Non-stick Pan", price: 45.99, image: "https://via.placeholder.com/150", description: "A high-quality non-stick pan for all your frying needs." },
  { id: 3, name: "Cutting Board", price: 19.99, image: "https://via.placeholder.com/150", description: "Durable cutting board for all your slicing needs." },
  { id: 4, name: "Blender", price: 89.99, image: "https://via.placeholder.com/150", description: "Perfect for making smoothies and soups." },
  { id: 5, name: "Toaster", price: 34.99, image: "https://via.placeholder.com/150", description: "Makes crispy toast quickly." },
  { id: 6, name: "Air Fryer", price: 129.99, image: "https://via.placeholder.com/150", description: "Healthier alternative to frying food." },
  { id: 7, name: "Mixing Bowls", price: 24.99, image: "https://via.placeholder.com/150", description: "Set of 3 stainless steel bowls." },
  { id: 8, name: "Electric Kettle", price: 39.99, image: "https://via.placeholder.com/150", description: "Boils water in minutes." },
  { id: 9, name: "Coffee Maker", price: 79.99, image: "https://via.placeholder.com/150", description: "Brew the perfect cup of coffee." },
  { id: 10, name: "Hand Mixer", price: 29.99, image: "https://via.placeholder.com/150", description: "Handheld mixer for quick blending." },
  { id: 11, name: "Food Processor", price: 99.99, image: "https://via.placeholder.com/150", description: "Chops and processes food easily." },
  { id: 12, name: "Rolling Pin", price: 12.99, image: "https://via.placeholder.com/150", description: "Perfect for baking and rolling dough." },
  { id: 13, name: "Measuring Cups", price: 14.99, image: "https://via.placeholder.com/150", description: "Set of 4 measuring cups." },
  { id: 14, name: "Grill Pan", price: 49.99, image: "https://via.placeholder.com/150", description: "Cast iron grill pan for grilling indoors." },
  { id: 15, name: "Microwave", price: 119.99, image: "https://via.placeholder.com/150", description: "Quickly heats up food." },
  { id: 16, name: "Juicer", price: 69.99, image: "https://via.placeholder.com/150", description: "Makes fresh juice from fruits and vegetables." },
  { id: 17, name: "Salt and Pepper Shakers", price: 9.99, image: "https://via.placeholder.com/150", description: "Essential table condiments." },
  { id: 18, name: "Dutch Oven", price: 139.99, image: "https://via.placeholder.com/150", description: "Heavy-duty pot for slow cooking." },
  { id: 19, name: "Wine Glass Set", price: 24.99, image: "https://via.placeholder.com/150", description: "Set of 6 elegant wine glasses." },
  { id: 20, name: "Dish Rack", price: 29.99, image: "https://via.placeholder.com/150", description: "Keeps your dishes organized and dry." },  
];

function KitchenwarePage() {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useContext(CartContext);
  const { language } = useLanguage(); // Get current language
  const t = translations[language]; // Get translations based on current language

  const handleBackToHome = () => {
    navigate('/'); 
  };

  return (
    <div>
      <Navbar />
      <div className="products-container">
        <button onClick={handleBackToHome} className="products-backButton">{t.backToHome}</button>
        <h1 className="products-header">{t.kitchenwareHeader}</h1>
        <div className="products-grid">
          {kitchenwareProducts.map(product => (
            <Product 
              key={product.id} 
              product={product} 
              addToCart={addToCart}
              isInCart={cartItems.some(item => item.id === product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default KitchenwarePage;











