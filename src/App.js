import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProductsProvider } from './context/ProductsContext';
import WishlistProvider from './context/WishlistContext';
import { OnSaleProvider } from './context/OnSaleContext'; // Import OnSaleProvider

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
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);

  // Update footer visibility based on routes
  useEffect(() => {
    const footerHiddenRoutes = ['/login', '/signup'];
    setShowFooter(!footerHiddenRoutes.includes(location.pathname));
  }, [location.pathname]);

  // Listen for Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user ? `User: ${user.uid}` : 'No user signed in');
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="app-container">
      {/* Navbar remains consistent across all pages */}
      <Navbar />
      {/* Define application routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/kitchenware" element={<KitchenwarePage />} />
        <Route path="/toys" element={<ToysPage />} />
        <Route path="/product/:id" element={<ProductDetail />} /> {/* Product detail route */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
      {/* Conditionally render footer */}
      {showFooter && <Footer />}
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      {/* Wrap the app with necessary context providers */}
      <LanguageProvider>
        <UserProvider>
          <CartProvider>
            <ProductsProvider>
              <WishlistProvider>
                <OnSaleProvider> {/* Wrap with OnSaleProvider */}
                  <App />
                </OnSaleProvider>
              </WishlistProvider>
            </ProductsProvider>
          </CartProvider>
        </UserProvider>
      </LanguageProvider>
    </Router>
  );
}






































