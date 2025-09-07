import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import contactsRouter from './routes/contacts.js';
import { sanitizeInput } from './middleware/auth.js';

dotenv.config();

// Basic env debug
console.log('=== ENV ===');
console.log('PORT:', sanitizeInput(process.env.PORT || ''));
console.log('MONGODB_URI:', sanitizeInput(process.env.MONGODB_URI || ''));
console.log('MONGODB_DB:', sanitizeInput(process.env.MONGODB_DB || ''));
console.log('============');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'anshu_pizza_corner';

// Connect to MongoDB
const connectMongo = async () => {
  try {
    const start = Date.now();
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    const ms = Date.now() - start;
    console.log(`✅ MongoDB connected in ${sanitizeInput(ms.toString())}ms`);
    console.log('📊 Database:', sanitizeInput(MONGODB_DB));
    console.log('🔌 URI:', sanitizeInput(MONGODB_URI));
  } catch (error) {
    console.error('❌ MongoDB connection failed:', sanitizeInput(error.message));
    process.exit(1);
  }
};

// Start server after Mongo connection
const startServer = async () => {
  await connectMongo();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${sanitizeInput(PORT.toString())}`);
    console.log(`🌐 API available at: http://localhost:${sanitizeInput(PORT.toString())}`);
    console.log('📡 MongoDB status: Connected');
  });
};

startServer();
