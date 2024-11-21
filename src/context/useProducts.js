// src/context/useProducts.js
import { useState, useEffect } from 'react';
import { db } from '../firebase'; // Assuming you're fetching products from Firebase

const useProducts = () => {
    const [onSaleProducts, setOnSaleProducts] = useState([]);
  
    useEffect(() => {
      // Hardcoded products (IDs 1-4 for now)
      const allProducts = [
        { id: 1, name: 'Product 1', description: 'Description 1', price: 10 },
        { id: 2, name: 'Product 2', description: 'Description 2', price: 15 },
        { id: 3, name: 'Product 3', description: 'Description 3', price: 20 },
        { id: 4, name: 'Product 4', description: 'Description 4', price: 25 }
      ];
  
      // Select a random product to be "on sale"
      const randomIndex = Math.floor(Math.random() * allProducts.length);
      setOnSaleProducts([allProducts[randomIndex]]);
    }, []); // Empty dependency array ensures this runs only once when the component mounts
  
    return { onSaleProducts };
  };

export default useProducts;

