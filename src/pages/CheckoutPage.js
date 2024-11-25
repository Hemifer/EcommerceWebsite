import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import NavBar from '../components/Navbar';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../context/translations';
import './CheckoutPage.css';

const stripePromise = loadStripe('pk_test_51Q2fPBRqC36KgL0FILN6uZLGFXCOgF7Wtf2NfehVGybcqk1lj4o4uI3aUBNYbqqByqvHdsfNRlXgoMLXhsRkFIuw006IciA3aj');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { language } = useLanguage(); // Get current language
  const t = translations[language]; // Translation helper
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [quantities, setQuantities] = useState(() =>
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isGift, setIsGift] = useState(false);

  const [isPaymentDelayed, setIsPaymentDelayed] = useState(false); // Track delayed payment
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleQuantityChange = (itemId, amount) => {
    setQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[itemId] || 1) + amount;
      if (newQuantity <= 0) {
        if (window.confirm(t.cartRemoveConfirm)) {
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
  
    const timeout = setTimeout(() => {
      setIsPaymentDelayed(true); // Show low connection message after 15 seconds
    }, 15000); // 15 seconds delay
  
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
  
    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      clearTimeout(timeout); // Clear timeout if payment fails early
      return;
    }
  
    try {
      const userEmail = 'pistillityler@icloud.com'; // Replace with actual user email
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
            price: item.price, // Pass the regular price, excluding sale price
          })),
          userEmail: userEmail,
          isGift: isGift,
          recipientName: isGift ? recipientName : null,
          recipientEmail: isGift ? recipientEmail : null,
          recipientAddress: isGift ? recipientAddress : null,
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
        setPaymentStatus('succeeded'); // Set payment status
        setShowThankYouMessage(true);
        clearCart();
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
      clearTimeout(timeout); // Clear timeout when process is completed
    }
  };

  // Calculate total price using regular price
  const totalPrice = cartItems.reduce(
    (total, item) => {
      const price = item.price;
      const quantity = quantities[item.id] || 1;
      return total + (price && quantity ? price * quantity : 0);
    },
    0
  );

  useEffect(() => {
    cartItems.forEach((item) => {
      console.log(`Cart Item: ${item.name}, Price: ${item.price}, Sale Price: ${item.salePrice}, On Sale: ${item.onSale}`);
    });
  }, [cartItems]);

  return (
    <div className={showThankYouMessage ? 'checkout-container blur-background' : 'checkout-container'}>
      <form onSubmit={handleSubmit} className="checkout-form">
        <h2>{t.yourCart}</h2>
        <ul className="checkout-items">
          {cartItems.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span> - 
              <strong>
                ${item.price.toFixed(2)} {/* Show regular price only */}
              </strong>
              <div className="quantity-controls">
                <button type="button" onClick={() => handleQuantityChange(item.id, -1)} className="checkout-page-button">-</button>
                <span>{t.quantity}: {quantities[item.id] || 1}</span>
                <button type="button" onClick={() => handleQuantityChange(item.id, 1)} className="checkout-page-button">+</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="total-price">{t.totalPrice}: <strong>${totalPrice.toFixed(2)}</strong></div>

        <div className="gift-option">
          <label>
            <input
              type="checkbox"
              checked={isGift}
              onChange={() => setIsGift(!isGift)}
            />
            {t.giftOrder}
          </label>
          {isGift && (
            <div>
              <input
                type="text"
                placeholder={t.recipientName}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
                className="gift-input"
              />
              <input
                type="email"
                placeholder={t.recipientEmail}
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
                className="gift-input"
              />
              <input
                type="address"
                placeholder={t.recipientAddress}
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                required
                className="gift-input"
              />
            </div>
          )}
        </div>

        <CardElement className="card-element" />
        <button type="submit" disabled={!stripe || isProcessing} className="checkout-page-submit-button">
          {isProcessing ? t.processing : t.payNow}
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>

      {isPaymentDelayed && !paymentStatus && (
        <div className="low-connection-message">
          <p>{t.lowConnectionMessage}</p>
        </div>
      )}

      {showThankYouMessage && (
        <div className="checkout-page-overlay">
          <div className="checkout-page-thank-you-modal">
            <h2>{t.thankYou}</h2>
            <h4>{t.shippingMessage}</h4>
            <p>{t.continueBrowsing}</p>
            <div className="checkout-page-button-container">
              <button onClick={() => window.location.href = '/'} className="checkout-page-button">{t.backToHome}</button>
              <button onClick={() => window.location.href = '/products'} className="checkout-page-button">{t.shopAgain}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutPage() {
  return (
    <div className="checkout-page-container">
      <NavBar />
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default CheckoutPage;








