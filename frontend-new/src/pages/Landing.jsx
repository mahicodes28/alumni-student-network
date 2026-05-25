import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="animate-fade-in">
      
      {/* HERO SECTION */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 1rem',
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://png.pngtree.com/background/20250122/original/pngtree-the-internet-and-the-world-are-connected-in-a-blue-background-picture-image_13278188.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h1
          style={{
            fontSize: '4rem',
            marginBottom: '1.5rem',
            fontWeight: '800',
            color: 'white',
          }}
        >
          AI-Powered{' '}
          <span style={{ color: 'var(--primary)' }}>
            Alumni Network
          </span>
        </h1>

        <p
          style={{
            color: '#d1d5db',
            fontSize: '1.2rem',
            maxWidth: '700px',
            marginBottom: '2.5rem',
            lineHeight: '1.8',
          }}
        >
          Connect with industry leaders, find mentors, and accelerate your
          career growth with the next generation of professional networking.
        </p>

        {/* BUTTONS */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link
            to="/register"
            style={btnPrimary}
            className="hero-btn"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            style={btnSecondary}
            className="hero-btn"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section
        className="container"
        style={{
          padding: '5rem 0',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          className="grid-cards"
          style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FeatureCard
            icon={<Shield size={32} color="var(--primary)" />}
            title="Smart Search"
            desc="Find alumni based on skills, company, and domain with AI precision."
          />

          <FeatureCard
            icon={<Zap size={32} color="var(--primary)" />}
            title="Real-time Chat"
            desc="Instantly connect and message mentors in a seamless chat environment."
          />

          <FeatureCard
            icon={<Users size={32} color="var(--primary)" />}
            title="Mentorship"
            desc="Request guidance from professionals who have already walked your path."
          />
        </div>
      </section>

      {/* HOVER EFFECT CSS */}
      <style>
        {`
          .hero-btn {
            transition: all 0.3s ease;
            text-decoration: none;
          }

          .hero-btn:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
          }

          .feature-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
          }
        `}
      </style>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div
    className="glass feature-card"
    style={{
      padding: '2rem',
      borderRadius: '1.5rem',
      width: '320px',
      textAlign: 'center',
    }}
  >
    <div style={{ marginBottom: '1.5rem' }}>{icon}</div>

    <h3 style={{ marginBottom: '1rem', color: 'white' }}>
      {title}
    </h3>

    <p style={{ color: 'var(--text-secondary)' }}>
      {desc}
    </p>
  </div>
);

const btnPrimary = {
  background: 'var(--primary)',
  color: 'white',
  padding: '1rem 2rem',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '1.1rem',
  border: 'none',
};

const btnSecondary = {
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  padding: '1rem 2rem',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '1.1rem',
  border: '1px solid rgba(255,255,255,0.2)',
};

export default Landing;