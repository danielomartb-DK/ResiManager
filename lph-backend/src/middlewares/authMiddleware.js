import { supabase } from '../config/supabase.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        
        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Consult profiles with join on roles
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*, roles(name)')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return res.status(401).json({ error: 'User profile not found' });
        }

        req.user = {
            id: user.id,
            role: profile.roles?.name || 'guest'
        };

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
};
