// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import { kitchenwareProducts } from './KitchenwarePage'; // Import the product list
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './HomePage.css';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(kitchenwareProducts.slice(0, 8)); // Default to first 8 products

  const navigate = useNavigate(); // Use navigate

  
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
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
      const filtered = kitchenwareProducts.filter(product => 
        product.name.toLowerCase().includes(searchValue)
      ).slice(0, 8); // Keep it to 8 results max
      setFilteredProducts(filtered);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };


  return (
    <div className="homepage-background"> {/* Add this class */}
     <Navbar isLoggedIn={isLoggedIn} cartItems={cartItems} removeFromCart={removeFromCart} />
      <h1 className="homepage-header">Welcome to HemiMerce</h1>
      <p className="homepage-secondtext">Explore our wide range of Products through the Products tab.</p>

      {/* Search bar */}
      <input 
        type="text" 
        value={searchTerm} 
        onChange={handleSearch} 
        placeholder="Search for products..." 
        className="searchBar"
      />

      {/* Display filtered products */}
      <div className="productResults">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="productCard" onClick={() => navigate(`/products/${product.id}`)}>
              <img src={product.image} alt={product.name} style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
              <h3>{product.name}</h3>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;














