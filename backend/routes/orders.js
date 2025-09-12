
import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authenticateToken, sanitizeInput } from '../middleware/auth.js';

const router = express.Router();

// Place a new order (protected route)
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Creating order for user:', req.user.id);
    console.log('Order data:', req.body);
    console.log('Estimated delivery from frontend:', req.body.estimatedDelivery);
    
    const body = req.body || {};
    let userDetails = {};
    
    // If user is logged in, get their details from database
    if (req.user?.id) {
      const user = await User.findById(req.user.id);
      if (user) {
        userDetails = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address
        };
      }
    }
    
    // Override with any details provided in request body
    if (body.userDetails) {
      userDetails = { ...userDetails, ...body.userDetails };
    }
    
    const sanitizedUserDetails = {
      name: sanitizeInput(userDetails.name || ''),
      email: sanitizeInput(userDetails.email || ''),
      phone: sanitizeInput(userDetails.phone || ''),
      address: sanitizeInput(userDetails.address || '')
    };
    
    // Get IST time (UTC + 5:30)
    const currentTime = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(currentTime.getTime() + istOffset);
    const estimatedDeliveryIST = new Date(istTime.getTime() + 45*60000);
    
    console.log('UTC Time:', currentTime.toISOString());
    console.log('IST Time (stored):', istTime.toISOString());
    console.log('IST Time (readable):', istTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.log('Estimated Delivery IST:', estimatedDeliveryIST.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    
    const orderData = {
      user: req.user.id,
      userDetails: sanitizedUserDetails,
      items: body.items || [],
      total: body.total || 0,
      deliveryAddress: sanitizeInput(body.deliveryAddress || ''),
      estimatedDelivery: estimatedDeliveryIST,
      status: 'preparing',
      orderDate: istTime
    };
    
    console.log('Order Date (IST):', istTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.log('Estimated Delivery (IST):', orderData.estimatedDelivery.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.log('Full order data:', orderData);
    const order = new Order(orderData);
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder._id);
    
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user's orders (protected route)
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.user.id);
    const orders = await Order.find({ user: req.user.id }).sort({ orderDate: -1 });
    console.log('Found orders:', orders.length);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete order (protected route)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    console.log('Order deleted:', req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel an order (protected route)
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'cancelled', cancelReason: reason || '' },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

