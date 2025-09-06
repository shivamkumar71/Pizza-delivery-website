import React, { useEffect, useState } from 'react';
import './AdminOrders.css';

const API_BASE_URL = 'http://192.168.56.1:5000/api'; // Use your backend IP

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
    // Implement status update API call here
    // For now, just update locally
    setOrders(orders => orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
  };

  if (loading) return <div className="admin-orders">Loading orders...</div>;
  if (error) return <div className="admin-orders error">{error}</div>;

  return (
    <div className="admin-orders">
      <h2>Manage Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user}</td>
              <td>
                {order.items.map((item, idx) => (
                  <div key={idx}>{item.name} ({item.size}) x{item.quantity}</div>
                ))}
              </td>
              <td>₹{order.total}</td>
              <td>{order.status}</td>
              <td>
                <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
