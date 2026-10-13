import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Building2,
  Sparkles,
  MessageSquare,
  Plus,
  ArrowRight,
  TrendingUp,
  User,
  ShieldCheck,
  Award,
  ChevronRight,
  Send,
  AlertCircle
} from 'lucide-react';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const userId = user?.user_id || user?.id || user?._id;

  useEffect(() => {
    if (userId) {
      fetchAlumniData();
    }
  }, [userId]);

  const fetchAlumniData = async () => {
    try {
      setLoading(true);
      const [profRes, pendingRes, menteesRes, broadcastsRes, statsRes] = await Promise.allSettled([
        api.get(`/profile/${userId}`),
        api.get(`/pending/${userId}`),
        api.get(`/mentees/${userId}`),
        api.get('/broadcasts'),
        api.get(`/advanced-stats/${userId}`)
      ]);

      if (profRes.status === 'fulfilled') setProfile(profRes.value.data);
      if (pendingRes.status === 'fulfilled') setPendingRequests(pendingRes.value.data.data || []);
      if (menteesRes.status === 'fulfilled') setMentees(menteesRes.value.data.data || []);
      if (broadcastsRes.status === 'fulfilled') setBroadcasts(broadcastsRes.value.data.data || []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
    } catch (err) {
      console.error('Error fetching alumni dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId, status) => {
    try {
      setProcessingId(requestId);
      await api.put(`/request/${requestId}`, { status });
      // Refresh pending & mentees
      const [pendingRes, menteesRes, statsRes] = await Promise.all([
        api.get(`/pending/${userId}`),
        api.get(`/mentees/${userId}`),
        api.get(`/advanced-stats/${userId}`)
      ]);
      setPendingRequests(pendingRes.data.data || []);
      setMentees(menteesRes.data.data || []);
      if (statsRes.data) setStats(statsRes.data);
    } catch (err) {
      console.error('Error updating request:', err);
      alert(err.response?.data?.error || 'Failed to update request.');
    } finally {
      setProcessingId(null);
    }
  };

  const completionScore = profile?.completion_score || (profile?.company && profile?.skills ? 90 : 60);

  return (
    <div className="ac-container animate-fade-in">
      
      {/* 1. HEADER WELCOME AREA */}
      <div className="ac-page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
            <span className="ac-badge ac-badge-blue">
              <ShieldCheck size={14} /> Verified Alumni Mentor
            </span>
          </div>
          <h1 className="ac-page-title">
            Welcome back, {user?.name || 'Alumnus'} 👋
          </h1>
          <p className="ac-page-subtitle">
            Thank you for investing in the next generation of students. Review incoming mentorship requests and manage active mentees below.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/broadcasts" className="ac-btn ac-btn-primary">
            <Plus size={16} /> Post Opportunity / Referral
          </Link>
          <Link to="/profile" className="ac-btn ac-btn-outline">
            <User size={16} /> Update Profile
          </Link>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Pending Requests */}
        <div className="ac-card ac-card-hover" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING REQUESTS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
                {pendingRequests.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600 }}>
                {pendingRequests.length > 0 ? 'Awaiting your review' : 'All caught up'}
              </div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--warning-light)', color: 'var(--warning)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* Connected Mentees */}
        <div className="ac-card ac-card-hover" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE MENTEES</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
                {mentees.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                Connected students
              </div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--success-light)', color: 'var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Users size={20} />
            </div>
          </div>
        </div>

        {/* Mentorship Engagement */}
        <div className="ac-card ac-card-hover" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>ENGAGEMENT SCORE</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0' }}>
                {stats?.engagement_score || 0}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {stats?.insight || 'Active mentor'}
              </div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--primary-light)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        {/* Profile Health */}
        <div className="ac-card ac-card-hover" style={{ borderLeft: '4px solid var(--ai-indigo)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROFILE STRENGTH</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
                {completionScore}%
              </div>
              <div className="progress-bg" style={{ width: '120px', marginTop: '0.25rem' }}>
                <div className="progress-fill" style={{ width: `${completionScore}%`, background: 'var(--ai-indigo)' }}></div>
              </div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--ai-light)', color: 'var(--ai-indigo)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Award size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT: INCOMING REQUESTS & ACTIVE MENTEES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '1.75rem',
        alignItems: 'start'
      }}>
        
        {/* LEFT COLUMN: INCOMING MENTORSHIP REQUESTS */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Incoming Mentorship Requests ({pendingRequests.length})
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Students who have reached out for your guidance and career mentorship.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="ac-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading requests...</div>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="ac-empty-state">
              <div className="ac-empty-icon">
                <CheckCircle2 size={28} />
              </div>
              <div className="ac-empty-title">No Pending Requests</div>
              <p className="ac-empty-desc">
                You have addressed all incoming mentorship requests. New requests will appear here as students discover your profile.
              </p>
              <Link to="/profile" className="ac-btn ac-btn-outline ac-btn-sm">
                Ensure Profile Skills Are Up to Date
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingRequests.map((req) => (
                <div key={req.request_id} className="ac-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div className="ac-avatar ac-avatar-md">
                        {req.name?.slice(0, 2).toUpperCase() || 'ST'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                          {req.name}
                        </h3>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          Student • Requested {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recently'}
                        </div>
                      </div>
                    </div>
                    <span className="ac-badge ac-badge-amber">Pending Review</span>
                  </div>

                  {req.skills && (
                    <div style={{ marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Skills & Stack:
                      </span>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                        {req.skills.split(',').map((s, idx) => (
                          <span key={idx} className="ac-badge ac-badge-neutral" style={{ fontSize: '0.75rem' }}>
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {req.interests && (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-body)', marginBottom: '1rem', background: '#f8fafc', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <strong>Interests & Goals:</strong> {req.interests}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => handleRequestResponse(req.request_id, 'rejected')}
                      disabled={processingId === req.request_id}
                      className="ac-btn ac-btn-outline ac-btn-sm"
                      style={{ color: 'var(--danger)' }}
                    >
                      <XCircle size={15} /> Decline
                    </button>
                    <button
                      onClick={() => handleRequestResponse(req.request_id, 'accepted')}
                      disabled={processingId === req.request_id}
                      className="ac-btn ac-btn-primary ac-btn-sm"
                    >
                      <CheckCircle2 size={15} /> {processingId === req.request_id ? 'Accepting...' : 'Accept Mentorship'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ACTIVE MENTEES & PROFESSIONAL PROFILE INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Active Mentees List */}
          <div className="ac-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                Connected Mentees ({mentees.length})
              </h2>
              <Link to="/messages" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
                Open Chat →
              </Link>
            </div>

            {mentees.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                No active mentees yet. Once you accept mentorship requests, students will appear here for easy communication.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mentees.map((m, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div className="ac-avatar ac-avatar-sm">
                        {m.name?.slice(0, 2).toUpperCase() || 'ST'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student</div>
                      </div>
                    </div>
                    <Link
                      to="/messages"
                      className="ac-btn ac-btn-outline ac-btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <MessageSquare size={13} /> Message
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Professional Information Card */}
          <div className="ac-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                Your Public Mentor Card
              </h3>
              <Link to="/profile" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                Edit
              </Link>
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Company & Role:</span>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>
                  {profile?.company || 'Organization not specified'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Experience:</span>
                <div>{profile?.experience || 'Not listed'}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Domain:</span>
                <div>{profile?.domain || 'General Technology'}</div>
              </div>

              {profile?.skills && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Skills:</span>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {profile.skills.split(',').map((s, i) => (
                      <span key={i} className="ac-badge ac-badge-neutral" style={{ fontSize: '0.72rem' }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Broadcasts from Alumni */}
          <div className="ac-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                Recent Opportunities
              </h3>
              <Link to="/broadcasts" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                View All
              </Link>
            </div>
            {broadcasts.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                No active announcements yet. Share a job opening or referral with university students!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {broadcasts.slice(0, 3).map((b, idx) => (
                  <div key={idx} style={{ fontSize: '0.8125rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{b.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {b.company} • {b.type || 'Opportunity'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default AlumniDashboard;
