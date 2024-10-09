import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, set, get } from 'firebase/database';
import { auth } from './firebase';

export const CartContext = createContext({
  cartItems: [],
  loadCart: () => {},
  setCartItems: () => {},
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  const loadCart = async (userId) => {
    if (userId) {
      const cartRef = ref(db, `carts/${userId}`);
      const cartSnap = await get(cartRef);
      if (cartSnap.exists()) {
        setCartItems(cartSnap.val().items || []);
        console.log("Cart loaded:", cartSnap.val().items); // Log successful load
      } else {
        console.log("No cart found for user."); // Log if no cart found
      }
    } else {
      console.log("User is not authenticated."); // Log if user is not authenticated
    }
  };

  useEffect(() => {
    // Use auth.onAuthStateChanged to ensure we have the latest user state
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log("Authenticated user found:", user.uid); // Log authenticated user
        loadCart(user.uid); // Pass the user ID to load the cart
      } else {
        console.log("No authenticated user found."); // Log if no authenticated user found
        setCartItems([]); // Clear cart if user is not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (userId) {
        const cartRef = ref(db, `carts/${userId}`);
        await set(cartRef, { items: cartItems });
        console.log("Cart saved:", cartItems); // Log saved cart
      }
    };

    saveCart();
  }, [cartItems]);

  const addToCart = (product) => {
    const productExists = cartItems.find(item => item.id === product.id);
    if (!productExists) {
      setCartItems((prevItems) => [...prevItems, product]);
    } else {
      console.log("Product is already in the cart");
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getCartCount, loadCart, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};












