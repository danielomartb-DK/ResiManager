import { User, Shield, Bell, CreditCard, ChevronRight, Save, Globe, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const sections = [
    {
      title: 'Perfil',
      description: 'Gestiona tu información personal y foto de perfil.',
      icon: User,
      color: '#3b82f6'
    },
    {
      title: 'Seguridad',
      description: 'Cambia tu contraseña y activa el doble factor.',
      icon: Shield,
      color: '#ef4444'
    },
    {
      title: 'Notificaciones',
      description: 'Configura cómo y cuándo quieres recibir alertas.',
      icon: Bell,
      color: '#f59e0b'
    },
    {
      title: 'Pagos y Facturación',
      description: 'Administra tus métodos de pago y revisa historial.',
      icon: CreditCard,
      color: '#10b981'
    }
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ajustes</h1>
          <p className="text-white/50">Gestiona tus preferencias de cuenta y seguridad.</p>
        </div>
      </div>

      {/* Grid de Secciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="glass-panel p-6 flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <section.icon className="w-5 h-5" style={{ color: section.color }} />
              </div>
              <h3 className="text-lg font-bold text-white">{section.title}</h3>
            </div>
            <p className="text-white/40 text-xs mb-6 leading-relaxed">
              {section.description}
            </p>
            <button className="glass-button-secondary w-full py-2.5 flex items-center justify-center gap-2 group">
              Configurar
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Formulario de Perfil Principal */}
      <div className="glass-panel p-8 md:p-10">
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
          <div className="w-1.5 h-6 bg-cyan-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">Información General</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Columna Izquierda */}
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Nombre Completo</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                  type="text" 
                  defaultValue="Daniel Omar"
                  className="glass-input pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                  type="email" 
                  defaultValue="daniel@ejemplo.com"
                  className="glass-input pl-12"
                />
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Idioma</label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                <select className="glass-input pl-12 appearance-none">
                  <option>Español</option>
                  <option>Inglés</option>
                  <option>Portugués</option>
                </select>
              </div>
            </div>

            <div className="flex items-end h-full">
              <button className="glass-button w-full md:w-auto px-10 py-4 shadow-xl shadow-cyan-500/10">
                <Save className="w-5 h-5" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
