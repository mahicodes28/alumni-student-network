import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Award, ExternalLink, Calendar, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

const GovernmentJobs = () => {
  const [govJobs, setGovJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGovJobs = async () => {
      try {
        const res = await api.get('/government-jobs');
        setGovJobs(res.data.data || []);
      } catch (err) {
        console.error("Error fetching government jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGovJobs();
  }, []);

  return (
    <div className="cp-container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontWeight: 600, fontSize: '0.9rem' }}>
          <Award size={16} /> PUBLIC SECTOR CAREER INTELLIGENCE
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Government Employment Opportunities
        </h1>
        <p style={{ color: '#64748b' }}>
          Curated government technical, scientific, and IT recruitment notices matched to academic eligibility.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {govJobs.map((item) => (
          <div key={item.id} className="card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center', borderLeft: '6px solid #1e3a8a' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-warning" style={{ fontWeight: 800 }}>
                  {item.demo_label || "Sample / Demo Opportunity"}
                </span>
                <span className="badge badge-primary">{item.organization}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={14} /> Deadline: {item.deadline}
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>
                {item.title}
              </h3>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.8rem' }}>
                {item.department} • <span style={{ color: '#0d9488' }}>{item.pay_level}</span>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.8rem', lineHeight: 1.5 }}>
                {item.description}
              </p>

              <div style={{ fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong>Eligibility Benchmark:</strong> {item.eligibility}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <a href={item.official_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.7rem 1.3rem', textDecoration: 'none' }}>
                Official Portal <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovernmentJobs;
