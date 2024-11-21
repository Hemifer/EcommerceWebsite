import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext'; // Corrected import
import { getDatabase, ref, get } from 'firebase/database';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { translations } from '../context/translations';
import './OrdersPage.css';

const OrdersPage = () => {
  const { currentUser } = useUser();
  const { language } = useLanguage(); // Use LanguageContext to get current language
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const db = getDatabase();

    // Fetch orders
    const ordersRef = ref(db, 'orders');
    get(ordersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const ordersData = snapshot.val();
          const userOrders = Object.entries(ordersData)
            .filter(([_, order]) => order.userEmail === currentUser?.email)
            .map(([orderId, order]) => ({ orderId, ...order }));

          setOrders(userOrders);
        } else {
          setError(translations[language].genericError);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(translations[language].genericError);
        setLoading(false);
      });
  }, [currentUser, language]);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cancel-order/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(translations[language].genericError);
      }

      const updatedOrders = orders.filter((order) => order.orderId !== orderId);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  return (
    <div className="orderspage-container">
      <Navbar />
      <h1 className="orderspage-title">{translations[language].yourOrders}</h1>
      {loading && <p className="loading-message">{translations[language].loadingOrders}</p>}
      {error && <p className="error-message">{error}</p>}
      {orders.length > 0 ? (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.orderId} className="order-item">
              <h3 className="order-status">{translations[language].orderStatus}: {order.status}</h3>
              <h3 className="order-id">{translations[language].orderId}: {order.orderId}</h3>
              <ul className="order-items">
                {(order.cartItems || []).map((item, idx) => (
                  <li key={idx} className="order-item-name">
                    {item.name} ({item.quantity})
                  </li>
                ))}
              </ul>
              <button
                className="order-cancel-button"
                onClick={() => handleCancelOrder(order.orderId)}
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













