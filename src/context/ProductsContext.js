import { createContext, useContext, useState, useEffect } from 'react';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children, kitchenwareProducts = [], toyProducts = [] }) => {
  const [onSaleProducts, setOnSaleProducts] = useState([]);

  // Filter products that are "onSale" and apply the sale price
  const getOnSaleProducts = (products) => {
    return products.map(product => ({
      ...product,
      price: product.onSale ? product.salePrice : product.price, // Use salePrice if on sale
    }));
  };

  useEffect(() => {
    const combinedProducts = [
      ...kitchenwareProducts,
      ...toyProducts
    ];

    setOnSaleProducts(getOnSaleProducts(combinedProducts));
  }, [kitchenwareProducts, toyProducts]);

  return (
    <ProductsContext.Provider value={{ onSaleProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};










