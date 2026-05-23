import React from 'react';

import {
  Link,
  useLocation
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import {

  LogOut,
  MessageCircle,
  LayoutDashboard,
  Search,
  Shield,
  BriefcaseBusiness,
  UserCircle2,
  Sparkles

} from 'lucide-react';

const Navbar = () => {

  const { user, logout } = useAuth();

  const location = useLocation();

  const isLandingPage =
    location.pathname === '/';

  return (

    <nav className="navbar">

      {/* LOGO */}

      <Link
        to="/"
        className="logo"
      >

        <Sparkles size={22} />

        <span>
          AlumniConnect
        </span>

      </Link>

      {/* NAVIGATION */}

      <div className="nav-links">

        {user && !isLandingPage ? (

          <>

            {/* DASHBOARD */}

            <Link
              to="/dashboard"
              className="nav-link"
            >

              <LayoutDashboard size={18} />

              Dashboard

            </Link>

            {/* MESSAGES */}

            <Link
              to="/messages"
              className="nav-link"
            >

              <MessageCircle size={18} />

              Messages

            </Link>

            {/* OPPORTUNITIES */}

            <Link
              to="/broadcasts"
              className="nav-link"
            >

              <BriefcaseBusiness size={18} />

              Opportunities

            </Link>

            {/* STUDENT */}

            {user.role === 'student' && (

              <Link
                to="/alumni"
                className="nav-link"
              >

                <Search size={18} />

                Find Alumni

              </Link>

            )}

            {/* PROFILE */}

            <Link
              to="/profile"
              className="nav-link"
            >

              <UserCircle2 size={18} />

              Profile

            </Link>

            {/* ADMIN */}

            {user.role === 'admin' && (

              <Link
                to="/admin"
                className="nav-link"
              >

                <Shield size={18} />

                Admin

              </Link>

            )}

            {/* LOGOUT */}

            <button
              onClick={logout}
              className="logout-btn"
            >

              <LogOut size={18} />

              Logout

            </button>

          </>

        ) : (

          <>

            <Link
              to="/login"
              className="nav-link"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-btn"
            >
              Get Started
            </Link>

          </>

        )}

      </div>

      {/* CSS */}

      <style>{`

        .navbar{

          display:flex;

          justify-content:
          space-between;

          align-items:center;

          padding:1rem 2rem;

          position:sticky;

          top:0;

          z-index:1000;

          backdrop-filter:blur(20px);

          background:
          rgba(8,17,32,0.75);

          border-bottom:
          1px solid rgba(255,255,255,0.06);

        }

        /* LOGO */

        .logo{

          display:flex;

          align-items:center;

          gap:0.7rem;

          text-decoration:none;

          color:white;

          font-size:1.4rem;

          font-weight:700;

        }

        .logo span{

          background:
          linear-gradient(
            135deg,
            #60a5fa,
            #a78bfa
          );

          -webkit-background-clip:text;

          -webkit-text-fill-color:
          transparent;

        }

        /* NAV LINKS */

        .nav-links{

          display:flex;

          align-items:center;

          gap:1rem;

          flex-wrap:wrap;

        }

        .nav-link{

          display:flex;

          align-items:center;

          gap:0.5rem;

          text-decoration:none;

          color:#cbd5e1;

          padding:0.8rem 1rem;

          border-radius:12px;

          transition:0.25s;

          font-weight:500;

        }

        .nav-link:hover{

          background:
          rgba(59,130,246,0.12);

          color:white;

        }

        /* REGISTER */

        .register-btn{

          background:
          linear-gradient(
            135deg,
            #2563eb,
            #3b82f6
          );

          color:white;

          text-decoration:none;

          padding:0.8rem 1.3rem;

          border-radius:12px;

          font-weight:600;

        }

        /* LOGOUT */

        .logout-btn{

          border:none;

          background:
          rgba(239,68,68,0.12);

          color:#ef4444;

          padding:0.8rem 1rem;

          border-radius:12px;

          display:flex;

          align-items:center;

          gap:0.5rem;

          cursor:pointer;

          font-weight:600;

        }

        .logout-btn:hover{

          background:
          rgba(239,68,68,0.2);

        }

        /* MOBILE */

        @media(max-width:900px){

          .navbar{

            flex-direction:column;

            gap:1rem;

            padding:1rem;

          }

          .nav-links{

            justify-content:center;

          }

        }

      `}</style>

    </nav>

  );

};

export default Navbar;