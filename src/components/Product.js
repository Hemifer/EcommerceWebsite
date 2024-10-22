// src/components/Product.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router

function Product({ product }) {
  const navigate = useNavigate();

  // Navigate to the product detail page on click
  const handleProductClick = () => {
    navigate(`/products/${product.id}`); // Fixed here
  };

  return (
    <div style={styles.productCard} onClick={handleProductClick}>
      <img src={product.image} alt={product.name} style={styles.productImage} />
      <h3 style={styles.productName}>{product.name}</h3>
    </div>
  );
}

const styles = {
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    cursor: 'pointer', // Make the card a clickable button
  },
  productImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  productName: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};

export default Product;









