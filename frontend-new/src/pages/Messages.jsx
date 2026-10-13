import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Send,
  MessageCircle,
  Search,
  User,
  ChevronLeft,
  Clock,
  CheckCheck,
  Building2,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Messages = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const chatEndRef = useRef(null);

  const userId = user?.user_id || user?.id || user?._id;

  // FETCH CONTACTS
  useEffect(() => {
    if (!userId) return;
    const fetchContacts = async () => {
      try {
        const res = await api.get(`/contacts/${userId}`);
        const data = res.data.data || [];
        setContacts(data);
        if (data.length > 0 && !selectedContact && window.innerWidth > 768) {
          setSelectedContact(data[0]);
        }
      } catch (err) {
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [userId]);

  // FETCH MESSAGES
  useEffect(() => {
    if (!selectedContact || !userId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${selectedContact.id}?user_id=${userId}`);
        setMessages(res.data.data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedContact, userId]);

  // AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const text = newMessage;
    const tempMsg = {
      sender_id: userId,
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage('');

    try {
      await api.post('/messages', {
        sender_id: userId,
        receiver_id: selectedContact.id,
        content: text
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const filteredContacts = contacts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ac-container animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      {/* HEADER */}
      <div className="ac-page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="ac-page-title">
            Messages & Mentorship Discussions
          </h1>
          <p className="ac-page-subtitle">
            Direct, private conversations between accepted students and alumni mentors.
          </p>
        </div>
      </div>

      {/* CHAT CONTAINER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedContact && window.innerWidth <= 768 ? '1fr' : '320px 1fr',
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        height: '660px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        
        {/* CONTACTS SIDEBAR */}
        <aside style={{
          display: selectedContact && window.innerWidth <= 768 ? 'none' : 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          background: '#f8fafc'
        }}>
          {/* Search bar */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: '#ffffff' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#f8fafc',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem'
            }}>
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', padding: 0, fontSize: '0.85rem', width: '100%', background: 'transparent' }}
              />
            </div>
          </div>

          {/* Contacts List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Loading conversations...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <p style={{ marginBottom: '0.75rem' }}>No conversations yet.</p>
                <p style={{ fontSize: '0.8rem' }}>
                  {user?.role === 'student'
                    ? 'Once an alumni accepts your mentorship request, they will appear here.'
                    : 'Accepted student mentees will appear here.'}
                </p>
                {user?.role === 'student' && (
                  <Link to="/mentors" className="ac-btn ac-btn-primary ac-btn-sm" style={{ marginTop: '1rem' }}>
                    Find Mentors
                  </Link>
                )}
              </div>
            ) : (
              filteredContacts.map((c) => {
                const isSelected = selectedContact?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedContact(c)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--primary-light)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--primary)' : '3px solid transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div className="ac-avatar ac-avatar-md">
                      {c.name?.slice(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '0.15rem'
                      }}>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {c.name}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {c.company || (c.role === 'alumni' ? 'Alumni Mentor' : 'Student')}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* CHAT WINDOW */}
        <main style={{
          display: !selectedContact && window.innerWidth <= 768 ? 'none' : 'flex',
          flexDirection: 'column',
          background: '#ffffff'
        }}>
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '0.85rem 1.25rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {window.innerWidth <= 768 && (
                    <button
                      onClick={() => setSelectedContact(null)}
                      style={{ padding: '0.25rem', marginRight: '0.25rem' }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <div className="ac-avatar ac-avatar-md">
                    {selectedContact.name?.slice(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                      {selectedContact.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {selectedContact.company || (selectedContact.role === 'alumni' ? 'Alumni Mentor' : 'Student')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.25rem',
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                {messages.length === 0 ? (
                  <div style={{
                    margin: 'auto',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem'
                  }}>
                    <MessageCircle size={32} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                    <p>Start a conversation with {selectedContact.name}.</p>
                    <span style={{ fontSize: '0.75rem' }}>
                      Ask for resume feedback, interview tips, or schedule a quick guidance call.
                    </span>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.sender_id === userId;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '100%'
                        }}
                      >
                        <div style={{
                          background: isMe ? 'var(--primary)' : '#ffffff',
                          color: isMe ? '#ffffff' : 'var(--text-title)',
                          padding: '0.65rem 1rem',
                          borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          border: isMe ? 'none' : '1px solid var(--border)',
                          boxShadow: 'var(--shadow-xs)',
                          fontSize: '0.875rem',
                          maxWidth: '75%',
                          lineHeight: 1.5,
                          wordBreak: 'break-word'
                        }}>
                          {m.content}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Bar */}
              <form
                onSubmit={sendMessage}
                style={{
                  padding: '0.85rem 1.25rem',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center'
                }}
              >
                <input
                  type="text"
                  placeholder={`Message ${selectedContact.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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
                  disabled={!newMessage.trim()}
                  className="ac-btn ac-btn-primary"
                  style={{ padding: '0.65rem 1.15rem' }}
                >
                  <Send size={15} /> Send
                </button>
              </form>
            </>
          ) : (
            <div style={{
              margin: 'auto',
              textAlign: 'center',
              color: 'var(--text-muted)',
              padding: '2rem'
            }}>
              <MessageCircle size={40} color="var(--primary)" style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                Select a Conversation
              </h3>
              <p style={{ fontSize: '0.85rem' }}>
                Choose an alumni mentor or student from the sidebar to view message history.
              </p>
            </div>
          )}
        </main>

      </div>

    </div>
  );
};

export default Messages;