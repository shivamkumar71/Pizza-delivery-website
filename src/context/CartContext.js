import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Load user-specific cart from localStorage
    if (user?.id) {
      const savedCart = localStorage.getItem(`anshuPizzaCart_${user.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [user]);



  useEffect(() => {
    // Save user-specific cart to localStorage whenever it changes
    if (user?.id) {
      localStorage.setItem(`anshuPizzaCart_${user.id}`, JSON.stringify(cart));
    }
    
    // Calculate total
    const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cart, user]);

  const addToCart = (pizza, size = 'medium', quantity = 1) => {
    const existingItem = cart.find(item => 
      item.id === pizza.id && item.size === size
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === pizza.id && item.size === size
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const price = size === 'small' ? pizza.price * 0.8 : 
                   size === 'large' ? pizza.price * 1.3 : pizza.price;
      
      setCart([...cart, {
        ...pizza,
        size,
        quantity,
        price: Math.round(price)
      }]);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeFromCart(index);
    } else {
      setCart(cart.map((item, i) =>
        i === index ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
    if (user?.id) {
      localStorage.setItem(`anshuPizzaCart_${user.id}`, JSON.stringify([]));
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cart,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
