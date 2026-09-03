import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export let isInMemoryDB = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://fahadazizdar559_db_user:phodHS2J6mnt0mkC@cluster0.y3xjbvr.mongodb.net/alesstore?retryWrites=true&w=majority&appName=Cluster0';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    isInMemoryDB = false;
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection failed (${error.message}). Switching to In-Memory DB Mode for instant demonstration!`);
    isInMemoryDB = true;
  }
};
