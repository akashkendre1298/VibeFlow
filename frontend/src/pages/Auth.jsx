import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import FloatingCardsScene from '../components/FloatingCardsScene';

const LoginForm = ({ onFlip }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="auth-card">
      <h2 style={{ textAlign: 'center', color: 'var(--primary-color)' }}>VibeFlow</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Login to your account</p>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button type="submit" className="primary" style={{ width: '100%', marginTop: '20px' }}>Log In</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don't have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={onFlip}>Register</span>
      </p>
    </div>
  );
};

const RegisterForm = ({ onFlip }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password, name });
      toast.success('Registration successful! Please login.');
      onFlip();
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="auth-card">
      <h2 style={{ textAlign: 'center', color: 'var(--primary-color)' }}>VibeFlow</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Create your account</p>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button type="submit" className="primary" style={{ width: '100%', marginTop: '20px' }}>Sign Up</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={onFlip}>Login</span>
      </p>
    </div>
  );
};

const Auth = () => {
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(location.pathname === '/register');

  const toggleFlip = () => {
    const newState = !isRegister;
    setIsRegister(newState);
    window.history.pushState({}, '', newState ? '/register' : '/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-image-panel">
        <FloatingCardsScene />
      </div>
      <div className="auth-form-panel">
        <div className="flip-container">
          <div className={`flip-inner ${isRegister ? 'flipped' : ''}`}>
            <div className="flip-front">
              <LoginForm onFlip={toggleFlip} />
            </div>
            <div className="flip-back">
              <RegisterForm onFlip={toggleFlip} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
