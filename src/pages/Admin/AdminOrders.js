
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaClock, FaTruck, FaSyncAlt } from 'react-icons/fa';
import './AdminOrders.css';
import { orderAPI } from '../../utils/api';

const API_BASE_URL = 'https://anshu-pizza-waale.onrender.com/api';

const statusOptions = [
  { value: 'preparing', label: 'Preparing', icon: <FaClock /> },
  { value: 'out_for_delivery', label: 'Out for Delivery', icon: <FaTruck /> },
  { value: 'delivered', label: 'Delivered', icon: <FaCheckCircle /> },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [statusLoading, setStatusLoading] = useState({});
  const [assignLoading, setAssignLoading] = useState({});
  const [adminError, setAdminError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderAPI.getAll();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleStatusSelect = (orderId, newStatus) => {
    setStatusDrafts(drafts => ({ ...drafts, [orderId]: newStatus }));
  };

  const handleStatusUpdate = async (orderId) => {
    const newStatus = statusDrafts[orderId];
    if (!newStatus) return;
    setStatusLoading(l => ({ ...l, [orderId]: true }));
    setAdminError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(orders => orders.map(order => order._id === orderId ? updated : order));
        setStatusDrafts(drafts => { const d = { ...drafts }; delete d[orderId]; return d; });
      } else {
        const errData = await res.json().catch(() => ({}));
        setAdminError(errData.error || 'Failed to update status');
      }
    } catch (err) {
      setAdminError('Failed to update status');
    } finally {
      setStatusLoading(l => { const n = { ...l }; delete n[orderId]; return n; });
    }
  };

  if (loading) return <div className="admin-orders">Loading orders...</div>;
  if (error) return <div className="admin-orders error">{error}</div>;
  if (adminError) return <div className="admin-orders error">{adminError}</div>;

  return (
    <div className="admin-orders">
      <h2>Manage Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>User</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Items</th>
            <th>Total</th>
            <th>Delivery Boy</th>
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
              <td>{order.userDetails?.phone || 'N/A'}</td>
              <td>{order.userDetails?.address || 'N/A'}</td>
              <td>
                {Array.isArray(order.items) && order.items.map((item, idx) => (
                  <div key={idx}>{item.name} ({item.size}) x{item.quantity}</div>
                ))}
              </td>
              <td>₹{order.total}</td>
              <td>
                <div>
                  Name: {order.deliveryBoy?.name || 'N/A'}<br />
                  Phone: {order.deliveryBoy?.phone || 'N/A'}
                </div>
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    const form = e.target;
                    const name = form.deliveryBoyName.value;
                    const phone = form.deliveryBoyPhone.value;
                    setAssignLoading(l => ({ ...l, [order._id]: true }));
                    setAdminError(null);
                    try {
                      const token = localStorage.getItem('token');
                      const res = await fetch(`${API_BASE_URL}/orders/${order._id}/delivery-boy`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
                        body: JSON.stringify({ name, phone })
                      });
                      if (res.ok) {
                        const updated = await res.json();
                        setOrders(orders => orders.map(o => o._id === order._id ? updated : o));
                      } else {
                        const errData = await res.json().catch(() => ({}));
                        setAdminError(errData.error || 'Failed to assign delivery boy');
                      }
                    } catch {
                      setAdminError('Failed to assign delivery boy');
                    } finally {
                      setAssignLoading(l => { const n = { ...l }; delete n[order._id]; return n; });
                    }
                  }}
                  style={{ marginTop: 8 }}
                >
                  <input name="deliveryBoyName" placeholder="Name" defaultValue={order.deliveryBoy?.name || ''} style={{ width: 80, marginRight: 4 }} />
                  <input name="deliveryBoyPhone" placeholder="Phone" defaultValue={order.deliveryBoy?.phone || ''} style={{ width: 100, marginRight: 4 }} />
                  <button type="submit" style={{ fontSize: 12 }} disabled={assignLoading[order._id]}>Assign</button>
                </form>
              </td>
              <td>
                {statusOptions.find(opt => opt.value === order.status)?.icon}
                {order.status}
              </td>
              <td>
                <select
                  value={statusDrafts[order._id] || order.status}
                  onChange={e => handleStatusSelect(order._id, e.target.value)}
                  disabled={statusLoading[order._id]}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button
                  className="admin-orders-update-btn"
                  onClick={() => handleStatusUpdate(order._id)}
                  disabled={statusLoading[order._id] || !statusDrafts[order._id] || statusDrafts[order._id] === order.status}
                  title={!statusDrafts[order._id] || statusDrafts[order._id] === order.status ? 'No change' : 'Update status'}
                >
                  {statusLoading[order._id] ? 'Updating...' : <><FaSyncAlt /> Update</>}
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


