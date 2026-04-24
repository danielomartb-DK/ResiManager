import jwt from 'jsonwebtoken';
import { adminSupabase } from '../config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = async (req, res, next) => {
    console.log(`[AUTH] Solicitud: ${req.method} ${req.originalUrl}`);
    // --- BYPASS TEMPORAL ---
    req.user = {
        id: '00000000-0000-0000-0000-000000000000',
        email: 'admin@example.com',
        role: 'admin',
        full_name: 'Administrador Dev'
    };
    return next();
};
