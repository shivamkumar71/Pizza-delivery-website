import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminRegister from './AdminRegister';

// Simple admin auth context (to be expanded)
export const AdminAuthContext = React.createContext();

const AdminApp = () => {
  const [admin, setAdmin] = React.useState(null);

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin }}>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="register" element={<AdminRegister />} />
        <Route path="dashboard" element={admin ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
        <Route path="orders" element={admin ? <AdminOrders /> : <Navigate to="/admin/login" />} />
      </Routes>
    </AdminAuthContext.Provider>
  );
};

export default AdminApp;
