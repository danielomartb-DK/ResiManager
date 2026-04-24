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

  const filteredInvoices = invoices.filter(inv => 
    inv.units?.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.description.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestión Financiera</h1>
          <p className="text-white/50">Control de facturación, pagos y cartera.</p>
        </div>
        <div className="flex gap-3">
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
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-wider">Recaudado</p>
          </div>
          <h3 className="text-4xl font-bold text-white">${totalPaid.toLocaleString()}</h3>
          <p className="text-[10px] text-emerald-400 font-bold mt-1">+12.5% este mes</p>
        </div>

        <div className="glass-panel stat-card-premium bg-red-500/5 border-red-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-wider">Por Cobrar</p>
          </div>
          <h3 className="text-4xl font-bold text-white">${totalPending.toLocaleString()}</h3>
          <p className="text-[10px] text-red-400 font-bold mt-1">24 facturas vencidas</p>
        </div>

        <div className="glass-panel stat-card-premium bg-blue-500/5 border-red-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-wider">Total Facturado</p>
          </div>
          <h3 className="text-4xl font-bold text-white">${(totalPaid + totalPending).toLocaleString()}</h3>
          <p className="text-[10px] text-blue-400 font-bold mt-1">Meta: 95% de recaudación</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Buscar factura o unidad..."
            className="glass-input pl-12"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {['all', 'pending', 'paid', 'overdue'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
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
              <tr className="bg-white/5">
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest">Unidad</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest">Descripción</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest text-center">Vencimiento</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest">Monto</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.length > 0 ? filteredInvoices.map((inv, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  key={inv.id} 
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-white">Unidad {inv.units?.unit_number}</p>
                    <p className="text-[10px] text-white/30 font-medium">REF: {inv.id.slice(0,8)}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-white/80">{inv.description}</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <p className="text-xs text-white/60">{new Date(inv.due_date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">${inv.amount.toLocaleString()}</span>
                      <span className={`text-[9px] font-bold uppercase ${
                        inv.status === 'paid' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="glass-button-secondary py-2 px-4 text-[10px]">
                      Detalles
                    </button>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-white/20">
                    <p className="text-lg font-bold">Sin facturas que mostrar</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
