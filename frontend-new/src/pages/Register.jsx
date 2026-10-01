import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Sparkles, AlertCircle, User, GraduationCap } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/register', formData);
      alert('Registration successful! Logging you in...');
      const res = await api.post('/login', { email: formData.email, password: formData.password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-bg">
      <div className="card animate-fade-in" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem', background: '#ffffff', boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.6rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '0.4rem' }}>
            <Sparkles size={24} color="#6366f1" /> CareerPath <span style={{ color: '#6366f1' }}>AI</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Create Your Free AI Career Account</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.8rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Rohan Patel"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rohan@student.edu"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>I am joining as a:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div
                onClick={() => setFormData({ ...formData, role: 'student' })}
                style={{
                  padding: '0.8rem',
                  borderRadius: '10px',
                  border: `2px solid ${formData.role === 'student' ? '#1e3a8a' : '#e2e8f0'}`,
                  background: formData.role === 'student' ? '#e0e7ff' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: formData.role === 'student' ? '#1e3a8a' : '#475569'
                }}
              >
                🎓 Student
              </div>

              <div
                onClick={() => setFormData({ ...formData, role: 'alumni' })}
                style={{
                  padding: '0.8rem',
                  borderRadius: '10px',
                  border: `2px solid ${formData.role === 'alumni' ? '#0d9488' : '#e2e8f0'}`,
                  background: formData.role === 'alumni' ? '#ccfbf1' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: formData.role === 'alumni' ? '#0f766e' : '#475569'
                }}
              >
                💼 Industry Mentor
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', background: '#1e3a8a', marginTop: '0.5rem' }}>
            Build My Career Roadmap
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#1e3a8a', fontWeight: 700 }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
