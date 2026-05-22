import React, {
  useState,
  useEffect
} from 'react';

import api from '../utils/api';

import { useAuth } from '../context/AuthContext';

import {

  User,
  Briefcase,
  Code,
  Target,
  Save,
  CheckCircle,
  Linkedin,
  Github,
  Globe,
  Trophy,
  Sparkles,
  GraduationCap,
  ShieldCheck

} from 'lucide-react';

const Profile = () => {

  const { user } = useAuth();

  const [formData, setFormData] = useState({

    skills: '',
    experience: '',
    company: '',
    career_goal: '',
    interests: '',
    bio: '',
    education: '',
    domain: '',
    linkedin: '',
    github: '',
    portfolio: '',
    achievements: '',
    availability: 'Available for mentorship'

  });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [completion, setCompletion] =
    useState(0);

  // =========================================
  // FETCH PROFILE
  // =========================================

  useEffect(() => {

    if (user) {
      fetchProfile();
    }

  }, [user]);

  const fetchProfile = async () => {

    try {

      const id =
        user.user_id ||
        user.id ||
        user._id;

      const res = await api.get(
        `/profile/${id}`
      );

      if (
        res.data &&
        !res.data.error
      ) {

        setFormData({

          skills:
            res.data.skills || '',

          experience:
            res.data.experience || '',

          company:
            res.data.company || '',

          career_goal:
            res.data.career_goal || '',

          interests:
            res.data.interests || '',

          bio:
            res.data.bio || '',

          education:
            res.data.education || '',

          domain:
            res.data.domain || '',

          linkedin:
            res.data.linkedin || '',

          github:
            res.data.github || '',

          portfolio:
            res.data.portfolio || '',

          achievements:
            res.data.achievements || '',

          availability:
            res.data.availability ||
            'Available for mentorship'

        });

        setCompletion(
          res.data.completion_score || 0
        );

      }

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSaving(true);

    try {

      const id =
        user.user_id ||
        user.id ||
        user._id;

      await api.put(
        `/profile/${id}`,
        formData
      );

      setMessage(
        'Profile updated successfully!'
      );

      fetchProfile();

      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (err) {

      console.error(err);

      alert(
        'Failed to update profile'
      );

    } finally {

      setSaving(false);

    }

  };

  if (loading) {

    return (

      <div className="loader">
        Loading Profile...
      </div>

    );

  }

  return (

    <div className="profile-page">

      {/* HERO */}

      <div className="profile-hero">

        <div className="profile-left">

          <div className="avatar">

            {user.name?.[0]?.toUpperCase()}

          </div>

          <div>

            <h1>{user.name}</h1>

            <p>
              {formData.domain || 'Professional Member'}
            </p>

            <div className="availability">

              <ShieldCheck size={16} />

              {formData.availability}

            </div>

          </div>

        </div>

        {/* PROFILE COMPLETION */}

        <div className="completion-box">

          <h3>
            Profile Strength
          </h3>

          <div className="progress-circle">

            <span>
              {completion}%
            </span>

          </div>

        </div>

      </div>

      {/* MESSAGE */}

      {message && (

        <div className="success-box">

          <CheckCircle size={18} />

          {message}

        </div>

      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="profile-form"
      >

        {/* GRID */}

        <div className="grid">

          <InputField
            icon={<Code size={16} />}
            label="Skills"
            value={formData.skills}
            placeholder="React, Python, ML..."
            onChange={(v) =>
              setFormData({
                ...formData,
                skills: v
              })
            }
          />

          <InputField
            icon={<Briefcase size={16} />}
            label="Company"
            value={formData.company}
            placeholder="Current organization"
            onChange={(v) =>
              setFormData({
                ...formData,
                company: v
              })
            }
          />

          <InputField
            icon={<GraduationCap size={16} />}
            label="Education"
            value={formData.education}
            placeholder="Your education"
            onChange={(v) =>
              setFormData({
                ...formData,
                education: v
              })
            }
          />

          <InputField
            icon={<Sparkles size={16} />}
            label="Domain"
            value={formData.domain}
            placeholder="AI/ML, Cloud..."
            onChange={(v) =>
              setFormData({
                ...formData,
                domain: v
              })
            }
          />

          <InputField
            icon={<Target size={16} />}
            label="Career Goals"
            value={formData.career_goal}
            placeholder="Your goals"
            onChange={(v) =>
              setFormData({
                ...formData,
                career_goal: v
              })
            }
          />

          <InputField
            icon={<User size={16} />}
            label="Experience"
            value={formData.experience}
            placeholder="2 years..."
            onChange={(v) =>
              setFormData({
                ...formData,
                experience: v
              })
            }
          />

        </div>

        {/* BIO */}

        <TextAreaField
          label="Professional Bio"
          value={formData.bio}
          placeholder="Tell people about yourself..."
          onChange={(v) =>
            setFormData({
              ...formData,
              bio: v
            })
          }
        />

        {/* INTERESTS */}

        <TextAreaField
          label="Interests"
          value={formData.interests}
          placeholder="Your interests..."
          onChange={(v) =>
            setFormData({
              ...formData,
              interests: v
            })
          }
        />

        {/* ACHIEVEMENTS */}

        <TextAreaField
          label="Achievements"
          value={formData.achievements}
          placeholder="Hackathons, certifications..."
          onChange={(v) =>
            setFormData({
              ...formData,
              achievements: v
            })
          }
        />

        {/* SOCIAL LINKS */}

        <div className="grid">

          <InputField
            icon={<Linkedin size={16} />}
            label="LinkedIn"
            value={formData.linkedin}
            placeholder="LinkedIn profile URL"
            onChange={(v) =>
              setFormData({
                ...formData,
                linkedin: v
              })
            }
          />

          <InputField
            icon={<Github size={16} />}
            label="GitHub"
            value={formData.github}
            placeholder="GitHub URL"
            onChange={(v) =>
              setFormData({
                ...formData,
                github: v
              })
            }
          />

          <InputField
            icon={<Globe size={16} />}
            label="Portfolio"
            value={formData.portfolio}
            placeholder="Portfolio URL"
            onChange={(v) =>
              setFormData({
                ...formData,
                portfolio: v
              })
            }
          />

        </div>

        {/* BUTTON */}

        <button
          type="submit"
          className="save-btn"
          disabled={saving}
        >

          {saving
            ? 'Saving...'
            : <>
                <Save size={18} />
                Save Profile
              </>
          }

        </button>

      </form>

      {/* CSS */}

      <style>{`

        body{
          background:#081120;
          color:white;
          font-family:Inter,sans-serif;
        }

        .profile-page{
          padding:3rem 8%;
          min-height:100vh;
        }

        .profile-hero{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:2rem;
          margin-bottom:2rem;
          flex-wrap:wrap;
        }

        .profile-left{
          display:flex;
          align-items:center;
          gap:2rem;
        }

        .avatar{
          width:100px;
          height:100px;
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
          font-size:2rem;
          font-weight:800;
        }

        .availability{
          margin-top:0.7rem;
          display:inline-flex;
          align-items:center;
          gap:0.5rem;
          background:
          rgba(16,185,129,0.12);
          color:#10b981;
          padding:0.6rem 1rem;
          border-radius:999px;
        }

        .completion-box{
          background:
          rgba(255,255,255,0.04);
          border:
          1px solid rgba(255,255,255,0.08);
          padding:2rem;
          border-radius:24px;
          text-align:center;
          min-width:220px;
        }

        .progress-circle{
          width:120px;
          height:120px;
          border-radius:50%;
          border:10px solid #2563eb;
          display:flex;
          align-items:center;
          justify-content:center;
          margin:1rem auto 0;
          font-size:1.5rem;
          font-weight:700;
        }

        .success-box{
          display:flex;
          align-items:center;
          gap:0.7rem;
          background:
          rgba(16,185,129,0.1);
          color:#10b981;
          padding:1rem;
          border-radius:14px;
          margin-bottom:2rem;
        }

        .profile-form{
          display:flex;
          flex-direction:column;
          gap:2rem;
        }

        .grid{
          display:grid;
          grid-template-columns:
          repeat(auto-fit,minmax(300px,1fr));
          gap:1.5rem;
        }

        .field{
          display:flex;
          flex-direction:column;
          gap:0.7rem;
        }

        .field label{
          display:flex;
          align-items:center;
          gap:0.5rem;
          color:#94a3b8;
        }

        .field input,
        .field textarea{
          background:
          rgba(255,255,255,0.04);
          border:
          1px solid rgba(255,255,255,0.08);
          padding:1rem;
          border-radius:16px;
          color:white;
          outline:none;
        }

        .field textarea{
          min-height:120px;
          resize:vertical;
        }

        .save-btn{
          border:none;
          background:
          linear-gradient(
          135deg,
          #2563eb,
          #3b82f6
          );
          color:white;
          padding:1rem 2rem;
          border-radius:16px;
          font-weight:600;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:0.8rem;
          cursor:pointer;
        }

        .loader{
          height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
        }

        @media(max-width:768px){

          .profile-page{
            padding:2rem 5%;
          }

          .profile-hero{
            flex-direction:column;
            align-items:flex-start;
          }

        }

      `}</style>

    </div>

  );

};

// =========================================
// REUSABLE INPUT
// =========================================

const InputField = ({
  icon,
  label,
  value,
  onChange,
  placeholder
}) => (

  <div className="field">

    <label>
      {icon}
      {label}
    </label>

    <input
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder={placeholder}
    />

  </div>

);

// =========================================
// REUSABLE TEXTAREA
// =========================================

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder
}) => (

  <div className="field">

    <label>
      {label}
    </label>

    <textarea
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder={placeholder}
    />

  </div>

);

export default Profile;