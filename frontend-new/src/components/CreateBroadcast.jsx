import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { X, Send, Briefcase } from 'lucide-react';

const CreateBroadcast = ({ onClose, onCreated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Internship',
    company: '',
    link: ''
  });
  const [loading, setLoading] = useState(false);

  const userId = user?.user_id || user?.id || user?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/broadcasts', {
        user_id: userId,
        ...formData
      });
      onCreated();
      onClose();
    } catch (err) {
      console.error('Error creating broadcast:', err);
      alert(err.response?.data?.error || 'Failed to post opportunity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1rem'
    }}>
      <div className="ac-card animate-fade-in" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '2rem',
        background: '#ffffff',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
              Post Opportunity / Broadcast
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Share internships, job referrals, or hiring events with university students.
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '0.25rem', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
              Opportunity Title
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineer Intern (Summer 2026)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Amazon / Startup"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
                Opportunity Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Internship">Internship</option>
                <option value="Full-Time">Full-Time Job</option>
                <option value="Referral">Alumni Referral</option>
                <option value="Event">Workshop / Event</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
              Description & Requirements
            </label>
            <textarea
              rows={4}
              placeholder="Outline roles, eligible batches, key skills needed, and how students can apply or reach out to you..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-700)', display: 'block', marginBottom: '0.35rem' }}>
              Application Link or Referral URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://company.com/careers/role"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
            <button type="button" onClick={onClose} className="ac-btn ac-btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="ac-btn ac-btn-primary">
              <Send size={15} /> {loading ? 'Posting...' : 'Post Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBroadcast;