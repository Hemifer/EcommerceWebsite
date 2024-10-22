import React, { useContext, useState } from 'react';
import { CartContext } from '../CartContext';
import { loadStripe } from '@stripe/stripe-js';
import NavBar from '../components/Navbar';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutPage.css';

const stripePromise = loadStripe('pk_test_51Q2fPBRqC36KgL0FILN6uZLGFXCOgF7Wtf2NfehVGybcqk1lj4o4uI3aUBNYbqqByqvHdsfNRlXgoMLXhsRkFIuw006IciA3aj');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false); // State to show thank you message
  const [quantities, setQuantities] = useState(() => 
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const handleQuantityChange = (itemId, amount) => {
    setQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[itemId] || 1) + amount;

      if (newQuantity <= 0) {
        if (window.confirm('Delete item?')) {
          removeFromCart(itemId);
          return prevQuantities;
        }
      } else if (newQuantity <= 8) {
        return { ...prevQuantities, [itemId]: newQuantity };
      }
      return prevQuantities;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      return; 
    }

    try {
      const response = await fetch('http://localhost:5000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          cartItems: cartItems.map((item) => ({
            ...item,
            quantity: quantities[item.id] || 1,
          })),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const paymentResult = await response.json();
      if (paymentResult.error) {
        setErrorMessage(paymentResult.error);
      } else {
        setShowThankYouMessage(true); // Show thank you message on success
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
};

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (quantities[item.id] || 1),
    0
  );

  return (
    <div className={showThankYouMessage ? 'checkout-page blur-background' : 'checkout-page'}>
      <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Your Cart</h2>
        <ul className="checkout-items">
          {cartItems.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span> - <strong>${item.price.toFixed(2)}</strong>
              <div className="quantity-controls">
                <button type="button" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                <span>Quantity: {quantities[item.id] || 1}</span>
                <button type="button" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="total-price">Total Price: <strong>${totalPrice.toFixed(2)}</strong></div>
        <CardElement className="card-element" />
        <button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>

      {/* Modal for Thank You message */}
      {showThankYouMessage && (
        <div className="payment-overlay">
          <div className="thank-you-modal">
            <h2>Thank you for shopping with Hemimerce!</h2>
            <p>Would you like to continue browsing our store or select further products?</p>
            <div className="button-container">
              <button onClick={() => window.location.href = '/'}>Back to Home</button>
              <button onClick={() => window.location.href = '/products'}>Back to Products</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutPage() {
  return (
    <div className="checkout-container">
      <NavBar />
      <h1>Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default CheckoutPage;

