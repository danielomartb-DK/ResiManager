import express from 'express';
import { getUnits, createUnit, updateUnit } from '../controllers/unitController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUnits);
router.post('/', createUnit);
router.patch('/:id', updateUnit);

export default router;
