import express from 'express';
import { getDashboardStats, getRecentActivity } from '../controllers/statsController.js';
import { getAllResidents, updateResidentStatus, createResident } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Estadísticas
router.get('/stats/summary', getDashboardStats);
router.get('/stats/activity', getRecentActivity);

// Gestión de Usuarios
router.get('/users', getAllResidents);
router.post('/users', createResident);
router.patch('/users/:id/status', updateResidentStatus);

export default router;
