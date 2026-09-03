import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export let isInMemoryDB = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aaleestudio';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    isInMemoryDB = false;
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection failed (${error.message}). Switching to In-Memory DB Mode for instant demonstration!`);
    isInMemoryDB = true;
  }
};
