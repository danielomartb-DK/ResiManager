import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const recaptchaRef = useRef();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Iniciando envío de formulario...');
    setError('');
    
    // Obtener token de reCAPTCHA
    const captchaToken = recaptchaRef.current?.getValue();
    console.log('Captcha Token obtenido:', !!captchaToken);
    if (!captchaToken) {
      setError('Por favor, verifique que no es un robot.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        console.log('Intentando signIn...');
        const { error } = await signIn(form.email, form.password, captchaToken);
        console.log('Resultado signIn:', error ? 'Error: ' + error.message : 'Éxito');
        if (error) {
          setError(error.message);
          recaptchaRef.current?.reset();
        } else {
          console.log('Navegando a dashboard...');
          navigate('/dashboard');
        }
      } else {
        if (!form.fullName) { setError('El nombre completo es obligatorio'); setLoading(false); return; }
        const { error } = await signUp(form.email, form.password, form.fullName);
        if (error) setError(error.message);
        else { setIsLogin(true); setError('¡Cuenta creada! Por favor inicie sesión.'); }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="liquid-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
      </div>

      <div className="glass-card">
        <div className="flare flare-title"></div>

        <div className="logo-container">
          <div className="logo">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 8L10 50H18L22 40H38L42 50H50L30 8Z" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
              <path d="M30 18L24 34H36L30 18Z" fill="rgba(255,255,255,0.5)"/>
              <line x1="42" y1="12" x2="46" y2="8" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="47" cy="7" r="1.5" fill="rgba(255,255,255,0.9)"/>
            </svg>
          </div>
        </div>

        <div className="header">
          <h1>{isLogin ? 'BIENVENIDO' : 'REGISTRO'}</h1>
          <p>{isLogin ? 'Inicie sesión para acceder a su\npanel personal' : 'Cree una cuenta para gestionar su\ncondominio'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Nombre Completo" 
                  value={form.fullName}
                  onChange={e => setForm({...form, fullName: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input 
                type="email" 
                placeholder="Correo Electrónico" 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <div className="flare flare-input"></div>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input 
                type="password" 
                placeholder="••••••" 
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </div>
          </div>

          {isLogin && (
            <div className="forgot-password">
              <a href="#">¿Olvidó su contraseña?</a>
            </div>
          )}

          {/* reCAPTCHA v2 Widget */}
          <div className="recaptcha-section" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              theme="dark"
            />
          </div>

          {error && <p style={{ fontSize: '12px', color: '#f87171', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            <div className="flare flare-btn"></div>
            {loading ? 'CARGANDO...' : (isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE')}
          </button>
        </form>

        <p className="signup-text">
          {isLogin ? '¿No tiene una cuenta? ' : '¿Ya tiene una cuenta? '}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Regístrese' : 'Inicie sesión'}
          </a>
        </p>

      </div>
    </div>
  );
}
