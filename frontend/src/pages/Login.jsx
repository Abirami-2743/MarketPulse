import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

/* ── Tiny sparkline drawn on canvas ── */
function PulseCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const pts = Array.from({ length: 40 }, (_, i) =>
      0.5 + 0.28 * Math.sin(i * 0.55) + 0.14 * Math.sin(i * 1.3) + 0.06 * Math.sin(i * 3.1)
    )
    let offset = 0
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const shifted = [...pts.slice(offset % pts.length), ...pts].slice(0, pts.length)
      ctx.beginPath()
      shifted.forEach((v, i) => {
        const x = (i / (pts.length - 1)) * W
        const y = H - v * H * 0.72 - H * 0.14
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      const grad = ctx.createLinearGradient(0, 0, W, 0)
      grad.addColorStop(0,   'rgba(200,168,75,0.0)')
      grad.addColorStop(0.3, 'rgba(200,168,75,0.9)')
      grad.addColorStop(0.7, 'rgba(200,168,75,0.9)')
      grad.addColorStop(1,   'rgba(200,168,75,0.0)')
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.8
      ctx.lineJoin = 'round'
      ctx.stroke()

      /* moving dot */
      const dotIdx = Math.floor(pts.length * 0.68)
      const dotX = (dotIdx / (pts.length - 1)) * W
      const dotY = H - shifted[dotIdx] * H * 0.72 - H * 0.14
      ctx.beginPath()
      ctx.arc(dotX, dotY, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#C8A84B'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(dotX, dotY, 7, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(200,168,75,0.2)'
      ctx.fill()

      offset++
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} width={340} height={80} style={{ width: '100%', height: 80, display: 'block' }} />
}

const TICKERS = [
  { sym: 'BTC', val: '67,420', chg: '+4.2%', up: true },
  { sym: 'ETH', val: '3,580',  chg: '+2.1%', up: true },
  { sym: 'AAPL', val: '212.4', chg: '−0.8%', up: false },
  { sym: 'NVDA', val: '875.2', chg: '+6.3%', up: true },
]

function Login() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')
  const [now, setNow]         = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.')
    }
    setLoading(false)
  }

  const fields = [
    { name: 'email',    label: 'Email address', type: 'text',     placeholder: 'you@example.com' },
    { name: 'password', label: 'Password',       type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div style={{
      height: '100vh', background: '#F7F4EE',
      display: 'flex', fontFamily: "'Outfit', sans-serif", overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&family=Geist+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer   { from{background-position:-200% center} to{background-position:200% center} }
        @keyframes tickIn    { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }

        /* ── Left: form ── */
        .panel-left {
          flex: 1;
          background: #F7F4EE;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 52px 60px;
          position: relative;
        }
        .form-shell {
          width: 100%; max-width: 360px;
          animation: fadeUp 0.55s ease both;
        }

        .brand-row {
          display: flex; align-items: baseline; gap: 9px;
          cursor: pointer; user-select: none; margin-bottom: 48px;
        }
        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.03em;
        }
        .brand-tag {
          font-family: 'Geist Mono', monospace;
          font-size: 9px; color: #B09A7A;
          letter-spacing: 0.15em; text-transform: uppercase;
          border: 1px solid #DDD5C5; padding: 2px 7px; border-radius: 4px;
        }

        .form-eyebrow {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 12px;
          display: flex; align-items: center; gap: 8px;
        }
        .form-eyebrow::before { content:''; display:inline-block; width:16px; height:1px; background:#C8BBA8; }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.03em; margin-bottom: 6px;
        }
        .form-sub { font-size: 13px; color: #9E9485; margin-bottom: 32px; font-weight: 300; }

        .field-wrap { margin-bottom: 18px; }
        .field-label {
          display: block;
          font-family: 'Geist Mono', monospace;
          font-size: 9px; color: #B09A7A;
          letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px;
        }
        .field-input {
          width: 100%; padding: 13px 16px;
          background: #FFFDF8; border: 1px solid #E0D8CC;
          border-radius: 10px; color: #1A1612; font-size: 14px; outline: none;
          font-family: 'Outfit', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: #C8BBA8; }
        .field-input:focus, .field-input.focused {
          border-color: #C8A84B;
          box-shadow: 0 0 0 3px rgba(200,168,75,0.12);
        }

        .error-banner {
          display: flex; align-items: flex-start; gap: 10px;
          background: #FDF0EE; border: 1px solid #DFB8B4;
          border-radius: 10px; padding: 12px 14px;
          margin-bottom: 18px; color: #C0392B;
          font-size: 13px; line-height: 1.5;
          animation: fadeUp 0.25s ease;
        }

        .submit-btn {
          width: 100%; padding: 14px;
          background: #1A1612; color: #F7F4EE;
          border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer; transition: all 0.22s;
          font-family: 'Outfit', sans-serif;
          margin-top: 6px; position: relative; overflow: hidden;
        }
        .submit-btn::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          background-size:200% 100%; opacity:0; transition:opacity 0.2s;
        }
        .submit-btn:hover:not(:disabled)::after { opacity:1; animation:shimmer 1.2s ease infinite; }
        .submit-btn:hover:not(:disabled) { background:#2D2520; transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,0,0,0.15); }
        .submit-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none; }

        .form-divider {
          display:flex; align-items:center; gap:12px; margin:24px 0;
        }
        .form-divider-line { flex:1; height:1px; background:#E8E0CF; }
        .form-divider-txt {
          font-family:'Geist Mono',monospace;
          font-size:9px; color:#C8BBA8;
          letter-spacing:0.12em; text-transform:uppercase; white-space:nowrap;
        }

        .register-btn-alt {
          width:100%; padding:13px;
          background:transparent; color:#7A6E62;
          border:1px solid #DDD5C5; border-radius:10px;
          font-size:13px; font-weight:500;
          cursor:pointer; transition:all 0.22s;
          font-family:'Outfit',sans-serif; letter-spacing:0.03em;
        }
        .register-btn-alt:hover { border-color:#C8A84B; color:#9A7B3C; background:rgba(200,168,75,0.04); }

        .form-footer {
          margin-top:28px; text-align:center;
          font-family:'Geist Mono',monospace;
          font-size:9px; color:#D4CAB8;
          letter-spacing:0.1em; text-transform:uppercase; line-height:1.8;
        }

        /* ── Right: editorial dark panel ── */
        .panel-right {
          width: 52%;
          background: #1A1612;
          display: flex; flex-direction: column;
          padding: 52px 60px;
          position: relative; overflow: hidden;
        }
        .panel-right::before {
          content:'';
          position:absolute; top:-160px; right:-120px;
          width:520px; height:520px; border-radius:50%;
          background:radial-gradient(circle, rgba(200,168,75,0.06) 0%, transparent 70%);
          pointer-events:none;
        }
        .panel-right::after {
          content:'';
          position:absolute; bottom:-80px; left:-60px;
          width:360px; height:360px; border-radius:50%;
          background:radial-gradient(circle, rgba(200,168,75,0.04) 0%, transparent 70%);
          pointer-events:none;
        }

        .right-top {
          display:flex; justify-content:space-between; align-items:flex-start;
          margin-bottom:auto; position:relative; z-index:2;
        }
        .right-clock {
          font-family:'Geist Mono',monospace;
          font-size:11px; color:rgba(247,244,238,0.3);
          letter-spacing:0.08em; text-align:right; line-height:1.6;
        }
        .right-clock strong { color:rgba(247,244,238,0.55); display:block; font-size:14px; }

        .live-badge {
          display:flex; align-items:center; gap:6px;
          background:rgba(45,125,70,0.12); border:1px solid rgba(45,125,70,0.25);
          border-radius:50px; padding:5px 12px;
          font-family:'Geist Mono',monospace;
          font-size:10px; color:#4CAF70;
          letter-spacing:0.08em; text-transform:uppercase;
        }
        .live-dot {
          width:6px; height:6px; border-radius:50%; background:#4CAF70;
          animation:livepulse 2s ease infinite;
        }

        /* ticker strip */
        .ticker-strip {
          display:grid; grid-template-columns:1fr 1fr; gap:10px;
          margin-bottom:32px; position:relative; z-index:2;
        }
        .ticker-card {
          background:rgba(247,244,238,0.04);
          border:1px solid rgba(247,244,238,0.07);
          border-radius:12px; padding:14px 16px;
          transition:background 0.2s;
          animation:tickIn 0.4s ease both;
        }
        .ticker-card:hover { background:rgba(200,168,75,0.06); border-color:rgba(200,168,75,0.15); }
        .ticker-sym {
          font-family:'Geist Mono',monospace;
          font-size:10px; letter-spacing:0.14em; text-transform:uppercase;
          color:rgba(247,244,238,0.4); margin-bottom:6px;
        }
        .ticker-val {
          font-family:'Geist Mono',monospace;
          font-size:18px; font-weight:700;
          color:#F7F4EE; line-height:1; margin-bottom:4px; letter-spacing:-0.01em;
        }
        .ticker-chg {
          font-family:'Geist Mono',monospace;
          font-size:11px; font-weight:600;
        }
        .ticker-chg.up  { color:#4CAF70; }
        .ticker-chg.dn  { color:#E07070; }

        /* pulse chart */
        .chart-wrap {
          position:relative; z-index:2; margin-bottom:32px;
        }
        .chart-label {
          font-family:'Geist Mono',monospace;
          font-size:9px; color:rgba(247,244,238,0.25);
          letter-spacing:0.14em; text-transform:uppercase;
          margin-bottom:10px;
          display:flex; align-items:center; gap:8px;
        }
        .chart-label::before { content:''; flex:none; width:14px; height:1px; background:rgba(247,244,238,0.15); }

        /* quote */
        .right-quote-wrap {
          position:relative; z-index:2; margin-bottom:auto;
        }
        .right-eyebrow {
          font-family:'Geist Mono',monospace;
          font-size:10px; color:rgba(200,168,75,0.55);
          letter-spacing:0.2em; text-transform:uppercase;
          margin-bottom:16px;
          display:flex; align-items:center; gap:10px;
        }
        .right-eyebrow::before { content:''; display:inline-block; width:18px; height:1px; background:rgba(200,168,75,0.25); }
        .right-title {
          font-family:'Playfair Display',serif;
          font-size:clamp(30px,2.8vw,40px);
          font-weight:700; line-height:1.1;
          letter-spacing:-0.03em;
          color:#F7F4EE; margin-bottom:16px;
        }
        .right-title em { font-style:italic; color:#C8A84B; }
        .right-desc {
          font-size:13px; color:rgba(247,244,238,0.4);
          line-height:1.85; font-weight:300; margin-bottom:28px;
          max-width:380px;
        }

        .right-create-btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 26px;
          background:rgba(200,168,75,0.1);
          border:1px solid rgba(200,168,75,0.25);
          border-radius:10px; color:#C8A84B;
          font-size:12px; font-weight:600;
          letter-spacing:0.07em; text-transform:uppercase;
          cursor:pointer; transition:all 0.22s;
          font-family:'Outfit',sans-serif;
        }
        .right-create-btn:hover { background:rgba(200,168,75,0.16); border-color:rgba(200,168,75,0.45); transform:translateY(-1px); }

        .right-divider {
          height:1px; background:rgba(247,244,238,0.06); margin:28px 0;
          position:relative; z-index:2;
        }
        .right-footer {
          font-family:'Geist Mono',monospace;
          font-size:9px; color:rgba(247,244,238,0.18);
          letter-spacing:0.1em; text-transform:uppercase;
          position:relative; z-index:2;
        }
      `}</style>

      {/* ── Left: form ── */}
      <div className="panel-left">
        <div className="form-shell">
          <div className="brand-row" onClick={() => navigate('/')}>
            <span className="brand-name">MarketPulse</span>
            <span className="brand-tag">Terminal</span>
          </div>

          <div className="form-eyebrow">Sign in</div>
          <h2 className="form-title">Welcome back.</h2>
          <p className="form-sub">Your market briefing is ready.</p>

          {error && (
            <div className="error-banner">
              <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
              {error}
            </div>
          )}

          {fields.map(f => (
            <div className="field-wrap" key={f.name}>
              <label className="field-label">{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handleChange}
                onFocus={() => setFocused(f.name)}
                onBlur={() => setFocused('')}
                className={`field-input${focused === f.name ? ' focused' : ''}`}
                placeholder={f.placeholder}
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              />
            </div>
          ))}

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="form-divider">
            <div className="form-divider-line" />
            <span className="form-divider-txt">no account yet?</span>
            <div className="form-divider-line" />
          </div>

          <button className="register-btn-alt" onClick={() => navigate('/register')}>
            Create a free account
          </button>

          <div className="form-footer">
            For informational purposes only · Not financial advice
          </div>
        </div>
      </div>

      {/* ── Right: editorial dark panel ── */}
      <div className="panel-right">
        <div className="right-top">
          <div className="live-badge">
            <span className="live-dot" />
            Live
          </div>
          <div className="right-clock">
            <strong>{now.toLocaleTimeString('en-US', { hour12: false })}</strong>
            {now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0, position: 'relative', zIndex: 2 }}>

          {/* Quote */}
          <div className="right-quote-wrap" style={{ marginBottom: 36 }}>
            <div className="right-eyebrow">MarketPulse AI</div>
            <h2 className="right-title">
              Real data.<br />
              Real <em>intelligence.</em>
            </h2>
            <p className="right-desc">
              Every answer from MarketPulse AI is grounded in live market data — not guesswork. Sign in and get a briefing that actually means something.
            </p>
            <button className="right-create-btn" onClick={() => navigate('/register')}>
              Create account →
            </button>
          </div>

          {/* Animated pulse chart */}
          <div className="chart-wrap">
            <div className="chart-label">Market pulse · Live feed</div>
            <PulseCanvas />
          </div>

          {/* Ticker cards */}
          <div className="ticker-strip">
            {TICKERS.map((t, i) => (
              <div className="ticker-card" key={i} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="ticker-sym">{t.sym}</div>
                <div className="ticker-val">{t.val}</div>
                <div className={`ticker-chg ${t.up ? 'up' : 'dn'}`}>{t.chg}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="right-divider" />
        <div className="right-footer">
          MarketPulse Terminal · {now.getFullYear()} · Not financial advice
        </div>
      </div>
    </div>
  )
}

export default Login
