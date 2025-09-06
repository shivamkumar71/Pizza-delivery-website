import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'test';

async function main() {
  try {
    const start = Date.now();
    await mongoose.connect(uri, { dbName });
    const ms = Date.now() - start;
    console.log(`✅ MongoDB connected in ${ms}ms`);
    console.log(`URI: ${uri}`);
    console.log(`DB: ${dbName}`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('If using Atlas, ensure IP allowlist and credentials are correct.');
    process.exit(1);
  }
}

main();


