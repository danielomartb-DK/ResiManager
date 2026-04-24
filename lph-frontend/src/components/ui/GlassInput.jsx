import { forwardRef } from 'react';

const GlassInput = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[12px] font-bold text-white/40 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <input 
        ref={ref}
        className={`glass-input w-full ${error ? 'border-red-500/50 focus:border-red-500' : ''}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1 ml-1 font-medium animate-fade-in">
          {error.message}
        </p>
      )}
    </div>
  );
});

GlassInput.displayName = 'GlassInput';

export default GlassInput;
