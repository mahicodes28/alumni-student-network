import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { UserPlus, Mail, Lock, User, Briefcase, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex-center animate-fade-in" style={{ padding: '3rem 0' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '2rem', width: '100%', maxWidth: '500px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Create Account</h2>
        
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--danger)', 
            padding: '1rem', 
            borderRadius: '10px', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={inputContainer}>
            <User size={20} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputContainer}>
            <Mail size={20} color="var(--text-secondary)" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputContainer}>
            <Lock size={20} color="var(--text-secondary)" />
            <input 
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ ...inputContainer, background: 'transparent', border: 'none', padding: '0' }}>
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <RoleOption 
                selected={formData.role === 'student'} 
                onClick={() => setFormData({...formData, role: 'student'})}
                label="Student"
                icon={<User size={18} />}
              />
              <RoleOption 
                selected={formData.role === 'alumni'} 
                onClick={() => setFormData({...formData, role: 'alumni'})}
                label="Alumni"
                icon={<Briefcase size={18} />}
              />
            </div>
          </div>

          <button type="submit" style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '1rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            marginTop: '1rem'
          }}>
            Create Account
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const RoleOption = ({ selected, onClick, label, icon }) => (
  <div 
    onClick={onClick}
    style={{
      flex: 1,
      padding: '1rem',
      borderRadius: '12px',
      border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
      background: selected ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-secondary)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s'
    }}
  >
    {icon} {label}
  </div>
);

const inputContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  background: 'var(--bg-secondary)',
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid var(--border)'
};

const inputStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  width: '100%',
  fontSize: '1rem'
};

export default Register;
