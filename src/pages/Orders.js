import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTruck, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Orders.css';
import { useOrders } from '../context/OrderContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orders, fetchOrders } = useOrders();
  const [cancelling, setCancelling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [user, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'preparing':
        return <FaClock className="status-icon preparing" />;
      case 'out_for_delivery':
        return <FaTruck className="status-icon delivering" />;
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Processing';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing':
        return '#fdcb6e';
      case 'out_for_delivery':
        return '#74b9ff';
      case 'delivered':
        return '#00b894';
      default:
        return '#ddd';
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="container">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="page-title"
          >
            My Orders
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="page-subtitle"
          >
            Track your pizza orders and view order history
          </motion.p>
        </div>
      </div>

      <div className="container">
        {orders.length === 0 ? (
          <motion.div
            className="no-orders"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="no-orders-icon">📋</div>
            <h2>No orders yet</h2>
            <p>Start ordering delicious pizzas to see your order history here!</p>
          </motion.div>
        ) : (
          <motion.div
            className="orders-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="order-card card-hover"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">{
                      new Date(order.createdAt || order.orderDate || order.date).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })
                    }</p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span style={{ color: getStatusColor(order.status) }}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Order Items:</h4>
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="order-item">
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-size">({item.size})</span>
                        <span className="item-quantity">x{item.quantity}</span>
                      </div>
                      <span className="item-price">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{order.total}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Fee:</span>
                    <span>₹{order.total > 500 ? 0 : 50}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{order.total > 500 ? order.total : order.total + 50}</span>
                  </div>
                </div>

                <div className="delivery-details">
                  <div className="delivery-info">
                    <h4>
                      <FaMapMarkerAlt />
                      Delivery Address
                    </h4>
                    <p>{order.deliveryAddress}</p>
                  </div>
                  
                  <div className="delivery-info">
                    <h4>
                      <FaClock />
                      Delivery Time
                    </h4>
                    <p>Estimated: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    }) : 'Calculating...'}</p>
                    <p>Duration: 30-45 minutes</p>
                  </div>

                  {order.deliveryBoy?.phone && (
                    <div className="delivery-info">
                      <h4>
                        <FaPhone />
                        Delivery Boy
                      </h4>
                      <p>
                        Name: {order.deliveryBoy.name || 'N/A'}<br />
                        Phone: <a href={`tel:${order.deliveryBoy.phone}`}>{order.deliveryBoy.phone}</a>
                      </p>
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  {order.status === 'delivered' && (
                    <>
                      <button className="btn btn-secondary">Reorder</button>
                      <button className="btn">Rate Order</button>
                    </>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      className="btn btn-danger"
                      onClick={() => setCancelling(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.status === 'cancelled' && (
                    <div className="cancelled-label" style={{ color: 'red', marginTop: 8 }}>
                      Cancelled{order.cancelReason ? `: ${order.cancelReason}` : ''}
                    </div>
                  )}
      {/* Cancel Order Modal */}
      {cancelling && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cancel Order</h3>
            <p>Please provide a reason for cancellation:</p>
            <textarea id="cancel-reason" rows="3" style={{ width: '100%' }}></textarea>
            <div style={{ marginTop: 12 }}>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  const reason = document.getElementById('cancel-reason').value;
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`https://anshu-pizza-waale.onrender.com/api/orders/${cancelling}/cancel`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                      },
                      body: JSON.stringify({ reason })
                    });
                    if (res.ok) {
                      toast.success('Order cancelled');
                      setCancelling(null);
                      fetchOrders();
                    } else {
                      toast.error('Failed to cancel order');
                    }
                  } catch {
                    toast.error('Failed to cancel order');
                  }
                }}
              >
                Confirm Cancel
              </button>
              <button className="btn" onClick={() => setCancelling(null)} style={{ marginLeft: 8 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;
