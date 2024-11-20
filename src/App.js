import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; // This import remains the same
import { auth } from './firebase';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext'; // Import the LanguageProvider
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

function App() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user.uid);
      } else {
        console.log("User is not authenticated");
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, []);

  return (
    <div className="app-container">
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

export default function WrappedApp() {
  return (
    <Router>
      <LanguageProvider>  {/* Wrap the app with the LanguageProvider */}
        <UserProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UserProvider>
      </LanguageProvider>
    </Router>
  );
}

































