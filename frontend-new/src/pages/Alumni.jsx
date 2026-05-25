import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

import {
  Search,
  Briefcase,
  Send,
  CheckCircle,
  Sparkles,
  Building2,
  X,
  GraduationCap,
  Clock,
  Star,
  Trophy,
  BriefcaseBusiness
} from 'lucide-react';

const Alumni = () => {

  const { user } = useAuth();

  const [query, setQuery] = useState('');

  const [results, setResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [connectedMentors, setConnectedMentors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [requested, setRequested] = useState({});

  const [selectedAlumni, setSelectedAlumni] = useState(null);

  useEffect(() => {

    fetchAlumni('');

    fetchBroadcasts();

    if (user.role === 'student') {
      fetchRecommendations();
      fetchConnectedMentors();
    }

  }, []);

  const fetchRecommendations = async () => {

    try {

      const res = await api.get(
        `/recommendations/${user.user_id}`
      );

      setRecommendations(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const fetchConnectedMentors = async () => {

    try {

      const id = user.user_id || user.id || user._id;

      const res = await api.get(`/my-mentors/${id}`);

      setConnectedMentors(res.data.data || []);

    } catch (err) {

      console.error('Failed to fetch connected mentors', err);

    }

  };

  const fetchBroadcasts = async () => {

    try {

      const res = await api.get('/broadcasts');

      setBroadcasts(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const fetchAlumni = async (searchTerm = '') => {

    setLoading(true);

    try {

      const res = await api.get(
        `/alumni?q=${encodeURIComponent(searchTerm)}`
      );

      console.log('fetchAlumni response:', res.data);

      setResults(res.data.data || []);

    } catch (err) {

      console.error('Error fetching alumni:', err);
      setResults([]);

    } finally {

      setLoading(false);

    }

  };

  const handleSearch = async (e) => {

    e.preventDefault();

    setSearched(true);

    fetchAlumni(query);

  };

  const isConnected = (alumniId) => {
    return connectedMentors.some(m => m.alumni_id === alumniId);
  };

  const requestMentor = async (alumni_id) => {

    try {

      await api.post('/request', {

        student_id: user.user_id,

        alumni_id

      });

      setRequested(prev => ({
        ...prev,
        [alumni_id]: true
      }));

    } catch (err) {

      alert(
        err.response?.data?.error ||
        'Failed to send request'
      );

    }

  };

  return (

    <div className="alumni-page">

      {/* HERO */}

      <section className="hero-section">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={16} />
            Verified Alumni Network
          </div>

          <h1>
            Connect With Industry Mentors
          </h1>

          <p>
            Discover verified alumni, career mentors,
            internship opportunities, and professional guidance.
          </p>

          {/* SEARCH */}

          <form
            onSubmit={handleSearch}
            className="search-box"
          >

            <div className="search-field">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search by job title or skills..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

            </div>

            <button type="submit">
              Explore Alumni
            </button>

          </form>

        </div>

      </section>

      {/* RECOMMENDATIONS */}

      {recommendations.length > 0 && (
        <section className="section">

          <div className="section-title">

            <div>
              <h2>Recommended Mentors</h2>
              <p>
                Personalized mentor suggestions
                based on your profile.
              </p>
            </div>

          </div>

          <div className="grid-cards">

            {recommendations.map(alumni => (

              <AlumniCard
                key={alumni.id}
                alumni={alumni}
                requested={requested[alumni.id]}
                onRequest={() =>
                  requestMentor(alumni.id)
                }
                openProfile={() =>
                  setSelectedAlumni(alumni)
                }
                recommended
              />

            ))}

          </div>

        </section>
      )}

      {/* OPPORTUNITY FEED */}

      <section className="section">

        <div className="section-title">

          <div>
            <h2>Career Opportunities</h2>
            <p>
              Latest internships, referrals,
              and hiring updates from alumni.
            </p>
          </div>

        </div>

        <div className="opportunity-grid">

          {broadcasts.map(post => (

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
                <Building2 size={16} />
                {post.company}
              </p>

              <p className="description">
                {post.description}
              </p>

              <button>
                View Opportunity
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* ALUMNI LIST */}

      <section className="section">

        <div className="section-title">

          <div>
            <h2>Explore Alumni</h2>
            <p>
              Browse verified professionals from
              various industries and domains.
            </p>
          </div>

        </div>

        {loading && (
          <div className="loading-box">
            Searching alumni...
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            color: '#94a3b8'
          }}>
            <h3 style={{ color: '#cbd5e1' }}>No match found</h3>
            <p>Try searching with different keywords like job titles or skills.</p>
          </div>
        )}

        {!loading && (results.length > 0 || !searched) && (
          <div className="grid-cards">

          {results.map(alumni => {

            const connected = isConnected(alumni.id);

            return (
              <AlumniCard
                key={alumni.id}
                alumni={alumni}
                requested={requested[alumni.id]}
                connected={connected}
                onRequest={() =>
                  requestMentor(alumni.id)
                }
                openProfile={() =>
                  setSelectedAlumni(alumni)
                }
              />
            );

          })}

        </div>
        )}

      </section>

      {/* MODAL */}

      {selectedAlumni && (

        <div className="modal-overlay">

          <div className="profile-modal">

            <button
              className="close-btn"
              onClick={() =>
                setSelectedAlumni(null)
              }
            >
              <X size={18} />
            </button>

            <div className="profile-header">

              <div className="profile-avatar">
                {selectedAlumni.name?.[0]}
              </div>

              <div>

                <h2>{selectedAlumni.name}</h2>

                <p>
                  {selectedAlumni.company}
                </p>

              </div>

            </div>

            <div className="profile-section">

              <h4>Skills</h4>

              <div className="skills-wrap">

                {selectedAlumni.skills
                  ?.split(',')
                  .map((skill, i) => (

                    <span key={i}>
                      {skill.trim()}
                    </span>

                  ))}

              </div>

            </div>

            <div className="profile-section">

              <h4>Experience</h4>

              <p>
                {selectedAlumni.experience}
              </p>

            </div>

            <button
              className="mentor-btn"
              onClick={() =>
                requestMentor(selectedAlumni.id)
              }
            >

              <Send size={18} />

              Request Mentorship

            </button>

          </div>

        </div>

      )}

      {/* CSS */}

      <style>{`

        *{
          box-sizing:border-box;
        }

        body{
          background:#081120;
          color:white;
          font-family:Inter,sans-serif;
        }

        .alumni-page{
          min-height:100vh;
        }

        .hero-section{
          position:relative;
          padding:7rem 8%;
          overflow:hidden;
          background:
          linear-gradient(
          135deg,
          rgba(15,23,42,0.95),
          rgba(30,41,59,0.92)
          ),
          url('https://img.freepik.com/free-photo/abstract-gradient-background-with-grain-texture-captivating-noise-airbrush-minimalist-wallpaper_8048-560.jpg');
          background-size:cover;
          background-position:center;
        }

        .hero-overlay{
          position:absolute;
          inset:0;
          backdrop-filter:blur(3px);
        }

        .hero-content{
          position:relative;
          z-index:2;
          max-width:900px;
        }

        .hero-badge{
          display:inline-flex;
          align-items:center;
          gap:0.5rem;
          background:rgba(59,130,246,0.12);
          border:1px solid rgba(59,130,246,0.25);
          padding:0.7rem 1rem;
          border-radius:999px;
          margin-bottom:2rem;
          color:#60a5fa;
          font-weight:600;
        }

        .hero-content h1{
          font-size:4rem;
          line-height:1.1;
          margin-bottom:1rem;
        }

        .hero-content p{
          color:#94a3b8;
          font-size:1.15rem;
          max-width:700px;
          line-height:1.8;
        }

        .search-box{
          margin-top:3rem;
          display:flex;
          gap:1rem;
          flex-wrap:wrap;
        }

        .search-field{
          flex:1;
          min-width:240px;
          display:flex;
          align-items:center;
          gap:0.8rem;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          padding:1rem 1.2rem;
          border-radius:14px;
          backdrop-filter:blur(10px);
        }

        .search-field input{
          background:transparent;
          border:none;
          outline:none;
          color:white;
          width:100%;
        }

        .search-box button{
          background:#2563eb;
          color:white;
          border:none;
          padding:1rem 2rem;
          border-radius:14px;
          font-weight:600;
          cursor:pointer;
        }

        .section{
          padding:4rem 8%;
        }

        .section-title{
          margin-bottom:2rem;
        }

        .section-title h2{
          font-size:2rem;
          margin-bottom:0.5rem;
        }

        .section-title p{
          color:#94a3b8;
        }

        .grid-cards{
          display:grid;
          grid-template-columns:
          repeat(auto-fit,minmax(320px,1fr));
          gap:1.5rem;
        }

        .mentor-card{
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          padding:1.7rem;
          border-radius:24px;
          backdrop-filter:blur(14px);
          transition:0.3s;
        }

        .mentor-card:hover{
          transform:translateY(-5px);
          border-color:rgba(59,130,246,0.35);
        }

        .mentor-top{
          display:flex;
          align-items:center;
          gap:1rem;
          margin-bottom:1rem;
        }

        .mentor-avatar{
          width:58px;
          height:58px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:
          linear-gradient(
          135deg,
          #2563eb,
          #7c3aed
          );
          font-size:1.4rem;
          font-weight:700;
        }

        .mentor-company{
          color:#94a3b8;
          font-size:0.9rem;
        }

        .skills-wrap{
          display:flex;
          flex-wrap:wrap;
          gap:0.5rem;
          margin:1rem 0;
        }

        .skills-wrap span{
          background:rgba(59,130,246,0.12);
          color:#60a5fa;
          padding:0.4rem 0.8rem;
          border-radius:999px;
          font-size:0.8rem;
        }

        .mentor-actions{
          margin-top:1.5rem;
          display:flex;
          gap:1rem;
        }

        .mentor-btn{
          flex:1;
          border:none;
          background:#2563eb;
          color:white;
          padding:0.9rem;
          border-radius:12px;
          font-weight:600;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:0.5rem;
          cursor:pointer;
        }

        .profile-btn{
          flex:1;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          color:white;
          border-radius:12px;
          cursor:pointer;
        }

        .opportunity-grid{
          display:grid;
          grid-template-columns:
          repeat(auto-fit,minmax(300px,1fr));
          gap:1.5rem;
        }

        .opportunity-card{
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:24px;
          padding:1.7rem;
        }

        .type-pill{
          background:rgba(16,185,129,0.12);
          color:#10b981;
          padding:0.35rem 0.7rem;
          border-radius:999px;
          font-size:0.75rem;
        }

        .company{
          display:flex;
          align-items:center;
          gap:0.5rem;
          color:#94a3b8;
        }

        .description{
          color:#cbd5e1;
          line-height:1.7;
          margin:1rem 0;
        }

        .opportunity-card button{
          width:100%;
          padding:0.9rem;
          border:none;
          border-radius:12px;
          background:#2563eb;
          color:white;
          cursor:pointer;
        }

        .modal-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.7);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:999;
        }

        .profile-modal{
          width:90%;
          max-width:520px;
          background:#0f172a;
          border:1px solid rgba(255,255,255,0.08);
          border-radius:28px;
          padding:2rem;
          position:relative;
        }

        .close-btn{
          position:absolute;
          top:1rem;
          right:1rem;
          background:rgba(255,255,255,0.05);
          border:none;
          width:38px;
          height:38px;
          border-radius:50%;
          color:white;
          cursor:pointer;
        }

        .profile-header{
          display:flex;
          align-items:center;
          gap:1rem;
          margin-bottom:2rem;
        }

        .profile-avatar{
          width:70px;
          height:70px;
          border-radius:50%;
          background:
          linear-gradient(
          135deg,
          #2563eb,
          #7c3aed
          );
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:1.8rem;
          font-weight:700;
        }

        .profile-section{
          margin-bottom:1.5rem;
        }

        .profile-section h4{
          margin-bottom:0.7rem;
        }

        .loading-box{
          padding:2rem;
          text-align:center;
          color:#94a3b8;
        }

        @media(max-width:768px){

          .hero-content h1{
            font-size:2.8rem;
          }

          .section{
            padding:3rem 5%;
          }

        }

      `}</style>

    </div>

  );
};

const AlumniCard = ({
  alumni,
  requested,
  onRequest,
  openProfile,
  recommended,
  connected
}) => (

  <div className="mentor-card">

    <div className="mentor-top">

      <div className="mentor-avatar">
        {alumni.name?.[0]}
      </div>

      <div>

        <h3>{alumni.name}</h3>

        <p className="mentor-company">
          {alumni.company}
        </p>

      </div>

    </div>

    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
      {recommended && (
        <div className="hero-badge">
          <Star size={14} />
          {alumni.match}% Match
        </div>
      )}
      {connected && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          background: 'rgba(16,185,129,0.12)',
          color: '#10b981',
          padding: '0.35rem 0.7rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          <CheckCircle size={12} />
          Connected
        </div>
      )}
    </div>

    <div className="skills-wrap">

      {alumni.skills
        ?.split(',')
        .map((skill, i) => (

          <span key={i}>
            {skill.trim()}
          </span>

        ))}

    </div>

    <p className="mentor-company">

      <Briefcase size={14} />

      {alumni.experience}

    </p>

    <div className="mentor-actions">

      <button
        className="mentor-btn"
        onClick={onRequest}
        disabled={requested || connected}
        style={{ opacity: (requested || connected) ? 0.6 : 1, cursor: (requested || connected) ? 'not-allowed' : 'pointer' }}
      >

        {requested ? (
          <>
            <CheckCircle size={18} />
            Requested
          </>
        ) : connected ? (
          <>
            <CheckCircle size={18} />
            Connected
          </>
        ) : (
          <>
            <Send size={18} />
            Request
          </>
        )}

      </button>

      <button
        className="profile-btn"
        onClick={openProfile}
      >
        View Profile
      </button>

    </div>

  </div>

);

export default Alumni;