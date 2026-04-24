import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Building2, CreditCard,
  Waves, HelpCircle, Shield, Settings, LogOut, Bell
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Panel de Control' },
  { to: '/users', icon: Users, label: 'Usuarios', roles: ['admin'] },
  { to: '/units', icon: Building2, label: 'Unidades', roles: ['admin','staff'] },
  { to: '/finance', icon: CreditCard, label: 'Finanzas', roles: ['admin','staff'] },
  { to: '/amenities', icon: Waves, label: 'Amenidades' },
  { to: '/pqrs', icon: HelpCircle, label: 'PQRS' },
  { to: '/security', icon: Shield, label: 'Seguridad', roles: ['admin','security'] },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
];

export default function Layout() {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();

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
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="mb-6 px-2">
          <div className="text-white font-bold text-lg tracking-wider">LPH Cloud</div>
          <div className="text-xs text-white/40 tracking-widest uppercase">Suite de Gestión</div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 flex-1">
          {visibleNav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
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
              <div className="text-white/40 text-xs capitalize">{role || 'invitado'}</div>
            </div>
          </div>
          <button onClick={handleSignOut} className="sidebar-item w-full text-red-400 hover:text-red-300">
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
