import { createContext, useContext, useState, useEffect } from 'react';

const ProductsContext = createContext();
export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
  const [onSaleProducts, setOnSaleProducts] = useState([]);

  useEffect(() => {
    const fetchOnSaleProducts = async () => {
      const dbRef = ref(db, 'products'); // Use 'products' path in Realtime Database
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const products = [];
        const data = snapshot.val(); // Get the value from the snapshot
        // Loop through the data and filter products that are on sale
        for (const id in data) {
          const product = data[id];
          if (product.onSale) {
            products.push({ id, ...product });
          }
        }
        setOnSaleProducts(products);
      } else {
        console.log("No products available");
      }
    };

    fetchOnSaleProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ onSaleProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};


