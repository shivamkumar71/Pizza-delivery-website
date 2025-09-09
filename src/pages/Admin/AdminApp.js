import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';

// Simple admin auth context (to be expanded)
export const AdminAuthContext = React.createContext();

const AdminApp = () => {
  const [admin, setAdmin] = React.useState(null);

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin }}>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={admin ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/orders" element={admin ? <AdminOrders /> : <Navigate to="/admin/login" />} />
        </Routes>
      </Router>
    </AdminAuthContext.Provider>
  );
};

export default AdminApp;
