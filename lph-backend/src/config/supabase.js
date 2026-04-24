import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente para operaciones públicas / autenticación de usuarios
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente para operaciones administrativas (Bypass RLS)
export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

console.log('CONEXIÓN: Clientes Supabase inicializados (Auth y Admin)');
