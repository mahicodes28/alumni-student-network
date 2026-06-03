import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Send,
  Sparkles,
  Trash2,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  User,
  Bot
} from 'lucide-react';

const CareerAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
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

    if (!textToSend) {
      setInput('');
    }

    // Add user message locally for immediate UI update
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
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

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to get career guidance response:', err);
      const errMsg = {
        role: 'assistant',
        content: 'Sorry, I encountered an issue. Please try again or check your backend connection.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (clearing) return;
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

  const handleQuickSuggestion = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const renderInlineStyle = (content) => {
    // Basic Markdown formatting helper
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = content.split(boldRegex);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} style={{ color: 'white', fontWeight: '700' }}>{part}</strong>;
      }
      return part;
    });
  };

  const parseMarkdown = (text) => {
    if (!text) return '';
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={index} className="chat-header-3">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={index} className="chat-header-2">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2 key={index} className="chat-header-1">
            {line.replace('# ', '')}
          </h2>
        );
      }

      // Unordered list items
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <li key={index} className="chat-li">
            {renderInlineStyle(line.substring(2))}
          </li>
        );
      }

      // Ordered list items
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <li key={index} className="chat-li-ordered">
            {renderInlineStyle(numMatch[2])}
          </li>
        );
      }

      // Empty space
      if (line.trim() === '') {
        return <div key={index} style={{ height: '8px' }} />;
      }

      return (
        <p key={index} className="chat-paragraph">
          {renderInlineStyle(line)}
        </p>
      );
    });
  };

  const suggestions = [
    {
      title: 'Review my Skills',
      desc: 'Suggest what skills to focus on next based on my profile',
      prompt: 'Based on my listed profile skills, what are the top 3 high-demand technologies or skills I should learn next to reach my career goal?'
    },
    {
      title: 'Interview Strategy',
      desc: 'Get preparation guidelines for my target domain',
      prompt: 'Can you provide a structured 4-week preparation strategy and common technical/behavioral interview topics for roles in my field?'
    },
    {
      title: 'Resume Review',
      desc: 'Advice on enhancing my summary and project descriptions',
      prompt: 'Based on my current profile domain and bio, how should I structure my resume summary and key project bullet points to attract recruiters?'
    },
    {
      title: 'Mock Interview Prep',
      desc: 'Give me 3 behavioral questions to practice',
      prompt: 'I want to practice my behavioral interview skills. Please give me 3 questions tailored to my background and tell me what an ideal answer looks like.'
    }
  ];

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        {/* SIDEBAR FOR INFO & SUGGESTIONS */}
        <aside className="chatbot-sidebar">
          <div className="sidebar-header">
            <div className="ai-badge">
              <Sparkles size={16} />
              AI Powered Mentor
            </div>
            <h2>Career Assistant</h2>
            <p>Your interactive AI guide for career strategies, resumes, mock interviews, and skill building.</p>
          </div>

          <div className="sidebar-body">
            <h3>Quick Prompts</h3>
            <div className="suggestions-list">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  className="suggestion-item"
                  onClick={() => handleQuickSuggestion(s.prompt)}
                  disabled={loading}
                >
                  <div className="sug-header">
                    <h4>{s.title}</h4>
                    <ArrowRight size={14} />
                  </div>
                  <p>{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-footer">
            <button
              onClick={handleClearChat}
              className="clear-btn"
              disabled={messages.length === 0 || clearing}
            >
              <Trash2 size={16} />
              {clearing ? 'Clearing...' : 'Reset Conversation'}
            </button>
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <main className="chat-window">
          <header className="chat-header">
            <div className="chat-avatar-ai">
              <Bot size={22} />
            </div>
            <div>
              <h3>AI Career Assistant</h3>
              <p className="status-indicator">
                <span className="dot"></span> Online • Groq Llama 3.3
              </p>
            </div>
          </header>

          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="welcome-state">
                <Sparkles size={48} className="sparkle-icon" />
                <h2>Tailored Guidance for **{user?.name}**</h2>
                <p>
                  Welcome! Ask me anything about internships, resume reviews, placement interviews,
                  skill-building paths, or networking templates. I have read your profile to personalize my responses.
                </p>
                <div className="mobile-suggestions">
                  {suggestions.slice(0, 2).map((s, idx) => (
                    <button
                      key={idx}
                      className="mob-sug-item"
                      onClick={() => handleQuickSuggestion(s.prompt)}
                      disabled={loading}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`message-wrapper ${msg.role === 'user' ? 'msg-user' : 'msg-ai'}`}
                  >
                    <div className="msg-avatar">
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className="msg-bubble">
                      <div className="msg-content">
                        {msg.role === 'user' ? msg.content : parseMarkdown(msg.content)}
                      </div>
                      <span className="msg-time">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message-wrapper msg-ai">
                    <div className="msg-avatar">
                      <Bot size={16} />
                    </div>
                    <div className="msg-bubble loading-bubble">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <footer className="chat-input-bar">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="input-form"
            >
              <input
                type="text"
                placeholder={`Ask about resume, interviews, or career paths...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="send-btn"
              >
                <Send size={18} />
              </button>
            </form>
          </footer>
        </main>
      </div>

      <style>{`
        .chatbot-page {
          height: calc(100vh - 70px);
          padding: 1.5rem 8%;
          background: #081120;
          color: white;
          font-family: Inter, sans-serif;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-container {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: 320px 1fr;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: rgba(0, 0, 0, 0.3) 0px 20px 40px;
        }

        /* SIDEBAR */
        .chatbot-sidebar {
          background: rgba(255, 255, 255, 0.02);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          justify-content: space-between;
          overflow-y: auto;
        }

        .sidebar-header h2 {
          font-size: 1.8rem;
          margin: 0.8rem 0 0.5rem 0;
          font-weight: 700;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-header p {
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.25);
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          color: #60a5fa;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .sidebar-body {
          margin-top: 2rem;
          flex: 1;
        }

        .sidebar-body h3 {
          font-size: 1rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .suggestion-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 1rem;
          text-align: left;
          cursor: pointer;
          color: white;
          transition: all 0.2s;
        }

        .suggestion-item:hover:not(:disabled) {
          background: rgba(59, 130, 246, 0.08);
          border-color: rgba(59, 130, 246, 0.3);
          transform: translateY(-2px);
        }

        .suggestion-item:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .sug-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.3rem;
        }

        .sug-header h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #e2e8f0;
        }

        .suggestion-item p {
          margin: 0;
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.4;
        }

        .clear-btn {
          width: 100%;
          padding: 0.9rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          color: #f87171;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
        }

        .clear-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* CHAT WINDOW */
        .chat-window {
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.01);
          height: 100%;
          overflow: hidden;
        }

        .chat-header {
          padding: 1.2rem 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(8, 17, 32, 0.4);
        }

        .chat-avatar-ai {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }

        .chat-header h3 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 600;
        }

        .status-indicator {
          margin: 0.2rem 0 0 0;
          font-size: 0.8rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .status-indicator .dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #10b981;
        }

        /* MESSAGES AREA */
        .messages-area {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background: radial-gradient(circle at top right, rgba(37, 99, 235, 0.03), transparent 400px);
        }

        .welcome-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .sparkle-icon {
          color: #60a5fa;
          margin-bottom: 1.5rem;
          animation: pulse 2s infinite alternate;
        }

        .welcome-state h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .welcome-state p {
          color: #94a3b8;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        .mobile-suggestions {
          display: none;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        /* MESSAGES */
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .message-wrapper {
          display: flex;
          gap: 1rem;
          max-width: 85%;
        }

        .msg-user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .msg-ai {
          align-self: flex-start;
        }

        .msg-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .msg-user .msg-avatar {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .msg-ai .msg-avatar {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .msg-bubble {
          padding: 1rem 1.25rem;
          border-radius: 18px;
          position: relative;
          color: #e2e8f0;
          line-height: 1.5;
        }

        .msg-user .msg-bubble {
          background: #2563eb;
          color: white;
          border-top-right-radius: 4px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .msg-ai .msg-bubble {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-top-left-radius: 4px;
        }

        .msg-content {
          font-size: 0.95rem;
          word-break: break-word;
        }

        .msg-time {
          font-size: 0.7rem;
          color: #64748b;
          display: block;
          text-align: right;
          margin-top: 0.4rem;
        }

        /* MARKDOWN RENDER STYLES */
        .chat-paragraph {
          margin: 0.5rem 0;
          line-height: 1.6;
        }

        .chat-header-1 {
          font-size: 1.4rem;
          margin: 1.2rem 0 0.6rem 0;
          color: #818cf8;
          font-weight: 700;
        }

        .chat-header-2 {
          font-size: 1.2rem;
          margin: 1rem 0 0.5rem 0;
          color: #60a5fa;
          font-weight: 600;
        }

        .chat-header-3 {
          font-size: 1.05rem;
          margin: 0.8rem 0 0.4rem 0;
          color: #cbd5e1;
          font-weight: 600;
        }

        .chat-li {
          list-style-type: disc;
          margin: 0.4rem 0 0.4rem 1.5rem;
        }

        .chat-li-ordered {
          list-style-type: decimal;
          margin: 0.4rem 0 0.4rem 1.5rem;
        }

        /* TYPING INDICATOR */
        .loading-bubble {
          padding: 0.9rem 1.2rem;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          height: 16px;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: #60a5fa;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.3s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.3s;
        }

        /* INPUT BAR */
        .chat-input-bar {
          padding: 1.2rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(8, 17, 32, 0.3);
        }

        .input-form {
          display: flex;
          gap: 0.8rem;
          position: relative;
        }

        .input-form input {
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1rem 1.5rem;
          border-radius: 16px;
          color: white;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
        }

        .input-form input:focus {
          border-color: rgba(59, 130, 246, 0.4);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.15);
        }

        .send-btn {
          background: #2563eb;
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          background: #3b82f6;
          transform: scale(1.05);
        }

        .send-btn:disabled {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #475569;
          cursor: not-allowed;
        }

        /* ANIMATIONS */
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        /* RESPONSIVE LAYOUT */
        @media (max-width: 1024px) {
          .chatbot-page {
            padding: 1rem;
            height: calc(100vh - 60px);
          }
          
          .chatbot-container {
            grid-template-columns: 1fr;
          }

          .chatbot-sidebar {
            display: none;
          }

          .mobile-suggestions {
            display: flex;
          }

          .mob-sug-item {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            color: #cbd5e1;
            padding: 0.5rem 0.8rem;
            font-size: 0.8rem;
            cursor: pointer;
          }
        }
      `}</style>
    </div>
  );
};

export default CareerAssistant;
