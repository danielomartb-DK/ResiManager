import { useState, useEffect } from 'react';
import { 
  Dumbbell, Coffee, Waves, Music, 
  Clock, ChevronRight,
  Calendar as CalendarIcon, Users, PlusCircle, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import GlassInput from '../components/ui/GlassInput';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { getAmenities, createAmenity } from '../services/api';

const amenitySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  capacity: z.coerce.number().min(1, 'La capacidad debe ser mayor a 0'),
  time: z.string().min(3, 'Horario requerido (ej: 08:00 - 22:00)'),
  icon: z.string().default('Waves'),
});

export default function Calendar() {
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('Waves');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(amenitySchema),
    defaultValues: { icon: 'Waves' }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAmenities();
      setAmenities(data);
    } catch (error) {
      console.warn("Fallo API real, usando mock data", error);
      const mockAmenities = [
        { id: 1, name: 'Piscina Olímpica', status: 'available', icon: 'Waves', capacity: 20, time: '06:00 - 21:00' },
        { id: 2, name: 'Gimnasio Pro', status: 'maintenance', icon: 'Dumbbell', capacity: 15, time: '05:00 - 23:00' },
        { id: 3, name: 'Coworking Lounge', status: 'available', icon: 'Coffee', capacity: 30, time: '24/7' },
      ];
      setAmenities(mockAmenities);
      toast.error('Usando datos de prueba (API no disponible)');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Intento de llamar a API
      const newAm = await createAmenity(data);
      setAmenities([...amenities, newAm]);
      toast.success('Área creada exitosamente');
    } catch (err) {
      // Mock Fallback
      const newAm = { id: Date.now(), ...data, status: 'available' };
      setAmenities([...amenities, newAm]);
      toast.success('Área simulada creada localmente');
    }
    setShowAddModal(false);
    reset();
    setSelectedIcon('Waves');
  };

  const getIconComponent = (iconName) => {
    const icons = { Waves, Dumbbell, Coffee, Music };
    const Icon = icons[iconName] || Waves;
    return <Icon className="w-6 h-6 text-cyan-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header Section */}
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Calendario de Reservas</h1>
          <p className="text-white/50">Gestiona horarios, disponibilidad y solicitudes de áreas comunes.</p>
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
            Áreas
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
            {amenities.map((item) => (
              <GlassCard 
                key={item.id} 
                onClick={() => navigate(`/calendar/${item.id}`)}
                className="stat-card-premium group hover:border-cyan-500/30 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                    {getIconComponent(item.icon)}
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
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

                <GlassButton variant="secondary" className="w-full text-xs group/btn">
                  Ver Disponibilidad
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </GlassButton>
              </GlassCard>
            ))}

            {/* Add New Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="glass-panel border-dashed border-2 border-white/10 hover:border-cyan-500/30 flex flex-col items-center justify-center min-h-[280px] md:min-h-[340px] transition-all group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-8 h-8 text-white/20 group-hover:text-cyan-400" />
              </div>
              <p className="text-sm font-bold text-white/20 group-hover:text-white uppercase tracking-widest">Añadir Área</p>
            </motion.div>
          </motion.div>
        ) : (
          <EmptyState 
            key="requests"
            icon={CalendarIcon}
            title="No hay solicitudes pendientes"
            description="Cuando los residentes reserven áreas comunes, aparecerán aquí para tu aprobación."
          />
        )}
      </AnimatePresence>

      {/* Add Amenity Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Nueva Área Común">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GlassInput 
            label="Nombre del Área"
            placeholder="Ej: Salón Social"
            error={errors.name}
            {...register('name')}
          />

          <div className="grid grid-cols-2 gap-6">
            <GlassInput 
              label="Capacidad Máx."
              type="number"
              placeholder="20"
              error={errors.capacity}
              {...register('capacity')}
            />
            <GlassInput 
              label="Horario"
              placeholder="08:00 - 22:00"
              error={errors.time}
              {...register('time')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Icono Representativo</label>
            <div className="grid grid-cols-4 gap-4">
              {['Waves', 'Dumbbell', 'Coffee', 'Music'].map(iconName => (
                <button
                  type="button"
                  key={iconName}
                  onClick={() => {
                    setValue('icon', iconName);
                    setSelectedIcon(iconName);
                  }}
                  className={`p-4 rounded-2xl border transition-all ${
                    selectedIcon === iconName ? 'bg-cyan-500/20 border-cyan-500' : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  {getIconComponent(iconName)}
                </button>
              ))}
            </div>
          </div>

          <GlassButton 
            type="submit" 
            isLoading={isSubmitting} 
            icon={Save}
            className="w-full py-4 mt-4"
          >
            Crear Nueva Área
          </GlassButton>
        </form>
      </Modal>
    </div>
  );
}
