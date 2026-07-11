import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // 1. Handle LinkedIn OAuth Callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      window.history.replaceState({}, document.title, window.location.pathname);
      const loginWithLinkedIn = async () => {
        try {
          const res = await api.post('/linkedin-login', {
            code,
            redirectUri: `${window.location.origin}/login`
          });
          login(res.data);
          navigate('/dashboard');
        } catch (err) {
          setError(err.response?.data?.error || 'LinkedIn login failed');
        }
      };
      loginWithLinkedIn();
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
  }, []);

  const handleGoogleCallback = async (response) => {
    try {
      const res = await api.post('/google-login', {
        token: response.credential,
        role: 'student'
      });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Google login failed');
    }
  };

  const handleLinkedInLogin = () => {
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'MOCK_CLIENT_ID';
    const redirectUri = encodeURIComponent(`${window.location.origin}/login`);
    const state = 'linkedin_oauth_state';
    const scope = encodeURIComponent('openid profile email');
    
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
  };

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

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>or connect with</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginBottom: '1.5rem' }}>
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
            Sign in with LinkedIn
          </button>
        </div>

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