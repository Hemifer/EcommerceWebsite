// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import { kitchenwareProducts } from './KitchenwarePage'; // Import the product list
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useCart } from '../context/CartContext'; // Import CartContext
import './HomePage.css';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(kitchenwareProducts.slice(0, 8)); // Default to first 8 products

  const navigate = useNavigate(); // Use navigate
  const { removeFromCart } = useCart(); // Access remove function

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    if (searchValue === '') {
      setFilteredProducts(kitchenwareProducts.slice(0, 8)); // Reset to first 8 products
    } else {
      setFilteredProducts(kitchenwareProducts.filter(product => 
        product.name.toLowerCase().includes(searchValue) // Filter based on search term
      ));
    }
  };

  return (
    <div className="homepage-background">
      <Navbar />
      <h1 className="homepage-header">Welcome to HemiMerce!</h1>
      <p className="homepage-secondtext">
        Discover our wide range of kitchenware products that elevate your cooking experience!
      </p>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search for products..."
        className="searchBar"
      />
      <div className="productResults">
        {filteredProducts.map(product => (
          <button 
            key={product.id} 
            className="productCard" 
            onClick={() => navigate(`/products/${product.id}`)} // Navigate to product details on card click
          >
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;




