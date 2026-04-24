import axios from 'axios';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

export const login = async (req, res) => {
    const { email, password, captcha_token } = req.body;

    // 1. Validar CAPTCHA
    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captcha_token
            }
        });

        if (!response.data.success) {
            return res.status(400).json({ error: 'Fallo en la verificación del CAPTCHA' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al verificar CAPTCHA' });
    }

    // 2. Autenticación con Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (authError || !authData.user) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // 3. Obtener el rol del perfil
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, roles(name)')
        .eq('id', authData.user.id)
        .single();

    if (profileError || !profile) {
        return res.status(401).json({ error: 'Perfil de usuario no encontrado' });
    }

    const role = profile.roles?.name || 'resident';

    // 4. Generar JWT
    const token = jwt.sign(
        { userId: authData.user.id, email, role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({
        message: 'Login exitoso',
        token,
        user: {
            id: authData.user.id,
            email,
            role,
            full_name: profile.full_name
        }
    });
};
