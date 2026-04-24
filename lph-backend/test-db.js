import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);
    
    const { count, error } = await adminSupabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Connection failed:', error.message);
    } else {
        console.log('Connection successful! Resident count:', count);
    }
}

testConnection();
