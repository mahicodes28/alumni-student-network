import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, Mail, Briefcase, Code, Target, Save, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
    company: '',
    career_goal: '',
    interests: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/${user.user_id}`);
      if (res.data) {
        setFormData({
          skills: res.data.skills || '',
          experience: res.data.experience || '',
          company: res.data.company || '',
          career_goal: res.data.career_goal || '',
          interests: res.data.interests || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.put(`/profile/${user.user_id}`, formData);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '50vh' }}>Loading Profile...</div>;

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '5rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your professional information and skills.</p>
      </header>

      <div className="glass" style={{ padding: '3rem', borderRadius: '2rem' }}>
        {/* BASIC INFO (Read-only) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: '800'
          }}>
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{user.name}</h2>
            <p style={{ color: 'var(--primary)', fontWeight: '600', margin: '4px 0' }}>{user.role?.toUpperCase()}</p>
          </div>
        </div>

        {message && (
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.1)', 
            color: 'var(--success)', 
            padding: '1rem', 
            borderRadius: '12px', 
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <CheckCircle size={20} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={gridStyle}>
            <div style={inputGroup}>
              <label style={labelStyle}><Code size={16} /> Skills (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. Python, React, Data Science"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                style={inputStyle}
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}><Briefcase size={16} /> Current Company</label>
              <input 
                type="text" 
                placeholder="Where do you work?"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                style={inputStyle}
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}><Target size={16} /> Career Goals</label>
              <input 
                type="text" 
                placeholder="What are you aiming for?"
                value={formData.career_goal}
                onChange={(e) => setFormData({...formData, career_goal: e.target.value})}
                style={inputStyle}
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}><User size={16} /> Experience Level</label>
              <input 
                type="text" 
                placeholder="e.g. 2 years, Senior, Student"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Interests</label>
            <textarea 
              placeholder="Tell us about what interests you..."
              value={formData.interests}
              onChange={(e) => setFormData({...formData, interests: e.target.value})}
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '1rem',
              opacity: saving ? 0.7 : 1,
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            {saving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '2rem'
};

const inputGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  fontWeight: '500'
};

const inputStyle = {
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '1rem',
  color: 'white',
  fontSize: '1rem'
};

export default Profile;
