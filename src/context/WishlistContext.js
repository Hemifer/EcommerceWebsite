import React, { createContext, useContext, useState, useEffect } from 'react';

// Create WishlistContext
const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

const WishlistProvider = ({ children }) => {
  // Fetch wishlist from localStorage or initialize as an empty array
  const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const [wishlistItems, setWishlistItems] = useState(storedWishlist);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (item) => {
    setWishlistItems((prevItems) => {
      // Avoid adding duplicates
      if (!prevItems.some((existingItem) => existingItem.id === item.id)) {
        return [...prevItems, item];
      }
      return prevItems;
    });
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;


  
