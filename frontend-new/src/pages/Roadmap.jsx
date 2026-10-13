import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Compass, CheckSquare, Square, CheckCircle2, ArrowRight } from 'lucide-react';

const Roadmap = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await api.get('/career/roadmap');
      setRoadmapData(res.data);
    } catch (err) {
      console.error("Error fetching roadmap:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const toggleTask = async (milestoneId, currentCompleted) => {
    try {
      const res = await api.put('/career/roadmap/task', {
        milestoneId: milestoneId,
        completed: !currentCompleted
      });
      fetchRoadmap();
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const targetRole = roadmapData?.target_role || "Data Analyst";
  const completionPercentage = roadmapData?.completion_percentage || 35;
  const phases = roadmapData?.phases || [];

  return (
    <div className="cp-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#0f766e', fontWeight: 600, fontSize: '0.9rem' }}>
            <Compass size={16} /> PERSONALIZED ROADMAP ENGINE
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Career Roadmap to {targetRole}
          </h1>
          <p style={{ color: '#64748b' }}>
            Interactive phase-by-phase learning path tailored to your specific skill gaps and career timeline.
          </p>
        </div>

        <div className="card" style={{ padding: '0.8rem 1.4rem', textAlign: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>OVERALL ROADMAP PROGRESS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d' }}>{completionPercentage}%</div>
        </div>
      </div>

      <div className="progress-bg" style={{ marginBottom: '2.5rem', height: '12px' }}>
        <div className="progress-fill" style={{ width: `${completionPercentage}%`, background: '#10b981' }}></div>
      </div>

      {/* PHASES LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
        {phases.map((phase) => (
          <div key={phase.phase} className="card" style={{ padding: '1.5rem', borderLeft: phase.status === 'In Progress' ? '6px solid #10b981' : '6px solid #94a3b8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{phase.title}</h3>
              <span className={`badge ${phase.status === 'In Progress' ? 'badge-success' : 'badge-primary'}`}>
                {phase.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {phase.milestones.map((m) => (
                <div key={m.id} onClick={() => toggleTask(m.id, m.completed)} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', background: m.completed ? '#f0fdf4' : '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  {m.completed ? (
                    <CheckSquare size={20} color="#16a34a" />
                  ) : (
                    <Square size={20} color="#94a3b8" />
                  )}
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: m.completed ? '#166534' : '#0f172a', textDecoration: m.completed ? 'line-through' : 'none' }}>
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
