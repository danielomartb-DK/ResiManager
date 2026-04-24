import { useState, useEffect } from 'react';
import { 
  CreditCard, DollarSign, Search, 
  Filter, Download, ChevronRight, 
  CheckCircle2, Clock, AlertCircle, 
  ArrowUpRight, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Finance() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/finance/invoices?status=${statusFilter}`);
      setInvoices(res.data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await axios.post(`${API_URL}/finance/payments`, {
        invoice_id: selectedInvoice.id,
        amount: selectedInvoice.amount,
        payment_method: paymentMethod
      });
      alert('¡Pago registrado con éxito!');
      setShowPayModal(false);
      fetchInvoices();
    } catch (error) {
      alert('Error al registrar pago: ' + (error.response?.data?.error || error.message));
    } finally {
      setProcessing(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    (inv.units?.unit_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPending = invoices.reduce((sum, inv) => inv.status === 'pending' ? sum + inv.amount : sum, 0);
  const totalPaid = invoices.reduce((sum, inv) => inv.status === 'paid' ? sum + inv.amount : sum, 0);

  if (loading && invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-white/40">Auditando estados financieros...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestión Financiera</h1>
          <p className="text-white/50">Control de facturación, pagos y cartera.</p>
        </div>
        <div className="grid-actions">
          <button className="glass-button">
            <Download className="w-5 h-5" />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid-stats">
        <div className="glass-panel stat-card-premium bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-white/60 text-[12px] font-bold uppercase tracking-wider">Recaudado</p>
          </div>
          <h3 className="text-4xl font-bold text-white">${totalPaid.toLocaleString()}</h3>
          <p className="text-[12px] text-emerald-400 font-bold mt-1 tracking-tight">+12.5% este mes</p>
        </div>

        <div className="glass-panel stat-card-premium bg-red-500/5 border-red-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-white/60 text-[12px] font-bold uppercase tracking-wider">Por Cobrar</p>
          </div>
          <h3 className="text-4xl font-bold text-white">${totalPending.toLocaleString()}</h3>
          <p className="text-[12px] text-red-400 font-bold mt-1 tracking-tight">Facturas pendientes de cobro</p>
        </div>

        <div className="glass-panel stat-card-premium bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-white/60 text-[12px] font-bold uppercase tracking-wider">Total Facturado</p>
          </div>
          <h3 className="text-4xl font-bold text-white">${(totalPaid + totalPending).toLocaleString()}</h3>
          <p className="text-[12px] text-blue-400 font-bold mt-1 tracking-tight">Meta: 95% de recaudación</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Buscar factura o unidad..."
            className="glass-input pl-16"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-full lg:w-auto">
          {['all', 'pending', 'paid', 'overdue'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`flex-1 lg:flex-none px-4 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-widest transition-all ${
                statusFilter === f ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : f === 'paid' ? 'Pagadas' : 'Vencidas'}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5">Unidad</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5">Descripción</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest text-center border-b border-white/5">Vencimiento</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5">Monto</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest text-right border-b border-white/5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.length > 0 ? filteredInvoices.map((inv, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={inv.id} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-white">Unidad {inv.units?.unit_number}</p>
                    <p className="text-[12px] text-white/30 font-medium tracking-tight mt-0.5">REF: {inv.id.slice(0,8)}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-white/80 line-clamp-1">{inv.description}</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <p className="text-xs text-white/60 font-medium">{new Date(inv.due_date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">${inv.amount.toLocaleString()}</span>
                      <span className={`text-[12px] font-black uppercase mt-0.5 ${
                        inv.status === 'paid' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      {inv.status === 'pending' && (
                        <button 
                          onClick={() => { setSelectedInvoice(inv); setShowPayModal(true); }}
                          className="glass-button px-4 py-2 text-[12px] font-bold"
                        >
                          Pagar
                        </button>
                      )}
                      <button className="glass-button-secondary p-2.5 rounded-xl">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center opacity-20">
                    <p className="text-xl font-bold">Sin facturas que mostrar</p>
                    <p className="text-sm mt-1">No hay registros financieros en este filtro</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Pago */}
      {showPayModal && selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => setShowPayModal(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md glass-panel p-10 bg-[#1e293b]"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Registrar Pago</h2>
                <p className="text-white/40 text-sm">Factura #{selectedInvoice.id.slice(0,8)}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
              <div className="flex justify-between mb-2">
                <span className="text-white/40 text-sm font-medium">Monto a pagar</span>
                <span className="text-white font-bold text-lg">${selectedInvoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40 text-sm font-medium">Unidad</span>
                <span className="text-white font-bold">{selectedInvoice.units?.unit_number}</span>
              </div>
            </div>

            <form onSubmit={handleRegisterPayment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">Método de Pago</label>
                <select 
                  className="glass-input"
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                >
                  <option value="transfer">Transferencia Bancaria</option>
                  <option value="cash">Efectivo</option>
                  <option value="card">Tarjeta de Crédito/Débito</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  type="button" onClick={() => setShowPayModal(false)}
                  className="glass-button-secondary py-4"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" disabled={processing}
                  className="glass-button py-4 bg-emerald-600 border-emerald-500 hover:bg-emerald-500 shadow-emerald-900/40"
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirmar Pago'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
