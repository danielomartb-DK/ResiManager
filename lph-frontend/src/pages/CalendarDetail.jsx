import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Clock, Users, Calendar as CalendarIcon, 
  Info, ShieldCheck, MapPin, Loader2, Plus, 
  Trash2, Edit3, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CalendarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // En un caso real, buscaríamos los datos por ID
  const amenity = {
    name: 'Piscina Olímpica',
    status: 'available',
    capacity: 20,
    time: '06:00 - 21:00',
    location: 'Nivel 1 - Zona Norte',
    rules: [
      'Uso obligatorio de gorro de baño.',
      'No se permite el ingreso de alimentos.',
      'Niños deben estar acompañados por un adulto.',
      'Ducha obligatoria antes de ingresar.'
    ]
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header with Back Button */}
      <div className="flex flex-col gap-6">
        <button 
          onClick={() => navigate('/calendar')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-all w-fit group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Volver al Calendario</span>
        </button>

        <div className="page-header !mb-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{amenity.name}</h1>
            <p className="text-white/50 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-500" />
              {amenity.location}
            </p>
          </div>
          <div className="flex gap-4">
            <button className="glass-button-secondary py-3 px-6">
              <Edit3 className="w-4 h-4" />
              Editar Área
            </button>
            <button className="glass-button py-3 px-8">
              <Plus className="w-5 h-5" />
              Nueva Reserva
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid-stats">
            <div className="glass-panel p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-cyan-500/10">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-[12px] font-bold text-white/30 uppercase tracking-widest">Aforo Máximo</p>
              </div>
              <h3 className="text-3xl font-bold text-white">{amenity.capacity} Personas</h3>
            </div>
            <div className="glass-panel p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-[12px] font-bold text-white/30 uppercase tracking-widest">Horario de Uso</p>
              </div>
              <h3 className="text-3xl font-bold text-white">{amenity.time}</h3>
            </div>
          </div>

          {/* Rules / Regulations */}
          <div className="glass-panel p-10">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">Normas de Convivencia</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {amenity.rules.map((rule, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Schedule Preview */}
        <div className="space-y-8">
          <div className="glass-panel p-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-cyan-500" />
              Próximas Reservas
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-white">Familia Rodriguez</p>
                    <button className="text-white/20 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-white/40 font-bold uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    Hoy, 14:00 - 16:00
                  </div>
                </div>
              ))}
              <button className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-white/20 text-xs font-bold uppercase tracking-widest hover:border-cyan-500/30 hover:text-white transition-all">
                Ver Calendario Completo
              </button>
            </div>
          </div>

          <div className="glass-panel p-8 bg-cyan-500/5 border-cyan-500/20">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              Soporte
            </h2>
            <p className="text-xs text-white/40 leading-relaxed mb-6">
              ¿Tienes algún problema con este área común o necesitas reportar un daño?
            </p>
            <button className="w-full glass-button-secondary py-3 flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Reportar Incidencia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
