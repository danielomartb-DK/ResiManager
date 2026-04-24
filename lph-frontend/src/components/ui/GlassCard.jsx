export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div 
      className={`glass-panel overflow-hidden ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}
