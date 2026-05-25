import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Mentors = () => {

  const { user } = useAuth();

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
        const id = user.user_id || user.id || user._id;
        const res = await api.get(`/my-mentors/${id}`);
        setMentors(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch mentors', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentors-page" style={{ padding: '2rem' }}>

      <h1>Connected Mentors</h1>

      <p style={{ color: '#94a3b8' }}>
        A list of mentors you are currently connected with.
      </p>

      {loading ? (
        <div style={{ marginTop: '2rem' }}>Loading mentors...</div>
      ) : mentors.length === 0 ? (
        <div style={{ marginTop: '2rem', color: '#94a3b8' }}>
          No connected mentors found.
        </div>
      ) : (
        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
          {mentors.map(m => (
            <div key={m.request_id} style={{
              background: 'rgba(255,255,255,0.04)',
              padding: '1rem',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0 }}>{m.other_name}</h3>
                <p style={{ margin: 0, color: '#94a3b8' }}>{m.company}</p>
                <p style={{ marginTop: '0.5rem', color: '#cbd5e1' }}>{m.skills}</p>
              </div>
              <div style={{ color: '#60a5fa' }}>{m.status}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );

};

export default Mentors;
