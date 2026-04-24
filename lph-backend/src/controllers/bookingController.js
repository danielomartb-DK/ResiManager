import { supabase } from '../config/supabase.js';

export const createBooking = async (req, res) => {
    try {
        const { amenity_id, unit_id, start_time, end_time } = req.body;

        if (!amenity_id || !unit_id || !start_time || !end_time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate overlap: start_time < existing.end_time AND end_time > existing.start_time
        const { data: overlapping, error: overlapError } = await supabase
            .from('bookings')
            .select('id')
            .eq('amenity_id', amenity_id)
            .lt('start_time', end_time)
            .gt('end_time', start_time)
            .neq('status', 'denied')
            .neq('status', 'cancelled');

        if (overlapError) throw overlapError;

        if (overlapping && overlapping.length > 0) {
            return res.status(409).json({ error: 'The amenity is already booked during this time slot.' });
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                amenity_id,
                unit_id,
                profile_id: req.user.id,
                start_time,
                end_time,
                status: req.user.role === 'admin' ? 'approved' : 'pending_approval'
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ message: 'Booking created successfully', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBookings = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*, amenities(name), units(unit_number), profiles(full_name)')
            .order('start_time', { ascending: true });

        if (error) throw error;
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'staff') {
            return res.status(403).json({ error: 'Not authorized to update booking status.' });
        }

        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json({ message: 'Booking status updated', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

