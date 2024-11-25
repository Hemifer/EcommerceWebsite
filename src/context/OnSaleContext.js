import React, { createContext, useContext, useState, useEffect } from 'react';
import { kitchenwareProducts } from '../pages/KitchenwarePage'; // Import kitchenwareProducts
import { toyProducts } from '../pages/ToysPage'; // Import toyProducts

const OnSaleContext = createContext();

export function useOnSale() {
  return useContext(OnSaleContext);
}

export function OnSaleProvider({ children }) {
  const [onSaleVisible, setOnSaleVisible] = useState(false);
  const [onSaleProduct, setOnSaleProduct] = useState(null); // Store the single selected product

  useEffect(() => {
    const allProducts = [...kitchenwareProducts, ...toyProducts]; // Combine both product lists

    // Find the product with a specific id
    const selectedProduct = allProducts.find((product) => product.id === '1') || allProducts[0]; // Fallback to the first product

    if (selectedProduct) {
      const discountRate = 0.2; // 20% discount
      const discountedPrice = parseFloat((selectedProduct.price * (1 - discountRate)).toFixed(2)); // Ensure it's a float

      setOnSaleProduct({
        ...selectedProduct,
        discountedPrice, // Discounted price added
        onSale: true,    // Mark product as on sale
      });
    }
  }, []); // Runs once on mount

  const toggleOnSale = () => setOnSaleVisible((prev) => !prev);
  const closeOnSale = () => setOnSaleVisible(false);

  return (
    <OnSaleContext.Provider value={{ onSaleVisible, toggleOnSale, closeOnSale, onSaleProduct }}>
      {children}
    </OnSaleContext.Provider>
  );
}









