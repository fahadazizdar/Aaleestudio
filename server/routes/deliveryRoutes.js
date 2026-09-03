import express from 'express';
import { calculateFee } from '../controllers/deliveryController.js';

const router = express.Router();

router.post('/calculate', calculateFee);

export default router;
