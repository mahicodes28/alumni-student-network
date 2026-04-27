import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, MessageCircle, LayoutDashboard, Search, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  return (
    <nav className="glass" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      marginBottom: '1rem'
    }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
        AlumniConnect 🚀
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {user && !isLandingPage ? (
          <>
            <Link to="/dashboard" style={linkStyle}><LayoutDashboard size={18} /> Dashboard</Link>
            <Link to="/messages" style={linkStyle}><MessageCircle size={18} /> Messages</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={linkStyle}><Shield size={18} /> Admin Console</Link>
            )}
            {user.role === 'student' && (
              <Link to="/alumni" style={linkStyle}><Search size={18} /> Find Alumni</Link>
            )}
            <button onClick={logout} style={{
              background: 'var(--danger)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={{
              background: 'var(--primary)',
              padding: '0.5rem 1.2rem',
              borderRadius: '8px',
              color: 'white'
            }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'var(--text-secondary)',
  fontWeight: '500',
  transition: 'color 0.3s'
};

export default Navbar;
