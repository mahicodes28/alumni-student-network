import React, { useState } from 'react';
import api from '../utils/api';
import { FileCheck, Sparkles, CheckCircle2, AlertCircle, Upload, ArrowRight } from 'lucide-react';

const ResumeAI = () => {
  const [resumeText, setResumeText] = useState(`Rohan Patel | CS Student | rohan@demo.com
Target Role: Data Analyst

Technical Skills: Python, SQL, Power BI, Excel, Pandas, Git, C++
Academic Projects:
1. Sales Performance Dashboard (Built using Power BI and SQL on 50,000 retail records)
2. Customer Churn Classification Model (Developed using Python, Scikit-Learn, and Pandas)

Certifications: Google Data Analytics Professional Certificate
Experience: Summer Intern at Local Tech Hub - worked on SQL queries and spreadsheet reporting.`);
  
  const [targetRole, setTargetRole] = useState("Data Analyst");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    try {
      setLoading(true);
      const res = await api.post('/resume/analyze', {
        resume_text: resumeText,
        target_role: targetRole
      });
      setAnalysis(res.data);
    } catch (err) {
      console.error("Error analyzing resume:", err);
      alert("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#334155', fontWeight: 600, fontSize: '0.9rem' }}>
          <FileCheck size={16} /> AI RESUME FEEDBACK ENGINE
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          AI Resume Analyzer & Optimizer
        </h1>
        <p style={{ color: '#64748b' }}>
          Upload your resume text to receive instant AI scoring, keyword matching against target roles, and phrasing suggestions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* INPUT FORM */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Paste Resume Content or Profile Text
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Target Career Role
            </label>
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} style={{ width: '100%' }}>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Machine Learning Engineer">Machine Learning Engineer</option>
              <option value="Full Stack Engineer">Full Stack Engineer</option>
              <option value="Business Analyst">Business Analyst</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Resume Text
            </label>
            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{ width: '100%', fontSize: '0.9rem', lineHeight: 1.5 }}
              placeholder="Paste your resume sections (Skills, Experience, Projects)..."
            />
          </div>

          <button onClick={handleAnalyze} className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            <Sparkles size={16} /> {loading ? 'Analyzing Resume...' : 'Analyze Resume Alignment'}
          </button>
        </div>

        {/* RESULTS CARD */}
        <div>
          {analysis ? (
            <div className="card animate-fade-in" style={{ borderTop: '5px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div>
                  <span className="badge badge-primary">Alignment: {analysis.target_role}</span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>Resume Analysis Report</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981' }}>
                    {analysis.score} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 100</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '10px', border: '1px solid #bbf7d0', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', marginBottom: '0.4rem' }}>✓ IDENTIFIED STRENGTHS</div>
                <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.85rem', color: '#15803d', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {analysis.strengths.map((s, idx) => (
                    <li key={idx}>✓ {s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#fff1f2', padding: '1rem', borderRadius: '10px', border: '1px solid #fecdd3', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9f1239', marginBottom: '0.4rem' }}>⚠ AREAS FOR IMPROVEMENT</div>
                <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.85rem', color: '#be123c', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {analysis.improvements.map((imp, idx) => (
                    <li key={idx}>⚠ {imp}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1', marginBottom: '0.4rem' }}>💡 AI SUGGESTIONS</div>
                <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {analysis.ai_suggestions.map((sug, idx) => (
                    <li key={idx}>👉 {sug}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8' }}>
              <FileCheck size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.95rem' }}>Paste your resume text on the left and click "Analyze Resume Alignment" to generate feedback.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResumeAI;
