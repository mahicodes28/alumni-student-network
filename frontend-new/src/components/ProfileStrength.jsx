import React from 'react';

import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Trophy
} from 'lucide-react';

import {
  Link
} from 'react-router-dom';

const ProfileStrength = ({
  profile,
  userName
}) => {

  // =====================================
  // CALCULATE STRENGTH
  // =====================================

  const calculateStrength = () => {

    let strength = 0;

    if (
      userName &&
      userName.trim().length > 0
    ) {
      strength += 10;
    }

    if (
      profile?.skills &&
      profile.skills.trim().length > 0
    ) {
      strength += 20;
    }

    if (
      profile?.bio &&
      profile.bio.trim().length > 0
    ) {
      strength += 15;
    }

    if (
      profile?.experience &&
      profile.experience.trim().length > 0
    ) {
      strength += 15;
    }

    if (
      profile?.education &&
      profile.education.trim().length > 0
    ) {
      strength += 10;
    }

    if (
      profile?.linkedin &&
      profile.linkedin.trim().length > 0
    ) {
      strength += 10;
    }

    if (
      profile?.github &&
      profile.github.trim().length > 0
    ) {
      strength += 10;
    }

    if (
      profile?.portfolio &&
      profile.portfolio.trim().length > 0
    ) {
      strength += 10;
    }

    return strength;

  };

  const strength =
    calculateStrength();

  // =====================================
  // COLORS
  // =====================================

  const getStrengthColor = () => {

    if (strength <= 30)
      return '#ef4444';

    if (strength <= 70)
      return '#f59e0b';

    return '#10b981';

  };

  // =====================================
  // STATUS
  // =====================================

  const getStatusText = () => {

    if (strength <= 30)
      return 'Basic Profile';

    if (strength <= 70)
      return 'Growing Professional';

    return 'Top Networking Profile';

  };

  return (

    <div className="strength-card">

      {/* TOP */}

      <div className="top-section">

        <div className="title-box">

          <div
            className="icon-box"
            style={{
              background:
              `${getStrengthColor()}20`
            }}
          >

            {
              strength >= 80
              ? <Trophy
                  size={22}
                  color={getStrengthColor()}
                />
              : <ShieldCheck
                  size={22}
                  color={getStrengthColor()}
                />
            }

          </div>

          <div>

            <h3>
              Profile Strength
            </h3>

            <p>
              {getStatusText()}
            </p>

          </div>

        </div>

        {/* PERCENT */}

        <div
          className="percent-box"
          style={{
            borderColor:
            `${getStrengthColor()}40`
          }}
        >

          <span
            style={{
              color:
              getStrengthColor()
            }}
          >

            {strength}%

          </span>

        </div>

      </div>

      {/* PROGRESS */}

      <div className="progress-wrapper">

        <div className="progress-bg">

          <div
            className="progress-fill"
            style={{

              width:
              `${strength}%`,

              background:
              getStrengthColor(),

              boxShadow:
              `0 0 18px ${getStrengthColor()}55`

            }}
          />

        </div>

      </div>

      {/* MESSAGE */}

      <div className="bottom-row">

        <div className="tip-box">

          <Sparkles size={16} />

          <span>

            {

              strength < 50

              ? 'Complete your profile to unlock better mentor recommendations.'

              : strength < 80

              ? 'Great progress! Add social links and achievements.'

              : 'Excellent profile visibility across the alumni network.'

            }

          </span>

        </div>

        {/* CTA */}

        {strength < 100 && (

          <Link
            to="/profile"
            className="complete-btn"
          >

            Complete

            <ArrowRight size={15} />

          </Link>

        )}

      </div>

      {/* CSS */}

      <style>{`

        .strength-card{

          background:
          rgba(255,255,255,0.04);

          border:
          1px solid rgba(255,255,255,0.08);

          border-radius:24px;

          padding:1.6rem;

          backdrop-filter:blur(16px);

          margin-bottom:2rem;

        }

        /* TOP */

        .top-section{

          display:flex;

          justify-content:
          space-between;

          align-items:center;

          gap:1rem;

          margin-bottom:1.5rem;

          flex-wrap:wrap;

        }

        .title-box{

          display:flex;

          align-items:center;

          gap:1rem;

        }

        .icon-box{

          width:52px;

          height:52px;

          border-radius:16px;

          display:flex;

          align-items:center;

          justify-content:center;

        }

        .title-box h3{

          margin:0;

          color:white;

          font-size:1.1rem;

        }

        .title-box p{

          margin-top:0.3rem;

          color:#94a3b8;

          font-size:0.9rem;

        }

        /* PERCENT */

        .percent-box{

          width:72px;

          height:72px;

          border-radius:50%;

          border:3px solid;

          display:flex;

          align-items:center;

          justify-content:center;

          background:
          rgba(255,255,255,0.03);

          font-weight:700;

          font-size:1.1rem;

        }

        /* PROGRESS */

        .progress-wrapper{

          margin-bottom:1.4rem;

        }

        .progress-bg{

          width:100%;

          height:12px;

          border-radius:999px;

          overflow:hidden;

          background:
          rgba(255,255,255,0.05);

        }

        .progress-fill{

          height:100%;

          border-radius:999px;

          transition:
          width 0.7s ease;

        }

        /* BOTTOM */

        .bottom-row{

          display:flex;

          justify-content:
          space-between;

          align-items:center;

          gap:1rem;

          flex-wrap:wrap;

        }

        .tip-box{

          display:flex;

          align-items:flex-start;

          gap:0.6rem;

          color:#cbd5e1;

          line-height:1.7;

          font-size:0.9rem;

          max-width:700px;

        }

        /* BUTTON */

        .complete-btn{

          display:flex;

          align-items:center;

          gap:0.5rem;

          text-decoration:none;

          background:
          linear-gradient(
            135deg,
            #2563eb,
            #3b82f6
          );

          color:white;

          padding:
          0.8rem 1.2rem;

          border-radius:14px;

          font-weight:600;

          transition:0.25s;

        }

        .complete-btn:hover{

          transform:
          translateY(-2px);

        }

        /* MOBILE */

        @media(max-width:768px){

          .top-section{

            flex-direction:column;

            align-items:flex-start;

          }

          .bottom-row{

            flex-direction:column;

            align-items:flex-start;

          }

        }

      `}</style>

    </div>

  );

};

export default ProfileStrength;