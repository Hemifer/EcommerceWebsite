// src/App.js
import './App.css';
import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import KitchenwarePage from './pages/KitchenwarePage';
import ToysPage from './pages/ToysPage';
import ProductDetail from './pages/ProductDetail';
import { CartProvider, CartContext } from './CartContext';
import { UserProvider } from './context/UserContext';
import Footer from './components/Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [showFooter, setShowFooter] = useState(false);
  const { loadCart, setCartItems } = useContext(CartContext);

  useEffect(() => {
    const handleScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50; // Adding a small offset
      setShowFooter(atBottom);
    };
  
    // Check if the document is already scrolled down enough to show footer
    handleScroll(); 
  
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user.uid); // Debugging log
        loadCart(); // Load cart items for authenticated user
      } else {
        console.log("User is not authenticated"); // Debugging log
        setCartItems([]); // Clear cart when user signs out
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [loadCart, setCartItems]); // Added setCartItems as a dependency

  return (
    <UserProvider>
      <CartProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/kitchenware" element={<KitchenwarePage />} />
            <Route path="/toys" element={<ToysPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Routes>
          {showFooter && <Footer />} {/* Show footer only if at bottom */}
        </div>
      </CartProvider>
    </UserProvider>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}


























