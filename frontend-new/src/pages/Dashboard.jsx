import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Sparkles,
  Target,
  Compass,
  BookOpen,
  Briefcase,
  GraduationCap,
  FileCheck,
  Video,
  Award,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Zap,
  Sliders
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [readinessData, setReadinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user && user.user_id) {
          const res = await api.get(`/career/readiness/${user.user_id}`);
          setReadinessData(res.data);
        }
      } catch (err) {
        console.error("Error fetching readiness data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const readiness = readinessData?.overall_score || 76;
  const targetRole = readinessData?.target_role || "Data Analyst";
  const breakdown = readinessData?.breakdown || {
    technical_skills: 82,
    projects: 71,
    resume: 79,
    certifications: 65,
    interview: 68,
    experience: 50
  };
  const nextAction = readinessData?.next_best_action || {
    action: "Complete Advanced SQL Module",
    reason: `SQL is currently one of your highest-priority skill gaps for your target role as ${targetRole}.`,
    category: "High Priority"
  };

  return (
    <div className="cp-container animate-fade-in">
      
      {/* WELCOME HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Good morning, {user?.name || 'Student'} 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Target Goal: <span style={{ fontWeight: 700, color: '#1e3a8a' }}>{targetRole}</span> — Here is your AI Career Readiness overview.
          </p>
        </div>
        <Link to="/profile" className="btn btn-outline">
          Edit Profile & Goals
        </Link>
      </div>

      {/* TOP SECTION: READINESS SCORE & NEXT BEST ACTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* CAREER READINESS WIDGET */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', marginBottom: '0.8rem' }}>
                <Sparkles size={14} /> AI CAREER READINESS
              </span>
              <div style={{ fontSize: '3.8rem', fontWeight: 900, lineHeight: 1 }}>
                {readiness} <span style={{ fontSize: '1.4rem', opacity: 0.7 }}>/ 100</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Target Readiness</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>85+ for Job Placement</div>
            </div>
          </div>

          <div className="progress-bg" style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.2)', height: '10px' }}>
            <div className="progress-fill" style={{ width: `${readiness}%`, background: '#10b981' }}></div>
          </div>

          {/* SCORE BREAKDOWN */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '0.78rem' }}>
            <div>
              <div style={{ opacity: 0.8 }}>Technical Skills</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{breakdown.technical_skills}%</div>
            </div>
            <div>
              <div style={{ opacity: 0.8 }}>Projects</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{breakdown.projects}%</div>
            </div>
            <div>
              <div style={{ opacity: 0.8 }}>Resume</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{breakdown.resume}%</div>
            </div>
            <div>
              <div style={{ opacity: 0.8 }}>Certifications</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{breakdown.certifications}%</div>
            </div>
            <div>
              <div style={{ opacity: 0.8 }}>Interview</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{breakdown.interview}%</div>
            </div>
            <div>
              <div style={{ opacity: 0.8 }}>Experience</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{breakdown.experience}%</div>
            </div>
          </div>
        </div>

        {/* NEXT BEST ACTION WIDGET */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '6px solid #6366f1' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.8rem' }}>
                <Zap size={14} /> YOUR NEXT BEST ACTION
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>AI Personalization</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
              "{nextAction.action}"
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {nextAction.reason}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', alignItems: 'center' }}>
            <Link to="/skill-gap" className="btn btn-accent" style={{ flex: 1 }}>
              Start Learning Action <ArrowRight size={16} />
            </Link>
            <Link to="/roadmap" className="btn btn-outline">
              View Full Roadmap
            </Link>
          </div>
        </div>

      </div>

      {/* CORE MODULES GRID */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Career Intelligence & Employability Modules
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        
        <Link to="/career-ai" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ background: '#e0e7ff', color: '#3730a3', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Sparkles size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>AI Career Assessment</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Discover matching career paths with explainable fit percentages and strengths.</p>
          </div>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Analyze Careers →
          </div>
        </Link>

        <Link to="/career-simulator" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ background: '#fef3c7', color: '#b45309', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Sliders size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>Career Path Simulator</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Compare 2 career roles side-by-side (e.g. Data Analyst vs Data Scientist).</p>
          </div>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Simulate & Compare →
          </div>
        </Link>

        <Link to="/skill-gap" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ background: '#fee2e2', color: '#b91c1c', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Target size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>AI Skill Gap Analyzer</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Compare your current skills vs target role benchmark skills.</p>
          </div>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View Top 3 Gaps →
          </div>
        </Link>

        <Link to="/roadmap" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ background: '#ccfbf1', color: '#0f766e', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Compass size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>Personalized Roadmap</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Step-by-step milestone checklist from foundation to job applications.</p>
          </div>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Progress: 35% →
          </div>
        </Link>

        <Link to="/learning" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ background: '#e0f2fe', color: '#0369a1', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <BookOpen size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>Smart Learning</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Curated courses & certifications recommended based on your priority skill gaps.</p>
          </div>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Explore Courses →
          </div>
        </Link>

        <Link to="/opportunities" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ background: '#dcfce7', color: '#15803d', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Briefcase size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>Internships & Jobs</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Match scores calculated against your actual profile skills.</p>
          </div>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View Matched Roles →
          </div>
        </Link>

        <Link to="/mentors" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ background: '#fae8ff', color: '#86198f', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <GraduationCap size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>Industry Mentors</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Connect 1-on-1 with senior industry professionals matching your target track.</p>
          </div>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#86198f', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Find Mentors →
          </div>
        </Link>

        <Link to="/resume-ai" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ background: '#f1f5f9', color: '#334155', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <FileCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>AI Resume Analyzer</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Instant AI score, keyword alignment, and formatting suggestions.</p>
          </div>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Analyze Resume →
          </div>
        </Link>

        <Link to="/mock-interview" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ background: '#ffedd5', color: '#c2410c', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Video size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>AI Mock Interview</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Interactive technical & behavioral mock interview practice room.</p>
          </div>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#c2410c', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Start Mock Round →
          </div>
        </Link>

        <Link to="/government-jobs" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ background: '#e0e7ff', color: '#1e3a8a', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Award size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>Government Opportunities</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Curated government recruitment notices for technical & scientific positions.</p>
          </div>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View Notices →
          </div>
        </Link>

      </div>

    </div>
  );
};

export default Dashboard;