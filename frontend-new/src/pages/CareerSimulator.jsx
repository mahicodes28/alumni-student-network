import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Sliders, ArrowRight, CheckCircle2, AlertTriangle, Layers, DollarSign } from 'lucide-react';

const CareerSimulator = () => {
  const [path1, setPath1] = useState("data-analyst");
  const [path2, setPath2] = useState("data-scientist");
  const [availablePaths, setAvailablePaths] = useState([]);
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const res = await api.get('/career/paths');
        setAvailablePaths(res.data.paths || []);
        runSimulation("data-analyst", "data-scientist");
      } catch (err) {
        console.error("Error fetching paths:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaths();
  }, []);

  const runSimulation = async (p1, p2) => {
    try {
      const res = await api.post('/career/simulator', { path1: p1, path2: p2 });
      setSimResult(res.data.simulation);
    } catch (err) {
      console.error("Error running simulation:", err);
    }
  };

  const handleSelectChange = (p1, p2) => {
    setPath1(p1);
    setPath2(p2);
    runSimulation(p1, p2);
  };

  return (
    <div className="cp-container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontWeight: 600, fontSize: '0.9rem' }}>
          <Sliders size={16} /> CAREER DECISION SUPPORT
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Career Path Simulator
        </h1>
        <p style={{ color: '#64748b' }}>
          Compare two career paths side-by-side to understand current alignment, skill gaps, roadmap complexity, and estimated salary outcomes.
        </p>
      </div>

      {/* SELECTOR BAR */}
      <div className="card" style={{ marginBottom: '2rem', background: '#ffffff', padding: '1.2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Select First Career Path
            </label>
            <select value={path1} onChange={(e) => handleSelectChange(e.target.value, path2)} style={{ width: '100%' }}>
              {availablePaths.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div style={{ fontWeight: 800, color: '#6366f1', fontSize: '1.1rem' }}>VS</div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Select Second Career Path
            </label>
            <select value={path2} onChange={(e) => handleSelectChange(path1, e.target.value)} style={{ width: '100%' }}>
              {availablePaths.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* COMPARISON RESULTS */}
      {simResult && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {[simResult.path1, simResult.path2].map((item, idx) => (
            <div key={idx} className="card" style={{ borderTop: idx === 0 ? '5px solid #1e3a8a' : '5px solid #0d9488' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{item.title}</h3>
                <span className="badge badge-primary" style={{ fontSize: '0.9rem' }}>{item.alignment}% Alignment</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>ROADMAP COMPLEXITY</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{item.roadmap_complexity}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>EST. SALARY</div>
                  <div style={{ fontWeight: 700, color: '#10b981', marginTop: '0.2rem' }}>{item.average_salary}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>REQUIRED KEY SKILLS</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {item.key_skills.map((s, i) => (
                    <span key={i} className="badge badge-info">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.5rem' }}>MAJOR SKILL GAPS TO BRIDGE ({item.major_gaps_count})</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {item.missing_skills.map((s, i) => (
                    <span key={i} className="badge badge-danger">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerSimulator;
