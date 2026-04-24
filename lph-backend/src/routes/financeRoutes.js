import express from 'express';
import { generateMonthlyFees, getInvoices, registerPayment } from '../controllers/financeController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/generate-fees', generateMonthlyFees);
router.get('/invoices', getInvoices);
router.post('/payments', registerPayment);

export default router;
