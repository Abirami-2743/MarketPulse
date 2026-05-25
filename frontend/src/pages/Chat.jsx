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

    // Detect markdown table — separator can be | --- | or |---|
    const isTableHeader = line.trim().startsWith('|')
    const nextLine = lines[i + 1]?.trim() || ''
    const isSeparator = nextLine.startsWith('|') && nextLine.replace(/[\s|]/g, '').replace(/-/g, '') === ''

    if (isTableHeader && isSeparator) {
      const headers = line.split('|').map(h => h.trim()).filter(Boolean)
      i += 2 // skip header + separator
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean)
        if (cells.length > 0) rows.push(cells)
        i++
      }
      elements.push(
        <div key={`table-${i}`} style={{ overflowX: 'auto', margin: '10px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {headers.map((h, hi) => (
                  <th key={hi} style={{
                    padding: '9px 12px', textAlign: 'left',
                    borderBottom: '1px solid rgba(245,217,126,0.3)',
                    color: '#F5D97E', fontWeight: 600,
                    fontSize: '11px', letterSpacing: '0.07em', textTransform: 'uppercase'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{
                  borderBottom: '0.5px solid rgba(139,92,246,0.1)',
                  background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
                }}>
                  {row.map((cell, ci) => {
                    const isUp      = cell.includes('+') && cell.includes('%')
                    const isDown    = cell.startsWith('-') && cell.includes('%')
                    const isHigh    = cell.toUpperCase() === 'HIGH'
                    const isMed     = cell.toUpperCase() === 'MEDIUM'
                    const isLow     = cell.toUpperCase() === 'LOW'
                    const isBullish = cell === 'Bullish'
                    const isBearish = cell === 'Bearish'
                    let color = 'rgba(240,234,255,0.8)'
                    if (isUp || isBullish || isLow)  color = '#4ADE80'
                    if (isDown || isBearish || isHigh) color = '#F87171'
                    if (isMed) color = '#FBBF24'
                    return (
                      <td key={ci} style={{
                        padding: '9px 12px', color,
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

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={`br-${i}`} style={{ height: '6px' }} />)
      i++; continue
    }

    // Bold **text**
    const boldParts = line.split(/\*\*(.*?)\*\*/)
    const rendered = boldParts.length > 1
      ? boldParts.map((part, j) =>
          j % 2 === 1
            ? <span key={j} style={{ color: '#F5D97E', fontWeight: 600 }}>{part}</span>
            : part
        )
      : line

    // Bullet lines
    if (line.startsWith('•') || line.startsWith('-')) {
      const low = line.toLowerCase()
      const isRisk = low.includes('risk')
      const isHigh = low.includes('high')
      const isMed  = low.includes('medium')
      const isLow  = low.includes('low')
      const isBull = low.includes('bullish')
      const isBear = low.includes('bearish')
      let accent = 'rgba(240,234,255,0.7)'
      if (isRisk && isHigh) accent = '#F87171'
      else if (isRisk && isMed)  accent = '#FBBF24'
      else if (isRisk && isLow)  accent = '#4ADE80'
      else if (isBull) accent = '#4ADE80'
      else if (isBear) accent = '#F87171'
      elements.push(
        <div key={`b-${i}`} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <span style={{ color: accent, flexShrink: 0, marginTop: '1px' }}>•</span>
          <span style={{ color: accent !== 'rgba(240,234,255,0.7)' ? accent : 'rgba(240,234,255,0.85)', lineHeight: 1.6 }}>
            {boldParts.length > 1 ? rendered : line.slice(1).trim()}
          </span>
        </div>
      )
      i++; continue
    }

    elements.push(
      <div key={`l-${i}`} style={{ lineHeight: 1.7, color: 'rgba(240,234,255,0.85)' }}>
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
          background: 'rgba(245,217,126,0.6)',
          animation: 'dotPulse 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </div>
  )
}

const INITIAL_MESSAGE = {
  role: 'ai',
  text: 'Hi! I am **MarketPulse AI** — your intelligent market analyst.\n\nAsk me about any stock or crypto and I will give you a full risk analysis with trend insights.',
  error: false
}

function Chat() {
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('mp_chat_messages')
      return saved ? JSON.parse(saved) : [INITIAL_MESSAGE]
    } catch {
      return [INITIAL_MESSAGE]
    }
  })

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try { localStorage.setItem('mp_chat_messages', JSON.stringify(messages)) } catch {}
  }, [messages])

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
    localStorage.removeItem('mp_chat_messages')
    setMessages([INITIAL_MESSAGE])
  }

  const showSuggestions = messages.length <= 1

  return (
    <div style={{ height: '100vh', background: '#0D0818', color: '#F0EAFF', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,700&family=Inter:wght@400;500;600&display=swap');
        @keyframes dotPulse { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .navbar { display:flex; justify-content:space-between; align-items:center; padding:18px 40px; background:#13102A; border-bottom:0.5px solid rgba(139,92,246,0.2); flex-shrink:0; }
        .nav-logo { font-family:'Cormorant Garamond',serif; font-size:26px; font-style:italic; color:#F5D97E; cursor:pointer; }
        .nav-links { display:flex; gap:28px; align-items:center; }
        .nav-link { font-size:13px; color:rgba(240,234,255,0.6); cursor:pointer; transition:color 0.2s; }
        .nav-link:hover { color:#F0EAFF; }
        .nav-link.active { color:#F5D97E; border-bottom:1px solid #F5D97E; padding-bottom:2px; }
        .logout-btn { padding:7px 18px; background:transparent; color:rgba(240,234,255,0.6); border:0.5px solid rgba(240,234,255,0.2); border-radius:50px; font-size:12px; cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif; }
        .logout-btn:hover { border-color:#F5D97E; color:#F5D97E; }
        .chat-area { flex:1; overflow-y:auto; padding:28px 40px; display:flex; flex-direction:column; gap:14px; }
        .chat-area::-webkit-scrollbar { width:4px; }
        .chat-area::-webkit-scrollbar-track { background:transparent; }
        .chat-area::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.3); border-radius:4px; }
        .msg-user { display:flex; justify-content:flex-end; animation:fadeUp 0.25s ease; }
        .msg-ai { display:flex; justify-content:flex-start; gap:10px; animation:fadeUp 0.25s ease; }
        .ai-avatar { width:30px; height:30px; border-radius:50%; background:rgba(245,217,126,0.1); border:0.5px solid rgba(245,217,126,0.3); display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; margin-top:2px; }
        .bubble { max-width:68%; padding:14px 18px; border-radius:16px; font-size:14px; line-height:1.7; }
        .bubble-user { background:#F5D97E; color:#0D0818; font-weight:500; border-radius:16px 16px 4px 16px; }
        .bubble-ai { background:#13102A; color:#F0EAFF; border:0.5px solid rgba(139,92,246,0.25); border-radius:16px 16px 16px 4px; }
        .bubble-error { background:rgba(248,113,113,0.06); border:0.5px solid rgba(248,113,113,0.3); border-radius:16px 16px 16px 4px; }
        .retry-btn { margin-top:10px; padding:6px 14px; background:transparent; color:#F87171; border:0.5px solid rgba(248,113,113,0.35); border-radius:50px; font-size:12px; cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.2s; display:block; }
        .retry-btn:hover { background:rgba(248,113,113,0.08); }
        .thinking-bubble { background:#13102A; border:0.5px solid rgba(139,92,246,0.25); border-radius:16px 16px 16px 4px; padding:14px 18px; max-width:100px; animation:fadeUp 0.25s ease; }
        .suggestions { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; animation:fadeUp 0.4s ease; }
        .suggestion-chip { padding:7px 14px; background:rgba(245,217,126,0.05); border:0.5px solid rgba(245,217,126,0.2); border-radius:50px; font-size:12px; color:rgba(240,234,255,0.65); cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif; }
        .suggestion-chip:hover { background:rgba(245,217,126,0.1); color:#F5D97E; border-color:rgba(245,217,126,0.4); }
        .input-area { padding:18px 40px; background:#13102A; border-top:0.5px solid rgba(139,92,246,0.2); display:flex; gap:10px; flex-shrink:0; align-items:center; }
        .chat-input { flex:1; padding:14px 20px; background:#0D0818; border:0.5px solid rgba(139,92,246,0.25); border-radius:50px; color:#F0EAFF; font-size:14px; outline:none; font-family:'Inter',sans-serif; transition:border-color 0.2s; }
        .chat-input:focus { border-color:rgba(245,217,126,0.45); }
        .chat-input::placeholder { color:rgba(240,234,255,0.22); }
        .chat-input:disabled { opacity:0.5; }
        .send-btn { padding:14px 26px; background:#F5D97E; color:#0D0818; border:none; border-radius:50px; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif; white-space:nowrap; }
        .send-btn:hover:not(:disabled) { opacity:0.88; transform:translateY(-1px); }
        .send-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .clear-btn { padding:14px 16px; background:transparent; border:0.5px solid rgba(240,234,255,0.12); border-radius:50px; color:rgba(240,234,255,0.35); font-size:12px; cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif; white-space:nowrap; }
        .clear-btn:hover { border-color:rgba(248,113,113,0.3); color:#F87171; }
      `}</style>

      <div className="navbar">
        <span className="nav-logo" onClick={() => navigate('/')}>MarketPulse</span>
        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</span>
          <span className="nav-link active">AI Analyst</span>
          <span className="nav-link" onClick={() => navigate('/about')}>About</span>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>Logout</button>
        </div>
      </div>

      <div className="chat-area">
        {messages.map((m, i) => (
          m.role === 'user' ? (
            <div key={i} className="msg-user">
              <div className="bubble bubble-user">{m.text}</div>
            </div>
          ) : (
            <div key={i} className="msg-ai">
              <div className="ai-avatar">🤖</div>
              <div>
                <div className={`bubble ${m.error ? 'bubble-error' : 'bubble-ai'}`}>
                  {m.error
                    ? <span style={{ color: '#F87171', fontSize: '13px' }}>⚠ {m.text}</span>
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
            <div className="ai-avatar">🤖</div>
            <div className="thinking-bubble"><ThinkingDots /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

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
          {loading ? 'Analyzing...' : 'Ask AI'}
        </button>
      </div>
    </div>
  )
}

export default Chat