import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>🍕 Admin Panel</h1>
      <div className="admin-links">
        <Link to="/admin/orders" className="admin-link">Manage Orders</Link>
        {/* Add more links for delivery, users, analytics, etc. */}
      </div>
    </div>
  );
};

export default AdminDashboard;
