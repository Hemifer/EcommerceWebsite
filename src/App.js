import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import ProductsProvider from './context/ProductsContext';
import WishlistProvider from './context/WishlistContext';  // Default import
  // Default import
 // Import WishlistProvider
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import KitchenwarePage from './pages/KitchenwarePage';
import ToysPage from './pages/ToysPage';
import ProductDetail from './pages/ProductDetail';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import Footer from './components/Footer';
import Navbar from './components/Navbar'; 


function App() {
  const location = useLocation(); // Hook to get the current location
  const [showFooter, setShowFooter] = useState(true); // Default to showing the footer

  // Determine if footer should be hidden based on the route
  useEffect(() => {
    const footerHiddenRoutes = ['/login', '/signup'];
    setShowFooter(!footerHiddenRoutes.includes(location.pathname));
  }, [location.pathname]);

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is authenticated:', user.uid);
      } else {
        console.log('User is not authenticated');
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, []);

  return (
    <div className="app-container">
      <Navbar /> {/* Add the Navbar to the app */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/kitchenware" element={<KitchenwarePage />} />
        <Route path="/toys" element={<ToysPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
      {showFooter && <Footer />} 
    </div>
  );
}

// Wrap App with necessary providers
export default function WrappedApp() {
  return (
    <Router>
      <LanguageProvider>
        <UserProvider>
          <CartProvider>
            <ProductsProvider> {/* Wrap the App with ProductsProvider */}
              <WishlistProvider> {/* Wrap with WishlistProvider */}
                <App />
              </WishlistProvider>
            </ProductsProvider>
          </CartProvider>
        </UserProvider>
      </LanguageProvider>
    </Router>
  );
}



































