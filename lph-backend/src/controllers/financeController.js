import { supabase } from '../config/supabase.js';

export const generateMonthlyFees = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'No autorizado. Solo administradores pueden generar cobros.' });
    }

    const { totalAmount, description, dueDate } = req.body;

    if (!totalAmount || !dueDate || totalAmount <= 0) {
        return res.status(400).json({ error: 'Datos incompletos o monto inválido' });
    }

    const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('id');

    if (unitsError) return res.status(500).json({ error: unitsError.message });

    if (!units || units.length === 0) {
        return res.status(400).json({ error: 'No hay unidades registradas para realizar el cobro' });
    }

    const individualFee = parseFloat((totalAmount / units.length).toFixed(2));

    const invoices = units.map(unit => ({
        unit_id: unit.id,
        amount: individualFee,
        description: description || 'Cuota de administración mensual',
        due_date: dueDate,
        status: 'pending'
    }));

    const { error: insertError } = await supabase.from('invoices').insert(invoices);

    if (insertError) return res.status(500).json({ error: insertError.message });

    res.json({
        message: `Proceso completado: se generaron ${invoices.length} facturas.`,
        data: {
            totalDistributed: totalAmount,
            individualFee,
            totalUnits: units.length
        }
    });
};
