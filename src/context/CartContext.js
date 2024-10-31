import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase'; // Ensure your Firebase database is imported
import { useUser } from './UserContext'; // Import your UserContext
import { ref, onValue, remove, get, set } from 'firebase/database'; // Importing necessary functions

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    console.log("Using CartContext from src/context/CartContext.js");
    const { currentUser } = useUser();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const cartRef = currentUser ? ref(db, `users/${currentUser.uid}/cart/items`) : null;

        if (cartRef) {
            console.log("Cart Reference Path:", cartRef.toString()); // Log the reference path

            const unsubscribe = onValue(cartRef, (snapshot) => {
                const data = snapshot.val();
                console.log("Fetched cart data:", data); // Log fetched data
                setCartItems(data ? Object.values(data) : []); // Set cart items
            });

            // Cleanup function to unsubscribe from the listener
            return () => {
                console.log("Cleaning up cart listener.");
                unsubscribe();
            };
        }
    }, [currentUser]); // Run this effect when currentUser changes

    // Function to load cart items (currently just fetches them)
    const loadCart = () => {
        if (currentUser) {
            console.log("Loading cart...");
            const cartRef = ref(db, `users/${currentUser.uid}/cart/items`);
            get(cartRef)
                .then((snapshot) => {
                    const data = snapshot.val();
                    console.log("Fetched cart data:", data); // Log fetched data
                    setCartItems(data ? Object.values(data) : []); // Set cart items
                })
                .catch((error) => {
                    console.error("Error loading cart:", error);
                });
        }
    };

    const getCartCount = () => cartItems.length;

    const addToCart = (item) => {
        if (!currentUser) return;
    
        const itemInCart = cartItems.find(cartItem => cartItem.id === item.id);
    
        if (itemInCart) {
            console.log("Item already in cart, updating quantity:", item);
            const itemRef = ref(db, `users/${currentUser.uid}/cart/items/${item.id}`);
            const updatedItem = {
                ...itemInCart,
                quantity: (itemInCart.quantity || 1) + 1 // Increase quantity
            };
            set(itemRef, updatedItem) // Update the item in the database
                .then(() => {
                    setCartItems(prevItems => prevItems.map(cartItem => 
                        cartItem.id === item.id ? updatedItem : cartItem
                    )); // Update local state
                })
                .catch((error) => {
                    console.error("Error updating item quantity:", error);
                });
            return; 
        }
    
        const cartRef = ref(db, `users/${currentUser.uid}/cart/items/${item.id}`);
        set(cartRef, { ...item, quantity: 1 }) // Set the item in the database with initial quantity
            .then(() => {
                setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]); // Update local state
                console.log("Item added to cart:", item);
            })
            .catch((error) => {
                console.error("Error adding item to cart:", error);
            });
    };

    const removeFromCart = (itemId) => {
        if (!currentUser) return;

        const itemRef = ref(db, `users/${currentUser.uid}/cart/items`);
        get(itemRef).then((snapshot) => {
            if (snapshot.exists()) {
                const items = snapshot.val();
                const itemIndex = Object.keys(items).find(index => items[index].id === itemId);

                if (itemIndex) {
                    const specificItemRef = ref(db, `users/${currentUser.uid}/cart/items/${itemIndex}`);
                    remove(specificItemRef)
                        .then(() => {
                            setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
                        })
                        .catch(error => {
                            console.error("Error removing item:", error);
                        });
                } else {
                    console.error("Item not found in cart");
                }
            } else {
                console.error("No items found in cart");
            }
        }).catch(error => {
            console.error("Error fetching items:", error);
        });
    };

    // Function to clear cart after payment
    const clearCart = () => {
        if (!currentUser) return;

        const cartItemsRef = ref(db, `users/${currentUser.uid}/cart/items`);

        // Clear the cart by setting the 'items' node to an empty object
        set(cartItemsRef, {})
            .then(() => {
                setCartItems([]); // Clear the cart items in the local state as well
                console.log('Cart has been cleared after payment.');
            })
            .catch((error) => {
                console.error('Error clearing cart:', error);
            });
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, loadCart, addToCart, getCartCount, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the CartContext
export const useCart = () => useContext(CartContext);









