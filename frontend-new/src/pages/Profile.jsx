import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Briefcase,
  Code,
  Target,
  Save,
  CheckCircle,
  ExternalLink,
  GitBranch,
  Globe,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Award
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    degree: '',
    branch: '',
    college: '',
    year: '',
    cgpa: '',
    target_role: 'Data Analyst',
    skills: '',
    soft_skills: '',
    tools: '',
    programming_languages: '',
    experience: '',
    projects: '',
    company: '',
    career_goal: '',
    interests: '',
    bio: '',
    education: '',
    certifications: '',
    achievements: '',
    linkedin: '',
    github: '',
    portfolio: '',
    availability: 'Available for mentorship'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const id = user.user_id || user.id || user._id;
      const res = await api.get(`/profile/${id}`);
      if (res.data && !res.data.error) {
        setFormData(prev => ({
          ...prev,
          ...res.data,
          skills: res.data.skills || '',
          experience: res.data.experience || '',
          target_role: res.data.target_role || res.data.career_goal || 'Data Analyst'
        }));
        setCompletion(res.data.completion_score || 82);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const id = user.user_id || user.id || user._id;
      await api.put(`/profile/${id}`, formData);
      setMessage('Profile saved successfully! AI Career Intelligence updated.');
      fetchProfile();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="cp-container" style={{ textAlign: 'center', padding: '4rem 0' }}>Loading Profile...</div>;
  }

  return (
    <div className="cp-container animate-fade-in">
      
      {/* HEADER HERO */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a8a, #6366f1)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800 }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{user.name}</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Target Role: <strong style={{ color: '#1e3a8a' }}>{formData.target_role || 'Data Analyst'}</strong>
            </p>
            <div style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={14} /> {formData.availability}
            </div>
          </div>
        </div>

        {/* COMPLETENESS BOX */}
        <div style={{ textAlign: 'center', background: '#f8fafc', padding: '1.2rem 1.8rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>PROFILE COMPLETENESS</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e3a8a', margin: '0.2rem 0' }}>{completion}%</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Add projects to boost AI analysis</div>
        </div>
      </div>

      {message && (
        <div className="card" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckCircle size={18} /> {message}
        </div>
      )}

      {/* EDIT FORM */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* ACADEMIC & TARGET GOAL */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} color="#1e3a8a" /> Academic & Target Goal
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Target Role</label>
              <select value={formData.target_role} onChange={(e) => setFormData({ ...formData, target_role: e.target.value })} style={{ width: '100%' }}>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Cloud Engineer">Cloud & DevOps Engineer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Degree & Branch</label>
              <input value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} placeholder="B.Tech CS / MCA / B.Sc Data Science" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>College / University</label>
              <input value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} placeholder="Institute of Technology" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Academic Year & CGPA</label>
              <input value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} placeholder="4th Year / 8.4 CGPA" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* SKILLS & TOOLS */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={20} color="#0d9488" /> Technical & Soft Skills
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Technical Skills (Comma Separated)</label>
              <input value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="Python, SQL, Power BI, Statistics, Pandas" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Tools & Frameworks</label>
              <input value={formData.tools} onChange={(e) => setFormData({ ...formData, tools: e.target.value })} placeholder="Power BI, VS Code, Jupyter, Git, Docker" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Soft Skills</label>
              <input value={formData.soft_skills} onChange={(e) => setFormData({ ...formData, soft_skills: e.target.value })} placeholder="Problem Solving, Communication, Critical Thinking" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* PROJECTS & EXPERIENCE */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} color="#6366f1" /> Projects & Experience
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Academic & Portfolio Projects</label>
            <textarea rows={4} value={formData.projects} onChange={(e) => setFormData({ ...formData, projects: e.target.value })} placeholder="1. E-commerce Sales Performance Dashboard (Power BI, SQL)&#10;2. Customer Churn Prediction Model (Python, Scikit-Learn)" style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Work / Internship Experience</label>
            <textarea rows={3} value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} placeholder="Detail summer internships, part-time tech roles, or lab assistantships..." style={{ width: '100%' }} />
          </div>
        </div>

        {/* ACHIEVEMENTS & LINKS */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="#b45309" /> Certifications & Portfolio Links
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Certifications</label>
              <input value={formData.certifications} onChange={(e) => setFormData({ ...formData, certifications: e.target.value })} placeholder="Google Data Analytics, AWS Cloud Practitioner" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>LinkedIn Profile</label>
              <input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/yourprofile" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>GitHub URL</label>
              <input value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="https://github.com/yourusername" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', background: '#1e3a8a' }} disabled={saving}>
          <Save size={18} /> {saving ? 'Saving Profile...' : 'Save Profile & Update AI Engine'}
        </button>
      </form>
    </div>
  );
};

export default Profile;