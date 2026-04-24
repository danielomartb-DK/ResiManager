import express from 'express';
import { createTicket, getTickets, updateTicketStatus } from '../controllers/pqrsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getTickets);
router.post('/', authMiddleware, createTicket);
router.patch('/:id/status', authMiddleware, updateTicketStatus);

export default router;
