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
  User as UserIcon
} from 'lucide-react';
import ProfileStrength from '../components/ProfileStrength';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const id = user.user_id || user.id || user._id;
      const [statsRes, reqsRes, profileRes] = await Promise.all([
        api.get(`/advanced-stats/${id}`),
        api.get(`/requests/${id}`),
        api.get(`/profile/${id}`)
      ]);
      setStats(statsRes.data);
      setRequests(reqsRes.data.data);
      setProfile(profileRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await api.put(`/request/${requestId}`, { status });
      fetchData(); // Refresh
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '50vh' }}>Loading Dashboard...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Welcome, {user.name} 👋</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Role: {user.role?.toUpperCase()}</p>
      </header>

      {profile && <ProfileStrength profile={profile} userName={user.name} />}

      {user.role === 'alumni' && user.status === 'pending' && (
        <div className="glass" style={{ 
          padding: '1.5rem', 
          background: 'rgba(245, 158, 11, 0.1)', 
          border: '1px solid var(--warning)',
          borderRadius: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Clock color="var(--warning)" size={32} />
          <div>
            <h3 style={{ margin: 0, color: 'var(--warning)' }}>Awaiting University Approval</h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Your profile is currently under review by the university administration. 
              Once approved, you will be visible to students and able to receive mentorship requests.
            </p>
          </div>
        </div>
      )}

      {/* STATS GRID */}
      {stats && (
        <div className="grid-cards" style={{ marginBottom: '3rem' }}>
          <StatCard 
            icon={<MessageSquare color="var(--primary)" />} 
            label={user.role === 'alumni' ? "Requests Received" : "Requests Sent"} 
            value={stats.total || 0} 
          />
          <StatCard 
            icon={<TrendingUp color="var(--success)" />} 
            label="Engagement Score" 
            value={`${stats.engagement_score || 0}%`} 
          />
          <StatCard 
            icon={<Users color="var(--warning)" />} 
            label="Insights" 
            value={stats.insight || 'No insights yet'} 
            large
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* REQUESTS SECTION */}
        <section>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={24} color="var(--primary)" /> {user.role === 'alumni' ? "Recent Inbound Requests" : "Your Sent Requests"}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.length > 0 ? requests.map(req => (
              <RequestItem 
                key={req.request_id} 
                req={req} 
                role={user.role} 
                onUpdate={handleUpdateStatus} 
              />
            )) : (
              <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: '1rem' }}>
                No mentorship requests found.
              </div>
            )}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <aside>
          <h2 style={{ marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {user.role === 'student' && (
              <ActionButton icon={<Search size={20} />} label="Find Mentors" to="/alumni" />
            )}
            <ActionButton icon={<UserIcon size={20} />} label="My Profile" to="/profile" />
          </div>
        </aside>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, large }) => (
  <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.25rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
      {icon}
      <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</span>
    </div>
    <h3 style={{ fontSize: large ? '1.2rem' : '2rem' }}>{value}</h3>
  </div>
);

const RequestItem = ({ req, role, onUpdate }) => (
  <div className="glass" style={{ 
    padding: '1.25rem', 
    borderRadius: '1rem', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  }}>
    <div>
      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{req.other_name}</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Status: <span style={{ color: getStatusColor(req.status) }}>{req.status}</span>
      </p>
    </div>
    
    {role === 'alumni' && req.status === 'pending' ? (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => onUpdate(req.request_id, 'accepted')} style={btnIconSuccess} title="Accept"><CheckCircle size={20} /></button>
        <button onClick={() => onUpdate(req.request_id, 'rejected')} style={btnIconDanger} title="Reject"><XCircle size={20} /></button>
      </div>
    ) : (
      <div style={{ color: getStatusColor(req.status) }}>
        {req.status === 'accepted' ? <CheckCircle size={24} /> : req.status === 'rejected' ? <XCircle size={24} /> : <Clock size={24} />}
      </div>
    )}
  </div>
);



const ActionButton = ({ icon, label, to }) => (
  <Link to={to} style={{
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'var(--bg-secondary)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    textAlign: 'left',
    textDecoration: 'none',
    transition: 'all 0.3s'
  }}>
    {icon}
    <span>{label}</span>
  </Link>
);

const getStatusColor = (status) => {
  if (status === 'accepted') return 'var(--success)';
  if (status === 'rejected') return 'var(--danger)';
  return 'var(--warning)';
};

const btnIconSuccess = {
  background: 'rgba(16, 185, 129, 0.1)',
  color: 'var(--success)',
  padding: '0.5rem',
  borderRadius: '8px',
};

const btnIconDanger = {
  background: 'rgba(239, 68, 68, 0.1)',
  color: 'var(--danger)',
  padding: '0.5rem',
  borderRadius: '8px',
};

export default Dashboard;
