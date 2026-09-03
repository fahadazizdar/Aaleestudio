import express from 'express';
import {
  getAllCustomers,
  toggleCustomerStatus,
  getSiteSettings,
  updateSiteSettings,
  getDashboardStats,
  createContactMessage,
  getContactMessages,
  deleteContactMessage
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/settings', getSiteSettings);
router.post('/contact-messages', createContactMessage);

// Protected Admin routes
router.use(protect, adminOnly);

router.get('/customers', getAllCustomers);
router.put('/customers/:id/status', toggleCustomerStatus);
router.put('/settings', updateSiteSettings);
router.get('/dashboard-stats', getDashboardStats);
router.get('/contact-messages', getContactMessages);
router.delete('/contact-messages/:id', deleteContactMessage);

export default router;
