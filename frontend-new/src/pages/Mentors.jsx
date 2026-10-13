import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Sparkles,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Filter,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

const Mentors = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [allAlumni, setAllAlumni] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('recommended');
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(null);

  const userId = user?.user_id || user?.id || user?._id;

  useEffect(() => {
    fetchMentorsPageData();
  }, [userId]);

  const fetchMentorsPageData = async () => {
    try {
      setLoading(true);
      const promises = [api.get('/alumni')];

      if (userId && user?.role === 'student') {
        promises.push(api.get(`/recommendations/${userId}`));
        promises.push(api.get(`/requests/${userId}`));
      } else if (userId && user?.role === 'alumni') {
        promises.push(api.get(`/requests/${userId}`));
      }

      const results = await Promise.allSettled(promises);

      if (results[0].status === 'fulfilled') {
        setAllAlumni(results[0].value.data.data || []);
      }

      if (user?.role === 'student') {
        if (results[1]?.status === 'fulfilled') {
          setRecommendations(results[1].value.data.data || []);
        }
        if (results[2]?.status === 'fulfilled') {
          setRequests(results[2].value.data.data || []);
        }
      } else if (user?.role === 'alumni' && results[1]?.status === 'fulfilled') {
        setRequests(results[1].value.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching mentors data:', err);
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
      // Refresh requests list
      const reqRes = await api.get(`/requests/${userId}`);
      setRequests(reqRes.data.data || []);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send mentorship request.');
    } finally {
      setSendingRequest(null);
    }
  };

  const getRequestStatus = (mentorId) => {
    const found = requests.find((r) => r.other_id === mentorId);
    return found ? found.status : null;
  };

  // Filtered list
  const filteredAlumni = allAlumni.filter((alum) => {
    const matchesSearch =
      alum.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.skills?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain =
      domainFilter === 'All' ||
      (alum.domain && alum.domain.toLowerCase().includes(domainFilter.toLowerCase())) ||
      (alum.skills && alum.skills.toLowerCase().includes(domainFilter.toLowerCase()));

    return matchesSearch && matchesDomain;
  });

  return (
    <div className="ac-container animate-fade-in">
      
      {/* 1. HEADER */}
      <div className="ac-page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
            <span className="ac-badge ac-badge-blue">
              <Users size={14} /> Institutional Mentorship Directory
            </span>
            <span className="ac-badge ac-badge-indigo">
              TF-IDF Similarity Matching
            </span>
          </div>
          <h1 className="ac-page-title">
            Discover Alumni Mentors
          </h1>
          <p className="ac-page-subtitle">
            Connect with verified alumni from your university working across top technology, analytics, and engineering organizations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/career-assistant" className="ac-btn ac-btn-outline ac-btn-sm">
            <Sparkles size={15} color="var(--ai-indigo)" /> Ask AI for Outreach Advice
          </Link>
        </div>
      </div>

      {/* 2. CONTROLS: TABS + SEARCH & DOMAIN FILTERS */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {user?.role === 'student' && (
            <div className="ac-tabs" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
              <button
                onClick={() => setActiveTab('recommended')}
                className={`ac-tab ${activeTab === 'recommended' ? 'active' : ''}`}
              >
                <Sparkles size={15} /> AI Recommended ({recommendations.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`ac-tab ${activeTab === 'all' ? 'active' : ''}`}
              >
                <Users size={15} /> All Mentors Directory ({allAlumni.length})
              </button>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-end',
            minWidth: '280px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#f8fafc',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              width: '100%',
              maxWidth: '340px'
            }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by mentor name, company, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', padding: 0, fontSize: '0.85rem', width: '100%', background: 'transparent' }}
              />
            </div>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Domain:</span>
          {['All', 'Data', 'Software', 'Machine Learning', 'Cloud', 'Analytics'].map((dom) => (
            <button
              key={dom}
              onClick={() => setDomainFilter(dom)}
              className={`ac-btn ac-btn-sm ${domainFilter === dom ? 'ac-btn-navy' : 'ac-btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MENTORS GRID */}
      {loading ? (
        <div className="ac-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Searching alumni network...</div>
        </div>
      ) : activeTab === 'recommended' && user?.role === 'student' ? (
        recommendations.length === 0 ? (
          <div className="ac-empty-state">
            <div className="ac-empty-icon">
              <Sparkles size={28} />
            </div>
            <div className="ac-empty-title">No Recommendations Available</div>
            <p className="ac-empty-desc">
              We couldn't calculate recommendations because your profile skills or goals are not set yet.
            </p>
            <Link to="/profile" className="ac-btn ac-btn-primary ac-btn-sm">
              Update Profile Skills
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}>
            {recommendations.map((mentor) => {
              const status = getRequestStatus(mentor.id);
              return (
                <div
                  key={mentor.id}
                  className="ac-card ac-card-hover"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderTop: '4px solid var(--primary)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                        <div className="ac-avatar ac-avatar-lg">
                          {mentor.name?.slice(0, 2).toUpperCase() || 'AL'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                            {mentor.name}
                          </h3>
                          <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                            {mentor.company}
                          </div>
                        </div>
                      </div>
                      <span className="ac-badge ac-badge-green" title="Cosine similarity calculated using TF-IDF vectors">
                        {mentor.match}% Match
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Experience: <strong>{mentor.experience || 'Industry Professional'}</strong>
                    </div>

                    <div style={{
                      background: 'var(--primary-light)',
                      border: '1px solid var(--primary-border)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                        MATCH EXPLANATION
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--navy-800)', lineHeight: 1.45 }}>
                        Calculated by TF-IDF vector similarity matching your profile's declared skills and career goals against this mentor's professional domain.
                      </div>
                    </div>

                    {mentor.skills && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>
                          CORE SKILLS:
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {mentor.skills.split(',').map((s, idx) => (
                            <span key={idx} className="ac-badge ac-badge-neutral" style={{ fontSize: '0.72rem' }}>
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
                    {status === 'accepted' ? (
                      <Link to="/messages" className="ac-btn ac-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                        <MessageSquare size={16} /> Open Conversation
                      </Link>
                    ) : status === 'pending' ? (
                      <button disabled className="ac-btn ac-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                        <Clock size={16} /> Mentorship Request Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(mentor.id)}
                        disabled={sendingRequest === mentor.id}
                        className="ac-btn ac-btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <Send size={15} /> {sendingRequest === mentor.id ? 'Sending...' : 'Request 1-on-1 Mentorship'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* ALL ALUMNI DIRECTORY */
        filteredAlumni.length === 0 ? (
          <div className="ac-empty-state">
            <div className="ac-empty-title">No Mentors Match Your Search</div>
            <p className="ac-empty-desc">
              Try adjusting your search terms or clearing domain filters.
            </p>
            <button onClick={() => { setSearchQuery(''); setDomainFilter('All'); }} className="ac-btn ac-btn-outline ac-btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredAlumni.map((alum) => {
              const status = getRequestStatus(alum.id);
              return (
                <div
                  key={alum.id}
                  className="ac-card ac-card-hover"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                        <div className="ac-avatar ac-avatar-lg">
                          {alum.name?.slice(0, 2).toUpperCase() || 'AL'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                            {alum.name}
                          </h3>
                          <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                            {alum.company || 'Alumni Mentor'}
                          </div>
                        </div>
                      </div>
                      <span className="ac-badge ac-badge-blue">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Experience: <strong>{alum.experience || 'Industry Professional'}</strong>
                    </div>

                    {alum.bio && (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                        {alum.bio.length > 130 ? `${alum.bio.slice(0, 130)}...` : alum.bio}
                      </p>
                    )}

                    {alum.skills && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>
                          SKILLS:
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {alum.skills.split(',').map((s, idx) => (
                            <span key={idx} className="ac-badge ac-badge-neutral" style={{ fontSize: '0.72rem' }}>
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
                    {user?.role === 'student' ? (
                      status === 'accepted' ? (
                        <Link to="/messages" className="ac-btn ac-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                          <MessageSquare size={16} /> Open Conversation
                        </Link>
                      ) : status === 'pending' ? (
                        <button disabled className="ac-btn ac-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                          <Clock size={16} /> Mentorship Request Pending
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSendRequest(alum.id)}
                          disabled={sendingRequest === alum.id}
                          className="ac-btn ac-btn-primary"
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          <Send size={15} /> {sendingRequest === alum.id ? 'Sending...' : 'Request Mentorship'}
                        </button>
                      )
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Alumni Member
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

    </div>
  );
};

export default Mentors;
