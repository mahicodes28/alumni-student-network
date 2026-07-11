import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Handle LinkedIn OAuth Callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      window.history.replaceState({}, document.title, window.location.pathname);
      const registerWithLinkedIn = async () => {
        try {
          const res = await api.post('/linkedin-login', {
            code,
            role: formData.role,
            redirectUri: `${window.location.origin}/register`
          });
          login(res.data);
          navigate('/dashboard');
        } catch (err) {
          setError(err.response?.data?.error || 'LinkedIn registration failed');
        }
      };
      registerWithLinkedIn();
      return;
    }

    // 2. Initialize Google Sign-In
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "703350325492-2r21j92n6c88n0kbe104g9559c5d01p0.apps.googleusercontent.com",
          callback: handleGoogleCallback
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleBtn"),
          { theme: "outline", size: "large", width: "100%" }
        );
      } else {
        setTimeout(initGoogle, 100);
      }
    };
    initGoogle();
  }, [formData.role]);

  const handleGoogleCallback = async (response) => {
    try {
      const res = await api.post('/google-login', {
        token: response.credential,
        role: formData.role
      });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Google registration failed');
    }
  };

  const handleLinkedInLogin = () => {
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'MOCK_CLIENT_ID';
    const redirectUri = encodeURIComponent(`${window.location.origin}/register`);
    const state = 'linkedin_oauth_state';
    const scope = encodeURIComponent('openid profile email');
    
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
  };

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

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>or register with</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginBottom: '1rem' }}>
          <div id="googleBtn" style={{ width: '100%' }}></div>
          
          <button
            type="button"
            onClick={handleLinkedInLogin}
            style={{
              background: '#0077b5',
              color: 'white',
              padding: '0.65rem 1rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <svg style={{ width: '16px', height: '16px', fill: 'white' }} viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            Register with LinkedIn
          </button>
        </div>

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
