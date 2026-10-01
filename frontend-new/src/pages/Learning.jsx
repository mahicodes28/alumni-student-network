import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BookOpen, ExternalLink, Award, Clock, Sparkles } from 'lucide-react';

const Learning = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const res = await api.get('/learning/recommendations');
        setResources(res.data.data || []);
      } catch (err) {
        console.error("Error fetching learning recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLearning();
  }, []);

  return (
    <div className="cp-container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#0369a1', fontWeight: 600, fontSize: '0.9rem' }}>
          <BookOpen size={16} /> SMART LEARNING RECOMMENDATIONS
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Recommended Courses & Certifications
        </h1>
        <p style={{ color: '#64748b' }}>
          Curated learning resources selected specifically to address your priority skill gaps.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {resources.map((item) => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.78rem' }}>
                  SKILL GAP: {item.skill}
                </span>
                {item.certification && (
                  <span className="badge badge-success" style={{ fontSize: '0.78rem' }}>
                    <Award size={12} /> Certificate
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                {item.title}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 700, marginBottom: '0.8rem' }}>
                Provider: {item.provider}
              </div>

              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                {item.description}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', paddingTop: '0.8rem', borderTop: '1px solid #e2e8f0' }}>
                <span>Difficulty: <strong>{item.difficulty}</strong></span>
                <span>Duration: <strong>{item.duration}</strong></span>
              </div>

              <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
                Start Course <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learning;
