import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Inbox, Search, Filter, MessageSquare, 
  Clock, AlertCircle, CheckCircle2, ChevronRight,
  User, Building, Calendar, Loader2, MoreVertical,
  PlusCircle, Info, Send
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function PQRS() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', category: 'queja', priority: 'medium' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API_URL}/pqrs`);
      setTickets(res.data.data);
      if (res.data.data.length > 0) setSelectedTicket(res.data.data[0]);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError(`Error: ${error.response?.data?.error || error.message || 'Error de conexión'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.post(`${API_URL}/pqrs`, newTicket);
      setTickets([res.data.data, ...tickets]);
      setShowModal(false);
      setNewTicket({ title: '', description: '', category: 'queja', priority: 'medium' });
      alert('¡Ticket creado con éxito!');
    } catch (error) {
      alert('Error al crear ticket: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
        <p className="text-white/40">Sincronizando buzón de PQRS...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bandeja de PQRS</h1>
          <p className="text-white/50">Gestiona solicitudes, quejas y reclamos de los residentes.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center bg-white/5 p-2 rounded-2xl border border-white/10 gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            {['all', 'pending', 'resolved'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center justify-center h-[48px] min-w-[140px] px-8 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all ${
                  filter === f 
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : 'Resueltos'}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="glass-button"
          >
            <PlusCircle className="w-5 h-5" />
            Nuevo Ticket
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden min-h-0 mt-6">
        {/* Lista de Tickets */}
        <div className={`w-full md:w-[400px] flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar ${selectedTicket && 'hidden md:flex'}`}>
          <div className="relative mb-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="Buscar ticket o residente..."
              className="glass-input pl-14 py-4"
            />
          </div>

          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`glass-panel p-6 cursor-pointer border-l-4 transition-all hover:bg-white/[0.04] ${
                  selectedTicket?.id === ticket.id ? 'border-cyan-500 bg-white/[0.04]' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[12px] font-bold text-white/20 uppercase tracking-widest">#{ticket.id.slice(0, 8)}</span>
                  <span className={`px-2.5 py-1 rounded-lg text-[12px] font-black uppercase tracking-tighter ${
                    ticket.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">{ticket.title}</h3>
                <div className="flex items-center gap-3 text-[12px] text-white/40 font-bold uppercase tracking-wider">
                  <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                    <User className="w-3 h-3 text-cyan-400" />
                  </div>
                  {ticket.profiles?.full_name || 'Anónimo'}
                </div>
              </motion.div>
            ))}
            
            {filteredTickets.length === 0 && (
              <div className="py-24 text-center opacity-20">
                <Inbox className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xl font-bold">Bandeja vacía</p>
              </div>
            )}
          </div>
        </div>

        {/* Detalle del Ticket */}
        <div className={`flex-1 ${!selectedTicket && 'hidden md:block'}`}>
          {selectedTicket ? (
            <div className="glass-panel h-full flex flex-col overflow-hidden bg-white/[0.01]">
              <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-start">
                <div>
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="md:hidden flex items-center gap-2 text-white/40 mb-6 text-xs font-bold uppercase tracking-widest"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Volver
                  </button>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[12px] font-black uppercase tracking-widest">
                      {selectedTicket.status}
                    </span>
                    <span className="text-white/20 text-[12px] font-bold uppercase tracking-widest">Registrado: {new Date(selectedTicket.created_at).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">{selectedTicket.title}</h2>
                </div>
                <button className="p-3 rounded-2xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                  <MoreVertical className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-8 mb-12 pb-10 border-b border-white/5">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-cyan-500/20">
                    {selectedTicket.profiles?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-white/40 uppercase tracking-widest mb-2">Solicitado por</p>
                    <h3 className="text-2xl font-bold text-white">{selectedTicket.profiles?.full_name || 'Usuario Residente'}</h3>
                    <p className="text-sm text-white/40 mt-1">Unidad de Residencia Asignada</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
                    <p className="text-[12px] font-bold text-white/40 uppercase mb-4 tracking-widest">Unidad Relacionada</p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <Building className="w-5 h-5" />
                      </div>
                      <p className="text-lg font-bold text-white">Vivienda Asociada</p>
                    </div>
                  </div>
                  <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
                    <p className="text-[12px] font-bold text-white/40 uppercase mb-4 tracking-widest">Categoría del Caso</p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <Info className="w-5 h-5" />
                      </div>
                      <p className="text-lg font-bold text-white capitalize">{selectedTicket.category}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[12px] font-bold text-white/20 uppercase tracking-widest ml-1">Descripción Detallada</h3>
                  <div className="text-white/80 leading-relaxed bg-white/[0.02] p-12 rounded-[2rem] border border-white/10 shadow-inner text-lg italic">
                    "{selectedTicket.description}"
                  </div>
                </div>
              </div>

              <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-4">
                <button className="glass-button-secondary py-5 flex-1 font-bold uppercase tracking-widest">
                  Escalar Staff
                </button>
                <button className="glass-button py-5 flex-[2] font-bold uppercase tracking-widest bg-cyan-600 border-cyan-500">
                  <Send className="w-5 h-5 inline-block mr-2" />
                  Responder Ahora
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel h-full flex flex-col items-center justify-center text-center p-20 opacity-30">
              <MessageSquare className="w-20 h-20 mb-8" />
              <h2 className="text-3xl font-bold">Selecciona un ticket</h2>
              <p className="max-w-md mt-4 text-lg">Revisa y gestiona las solicitudes de la comunidad para mantener la armonía del condominio.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nuevo Ticket */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg glass-panel p-10 bg-[#1e293b]"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Nuevo Ticket PQRS</h2>
            <p className="text-white/40 text-sm mb-8">Registre una nueva solicitud administrativa.</p>

            <form onSubmit={handleCreateTicket} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">Asunto / Título</label>
                <input 
                  type="text" required className="glass-input"
                  placeholder="Ej: Falla en ascensor torre B"
                  value={newTicket.title}
                  onChange={e => setNewTicket({...newTicket, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">Categoría</label>
                  <select 
                    className="glass-input"
                    value={newTicket.category}
                    onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                  >
                    <option value="queja">Queja</option>
                    <option value="peticion">Petición</option>
                    <option value="reclamo">Reclamo</option>
                    <option value="sugerencia">Sugerencia</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">Prioridad</label>
                  <select 
                    className="glass-input"
                    value={newTicket.priority}
                    onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">Descripción</label>
                <textarea 
                  required className="glass-input min-h-[120px] py-4"
                  placeholder="Detalla la situación aquí..."
                  value={newTicket.description}
                  onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  type="button" onClick={() => setShowModal(false)}
                  className="glass-button-secondary py-4"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" disabled={saving}
                  className="glass-button py-4"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Registrar'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
