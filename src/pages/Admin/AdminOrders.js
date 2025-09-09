import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaClock, FaTruck, FaSyncAlt } from 'react-icons/fa';
import './AdminOrders.css';

const API_BASE_URL = 'https://anshu-pizza-waale.onrender.com/api'; // Production backend URL

const statusOptions = [
  { value: 'preparing', label: 'Preparing', icon: <FaClock /> },
  { value: 'out_for_delivery', label: 'Out for Delivery', icon: <FaTruck /> },
  { value: 'delivered', label: 'Delivered', icon: <FaCheckCircle /> },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/orders`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch orders');
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders => orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      }
    } catch (err) {
      // Optionally show error
    }
  };

  if (loading) return <div className="admin-orders">Loading orders...</div>;
  if (error) return <div className="admin-orders error">{error}</div>;

  return (
    <div className="admin-orders">
      <h2>Manage Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>User</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Change Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.orderNumber || order._id.slice(-5)}</td>
              <td>{order.userDetails?.name || 'N/A'}</td>
              <td>
                {order.items.map((item, idx) => (
                  <div key={idx}>{item.name} ({item.size}) x{item.quantity}</div>
                ))}
              </td>
              <td>₹{order.total}</td>
              <td>
                {statusOptions.find(opt => opt.value === order.status)?.icon}
                {order.status}
              </td>
              <td>
                <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}>
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button className="admin-orders-update-btn">
                  <FaSyncAlt /> Update
                </button>
              </td>
              <td>{order.createdAtIST || new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
