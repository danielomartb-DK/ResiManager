import { adminSupabase } from './src/config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

async function registerUser() {
    console.log('Intentando registrar usuario en Supabase...');
    const { data, error } = await adminSupabase.auth.admin.createUser({
        email: 'danieltijaro28@gmail.com',
        password: 'Dankar*28',
        email_confirm: true
    });

    if (error) {
        console.error('Error al registrar:', error.message);
    } else {
        console.log('¡Usuario registrado con éxito!', data.user.id);
    }
}

registerUser();
