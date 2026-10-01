import React, { useState } from 'react';
import api from '../utils/api';
import { Video, Sparkles, Send, CheckCircle2, Award, ArrowRight } from 'lucide-react';

const MockInterview = () => {
  const [career, setCareer] = useState("Data Analyst");
  const [interviewType, setInterviewType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Medium");
  
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNum, setQuestionNum] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(3);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    try {
      setLoading(true);
      setFinalResult(null);
      setFeedback(null);
      const res = await api.post('/interview/start', {
        career,
        type: interviewType,
        difficulty
      });
      setSessionId(res.data.session_id);
      setCurrentQuestion(res.data.question);
      setQuestionNum(res.data.question_number);
      setTotalQuestions(res.data.total_questions);
    } catch (err) {
      console.error("Error starting mock interview:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!studentAnswer.trim() || !sessionId) return;
    try {
      setLoading(true);
      const res = await api.post('/interview/answer', {
        session_id: sessionId,
        answer: studentAnswer
      });

      setFeedback(res.data.feedback);
      setStudentAnswer("");

      if (res.data.is_completed) {
        setFinalResult(res.data.final_result);
        setCurrentQuestion(null);
      } else {
        setCurrentQuestion(res.data.next_question);
        setQuestionNum(res.data.question_number);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#c2410c', fontWeight: 600, fontSize: '0.9rem' }}>
          <Video size={16} /> AI MOCK INTERVIEW ROOM
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          AI Technical & Behavioral Mock Interview
        </h1>
        <p style={{ color: '#64748b' }}>
          Practice role-specific interview questions one-by-one and receive real-time feedback and an Interview Readiness Score.
        </p>
      </div>

      {!sessionId || finalResult ? (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.2rem' }}>
            Setup Mock Interview Session
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Target Career</label>
            <select value={career} onChange={(e) => setCareer(e.target.value)} style={{ width: '100%' }}>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Machine Learning Engineer">Machine Learning Engineer</option>
              <option value="Full Stack Engineer">Full Stack Engineer</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Round Type</label>
              <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)} style={{ width: '100%' }}>
                <option value="Technical">Technical Round</option>
                <option value="Behavioral">Behavioral (STAR Method)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: '100%' }}>
                <option value="Beginner">Beginner</option>
                <option value="Medium">Medium</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <button onClick={startSession} className="btn btn-primary" style={{ width: '100%', background: '#c2410c' }} disabled={loading}>
            <Video size={16} /> {loading ? 'Initializing Interview...' : 'Start AI Mock Interview'}
          </button>

          {/* FINAL RESULTS DISPLAY */}
          {finalResult && (
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>INTERVIEW COMPLETED</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', margin: '0.4rem 0' }}>
                {finalResult.readiness_score} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 100</span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem' }}>{finalResult.strengths}</p>
              <div style={{ fontSize: '0.85rem', background: '#f8fafc', padding: '0.8rem', borderRadius: '8px', color: '#334155' }}>
                👉 Recommended Action: <strong>{finalResult.recommended_next_step}</strong>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* INTERVIEW IN PROGRESS ROOM */
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
            <span className="badge badge-primary">Question {questionNum} of {totalQuestions}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c2410c' }}>{career} ({interviewType})</span>
          </div>

          <div style={{ background: '#fff7ed', padding: '1.2rem', borderRadius: '12px', border: '1px solid #ffedd5', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c2410c', marginBottom: '0.3rem' }}>AI INTERVIEWER QUESTION</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{currentQuestion}</h3>
          </div>

          {feedback && (
            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '10px', border: '1px solid #bbf7d0', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#166534' }}>
              <strong>AI Real-Time Feedback:</strong> {feedback}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Your Response</label>
            <textarea
              rows={6}
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              style={{ width: '100%', fontSize: '0.95rem' }}
              placeholder="Type your structured answer here (explain core concepts, syntax, or STAR framework actions)..."
            />
          </div>

          <button onClick={submitAnswer} className="btn btn-primary" style={{ width: '100%', background: '#c2410c' }} disabled={loading}>
            <Send size={16} /> {loading ? 'Evaluating Response...' : 'Submit Answer & Proceed'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
