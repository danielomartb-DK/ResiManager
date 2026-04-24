import { Shield, Eye, Lock, UserCheck, ChevronRight, Video, Activity } from 'lucide-react';

export default function Security() {
  const securityFeatures = [
    {
      title: 'Monitoreo en Vivo',
      description: 'Acceso a las cámaras de seguridad de áreas comunes.',
      icon: Video,
      color: '#3b82f6',
      status: 'Online'
    },
    {
      title: 'Control de Acceso',
      description: 'Registro de entrada y salida de visitantes y vehículos.',
      icon: UserCheck,
      color: '#10b981',
      status: 'Active'
    },
    {
      title: 'Alarmas y Alertas',
      description: 'Configuración de notificaciones críticas de seguridad.',
      icon: Activity,
      color: '#ef4444',
      status: 'Ready'
    }
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Centro de Seguridad</h1>
          <p className="text-white/50">Vigilancia en tiempo real y control de acceso.</p>
        </div>
        <button className="glass-button glass-button-danger">
          <Shield className="w-5 h-5" />
          Protocolo de Emergencia
        </button>
      </div>

      <div className="grid-cards">
        {securityFeatures.map((feature, idx) => (
          <div key={idx} className="glass-panel stat-card-premium group hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <span className="text-[12px] font-bold px-2 py-1 rounded bg-white/5 text-white/40 uppercase tracking-widest">
                {feature.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              {feature.description}
            </p>
            <button className="w-full glass-button-secondary py-3 text-xs">
              Abrir Panel
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Últimos Eventos
            </h2>
            <button className="text-[12px] font-bold text-blue-400 uppercase tracking-widest hover:underline">Ver Todo</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/20"></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">Ingreso Peatonal - Torre A</p>
                  <p className="text-[12px] text-white/40 uppercase">HACE 5 MINUTOS</p>
                </div>
                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" />
              Zonas Restringidas
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Cuarto de Máquinas', 'Azotea', 'Parqueadero Admin', 'Bodega General'].map((zone, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:bg-white/[0.08] transition-all">
                <p className="text-sm font-bold text-white mb-1">{zone}</p>
                <p className="text-[12px] text-green-400 font-bold uppercase tracking-widest">Asegurado</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
