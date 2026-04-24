import axios from 'axios';
import jwt from 'jsonwebtoken';
import { supabase, adminSupabase } from '../config/supabase.js';
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

    // 3. Obtener el rol del perfil usando el cliente ADMIN (Bypass RLS)
    let { data: profile, error: profileError } = await adminSupabase
        .from('profiles')
        .select('*, roles(name)')
        .eq('id', authData.user.id)
        .single();

    // Si el perfil no existe, crearlo por defecto para evitar bloqueos
    if (profileError || !profile) {
        console.log('Perfil no encontrado, creando uno por defecto...');
        const { data: roleData } = await adminSupabase.from('roles').select('id').eq('name', 'resident').single();
        
        const { data: newProfile, error: createError } = await adminSupabase
            .from('profiles')
            .insert([{
                id: authData.user.id,
                email: authData.user.email,
                full_name: authData.user.email.split('@')[0],
                role_id: roleData?.id,
                status: 'active'
            }])
            .select('*, roles(name)')
            .single();

        if (createError) {
            console.error('ERROR DETALLADO DE SUPABASE:', JSON.stringify(createError, null, 2));
            return res.status(500).json({ error: `Error al sincronizar perfil: ${createError.message || 'Error desconocido'}` });
        }
        profile = newProfile;
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
