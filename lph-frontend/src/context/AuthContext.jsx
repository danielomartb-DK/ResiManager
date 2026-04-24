import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si hay un token, podríamos validar su vigencia aquí o simplemente cargar el usuario del localStorage
    const savedUser = localStorage.getItem('user');
    if (session && savedUser) {
      setUser(JSON.parse(savedUser));
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
      const message = error.response?.data?.error || 'Error de conexión';
      return { data: null, error: { message } };
    }
  };

  const signUp = async (email, password, fullName) => {
    // Mantenemos el registro directo con Supabase por ahora como flujo alterno
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!error && data.user) {
      const { data: roleData } = await supabase.from('roles').select('id').eq('name', 'resident').single();
      await supabase.from('profiles').insert([{
        id: data.user.id,
        full_name: fullName,
        email,
        role_id: roleData?.id,
        status: 'active'
      }]);
    }
    return { data, error };
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSession(null);
    setUser(null);
  };

  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
