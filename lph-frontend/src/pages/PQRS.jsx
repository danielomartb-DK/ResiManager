import { useState, useEffect } from 'react';
import { 
  Inbox, Search, Filter, MessageSquare, 
  Clock, AlertCircle, CheckCircle2, ChevronRight,
  User, Building, Calendar, Loader2, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function PQRS() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/pqrs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(res.data.data);
      if (res.data.data.length > 0) setSelectedTicket(res.data.data[0]);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError(`Error: ${error.response?.data?.error || error.message || 'Error de conexión'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
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

        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
          {['all', 'pending', 'in-progress', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : f === 'in-progress' ? 'En Proceso' : 'Resueltos'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden min-h-0 mt-2">
        {/* Lista de Tickets */}
        <div className={`w-full md:w-[400px] flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar ${selectedTicket && 'hidden md:flex'}`}>
          <div className="relative mb-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="Buscar ticket o residente..."
              className="glass-input pl-12 py-3"
            />
          </div>

          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`glass-panel p-5 cursor-pointer border-l-4 transition-all hover:bg-white/5 ${
                  selectedTicket?.id === ticket.id ? 'border-cyan-500 bg-white/5' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">#{ticket.id.slice(0, 8)}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    ticket.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">{ticket.title}</h3>
                <div className="flex items-center gap-3 text-[11px] text-white/40">
                  <User className="w-3 h-3" />
                  {ticket.profiles?.full_name}
                </div>
              </motion.div>
            ))}
            
            {filteredTickets.length === 0 && (
              <div className="py-20 text-center text-white/20">
                <Inbox className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-bold">No hay tickets</p>
              </div>
            )}
          </div>
        </div>

        {/* Detalle del Ticket */}
        <div className={`flex-1 ${!selectedTicket && 'hidden md:block'}`}>
          {selectedTicket ? (
            <div className="glass-panel h-full flex flex-col overflow-hidden">
              <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-start">
                <div>
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="md:hidden flex items-center gap-2 text-white/40 mb-4 text-xs font-bold uppercase tracking-widest"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Volver
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase">
                      {selectedTicket.status}
                    </span>
                    <span className="text-white/20 text-xs">Registrado el {new Date(selectedTicket.created_at).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedTicket.title}</h2>
                </div>
                <button className="p-3 rounded-2xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-white/5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-cyan-500/20">
                    {selectedTicket.profiles?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Solicitado por</p>
                    <h3 className="text-xl font-bold text-white">{selectedTicket.profiles?.full_name}</h3>
                    <p className="text-xs text-white/40">Residente de la Torre A - 402</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <p className="text-[10px] font-bold text-white/30 uppercase mb-2 tracking-widest">Unidad Relacionada</p>
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-cyan-500" />
                      <p className="text-sm font-bold text-white">Apartamento 402</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <p className="text-[10px] font-bold text-white/30 uppercase mb-2 tracking-widest">Categoría de PQRS</p>
                    <div className="flex items-center gap-3">
                      <Info className="w-4 h-4 text-purple-500" />
                      <p className="text-sm font-bold text-white capitalize">{selectedTicket.category}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest text-white/40">Descripción</h3>
                  <p className="text-white/70 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5">
                    {selectedTicket.description}
                  </p>
                </div>
              </div>

              <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-end gap-4">
                <button className="glass-button-secondary py-3 px-8">
                  Asignar Staff
                </button>
                <button className="glass-button py-3 px-10">
                  Responder Ticket
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel h-full flex flex-col items-center justify-center text-center p-20 opacity-30">
              <MessageSquare className="w-16 h-16 mb-6" />
              <h2 className="text-2xl font-bold">Selecciona un ticket para ver detalles</h2>
              <p className="max-w-xs mt-2">Gestiona las solicitudes de manera eficiente revisando la información detallada aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
