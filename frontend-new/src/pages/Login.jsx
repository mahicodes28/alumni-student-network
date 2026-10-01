import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';

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
    <div className="auth-bg">
      <div className="card animate-fade-in" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', background: '#ffffff', boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.6rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '0.4rem' }}>
            <Sparkles size={24} color="#6366f1" /> CareerPath <span style={{ color: '#6366f1' }}>AI</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>"Your Career Doesn't Need Guesswork."</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.8rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@demo.com"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%' }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', background: '#1e3a8a', marginTop: '0.5rem' }}>
            Log In to CareerPath AI
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b' }}>
          <strong>Quick Demo Account:</strong><br />
          Student: student@demo.com / Student123!<br />
          Industry Mentor: sarah.sharma@industry.org / Mentor123!
        </div>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
          New to CareerPath AI? <Link to="/register" style={{ color: '#1e3a8a', fontWeight: 700 }}>Register Free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;