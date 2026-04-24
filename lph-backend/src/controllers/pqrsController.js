import { adminSupabase } from '../config/supabase.js';

export const createTicket = async (req, res) => {
    try {
        const { title, description, priority, category, unit_id } = req.body;

        if (!title || !description || !category || !unit_id) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const { data, error } = await adminSupabase
            .from('tickets')
            .insert([{
                title,
                description,
                priority: priority || 'medium',
                category,
                unit_id,
                reporter_id: req.user.id,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;

        await adminSupabase.from('ticket_timeline').insert([{
            ticket_id: data.id,
            action: 'Ticket Creado',
            actor_id: req.user.id
        }]);

        res.status(201).json({ message: 'Ticket creado exitosamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTickets = async (req, res) => {
    try {
        let query = adminSupabase.from('tickets').select('*, profiles(full_name), units(unit_number)');

        if (req.user.role === 'resident') {
            query = query.eq('reporter_id', req.user.id);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tickets' });
    }
};

export const updateTicketStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'staff') {
            return res.status(403).json({ error: 'No autorizado para actualizar estados de tickets.' });
        }

        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await adminSupabase
            .from('tickets')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        await adminSupabase.from('ticket_timeline').insert([{
            ticket_id: id,
            action: `Estado cambiado a ${status}`,
            actor_id: req.user.id
        }]);

        res.json({ message: 'Estado de ticket actualizado', data });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar ticket' });
    }
};
