import React from 'react';
import './OnSaleDropdown.css'; // Assuming you're using a separate file for the styles

const OnSaleDropdown = ({ onSaleProducts, navigate }) => {
  return (
    <div className="onsale-dropdown">
      {onSaleProducts.length > 0 ? (
        onSaleProducts.map((product) => (
          <div key={product.id} className="onsale-item">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="sale-price">${product.price}</div>
            {/* View Product Button */}
            <button onClick={() => navigate(`/product/${product.id}`)}>View Product</button>
          </div>
        ))
      ) : (
        <div className="no-sale-items">No items on sale right now</div>
      )}
    </div>
  );
};

export default OnSaleDropdown;







