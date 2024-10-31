import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import NavBar from '../components/Navbar';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutPage.css';

// Make sure to replace with your real publishable key in production
const stripePromise = loadStripe('pk_test_51Q2fPBRqC36KgL0FILN6uZLGFXCOgF7Wtf2NfehVGybcqk1lj4o4uI3aUBNYbqqByqvHdsfNRlXgoMLXhsRkFIuw006IciA3aj');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [quantities, setQuantities] = useState(() =>
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isGift, setIsGift] = useState(false); // New state to track if it's a gift

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

    // Create payment method
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
      const userEmail = 'pistillityler@icloud.com'; // Replace with dynamic user email
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
          userEmail: userEmail,
          isGift: isGift, // Send gift status
          recipientName: isGift ? recipientName : null, // Send recipient name if it's a gift
          recipientEmail: isGift ? recipientEmail : null, // Send recipient email if it's a gift
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const paymentResult = await response.json();

      // Check for payment error or success
      if (paymentResult.error) {
        setErrorMessage(paymentResult.error);
      } else {
        setShowThankYouMessage(true); // Show thank you message on success
        clearCart(); // Clear the cart after successful payment
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
                <button type="button" onClick={() => handleQuantityChange(item.id, -1)} className="checkout-page-button">-</button>
                <span>Quantity: {quantities[item.id] || 1}</span>
                <button type="button" onClick={() => handleQuantityChange(item.id, 1)} className="checkout-page-button">+</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="total-price">Total Price: <strong>${totalPrice.toFixed(2)}</strong></div>

        {/* Gift option */}
        <div className="gift-option">
          <label>
            <input 
              type="checkbox" 
              checked={isGift} 
              onChange={() => setIsGift(!isGift)} 
            />
            Gift this order
          </label>
          {isGift && (
            <div>
              <input 
                type="text" 
                placeholder="Recipient's Name" 
                value={recipientName} 
                onChange={(e) => setRecipientName(e.target.value)} 
                required 
                className="gift-input"
              />
              <input 
                type="email" 
                placeholder="Recipient's Email" 
                value={recipientEmail} 
                onChange={(e) => setRecipientEmail(e.target.value)} 
                required 
                className="gift-input"
              />
            </div>
          )}
        </div>

        <CardElement className="card-element" />
        <button type="submit" disabled={!stripe || isProcessing} className="checkout-page-submit-button">
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>

      {showThankYouMessage && (
        <div className="checkout-page-overlay">
          <div className="checkout-page-thank-you-modal">
            <h2>Thank you for shopping with Hemimerce!</h2>
            <h4>Your order will be shipped within a week.</h4>
            <p>Would you like to continue browsing our store or find more products?</p>
            <div className="checkout-page-button-container">
              <button onClick={() => window.location.href = '/'} className="checkout-page-button">Back to Home</button>
              <button onClick={() => window.location.href = '/products'} className="checkout-page-button">Back to Products</button>
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
