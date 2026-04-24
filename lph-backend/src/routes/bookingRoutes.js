import express from 'express';
import { createBooking, getBookings } from '../controllers/bookingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getBookings);
router.post('/', authMiddleware, createBooking);

export default router;
