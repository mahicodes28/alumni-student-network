import React, {
  useState,
  useEffect,
  useRef
} from 'react';

import { useAuth } from '../context/AuthContext';

import api from '../utils/api';

import {

  Send,
  MessageCircle,
  Search,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Sparkles,
  Clock,
  User2,
  ChevronLeft

} from 'lucide-react';

const Messages = () => {

  const { user } = useAuth();

  const [contacts, setContacts] = useState([]);

  const [selectedContact, setSelectedContact] =
    useState(null);

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] =
    useState('');

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const chatEndRef = useRef(null);

  // =========================================
  // FETCH CONTACTS
  // =========================================

  useEffect(() => {

    const fetchContacts = async () => {

      try {

        const res = await api.get(
          `/contacts/${user.user_id}`
        );

        setContacts(res.data.data || []);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchContacts();

  }, [user.user_id]);

  // =========================================
  // FETCH MESSAGES
  // =========================================

  useEffect(() => {

    if (!selectedContact) return;

    const fetchMessages = async () => {

      try {

        const res = await api.get(

          `/messages/${selectedContact.id}?user_id=${user.user_id}`

        );

        setMessages(res.data.data || []);

      } catch (err) {

        console.error(err);

      }

    };

    fetchMessages();

    const interval = setInterval(
      fetchMessages,
      2500
    );

    return () => clearInterval(interval);

  }, [selectedContact, user.user_id]);

  // =========================================
  // AUTO SCROLL
  // =========================================

  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });

  }, [messages]);

  // =========================================
  // SEND MESSAGE
  // =========================================

  const sendMessage = async (e) => {

    e.preventDefault();

    if (
      !newMessage.trim() ||
      !selectedContact
    ) return;

    const tempMessage = {

      sender_id: user.user_id,

      content: newMessage,

      timestamp: new Date().toISOString()

    };

    setMessages(prev => [...prev, tempMessage]);

    const currentMessage = newMessage;

    setNewMessage('');

    try {

      await api.post('/messages', {

        sender_id: user.user_id,

        receiver_id: selectedContact.id,

        content: currentMessage

      });

    } catch (err) {

      console.error(err);

    }

  };

  // =========================================
  // FILTER CONTACTS
  // =========================================

  const filteredContacts = contacts.filter(
    contact =>

      contact.name
      .toLowerCase()
      .includes(search.toLowerCase())

  );

  return (

    <div className="messages-layout">

      {/* SIDEBAR */}

      <aside className="chat-sidebar">

        {/* HEADER */}

        <div className="sidebar-header">

          <div className="sidebar-title">

            <MessageCircle size={24} />

            <div>

              <h2>Messages</h2>

              <p>
                Professional conversations
              </p>

            </div>

          </div>

        </div>

        {/* SEARCH */}

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* CONTACTS */}

        <div className="contacts-list">

          {loading ? (

            <div className="empty-state">
              Loading chats...
            </div>

          ) : filteredContacts.length === 0 ? (

            <div className="empty-state">

              <Sparkles size={40} />

              <p>
                No active conversations yet.
              </p>

            </div>

          ) : (

            filteredContacts.map(contact => (

              <div

                key={contact.id}

                className={`
                contact-item
                ${
                  selectedContact?.id === contact.id
                    ? 'active-contact'
                    : ''
                }
                `}

                onClick={() =>
                  setSelectedContact(contact)
                }

              >

                {/* AVATAR */}

                <div className="avatar">

                  {contact.name?.[0]}

                  <span className="online-dot"></span>

                </div>

                {/* INFO */}

                <div className="contact-info">

                  <div className="contact-top">

                    <h4>
                      {contact.name}
                    </h4>

                    <span>
                      Active
                    </span>

                  </div>

                  <p>
                    {contact.role}
                  </p>

                </div>

              </div>

            ))

          )}

        </div>

      </aside>

      {/* CHAT WINDOW */}

      <main className="chat-window">

        {selectedContact ? (

          <>

            {/* CHAT HEADER */}

            <div className="chat-header">

              <div className="chat-user">

                <div className="avatar big-avatar">

                  {selectedContact.name?.[0]}

                </div>

                <div>

                  <h3>
                    {selectedContact.name}
                  </h3>

                  <p>
                    Active now
                  </p>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="chat-actions">

                <button>
                  <Phone size={18} />
                </button>

                <button>
                  <Video size={18} />
                </button>

                <button>
                  <MoreVertical size={18} />
                </button>

              </div>

            </div>

            {/* MESSAGES */}

            <div className="messages-container">

              {messages.map((msg, index) => {

                const isMine =
                  msg.sender_id === user.user_id;

                return (

                  <div

                    key={index}

                    className={`
                    message-row
                    ${
                      isMine
                        ? 'mine'
                        : 'theirs'
                    }
                    `}

                  >

                    <div className="message-bubble">

                      <p>
                        {msg.content}
                      </p>

                      <div className="message-meta">

                        <span>

                          {new Date(
                            msg.timestamp
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: '2-digit',
                              minute: '2-digit'
                            }
                          )}

                        </span>

                        {isMine && (
                          <CheckCheck
                            size={14}
                          />
                        )}

                      </div>

                    </div>

                  </div>

                );

              })}

              <div ref={chatEndRef}></div>

            </div>

            {/* INPUT */}

            <form
              className="message-form"
              onSubmit={sendMessage}
            >

              <input

                type="text"

                placeholder="Write your message..."

                value={newMessage}

                onChange={(e) =>
                  setNewMessage(e.target.value)
                }

              />

              <button type="submit">

                <Send size={18} />

              </button>

            </form>

          </>

        ) : (

          <div className="chat-placeholder">

            <div className="placeholder-icon">

              <MessageCircle size={60} />

            </div>

            <h2>
              Your Professional Conversations
            </h2>

            <p>
              Select a mentor or mentee to
              begin chatting.
            </p>

          </div>

        )}

      </main>

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

        .messages-layout{
          display:flex;
          height:100vh;
          overflow:hidden;
        }

        /* SIDEBAR */

        .chat-sidebar{
          width:340px;
          background:
          rgba(255,255,255,0.03);
          border-right:
          1px solid rgba(255,255,255,0.08);
          display:flex;
          flex-direction:column;
          backdrop-filter:blur(20px);
        }

        .sidebar-header{
          padding:1.8rem;
          border-bottom:
          1px solid rgba(255,255,255,0.06);
        }

        .sidebar-title{
          display:flex;
          align-items:center;
          gap:1rem;
        }

        .sidebar-title p{
          color:#94a3b8;
          font-size:0.9rem;
        }

        /* SEARCH */

        .search-box{
          margin:1.2rem;
          display:flex;
          align-items:center;
          gap:0.8rem;
          background:
          rgba(255,255,255,0.04);
          border:
          1px solid rgba(255,255,255,0.08);
          border-radius:14px;
          padding:0.9rem 1rem;
        }

        .search-box input{
          background:transparent;
          border:none;
          outline:none;
          color:white;
          width:100%;
        }

        /* CONTACTS */

        .contacts-list{
          flex:1;
          overflow-y:auto;
          padding:0.5rem;
        }

        .contact-item{
          display:flex;
          align-items:center;
          gap:1rem;
          padding:1rem;
          border-radius:18px;
          cursor:pointer;
          transition:0.25s;
          margin-bottom:0.5rem;
        }

        .contact-item:hover{
          background:
          rgba(255,255,255,0.04);
        }

        .active-contact{
          background:
          rgba(59,130,246,0.12);
          border:
          1px solid rgba(59,130,246,0.2);
        }

        /* AVATAR */

        .avatar{
          width:52px;
          height:52px;
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
          font-weight:700;
          position:relative;
        }

        .online-dot{
          position:absolute;
          bottom:2px;
          right:2px;
          width:12px;
          height:12px;
          border-radius:50%;
          background:#10b981;
          border:2px solid #081120;
        }

        .big-avatar{
          width:58px;
          height:58px;
          font-size:1.2rem;
        }

        .contact-info{
          flex:1;
        }

        .contact-top{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .contact-top h4{
          margin:0;
        }

        .contact-top span{
          font-size:0.75rem;
          color:#10b981;
        }

        .contact-info p{
          color:#94a3b8;
          font-size:0.85rem;
          margin-top:0.3rem;
          text-transform:capitalize;
        }

        /* CHAT WINDOW */

        .chat-window{
          flex:1;
          display:flex;
          flex-direction:column;
          background:
          linear-gradient(
          180deg,
          rgba(15,23,42,0.96),
          rgba(2,6,23,1)
          );
        }

        /* HEADER */

        .chat-header{
          padding:1.2rem 2rem;
          border-bottom:
          1px solid rgba(255,255,255,0.06);
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .chat-user{
          display:flex;
          align-items:center;
          gap:1rem;
        }

        .chat-user p{
          color:#10b981;
          font-size:0.85rem;
        }

        .chat-actions{
          display:flex;
          gap:0.8rem;
        }

        .chat-actions button{
          width:42px;
          height:42px;
          border-radius:14px;
          border:none;
          background:
          rgba(255,255,255,0.05);
          color:white;
          cursor:pointer;
        }

        /* MESSAGES */

        .messages-container{
          flex:1;
          overflow-y:auto;
          padding:2rem;
          display:flex;
          flex-direction:column;
          gap:1rem;
        }

        .message-row{
          display:flex;
        }

        .mine{
          justify-content:flex-end;
        }

        .theirs{
          justify-content:flex-start;
        }

        .message-bubble{
          max-width:70%;
          padding:1rem 1.2rem;
          border-radius:22px;
          background:
          rgba(255,255,255,0.06);
          line-height:1.6;
        }

        .mine .message-bubble{
          background:
          linear-gradient(
          135deg,
          #2563eb,
          #3b82f6
          );
          border-bottom-right-radius:8px;
        }

        .theirs .message-bubble{
          border-bottom-left-radius:8px;
        }

        .message-meta{
          display:flex;
          align-items:center;
          justify-content:flex-end;
          gap:0.4rem;
          margin-top:0.5rem;
          font-size:0.7rem;
          opacity:0.7;
        }

        /* INPUT */

        .message-form{
          padding:1.5rem;
          border-top:
          1px solid rgba(255,255,255,0.06);
          display:flex;
          gap:1rem;
        }

        .message-form input{
          flex:1;
          background:
          rgba(255,255,255,0.05);
          border:
          1px solid rgba(255,255,255,0.08);
          border-radius:16px;
          padding:1rem 1.2rem;
          color:white;
          outline:none;
        }

        .message-form button{
          width:58px;
          border:none;
          border-radius:16px;
          background:
          linear-gradient(
          135deg,
          #2563eb,
          #3b82f6
          );
          color:white;
          cursor:pointer;
        }

        /* EMPTY */

        .chat-placeholder{
          flex:1;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          text-align:center;
          color:#94a3b8;
          padding:2rem;
        }

        .placeholder-icon{
          width:120px;
          height:120px;
          border-radius:50%;
          background:
          rgba(255,255,255,0.04);
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:2rem;
        }

        .empty-state{
          padding:3rem 2rem;
          text-align:center;
          color:#94a3b8;
        }

        @media(max-width:900px){

          .chat-sidebar{
            width:100%;
            max-width:320px;
          }

        }

        @media(max-width:768px){

          .messages-layout{
            flex-direction:column;
          }

          .chat-sidebar{
            width:100%;
            height:280px;
          }

        }

      `}</style>

    </div>

  );

};

export default Messages;