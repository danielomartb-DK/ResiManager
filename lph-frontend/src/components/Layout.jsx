import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Building2, CreditCard,
  Calendar, HelpCircle, Shield, Settings, LogOut, Bell,
  Menu, X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Panel de Control' },
  { to: '/users', icon: Users, label: 'Usuarios', roles: ['admin'] },
  { to: '/units', icon: Building2, label: 'Unidades', roles: ['admin','staff'] },
  { to: '/finance', icon: CreditCard, label: 'Finanzas', roles: ['admin','staff'] },
  { to: '/calendar', icon: Calendar, label: 'Calendario' },
  { to: '/pqrs', icon: HelpCircle, label: 'PQRS' },
  { to: '/security', icon: Shield, label: 'Seguridad', roles: ['admin','security'] },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
];

export default function Layout() {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const visibleNav = navItems.filter(item => !item.roles || item.roles.includes(role));

  return (
    <div className="main-layout">
      {/* Liquid Background */}
      <div className="liquid-background">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="blob blob-5" />
        <div className="blob blob-6" />
        <div className="blob blob-7" />
        <div className="blob blob-8" />
      </div>

      {/* Mobile Top Bar */}
      <div className="mobile-nav-toggle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-white font-bold tracking-tight">ResiManager</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-white/5 text-white/70 hover:text-white transition-all"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="mb-10 px-2 hidden lg:block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-white font-black text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ResiManager</span>
          </div>
          <div className="text-[12px] text-white/40 tracking-[0.2em] uppercase ml-1">LPH Cloud Suite</div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 flex-1">
          {visibleNav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Profile + Logout */}
        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {profile?.full_name?.[0] || 'U'}
            </div>
            <div>
              <div className="text-white text-sm font-medium truncate max-w-[110px]">{profile?.full_name || 'Usuario'}</div>
              <div className="text-[12px] text-white/40 uppercase tracking-tighter">{role || 'invitado'}</div>
            </div>
          </div>
          <button onClick={handleSignOut} className="sidebar-item w-full text-red-400 hover:bg-red-500/10">
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
