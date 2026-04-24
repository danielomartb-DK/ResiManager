import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-panel overflow-hidden w-full"
    >
      <div className="p-16 md:p-24 text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-inner shadow-white/5 relative">
          <div className="absolute inset-0 rounded-full bg-cyan-500/5 animate-pulse" />
          <Icon className="w-10 h-10 text-white/20" />
        </div>
        
        <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
          {title}
        </h2>
        
        <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed mb-8">
          {description}
        </p>
        
        {action && (
          <div>
            {action}
          </div>
        )}
      </div>
    </motion.div>
  );
}
