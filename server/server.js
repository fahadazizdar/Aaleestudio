import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Middleware to ensure DB connection on Vercel Serverless Invocation
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB Initialization error in Vercel function:', err);
  }
  next();
});

// API Routes (Mounted with and without /api prefix for Vercel Serverless compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.use('/api/delivery', deliveryRoutes);
app.use('/delivery', deliveryRoutes);

// Root & Health check
app.get('/', (req, res) => {
  res.json({ message: 'Aaleestudio Backend API operational', status: 200 });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Aaleestudio API Server Running Successfully', timestamp: new Date() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only listen on port if NOT running inside Vercel Serverless environment
if (!process.env.VERCEL) {
  connectDB().then(async () => {
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`[Server] Aaleestudio Backend listening on port ${PORT}`);
    });
  });
}

export default app;
