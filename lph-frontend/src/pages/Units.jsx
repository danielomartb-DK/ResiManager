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

  const filteredUnits = units.filter(u => {
    const matchesSearch = u.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (u.resident?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventario de Unidades</h1>
          <p className="text-white/50">Control total de propiedades y ocupación.</p>
        </div>
        <button className="glass-button">
          <Plus className="w-5 h-5" />
          Nueva Unidad
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Buscar por número o residente..."
            className="glass-input pl-12"
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
              <tr className="bg-white/5">
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest">Unidad</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest">Residente Actual</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest">Saldo</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest text-center">Estado</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUnits.length > 0 ? filteredUnits.map((unit, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  key={unit.id} 
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Unidad {unit.unit_number}</p>
                        <p className="text-[10px] text-white/30 uppercase font-medium">Piso {unit.floor} • {unit.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {unit.resident ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/60">
                          {unit.resident.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{unit.resident.full_name}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-white/20 italic">Sin residente asignado</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-white/20" />
                      <span className={`text-sm font-bold ${unit.current_balance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        ${unit.current_balance?.toLocaleString() || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border ${
                      unit.status === 'occupied' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                      unit.status === 'vacant' ? 'bg-slate-500/10 border-slate-500/30 text-slate-400' :
                      'bg-orange-500/10 border-orange-500/30 text-orange-400'
                    }`}>
                      {unit.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="glass-button-secondary p-2.5">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-white/20">
                    <p className="text-lg font-bold">No se encontraron unidades</p>
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
