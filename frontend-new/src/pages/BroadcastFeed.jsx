import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Sparkles,
  Building2,
  Calendar,
  Plus,
  ExternalLink,
  Briefcase,
  Users
} from 'lucide-react';
import CreateBroadcast from '../components/CreateBroadcast';

const BroadcastFeed = () => {
  const { user } = useAuth();
  const [broadcasts, setBroadcasts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/broadcasts');
      setBroadcasts(res.data.data || []);
    } catch (err) {
      console.error('Error fetching broadcasts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBroadcasts = broadcasts.filter((b) => {
    const matchesSearch =
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.company?.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filterType === 'All' || b.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="ac-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* 1. HEADER */}
      <div className="ac-page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
            <span className="ac-badge ac-badge-blue">
              <Briefcase size={14} /> Alumni Opportunity Feed
            </span>
          </div>
          <h1 className="ac-page-title">
            Job & Internship Broadcasts
          </h1>
          <p className="ac-page-subtitle">
            Opportunities, open roles, and direct referrals shared by verified university alumni.
          </p>
        </div>

        {user?.role === 'alumni' && (
          <button
            onClick={() => setShowModal(true)}
            className="ac-btn ac-btn-primary"
          >
            <Plus size={16} /> Post Opportunity / Referral
          </button>
        )}
      </div>

      {/* 2. FILTERS & SEARCH BAR */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {['All', 'Internship', 'Full-Time', 'Referral', 'Event'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`ac-btn ac-btn-sm ${filterType === t ? 'ac-btn-navy' : 'ac-btn-outline'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#f8fafc',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '0.4rem 0.75rem',
          width: '280px'
        }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search role, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', padding: 0, fontSize: '0.85rem', width: '100%', background: 'transparent' }}
          />
        </div>
      </div>

      {/* 3. BROADCASTS LIST */}
      {loading ? (
        <div className="ac-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading broadcasts...</div>
        </div>
      ) : filteredBroadcasts.length === 0 ? (
        <div className="ac-empty-state">
          <div className="ac-empty-icon">
            <Briefcase size={28} />
          </div>
          <div className="ac-empty-title">No Opportunities Posted Yet</div>
          <p className="ac-empty-desc">
            Check back soon for new alumni postings or referrals from the university network.
          </p>
          {user?.role === 'alumni' && (
            <button onClick={() => setShowModal(true)} className="ac-btn ac-btn-primary ac-btn-sm">
              <Plus size={15} /> Be the first to post
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredBroadcasts.map((b) => (
            <div key={b._id || b.id} className="ac-card ac-card-hover" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="ac-badge ac-badge-blue">
                      {b.type || 'Opportunity'}
                    </span>
                    {b.company && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {b.company}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    {b.title}
                  </h3>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} />
                  {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Active'}
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.25rem', whiteSpace: 'pre-line' }}>
                {b.description}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border)',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Posted by: <strong>{b.author_name || 'Alumni Member'}</strong>
                </div>

                {b.link && (
                  <a
                    href={b.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ac-btn ac-btn-primary ac-btn-sm"
                  >
                    View Details / Apply <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <CreateBroadcast
          onClose={() => setShowModal(false)}
          onCreated={fetchBroadcasts}
        />
      )}

    </div>
  );
};

export default BroadcastFeed;