import { useState, useEffect } from 'react';
import { 
  Building2, Search, Filter, 
  MapPin, User, DollarSign, Edit2, 
  Plus, Loader2, ArrowUpDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Units() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [newUnit, setNewUnit] = useState({ unit_number: '', floor: '', type: 'Apartamento', status: 'vacant' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const res = await axios.get(`${API_URL}/units`);
      setUnits(res.data);
    } catch (error) {
      console.error('Error loading units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUnit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.post(`${API_URL}/units`, newUnit);
      setUnits([...units, res.data]);
      setShowModal(false);
      setNewUnit({ unit_number: '', floor: '', type: 'Apartamento', status: 'vacant' });
      alert('¡Unidad creada correctamente!');
    } catch (error) {
      alert('Error al crear unidad: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const filteredUnits = units.filter(u => {
    const matchesSearch = (u.unit_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ((u.resident?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-white/40">Sincronizando inventario de unidades...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventario de Unidades</h1>
          <p className="text-white/50">Control total de propiedades y ocupación.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="glass-button"
        >
          <Plus className="w-5 h-5" />
          Nueva Unidad
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Buscar por número o residente..."
            className="glass-input pl-16"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Filter className="w-4 h-4 text-white/30" />
          <select 
            className="glass-input flex-1 lg:w-48 py-2.5"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="occupied">Ocupada</option>
            <option value="vacant">Vacía</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
        </div>
      </div>

      {/* Units Grid/Table */}
      <div className="glass-panel overflow-hidden">
        <div className="table-responsive">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5">Unidad</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5">Residente Actual</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5">Saldo</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest text-center border-b border-white/5">Estado</th>
                <th className="px-8 py-5 text-[12px] font-bold text-white/40 uppercase tracking-widest text-right border-b border-white/5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUnits.length > 0 ? filteredUnits.map((unit, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={unit.id} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Unidad {unit.unit_number}</p>
                        <p className="text-[12px] text-white/30 uppercase font-medium mt-0.5">Piso {unit.floor} • {unit.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {unit.resident ? (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[12px] font-bold text-white/60">
                          {unit.resident.full_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{unit.resident.full_name}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-white/20 italic ml-1">Sin residente asignado</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-white/20" />
                      <span className={`text-sm font-bold ${unit.current_balance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        ${unit.current_balance?.toLocaleString() || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-block px-4 py-1.5 rounded-xl text-[12px] font-black border transition-all ${
                      unit.status === 'occupied' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                      unit.status === 'vacant' ? 'bg-slate-500/10 border-slate-500/20 text-slate-400' :
                      'bg-orange-500/10 border-orange-500/20 text-orange-400'
                    }`}>
                      {unit.status?.toUpperCase() || 'VACANT'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="glass-button-secondary p-3 rounded-xl hover:bg-white/10 transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center opacity-20">
                    <p className="text-xl font-bold">No se encontraron unidades</p>
                    <p className="text-sm mt-1">Intente ajustar los filtros de búsqueda</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Unidad */}
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
            <h2 className="text-2xl font-bold text-white mb-2">Nueva Unidad</h2>
            <p className="text-white/40 text-sm mb-8">Registre una propiedad en el sistema.</p>

            <form onSubmit={handleCreateUnit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">Número</label>
                  <input 
                    type="text" required className="glass-input"
                    placeholder="Ej: 101"
                    value={newUnit.unit_number}
                    onChange={e => setNewUnit({...newUnit, unit_number: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">Piso</label>
                  <input 
                    type="number" required className="glass-input"
                    placeholder="Ej: 1"
                    value={newUnit.floor}
                    onChange={e => setNewUnit({...newUnit, floor: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">Tipo de Unidad</label>
                <select 
                  className="glass-input"
                  value={newUnit.type}
                  onChange={e => setNewUnit({...newUnit, type: e.target.value})}
                >
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Local">Local</option>
                  <option value="Oficina">Oficina</option>
                </select>
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
                  {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
