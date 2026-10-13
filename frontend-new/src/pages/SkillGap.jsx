import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Target, AlertCircle, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

const SkillGap = () => {
  const [skillGapData, setSkillGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        const res = await api.get('/career/skill-gap');
        setSkillGapData(res.data);
      } catch (err) {
        console.error("Error fetching skill gap:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkillGap();
  }, []);

  const targetRole = skillGapData?.target_role || "Data Analyst";
  const skillsCompared = skillGapData?.skills_compared || [];
  const top3ToImprove = skillGapData?.top_3_skills_to_improve || ["Statistics", "Advanced SQL", "Business Analytics"];

  return (
    <div className="cp-container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#b91c1c', fontWeight: 600, fontSize: '0.9rem' }}>
          <Target size={16} /> AI SKILL GAP ENGINE
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Skill Gap Analysis
        </h1>
        <p style={{ color: '#64748b' }}>
          Comparing your current verified student skills against market requirements for <strong style={{ color: '#1e3a8a' }}>{targetRole}</strong>.
        </p>
      </div>

      {/* TOP 3 SKILLS TO IMPROVE CARDS */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', border: '1px solid #fecdd3', marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#9f1239', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          🔥 TOP 3 PRIORITY SKILLS TO IMPROVE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.8rem' }}>
          {top3ToImprove.map((skillName, idx) => (
            <div key={idx} style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #fecdd3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#9f1239', fontWeight: 700 }}>PRIORITY GAP #{idx + 1}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{skillName}</div>
              </div>
              <Link to="/learning" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                Learn <BookOpen size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* SKILL COMPARISON TABLE / MATRIX */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
          Complete Skill Matrix Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {skillsCompared.map((item, idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{item.skill}</span>
                  <span className={`badge ${item.status === 'Strong' ? 'badge-success' : item.status === 'Needs Improvement' ? 'badge-warning' : 'badge-danger'}`}>
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>
                  Current: {item.current_level}% / Target: {item.required_level}%
                </div>
              </div>

              <div className="progress-bg" style={{ height: '10px' }}>
                <div className="progress-fill" style={{
                  width: `${item.current_level}%`,
                  background: item.status === 'Strong' ? '#10b981' : item.status === 'Needs Improvement' ? '#f59e0b' : '#ef4444'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillGap;
