import express from 'express';
import { generateMonthlyFees } from '../controllers/financeController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate-fees', authMiddleware, generateMonthlyFees);

export default router;
