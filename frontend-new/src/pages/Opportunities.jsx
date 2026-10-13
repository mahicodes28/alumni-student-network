import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Briefcase, CheckCircle2, AlertCircle, MapPin, DollarSign, Clock, ArrowRight, ExternalLink } from 'lucide-react';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchedOpportunities = async () => {
      try {
        setLoading(true);
        const res = await api.get('/opportunities/matched');
        setOpportunities(res.data.data || []);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchedOpportunities();
  }, []);

  const filteredOpps = filterType === 'All' ? opportunities : opportunities.filter((o) => o.type === filterType);

  return (
    <div className="ac-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* HEADER */}
      <div className="ac-page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
            <span className="ac-badge ac-badge-green">
              <Briefcase size={14} /> AI Opportunity Matching
            </span>
          </div>
          <h1 className="ac-page-title">
            Matched Internships & Entry-Level Roles
          </h1>
          <p className="ac-page-subtitle">
            Opportunities matched against your actual student skills, target role benchmarks, and verified alumni network.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Internship', 'Full-Time'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`ac-btn ac-btn-sm ${filterType === t ? 'ac-btn-navy' : 'ac-btn-outline'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* OPPORTUNITIES LIST */}
      {loading ? (
        <div className="ac-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Matching opportunities against your skill matrix...</div>
        </div>
      ) : filteredOpps.length === 0 ? (
        <div className="ac-empty-state">
          <div className="ac-empty-icon">
            <Briefcase size={28} />
          </div>
          <div className="ac-empty-title">No Opportunities Found</div>
          <p className="ac-empty-desc">
            No active positions match this filter right now. Check back soon for new postings from our network.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredOpps.map((item) => (
            <div
              key={item.id}
              className="ac-card ac-card-hover"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem'
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="ac-badge ac-badge-green" style={{ fontWeight: 800 }}>
                    {item.match_score}% Match
                  </span>
                  <span className="ac-badge ac-badge-blue">{item.type}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Posted {item.posted_date}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.65rem' }}>
                  {item.company} • <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{item.location}</span> • <span style={{ color: 'var(--secondary)' }}>{item.stipend}</span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', marginBottom: '0.85rem', lineHeight: 1.55 }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem' }}>
                  <div>
                    <strong style={{ color: 'var(--success)' }}>✓ Matched Skills:</strong>{' '}
                    <span style={{ color: 'var(--navy-700)' }}>{item.matched_skills.join(', ')}</span>
                  </div>
                  {item.missing_skills.length > 0 && (
                    <div>
                      <strong style={{ color: 'var(--danger)' }}>⚠ Missing Skills:</strong>{' '}
                      <span style={{ color: 'var(--navy-700)' }}>{item.missing_skills.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={() => alert(`Application portal link for ${item.title} opened.`)}
                  className="ac-btn ac-btn-primary"
                >
                  Apply Now <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Opportunities;
