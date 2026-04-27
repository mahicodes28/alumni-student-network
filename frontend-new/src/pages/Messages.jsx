import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Send, User, MessageCircle, Clock, ChevronLeft } from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  // Fetch contacts (connected users)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get(`/contacts/${user.user_id}`);
        setContacts(res.data.data || []);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [user.user_id]);

  // Fetch conversation when contact is selected
  useEffect(() => {
    if (!selectedContact) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${selectedContact.id}?user_id=${user.user_id}`);
        setMessages(res.data.data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Polling for real-time feel
    return () => clearInterval(interval);
  }, [selectedContact, user.user_id]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    try {
      await api.post('/messages', {
        sender_id: user.user_id,
        receiver_id: selectedContact.id,
        content: newMessage
      });
      setNewMessage('');
      // Optimistic update
      setMessages([...messages, {
        sender_id: user.user_id,
        content: newMessage,
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
      
      {/* SIDEBAR - CONTACTS */}
      <div className="glass" style={{ 
        width: '320px', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '1.5rem',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageCircle size={20} color="var(--primary)" />
            Messages
          </h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Loading contacts...</p>
          ) : contacts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>No connections yet.</p>
              <p style={{ fontSize: '0.8rem' }}>Accepted mentorship requests will appear here.</p>
            </div>
          ) : (
            contacts.map(contact => (
              <div 
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s',
                  background: selectedContact?.id === contact.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  border: selectedContact?.id === contact.id ? '1px solid var(--primary)' : '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (selectedContact?.id !== contact.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (selectedContact?.id !== contact.id) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {contact.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '600' }}>{contact.name}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {contact.role}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="glass" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '1.5rem',
        overflow: 'hidden'
      }}>
        {selectedContact ? (
          <>
            {/* CHAT HEADER */}
            <div style={{ 
              padding: '1rem 1.5rem', 
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}>
                {selectedContact.name[0]}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedContact.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div>
                  Online
                </span>
              </div>
            </div>

            {/* MESSAGES LIST */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {messages.map((msg, index) => {
                const isMine = msg.sender_id === user.user_id;
                return (
                  <div 
                    key={index}
                    style={{
                      alignSelf: isMine ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      padding: '0.8rem 1.2rem',
                      borderRadius: isMine ? '1.25rem 1.25rem 0 1.25rem' : '1.25rem 1.25rem 1.25rem 0',
                      background: isMine ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      position: 'relative',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                  >
                    <p style={{ margin: 0, lineHeight: '1.5' }}>{msg.content}</p>
                    <span style={{ 
                      fontSize: '0.65rem', 
                      opacity: 0.7, 
                      display: 'block', 
                      textAlign: 'right',
                      marginTop: '4px'
                    }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* INPUT AREA */}
            <form onSubmit={sendMessage} style={{ 
              padding: '1.5rem', 
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <input 
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '0.75rem 1.25rem',
                  color: 'white',
                  outline: 'none'
                }}
              />
              <button 
                type="submit"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <Send size={18} />
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              background: 'rgba(255,255,255,0.03)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <MessageCircle size={40} opacity={0.2} />
            </div>
            <h3>Your Conversations</h3>
            <p>Select a contact from the left to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
