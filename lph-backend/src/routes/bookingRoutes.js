import express from 'express';
import { createBooking, getBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getBookings);
router.post('/', authMiddleware, createBooking);
router.patch('/:id/status', authMiddleware, updateBookingStatus);

export default router;
