import { supabase } from '../config/supabase.js';

export const createTicket = async (req, res) => {
    try {
        if (req.user.role !== 'resident') {
            return res.status(403).json({ error: 'Only residents can create tickets.' });
        }

        const { title, description, priority, category, unit_id } = req.body;

        if (!title || !description || !category || !unit_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data, error } = await supabase
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

        // Auto-create initial timeline event
        await supabase.from('ticket_timeline').insert([{
            ticket_id: data.id,
            action: 'Ticket Created',
            actor_id: req.user.id
        }]);

        res.status(201).json({ message: 'Ticket created successfully', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTickets = async (req, res) => {
    try {
        let query = supabase.from('tickets').select('*, profiles(full_name), units(unit_number)');

        // Admin/Staff/Security see all, Resident sees only theirs
        if (req.user.role === 'resident') {
            query = query.eq('reporter_id', req.user.id);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTicketStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'staff') {
            return res.status(403).json({ error: 'Not authorized to update ticket status.' });
        }

        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('tickets')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        await supabase.from('ticket_timeline').insert([{
            ticket_id: id,
            action: `Status changed to ${status}`,
            actor_id: req.user.id
        }]);

        res.json({ message: 'Ticket status updated', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
