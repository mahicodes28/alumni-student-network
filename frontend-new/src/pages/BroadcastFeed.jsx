import React, {
    useEffect,
    useState
  } from 'react';
  
  import api from '../utils/api';
  
  import { useAuth } from '../context/AuthContext';
  
  import {
  
    BriefcaseBusiness,
    Search,
    Sparkles,
    Building2,
    Calendar,
    Plus,
    ExternalLink
  
  } from 'lucide-react';
  
  import CreateBroadcast from '../components/CreateBroadcast';
  
  const BroadcastFeed = () => {
  
    const { user } = useAuth();
  
    const [broadcasts, setBroadcasts] =
      useState([]);
  
    const [search, setSearch] =
      useState('');
  
    const [filter, setFilter] =
      useState('');
  
    const [showModal, setShowModal] =
      useState(false);
  
    const [loading, setLoading] =
      useState(true);
  
    useEffect(() => {
  
      fetchBroadcasts();
  
    }, []);
  
    const fetchBroadcasts = async () => {
  
      try {
  
        const res = await api.get(
          `/broadcasts`
        );
  
        setBroadcasts(
          res.data.data || []
        );
  
      } catch (err) {
  
        console.error(err);
  
      } finally {
  
        setLoading(false);
  
      }
  
    };
  
    // FILTERED DATA
  
    const filteredBroadcasts =
      broadcasts.filter((b) => {
  
        const matchesSearch =
  
          b.title
            ?.toLowerCase()
            .includes(search.toLowerCase())
  
          ||
  
          b.company
            ?.toLowerCase()
            .includes(search.toLowerCase());
  
        const matchesFilter =
  
          !filter ||
  
          b.type
            ?.toLowerCase()
            .includes(filter.toLowerCase());
  
        return (
          matchesSearch &&
          matchesFilter
        );
  
      });
  
    return (
  
      <div className="broadcast-page">
  
        {/* HERO */}
  
        <div className="hero-section">
  
          <div>
  
            <div className="hero-badge">
  
              <Sparkles size={16} />
  
              Alumni Career Network
  
            </div>
  
            <h1>
              Opportunities & Career Feed
            </h1>
  
            <p>
              Discover internships, referrals,
              job openings, and career updates
              shared by alumni.
            </p>
  
          </div>
  
          {/* CREATE */}
  
          {user.role === 'alumni' && (
  
            <button
              className="create-btn"
              onClick={() =>
                setShowModal(true)
              }
            >
  
              <Plus size={18} />
  
              Create Broadcast
  
            </button>
  
          )}
  
        </div>
  
        {/* SEARCH */}
  
        <div className="filters">
  
          <div className="search-box">
  
            <Search size={18} />
  
            <input
              type="text"
              placeholder="Search opportunities..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
  
          </div>
  
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
  
            <option value="">
              All Types
            </option>
  
            <option value="internship">
              Internship
            </option>
  
            <option value="job">
              Job
            </option>
  
            <option value="event">
              Event
            </option>
  
            <option value="referral">
              Referral
            </option>
  
          </select>
  
        </div>
  
        {/* FEED */}
  
        {loading ? (
  
          <div className="loading-box">
            Loading opportunities...
          </div>
  
        ) : (
  
          <div className="broadcast-grid">
  
            {filteredBroadcasts.map(post => (
  
              <div
                key={post.id}
                className="broadcast-card"
              >
  
                <div className="card-top">
  
                  <span className="type-pill">
                    {post.type}
                  </span>
  
                </div>
  
                <h2>
                  {post.title}
                </h2>
  
                <div className="meta">
  
                  <span>
  
                    <Building2 size={16} />
  
                    {post.company}
  
                  </span>
  
                  <span>
  
                    <Calendar size={16} />
  
                    {
                      new Date(
                        post.createdAt
                      ).toLocaleDateString()
                    }
  
                  </span>
  
                </div>
  
                <p className="desc">
                  {post.description}
                </p>
  
                {post.link && (
  
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noreferrer"
                    className="apply-btn"
                  >
  
                    Apply Now
  
                    <ExternalLink size={16} />
  
                  </a>
  
                )}
  
              </div>
  
            ))}
  
          </div>
  
        )}
  
        {/* MODAL */}
  
        {showModal && (
  
          <CreateBroadcast
            onClose={() =>
              setShowModal(false)
            }
            onCreated={fetchBroadcasts}
          />
  
        )}
  
        {/* CSS */}
  
        <style>{`
  
          body{
            background:#081120;
            color:white;
            font-family:Inter,sans-serif;
          }
  
          .broadcast-page{
            padding:3rem 8%;
            min-height:100vh;
          }
  
          .hero-section{
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:2rem;
            flex-wrap:wrap;
            margin-bottom:3rem;
          }
  
          .hero-badge{
            display:inline-flex;
            align-items:center;
            gap:0.5rem;
            background:
            rgba(59,130,246,0.12);
            color:#60a5fa;
            padding:0.7rem 1rem;
            border-radius:999px;
            margin-bottom:1rem;
          }
  
          .hero-section h1{
            font-size:3rem;
            margin-bottom:1rem;
          }
  
          .hero-section p{
            color:#94a3b8;
            max-width:700px;
            line-height:1.8;
          }
  
          .create-btn{
            border:none;
            background:
            linear-gradient(
            135deg,
            #2563eb,
            #3b82f6
            );
            color:white;
            padding:1rem 1.5rem;
            border-radius:16px;
            display:flex;
            align-items:center;
            gap:0.7rem;
            cursor:pointer;
            font-weight:600;
          }
  
          .filters{
            display:flex;
            gap:1rem;
            flex-wrap:wrap;
            margin-bottom:2rem;
          }
  
          .search-box{
            flex:1;
            min-width:280px;
            display:flex;
            align-items:center;
            gap:0.8rem;
            background:
            rgba(255,255,255,0.04);
            border:
            1px solid rgba(255,255,255,0.08);
            padding:1rem;
            border-radius:16px;
          }
  
          .search-box input{
            background:transparent;
            border:none;
            outline:none;
            color:white;
            width:100%;
          }
  
          select{
            background:
            rgba(255,255,255,0.04);
            border:
            1px solid rgba(255,255,255,0.08);
            color:white;
            border-radius:16px;
            padding:1rem;
          }
  
          .broadcast-grid{
            display:grid;
            grid-template-columns:
            repeat(auto-fit,minmax(350px,1fr));
            gap:1.5rem;
          }
  
          .broadcast-card{
            background:
            rgba(255,255,255,0.04);
            border:
            1px solid rgba(255,255,255,0.08);
            border-radius:24px;
            padding:1.7rem;
            transition:0.3s;
          }
  
          .broadcast-card:hover{
            transform:translateY(-5px);
            border-color:
            rgba(59,130,246,0.25);
          }
  
          .type-pill{
            background:
            rgba(16,185,129,0.12);
            color:#10b981;
            padding:0.35rem 0.8rem;
            border-radius:999px;
            font-size:0.75rem;
          }
  
          .broadcast-card h2{
            margin:1rem 0;
          }
  
          .meta{
            display:flex;
            gap:1rem;
            flex-wrap:wrap;
            color:#94a3b8;
            font-size:0.9rem;
          }
  
          .meta span{
            display:flex;
            align-items:center;
            gap:0.4rem;
          }
  
          .desc{
            margin:1.5rem 0;
            line-height:1.8;
            color:#cbd5e1;
          }
  
          .apply-btn{
            display:inline-flex;
            align-items:center;
            gap:0.5rem;
            text-decoration:none;
            background:#2563eb;
            color:white;
            padding:0.9rem 1.2rem;
            border-radius:12px;
          }
  
          .loading-box{
            text-align:center;
            padding:4rem;
            color:#94a3b8;
          }
  
        `}</style>
  
      </div>
  
    );
  
  };
  
  export default BroadcastFeed;