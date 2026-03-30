import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am MarketPulse AI. Ask me anything about stocks or crypto!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await api.post('/agent/ask', { question: input })
      setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Try again!' }])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div style={{ height: '100vh', background: '#0D0818', color: '#F0EAFF', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,700&family=Inter:wght@400;500&display=swap');

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 40px;
          background: #13102A;
          border-bottom: 0.5px solid rgba(139,92,246,0.2);
          flex-shrink: 0;
        }

        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-style: italic;
          color: #F5D97E;
          cursor: pointer;
        }

        .nav-links { display: flex; gap: 28px; align-items: center; }

        .nav-link {
          font-size: 13px;
          color: rgba(240,234,255,0.6);
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #F0EAFF; }
        .nav-link.active { color: #F5D97E; border-bottom: 1px solid #F5D97E; padding-bottom: 2px; }

        .logout-btn {
          padding: 7px 18px;
          background: transparent;
          color: rgba(240,234,255,0.6);
          border: 0.5px solid rgba(240,234,255,0.2);
          border-radius: 50px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .logout-btn:hover { border-color: #F5D97E; color: #F5D97E; }

        .chat-area {
          flex: 1;
          overflow-y: auto;
          padding: 32px 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .msg-user { display: flex; justify-content: flex-end; }
        .msg-ai { display: flex; justify-content: flex-start; }

        .bubble {
          max-width: 58%;
          padding: 14px 18px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.7;
        }

        .bubble-user {
          background: #F5D97E;
          color: #0D0818;
          border-radius: 16px 16px 4px 16px;
        }

        .bubble-ai {
          background: #13102A;
          color: #F0EAFF;
          border: 0.5px solid rgba(139,92,246,0.25);
          border-radius: 16px 16px 16px 4px;
        }

        .thinking {
          background: #13102A;
          border: 0.5px solid rgba(139,92,246,0.25);
          border-radius: 16px 16px 16px 4px;
          padding: 14px 18px;
          font-size: 13px;
          color: rgba(240,234,255,0.4);
          max-width: 120px;
        }

        .input-area {
          padding: 20px 40px;
          background: #13102A;
          border-top: 0.5px solid rgba(139,92,246,0.2);
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .chat-input {
          flex: 1;
          padding: 14px 20px;
          background: #0D0818;
          border: 0.5px solid rgba(139,92,246,0.25);
          border-radius: 50px;
          color: #F0EAFF;
          font-size: 14px;
          outline: none;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s;
        }
        .chat-input:focus { border-color: #F5D97E; }
        .chat-input::placeholder { color: rgba(240,234,255,0.3); }

        .send-btn {
          padding: 14px 28px;
          background: #F5D97E;
          color: #0D0818;
          border: none;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.04em;
        }
        .send-btn:hover { opacity: 0.85; }
        .send-btn:disabled { opacity: 0.5; }
      `}</style>

      {/* Navbar */}
      <div className="navbar">
        <span className="nav-logo" onClick={() => navigate('/')}>MarketPulse</span>
        <div className="nav-links">
  <span className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</span>
  <span className="nav-link active">AI Chat</span>
  <span className="nav-link" onClick={() => navigate('/about')}>About</span>
  <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>Logout</button>
</div>
      </div>

      {/* Messages */}
      <div className="chat-area">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'msg-user' : 'msg-ai'}>
            <div className={`bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg-ai">
            <div className="thinking">Thinking...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="input-area">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about any stock or crypto..."
        />
        <button className="send-btn" onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat