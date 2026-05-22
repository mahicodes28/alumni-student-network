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
  ArrowRight
} from 'lucide-react';

import ProfileStrength from '../components/ProfileStrength';

const Dashboard = () => {

  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);

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

      const [
        statsRes,
        reqsRes,
        profileRes,
        broadcastRes
      ] = await Promise.all([

        api.get(`/advanced-stats/${id}`),

        api.get(`/requests/${id}`),

        api.get(`/profile/${id}`),

        api.get('/broadcasts')

      ]);

      setStats(statsRes.data);

      setRequests(reqsRes.data.data);

      setProfile(profileRes.data);

      setBroadcasts(
        broadcastRes.data.data || []
      );

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

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo-box">

          <Sparkles size={28} />

          <h2>AlumniConnect</h2>

        </div>

        <nav className="sidebar-nav">

          <SidebarItem
            icon={<BarChart3 size={20} />}
            label="Dashboard"
            active
          />

          <SidebarItem
            icon={<Users size={20} />}
            label="Mentorship"
          />

          <SidebarItem
            icon={<MessageSquare size={20} />}
            label="Messages"
          />

          <SidebarItem
            icon={<BriefcaseBusiness size={20} />}
            label="Opportunities"
          />

          <SidebarItem
            icon={<UserIcon size={20} />}
            label="Profile"
          />

          <SidebarItem
            icon={<Bell size={20} />}
            label="Notifications"
          />

        </nav>

      </aside>

      {/* MAIN */}

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

            {/* REQUESTS */}

            <section className="glass-card">

              <div className="section-header">

                <h2>
                  Mentorship Requests
                </h2>

                <Link to="/requests">
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

                <Link to="/opportunities">
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
                  to="/opportunities"
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