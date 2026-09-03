import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export let isInMemoryDB = false;
let cachedDbConnection = null;

export const connectDB = async () => {
  if (cachedDbConnection && mongoose.connection.readyState === 1) {
    isInMemoryDB = false;
    return cachedDbConnection;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://fahadazizdar559_db_user:phodHS2J6mnt0mkC@cluster0.y3xjbvr.mongodb.net/alesstore?retryWrites=true&w=majority&appName=Cluster0';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000
    });
    cachedDbConnection = conn;
    isInMemoryDB = false;
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] MongoDB connection error: ${error.message}`);
    // Retry connection without failing over to in-memory mode
    isInMemoryDB = false;
  }
};
