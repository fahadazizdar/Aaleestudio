import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export let isInMemoryDB = false;
let connPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isInMemoryDB = false;
    return mongoose.connection;
  }

  if (!connPromise) {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://fahadazizdar559_db_user:phodHS2J6mnt0mkC@cluster0.y3xjbvr.mongodb.net/alesstore?retryWrites=true&w=majority&appName=Cluster0';

    connPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    }).then((m) => {
      console.log(`[Database] MongoDB Atlas Connected successfully.`);
      isInMemoryDB = false;
      return m;
    }).catch((err) => {
      connPromise = null;
      console.warn(`[Database Warning] MongoDB Atlas connection failed (${err.message}). Activating fallback mode.`);
      isInMemoryDB = true;
    });
  }

  try {
    await connPromise;
  } catch (err) {
    isInMemoryDB = true;
  }

  return mongoose.connection;
};
