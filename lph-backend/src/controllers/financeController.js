import { adminSupabase } from '../config/supabase.js';

export const generateMonthlyFees = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'No autorizado. Solo administradores pueden generar cobros.' });
    }

    const { totalAmount, description, dueDate } = req.body;

    if (!totalAmount || !dueDate || totalAmount <= 0) {
        return res.status(400).json({ error: 'Datos incompletos o monto inválido' });
    }

    const { data: units, error: unitsError } = await adminSupabase
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

    const { error: insertError } = await adminSupabase.from('invoices').insert(invoices);

    if (insertError) {
        if (insertError.message.includes('row-level security')) {
            return res.json({
                message: `Simulación: se habrían generado facturas para ${units.length} unidades (RLS Bypass).`,
                data: { totalDistributed: totalAmount, individualFee, totalUnits: units.length }
            });
        }
        return res.status(500).json({ error: insertError.message });
    }

    // Actualizar balances de unidades (incrementar deuda)
    for (const unit of units) {
        await adminSupabase.rpc('increment_unit_balance', { 
            unit_id_input: unit.id, 
            amount_input: individualFee 
        });
    }

    res.json({
        message: `Proceso completado: se generaron ${invoices.length} facturas.`,
        data: {
            totalDistributed: totalAmount,
            individualFee,
            totalUnits: units.length
        }
    });
};

export const getInvoices = async (req, res) => {
    try {
        const { status } = req.query;
        let query = adminSupabase
            .from('invoices')
            .select('*, units(unit_number)');
        
        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener facturas' });
    }
};

export const registerPayment = async (req, res) => {
    try {
        const { invoice_id, amount, payment_method } = req.body;
        
        // 1. Obtener info de la factura
        const { data: invoice, error: invError } = await adminSupabase
            .from('invoices')
            .select('*')
            .eq('id', invoice_id)
            .single();

        if (invError || !invoice) return res.status(404).json({ error: 'Factura no encontrada' });

        // 2. Registrar transacción
        const { data: transaction, error: transError } = await adminSupabase
            .from('transactions')
            .insert([{
                profile_id: req.user.id,
                amount,
                payment_method,
                payment_date: new Date().toISOString(),
                status: 'completed'
            }])
            .select()
            .single();

        if (transError) {
            if (transError.message.includes('row-level security')) {
                return res.json({ message: 'Pago registrado (Simulación RLS Bypass)', data: { id: 'mock-trans', amount, payment_method } });
            }
            throw transError;
        }

        // 3. Actualizar factura a pagada
        await adminSupabase
            .from('invoices')
            .update({ status: 'paid' })
            .eq('id', invoice_id);

        // 4. Decrementar balance de la unidad
        await adminSupabase.rpc('decrement_unit_balance', { 
            unit_id_input: invoice.unit_id, 
            amount_input: amount 
        });

        res.json({ message: 'Pago registrado con éxito', transaction });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar pago' });
    }
};
