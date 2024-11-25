import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnSale } from '../context/OnSaleContext'; // Ensure this is the correct path
import './Product.css';

const Product = ({ product }) => {
  const navigate = useNavigate();
  const { onSaleProduct } = useOnSale(); // Access onSaleProduct from context

  // Update product details if it matches the on-sale product
  const updatedProduct = onSaleProduct?.id === product.id 
    ? { ...product, ...onSaleProduct } 
    : product;

  // Debug: Log incoming product and updated product
  useEffect(() => {
    console.log('Original Product:', product);
    console.log('Updated Product with Sale Details:', updatedProduct);
  }, [product, updatedProduct]);

  const handleCardClick = () => {
    console.log('Navigating to product detail page for:', updatedProduct.id);
    navigate(`/product/${updatedProduct.id}`); // This is correct
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* Render "On Sale!" label if the product is on sale */}
      {updatedProduct.discountedPrice && <span className="onsalelabel">On Sale!</span>}
      {/* Product Image */}
      <img src={updatedProduct.image} alt={updatedProduct.name} className="product-image" />
      {/* Product Name */}
      <h3 className="product-name">{updatedProduct.name}</h3>
      {/* Product Price */}
      <p className="product-price">
        {updatedProduct.discountedPrice ? (
          <>
            {/* Original Price */}
            <span className="original-price">${updatedProduct.price.toFixed(2)}</span>
            {/* Sale Price */}
            <span className="sale-price">${updatedProduct.discountedPrice.toFixed(2)}</span>
          </>
        ) : (
          `$${updatedProduct.price.toFixed(2)}`
        )}
      </p>
      {/* Product Description */}
      <p className="product-description">{updatedProduct.description}</p>
    </div>
  );
};

export default Product;












