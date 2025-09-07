import React, { createContext, useContext, useState, useEffect } from 'react';
import { orderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData) => {
    try {
      setLoading(true);
      const newOrder = await orderAPI.create(orderData);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error('Failed to place order. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    console.log('deleteOrder called with:', orderId);
    try {
      const result = await orderAPI.delete(orderId);
      console.log('Order delete API result:', result);
      setOrders(prev => prev.filter(order => order._id !== orderId));
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Failed to delete order:', error);
      toast.error(error.message || 'Failed to delete order');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, []);

  // Clear orders when user logs out
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setOrders([]);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, deleteOrder, loading, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
