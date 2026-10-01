import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  MessageCircle,
  LayoutDashboard,
  Search,
  Shield,
  BriefcaseBusiness,
  UserCircle2,
  Sparkles,
  Compass,
  GraduationCap,
  Target,
  BookOpen,
  FileCheck,
  Video,
  Award,
  Layers,
  MapPin
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="cp-navbar">
      <div className="cp-navbar-container">
        {/* LOGO */}
        <Link to="/" className="cp-logo">
          <Sparkles size={24} color="#6366f1" />
          CareerPath <span>AI</span>
        </Link>

        {/* NAV LINKS */}
        <div className="cp-nav-links">
          {user ? (
            <>
              <Link to="/dashboard" className={`cp-nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              {user.role === 'student' && (
                <>
                  <Link to="/career-ai" className={`cp-nav-item ${isActive('/career-ai') ? 'active' : ''}`}>
                    <Sparkles size={18} color="#6366f1" />
                    Career AI
                  </Link>

                  <Link to="/skill-gap" className={`cp-nav-item ${isActive('/skill-gap') ? 'active' : ''}`}>
                    <Target size={18} />
                    Skill Gap
                  </Link>

                  <Link to="/roadmap" className={`cp-nav-item ${isActive('/roadmap') ? 'active' : ''}`}>
                    <Compass size={18} />
                    Roadmap
                  </Link>

                  <Link to="/learning" className={`cp-nav-item ${isActive('/learning') ? 'active' : ''}`}>
                    <BookOpen size={18} />
                    Learning
                  </Link>

                  <Link to="/opportunities" className={`cp-nav-item ${isActive('/opportunities') || isActive('/broadcasts') ? 'active' : ''}`}>
                    <BriefcaseBusiness size={18} />
                    Jobs
                  </Link>

                  <Link to="/mentors" className={`cp-nav-item ${isActive('/mentors') || isActive('/alumni') ? 'active' : ''}`}>
                    <GraduationCap size={18} />
                    Mentors
                  </Link>

                  <Link to="/resume-ai" className={`cp-nav-item ${isActive('/resume-ai') ? 'active' : ''}`}>
                    <FileCheck size={18} />
                    Resume AI
                  </Link>

                  <Link to="/mock-interview" className={`cp-nav-item ${isActive('/mock-interview') ? 'active' : ''}`}>
                    <Video size={18} />
                    Interview
                  </Link>

                  <Link to="/government-jobs" className={`cp-nav-item ${isActive('/government-jobs') ? 'active' : ''}`}>
                    <Award size={18} />
                    Govt Jobs
                  </Link>
                </>
              )}

              {user.role === 'alumni' && (
                <>
                  <Link to="/mentors" className={`cp-nav-item ${isActive('/mentors') ? 'active' : ''}`}>
                    <GraduationCap size={18} />
                    Requests
                  </Link>
                  <Link to="/broadcasts" className={`cp-nav-item ${isActive('/broadcasts') ? 'active' : ''}`}>
                    <BriefcaseBusiness size={18} />
                    Post Jobs
                  </Link>
                </>
              )}

              <Link to="/messages" className={`cp-nav-item ${isActive('/messages') ? 'active' : ''}`}>
                <MessageCircle size={18} />
                Messages
              </Link>

              <Link to="/profile" className={`cp-nav-item ${isActive('/profile') ? 'active' : ''}`}>
                <UserCircle2 size={18} />
                Profile
              </Link>

              {user.role === 'admin' && (
                <Link to="/admin" className={`cp-nav-item ${isActive('/admin') ? 'active' : ''}`}>
                  <Shield size={18} />
                  Admin
                </Link>
              )}

              <button onClick={logout} className="btn btn-outline" style={{ padding: '0.45rem 0.9rem', fontSize: '0.88rem' }}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;