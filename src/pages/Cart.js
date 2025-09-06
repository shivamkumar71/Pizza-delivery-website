import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Cart.css';
import { useOrders } from '../context/OrderContext';

const Cart = () => {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });
  const [useProfileAddress] = useState(true);
  const { addOrder } = useOrders();

  // Auto-fill delivery address from profile when user changes
  React.useEffect(() => {
    if (user && useProfileAddress) {
      setDeliveryAddress({
        address: user.address || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
        phone: user.phone || ''
      });
    }
  }, [user, useProfileAddress]);

  const handleDeliveryInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAddress = () => {
    // Update both local state and user profile
    updateProfile({
      address: deliveryAddress.address,
      city: deliveryAddress.city,
      zipCode: deliveryAddress.zipCode,
      phone: deliveryAddress.phone
    });
    
    setShowDeliveryForm(false);
    toast.success('Delivery address saved to profile!');
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(index, newQuantity);
    }
  };

  const handleCheckout = async () => {
      if (!user) {
        toast.error('You must be logged in to place an order.');
        navigate('/login');
        return;
      }

    // Get final delivery address
    const finalAddress = useProfileAddress && user ? {
      address: user.address || '',
      city: user.city || '',
      zipCode: user.zipCode || '',
      phone: user.phone || ''
    } : deliveryAddress;

    console.log('Final address:', finalAddress);
    console.log('User profile:', user);

    // Validate delivery address
    if (!finalAddress.address || !finalAddress.phone) {
      toast.error(`Missing: ${!finalAddress.address ? 'Address' : ''} ${!finalAddress.phone ? 'Phone' : ''}`);
      setShowDeliveryForm(true);
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      // Create order object for API with real IST time
  const now = new Date();
  const estimatedDelivery = new Date(now.getTime() + 45*60000);

  // Debug: log user object to check for user ID property
  console.log('User object before placing order:', user);

  console.log('Order time:', now.toISOString());
  console.log('Estimated delivery:', estimatedDelivery.toISOString());

  const orderData = {
        user: user._id, // Required by backend
        items: cart.map(item => ({
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        })),
        total: total > 500 ? total : total + 50,
        deliveryAddress: `${finalAddress.address}, ${finalAddress.city}, ${finalAddress.zipCode}`,
        orderDate: now.toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
        userDetails: {
          name: user.name,
          email: user.email,
          phone: finalAddress.phone,
          address: finalAddress.address
        }
      };
      
      await addOrder(orderData);
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <motion.div
            className="empty-cart"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any pizzas to your cart yet.</p>
            <Link to="/menu" className="btn btn-hover">
              Browse Menu
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <motion.div
          className="cart-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/menu" className="back-btn">
            <FaArrowLeft />
            Back to Menu
          </Link>
          <h1>Shopping Cart</h1>
          <p>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </motion.div>

        <div className="cart-content">
          <motion.div
            className="cart-items"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {cart.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.size}-${index}`}
                className="cart-item card-hover"
                variants={itemVariants}
                layout
              >
                <div className="item-image">
                  {item.image}
                  <span className="size-badge">{item.size}</span>
                </div>
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-description">
                    Size: {item.size} • {item.ingredients.join(', ')}
                  </p>
                  <div className="item-price">₹{item.price}</div>
                </div>

                <div className="item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(index, item.quantity - 1)}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(index, item.quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="item-total">
                  <span className="total-price">₹{item.price * item.quantity}</span>
                  <button
                    className="remove-btn"
                    onClick={() => {
                      removeFromCart(index);
                      toast.success('Item removed from cart');
                    }}
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="cart-summary"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{total}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>₹{total > 500 ? 0 : 50}</span>
              </div>
              
              {total > 500 && (
                <div className="summary-row discount">
                  <span>Free Delivery!</span>
                  <span>-₹50</span>
                </div>
              )}
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{total > 500 ? total : total + 50}</span>
              </div>

              <div className="delivery-info">
                <h4>Delivery Information</h4>
                <p>Estimated delivery time: 30-45 minutes</p>
                <p>Free delivery on orders above ₹500</p>
                
                <div className="delivery-address-section">
                  <div className="delivery-header">
                    <h5>
                      <FaMapMarkerAlt />
                      Delivery Address
                    </h5>
                    <button
                      className="edit-address-btn"
                      onClick={() => setShowDeliveryForm(!showDeliveryForm)}
                    >
                      <FaEdit />
                      {showDeliveryForm ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  
                  {!deliveryAddress.address && !showDeliveryForm && (
                    <div className="address-help">
                      <p>💡 <strong>Tip:</strong> Your delivery address will be automatically filled from your profile. 
                      You can edit it here or update it in your profile page.</p>
                    </div>
                  )}
                  
                  {!showDeliveryForm ? (
                    <div className="current-address">
                      {deliveryAddress.address ? (
                        <>
                          <p className="address-source">
                            <FaMapMarkerAlt />
                            Address from your profile
                            <span className="sync-indicator">✓ Auto-synced</span>
                          </p>
                          <p><strong>{deliveryAddress.address}</strong></p>
                          <p>{deliveryAddress.city}, {deliveryAddress.zipCode}</p>
                          <p>Phone: {deliveryAddress.phone}</p>
                        </>
                      ) : (
                        <p className="no-address">No delivery address set</p>
                      )}
                    </div>
                  ) : (
                    <div className="delivery-form">
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          name="address"
                          value={deliveryAddress.address}
                          onChange={handleDeliveryInputChange}
                          placeholder="Enter your delivery address"
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>City</label>
                          <input
                            type="text"
                            name="city"
                            value={deliveryAddress.city}
                            onChange={handleDeliveryInputChange}
                            placeholder="City"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>ZIP Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={deliveryAddress.zipCode}
                            onChange={handleDeliveryInputChange}
                            placeholder="ZIP Code"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={deliveryAddress.phone}
                          onChange={handleDeliveryInputChange}
                          placeholder="Phone number for delivery"
                          required
                        />
                      </div>
                      <button
                        className="save-address-btn"
                        onClick={handleSaveAddress}
                      >
                        Save Address
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Proceed to Checkout
                  </>
                )}
              </button>

              <div className="cart-actions">
                <button
                  className="clear-cart-btn"
                  onClick={() => {
                    clearCart();
                    toast.success('Cart cleared');
                  }}
                >
                  Clear Cart
                </button>
                <Link to="/menu" className="continue-shopping">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
