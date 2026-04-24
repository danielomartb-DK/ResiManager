import jwt from 'jsonwebtoken';
import { adminSupabase } from '../config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
        }

        const token = authHeader.split(' ')[1];
        
        // 1. Verificar el JWT usando nuestro SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(401).json({ error: 'Token inválido o expirado.' });
        }

        // 2. Adjuntar info del usuario al request
        // Buscamos el perfil con el cliente ADMIN para asegurar que obtenemos el rol
        const { data: profile, error: profileError } = await adminSupabase
            .from('profiles')
            .select('*, roles(name)')
            .eq('id', decoded.id)
            .single();

        if (profileError || !profile) {
            return res.status(401).json({ error: 'Usuario no encontrado en la base de datos.' });
        }

        req.user = {
            id: profile.id,
            email: profile.email,
            role: profile.roles?.name || 'guest',
            full_name: profile.full_name
        };

        next();
    } catch (error) {
        console.error('Error en Auth Middleware:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.' });
        }
        return res.status(401).json({ error: 'Error de autenticación.' });
    }
};
