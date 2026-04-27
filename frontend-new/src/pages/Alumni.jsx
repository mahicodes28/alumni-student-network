import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Search, Briefcase, Code, Send, CheckCircle } from 'lucide-react';

const Alumni = () => {
  const { user } = useAuth();
  const [skill, setSkill] = useState('');
  const [results, setResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState({});

  // Fetch alumni and recommendations on load
  React.useEffect(() => {
    fetchAlumni();
    if (user.role === 'student') fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await api.get(`/recommendations/${user.user_id}`);
      setRecommendations(res.data.data || []);
    } catch (err) {
      console.error('Recommendation error:', err);
    }
  };

  const fetchAlumni = async (searchSkill = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/alumni?skill=${searchSkill}`);
      setResults(res.data.data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchAlumni(skill);
  };

  const requestMentor = async (alumni_id) => {
    try {
      await api.post('/request', {
        student_id: user.user_id,
        alumni_id: alumni_id
      });
      setRequested(prev => ({ ...prev, [alumni_id]: true }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send request');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Find Alumni</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Search by skill, domain, or technology to find your ideal mentor.
      </p>

      {/* SEARCH BAR */}
      <form onSubmit={handleSearch} style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '3rem',
        maxWidth: '600px'
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'var(--bg-secondary)',
          padding: '1rem 1.5rem',
          borderRadius: '14px',
          border: '1px solid var(--border)'
        }}>
          <Search size={20} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="e.g. Python, React, Machine Learning..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              width: '100%',
              fontSize: '1rem'
            }}
          />
        </div>
        <button type="submit" style={{
          background: 'var(--primary)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '14px',
          fontWeight: '600',
          fontSize: '1rem'
        }}>
          Search
        </button>
      </form>

      {/* LOADING */}
      {loading && <p style={{ color: 'var(--text-secondary)' }}>Searching alumni...</p>}

      {/* RECOMMENDATIONS */}
      {user.role === 'student' && recommendations.length > 0 && !skill && (
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={24} /> Recommended for You
          </h2>
          <div className="grid-cards">
            {recommendations.map(alumni => (
              <AlumniCard
                key={`rec-${alumni.id}`}
                alumni={alumni}
                isStudent={true}
                requested={!!requested[alumni.id]}
                onRequest={() => requestMentor(alumni.id)}
                isRecommendation={true}
              />
            ))}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '3rem 0' }} />
        </div>
      )}

      {/* RESULTS */}
      {skill && <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Search Results</h2>}
      {!loading && results.length === 0 && skill && (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No alumni found for "<strong>{skill}</strong>"</p>
        </div>
      )}

      <div className="grid-cards">
        {results.map(alumni => (
          <AlumniCard
            key={alumni.id}
            alumni={alumni}
            isStudent={user.role === 'student'}
            requested={!!requested[alumni.id]}
            onRequest={() => requestMentor(alumni.id)}
          />
        ))}
      </div>
    </div>
  );
};

const AlumniCard = ({ alumni, isStudent, requested, onRequest, isRecommendation }) => (
  <div className="glass" style={{
    padding: '1.75rem',
    borderRadius: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'transform 0.3s',
    border: isRecommendation ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border)',
    position: 'relative'
  }}>
    {isRecommendation && (
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'var(--primary)',
        color: 'white',
        padding: '0.2rem 0.6rem',
        borderRadius: '8px',
        fontSize: '0.75rem',
        fontWeight: 'bold'
      }}>
        {alumni.match}% Match
      </div>
    )}
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{
        width: '48px', height: '48px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.25rem', fontWeight: '700'
      }}>
        {alumni.name?.[0]?.toUpperCase()}
      </div>
      <div>
        <h3 style={{ margin: 0 }}>{alumni.name}</h3>
        {alumni.company && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            {alumni.company}
          </p>
        )}
      </div>
    </div>

    {alumni.skills && (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {alumni.skills.split(',').map((s, i) => (
          <span key={i} style={{
            background: 'rgba(59,130,246,0.15)',
            color: 'var(--primary)',
            padding: '0.25rem 0.75rem',
            borderRadius: '99px',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            {s.trim()}
          </span>
        ))}
      </div>
    )}

    {alumni.experience && (
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <Briefcase size={14} style={{ marginRight: '6px' }} />
        {alumni.experience}
      </p>
    )}

    {isStudent && (
      <button
        onClick={onRequest}
        disabled={requested}
        style={{
          marginTop: 'auto',
          padding: '0.75rem',
          borderRadius: '10px',
          background: requested ? 'rgba(16, 185, 129, 0.1)' : 'var(--primary)',
          color: requested ? 'var(--success)' : 'white',
          border: requested ? '1px solid var(--success)' : 'none',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          cursor: requested ? 'default' : 'pointer'
        }}
      >
        {requested ? <><CheckCircle size={18} /> Requested!</> : <><Send size={18} /> Request Mentorship</>}
      </button>
    )}
  </div>
);

export default Alumni;
