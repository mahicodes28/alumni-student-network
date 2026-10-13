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
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [pendingRes, statsRes, usersRes] = await Promise.all([
        api.get('/pending'),
        api.get('/stats'),
        api.get('/users')
      ]);

      setPending(pendingRes.data.data || []);
      setStats(statsRes.data || null);
      setUsers(usersRes.data.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, action) => {
    try {
      setActionInProgress(id);
      await api.put(`/${action}/${id}`);
      setPending((prev) => prev.filter((p) => p.id !== id));
      // Refresh stats and users
      const [statsRes, usersRes] = await Promise.all([
        api.get('/stats'),
        api.get('/users')
      ]);
      setStats(statsRes.data || null);
      setUsers(usersRes.data.data || []);
    } catch (err) {
      console.error(`Error during ${action}:`, err);
      alert(`Could not ${action} user.`);
    } finally {
      setActionInProgress(null);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      setActionInProgress(id);
      await api.delete(`/delete-user/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      const statsRes = await api.get('/stats');
      setStats(statsRes.data || null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user.');
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const domainData = stats?.domain_comparison || [];
  const totalRequests = stats?.mentorship_requests || 0;
  const acceptedRequests = stats?.accepted_requests || 0;
  const pendingRequests = stats?.pending_requests || 0;
  const rejectedRequests = stats?.rejected_requests || 0;

  if (loading) {
    return (
      <div className="ac-container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <Shield size={36} color="var(--primary)" className="animate-pulse" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
          Loading Institutional Analytics...
        </h2>
      </div>
    );
  }

  return (
    <div className="ac-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* 1. ADMIN HEADER */}
      <div className="ac-page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
            <span className="ac-badge ac-badge-blue">
              <Shield size={14} /> Institutional Admin Portal
            </span>
            <span className="ac-badge ac-badge-green">
              Live Database Feed
            </span>
          </div>
          <h1 className="ac-page-title">
            Institutional Analytics & Oversight
          </h1>
          <p className="ac-page-subtitle">
            Real-time platform metrics, alumni credential verification, and student–mentor engagement distribution.
          </p>
        </div>

        {/* TABS SELECTOR */}
        <div className="ac-tabs" style={{ marginBottom: 0 }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`ac-tab ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <BarChart3 size={16} /> Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`ac-tab ${activeTab === 'pending' ? 'active' : ''}`}
          >
            <UserCheck size={16} /> Pending Verifications ({pending.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`ac-tab ${activeTab === 'users' ? 'active' : ''}`}
          >
            <Users size={16} /> User Directory ({users.length})
          </button>
        </div>
      </div>

      {/* 2. REAL SUMMARY METRIC CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Total Students */}
        <div className="ac-card ac-card-hover" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            STUDENTS ENROLLED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '0.25rem' }}>
            {stats?.students ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Active student profiles
          </div>
        </div>

        {/* Verified Alumni */}
        <div className="ac-card ac-card-hover" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            VERIFIED ALUMNI MENTORS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.25rem' }}>
            {stats?.approved_alumni ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {stats?.pending_alumni ?? 0} pending verification
          </div>
        </div>

        {/* Mentorship Requests & Acceptance Rate */}
        <div className="ac-card ac-card-hover" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            ACCEPTANCE RATE
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {stats?.acceptance_rate ?? 0}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {stats?.accepted_requests ?? 0} of {stats?.mentorship_requests ?? 0} requests accepted
          </div>
        </div>

        {/* AI Conversations */}
        <div className="ac-card ac-card-hover" style={{ borderLeft: '4px solid var(--ai-indigo)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            AI SESSIONS & CHATS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--ai-indigo)', marginTop: '0.25rem' }}>
            {stats?.ai_conversations ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Interactive AI guidance runs
          </div>
        </div>
      </div>

      {/* 3. TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Charts Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.35fr 1fr',
            gap: '1.5rem',
            alignItems: 'start'
          }}>
            
            {/* Domain Comparison: Student Interest vs Mentor Supply */}
            <div className="ac-card" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Mentor Supply vs. Student Demand by Domain
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Compares declared student career interests against approved alumni mentors across technology tracks.
                </p>
              </div>

              {domainData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  No domain profile data recorded yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: 12, height: 12, background: 'var(--primary)', borderRadius: '3px' }}></span>
                      <span style={{ fontWeight: 600 }}>Student Interest</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: 12, height: 12, background: 'var(--secondary)', borderRadius: '3px' }}></span>
                      <span style={{ fontWeight: 600 }}>Mentor Supply</span>
                    </div>
                  </div>

                  {domainData.map((item, idx) => {
                    const maxVal = Math.max(...domainData.map(d => Math.max(d.student_interest, d.mentor_supply, 1)));
                    const studentPct = Math.min(100, Math.max(10, (item.student_interest / maxVal) * 100));
                    const mentorPct = Math.min(100, Math.max(10, (item.mentor_supply / maxVal) * 100));
                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0f172a' }}>
                          <span>{item.domain}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            Students: <strong>{item.student_interest}</strong> • Mentors: <strong>{item.mentor_supply}</strong>
                          </span>
                        </div>
                        {/* Student Bar */}
                        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '3px' }}>
                          <div style={{ width: `${studentPct}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                        </div>
                        {/* Mentor Bar */}
                        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${mentorPct}%`, height: '100%', background: 'var(--secondary)', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mentorship Request Outcomes Visualization */}
            <div className="ac-card" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Mentorship Request Status
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Total: {totalRequests} requests recorded
                </p>
              </div>

              {totalRequests === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  No mentorship requests initiated yet.
                </div>
              ) : (
                <div>
                  {/* Central Status Gauge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem 1rem',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    marginBottom: '1.25rem',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--success)' }}>
                        {stats?.acceptance_rate ?? 0}%
                      </div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                        Platform Acceptance Rate
                      </div>
                    </div>
                  </div>

                  {/* Status Breakdown List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--success-light)', borderRadius: '8px', border: '1px solid var(--success-border)' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--success)' }}>
                        ✓ Accepted Mentorships
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--success)' }}>
                        {acceptedRequests}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--warning-light)', borderRadius: '8px', border: '1px solid var(--warning-border)' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--warning)' }}>
                        ⏳ Pending Mentor Review
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--warning)' }}>
                        {pendingRequests}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--danger-light)', borderRadius: '8px', border: '1px solid var(--danger-border)' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--danger)' }}>
                        ✕ Declined / Inactive
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--danger)' }}>
                        {rejectedRequests}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Secondary Activity Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}>
            <div className="ac-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <MessageSquare size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Direct Communications</h4>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                {stats?.messages ?? 0}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total student–mentor messages exchanged
              </p>
            </div>

            <div className="ac-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Briefcase size={18} color="var(--secondary)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Alumni Broadcasts</h4>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                {stats?.broadcasts ?? 0}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Job openings & referral announcements
              </p>
            </div>

            <div className="ac-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Clock size={18} color="var(--warning)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Pending Approvals</h4>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)' }}>
                {stats?.pending_alumni ?? 0}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Alumni mentor accounts awaiting verification
              </p>
            </div>
          </div>

        </div>
      )}

      {/* 4. TAB 2: PENDING ALUMNI VERIFICATIONS */}
      {activeTab === 'pending' && (
        <div className="ac-card">
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Pending Industry Mentor Verifications ({pending.length})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Alumni who have registered and are awaiting institutional review before appearing in student mentor recommendations.
            </p>
          </div>

          {pending.length === 0 ? (
            <div className="ac-empty-state">
              <div className="ac-empty-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                <CheckCircle2 size={32} />
              </div>
              <div className="ac-empty-title">All Mentors Verified</div>
              <p className="ac-empty-desc">
                There are no alumni registrations currently waiting for administrator review.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--navy-600)' }}>
                    <th style={{ padding: '0.75rem' }}>Mentor Name</th>
                    <th style={{ padding: '0.75rem' }}>Email Address</th>
                    <th style={{ padding: '0.75rem' }}>Registration Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                        {p.name}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                        {p.email}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleApproval(p.id, 'approve')}
                            disabled={actionInProgress === p.id}
                            className="ac-btn ac-btn-primary ac-btn-sm"
                          >
                            <CheckCircle2 size={14} /> Approve Mentor
                          </button>
                          <button
                            onClick={() => handleApproval(p.id, 'reject')}
                            disabled={actionInProgress === p.id}
                            className="ac-btn ac-btn-outline ac-btn-sm"
                            style={{ color: 'var(--danger)' }}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: PLATFORM USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="ac-card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Platform User Directory ({users.length})
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Search and manage registered students, verified alumni, and platform administrators.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="alumni">Alumni</option>
                <option value="admin">Administrators</option>
              </select>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#f8fafc',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem'
              }}>
                <Search size={15} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ border: 'none', padding: 0, fontSize: '0.85rem', width: '200px', background: 'transparent' }}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--navy-600)' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No users match your search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                        {u.name}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                        {u.email}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`ac-badge ${u.role === 'admin' ? 'ac-badge-rose' : u.role === 'alumni' ? 'ac-badge-blue' : 'ac-badge-neutral'}`} style={{ textTransform: 'capitalize' }}>
                          {u.role === 'alumni' ? 'Alumni Mentor' : u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`ac-badge ${u.status === 'approved' ? 'ac-badge-green' : 'ac-badge-amber'}`}>
                          {u.status || 'approved'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => deleteUser(u.id)}
                            disabled={actionInProgress === u.id}
                            className="ac-btn ac-btn-outline ac-btn-sm"
                            style={{ color: 'var(--danger)', padding: '0.3rem 0.5rem' }}
                            title="Delete user"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;