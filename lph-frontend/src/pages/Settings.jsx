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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -8, borderSecondary: 'rgba(255,255,255,0.2)' }}
            className="glass-panel p-8 flex flex-col justify-between min-h-[220px]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                <section.icon className="w-6 h-6" style={{ color: section.color }} />
              </div>
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
              <p className="text-white/40 text-[12px] mb-8 leading-relaxed">
                {section.description}
              </p>
            </div>
            <button className="glass-button-secondary w-full py-3.5 flex items-center justify-center gap-2 group text-[12px] font-bold uppercase tracking-widest">
              Configurar
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Formulario de Perfil Principal */}
      <div className="glass-panel p-10 md:p-12">
        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-white/5">
          <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-lg shadow-cyan-500/20"></div>
          <div>
            <h2 className="text-2xl font-bold text-white">Información General</h2>
            <p className="text-white/30 text-xs mt-1">Actualiza tus datos de contacto y preferencias.</p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                  type="text" 
                  defaultValue="Daniel Omar"
                  className="glass-input pl-14 py-4 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                  type="email" 
                  defaultValue="daniel@ejemplo.com"
                  className="glass-input pl-14 py-4 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Idioma de Interfaz</label>
              <div className="relative group">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                <select className="glass-input pl-14 py-4 text-sm appearance-none cursor-pointer">
                  <option>Español (Latinoamérica)</option>
                  <option>Inglés (USA)</option>
                  <option>Portugués (Brasil)</option>
                </select>
              </div>
            </div>

            <div className="flex items-end justify-end">
              <button className="glass-button w-full lg:w-auto px-12 py-5 shadow-2xl shadow-cyan-500/20 text-sm font-bold">
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
