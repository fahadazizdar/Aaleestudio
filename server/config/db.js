import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export let isInMemoryDB = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => {
      const timer = setInterval(() => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
    return;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://fahadazizdar559_db_user:phodHS2J6mnt0mkC@cluster0.y3xjbvr.mongodb.net/alesstore?retryWrites=true&w=majority&appName=Cluster0';

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    isInMemoryDB = false;
    console.log(`[Database] MongoDB Atlas Connected successfully.`);
  } catch (error) {
    console.error(`[Database Error] MongoDB connection error: ${error.message}`);
    isInMemoryDB = false;
  }
};
