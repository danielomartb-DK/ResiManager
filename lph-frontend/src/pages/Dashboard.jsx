import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Users, Building2, CreditCard, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

export default function Dashboard() {
  const { role } = useAuth();
  const [stats, setStats] = useState({ residents: 0, units: 0, revenue: 0, arrears: 0, tickets: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [profilesRes, unitsRes, invoicesRes, arrearsRes, ticketsRes, activityRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('roles.name', 'resident'),
        supabase.from('units').select('id', { count: 'exact', head: true }),
        supabase.from('transactions').select('amount').eq('status', 'completed'),
        supabase.from('units').select('id', { count: 'exact', head: true }).eq('financial_status', 'arrears'),
        supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('transactions').select('*, profiles(full_name), units(unit_number)').order('payment_date', { ascending: false }).limit(5),
      ]);
      const totalRevenue = (invoicesRes.data || []).reduce((sum, t) => sum + Number(t.amount), 0);
      setStats({
        residents: profilesRes.count || 0,
        units: unitsRes.count || 0,
        revenue: totalRevenue,
        arrears: arrearsRes.count || 0,
        tickets: ticketsRes.count || 0,
      });
      setRecentActivity(activityRes.data || []);
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Residentes Totales', value: stats.residents, icon: Users, color: '#0ea5e9' },
    { label: 'Unidades Totales', value: stats.units, icon: Building2, color: '#a855f7' },
    { label: 'Recaudación Mensual', value: `$${stats.revenue.toLocaleString()}`, icon: CreditCard, color: '#4ade80' },
    { label: 'Unidades en Mora', value: stats.arrears, icon: AlertTriangle, color: '#f87171' },
    { label: 'PQRS Pendientes', value: stats.tickets, icon: Activity, color: '#fbbf24' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Panel Ejecutivo</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>Métricas de rendimiento en tiempo real y supervisión de la gestión del edificio.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px,1fr))', gap: 16, marginBottom: 28 }}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</span>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#fff' }}>{loading ? '...' : value}</div>
          </div>
        ))}
      </div>

      {/* Actividad Reciente */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>Actividad Reciente</h2>
          <span style={{ fontSize: 12, color: '#0ea5e9', cursor: 'pointer' }}>Ver Historial Completo →</span>
        </div>
        {recentActivity.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '32px 0' }}>No hay transacciones recientes aún.</p>
        ) : (
          <table className="glass-table">
            <thead><tr>
              <th>Residente</th><th>Unidad</th><th>Monto</th><th>Método</th><th>Fecha</th>
            </tr></thead>
            <tbody>
              {recentActivity.map(t => (
                <tr key={t.id}>
                  <td>{t.profiles?.full_name || '-'}</td>
                  <td>{t.units?.unit_number || '-'}</td>
                  <td style={{ color: '#4ade80', fontWeight: 600 }}>+${Number(t.amount).toLocaleString()}</td>
                  <td><span className="badge badge-cyan">{t.payment_method}</span></td>
                  <td style={{ color: 'rgba(255,255,255,0.5)' }}>{new Date(t.payment_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
