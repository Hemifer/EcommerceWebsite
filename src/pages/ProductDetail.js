// src/pages/ProductDetail.js
import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext'; 
import { kitchenwareProducts } from './KitchenwarePage'; 
import { toyProducts } from './ToysPage'; // Import toy products
import Navbar from '../components/Navbar'; 
import './ProductDetail.css'; 

function ProductDetail() {
  const { id } = useParams(); 
  const { addToCart } = useContext(CartContext); 
  const navigate = useNavigate();

  // Find the product in either kitchenware or toys categories
  const product = kitchenwareProducts.find(p => p.id === parseInt(id)) ||
                  toyProducts.find(p => p.id === parseInt(id)); 

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(product); 
  };

  const handleBackToProducts = () => {
    if (kitchenwareProducts.some(p => p.id === parseInt(id))) {
      navigate('/kitchenware');
    } else if (toyProducts.some(p => p.id === parseInt(id))) {
      navigate('/toys');
    } else {
      navigate('/'); // Fallback to home page
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div>
      <Navbar />
      <div className="button-container">
        <button onClick={handleBackToHome} className="back-to-home-button">Back to Home Page</button>
        <button onClick={handleBackToProducts} className="back-to-products-button">Back to Products</button>
      </div>
      <div className="detail-container">
        <h1>{product.name}</h1>
        <img src={product.image} alt={product.name} className="product-image" />
        <p>{product.description}</p>
        <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
        <button onClick={handleAddToCart} className="add-to-cart-button">Add to Cart!</button>
      </div>
    </div>
  );
}

export default ProductDetail;











