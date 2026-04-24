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

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', unit: '', role: 'resident' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`);
      setResidents(res.data);
    } catch (error) {
      console.error('Error loading residents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Nota: En un sistema real, aquí llamaríamos a un endpoint de creación
      // Por ahora, simularemos la persistencia o usaremos un endpoint existente si estuviera listo
      const res = await axios.post(`${API_URL}/admin/users`, newUser);
      setResidents([res.data, ...residents]);
      setShowModal(false);
      setNewUser({ full_name: '', email: '', unit: '', role: 'resident' });
      alert('¡Residente registrado con éxito!');
    } catch (error) {
      alert('Error al registrar residente: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.patch(`${API_URL}/admin/users/${id}/status`, { status: newStatus });
      setResidents(residents.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const filteredResidents = residents.filter(r => 
    (r.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.unit || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
        <p className="text-white/40">Cargando base de datos de residentes...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Residentes</h1>
          <p className="text-white/50">Administra los accesos, unidades y roles de la comunidad.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="glass-button"
        >
          <UserPlus className="w-5 h-5" />
          Registrar Residente
        </button>
      </div>

      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, email o unidad..."
            className="glass-input pl-14"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="text-[12px] text-white/40 flex items-center gap-2 font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></span> Activos: {residents.filter(r => r.status === 'active').length}
          </div>
          <div className="text-[12px] text-white/40 flex items-center gap-2 font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]"></span> Inactivos: {residents.filter(r => r.status !== 'active').length}
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="table-responsive">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5">Residente</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5">Unidad</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5">Rol</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest text-center border-b border-white/5">Estado</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest text-right border-b border-white/5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredResidents.length > 0 ? filteredResidents.map((res, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={res.id} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg">
                        {res.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{res.full_name}</p>
                        <p className="text-[12px] text-white/30 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" /> {res.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2.5 text-white/80">
                      <MapPin className="w-4 h-4 text-cyan-500" />
                      <span className="text-sm font-semibold">Apartamento {res.unit || 'S/N'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2.5 text-[12px] font-bold text-white/60 uppercase tracking-wider">
                      <Shield className="w-4 h-4 text-purple-400" />
                      {res.role}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => toggleStatus(res.id, res.status)}
                        className={`px-4 py-1.5 rounded-xl text-[12px] font-black border transition-all ${
                          res.status === 'active' 
                            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}
                      >
                        {res.status?.toUpperCase() || 'INACTIVE'}
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="glass-button-secondary p-3 rounded-xl hover:bg-white/10 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="glass-button-secondary p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center opacity-20">
                    <p className="text-lg font-bold">No hay residentes registrados</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Registro */}
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
            className="relative w-full max-w-md glass-panel p-10 bg-[#1e293b]"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Nuevo Residente</h2>
            <p className="text-white/40 text-sm mb-8">Registre un nuevo miembro en la comunidad.</p>

            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">Nombre Completo</label>
                <input 
                  type="text" required className="glass-input"
                  placeholder="Ej: Juan Pérez"
                  value={newUser.full_name}
                  onChange={e => setNewUser({...newUser, full_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">Correo Electrónico</label>
                <input 
                  type="email" required className="glass-input"
                  placeholder="juan@email.com"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">Unidad Asignada</label>
                <input 
                  type="text" required className="glass-input"
                  placeholder="Ej: 402"
                  value={newUser.unit}
                  onChange={e => setNewUser({...newUser, unit: e.target.value})}
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
                  {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Guardar'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
