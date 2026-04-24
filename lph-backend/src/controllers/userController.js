import { adminSupabase } from '../config/supabase.js';

export const getAllResidents = async (req, res) => {
    try {
        const { data, error } = await adminSupabase
            .from('profiles')
            .select(`
                *,
                roles(name),
                unit_residents (
                    units (unit_number)
                )
            `);

        if (error) throw error;

        // Limpiar la data para el frontend
        const residents = data.map(profile => ({
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            status: profile.status,
            role: profile.roles?.name,
            unit: profile.unit_residents?.[0]?.units?.unit_number || 'Sin asignar'
        }));

        res.json(residents);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener residentes' });
    }
};

export const updateResidentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const { error } = await adminSupabase
            .from('profiles')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};
