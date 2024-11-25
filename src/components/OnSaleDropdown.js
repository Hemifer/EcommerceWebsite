import React from 'react';
import { useOnSale } from '../context/OnSaleContext';  // Import useOnSale from OnSaleContext

const OnSaleDropdown = ({ navigate }) => {
  const { onSaleProduct } = useOnSale();  // Using context to get onSaleProduct
  console.log("onSaleProduct:", onSaleProduct);  // Debugging: check if the correct product is passed to the dropdown

  return (
    <div className="onsale-dropdown">
      {onSaleProduct ? (
        <div
          className="onsale-product"
          onClick={() => navigate(`/product/${onSaleProduct.id}`)}
        >
          <span className="onsale-product-name">{onSaleProduct.name || 'Unnamed Product'}</span>
          <span className="onsale-product-old-price">
            {typeof onSaleProduct.price === 'number'
              ? `Was: $${onSaleProduct.price.toFixed(2)}`
              : 'Old price not available'}
          </span>
          <span className="onsale-product-new-price">
            {onSaleProduct.discountedPrice
              ? `Now: $${onSaleProduct.discountedPrice}`
              : 'Discounted price not available'}
          </span>
        </div>
      ) : (
        <div className="no-sale-items">No products on sale</div>
      )}
    </div>
  );
};

export default OnSaleDropdown;













