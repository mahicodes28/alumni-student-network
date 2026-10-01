import React from 'react';
import { Link } from 'react-router-dom';
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
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  BarChart3
} from 'lucide-react';

const Landing = () => {
  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ padding: '4rem 1.5rem 5rem', background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e0e7ff', color: '#3730a3', padding: '0.35rem 0.9rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.2rem' }}>
              <Sparkles size={16} /> MPONLINE IDEA & INNOVATION HACKATHON 2026
            </div>
            <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, color: '#0f172a', letterSpacing: '-1px', marginBottom: '1.2rem' }}>
              Your Career Doesn't Need <span style={{ color: '#6366f1' }}>Guesswork.</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.6, marginBottom: '2rem' }}>
              Discover the right career path, understand your skill gaps, build a personalized roadmap, and become job-ready with AI.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '1.05rem', background: '#1e3a8a' }}>
                Build My Career Roadmap <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.85rem 1.8rem', fontSize: '1.05rem' }}>
                Explore Career Paths
              </Link>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #cbd5e1' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a' }}>92%</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Placement Match Accuracy</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d9488' }}>10+</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Supported Tech Tracks</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1' }}>1-on-1</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Industry Mentorship</div>
              </div>
            </div>
          </div>

          {/* HERO VISUAL MOCKUP */}
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.8rem', boxShadow: '0 20px 40px -15px rgba(15,23,42,0.12)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600 }}>AI Career Dashboard</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Rohan Patel (CS Student)</h3>
              </div>
              <span className="badge badge-success">87% Fit — Data Analyst</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>CAREER READINESS SCORE</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e3a8a', margin: '0.2rem 0' }}>76 <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 100</span></div>
                <div className="progress-bg"><div className="progress-fill" style={{ width: '76%' }}></div></div>
              </div>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>NEXT BEST ACTION</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0.3rem 0' }}>Complete Advanced SQL</div>
                <div style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 600 }}>Highest Priority Gap</div>
              </div>
            </div>

            <div style={{ background: '#faf5ff', padding: '1rem', borderRadius: '12px', border: '1px solid #e9d5ff', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6b21a8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Target size={16} /> Top Skill Gaps Identified
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-danger">Statistics (45% vs 75%)</span>
                <span className="badge badge-warning">Advanced SQL (65% vs 80%)</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="#16a34a" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#15803d' }}>Matched Job: Data Analyst Intern (91% Match)</span>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d' }}>Apply →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section style={{ padding: '4rem 1.5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>The Employability Gap</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1.2rem', color: '#0f172a' }}>
            Why Traditional Placement Tools Fail Students
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '750px', margin: '0 auto 3rem' }}>
            Students spend years studying without knowing which career paths align with their strengths or what exact skill gaps prevent them from getting hired.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
            <div className="card" style={{ background: '#f8fafc' }}>
              <div style={{ background: '#fee2e2', color: '#b91c1c', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Target size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Fit Explanation</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Generic platforms suggest job titles without explaining why a role fits or what specific skills are missing.</p>
            </div>

            <div className="card" style={{ background: '#f8fafc' }}>
              <div style={{ background: '#fef3c7', color: '#b45309', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Compass size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Fragmented Learning</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Students buy courses randomly without a cohesive step-by-step roadmap tailored to industry demands.</p>
            </div>

            <div className="card" style={{ background: '#f8fafc' }}>
              <div style={{ background: '#e0f2fe', color: '#0369a1', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <TrendingUp size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Unmeasured Readiness</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>No real-time metric tells a candidate if their resume, projects, and interview skills meet job benchmarks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS / JOURNEY SECTION */}
      <section style={{ padding: '4rem 1.5rem', background: '#f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#0d9488', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Core Product Philosophy</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: '#0f172a' }}>
              The 10-Step Campus-to-Corporate Journey
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { step: "01", title: "Profile", desc: "Academics & Skills" },
              { step: "02", title: "Understand", desc: "Strength Assessment" },
              { step: "03", title: "Discover", desc: "Career Recommendations" },
              { step: "04", title: "Identify Gaps", desc: "Skill Benchmark vs Goal" },
              { step: "05", title: "Learn", desc: "Targeted Courses" },
              { step: "06", title: "Build", desc: "Personalized Roadmap" },
              { step: "07", title: "Apply", desc: "Matched Jobs & Internships" },
              { step: "08", title: "Practice", desc: "AI Mock Interview" },
              { step: "09", title: "Connect", desc: "Industry Mentors" },
              { step: "10", title: "Measure", desc: "Readiness Score" },
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ textAlign: 'center', padding: '1.2rem 0.8rem' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6366f1' }}>{item.step}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, margin: '0.3rem 0', color: '#0f172a' }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI CAREER INTELLIGENCE */}
      <section style={{ padding: '4rem 1.5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Explainable Recommendations</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0 1rem', color: '#0f172a' }}>
              AI Career Assessment
            </h2>
            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              CareerPath AI analyzes your academic profile, projects, skills, and preferences to recommend career roles with transparent explanations.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600, color: '#0f172a' }}>
                <CheckCircle2 size={18} color="#10b981" /> Fit percentage score based on actual skill benchmarks
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600, color: '#0f172a' }}>
                <CheckCircle2 size={18} color="#10b981" /> "Why this fits" evidence matching your past projects
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600, color: '#0f172a' }}>
                <CheckCircle2 size={18} color="#10b981" /> Transparent areas to strengthen before applying
              </li>
            </ul>
          </div>
          <div className="card" style={{ background: '#f8fafc', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '1rem' }}>CAREER FIT ANALYSIS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Data Analyst</span>
                  <span style={{ color: '#10b981' }}>87% Fit</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem' }}>✓ Python, SQL, Power BI project match</div>
              </div>
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Data Scientist</span>
                  <span style={{ color: '#6366f1' }}>79% Fit</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem' }}>⚠ Needs Statistics & Deep Learning</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SKILL GAP & ROADMAPS */}
      <section style={{ padding: '4rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#0d9488', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Actionable Guidance</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1rem' }}>
            Turn Skill Gaps into Personalized Roadmaps
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '700px', margin: '0 auto 3rem' }}>
            Our engine compares your current proficiency against market expectations and generates a phase-by-phase learning milestone checklist.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={20} /> Skill Gap Comparison
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>Python</span>
                    <span>90% / 80% Required</span>
                  </div>
                  <div className="progress-bg" style={{ marginTop: '0.3rem' }}><div className="progress-fill" style={{ width: '90%' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>SQL</span>
                    <span>65% / 80% Required</span>
                  </div>
                  <div className="progress-bg" style={{ marginTop: '0.3rem' }}><div className="progress-fill" style={{ width: '65%', background: '#f59e0b' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>Statistics</span>
                    <span>45% / 75% Required (Priority Gap)</span>
                  </div>
                  <div className="progress-bg" style={{ marginTop: '0.3rem' }}><div className="progress-fill" style={{ width: '45%', background: '#ef4444' }}></div></div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#0d9488', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={20} /> Personalized Phase Roadmap
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                <div style={{ padding: '0.6rem 0.8rem', background: '#f1f5f9', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                  <strong>Phase 1: Foundations</strong> — Advanced SQL & Statistics
                </div>
                <div style={{ padding: '0.6rem 0.8rem', background: '#f1f5f9', borderRadius: '8px', borderLeft: '4px solid #6366f1' }}>
                  <strong>Phase 2: Core Skills</strong> — Power BI & Data Storytelling
                </div>
                <div style={{ padding: '0.6rem 0.8rem', background: '#f1f5f9', borderRadius: '8px', borderLeft: '4px solid #cbd5e1' }}>
                  <strong>Phase 3: Portfolio</strong> — Sales Analytics Project
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OPPORTUNITIES & MENTORS */}
      <section style={{ padding: '4rem 1.5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          <div className="card" style={{ background: '#f8fafc' }}>
            <Briefcase size={28} color="#1e3a8a" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>AI Opportunity Matching</h3>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1rem' }}>
              Internships and entry-level positions are scored against your actual skills. See exactly why a position matches and what missing skills to complete before applying.
            </p>
            <span className="badge badge-primary">Data Analyst Intern — 91% Match</span>
          </div>

          <div className="card" style={{ background: '#f8fafc' }}>
            <GraduationCap size={28} color="#0d9488" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Industry Mentor Matching</h3>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1rem' }}>
              Connect with senior Data Scientists, Software Engineers, and Product Managers who match your target role and possess the exact expertise to help bridge your skill gaps.
            </p>
            <span className="badge badge-success">Sarah Sharma — Senior Data Scientist at Google</span>
          </div>
        </div>
      </section>

      {/* 7. RESUME & MOCK INTERVIEW */}
      <section style={{ padding: '4rem 1.5rem', background: '#f1f5f9' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Interview & Resume Prep</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '2rem' }}>
            Practice & Perfect Your Application
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left' }}>
            <div className="card">
              <FileCheck size={24} color="#6366f1" style={{ marginBottom: '0.8rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>AI Resume Analyzer</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>Upload your resume for immediate score evaluation, keyword alignment checks, and actionable phrasing improvements.</p>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a' }}>✓ Resume Score: 78 / 100</div>
            </div>

            <div className="card">
              <Video size={24} color="#0d9488" style={{ marginBottom: '0.8rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>AI Mock Interview Room</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>Simulate role-specific technical and behavioral mock interview rounds with real-time AI feedback and readiness scoring.</p>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7' }}>✓ Interview Readiness: 72 / 100</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CAREER READINESS SCORE */}
      <section style={{ padding: '4rem 1.5rem', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem', fontSize: '0.85rem', padding: '0.4rem 1rem' }}>One Central Metric</span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            The AI Career Readiness Indicator
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2.5rem' }}>
            A comprehensive 0-100 score calculated across your technical skills, portfolio projects, resume optimization, certifications, interview practice, and experience.
          </p>
          
          <div className="card" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: '#ffffff', padding: '2.5rem' }}>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>AI CAREER READINESS SCORE</div>
            <div style={{ fontSize: '4.5rem', fontWeight: 900, margin: '0.5rem 0' }}>76 <span style={{ fontSize: '1.8rem', opacity: 0.7 }}>/ 100</span></div>
            <p style={{ maxWidth: '500px', margin: '0 auto', fontSize: '0.95rem', opacity: 0.9 }}>
              You are 76% ready for a Data Analyst role. Complete your "Advanced SQL" module to reach 84%.
            </p>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA & FOOTER */}
      <section style={{ padding: '5rem 1.5rem', background: '#0f172a', color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            From Career Discovery to Career Readiness.
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '2.5rem' }}>
            Join CareerPath AI today and unlock your personalized employability roadmap.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.2rem', fontSize: '1.1rem', background: '#6366f1' }}>
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
        
        <div style={{ maxWidth: '1200px', margin: '4rem auto 0', paddingTop: '2rem', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          <div>© 2026 CareerPath AI — MPONLINE IDEA & INNOVATION HACKATHON 2026 (Problem Statement 01)</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/login" style={{ color: '#94a3b8' }}>Login</Link>
            <Link to="/register" style={{ color: '#94a3b8' }}>Register</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;