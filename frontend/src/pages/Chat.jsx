import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const SUGGESTIONS = [
  'Analyze Bitcoin risk',
  'Compare stocks today',
  'Market summary',
  'Which assets are bullish?',
]

function FormattedMessage({ text }) {
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    const isTableHeader = line.trim().startsWith('|')
    const nextLine = lines[i + 1]?.trim() || ''
    const isSeparator = nextLine.startsWith('|') && nextLine.replace(/[\s|]/g, '').replace(/-/g, '') === ''

    if (isTableHeader && isSeparator) {
      const headers = line.split('|').map(h => h.trim()).filter(Boolean)
      i += 2
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean)
        if (cells.length > 0) rows.push(cells)
        i++
      }
      elements.push(
        <div key={`table-${i}`} style={{ overflowX: 'auto', margin: '12px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {headers.map((h, hi) => (
                  <th key={hi} style={{
                    padding: '9px 12px', textAlign: 'left',
                    borderBottom: '1px solid #E8E0CF',
                    color: '#9A7B3C', fontWeight: 600,
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{
                  borderBottom: '1px solid #F0EBE1',
                  background: ri % 2 === 0 ? 'transparent' : 'rgba(200,168,75,0.03)'
                }}>
                  {row.map((cell, ci) => {
                    const isUp      = cell.includes('+') && cell.includes('%')
                    const isDown    = cell.startsWith('-') && cell.includes('%')
                    const isHigh    = cell.toUpperCase() === 'HIGH'
                    const isMed     = cell.toUpperCase() === 'MEDIUM'
                    const isLow     = cell.toUpperCase() === 'LOW'
                    const isBullish = cell === 'Bullish'
                    const isBearish = cell === 'Bearish'
                    let color = '#4A4138'
                    if (isUp || isBullish || isLow)  color = '#2D7D46'
                    if (isDown || isBearish || isHigh) color = '#C0392B'
                    if (isMed) color = '#9A7B3C'
                    return (
                      <td key={ci} style={{
                        padding: '9px 12px', color,
                        fontFamily: "'Geist Mono', monospace", fontSize: '12px',
                        fontWeight: (isHigh || isMed || isLow || isBullish || isBearish) ? 600 : 400
                      }}>{cell}</td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    if (line.trim() === '') {
      elements.push(<div key={`br-${i}`} style={{ height: '6px' }} />)
      i++; continue
    }

    const boldParts = line.split(/\*\*(.*?)\*\*/)
    const rendered = boldParts.length > 1
      ? boldParts.map((part, j) =>
          j % 2 === 1
            ? <span key={j} style={{ color: '#9A7B3C', fontWeight: 600 }}>{part}</span>
            : part
        )
      : line

    if (line.startsWith('•') || line.startsWith('-')) {
      const low = line.toLowerCase()
      const isRisk = low.includes('risk')
      const isHigh = low.includes('high')
      const isMed  = low.includes('medium')
      const isLow  = low.includes('low')
      const isBull = low.includes('bullish')
      const isBear = low.includes('bearish')
      let accent = '#7A6E62'
      if (isRisk && isHigh)   accent = '#C0392B'
      else if (isRisk && isMed) accent = '#9A7B3C'
      else if (isRisk && isLow) accent = '#2D7D46'
      else if (isBull) accent = '#2D7D46'
      else if (isBear) accent = '#C0392B'
      elements.push(
        <div key={`b-${i}`} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <span style={{ color: '#C8A84B', flexShrink: 0, marginTop: '2px', fontWeight: 700 }}>·</span>
          <span style={{ color: accent, lineHeight: 1.7 }}>
            {boldParts.length > 1 ? rendered : line.slice(1).trim()}
          </span>
        </div>
      )
      i++; continue
    }

    elements.push(
      <div key={`l-${i}`} style={{ lineHeight: 1.75, color: '#4A4138' }}>
        {boldParts.length > 1 ? rendered : line}
      </div>
    )
    i++
  }

  return <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>{elements}</div>
}

function ThinkingDots() {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#C8A84B',
          animation: 'dotPulse 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </div>
  )
}

const INITIAL_MESSAGE = {
  role: 'ai',
  text: 'Good morning. I am **MarketPulse AI** — your intelligent market analyst.\n\nAsk me about any stock or crypto and I will give you a full risk analysis with trend insights.',
  error: false
}

// Derive a stable, per-user storage key from the token.
// We use a short hash of the token so different accounts never share the same key.
function getChatStorageKey() {
  const token = localStorage.getItem('token') || 'guest'
  // Simple djb2-style hash — good enough to differentiate accounts
  let hash = 5381
  for (let idx = 0; idx < token.length; idx++) {
    hash = ((hash << 5) + hash) ^ token.charCodeAt(idx)
    hash = hash >>> 0 // keep unsigned 32-bit
  }
  return `mp_chat_messages_${hash}`
}

function Chat() {
  const navigate = useNavigate()
  const bottomRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [now, setNow] = useState(new Date())

  // Compute the key once per mount (token won't change while the component is alive)
  const storageKey = useRef(getChatStorageKey()).current

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : [INITIAL_MESSAGE]
    } catch {
      return [INITIAL_MESSAGE]
    }
  })

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login')
    const t = setInterval(() => setNow(new Date()), 1000)
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => { clearInterval(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(messages)) } catch {}
  }, [messages, storageKey])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const question = (text || input).trim()
    if (!question || loading) return
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setInput('')
    setLoading(true)
    try {
      const res = await api.post('/agent/ask', { question })
      setMessages(prev => [...prev, { role: 'ai', text: res.data.answer, error: false }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Something went wrong while fetching market data.',
        error: true,
        retryText: question
      }])
    }
    setLoading(false)
  }

  const handleRetry = (retryText) => {
    setMessages(prev => prev.filter(m => m.retryText !== retryText))
    sendMessage(retryText)
  }

  const clearChat = () => {
    localStorage.removeItem(storageKey)
    setMessages([INITIAL_MESSAGE])
  }

  const showSuggestions = messages.length <= 1

  return (
    <div style={{
      height: '100vh',
      background: '#F7F4EE',
      color: '#1A1612',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&family=Geist+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F0EBE1; }
        ::-webkit-scrollbar-thumb { background: #C8BBA8; border-radius: 3px; }

        @keyframes dotPulse { 0%,80%,100%{opacity:0.25;transform:scale(0.75)} 40%{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }

        .nav {
          position: sticky; top: 0; z-index: 100;
          height: 62px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          background: rgba(247,244,238,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.07);
          transition: box-shadow 0.3s;
          flex-shrink: 0;
        }
        .nav.elevated { box-shadow: 0 2px 24px rgba(0,0,0,0.07); }

        .nav-brand {
          display: flex; align-items: baseline; gap: 10px;
          cursor: pointer; user-select: none;
        }
        .nav-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.03em;
        }
        .nav-brand-tag {
          font-family: 'Geist Mono', monospace;
          font-size: 9px; color: #B09A7A;
          letter-spacing: 0.15em; text-transform: uppercase;
          border: 1px solid #DDD5C5;
          padding: 2px 7px; border-radius: 4px;
        }

        .nav-links { display: flex; gap: 2px; }
        .nav-link {
          padding: 7px 16px; font-size: 13px; font-weight: 500;
          color: #7A6E62; border-radius: 8px;
          cursor: pointer; transition: all 0.18s;
          letter-spacing: 0.01em;
        }
        .nav-link:hover { background: rgba(0,0,0,0.04); color: #1A1612; }
        .nav-link.active { background: #1A1612; color: #F7F4EE; }

        .nav-right { display: flex; align-items: center; gap: 20px; }
        .nav-clock {
          font-family: 'Geist Mono', monospace;
          font-size: 11px; color: #B09A7A;
          letter-spacing: 0.06em; text-align: right; line-height: 1.5;
        }
        .nav-clock strong { color: #5A4F44; display: block; font-size: 13px; }

        .live-badge {
          display: flex; align-items: center; gap: 6px;
          background: #EDFAF2; border: 1px solid #A8DEB8;
          border-radius: 50px; padding: 4px 10px;
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #2D7D46;
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #2D7D46;
          animation: livepulse 2s ease infinite;
        }

        .btn-logout {
          font-family: 'Outfit', sans-serif;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 8px 18px; border-radius: 8px;
          border: 1px solid #DDD5C5;
          background: transparent; color: #7A6E62;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-logout:hover { border-color: #1A1612; color: #1A1612; background: rgba(0,0,0,0.03); }

        /* ── Chat area ── */
        .chat-area {
          flex: 1; overflow-y: auto;
          padding: 32px 48px;
          display: flex; flex-direction: column; gap: 16px;
        }

        .msg-user { display: flex; justify-content: flex-end; animation: fadeUp 0.25s ease; }
        .msg-ai   { display: flex; justify-content: flex-start; gap: 12px; animation: fadeUp 0.25s ease; }

        .ai-avatar {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0; margin-top: 2px;
          background: rgba(200,168,75,0.1);
          border: 1px solid rgba(200,168,75,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
        }

        .bubble {
          max-width: 68%; padding: 14px 18px; border-radius: 16px;
          font-size: 14px; line-height: 1.7;
        }
        .bubble-user {
          background: #1A1612; color: #F7F4EE;
          font-weight: 400; letter-spacing: 0.01em;
          border-radius: 16px 16px 4px 16px;
          font-family: 'Outfit', sans-serif;
        }
        .bubble-ai {
          background: #FFFDF8; color: #4A4138;
          border: 1px solid #E8E0CF;
          border-radius: 16px 16px 16px 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
        .bubble-error {
          background: #FDF0EE; color: #C0392B;
          border: 1px solid #DFB8B4;
          border-radius: 16px 16px 16px 4px;
        }

        .thinking-bubble {
          background: #FFFDF8; border: 1px solid #E8E0CF;
          border-radius: 16px 16px 16px 4px;
          padding: 14px 18px; max-width: 90px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          animation: fadeUp 0.25s ease;
        }

        .retry-btn {
          margin-top: 10px; padding: 6px 14px;
          background: transparent; color: #C0392B;
          border: 1px solid #DFB8B4; border-radius: 8px;
          font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Outfit', sans-serif; display: block;
          letter-spacing: 0.04em;
        }
        .retry-btn:hover { background: #FDF0EE; border-color: #C0392B; }

        .suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; animation: fadeUp 0.4s ease; }
        .suggestion-chip {
          padding: 7px 16px;
          background: #FFFDF8; border: 1px solid #E0D8CC;
          border-radius: 8px; font-size: 12px; font-weight: 500;
          color: #7A6E62; cursor: pointer; transition: all 0.2s;
          font-family: 'Outfit', sans-serif; letter-spacing: 0.01em;
        }
        .suggestion-chip:hover { border-color: #C8A84B; color: #9A7B3C; background: rgba(200,168,75,0.05); }

        /* ── Input area ── */
        .input-area {
          padding: 18px 48px 24px;
          background: rgba(247,244,238,0.95);
          border-top: 1px solid rgba(0,0,0,0.07);
          display: flex; gap: 10px; flex-shrink: 0; align-items: center;
          backdrop-filter: blur(12px);
        }
        .chat-input {
          flex: 1; padding: 13px 20px;
          background: #FFFDF8;
          border: 1px solid #E0D8CC;
          border-radius: 10px; color: #1A1612;
          font-size: 14px; outline: none;
          font-family: 'Outfit', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .chat-input:focus { border-color: #C8A84B; box-shadow: 0 0 0 3px rgba(200,168,75,0.1); }
        .chat-input::placeholder { color: #C8BBA8; }
        .chat-input:disabled { opacity: 0.6; }

        .send-btn {
          padding: 13px 26px;
          background: #1A1612; color: #F7F4EE;
          border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Outfit', sans-serif; white-space: nowrap;
        }
        .send-btn:hover:not(:disabled) { background: #2D2520; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
        .send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

        .clear-btn {
          padding: 13px 16px;
          background: transparent; border: 1px solid #DDD5C5;
          border-radius: 10px; color: #B09A7A;
          font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Outfit', sans-serif; white-space: nowrap;
          letter-spacing: 0.04em;
        }
        .clear-btn:hover { border-color: #C0392B; color: #C0392B; background: rgba(192,57,43,0.04); }

        /* ── Page header strip ── */
        .chat-header {
          padding: 28px 48px 0;
          flex-shrink: 0;
        }
        .chat-eyebrow {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 6px;
          display: flex; align-items: center; gap: 8px;
        }
        .chat-eyebrow::before {
          content:''; display:inline-block;
          width:18px; height:1px; background:#C8BBA8;
        }
        .chat-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.03em;
          margin-bottom: 18px;
        }
        .chat-title em { font-style: italic; color: #9A7B3C; }
        .chat-divider { height: 1px; background: rgba(0,0,0,0.07); margin-bottom: 0; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`nav${scrolled ? ' elevated' : ''}`}>
        <div className="nav-brand" onClick={() => navigate('/')}>
          <span className="nav-brand-name">MarketPulse</span>
          <span className="nav-brand-tag">Terminal</span>
        </div>

        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</span>
          <span className="nav-link active">AI Analyst</span>
          <span className="nav-link" onClick={() => navigate('/about')}>About</span>
        </div>

        <div className="nav-right">
          <div className="live-badge">
            <span className="live-dot" />
            Live
          </div>
          <div className="nav-clock">
            <strong>{now.toLocaleTimeString('en-US', { hour12: false })}</strong>
            {now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <button className="btn-logout" onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Page header ── */}
      <div className="chat-header">
        <div className="chat-eyebrow">AI Analyst</div>
        <h1 className="chat-title">Ask anything about <em>the market.</em></h1>
        <div className="chat-divider" />
      </div>

      {/* ── Messages ── */}
      <div className="chat-area">
        {messages.map((m, i) => (
          m.role === 'user' ? (
            <div key={i} className="msg-user">
              <div className="bubble bubble-user">{m.text}</div>
            </div>
          ) : (
            <div key={i} className="msg-ai">
              <div className="ai-avatar">✦</div>
              <div>
                <div className={`bubble ${m.error ? 'bubble-error' : 'bubble-ai'}`}>
                  {m.error
                    ? <span style={{ fontSize: '13px', fontWeight: 500 }}>⚠ {m.text}</span>
                    : <FormattedMessage text={m.text} />
                  }
                  {m.error && (
                    <button className="retry-btn" onClick={() => handleRetry(m.retryText)}>↺ Retry</button>
                  )}
                </div>
                {i === 0 && showSuggestions && (
                  <div className="suggestions">
                    {SUGGESTIONS.map((s, si) => (
                      <button key={si} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        ))}
        {loading && (
          <div className="msg-ai">
            <div className="ai-avatar">✦</div>
            <div className="thinking-bubble"><ThinkingDots /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="input-area">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !loading) sendMessage() }}
          placeholder="Ask about any stock or crypto..."
          disabled={loading}
        />
        <button className="clear-btn" onClick={clearChat}>Clear</button>
        <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
          {loading ? 'Analyzing…' : 'Ask AI'}
        </button>
      </div>
    </div>
  )
}

export default Chat