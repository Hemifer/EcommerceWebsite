import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { getDatabase, ref, get } from 'firebase/database';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './OrdersPage.css';

const OrdersPage = () => {
  const { currentUser } = useUser();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    
    // Fetch orders
    const ordersRef = ref(db, 'orders');
    get(ordersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const userOrders = Object.entries(ordersData)
          .filter(([_, order]) => order.userEmail === currentUser.email)
          .map(([orderId, order]) => ({ orderId, ...order })); // Include orderId in the order object

        setOrders(userOrders);
      }
    });
  }, [currentUser]);

  const handleCancelOrder = async (orderId) => {
    try {
      // Make a request to your backend to cancel the order
      const response = await fetch(`http://localhost:5000/api/cancel-order/${orderId}`, {
        method: 'GET', // Use GET since you are fetching the cancellation
      });
  
      if (!response.ok) {
        throw new Error('Failed to cancel the order');
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
      <h1 className="orderspage-title">Your Orders</h1>
      {orders.length > 0 ? (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.orderId} className="order-item">
              <h3 className="order-status">Status: {order.status}</h3>
              <h3 className="order-id">{order.orderId}</h3> {/* Display the order ID */}
              <ul className="order-items">
                {order.cartItems.map((item, idx) => (
                  <li key={idx} className="order-item-name">
                    {item.name} (x{item.quantity}) {/* Display actual item name and quantity */}
                  </li>
                ))}
              </ul>
              <button
                className="order-cancel-button"
                onClick={() => handleCancelOrder(order.orderId)} // Use orderId for cancellation
              >
                Cancel Order
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-orders-message">You have no orders.</p>
      )}
      <Footer />
    </div>
  );
};

export default OrdersPage;









