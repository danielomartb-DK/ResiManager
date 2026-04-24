import { adminSupabase } from '../config/supabase.js';

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Conteo de Residentes (perfiles con rol resident)
        const { count: residentsCount, error: resError } = await adminSupabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        // 2. Conteo de Unidades
        const { count: unitsCount, error: unitError } = await adminSupabase
            .from('units')
            .select('*', { count: 'exact', head: true });

        // 3. PQRS Pendientes
        const { count: pendingTickets, error: ticketError } = await adminSupabase
            .from('tickets')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        // 4. Recaudación Mensual (Suma de transacciones del mes actual)
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0,0,0,0);

        const { data: payments, error: payError } = await adminSupabase
            .from('transactions')
            .select('amount')
            .gte('payment_date', firstDayOfMonth.toISOString());

        const totalRevenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

        if (resError || unitError || ticketError || payError) {
            console.error('Error fetching stats:', { resError, unitError, ticketError, payError });
        }

        res.json({
            residents: residentsCount || 0,
            units: unitsCount || 0,
            pendingTickets: pendingTickets || 0,
            revenue: totalRevenue
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

export const getRecentActivity = async (req, res) => {
    try {
        const { data, error } = await adminSupabase
            .from('transactions')
            .select(`
                id,
                amount,
                payment_date,
                payment_method,
                profiles (full_name)
            `)
            .order('payment_date', { ascending: false })
            .limit(5);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener actividad reciente' });
    }
};
