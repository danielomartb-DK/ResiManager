import { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, UserPlus, Search, 
  MoreHorizontal, Shield, Mail, 
  MapPin, Edit2, Trash2, Loader2,
  CheckCircle, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Users() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResidents(res.data);
    } catch (error) {
      console.error('Error loading residents:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/users/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResidents(residents.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const filteredResidents = residents.filter(r => 
    r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Residentes</h1>
          <p className="text-white/50 text-sm">Administra los accesos, unidades y roles de la comunidad.</p>
        </div>
        <button className="glass-button">
          <UserPlus className="w-5 h-5" />
          Registrar Residente
        </button>
      </div>

      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, email o unidad..."
            className="glass-input pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="text-xs text-white/40 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span> Activos: {residents.filter(r => r.status === 'active').length}
          </div>
          <div className="text-xs text-white/40 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> Inactivos: {residents.filter(r => r.status !== 'active').length}
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="table-responsive">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Residente</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Unidad</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Rol</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest text-center">Estado</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredResidents.map((res, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={res.id} 
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                        {res.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{res.full_name}</p>
                        <p className="text-[10px] text-white/30 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {res.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="text-sm font-semibold">Apto {res.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-tighter">
                      <Shield className="w-3.5 h-3.5" />
                      {res.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => toggleStatus(res.id, res.status)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                          res.status === 'active' 
                            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                      >
                        {res.status.toUpperCase()}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="glass-button-secondary p-2.5">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="glass-button-secondary p-2.5 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
