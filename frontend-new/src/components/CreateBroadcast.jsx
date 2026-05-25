import React, {
    useState
  } from 'react';
  
  import api from '../utils/api';
  
  import { useAuth } from '../context/AuthContext';
  
  import {
  
    X,
    Send,
    BriefcaseBusiness
  
  } from 'lucide-react';
  
  const CreateBroadcast = ({
    onClose,
    onCreated
  }) => {
  
    const { user } = useAuth();
  
    const [formData, setFormData] =
      useState({
  
        title: '',
        description: '',
        type: 'Internship',
        link: ''
  
      });
  
    const [loading, setLoading] =
      useState(false);
  
    const handleSubmit = async (e) => {
  
      e.preventDefault();
  
      setLoading(true);
  
      try {
  
        await api.post('/broadcasts', {
  
          user_id:
            user.user_id,
  
          ...formData
  
        });
  
        onCreated();
  
        onClose();
  
      } catch (err) {
  
        console.error(err);
  
        alert(
          'Failed to create broadcast'
        );
  
      } finally {
  
        setLoading(false);
  
      }
  
    };
  
    return (
  
      <div className="modal-overlay">
  
        <div className="modal-card">
  
          {/* HEADER */}
  
          <div className="modal-header">
  
            <div>
  
              <h2>
                Create Opportunity
              </h2>
  
              <p>
                Share internships, jobs,
                referrals, or events.
              </p>
  
            </div>
  
            <button
              className="close-btn"
              onClick={onClose}
            >
  
              <X size={18} />
  
            </button>
  
          </div>
  
          {/* FORM */}
  
          <form
            onSubmit={handleSubmit}
            className="broadcast-form"
          >
  
            <input
              type="text"
              placeholder="Opportunity title"
              value={formData.title}
              onChange={(e) =>
                setFormData({
  
                  ...formData,
  
                  title: e.target.value
  
                })
              }
              required
            />
  
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
  
                  ...formData,
  
                  type: e.target.value
  
                })
              }
            >
  
              <option>
                Internship
              </option>
  
              <option>
                Job
              </option>
  
              <option>
                Referral
              </option>
  
              <option>
                Event
              </option>
  
            </select>
  
            <textarea
              placeholder="Describe the opportunity..."
              value={formData.description}
              onChange={(e) =>
                setFormData({
  
                  ...formData,
  
                  description:
                    e.target.value
  
                })
              }
              required
            />
  
            <input
              type="text"
              placeholder="Application link"
              value={formData.link}
              onChange={(e) =>
                setFormData({
  
                  ...formData,
  
                  link: e.target.value
  
                })
              }
            />
  
            <button
              type="submit"
              disabled={loading}
            >
  
              <Send size={18} />
  
              {
                loading
                ? 'Posting...'
                : 'Post Opportunity'
              }
  
            </button>
  
          </form>
  
        </div>
  
        {/* CSS */}
  
        <style>{`
  
          .modal-overlay{
            position:fixed;
            inset:0;
            background:
            rgba(0,0,0,0.75);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:999;
          }
  
          .modal-card{
            width:90%;
            max-width:600px;
            background:#0f172a;
            border:
            1px solid rgba(255,255,255,0.08);
            border-radius:28px;
            padding:2rem;
          }
  
          .modal-header{
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            margin-bottom:2rem;
          }
  
          .modal-header p{
            color:#94a3b8;
            margin-top:0.5rem;
          }
  
          .close-btn{
            width:42px;
            height:42px;
            border:none;
            border-radius:12px;
            background:
            rgba(255,255,255,0.05);
            color:white;
            cursor:pointer;
          }
  
          .broadcast-form{
            display:flex;
            flex-direction:column;
            gap:1.2rem;
          }
  
          .broadcast-form input,
          .broadcast-form textarea,
          .broadcast-form select{
            background:
            rgba(255,255,255,0.05);
            border:
            1px solid rgba(255,255,255,0.08);
            padding:1rem;
            border-radius:16px;
            color:white;
            outline:none;
          }
  
          .broadcast-form textarea{
            min-height:140px;
            resize:vertical;
          }
  
          .broadcast-form button{
            border:none;
            background:
            linear-gradient(
            135deg,
            #2563eb,
            #3b82f6
            );
            color:white;
            padding:1rem;
            border-radius:16px;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:0.7rem;
            cursor:pointer;
            font-weight:600;
          }
  
        `}</style>
  
      </div>
  
    );
  
  };
  
  export default CreateBroadcast;