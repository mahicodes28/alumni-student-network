import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquare,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Compass,
  FileCheck,
  Video
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setMobileOpen(false);

  return (
    <nav className="ac-navbar">
      <div className="ac-navbar-inner">
        {/* BRAND LOGO */}
        <Link to="/" className="ac-brand" onClick={closeMenu}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #1d4ed8 0%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(29, 78, 216, 0.25)'
          }}>
            <GraduationCap size={20} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>
            Alumni<span style={{ color: '#1d4ed8' }}>Connect</span>
          </span>
          <span className="ac-brand-badge">AI Powered</span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <ul className="ac-nav-links">
          {user ? (
            <>
              <li key="nav-dashboard">
                <Link
                  to="/dashboard"
                  className={`ac-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              </li>

              {user.role === 'student' && (
                <>
                  <li key="nav-mentors">
                    <Link
                      to="/mentors"
                      className={`ac-nav-link ${isActive('/mentors') || isActive('/alumni') ? 'active' : ''}`}
                    >
                      <Users size={17} />
                      Mentors
                    </Link>
                  </li>

                  <li key="nav-career-assistant">
                    <Link
                      to="/career-assistant"
                      className={`ac-nav-link ac-nav-link-ai ${isActive('/career-assistant') ? 'active' : ''}`}
                    >
                      <Sparkles size={17} />
                      AI Assistant
                    </Link>
                  </li>

                  <li key="nav-jobs">
                    <Link
                      to="/opportunities"
                      className={`ac-nav-link ${isActive('/opportunities') || isActive('/broadcasts') ? 'active' : ''}`}
                    >
                      <Briefcase size={17} />
                      Opportunities
                    </Link>
                  </li>
                </>
              )}

              {user.role === 'alumni' && (
                <>
                  <li key="nav-alumni-mentors">
                    <Link
                      to="/mentors"
                      className={`ac-nav-link ${isActive('/mentors') ? 'active' : ''}`}
                    >
                      <Users size={17} />
                      Requests
                    </Link>
                  </li>
                  <li key="nav-alumni-broadcasts">
                    <Link
                      to="/broadcasts"
                      className={`ac-nav-link ${isActive('/broadcasts') ? 'active' : ''}`}
                    >
                      <Briefcase size={17} />
                      Post Opportunities
                    </Link>
                  </li>
                </>
              )}

              {user.role === 'admin' && (
                <li key="nav-admin">
                  <Link
                    to="/admin"
                    className={`ac-nav-link ${isActive('/admin') ? 'active' : ''}`}
                  >
                    <Shield size={17} />
                    Admin Console
                  </Link>
                </li>
              )}

              <li key="nav-messages">
                <Link
                  to="/messages"
                  className={`ac-nav-link ${isActive('/messages') ? 'active' : ''}`}
                >
                  <MessageSquare size={17} />
                  Messages
                </Link>
              </li>

              <li key="nav-profile">
                <Link
                  to="/profile"
                  className={`ac-nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  <User size={17} />
                  Profile
                </Link>
              </li>

              <li key="nav-user-chip" style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="ac-badge ac-badge-neutral" style={{ textTransform: 'capitalize' }}>
                  {user.role}
                </span>
                <button
                  onClick={logout}
                  className="ac-btn ac-btn-outline ac-btn-sm"
                  title="Logout"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li key="nav-guest-how">
                <a href="/#how-it-works" className="ac-nav-link">
                  How It Works
                </a>
              </li>
              <li key="nav-guest-mentors">
                <a href="/#mentor-discovery" className="ac-nav-link">
                  Find Mentors
                </a>
              </li>
              <li key="nav-guest-ai">
                <a href="/#ai-assistant" className="ac-nav-link ac-nav-link-ai">
                  <Sparkles size={16} />
                  AI Guidance
                </a>
              </li>
              <li key="nav-guest-login" style={{ marginLeft: '0.75rem' }}>
                <Link to="/login" className="ac-btn ac-btn-outline ac-btn-sm">
                  Log In
                </Link>
              </li>
              <li key="nav-guest-register">
                <Link to="/register" className="ac-btn ac-btn-primary ac-btn-sm">
                  Find Your Mentor
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          className="ac-nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <div className={`ac-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {user ? (
          <>
            <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-title)' }}>{user.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                Role: {user.role}
              </div>
            </div>

            <Link to="/dashboard" className="ac-nav-link" onClick={closeMenu}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>

            {user.role === 'student' && (
              <>
                <Link to="/mentors" className="ac-nav-link" onClick={closeMenu}>
                  <Users size={18} /> Mentor Discovery
                </Link>
                <Link to="/career-assistant" className="ac-nav-link ac-nav-link-ai" onClick={closeMenu}>
                  <Sparkles size={18} /> AI Career Assistant
                </Link>
                <Link to="/opportunities" className="ac-nav-link" onClick={closeMenu}>
                  <Briefcase size={18} /> Opportunities & Jobs
                </Link>
                <Link to="/roadmap" className="ac-nav-link" onClick={closeMenu}>
                  <Compass size={18} /> Career Roadmap
                </Link>
                <Link to="/resume-ai" className="ac-nav-link" onClick={closeMenu}>
                  <FileCheck size={18} /> AI Resume Analyzer
                </Link>
                <Link to="/mock-interview" className="ac-nav-link" onClick={closeMenu}>
                  <Video size={18} /> Mock Interview
                </Link>
              </>
            )}

            {user.role === 'alumni' && (
              <>
                <Link to="/mentors" className="ac-nav-link" onClick={closeMenu}>
                  <Users size={18} /> Mentorship Requests
                </Link>
                <Link to="/broadcasts" className="ac-nav-link" onClick={closeMenu}>
                  <Briefcase size={18} /> Broadcast Opportunities
                </Link>
              </>
            )}

            {user.role === 'admin' && (
              <Link to="/admin" className="ac-nav-link" onClick={closeMenu}>
                <Shield size={18} /> Admin Console
              </Link>
            )}

            <Link to="/messages" className="ac-nav-link" onClick={closeMenu}>
              <MessageSquare size={18} /> Messages
            </Link>
            <Link to="/profile" className="ac-nav-link" onClick={closeMenu}>
              <User size={18} /> My Profile
            </Link>

            <button
              onClick={() => { closeMenu(); logout(); }}
              className="ac-btn ac-btn-outline"
              style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <a href="/#how-it-works" className="ac-nav-link" onClick={closeMenu}>
              How It Works
            </a>
            <a href="/#mentor-discovery" className="ac-nav-link" onClick={closeMenu}>
              Find Mentors
            </a>
            <a href="/#ai-assistant" className="ac-nav-link ac-nav-link-ai" onClick={closeMenu}>
              <Sparkles size={18} /> AI Guidance
            </a>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/login" className="ac-btn ac-btn-outline" onClick={closeMenu} style={{ width: '100%', justifyContent: 'center' }}>
                Log In
              </Link>
              <Link to="/register" className="ac-btn ac-btn-primary" onClick={closeMenu} style={{ width: '100%', justifyContent: 'center' }}>
                Find Your Mentor
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;