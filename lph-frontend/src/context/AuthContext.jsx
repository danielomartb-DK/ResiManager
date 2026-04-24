import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL;

// Configuración global de Axios para incluir el token automáticamente
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (session && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setSession(null);
      }
    }
    setLoading(false);
  }, [session]);

  const signIn = async (email, password, captchaToken) => {
    // --- BYPASS TOTAL FRONTEND ---
    console.log('ENTRANDO EN MODO BYPASS DIRECTO');
    const mockToken = 'mock-jwt-token';
    const mockUser = { 
      id: 'mock-id', 
      email: email, 
      full_name: 'Admin ResiManager',
      role: 'admin' 
    };

    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    setSession(mockToken);
    setUser(mockUser);

    return { data: { token: mockToken, user: mockUser }, error: null };
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSession(null);
    setUser(null);
  };

  // Alias 'profile' para compatibilidad con Layout.jsx
  const profile = user;
  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{ user, profile, session, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
