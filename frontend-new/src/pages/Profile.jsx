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
  Award,
  Building2
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
    title: '',
    domain: 'Software Engineering',
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

  const userId = user?.user_id || user?.id || user?._id;

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/${userId}`);
      if (res.data && !res.data.error) {
        setFormData((prev) => ({
          ...prev,
          ...res.data,
          skills: res.data.skills || '',
          experience: res.data.experience || '',
          target_role: res.data.target_role || res.data.career_goal || 'Data Analyst'
        }));
        setCompletion(res.data.completion_score || (res.data.skills && res.data.experience ? 85 : 55));
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
    try {
      await api.put(`/profile/${userId}`, formData);
      setMessage('Profile saved successfully! AI Career Intelligence updated.');
      fetchProfile();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ac-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading Profile...</div>
      </div>
    );
  }

  const isAlumni = user?.role === 'alumni';

  return (
    <div className="ac-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* 1. PROFILE HEADER CARD */}
      <div className="ac-card" style={{
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        background: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="ac-avatar ac-avatar-lg" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
              {user?.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {isAlumni ? (
                <>Alumni Mentor • <strong style={{ color: 'var(--primary)' }}>{formData.company || 'Industry Member'}</strong></>
              ) : (
                <>Student Member • Target: <strong style={{ color: 'var(--primary)' }}>{formData.target_role || 'Not Set'}</strong></>
              )}
            </p>
            <div style={{ marginTop: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className={`ac-badge ${isAlumni ? 'ac-badge-blue' : 'ac-badge-green'}`}>
                <ShieldCheck size={13} /> {isAlumni ? 'Verified Mentor' : formData.availability}
              </span>
            </div>
          </div>
        </div>

        {/* COMPLETION GAUGE */}
        <div style={{
          textAlign: 'center',
          background: '#f8fafc',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            PROFILE COMPLETION
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', margin: '0.15rem 0' }}>
            {completion}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
            {isAlumni ? 'Powers student matching' : 'Improves AI recommendations'}
          </div>
        </div>
      </div>

      {message && (
        <div className="ac-card" style={{
          background: 'var(--success-light)',
          color: 'var(--success)',
          border: '1px solid var(--success-border)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.85rem 1.25rem'
        }}>
          <CheckCircle size={18} /> {message}
        </div>
      )}

      {/* 2. PROFILE EDIT FORM */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* SECTION: ACADEMIC OR PROFESSIONAL BACKGROUND */}
        {isAlumni ? (
          <div className="ac-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} color="var(--primary)" /> Professional Position & Organization
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                  Current Organization / Company
                </label>
                <input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Google, Amazon, Microsoft..."
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                  Professional Domain
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Data & Artificial Intelligence">Data & Artificial Intelligence</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>
                  <option value="Product & Technology Management">Product & Technology Management</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                  Years of Experience
                </label>
                <input
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="5 Years Experience (Senior Data Scientist)"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                  Alma Mater / Degree
                </label>
                <input
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="B.Tech Computer Science (Class of 2021)"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                Professional Bio & Mentorship Focus
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your journey and how you can support university students (e.g., mock interviews, resume feedback, architecture reviews)..."
                style={{ width: '100%' }}
              />
            </div>
          </div>
        ) : (
          <div className="ac-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={20} color="var(--primary)" /> Academic & Target Career Goal
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                  Target Career Role
                </label>
                <select
                  value={formData.target_role}
                  onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Cloud Engineer">Cloud & DevOps Engineer</option>
                  <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                  <option value="Product Manager">Product Manager</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                  Degree & Branch
                </label>
                <input
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="B.Tech Computer Science / MCA"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                  College / Department
                </label>
                <input
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="Institute of Technology"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                  Year / CGPA
                </label>
                <input
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="4th Year / 8.4 CGPA"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: SKILLS & DOMAIN KNOWLEDGE */}
        <div className="ac-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={20} color="var(--secondary)" /> Technical Skills & Tools (Powers Matching)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                Technical Skills (Comma-separated)
              </label>
              <input
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Python, SQL, React, Machine Learning, AWS"
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                Used by TF-IDF vectorizer to score mentorship similarity.
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                Tools & Frameworks
              </label>
              <input
                value={formData.tools}
                onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                placeholder="VS Code, Docker, Git, Tableau, Jupyter"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION: PROJECTS & EXPERIENCE (For students) */}
        {!isAlumni && (
          <div className="ac-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} color="var(--ai-indigo)" /> Academic Projects & Internships
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                Key Projects & Achievements
              </label>
              <textarea
                rows={3}
                value={formData.projects}
                onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                placeholder="1. Sales Analysis Dashboard (Power BI, SQL)&#10;2. Churn Prediction Model (Python, Scikit-Learn)"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                Internship / Practical Experience
              </label>
              <textarea
                rows={2}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="2-month summer internship at Tech Solutions or campus lab projects..."
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* SECTION: LINKS */}
        <div className="ac-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} color="var(--warning)" /> Professional Links
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                LinkedIn Profile URL
              </label>
              <input
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                GitHub / Portfolio URL
              </label>
              <input
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/username"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button
            type="submit"
            disabled={saving}
            className="ac-btn ac-btn-primary ac-btn-lg"
          >
            <Save size={18} /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Profile;