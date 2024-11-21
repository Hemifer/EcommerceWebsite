import React, { createContext, useEffect, useState } from 'react';

export const ProductsContext = createContext();

const ProductsProvider = ({ children }) => {
  const [onSaleProducts, setOnSaleProducts] = useState([]);

  // Example hardcoded products
  const allProducts = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
    { id: 3, name: 'Product 3', price: 300 },
    { id: 4, name: 'Product 4', price: 400 },
  ];

  // Assign random products to "on sale"
  useEffect(() => {
    const saleCount = Math.floor(Math.random() * allProducts.length) + 1; // Random number of products on sale
    const saleProducts = [...allProducts]
      .sort(() => 0.5 - Math.random()) // Shuffle the array
      .slice(0, saleCount); // Pick random products
    setOnSaleProducts(saleProducts);
  }, []);

  return (
    <ProductsContext.Provider value={{ onSaleProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;





