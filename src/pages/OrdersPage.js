import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { getDatabase, ref, get } from 'firebase/database';  // Importing from Firebase Database module
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { translations } from '../context/translations'; // Import translation context
import './OrdersPage.css';

const OrdersPage = () => {
  const { currentUser } = useUser();
  const { translations, language } = translations(); // Access translations and current language
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);  // Adding loading state
  const [error, setError] = useState('');  // Adding error state

  useEffect(() => {
    const db = getDatabase();  // Initialize the database using getDatabase()

    // Fetch orders
    const ordersRef = ref(db, 'orders');  // Refers to 'orders' in your Firebase Realtime Database
    get(ordersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const userOrders = Object.entries(ordersData)
          .filter(([_, order]) => order.userEmail === currentUser.email)
          .map(([orderId, order]) => ({ orderId, ...order })); // Include orderId in the order object

        setOrders(userOrders);
      } else {
        setError(translations[language].genericError);
      }
      setLoading(false);  // Set loading to false after data is fetched
    }).catch(err => {
      setError(translations[language].genericError);
      setLoading(false);
    });
  }, [currentUser, language, translations]);

  const handleCancelOrder = async (orderId) => {
    try {
      // Make a request to cancel the order using DELETE
      const response = await fetch(`http://localhost:5000/api/cancel-order/${orderId}`, {
        method: 'DELETE', // Changed to DELETE for canceling the order
      });
  
      if (!response.ok) {
        throw new Error(translations[language].genericError);
      }
  
      // Update local state to remove the canceled order
      const updatedOrders = orders.filter(order => order.orderId !== orderId);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error canceling order:', error);
      // Optionally show an error message to the user
    }
  };
  
  return (
    <div className="orderspage-container">
      <Navbar />
      <h1 className="orderspage-title">{translations[language].yourOrders}</h1>
      {loading && <p className="loading-message">{translations[language].loadingOrders}</p>}  {/* Loading state */}
      {error && <p className="error-message">{error}</p>}  {/* Error state */}
      {orders.length > 0 ? (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.orderId} className="order-item">
              <h3 className="order-status">{translations[language].orderStatus}: {order.status}</h3>
              <h3 className="order-id">{translations[language].orderId}: {order.orderId}</h3> {/* Display the order ID */}
              <ul className="order-items">
                {(order.cartItems || []).map((item, idx) => (  // Added fallback for cartItems
                  <li key={idx} className="order-item-name">
                    {item.name} ({item.quantity}) {/* Display actual item name and quantity */}
                  </li>
                ))}
              </ul>
              <button
                className="order-cancel-button"
                onClick={() => handleCancelOrder(order.orderId)} // Use orderId for cancellation
              >
                {translations[language].cancelOrder}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-orders-message">{translations[language].noOrders}</p>
      )}
      <Footer />
    </div>
  );
};

export default OrdersPage;












