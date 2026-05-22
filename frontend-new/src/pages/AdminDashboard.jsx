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
  Bell,
  LayoutDashboard
} from 'lucide-react';

const AdminDashboard = () => {

  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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
      console.error(err);
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
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <h2>Loading Admin Console...</h2>
      </div>
    );
  }

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <Shield size={28} />
          <h2>UniAdmin</h2>
        </div>

        <nav className="sidebar-nav">

          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <SidebarItem icon={<Clock size={20} />} label="Pending Alumni" />
          <SidebarItem icon={<Users size={20} />} label="Users" />
          <SidebarItem icon={<Briefcase size={20} />} label="Broadcasts" />
          <SidebarItem icon={<MessageSquare size={20} />} label="Mentorships" />
          <SidebarItem icon={<BarChart3 size={20} />} label="Analytics" />
          <SidebarItem icon={<Bell size={20} />} label="Notifications" />

        </nav>

      </aside>

      {/* MAIN */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>
            <h1>University Admin Console</h1>
            <p>Manage alumni verification and monitor platform activity.</p>
          </div>

          <div className="admin-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </header>

        {/* STATS */}

        {stats && (
          <section className="stats-grid">

            <StatCard
              icon={<Users />}
              label="Total Users"
              value={stats.total_users}
            />

            <StatCard
              icon={<UserCheck />}
              label="Approved Alumni"
              value={stats.approved_alumni}
            />

            <StatCard
              icon={<Clock />}
              label="Pending Alumni"
              value={stats.pending_alumni}
            />

            <StatCard
              icon={<Briefcase />}
              label="Broadcast Posts"
              value={stats.broadcasts}
            />

            <StatCard
              icon={<MessageSquare />}
              label="Messages"
              value={stats.messages}
            />

            <StatCard
              icon={<BarChart3 />}
              label="Mentorship Requests"
              value={stats.mentorship_requests}
            />

          </section>
        )}

        {/* PENDING APPROVALS */}

        <section className="glass-card">

          <div className="section-header">
            <h2>Pending Alumni Verification</h2>
          </div>

          {pending.length === 0 ? (
            <div className="empty-state">
              <UserCheck size={50} />
              <p>No pending alumni approvals.</p>
            </div>
          ) : (
            <table className="admin-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {pending.map(user => (

                  <tr key={user.id}>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="approve-btn"
                          onClick={() => handleApproval(user.id, 'approve')}
                        >
                          <UserCheck size={16} />
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => handleApproval(user.id, 'reject')}
                        >
                          <UserX size={16} />
                          Reject
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          )}

        </section>

        {/* USERS */}

        <section className="glass-card">

          <div className="section-header">
            <h2>All Platform Users</h2>
          </div>

          <table className="admin-table">

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredUsers.map(user => (

                <tr key={user.id}>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>
                    <span className="role-pill">
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span className={`status-pill ${user.status}`}>
                      {user.status}
                    </span>
                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 size={16} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </section>

      </main>

      {/* CSS */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #0f172a;
          color: white;
          font-family: Inter, sans-serif;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 260px;
          background: rgba(255,255,255,0.03);
          border-right: 1px solid rgba(255,255,255,0.08);
          padding: 2rem 1.5rem;
          backdrop-filter: blur(20px);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 1rem;
          border-radius: 12px;
          cursor: pointer;
          transition: 0.2s;
          color: #cbd5e1;
        }

        .sidebar-item:hover,
        .sidebar-item.active {
          background: rgba(99,102,241,0.15);
          color: white;
        }

        .admin-main {
          flex: 1;
          padding: 2rem;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .admin-header p {
          color: #94a3b8;
        }

        .admin-search {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255,255,255,0.05);
          padding: 0.8rem 1rem;
          border-radius: 12px;
        }

        .admin-search input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          width: 220px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 1.5rem;
          backdrop-filter: blur(16px);
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .stat-card h2 {
          margin: 0;
          font-size: 2rem;
        }

        .stat-card p {
          color: #94a3b8;
          margin: 0;
        }

        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 2rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(18px);
        }

        .section-header {
          margin-bottom: 1.5rem;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          text-align: left;
          padding: 1rem;
          color: #94a3b8;
        }

        .admin-table td {
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }

        button {
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }

        .approve-btn {
          background: rgba(16,185,129,0.15);
          color: #10b981;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .reject-btn {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .delete-btn {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
          padding: 0.7rem;
          border-radius: 10px;
        }

        .role-pill {
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          font-size: 0.8rem;
          text-transform: capitalize;
        }

        .status-pill {
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          font-size: 0.8rem;
          text-transform: capitalize;
        }

        .status-pill.approved {
          background: rgba(16,185,129,0.15);
          color: #10b981;
        }

        .status-pill.pending {
          background: rgba(245,158,11,0.15);
          color: #f59e0b;
        }

        .status-pill.rejected {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
        }

        .empty-state {
          text-align: center;
          padding: 4rem;
          color: #94a3b8;
        }

        .admin-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #0f172a;
          color: white;
        }

      `}</style>

    </div>
  );
};

const SidebarItem = ({ icon, label, active }) => (
  <div className={`sidebar-item ${active ? 'active' : ''}`}>
    {icon}
    <span>{label}</span>
  </div>
);

const StatCard = ({ icon, label, value }) => (
  <div className="stat-card">

    <div className="stat-top">
      {icon}
    </div>

    <h2>{value}</h2>

    <p>{label}</p>

  </div>
);

export default AdminDashboard;