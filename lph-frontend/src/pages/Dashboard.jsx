import { useState, useEffect } from 'react';
import { 
  Users, Building2, Ticket, TrendingUp, 
  PlusCircle, Calendar, ChevronRight, 
  DollarSign, Loader2, AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [stats, setStats] = useState({ residents: 0, units: 0, pendingTickets: 0, revenue: 0 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({ totalAmount: '', description: '', dueDate: '' });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, activityRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats/summary`),
        axios.get(`${API_URL}/admin/stats/activity`)
      ]);
      setStats(statsRes.data);
      setActivity(activityRes.data);
      setError(null);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      const msg = error.response?.data?.error || error.message || 'Error de conexión con el servidor';
      setError(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFees = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await axios.post(`${API_URL}/finance/generate-fees`, modalForm);
      alert('¡Éxito! Los cobros se han generado y distribuido entre todas las unidades.');
      setShowModal(false);
      setModalForm({ totalAmount: '', description: '', dueDate: '' });
      fetchDashboardData(); // Recargar stats
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'No se pudo procesar la solicitud'));
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  const statCards = [
    { label: 'Residentes', value: stats.residents, icon: Users, color: '#3b82f6', trend: '+4%' },
    { label: 'Unidades', value: stats.units, icon: Building2, color: '#8b5cf6', trend: '100%' },
    { label: 'PQRS Abiertos', value: stats.pendingTickets, icon: Ticket, color: '#f43f5e', trend: '-2' },
    { label: 'Recaudación', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: '#10b981', trend: '+12%' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Panel Ejecutivo</h1>
          <p className="text-white/50">Bienvenido al centro de control de ResiManager.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="glass-button"
        >
          <PlusCircle className="w-5 h-5" />
          Generar Gasto Común
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid-stats mb-10">
        {statCards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel stat-card-premium"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-1 rounded-md uppercase">
                {card.trend}
              </span>
            </div>
            <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">{card.label}</p>
            <h3 className="text-4xl font-bold text-white tracking-tight">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Flujo de Caja
            </h2>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity */}
        <div className="glass-panel p-8">
          <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Movimientos
          </h2>
          <div className="space-y-6">
            {activity.length > 0 ? activity.map((act, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-xs">
                  {act.profiles?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{act.profiles?.full_name}</p>
                  <p className="text-[10px] text-white/40 uppercase font-medium">{act.payment_method}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">+${act.amount}</p>
                  <p className="text-[10px] text-white/20">{new Date(act.payment_date).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 opacity-20">
                <p className="text-sm">Sin actividad reciente</p>
              </div>
            )}
          </div>
          <button className="w-full mt-10 glass-button-secondary py-3 text-[10px] uppercase tracking-widest">
            Ver Historial Completo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-panel p-10 bg-[#1e293b]"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Generar Cobros Masivos</h2>
              <p className="text-white/40 text-sm mb-8">Esta acción generará una factura para cada unidad registrada.</p>
              
              <form onSubmit={handleGenerateFees} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Monto Total a Distribuir</label>
                  <input 
                    type="number" required
                    className="glass-input"
                    placeholder="Ej: 5000000"
                    value={modalForm.totalAmount}
                    onChange={e => setModalForm({...modalForm, totalAmount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Descripción del Cobro</label>
                  <input 
                    type="text" required
                    className="glass-input"
                    placeholder="Ej: Administración Mayo 2024"
                    value={modalForm.description}
                    onChange={e => setModalForm({...modalForm, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Fecha de Vencimiento</label>
                  <input 
                    type="date" required
                    className="glass-input"
                    value={modalForm.dueDate}
                    onChange={e => setModalForm({...modalForm, dueDate: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 glass-button-secondary py-4"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={generating}
                    className="flex-1 glass-button py-4"
                  >
                    {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generar Ahora'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-64 bg-white/5 rounded-lg mb-4" />
      <div className="h-4 w-96 bg-white/5 rounded-lg mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[1,2,3,4].map(i => <div key={i} className="h-32 glass-panel" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[400px] glass-panel" />
        <div className="h-[400px] glass-panel" />
      </div>
    </div>
  );
}

const mockChartData = [
  { name: 'Ene', revenue: 4200 },
  { name: 'Feb', revenue: 3800 },
  { name: 'Mar', revenue: 5100 },
  { name: 'Abr', revenue: 4600 },
  { name: 'May', revenue: 6200 },
  { name: 'Jun', revenue: 5800 },
];
