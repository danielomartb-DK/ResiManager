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
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        captcha_token: captchaToken
      });

      const { token: jwtToken, user: userData } = response.data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setSession(jwtToken);
      setUser(userData);

      return { data: response.data, error: null };
    } catch (error) {
      const message = error.response?.data?.error || 'Error de conexión con el servidor';
      return { data: null, error: { message } };
    }
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
