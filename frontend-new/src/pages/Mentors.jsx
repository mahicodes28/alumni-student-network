import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, CheckCircle2, MessageCircle, UserPlus, Sparkles, Building2 } from 'lucide-react';

const Mentors = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMentorsData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/mentors/matched');
      setMentors(res.data.data || []);

      if (user && user.user_id) {
        const reqRes = await api.get(`/requests/${user.user_id}`);
        setRequests(reqRes.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching mentors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorsData();
  }, [user]);

  const sendMentorshipRequest = async (mentorId) => {
    try {
      await api.post('/request', {
        student_id: user.user_id,
        alumni_id: mentorId
      });
      alert("Mentorship request sent successfully!");
      fetchMentorsData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send request.");
    }
  };

  const getRequestStatus = (mentorId) => {
    const found = requests.find(r => r.other_id === mentorId);
    return found ? found.status : null;
  };

  return (
    <div className="cp-container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#86198f', fontWeight: 600, fontSize: '0.9rem' }}>
          <GraduationCap size={16} /> INDUSTRY MENTOR MATCHING
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Industry Mentor Matching
        </h1>
        <p style={{ color: '#64748b' }}>
          Connect 1-on-1 with experienced Data Scientists, Software Engineers, and Managers matched to your target role.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {mentors.map((mentor) => {
          const reqStatus = getRequestStatus(mentor.id);
          return (
            <div key={mentor.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '5px solid #86198f' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '0.3rem' }}>{mentor.role_display}</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{mentor.name}</h3>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.88rem', fontWeight: 800 }}>
                    {mentor.match_score}% MATCH
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} /> {mentor.title}
                </div>

                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                  {mentor.bio}
                </p>

                <div style={{ background: '#faf5ff', padding: '0.8rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #f0abfc' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#86198f', marginBottom: '0.3rem' }}>
                    WHY THIS MENTOR MATCHES YOU
                  </div>
                  <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.82rem', color: '#4a044e', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {mentor.match_reasons.map((r, i) => (
                      <li key={i}>✓ {r}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 600, marginBottom: '1rem' }}>
                  ⚡ {mentor.availability}
                </div>
              </div>

              <div>
                {reqStatus === 'accepted' ? (
                  <Link to="/messages" className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none' }}>
                    <MessageCircle size={16} /> Send Direct Message
                  </Link>
                ) : reqStatus === 'pending' ? (
                  <button className="btn btn-outline" disabled style={{ width: '100%', opacity: 0.7 }}>
                    Mentorship Request Pending
                  </button>
                ) : (
                  <button onClick={() => sendMentorshipRequest(mentor.id)} className="btn btn-primary" style={{ width: '100%', background: '#86198f' }}>
                    <UserPlus size={16} /> Request Mentorship
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mentors;
