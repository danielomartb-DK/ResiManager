import { useState, useEffect } from 'react';
import { 
  Dumbbell, Coffee, Waves, Music, 
  Clock, CheckCircle, XCircle, ChevronRight,
  Calendar, Users, Info, Loader2, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Amenities() {
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'requests'
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Mock data for amenities based on icons
      const mockAmenities = [
        { name: 'Piscina Olímpica', status: 'available', icon: Waves, capacity: 20, time: '06:00 - 21:00' },
        { name: 'Gimnasio Pro', status: 'maintenance', icon: Dumbbell, capacity: 15, time: '05:00 - 23:00' },
        { name: 'Coworking Lounge', status: 'available', icon: Coffee, capacity: 30, time: '24/7' },
        { name: 'Sala de Cine', status: 'available', icon: Music, capacity: 12, time: '10:00 - 22:00' },
      ];
      setAmenities(mockAmenities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching amenities data:', error);
      setError(`Error: ${error.response?.data?.error || error.message || 'Error de conexión'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header Section */}
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Zonas Comunes</h1>
          <p className="text-white/50">Gestiona inventario de amenidades y solicitudes de reserva.</p>
        </div>
        
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'inventory' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            Inventario
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'requests' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            Solicitudes
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'inventory' ? (
          <motion.div 
            key="inventory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid-cards"
          >
            {amenities.map((item, idx) => (
              <div key={idx} className="glass-panel stat-card-premium group hover:border-cyan-500/30 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                    <item.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className={`text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                    item.status === 'available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {item.status === 'available' ? 'Disponible' : 'Mantenimiento'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">{item.name}</h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-white/40 text-xs">
                    <Users className="w-4 h-4" />
                    Capacidad: {item.capacity} personas
                  </div>
                  <div className="flex items-center gap-3 text-white/40 text-xs">
                    <Clock className="w-4 h-4" />
                    Horario: {item.time}
                  </div>
                </div>

                <button className="glass-button-secondary w-full py-3 text-xs flex items-center justify-center gap-2 group/btn">
                  Gestionar Amenidad
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}

            {/* Add New Card */}
            <div className="glass-panel border-dashed border-2 border-white/10 hover:border-cyan-500/30 flex flex-col items-center justify-center p-12 transition-all group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-8 h-8 text-white/20 group-hover:text-cyan-400" />
              </div>
              <p className="text-sm font-bold text-white/20 group-hover:text-white">Añadir Amenidad</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel overflow-hidden"
          >
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-white/10" />
              </div>
              <h2 className="text-xl font-bold text-white">No hay solicitudes pendientes</h2>
              <p className="text-white/40 text-sm max-w-xs mx-auto">Cuando los residentes reserven áreas comunes, aparecerán aquí para tu aprobación.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
