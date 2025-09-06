import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('anshuPizzaUser');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token = null) => {
    setUser(userData);
    localStorage.setItem('anshuPizzaUser', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('anshuPizzaUser');
    localStorage.removeItem('token');
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await authAPI.updateProfile(updatedData);
      const newUserData = { ...user, ...response.user };
      setUser(newUserData);
      localStorage.setItem('anshuPizzaUser', JSON.stringify(newUserData));
      toast.success('Profile updated successfully');
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      login(response.user, response.token);
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      login(response.user, response.token);
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    registerUser,
    loginUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
