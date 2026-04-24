import { Loader2 } from 'lucide-react';

export default function GlassButton({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon: Icon,
  className = '', 
  ...props 
}) {
  const baseClasses = "relative flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "glass-button",
    secondary: "glass-button-secondary",
    danger: "px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 shadow-lg shadow-red-500/10",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
}
