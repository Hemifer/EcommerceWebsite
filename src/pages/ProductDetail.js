import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // Corrected import for useWishlist
import { kitchenwareProducts } from './KitchenwarePage'; 
import { toyProducts } from './ToysPage'; 
import Navbar from '../components/Navbar'; 
import { translations } from '../context/translations';
import { useLanguage } from '../context/LanguageContext'; // Import LanguageContext hook
import './ProductDetail.css'; 

function ProductDetail() {
  const { id } = useParams(); 
  const { addToCart } = useContext(CartContext); 
  const { addToWishlist } = useWishlist(); // Corrected usage of useWishlist
  const navigate = useNavigate();
  const { language: currentLanguage } = useLanguage(); // Get currentLanguage from LanguageContext
  const [isAdding, setIsAdding] = useState(false);

  const product = kitchenwareProducts.find(p => p.id === parseInt(id)) ||
                  toyProducts.find(p => p.id === parseInt(id)); 

  useEffect(() => {
    if (!product) {
      navigate('/'); // Redirect if product is not found
    }
  }, [product, navigate]);

  if (!product) {
    return <div>{translations[currentLanguage].genericError}</div>;
  }

  const handleAddToCart = async (event) => {
    event.preventDefault();
    if (isAdding) return; 
    setIsAdding(true); 

    await addToCart(product);
    setIsAdding(false); 
  };

  const handleAddToWishlist = async (event) => {
    event.preventDefault();
    console.log('Adding to wishlist:', product); // Log to check if the product is being passed correctly
    await addToWishlist(product); // Add product to wishlist using useWishlist hook
  };
  

  const handleBackToProducts = () => {
    if (kitchenwareProducts.some(p => p.id === parseInt(id))) {
      navigate('/kitchenware');
    } else if (toyProducts.some(p => p.id === parseInt(id))) {
      navigate('/toys');
    } else {
      navigate('/'); 
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div>
      <Navbar />
      <div className="product-detail-button-container">
        <button onClick={handleBackToHome} className="product-detail-back-to-home-button">
          {translations[currentLanguage].backToHome}
        </button>
        <button onClick={handleBackToProducts} className="product-detail-back-to-products-button">
          {translations[currentLanguage].backToProducts}
        </button>
      </div>
      <div className="product-detail-container">
        <h1 className="product-detail-title">{product.name}</h1>
        <img src={product.image} alt={product.name} className="product-detail-image" />
        <p className="product-detail-description">{product.description}</p>
        <p className="product-detail-price">
          <strong>{translations[currentLanguage].price}:</strong> ${product.price.toFixed(2)}
        </p>
        <button onClick={handleAddToCart} className="product-detail-add-to-cart-button">
          {translations[currentLanguage].addToCart}
        </button>
        <button onClick={handleAddToWishlist} className="product-detail-add-to-wishlist-button">
          {translations[currentLanguage].productPageWishlist}
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;





