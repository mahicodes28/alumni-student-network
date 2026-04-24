import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Users, Award } from 'lucide-react';

const Landing = () => {
  return (
    <div className="animate-fade-in">
      {/* HERO SECTION */}
      <section style={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        padding: '0 1rem'
      }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', fontWeight: '800' }}>
          AI-Powered <span style={{ color: 'var(--primary)' }}>Alumni Network</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2.5rem' }}>
          Connect with industry leaders, find mentors, and accelerate your career growth with the next generation of professional networking.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/register" style={btnPrimary}>Get Started</Link>
          <Link to="/login" style={btnSecondary}>Learn More</Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container" style={{ padding: '5rem 0' }}>
        <div className="grid-cards">
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

      {/* STATS */}
      <section style={{ background: 'var(--bg-secondary)', padding: '4rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          <StatItem value="500+" label="Alumni" />
          <StatItem value="200+" label="Students" />
          <StatItem value="100+" label="Mentorships" />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', transition: 'transform 0.3s' }}>
    <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
    <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)' }}>{desc}</p>
  </div>
);

const StatItem = ({ value, label }) => (
  <div style={{ textAlign: 'center' }}>
    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{value}</h2>
    <p style={{ color: 'var(--text-secondary)' }}>{label}</p>
  </div>
);

const btnPrimary = {
  background: 'var(--primary)',
  color: 'white',
  padding: '1rem 2rem',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '1.1rem'
};

const btnSecondary = {
  background: 'var(--bg-secondary)',
  color: 'white',
  padding: '1rem 2rem',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '1.1rem',
  border: '1px solid var(--border)'
};

export default Landing;
