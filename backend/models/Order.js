import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userDetails: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  items: [
    {
      name: String,
      size: String,
      quantity: Number,
      price: Number
    }
  ],
  total: Number,
  deliveryAddress: String,
  estimatedDelivery: Date,
  status: {
    type: String,
    default: 'preparing'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', orderSchema);
