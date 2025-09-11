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
  cancelReason: {
    type: String,
    default: ''
  },
  payment: {
    method: { type: String, enum: ['cod', 'upi', 'qr'], default: 'cod' },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    upiId: String,
    qrCodeUrl: String,
    transactionId: String
  },
  deliveryBoy: {
    name: String,
    phone: String
  }
},
{ timestamps: true }
);

export default mongoose.model('Order', orderSchema);
