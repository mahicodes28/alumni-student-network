import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Briefcase, CheckCircle2, AlertCircle, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchedOpportunities = async () => {
      try {
        const res = await api.get('/opportunities/matched');
        setOpportunities(res.data.data || []);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchedOpportunities();
  }, []);

  const filteredOpps = filterType === 'All' ? opportunities : opportunities.filter(o => o.type === filterType);

  return (
    <div className="cp-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#15803d', fontWeight: 600, fontSize: '0.9rem' }}>
            <Briefcase size={16} /> AI OPPORTUNITY MATCHING ENGINE
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Internships & Entry-Level Job Matching
          </h1>
          <p style={{ color: '#64748b' }}>
            Every opportunity is matched against your actual student skills and target role requirements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Internship', 'Full-Time'].map((t) => (
            <button key={t} onClick={() => setFilterType(t)} className={`btn ${filterType === t ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredOpps.map((item) => (
          <div key={item.id} className="card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-success" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                  {item.match_score}% MATCH
                </span>
                <span className="badge badge-primary">{item.type}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Posted {item.posted_date}</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>
                {item.title}
              </h3>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.8rem' }}>
                {item.company} • <span style={{ color: '#64748b', fontWeight: 500 }}>{item.location}</span> • <span style={{ color: '#0d9488' }}>{item.stipend}</span>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                <div>
                  <strong style={{ color: '#16a34a' }}>✓ MATCHING SKILLS:</strong>{' '}
                  {item.matched_skills.join(', ')}
                </div>
                {item.missing_skills.length > 0 && (
                  <div>
                    <strong style={{ color: '#e11d48' }}>⚠ MISSING SKILLS:</strong>{' '}
                    {item.missing_skills.join(', ')}
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => alert(`Redirecting to official application portal for ${item.title}`)} className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
                Apply Now <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opportunities;
