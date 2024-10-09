import React, { useContext } from 'react';
import { CartContext } from '../CartContext';
import Navbar from '../components/Navbar'; // Import the Navbar
import './CheckoutPage.css';

function CheckoutPage() {
  const { cartItems } = useContext(CartContext);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <Navbar /> {/* Add Navbar here */}
        <h1>Your cart is empty.</h1>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <Navbar /> {/* Add Navbar here */}
      <h1>Checkout</h1>
      <ul className="checkout-items">
        {cartItems.map(item => (
          <li key={item.id}>
            <span>{item.name}</span> - <strong>${item.price.toFixed(2)}</strong>
          </li>
        ))}
      </ul>
      <button className="finalize-order-button">Finalize Order</button>
      {/* Display total price */}
      <div className="total-price">
        Total Price: <strong>${totalPrice.toFixed(2)}</strong>
      </div>
    </div>
  );
}

export default CheckoutPage;




