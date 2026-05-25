import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/login', { email, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div
      className="animate-fade-in auth-bg"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}
    >
      <div
        className="glass"
        style={{
          padding: '3rem',
          borderRadius: '2rem',
          width: '100%',
          maxWidth: '450px',
          background: 'rgba(2, 6, 23, 0.75)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.45)'
        }}
      >
        <h2
          style={{
            fontSize: '2.5rem',
            marginBottom: '2rem',
            textAlign: 'center',
            fontWeight: '800',
            color: 'white'
          }}
        >
          Welcome Back
        </h2>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {/* EMAIL */}
          <div style={inputContainer}>
            <Mail size={20} color="#94a3b8" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* PASSWORD */}
          <div style={inputContainer}>
            <Lock size={20} color="#94a3b8" />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="hero-btn"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '1rem',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: '700',
              marginTop: '1rem',
              border: 'none'
            }}
          >
            Login
          </button>
        </form>

        <p
          style={{
            marginTop: '2rem',
            textAlign: 'center',
            color: '#94a3b8'
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#3b82f6',
              fontWeight: '600'
            }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

const inputContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  background: 'rgba(255,255,255,0.06)',
  padding: '1rem',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.08)'
};

const inputStyle = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'white',
  width: '100%',
  fontSize: '1rem'
};

export default Login;