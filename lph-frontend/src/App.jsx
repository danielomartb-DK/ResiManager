import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Units from './pages/Units';
import Finance from './pages/Finance';
import PQRS from './pages/PQRS';
import Amenities from './pages/Amenities';
import Security from './pages/Security';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function ProtectedRoute({ children, allowedRoles }) {
  const { session, role, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { session } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/units" element={<ProtectedRoute allowedRoles={['admin','staff']}><Units /></ProtectedRoute>} />
        <Route path="/finance" element={<ProtectedRoute allowedRoles={['admin','staff']}><Finance /></ProtectedRoute>} />
        <Route path="/pqrs" element={<ProtectedRoute><PQRS /></ProtectedRoute>} />
        <Route path="/amenities" element={<ProtectedRoute><Amenities /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute allowedRoles={['admin','security']}><Security /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
