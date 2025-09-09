import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from './AdminApp';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAdmin } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Replace with real API call
    if (email === 'admin@anshupizza.com' && password === 'admin123') {
      setAdmin({ email });
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {error && <div className="admin-error">{error}</div>}
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
