import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.get('/my-orders', protect, getMyOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
