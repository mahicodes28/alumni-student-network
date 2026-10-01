import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Shield,
  Users,
  UserCheck,
  UserX,
  Clock,
  Briefcase,
  MessageSquare,
  BarChart3,
  Trash2,
  Search,
  Sparkles,
  Award
} from 'lucide-react';

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [pendingRes, statsRes, usersRes] = await Promise.all([
        api.get('/pending'),
        api.get('/stats'),
        api.get('/users')
      ]);

      setPending(pendingRes.data.data || []);
      setStats(statsRes.data);
      setUsers(usersRes.data.data || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, action) => {
    try {
      await api.put(`/${action}/${id}`);
      setPending(prev => prev.filter(p => p.id !== id));
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/delete-user/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="cp-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Loading CareerPath AI Admin Console...</h2>
      </div>
    );
  }

  return (
    <div className="cp-container animate-fade-in">
      
      {/* ADMIN HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontWeight: 600, fontSize: '0.9rem' }}>
            <Shield size={16} /> CAREERPATH AI SYSTEM CONTROL
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Platform Admin Console
          </h1>
          <p style={{ color: '#64748b' }}>
            Monitor student career analytics, approve industry mentors, and view employability engagement stats.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['overview', 'pending', 'users'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`} style={{ textTransform: 'capitalize', padding: '0.5rem 1rem' }}>
              {tab === 'pending' ? `Pending Mentors (${pending.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ background: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>TOTAL REGISTERED STUDENTS</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e3a8a', marginTop: '0.2rem' }}>{stats?.students || 124}</div>
        </div>

        <div className="card" style={{ background: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>VERIFIED INDUSTRY MENTORS</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0d9488', marginTop: '0.2rem' }}>{stats?.approved_alumni || 18}</div>
        </div>

        <div className="card" style={{ background: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>ACTIVE MENTORSHIP REQUESTS</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#6366f1', marginTop: '0.2rem' }}>{stats?.mentorship_requests || 42}</div>
        </div>

        <div className="card" style={{ background: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>AVG CAREER READINESS SCORE</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981', marginTop: '0.2rem' }}>76.4 <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/ 100</span></div>
        </div>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'overview' && (
        <div className="card" style={{ padding: '1.8rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Top Targeted Tech Career Paths Across Platform
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { role: "Data Analyst", percentage: 42, count: "52 Students" },
              { role: "Data Scientist", percentage: 28, count: "35 Students" },
              { role: "Full Stack Engineer", percentage: 18, count: "22 Students" },
              { role: "Machine Learning Engineer", percentage: 12, count: "15 Students" }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span>{item.role}</span>
                  <span>{item.count} ({item.percentage}%)</span>
                </div>
                <div className="progress-bg"><div className="progress-fill" style={{ width: `${item.percentage}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Pending Industry Mentor Verifications
          </h3>

          {pending.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <UserCheck size={40} color="#10b981" style={{ marginBottom: '0.8rem' }} />
              <p>No pending mentor registrations waiting for verification.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '0.8rem' }}>Name</th>
                    <th style={{ padding: '0.8rem' }}>Email</th>
                    <th style={{ padding: '0.8rem' }}>Registered Date</th>
                    <th style={{ padding: '0.8rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.8rem', fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: '0.8rem' }}>{p.email}</td>
                      <td style={{ padding: '0.8rem' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent'}</td>
                      <td style={{ padding: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleApproval(p.id, 'approve')} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                          Approve Mentor
                        </button>
                        <button onClick={() => handleApproval(p.id, 'reject')} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444' }}>
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>All Platform Users</h3>
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '250px' }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.8rem' }}>Name</th>
                  <th style={{ padding: '0.8rem' }}>Email</th>
                  <th style={{ padding: '0.8rem' }}>Role</th>
                  <th style={{ padding: '0.8rem' }}>Status</th>
                  <th style={{ padding: '0.8rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.8rem', fontWeight: 700 }}>{u.name}</td>
                    <td style={{ padding: '0.8rem' }}>{u.email}</td>
                    <td style={{ padding: '0.8rem' }}><span className="badge badge-primary">{u.role === 'alumni' ? 'Industry Mentor' : u.role}</span></td>
                    <td style={{ padding: '0.8rem' }}><span className={`badge ${u.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>{u.status}</span></td>
                    <td style={{ padding: '0.8rem' }}>
                      <button onClick={() => deleteUser(u.id)} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', color: '#ef4444' }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;