import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, Target, Award } from 'lucide-react';

const CareerAI = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [targetRole, setTargetRole] = useState("Data Analyst");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.post('/career/analyze', {});
      setRecommendations(res.data.recommendations || []);
      setTargetRole(res.data.target_role || "Data Analyst");
    } catch (err) {
      console.error("Error analyzing career:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleReanalyze = async () => {
    setAnalyzing(true);
    await fetchRecommendations();
    setAnalyzing(false);
  };

  return (
    <div className="cp-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', fontWeight: 600, fontSize: '0.9rem' }}>
            <Sparkles size={16} /> AI CAREER INTELLIGENCE MODULE
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Explainable Career Recommendations
          </h1>
          <p style={{ color: '#64748b' }}>
            AI assessment based on your current skills, academic record, projects, and career preferences.
          </p>
        </div>
        <button onClick={handleReanalyze} className="btn btn-primary" disabled={analyzing}>
          <Sparkles size={16} /> {analyzing ? 'Re-analyzing Profile...' : 'Re-Run AI Assessment'}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Sparkles size={32} color="#6366f1" className="animate-spin" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#64748b' }}>Analyzing your skill matrix and past projects against 10+ tech career paths...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {recommendations.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: item.fit_percentage >= 85 ? '5px solid #10b981' : '5px solid #6366f1' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <div>
                    <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>{item.category}</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{item.title}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: item.fit_percentage >= 85 ? '#10b981' : '#6366f1' }}>
                      {item.fit_percentage}%
                    </div>
                    <span className={`badge ${item.fit_percentage >= 85 ? 'badge-success' : 'badge-primary'}`}>
                      {item.alignment_label}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                  {item.description}
                </p>

                <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16a34a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={15} /> WHY THIS FITS YOUR PROFILE
                  </div>
                  <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {item.why_this_fits.map((reason, idx) => (
                      <li key={idx}>✓ {reason}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: '#fff1f2', padding: '0.9rem', borderRadius: '10px', marginBottom: '1.2rem', border: '1px solid #fecdd3' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e11d48', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertCircle size={15} /> AREAS TO STRENGTHEN
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {item.areas_to_strengthen.map((gap, idx) => (
                      <span key={idx} className="badge badge-danger">{gap}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#64748b' }}>
                <div>Est. Salary: <strong>{item.average_salary}</strong></div>
                <span style={{ color: '#0d9488', fontWeight: 600 }}>{item.demand} Demand</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerAI;
