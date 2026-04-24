import axios from 'axios';
import jwt from 'jsonwebtoken';
import { supabase, adminSupabase } from '../config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

export const login = async (req, res) => {
    const { email, password, captcha_token } = req.body;
    console.log(`--- INTENTO DE LOGIN ---`);
    console.log(`Email: ${email}`);
    console.log(`Captcha Token recibido: ${!!captcha_token}`);
    console.log(`Usando Secret Key: ${process.env.RECAPTCHA_SECRET_KEY ? 'CONFIGURADA' : 'FALTANTE'}`);

    // --- BYPASS TEMPORAL PARA REVISIÓN DE DISEÑO ---
    console.log('AVISO: Modo Desarrollador Activo. Saltando validaciones.');
    return res.status(200).json({
        user: { id: 'mock-id', email: email, full_name: 'Admin ResiManager' },
        session: { access_token: 'mock-token' },
        role: 'admin'
    });

    /* 
    // 1. Validar CAPTCHA
    try {
        if (!captcha_token) {
            return res.status(400).json({ error: 'Token de CAPTCHA ausente' });
        }
        const params = new URLSearchParams();
        params.append('secret', process.env.RECAPTCHA_SECRET_KEY);
        params.append('response', captcha_token);

        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, params);

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
    */

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

    console.log('Login completado con éxito, enviando respuesta...');
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
