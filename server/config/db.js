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
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://fahadazizdar559_db_user:y2spBG2dRf9GElLD@cluster0.uuisjyu.mongodb.net/aaleestudio?retryWrites=true&w=majority&appName=Cluster0';

    connPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    }).then((m) => {
      console.log(`[Database] MongoDB Atlas Connected successfully.`);
      isInMemoryDB = false;
      return m;
    }).catch((err) => {
      connPromise = null;
      console.warn(`[Database Warning] MongoDB Atlas connection failed (${err.message}). Activating fallback mode.`);
      isInMemoryDB = true;
      throw err;
    });
  }

  try {
    await connPromise;
    isInMemoryDB = false;
  } catch (err) {
    if (mongoose.connection.readyState !== 1) {
      isInMemoryDB = true;
    }
  }

  return mongoose.connection;
};
