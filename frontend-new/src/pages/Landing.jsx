import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Compass,
  Briefcase,
  GraduationCap,
  FileCheck,
  Video,
  ArrowRight,
  CheckCircle2,
  Target,
  MessageSquare,
  ShieldCheck,
  Building2,
  ChevronRight,
  Bot,
  BrainCircuit,
  Award,
  Layers,
  Send
} from 'lucide-react';

const Landing = () => {
  const [activeTab, setActiveTab] = useState('mentors');

  return (
    <div style={{ background: '#f8fafc', color: 'var(--text-title)', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '5rem 1.5rem 6rem',
        background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: '3.5rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              border: '1px solid var(--primary-border)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '1.25rem'
            }}>
              <Sparkles size={15} color="var(--primary)" />
              Next-Gen Student–Alumni Network
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem'
            }}>
              Your next opportunity could start with a{' '}
              <span style={{
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                conversation.
              </span>
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-muted)',
              lineHeight: 1.65,
              marginBottom: '2rem',
              maxWidth: '580px'
            }}>
              AlumniConnect empowers university students to discover verified alumni mentors through explainable AI matching, gain 24/7 guidance with our AI Career Assistant, and unlock career opportunities directly from industry insiders.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/register" className="ac-btn ac-btn-primary ac-btn-lg">
                Find Your Mentor <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="ac-btn ac-btn-outline ac-btn-lg">
                Explore the Platform
              </a>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border)'
            }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>1-on-1</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Personalized Mentorship
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>TF-IDF</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Mathematical Similarity Matching
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ai-indigo)' }}>Groq AI</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Career & Interview Assistant
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE AUTHENTIC PRODUCT PREVIEW */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12)',
            overflow: 'hidden'
          }}>
            {/* Header bar with tabs */}
            <div style={{
              background: '#0f172a',
              padding: '0.875rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></span>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }}></span>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                  AlumniConnect App Preview
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => setActiveTab('mentors')}
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    color: activeTab === 'mentors' ? '#ffffff' : '#94a3b8',
                    background: activeTab === 'mentors' ? 'rgba(255,255,255,0.15)' : 'transparent',
                    fontWeight: 600
                  }}
                >
                  Mentors
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    color: activeTab === 'chat' ? '#ffffff' : '#94a3b8',
                    background: activeTab === 'chat' ? 'rgba(255,255,255,0.15)' : 'transparent',
                    fontWeight: 600
                  }}
                >
                  AI Assistant
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    color: activeTab === 'dashboard' ? '#ffffff' : '#94a3b8',
                    background: activeTab === 'dashboard' ? 'rgba(255,255,255,0.15)' : 'transparent',
                    fontWeight: 600
                  }}
                >
                  Dashboard
                </button>
              </div>
            </div>

            {/* TAB CONTENT: MENTORS PREVIEW */}
            {activeTab === 'mentors' && (
              <div style={{ padding: '1.5rem', background: '#fafafa' }} className="animate-fade-in">
                <div style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid var(--border)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div className="ac-avatar ac-avatar-md">SS</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Sarah Sharma</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          Senior Data Scientist at Google
                        </div>
                      </div>
                    </div>
                    <span className="ac-badge ac-badge-green">
                      92% TF-IDF Match
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    Specializing in NLP, recommendation architectures, and ML production pipelines. Open for 1-on-1 mock interviews and resume reviews.
                  </p>

                  <div style={{
                    background: 'var(--ai-light)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--ai-border)',
                    marginBottom: '0.85rem'
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ai-indigo)', marginBottom: '0.2rem' }}>
                      WHY THIS MENTOR MATCHES YOU:
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#312e81' }}>
                      ✓ High overlap in Python, SQL & Machine Learning<br />
                      ✓ Directly aligns with your goal: <strong>Data Scientist</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <span className="ac-badge ac-badge-neutral" style={{ fontSize: '0.7rem' }}>Python</span>
                      <span className="ac-badge ac-badge-neutral" style={{ fontSize: '0.7rem' }}>Machine Learning</span>
                      <span className="ac-badge ac-badge-neutral" style={{ fontSize: '0.7rem' }}>MLOps</span>
                    </div>
                    <button className="ac-btn ac-btn-primary ac-btn-sm" style={{ pointerEvents: 'none' }}>
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: AI CHAT PREVIEW */}
            {activeTab === 'chat' && (
              <div style={{ padding: '1.5rem', background: '#fafafa' }} className="animate-fade-in">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{
                    alignSelf: 'flex-end',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    padding: '0.65rem 0.95rem',
                    borderRadius: '12px 12px 2px 12px',
                    fontSize: '0.8125rem',
                    maxWidth: '85%'
                  }}>
                    How can I prepare for a behavioral interview with an engineering manager?
                  </div>

                  <div style={{
                    alignSelf: 'flex-start',
                    background: '#ffffff',
                    border: '1px solid var(--border)',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px 12px 12px 2px',
                    fontSize: '0.8125rem',
                    color: 'var(--text-title)',
                    maxWidth: '90%',
                    boxShadow: 'var(--shadow-xs)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--ai-indigo)', fontWeight: 700, marginBottom: '0.35rem', fontSize: '0.75rem' }}>
                      <Sparkles size={14} /> AI CAREER ASSISTANT
                    </div>
                    Structure your stories using the <strong>STAR method</strong> (Situation, Task, Action, Result). Focus on technical trade-offs you made, how you resolved team disagreements, and what you learned from project setbacks.
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#ffffff',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.4rem 0.75rem'
                  }}>
                    <input
                      type="text"
                      placeholder="Ask about skill gaps, resume bullet points..."
                      disabled
                      style={{ border: 'none', padding: 0, fontSize: '0.75rem', width: '100%', background: 'transparent' }}
                    />
                    <Send size={14} color="var(--primary)" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DASHBOARD PREVIEW */}
            {activeTab === 'dashboard' && (
              <div style={{ padding: '1.5rem', background: '#fafafa' }} className="animate-fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>CAREER READINESS</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: '0.2rem 0' }}>82 <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/ 100</span></div>
                    <div className="progress-bg"><div className="progress-fill" style={{ width: '82%', background: 'var(--primary)' }}></div></div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>TARGET CAREER</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0.3rem 0' }}>Data Analyst</div>
                    <span className="ac-badge ac-badge-green" style={{ fontSize: '0.7rem' }}>High Industry Demand</span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                    Next Recommended Action:
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Connect with an alumnus working in Analytics to review your portfolio projects before applying.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" style={{ padding: '5.5rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="ac-badge ac-badge-blue" style={{ marginBottom: '0.75rem' }}>
            Structured Pathway
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            How AlumniConnect Works
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
            A four-step structured journey designed to take university students from academic exploration to career clarity and mentorship.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Step 1 */}
          <div className="ac-card ac-card-hover" style={{ position: 'relative' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              marginBottom: '1.25rem'
            }}>
              1
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Build Your Profile
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Highlight your academic degree, coursework, technical skills, project portfolio, and target career interests to seed the matching engine.
            </p>
          </div>

          {/* Step 2 */}
          <div className="ac-card ac-card-hover">
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--ai-light)',
              color: 'var(--ai-indigo)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              marginBottom: '1.25rem'
            }}>
              2
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Discover Mentors
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Our TF-IDF algorithm calculates mathematical similarity between your profile and verified alumni working at top companies in your field.
            </p>
          </div>

          {/* Step 3 */}
          <div className="ac-card ac-card-hover">
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--secondary-light)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              marginBottom: '1.25rem'
            }}>
              3
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Connect & Converse
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Send personalized mentorship requests, exchange direct messages, and receive real-world feedback on resume structure and industry expectations.
            </p>
          </div>

          {/* Step 4 */}
          <div className="ac-card ac-card-hover">
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              marginBottom: '1.25rem'
            }}>
              4
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Grow Your Career
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Leverage alumni referrals, explore curated opportunity broadcasts, practice mock interviews, and systematically eliminate skill gaps.
            </p>
          </div>
        </div>
      </section>

      {/* 3. AI-ASSISTED MENTOR RECOMMENDATIONS SECTION */}
      <section id="mentor-discovery" style={{
        padding: '5.5rem 1.5rem',
        background: '#ffffff',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div>
            <span className="ac-badge ac-badge-indigo" style={{ marginBottom: '1rem' }}>
              <BrainCircuit size={14} /> Explainable AI Matching
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.2 }}>
              Connecting you with mentors who genuinely match your path.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
              Rather than generic directory listings, AlumniConnect analyzes your stated skills, coursework, career target, and domain interests using TF-IDF vectorization and cosine similarity against alumni backgrounds.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>Transparent Match Explanations</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Every recommendation explicitly outlines why a mentor matches you—from overlapping technology stacks to shared domain tracks.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>Verified Institutional Alumni</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Administrative review ensures that alumni mentors are authenticated and eager to mentor students from their alma mater.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>Actionable Connection Requests</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Send direct mentorship requests with one click and track approval status in real-time.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <Link to="/register" className="ac-btn ac-btn-primary">
                Explore Mentor Matches <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Sample Mentor Match Card */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid var(--border)'
          }}>
            <div className="ac-card" style={{ borderTop: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  <div className="ac-avatar ac-avatar-lg">AC</div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Alex Chen</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                      Lead Analytics Manager at Amazon
                    </div>
                  </div>
                </div>
                <span className="ac-badge ac-badge-green" style={{ fontSize: '0.8rem' }}>
                  88% Match
                </span>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                6 years in data modeling, SQL optimization, and business intelligence. Ready to help students bridge academic projects with industry expectations.
              </p>

              <div style={{
                background: '#f8fafc',
                padding: '0.875rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  MATCH RATIONALE
                </div>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>✓ Target Role Alignment: <strong>Data Analyst</strong></li>
                  <li>✓ Shared Skills: <strong>SQL, Python, Power BI</strong></li>
                  <li>✓ Domain: <strong>Data & Analytics</strong></li>
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <span className="ac-badge ac-badge-neutral">SQL</span>
                  <span className="ac-badge ac-badge-neutral">Power BI</span>
                  <span className="ac-badge ac-badge-neutral">Tableau</span>
                </div>
                <span className="ac-badge ac-badge-blue">Available to Mentor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI CAREER ASSISTANT INTRO SECTION */}
      <section id="ai-assistant" style={{ padding: '5.5rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '24px',
          padding: '3.5rem 2.5rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            maxWidth: '680px',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#a5b4fc',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '1.25rem'
            }}>
              <Sparkles size={15} /> Powered by Groq & LLaMA 3.3
            </div>

            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              marginBottom: '1rem',
              lineHeight: 1.2
            }}>
              Meet your 24/7 AI Career Assistant.
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}>
              Get instant, context-aware answers tailored to your specific academic profile. Discover high-leverage skill gaps, simulate technical interview questions, optimize resume bullet points, and prepare for conversations with alumni.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.25rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                color: '#e2e8f0'
              }}>
                💬 "Review my resume bullet points for software internships"
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                color: '#e2e8f0'
              }}>
                🎯 "What skills am I missing to become a Cloud DevOps engineer?"
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                color: '#e2e8f0'
              }}>
                🤝 "How should I structure a message to reach out to an alum?"
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/register" className="ac-btn ac-btn-accent ac-btn-lg">
                Try AI Career Assistant <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CAREER DEVELOPMENT & OPPORTUNITIES ECOSYSTEM */}
      <section style={{ padding: '5.5rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="ac-badge ac-badge-neutral" style={{ marginBottom: '0.75rem' }}>
            Comprehensive Ecosystem
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Everything you need from campus to corporate.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
            Beyond mentorship, AlumniConnect gives you an integrated toolset to benchmark skills and access opportunities.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          <div className="ac-card ac-card-hover">
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Briefcase size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0f172a' }}>
              Alumni Job & Internship Broadcasts
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Alumni can post verified job opportunities, internships, and referral calls exclusively for students of their university.
            </p>
          </div>

          <div className="ac-card ac-card-hover">
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'var(--ai-light)',
              color: 'var(--ai-indigo)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Target size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0f172a' }}>
              Skill Gap & Readiness Benchmarks
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Understand your priority skill gaps against market role benchmarks and receive tailored roadmaps to eliminate them.
            </p>
          </div>

          <div className="ac-card ac-card-hover">
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'var(--secondary-light)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <MessageSquare size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0f172a' }}>
              Direct Student–Alumni Messaging
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Once a mentorship connection is accepted, communicate seamlessly in a distraction-free, professional messaging workspace.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA BANNER */}
      <section style={{
        padding: '5rem 1.5rem',
        background: '#ffffff',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.025em',
            marginBottom: '1rem'
          }}>
            Ready to discover your next mentor?
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Join our university community today. Connect with alumni who have walked your path and are ready to guide your next step.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="ac-btn ac-btn-primary ac-btn-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="ac-btn ac-btn-outline ac-btn-lg">
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* 7. POLISHED FOOTER */}
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        padding: '4rem 1.5rem 2.5rem',
        fontSize: '0.875rem'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.75rem' }}>
              <GraduationCap size={22} color="#3b82f6" />
              AlumniConnect
            </div>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>
              AI-powered student–alumni mentorship platform bridging the gap between campus knowledge and industry careers.
            </p>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: '0.85rem' }}>Platform</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0 }}>
              <li><Link to="/mentors" style={{ color: '#94a3b8' }}>Mentor Discovery</Link></li>
              <li><Link to="/career-assistant" style={{ color: '#94a3b8' }}>AI Career Assistant</Link></li>
              <li><Link to="/opportunities" style={{ color: '#94a3b8' }}>Opportunities</Link></li>
              <li><Link to="/broadcasts" style={{ color: '#94a3b8' }}>Job Broadcasts</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: '0.85rem' }}>Career Tools</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0 }}>
              <li><Link to="/skill-gap" style={{ color: '#94a3b8' }}>Skill Gap Analyzer</Link></li>
              <li><Link to="/roadmap" style={{ color: '#94a3b8' }}>Career Roadmaps</Link></li>
              <li><Link to="/resume-ai" style={{ color: '#94a3b8' }}>AI Resume Analyzer</Link></li>
              <li><Link to="/mock-interview" style={{ color: '#94a3b8' }}>AI Mock Interview</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: '0.85rem' }}>Institutional</div>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              Designed for university career services, alumni associations, and faculty placement cells.
            </p>
            <div style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.8rem' }}>
              Verified Alumni & Secure Auth
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1240px',
          margin: '2rem auto 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} AlumniConnect. All rights reserved.
          </div>
          <div>
            TF-IDF Similarity Matching • Groq LLM Guidance • Secure Institutional Mentorship
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;