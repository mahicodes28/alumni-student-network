import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

import {
  Users,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  User as UserIcon,
  BriefcaseBusiness,
  Sparkles,
  Send,
  Bell,
  BarChart3,
  GraduationCap,
  ArrowRight,
  Star
} from 'lucide-react';

import ProfileStrength from '../components/ProfileStrength';

const Dashboard = () => {

  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [requestedMentors, setRequestedMentors] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const id =
        user.user_id ||
        user.id ||
        user._id;

      const promises = [
        api.get(`/advanced-stats/${id}`),
        api.get(`/requests/${id}`),
        api.get(`/profile/${id}`),
        api.get('/broadcasts')
      ];

      if (user.role === 'student') {
        promises.push(api.get(`/recommendations/${id}`));
      }

      const results = await Promise.all(promises);

      setStats(results[0].data);
      setRequests(results[1].data.data);
      setProfile(results[2].data);
      setBroadcasts(results[3].data.data || []);

      if (user.role === 'student' && results[4]) {
        setRecommendations(results[4].data.data || []);
      }

    } catch (err) {

      console.error(
        'Error fetching dashboard data:',
        err
      );

    } finally {

      setLoading(false);

    }

  };

  const handleUpdateStatus = async (
    requestId,
    status
  ) => {

    try {

      await api.put(
        `/request/${requestId}`,
        { status }
      );

      fetchData();

    } catch (err) {

      alert('Failed to update status');

    }

  };

  const handleRequestMentor = async (alumniId) => {
    try {
      const studentId = user.user_id || user.id || user._id;
      await api.post('/request', {
        student_id: studentId,
        alumni_id: alumniId
      });
      setRequestedMentors(prev => ({
        ...prev,
        [alumniId]: true
      }));
      alert('Connection request sent successfully!');
    } catch (err) {
      console.error('Failed to request mentorship:', err);
      alert(err.response?.data?.error || 'Failed to send request');
    }
  };

  if (loading) {

    return (
      <div
        className="flex-center"
        style={{
          height: '100vh',
          color: 'white'
        }}
      >
        Loading Dashboard...
      </div>
    );

  }

  return (

    <div className="dashboard-layout">

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <h1>
              Welcome back, {user.name} 👋
            </h1>

            <p>
              Your professional alumni workspace.
            </p>

          </div>

          <div className="role-badge">

            <GraduationCap size={18} />

            {user.role?.toUpperCase()}

          </div>

        </header>

        {/* PROFILE STRENGTH */}

        {profile && (
          <ProfileStrength
            profile={profile}
            userName={user.name}
          />
        )}

        {/* APPROVAL ALERT */}

        {user.role === 'alumni' &&
          user.status === 'pending' && (

          <div className="pending-box">

            <Clock size={32} />

            <div>

              <h3>
                Awaiting University Approval
              </h3>

              <p>
                Your profile is currently under
                university review.
              </p>

            </div>

          </div>

        )}

        {/* STATS */}

        {stats && (

          <div className="stats-grid">

            <StatCard
              icon={<MessageSquare />}
              label={
                user.role === 'alumni'
                  ? 'Requests Received'
                  : 'Requests Sent'
              }
              value={stats.total || 0}
            />

            <StatCard
              icon={<TrendingUp />}
              label="Engagement Score"
              value={`${stats.engagement_score || 0}%`}
            />

            <StatCard
              icon={<CheckCircle />}
              label="Accepted"
              value={stats.accepted || 0}
            />

            <StatCard
              icon={<Clock />}
              label="Pending"
              value={stats.pending || 0}
            />

          </div>

        )}

        {/* MAIN GRID */}

        <div className="main-grid">

          {/* LEFT */}

          <div className="left-panel">

            {/* AI RECOMMENDATIONS */}

            {user.role === 'student' && recommendations.length > 0 && (
              <section className="glass-card recommendation-widget">
                <div className="section-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={20} style={{ color: '#a78bfa' }} />
                    <h2>AI Recommended Mentors</h2>
                  </div>
                  <Link to="/alumni">Explore All</Link>
                </div>
                <div className="rec-mentors-list">
                  {recommendations.slice(0, 3).map(mentor => (
                    <div key={mentor.id} className="rec-mentor-card">
                      <div className="rec-mentor-info">
                        <div className="rec-mentor-avatar">
                          {mentor.name?.[0]}
                        </div>
                        <div>
                          <h4>{mentor.name}</h4>
                          <p>{mentor.company} • {mentor.experience} Exp</p>
                          <div className="rec-skills">
                            {mentor.skills?.split(',').slice(0, 2).map((s, i) => (
                              <span key={i} className="rec-skill-tag">{s.trim()}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="rec-mentor-action">
                        <div className="match-badge">
                          <Star size={12} fill="#fbbf24" color="#fbbf24" style={{ marginRight: '2px' }} />
                          <span>{mentor.match}% Match</span>
                        </div>
                        <button 
                          className="quick-connect-btn"
                          onClick={() => handleRequestMentor(mentor.id)}
                          disabled={requestedMentors[mentor.id]}
                        >
                          {requestedMentors[mentor.id] ? 'Sent' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* REQUESTS */}

            <section className="glass-card">

              <div className="section-header">

                <h2>
                  Mentorship Requests
                </h2>

                <Link to="/mentors">
                  View All
                </Link>

              </div>

              <div className="requests-list">

                {requests.length > 0 ? (

                  requests.map(req => (

                    <RequestItem
                      key={req.request_id}
                      req={req}
                      role={user.role}
                      onUpdate={handleUpdateStatus}
                    />

                  ))

                ) : (

                  <div className="empty-box">
                    No mentorship requests found.
                  </div>

                )}

              </div>

            </section>

            {/* OPPORTUNITY FEED */}

            <section className="glass-card">

              <div className="section-header">

                <h2>
                  Career Opportunities
                </h2>

                <Link to="/broadcasts">
                  Explore
                </Link>

              </div>

              <div className="opportunity-list">

                {broadcasts.slice(0, 3).map(post => (

                  <div
                    key={post.id}
                    className="opportunity-card"
                  >

                    <div className="opportunity-top">

                      <span className="type-pill">
                        {post.type}
                      </span>

                    </div>

                    <h3>{post.title}</h3>

                    <p className="company">
                      {post.company}
                    </p>

                    <p className="desc">
                      {post.description}
                    </p>

                  </div>

                ))}

              </div>

            </section>

          </div>

          {/* RIGHT */}

          <aside className="right-panel">

            {/* QUICK ACTIONS */}

            <section className="glass-card">

              <h2>
                Quick Actions
              </h2>

              <div className="actions">

                {user.role === 'student' && (

                  <ActionButton
                    icon={<Search size={18} />}
                    label="Find Mentors"
                    to="/alumni"
                  />

                )}

                {user.role === 'student' && (

                  <ActionButton
                    icon={<Sparkles size={18} style={{ color: '#a78bfa' }} />}
                    label="Career AI Assistant"
                    to="/career-assistant"
                  />

                )}

                <ActionButton
                  icon={<UserIcon size={18} />}
                  label="My Profile"
                  to="/profile"
                />

                <ActionButton
                  icon={<MessageSquare size={18} />}
                  label="Messages"
                  to="/messages"
                />

                <ActionButton
                  icon={<BriefcaseBusiness size={18} />}
                  label="Opportunities"
                  to="/broadcasts"
                />

              </div>

            </section>

            {/* INSIGHT */}

            {stats && (

              <section className="glass-card">

                <h2>
                  Smart Insights
                </h2>

                <div className="insight-box">

                  <Sparkles size={24} />

                  <p>
                    {stats.insight}
                  </p>

                </div>

              </section>

            )}

          </aside>

        </div>

      </main>

      {/* CSS */}

      <style>{`

        *{
          box-sizing:border-box;
        }

        body{
          margin:0;
          background:#081120;
          color:white;
          font-family:Inter,sans-serif;
        }

        .dashboard-layout{
          display:flex;
          min-height:100vh;
        }

        .sidebar{
          width:260px;
          background:
          rgba(255,255,255,0.03);
          border-right:
          1px solid rgba(255,255,255,0.08);
          padding:2rem 1.5rem;
          backdrop-filter:blur(16px);
        }

        .logo-box{
          display:flex;
          align-items:center;
          gap:1rem;
          margin-bottom:3rem;
        }

        .sidebar-nav{
          display:flex;
          flex-direction:column;
          gap:1rem;
        }

        .sidebar-item{
          display:flex;
          align-items:center;
          gap:0.9rem;
          padding:1rem;
          border-radius:14px;
          cursor:pointer;
          color:#cbd5e1;
          transition:0.3s;
        }

        .sidebar-item:hover,
        .sidebar-item.active{
          background:
          rgba(59,130,246,0.15);
          color:white;
        }

        .dashboard-main{
          flex:1;
          padding:2rem;
        }

        .dashboard-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:2rem;
        }

        .dashboard-header p{
          color:#94a3b8;
        }

        .role-badge{
          display:flex;
          align-items:center;
          gap:0.5rem;
          background:
          rgba(59,130,246,0.12);
          border:
          1px solid rgba(59,130,246,0.2);
          padding:0.8rem 1rem;
          border-radius:999px;
          color:#60a5fa;
        }

        .pending-box{
          display:flex;
          align-items:center;
          gap:1rem;
          padding:1.5rem;
          border-radius:20px;
          background:
          rgba(245,158,11,0.08);
          border:
          1px solid rgba(245,158,11,0.25);
          margin-bottom:2rem;
          color:#fbbf24;
        }

        .stats-grid{
          display:grid;
          grid-template-columns:
          repeat(auto-fit,minmax(220px,1fr));
          gap:1.5rem;
          margin-bottom:2rem;
        }

        .glass-card{
          background:
          rgba(255,255,255,0.04);
          border:
          1px solid rgba(255,255,255,0.08);
          border-radius:24px;
          padding:1.7rem;
          backdrop-filter:blur(16px);
        }

        .main-grid{
          display:grid;
          grid-template-columns:2fr 1fr;
          gap:2rem;
        }

        .left-panel,
        .right-panel{
          display:flex;
          flex-direction:column;
          gap:2rem;
        }

        .section-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:1.5rem;
        }

        .section-header a{
          color:#60a5fa;
          text-decoration:none;
        }

        .requests-list{
          display:flex;
          flex-direction:column;
          gap:1rem;
        }

        .request-item{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:1rem;
          border-radius:16px;
          background:
          rgba(255,255,255,0.03);
        }

        .request-actions{
          display:flex;
          gap:0.5rem;
        }

        .icon-btn{
          border:none;
          width:40px;
          height:40px;
          border-radius:12px;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .success-btn{
          background:
          rgba(16,185,129,0.12);
          color:#10b981;
        }

        .danger-btn{
          background:
          rgba(239,68,68,0.12);
          color:#ef4444;
        }

        .opportunity-list{
          display:flex;
          flex-direction:column;
          gap:1rem;
        }

        .opportunity-card{
          background:
          rgba(255,255,255,0.03);
          padding:1.2rem;
          border-radius:18px;
        }

        .type-pill{
          background:
          rgba(16,185,129,0.12);
          color:#10b981;
          padding:0.35rem 0.8rem;
          border-radius:999px;
          font-size:0.75rem;
        }

        .company{
          color:#94a3b8;
          margin:0.5rem 0;
        }

        .desc{
          color:#cbd5e1;
          line-height:1.7;
        }

        .actions{
          display:flex;
          flex-direction:column;
          gap:1rem;
          margin-top:1rem;
        }

        .action-btn{
          display:flex;
          align-items:center;
          gap:1rem;
          padding:1rem;
          border-radius:14px;
          background:
          rgba(255,255,255,0.04);
          border:
          1px solid rgba(255,255,255,0.06);
          text-decoration:none;
          color:white;
          transition:0.3s;
        }

        .action-btn:hover{
          background:
          rgba(59,130,246,0.12);
        }

        .insight-box{
          display:flex;
          gap:1rem;
          align-items:flex-start;
          margin-top:1rem;
          color:#cbd5e1;
          line-height:1.8;
        }

        .empty-box{
          padding:2rem;
          text-align:center;
          color:#94a3b8;
        }

        @media(max-width:1000px){

          .main-grid{
            grid-template-columns:1fr;
          }

        }

        @media(max-width:768px){

          .sidebar{
            display:none;
          }

          .dashboard-main{
            padding:1.5rem;
          }

          .dashboard-header{
            flex-direction:column;
            align-items:flex-start;
            gap:1rem;
          }

        }

        /* AI RECOMMENDATIONS WIDGET */
        .recommendation-widget {
          border-color: rgba(167, 139, 250, 0.2);
        }

        .rec-mentors-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        .rec-mentor-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          transition: all 0.2s;
        }

        .rec-mentor-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(167, 139, 250, 0.15);
        }

        .rec-mentor-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .rec-mentor-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #a78bfa, #3b82f6);
          font-weight: 700;
          font-size: 1.15rem;
          color: white;
        }

        .rec-mentor-info h4 {
          margin: 0 0 0.2rem 0;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .rec-mentor-info p {
          margin: 0;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .rec-skills {
          display: flex;
          gap: 0.4rem;
          margin-top: 0.4rem;
        }

        .rec-skill-tag {
          font-size: 0.7rem;
          padding: 0.15rem 0.5rem;
          background: rgba(59, 130, 246, 0.12);
          color: #60a5fa;
          border-radius: 999px;
        }

        .rec-mentor-action {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .match-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .quick-connect-btn {
          border: none;
          background: #2563eb;
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-connect-btn:hover:not(:disabled) {
          background: #3b82f6;
          transform: scale(1.03);
        }

        .quick-connect-btn:disabled {
          background: rgba(255, 255, 255, 0.04);
          color: #64748b;
          cursor: not-allowed;
        }

      `}</style>

    </div>

  );

};

const SidebarItem = ({
  icon,
  label,
  active
}) => (

  <div
    className={
      `sidebar-item ${
        active ? 'active' : ''
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </div>

);

const StatCard = ({
  icon,
  label,
  value
}) => (

  <div className="glass-card">

    <div
      style={{
        display:'flex',
        alignItems:'center',
        gap:'0.8rem',
        marginBottom:'1rem'
      }}
    >

      {icon}

      <span style={{
        color:'#94a3b8'
      }}>
        {label}
      </span>

    </div>

    <h2 style={{
      fontSize:'2rem',
      margin:0
    }}>
      {value}
    </h2>

  </div>

);

const RequestItem = ({
  req,
  role,
  onUpdate
}) => (

  <div className="request-item">

    <div>

      <h4 style={{
        marginBottom:'0.3rem'
      }}>
        {req.other_name}
      </h4>

      <p style={{
        color:'#94a3b8',
        fontSize:'0.9rem'
      }}>
        Status:
        {' '}
        {req.status}
      </p>

    </div>

    {role === 'alumni' &&
    req.status === 'pending' ? (

      <div className="request-actions">

        <button
          className="
          icon-btn
          success-btn
          "
          onClick={() =>
            onUpdate(
              req.request_id,
              'accepted'
            )
          }
        >

          <CheckCircle size={18} />

        </button>

        <button
          className="
          icon-btn
          danger-btn
          "
          onClick={() =>
            onUpdate(
              req.request_id,
              'rejected'
            )
          }
        >

          <XCircle size={18} />

        </button>

      </div>

    ) : (

      <Clock size={20} />

    )}

  </div>

);

const ActionButton = ({
  icon,
  label,
  to
}) => (

  <Link
    to={to}
    className="action-btn"
  >

    {icon}

    <span>{label}</span>

    <ArrowRight
      size={16}
      style={{
        marginLeft:'auto'
      }}
    />

  </Link>

);

export default Dashboard;