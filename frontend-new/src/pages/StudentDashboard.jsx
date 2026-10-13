import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Users,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Briefcase,
  Building2,
  GraduationCap,
  MessageSquare,
  Compass,
  FileCheck,
  Target,
  Send,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [connectedMentors, setConnectedMentors] = useState([]);
  const [allAlumni, setAllAlumni] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('recommended');

  const userId = user?.user_id || user?.id || user?._id;

  useEffect(() => {
    if (userId) {
      fetchStudentDashboardData();
    }
  }, [userId]);

  const fetchStudentDashboardData = async () => {
    try {
      setLoading(true);
      const [profRes, recsRes, reqsRes, mentorsRes, alumniRes] = await Promise.allSettled([
        api.get(`/profile/${userId}`),
        api.get(`/recommendations/${userId}`),
        api.get(`/requests/${userId}`),
        api.get(`/my-mentors/${userId}`),
        api.get('/alumni')
      ]);

      if (profRes.status === 'fulfilled') setProfile(profRes.value.data);
      if (recsRes.status === 'fulfilled') setRecommendations(recsRes.value.data.data || []);
      if (reqsRes.status === 'fulfilled') setRequests(reqsRes.value.data.data || []);
      if (mentorsRes.status === 'fulfilled') setConnectedMentors(mentorsRes.value.data.data || []);
      if (alumniRes.status === 'fulfilled') setAllAlumni(alumniRes.value.data.data || []);
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (mentorId) => {
    try {
      setSendingRequest(mentorId);
      await api.post('/request', {
        student_id: userId,
        alumni_id: mentorId
      });
      // Refresh requests
      const reqsRes = await api.get(`/requests/${userId}`);
      setRequests(reqsRes.data.data || []);
    } catch (err) {
      alert(err.response?.data?.error || 'Could not send mentorship request.');
    } finally {
      setSendingRequest(null);
    }
  };

  const getRequestStatus = (mentorId) => {
    const found = requests.find(r => r.other_id === mentorId);
    return found ? found.status : null;
  };

  const targetRole = profile?.target_role || profile?.career_goal || 'Software Engineering / Data';

  // Filtered alumni search
  const filteredAlumni = allAlumni.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.name?.toLowerCase().includes(q) ||
      a.company?.toLowerCase().includes(q) ||
      a.skills?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="ac-container animate-fade-in">
      
      {/* 1. PERSONALIZED WELCOME & NEXT BEST ACTION */}
      <div className="ac-page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
            <span className="ac-badge ac-badge-blue">
              <GraduationCap size={14} /> Student Member
            </span>
            <span className="ac-badge ac-badge-neutral">
              Goal: {targetRole}
            </span>
          </div>
          <h1 className="ac-page-title">
            Welcome, {user?.name || 'Student'} 👋
          </h1>
          <p className="ac-page-subtitle">
            Here are your AI-recommended alumni mentors, mentorship request statuses, and direct career guidance tools.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/career-assistant" className="ac-btn ac-btn-accent">
            <Sparkles size={16} /> AI Career Assistant
          </Link>
          <Link to="/profile" className="ac-btn ac-btn-outline">
            Edit Career Goal
          </Link>
        </div>
      </div>

      {/* 2. NEXT BEST ACTION & REQUEST STATUS BANNER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Next Action Card */}
        <div className="ac-card ac-card-ai" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="ac-badge ac-badge-indigo">
                <Sparkles size={13} /> NEXT BEST ACTION
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Guidance</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
              {recommendations.length > 0
                ? `Connect with ${recommendations[0]?.name} (${recommendations[0]?.company})`
                : 'Complete your profile skills to unlock matched mentors'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.55 }}>
              {recommendations.length > 0
                ? `Based on your goal as a ${targetRole}, this mentor has verified experience at ${recommendations[0]?.company} and shares overlapping tech skills.`
                : 'Adding your top technical skills, degree year, and target career path allows our TF-IDF model to recommend the most relevant alumni.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', alignItems: 'center' }}>
            {recommendations.length > 0 ? (
              <button
                onClick={() => handleSendRequest(recommendations[0]?.id)}
                disabled={getRequestStatus(recommendations[0]?.id) !== null || sendingRequest === recommendations[0]?.id}
                className="ac-btn ac-btn-primary ac-btn-sm"
              >
                {getRequestStatus(recommendations[0]?.id) === 'accepted' ? (
                  <>✓ Connected</>
                ) : getRequestStatus(recommendations[0]?.id) === 'pending' ? (
                  <>⏳ Request Pending</>
                ) : (
                  <><Send size={14} /> Send Mentorship Request</>
                )}
              </button>
            ) : (
              <Link to="/profile" className="ac-btn ac-btn-primary ac-btn-sm">
                Update Skills Now →
              </Link>
            )}
            <Link to="/career-assistant" className="ac-btn ac-btn-outline ac-btn-sm">
              Ask AI for Advice
            </Link>
          </div>
        </div>

        {/* Mentorship Status Quick Card */}
        <div className="ac-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Mentorship Connections
              </h3>
              <span className="ac-badge ac-badge-neutral">{requests.length} Total</span>
            </div>

            {requests.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                You have not sent any mentorship requests yet. Browse the recommended alumni below and reach out!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '140px', overflowY: 'auto' }}>
                {requests.slice(0, 3).map((r) => (
                  <div key={r.request_id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.45rem 0.65rem',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    fontSize: '0.8rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.other_name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{r.company}</div>
                    </div>
                    <div>
                      {r.status === 'accepted' ? (
                        <span className="ac-badge ac-badge-green" style={{ fontSize: '0.7rem' }}>Connected</span>
                      ) : r.status === 'pending' ? (
                        <span className="ac-badge ac-badge-amber" style={{ fontSize: '0.7rem' }}>Pending</span>
                      ) : (
                        <span className="ac-badge ac-badge-rose" style={{ fontSize: '0.7rem' }}>Declined</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Connected Mentors: <strong>{connectedMentors.length}</strong>
            </span>
            <Link to="/messages" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
              Open Messages →
            </Link>
          </div>
        </div>
      </div>

      {/* 3. TABS: RECOMMENDED MENTORS VS DISCOVER ALL ALUMNI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div className="ac-tabs" style={{ marginBottom: 0 }}>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`ac-tab ${activeTab === 'recommended' ? 'active' : ''}`}
          >
            <Sparkles size={16} /> Recommended for You ({recommendations.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`ac-tab ${activeTab === 'all' ? 'active' : ''}`}
          >
            <Users size={16} /> All Alumni Directory ({allAlumni.length})
          </button>
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.35rem 0.75rem', width: '280px' }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by skill, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', padding: 0, fontSize: '0.8125rem', width: '100%' }}
          />
        </div>
      </div>

      {/* 4. MENTORS GRID */}
      {loading ? (
        <div className="ac-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading mentor recommendations...</div>
        </div>
      ) : activeTab === 'recommended' ? (
        recommendations.length === 0 ? (
          <div className="ac-empty-state">
            <div className="ac-empty-icon">
              <Users size={28} />
            </div>
            <div className="ac-empty-title">No Recommendations Available Yet</div>
            <p className="ac-empty-desc">
              Complete your profile skills and career goals to let our TF-IDF matching engine calculate personalized alumni recommendations.
            </p>
            <Link to="/profile" className="ac-btn ac-btn-primary ac-btn-sm">
              Complete Profile Skills
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}>
            {recommendations.map((mentor) => {
              const status = getRequestStatus(mentor.id);
              return (
                <div key={mentor.id} className="ac-card ac-card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div className="ac-avatar ac-avatar-md">
                          {mentor.name?.slice(0, 2).toUpperCase() || 'AL'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                            {mentor.name}
                          </h3>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
                            {mentor.company}
                          </div>
                        </div>
                      </div>
                      <span className="ac-badge ac-badge-green" title="Calculated by TF-IDF vector similarity">
                        {mentor.match}% Match
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                      Experience: <strong>{mentor.experience || 'Experienced Alum'}</strong>
                    </div>

                    <div style={{
                      background: 'var(--primary-light)',
                      border: '1px solid var(--primary-border)',
                      borderRadius: '8px',
                      padding: '0.6rem 0.75rem',
                      marginBottom: '0.85rem'
                    }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                        WHY THIS MENTOR MATCHES:
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--navy-800)' }}>
                        ✓ Relevant domain overlap with your target role<br />
                        ✓ Shared technical skills & coursework
                      </div>
                    </div>

                    {mentor.skills && (
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {mentor.skills.split(',').map((s, idx) => (
                          <span key={idx} className="ac-badge ac-badge-neutral" style={{ fontSize: '0.72rem' }}>
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {status === 'accepted' ? (
                      <Link to="/messages" className="ac-btn ac-btn-outline ac-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                        <MessageSquare size={14} /> Send Message
                      </Link>
                    ) : status === 'pending' ? (
                      <button disabled className="ac-btn ac-btn-outline ac-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                        <Clock size={14} /> Request Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(mentor.id)}
                        disabled={sendingRequest === mentor.id}
                        className="ac-btn ac-btn-primary ac-btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <Send size={14} /> {sendingRequest === mentor.id ? 'Sending...' : 'Request Mentorship'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* ALL ALUMNI DIRECTORY TAB */
        filteredAlumni.length === 0 ? (
          <div className="ac-empty-state">
            <div className="ac-empty-title">No Alumni Match Your Search</div>
            <p className="ac-empty-desc">Try clearing your search query to see all registered alumni mentors.</p>
            <button onClick={() => setSearchQuery('')} className="ac-btn ac-btn-outline ac-btn-sm">
              Clear Search
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredAlumni.map((alum) => {
              const status = getRequestStatus(alum.id);
              return (
                <div key={alum.id} className="ac-card ac-card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div className="ac-avatar ac-avatar-md">
                          {alum.name?.slice(0, 2).toUpperCase() || 'AL'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                            {alum.name}
                          </h3>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
                            {alum.company || 'Alumni Member'}
                          </div>
                        </div>
                      </div>
                      <span className="ac-badge ac-badge-neutral">Verified</span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                      Experience: {alum.experience || 'Industry Professional'}
                    </div>

                    {alum.bio && (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                        {alum.bio.length > 120 ? `${alum.bio.slice(0, 120)}...` : alum.bio}
                      </p>
                    )}

                    {alum.skills && (
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {alum.skills.split(',').map((s, idx) => (
                          <span key={idx} className="ac-badge ac-badge-neutral" style={{ fontSize: '0.72rem' }}>
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    {status === 'accepted' ? (
                      <Link to="/messages" className="ac-btn ac-btn-outline ac-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                        <MessageSquare size={14} /> Send Message
                      </Link>
                    ) : status === 'pending' ? (
                      <button disabled className="ac-btn ac-btn-outline ac-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                        <Clock size={14} /> Request Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(alum.id)}
                        disabled={sendingRequest === alum.id}
                        className="ac-btn ac-btn-primary ac-btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <Send size={14} /> {sendingRequest === alum.id ? 'Sending...' : 'Request Mentorship'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* 5. QUICK SHORTCUTS TO EMPLOYABILITY TOOLS */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Career Readiness & Placement Tools
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}>
          <Link to="/career-assistant" className="ac-card ac-card-interactive" style={{ padding: '1rem' }}>
            <Sparkles size={20} color="var(--ai-indigo)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>AI Career Assistant</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Conversational mentor for resume & prep</div>
          </Link>

          <Link to="/opportunities" className="ac-card ac-card-interactive" style={{ padding: '1rem' }}>
            <Briefcase size={20} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>Job & Internships</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Matched opportunities from alumni network</div>
          </Link>

          <Link to="/roadmap" className="ac-card ac-card-interactive" style={{ padding: '1rem' }}>
            <Compass size={20} color="var(--secondary)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>Personalized Roadmap</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step-by-step milestone checklist</div>
          </Link>

          <Link to="/mock-interview" className="ac-card ac-card-interactive" style={{ padding: '1rem' }}>
            <Target size={20} color="var(--warning)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>Mock Interview</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Technical & behavioral practice room</div>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default StudentDashboard;
