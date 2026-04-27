import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Shield, UserCheck, UserX, Clock, Users, Database } from 'lucide-react';

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [pendingRes, statsRes] = await Promise.all([
        api.get('/pending'),
        api.get('/stats')
      ]);
      setPending(pendingRes.data.data);
      setStats(statsRes.data);
      
      // Also fetch all users if you want a complete list
      // For now we'll simulate it or you can add an endpoint
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, action) => {
    try {
      await api.put(`/${action}/${id}`);
      // Refresh list
      setPending(pending.filter(p => p.id !== id));
      // Refresh stats
      const statsRes = await api.get('/stats');
      setStats(statsRes.data);
    } catch (err) {
      alert(`Failed to ${action}`);
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '50vh', color: 'white' }}>Loading Admin Console...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', background: 'var(--primary)', borderRadius: '12px' }}>
          <Shield color="white" size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>University Admin Console</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage alumni verifications and platform security.</p>
        </div>
      </header>

      {/* STATS SUMMARY */}
      {stats && (
        <div className="grid-cards" style={{ marginBottom: '4rem' }}>
          <AdminStat icon={<Users color="var(--primary)" />} label="Total Users" value={stats.total_users} />
          <AdminStat icon={<UserCheck color="var(--success)" />} label="Active Alumni" value={stats.alumni} />
          <AdminStat icon={<Clock color="var(--warning)" />} label="Pending Review" value={pending.length} />
          <AdminStat icon={<Database color="#7c3aed" />} label="Total Profiles" value={stats.profiles} />
        </div>
      )}

      {/* PENDING LIST */}
      <section>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={24} color="var(--warning)" /> Alumni Awaiting Verification
        </h2>
        
        <div className="glass" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
          {pending.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <UserCheck size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>All clear! No pending alumni for review.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)' }}>
                  <th style={{ padding: '1.25rem' }}>Name</th>
                  <th style={{ padding: '1.25rem' }}>Email</th>
                  <th style={{ padding: '1.25rem' }}>Registered On</th>
                  <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(alumni => (
                  <tr key={alumni.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '1.25rem', fontWeight: '600' }}>{alumni.name}</td>
                    <td style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>{alumni.email}</td>
                    <td style={{ padding: '1.25rem', fontSize: '0.9rem' }}>
                      {new Date(alumni.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleApproval(alumni.id, 'approve')}
                          style={{ ...btnBase, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}
                        >
                          <UserCheck size={18} /> Approve
                        </button>
                        <button 
                          onClick={() => handleApproval(alumni.id, 'reject')}
                          style={{ ...btnBase, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
                        >
                          <UserX size={18} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
      {/* ALL USERS LIST */}
      <section style={{ marginTop: '4rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users size={24} color="var(--primary)" /> Registered Users
        </h2>
        <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
           <p>Showing {stats?.total_users || 0} registered members across the platform.</p>
           <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Admins can now monitor verification status and platform growth from this central hub.</p>
        </div>
      </section>
    </div>
  );
};

const AdminStat = ({ icon, label, value }) => (
  <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.25rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
      {icon}
      <span style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem' }}>{label}</span>
    </div>
    <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{value}</h3>
  </div>
);

const btnBase = {
  border: 'none',
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.85rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s'
};

export default AdminDashboard;
