import { adminSupabase } from '../config/supabase.js';

export const getUnits = async (req, res) => {
    try {
        const { data, error } = await adminSupabase
            .from('units')
            .select(`
                *,
                unit_residents (
                    profiles (id, full_name, email)
                )
            `)
            .order('unit_number', { ascending: true });

        if (error) throw error;

        // Formatear para el frontend
        const formattedData = data.map(unit => ({
            ...unit,
            resident: unit.unit_residents?.[0]?.profiles || null
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener unidades' });
    }
};

export const createUnit = async (req, res) => {
    try {
        const { unit_number, building_id, type, floor, status } = req.body;
        const { data, error } = await adminSupabase
            .from('units')
            .insert([{ unit_number, building_id, type, floor, status: status || 'vacant' }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear unidad' });
    }
};

export const updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, current_balance } = req.body;
        const { data, error } = await adminSupabase
            .from('units')
            .update({ status, current_balance })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar unidad' });
    }
};
