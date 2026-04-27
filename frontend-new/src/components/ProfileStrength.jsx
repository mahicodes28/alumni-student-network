import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileStrength = ({ profile, userName }) => {
  const calculateStrength = () => {
    let strength = 0;
    
    // Name is usually always there if user exists
    if (userName && userName.trim().length > 0) strength += 20;
    
    // Check if skills is a non-empty string
    if (profile?.skills && profile.skills.trim().length > 0) strength += 30;
    
    // Check if interests or bio is a non-empty string
    const bioText = profile?.interests || profile?.bio || "";
    if (bioText.trim().length > 0) strength += 20;
    
    // Check if experience is a non-empty string
    if (profile?.experience && profile.experience.trim().length > 0) strength += 30;
    
    return strength;
  };

  const strength = calculateStrength();
  
  const getStrengthColor = () => {
    if (strength <= 30) return '#ef4444'; // Red
    if (strength <= 70) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  return (
    <div className="glass" style={{ 
      padding: '1.5rem', 
      borderRadius: '1.5rem', 
      marginBottom: '2rem',
      border: `1px solid ${strength === 100 ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={24} color={getStrengthColor()} />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Profile Strength: {strength}%</h3>
        </div>
        {strength < 100 && (
          <Link to="/profile" style={{ 
            color: 'var(--primary)', 
            fontSize: '0.85rem', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none'
          }}>
            Complete Profile <ArrowRight size={14} />
          </Link>
        )}
      </div>

      <div style={{ 
        height: '8px', 
        width: '100%', 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: '99px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          height: '100%', 
          width: `${strength}%`, 
          background: getStrengthColor(),
          transition: 'width 0.8s ease-in-out',
          boxShadow: `0 0 10px ${getStrengthColor()}44`
        }} />
      </div>
      
      {strength < 100 && (
        <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {strength < 50 ? "Add your skills and experience to stand out!" : "Almost there! Complete your profile to get better recommendations."}
        </p>
      )}
    </div>
  );
};

export default ProfileStrength;
