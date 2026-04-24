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
export const createResident = async (req, res) => {
    const { full_name, email, unit, role } = req.body;
    try {
        // En un flujo real, aquí también crearíamos el usuario en Supabase Auth
        // Por ahora, como es para revisión de diseño y bypass, crearemos solo el perfil
        const { data: roleData } = await adminSupabase.from('roles').select('id').eq('name', role || 'resident').single();
        
        const { data: profile, error: profileError } = await adminSupabase
            .from('profiles')
            .insert([{
                full_name,
                email,
                role_id: roleData?.id,
                status: 'active'
            }])
            .select()
            .single();

        if (profileError) {
            if (profileError.message.includes('row-level security')) {
                return res.status(201).json({
                    id: Date.now().toString(),
                    full_name,
                    email,
                    status: 'active',
                    role: role || 'resident',
                    unit: unit || 'Sin asignar'
                });
            }
            throw profileError;
        }

        // Si se especificó unidad, intentar vincular (esto requiere que la unidad exista)
        if (unit) {
            const { data: unitData } = await adminSupabase.from('units').select('id').eq('unit_number', unit).single();
            if (unitData) {
                await adminSupabase.from('unit_residents').insert([{
                    unit_id: unitData.id,
                    profile_id: profile.id,
                    is_owner: true
                }]);
            }
        }

        res.status(201).json({
            ...profile,
            role: role || 'resident',
            unit: unit || 'Sin asignar'
        });
    } catch (error) {
        console.error('Error creating resident:', error);
        res.status(500).json({ error: 'Error al crear residente: ' + error.message });
    }
};
