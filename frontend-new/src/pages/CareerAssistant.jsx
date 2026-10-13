import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Send,
  Sparkles,
  Trash2,
  GraduationCap,
  Briefcase,
  Target,
  FileCheck,
  Compass,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  User,
  Bot,
  Copy,
  Check,
  ChevronRight,
  HelpCircle,
  Users
} from 'lucide-react';

const CareerAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState('');
  const [clearing, setClearing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const userId = user?.user_id || user?.id || user?._id;

  useEffect(() => {
    if (userId) {
      fetchChatHistory();
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      const res = await api.get(`/career-assistant/history/${userId}`);
      setMessages(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setError(null);
    setLastQuery(text);

    if (!textToSend) {
      setInput('');
    }

    // Add user message locally
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post('/career-assistant/chat', {
        userId,
        message: text
      });

      const assistantMsg = {
        role: 'assistant',
        content: res.data.message,
        timestamp: res.data.timestamp || new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to get career guidance response:', err);
      setError('Connection interrupted. Please try again or re-send your question.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastQuery) {
      handleSendMessage(lastQuery);
    }
  };

  const handleClearChat = async () => {
    if (clearing || messages.length === 0) return;
    if (!window.confirm('Are you sure you want to clear your conversation history?')) return;
    setClearing(true);
    try {
      await api.delete(`/career-assistant/history/${userId}`);
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear chat history:', err);
      alert('Could not clear history. Please try again.');
    } finally {
      setClearing(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderInlineStyle = (content) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = content.split(boldRegex);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} style={{ fontWeight: 700, color: '#0f172a' }}>{part}</strong>;
      }
      return part;
    });
  };

  const parseMarkdown = (text) => {
    if (!text) return '';
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={index} style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0.85rem 0 0.35rem' }}>
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={index} style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '1rem 0 0.4rem' }}>
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2 key={index} style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '1.2rem 0 0.5rem' }}>
            {line.replace('# ', '')}
          </h2>
        );
      }

      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <li key={index} style={{ marginLeft: '1.2rem', marginBottom: '0.25rem', color: 'var(--text-body)', lineHeight: 1.55 }}>
            {renderInlineStyle(line.substring(2))}
          </li>
        );
      }

      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <li key={index} style={{ marginLeft: '1.2rem', marginBottom: '0.25rem', color: 'var(--text-body)', lineHeight: 1.55, listStyleType: 'decimal' }}>
            {renderInlineStyle(numMatch[2])}
          </li>
        );
      }

      if (line.trim() === '') {
        return <div key={index} style={{ height: '6px' }} />;
      }

      return (
        <p key={index} style={{ marginBottom: '0.5rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
          {renderInlineStyle(line)}
        </p>
      );
    });
  };

  const suggestedPrompts = [
    {
      category: 'Skill Gaps',
      title: 'Analyze my Skill Gaps',
      prompt: 'Based on my student profile, what are the top 3 skill gaps I should address this semester to be competitive for internships?'
    },
    {
      category: 'Interview Prep',
      title: 'Simulate Mock Interview',
      prompt: 'Can you simulate a common behavioral or technical interview question for an entry-level software/data role and explain how to answer it?'
    },
    {
      category: 'Resume Guidance',
      title: 'Resume Bullet Optimizer',
      prompt: 'How should I structure bullet points on my resume to demonstrate impact using the STAR/XYZ format for tech recruiters?'
    },
    {
      category: 'Alumni Outreach',
      title: 'Draft Mentorship Outreach Note',
      prompt: 'Help me draft a concise, respectful message to introduce myself to an alumnus working at a company I admire.'
    }
  ];

  return (
    <div className="ac-container animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      {/* 1. HEADER */}
      <div className="ac-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
            <span className="ac-badge ac-badge-indigo">
              <Sparkles size={14} /> Groq Llama-3.3 70B Engine
            </span>
            <span className="ac-badge ac-badge-neutral">
              Context-Aware Mentorship
            </span>
          </div>
          <h1 className="ac-page-title">
            AI Career Assistant
          </h1>
          <p className="ac-page-subtitle">
            Get personalized guidance on career pathways, resume formulation, interview preparation, and mentorship outreach based on your academic profile.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleClearChat}
            disabled={messages.length === 0 || clearing}
            className="ac-btn ac-btn-outline ac-btn-sm"
          >
            <Trash2 size={15} /> {clearing ? 'Clearing...' : 'Clear History'}
          </button>
        </div>
      </div>

      {/* 2. CHAT LAYOUT: SIDEBAR SUGGESTIONS + CHAT WINDOW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        
        {/* LEFT COLUMN: SUGGESTED PROMPTS & CONTEXTUAL TOOLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="ac-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={18} color="var(--ai-indigo)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                Suggested Prompts
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Click any prompt to instantly query your personalized AI assistant:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {suggestedPrompts.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s.prompt)}
                  disabled={loading}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--ai-indigo)';
                    e.currentTarget.style.background = 'var(--ai-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = '#f8fafc';
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--ai-indigo)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {s.category}
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                    {s.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contextual Platform Shortcuts */}
          <div className="ac-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.65rem' }}>
              Next Steps on AlumniConnect
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <Link to="/mentors" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-body)', padding: '0.4rem 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Users size={16} color="var(--primary)" /> Connect with Alumni
                </span>
                <ChevronRight size={14} color="var(--text-muted)" />
              </Link>
              <Link to="/roadmap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-body)', padding: '0.4rem 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Compass size={16} color="var(--secondary)" /> View Skill Roadmap
                </span>
                <ChevronRight size={14} color="var(--text-muted)" />
              </Link>
              <Link to="/opportunities" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-body)', padding: '0.4rem 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Briefcase size={16} color="var(--warning)" /> Explore Matched Jobs
                </span>
                <ChevronRight size={14} color="var(--text-muted)" />
              </Link>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CHAT WINDOW */}
        <div className="ac-card" style={{
          display: 'flex',
          flexDirection: 'column',
          height: '680px',
          padding: 0,
          overflow: 'hidden'
        }}>
          {/* Chat Window Header */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>
                  Career Assistant
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }}></span>
                  Ready to assist • Profile Context Active
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {messages.length} messages
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.length === 0 ? (
              <div style={{
                margin: 'auto',
                maxWidth: '460px',
                textAlign: 'center',
                padding: '2rem 1rem'
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'var(--ai-light)', color: 'var(--ai-indigo)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <Sparkles size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                  How can I help your career today, {user?.name || 'Student'}?
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Ask questions about career tracks, interview strategies, resume improvements, or select one of the suggested prompts on the left.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    onClick={() => handleSendMessage('What roles best match my background?')}
                    className="ac-btn ac-btn-outline ac-btn-sm"
                  >
                    What roles best match my background?
                  </button>
                  <button
                    onClick={() => handleSendMessage('How do I prepare for technical interviews?')}
                    className="ac-btn ac-btn-outline ac-btn-sm"
                  >
                    Technical Interview Prep
                  </button>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '100%'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    gap: '0.6rem',
                    alignItems: 'flex-start',
                    maxWidth: msg.role === 'user' ? '82%' : '88%'
                  }}>
                    {msg.role !== 'user' && (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'var(--ai-indigo)', color: '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '2px'
                      }}>
                        <Bot size={16} />
                      </div>
                    )}

                    <div style={{
                      background: msg.role === 'user' ? 'var(--primary)' : '#ffffff',
                      color: msg.role === 'user' ? '#ffffff' : 'var(--text-title)',
                      padding: '0.85rem 1.1rem',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                      boxShadow: 'var(--shadow-xs)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6
                    }}>
                      {msg.role === 'user' ? (
                        msg.content
                      ) : (
                        <div>
                          {parseMarkdown(msg.content)}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleCopy(msg.content, idx)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: copiedIndex === idx ? 'var(--success)' : 'var(--text-muted)',
                                fontSize: '0.72rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                cursor: 'pointer'
                              }}
                              title="Copy response"
                            >
                              {copiedIndex === idx ? <Check size={13} /> : <Copy size={13} />}
                              {copiedIndex === idx ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'var(--navy-800)', color: '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '2px'
                      }}>
                        <User size={16} />
                      </div>
                    )}
                  </div>

                  <span style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.25rem',
                    marginRight: msg.role === 'user' ? '2.2rem' : 0,
                    marginLeft: msg.role !== 'user' ? '2.4rem' : 0
                  }}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {loading && (
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--ai-indigo)', color: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Bot size={16} />
                </div>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  padding: '0.65rem 1rem',
                  borderRadius: '16px 16px 16px 4px',
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Sparkles size={15} color="var(--ai-indigo)" className="animate-pulse" />
                  Generating personalized guidance...
                </div>
              </div>
            )}

            {/* Error & Retry Banner */}
            {error && (
              <div style={{
                background: 'var(--danger-light)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
                <button
                  onClick={handleRetry}
                  className="ac-btn ac-btn-outline ac-btn-sm"
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                >
                  <RefreshCw size={13} /> Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              padding: '0.85rem 1.25rem',
              borderTop: '1px solid var(--border)',
              background: '#ffffff',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              placeholder="Ask about skill roadmaps, interview answers, resume phrasing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '0.65rem 1rem',
                fontSize: '0.875rem'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="ac-btn ac-btn-primary"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <Send size={16} /> Send
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default CareerAssistant;
