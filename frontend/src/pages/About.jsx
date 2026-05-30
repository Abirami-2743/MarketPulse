import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Reveal({ children, delay = 0, from = 'bottom' }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true) }, { threshold: 0.06 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const transforms = { bottom: 'translateY(24px)', left: 'translateX(-24px)', right: 'translateX(24px)' }
  return (
    <div ref={ref} style={{
      opacity: on ? 1 : 0,
      transform: on ? 'none' : transforms[from],
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      height: '100%'
    }}>{children}</div>
  )
}

function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started || !target) return
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * ease))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target])
  return [val, ref]
}

function StatNumber({ target, suffix = '' }) {
  const [val, ref] = useCountUp(target)
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const FEATURES = [
  {
    icon: '📈',
    title: 'Live Market Data',
    desc: 'Real-time crypto and equity prices fetched from CoinGecko and Yahoo Finance, refreshed on every session with intelligent 2-minute caching.'
  },
  {
    icon: '✦',
    title: 'AI Market Analyst',
    desc: 'A LangGraph-powered agent that reads live data from the database before answering — no hallucinated prices, just grounded intelligence.'
  },
  {
    icon: '🔐',
    title: 'Secure by Design',
    desc: 'JWT-based authentication with bcrypt password hashing. Sessions are ephemeral, credentials never stored in plain text.'
  },
  {
    icon: '💬',
    title: 'Intelligent Chat',
    desc: 'Full conversational interface powered by Groq + Llama. Ask anything — risk analysis, trend breakdowns, or portfolio comparisons.'
  },
  {
    icon: '📊',
    title: 'Visual Analytics',
    desc: 'Animated area and bar charts built with Recharts give you a clean snapshot of crypto and equity performance at a glance.'
  },
  {
    icon: '⚡',
    title: 'Rapid Backend',
    desc: 'FastAPI on Python with MongoDB — sub-100ms API responses and a schema designed for fast document retrieval at scale.'
  },
]

const STACK = [
  { label: 'FastAPI', note: 'Backend' },
  { label: 'LangGraph', note: 'AI Agent' },
  { label: 'Groq + Llama', note: 'LLM' },
  { label: 'MongoDB', note: 'Database' },
  { label: 'React', note: 'Frontend' },
  { label: 'CoinGecko', note: 'Crypto API' },
  { label: 'Yahoo Finance', note: 'Stock API' },
  { label: 'JWT + bcrypt', note: 'Auth' },
  { label: 'Recharts', note: 'Charts' },
]

const HOW = [
  { step: '01', title: 'Data ingestion', desc: 'Live prices are pulled from CoinGecko and Yahoo Finance on every request and persisted to MongoDB for agent access.' },
  { step: '02', title: 'Agent reasoning', desc: 'The LangGraph agent fetches fresh database records, applies reasoning, and composes a grounded, accurate response.' },
  { step: '03', title: 'Delivery', desc: 'Answers stream back through FastAPI to the React client, rendered with structured markdown for clarity.' },
]

function About() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => { clearInterval(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE', color: '#1A1612', fontFamily: "'Outfit', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&family=Geist+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F0EBE1; }
        ::-webkit-scrollbar-thumb { background: #C8BBA8; border-radius: 3px; }

        body {
          background-color: #F7F4EE;
          background-image:
            radial-gradient(ellipse 80% 60% at 70% -10%, rgba(212,175,95,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 0% 80%, rgba(160,130,90,0.05) 0%, transparent 50%);
        }

        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
        @keyframes shimmer { from{background-position:-200% center} to{background-position:200% center} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes scanFill { from{transform:translateX(-100%)} to{transform:translateX(300%)} }

        .nav {
          position: sticky; top: 0; z-index: 100;
          height: 62px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          background: rgba(247,244,238,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.07);
          transition: box-shadow 0.3s;
        }
        .nav.elevated { box-shadow: 0 2px 24px rgba(0,0,0,0.07); }

        .nav-brand { display: flex; align-items: baseline; gap: 10px; cursor: pointer; user-select: none; }
        .nav-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.03em;
        }
        .nav-brand-tag {
          font-family: 'Geist Mono', monospace;
          font-size: 9px; color: #B09A7A;
          letter-spacing: 0.15em; text-transform: uppercase;
          border: 1px solid #DDD5C5; padding: 2px 7px; border-radius: 4px;
        }

        .nav-links { display: flex; gap: 2px; }
        .nav-link {
          padding: 7px 16px; font-size: 13px; font-weight: 500;
          color: #7A6E62; border-radius: 8px; cursor: pointer;
          transition: all 0.18s; letter-spacing: 0.01em;
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

        .hero {
          position: relative;
          padding: 80px 48px 72px;
          max-width: 1400px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 60px; align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.07);
        }

        .hero-eyebrow {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .hero-eyebrow::before {
          content:''; display:inline-block;
          width:20px; height:1px; background:#C8BBA8;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 5vw, 64px);
          font-weight: 700; line-height: 1.06;
          letter-spacing: -0.04em;
          color: #1A1612;
          margin-bottom: 24px;
        }
        .hero-title em { font-style: italic; color: #9A7B3C; }

        .hero-desc {
          font-size: 16px; color: #7A6E62;
          line-height: 1.85; font-weight: 300;
          max-width: 480px; margin-bottom: 36px;
        }

        .hero-btns { display: flex; gap: 12px; }
        .btn-primary {
          padding: 13px 30px;
          background: #1A1612; color: #F7F4EE;
          border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          cursor: pointer; transition: all 0.22s;
          font-family: 'Outfit', sans-serif;
        }
        .btn-primary:hover { background: #2D2520; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
        .btn-secondary {
          padding: 13px 30px;
          background: transparent; color: #7A6E62;
          border: 1px solid #DDD5C5; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.22s;
          font-family: 'Outfit', sans-serif; letter-spacing: 0.03em;
        }
        .btn-secondary:hover { border-color: #C8A84B; color: #9A7B3C; background: rgba(200,168,75,0.05); transform: translateY(-1px); }

        .hero-visual { position: relative; }

        .stats-strip {
          background: #1A1612;
          padding: 44px 48px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .stat-item {
          padding: 0 40px;
          border-right: 1px solid rgba(255,255,255,0.08);
          text-align: center;
        }
        .stat-item:first-child { padding-left: 0; }
        .stat-item:last-child { border-right: none; padding-right: 0; }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 48px; font-weight: 700;
          color: #F7F4EE; line-height: 1;
          margin-bottom: 6px; letter-spacing: -0.03em;
        }
        .stat-num span { color: #C8A84B; }
        .stat-label {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: rgba(247,244,238,0.4);
          letter-spacing: 0.16em; text-transform: uppercase;
        }

        .section { padding: 80px 48px; max-width: 1400px; margin: 0 auto; }
        .sec-row { display: flex; align-items: center; gap: 14px; margin-bottom: 48px; }
        .sec-eyebrow {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.2em; text-transform: uppercase;
          white-space: nowrap;
        }
        .sec-line { flex: 1; height: 1px; background: #E8E0CF; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          align-items: stretch;
        }
        .fcard {
          background: #FFFDF8; border: 1px solid #E8E0CF;
          border-radius: 16px; padding: 28px 26px;
          position: relative; overflow: hidden;
          transition: transform 0.28s cubic-bezier(.23,1,.32,1), box-shadow 0.28s, border-color 0.28s;
          cursor: default;
          display: flex; flex-direction: column; height: 100%;
        }
        .fcard::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background: linear-gradient(90deg, #C8A84B, #E8CC7A, #C8A84B);
          opacity:0; transition:opacity 0.28s;
        }
        .fcard:hover { transform:translateY(-4px); box-shadow:0 10px 40px rgba(0,0,0,0.08); border-color:#D4C5A8; }
        .fcard:hover::before { opacity:1; }

        .fcard-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(200,168,75,0.08);
          border: 1px solid rgba(200,168,75,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; margin-bottom: 18px;
          flex-shrink: 0;
        }
        .fcard-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 700;
          color: #1A1612; margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .fcard-desc { font-size: 13px; color: #7A6E62; line-height: 1.8; font-weight: 300; flex: 1; }

        .how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: stretch; }
        .how-card {
          background: #FFFDF8; border: 1px solid #E8E0CF;
          border-radius: 16px; padding: 32px 28px;
          position: relative; overflow: hidden;
          display: flex; flex-direction: column; height: 100%;
        }
        .how-step-num {
          font-family: 'Playfair Display', serif;
          font-size: 56px; font-weight: 700; font-style: italic;
          color: rgba(200,168,75,0.15); line-height: 1;
          margin-bottom: 20px; letter-spacing: -0.04em;
        }
        .how-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700;
          color: #1A1612; margin-bottom: 10px; letter-spacing: -0.02em;
        }
        .how-desc { font-size: 13px; color: #7A6E62; line-height: 1.8; font-weight: 300; flex: 1; }

        .stack-section {
          background: #1A1612;
          padding: 64px 48px;
        }
        .stack-inner { max-width: 1400px; margin: 0 auto; }
        .stack-head { margin-bottom: 40px; }
        .stack-sec-eye {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: rgba(247,244,238,0.35);
          letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 12px;
          display: flex; align-items: center; gap: 10px;
        }
        .stack-sec-eye::before { content:''; display:inline-block; width:18px; height:1px; background:rgba(247,244,238,0.15); }
        .stack-sec-title {
          font-family: 'Playfair Display', serif;
          font-size: 34px; font-weight: 700; font-style: italic;
          color: #F7F4EE; letter-spacing: -0.03em;
        }
        .stack-sec-title em { color: #C8A84B; }

        .stack-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .stack-card {
          background: rgba(247,244,238,0.04);
          border: 1px solid rgba(247,244,238,0.08);
          border-radius: 12px; padding: 20px 22px;
          display: flex; align-items: center; justify-content: space-between;
          transition: background 0.2s, border-color 0.2s;
          cursor: default;
        }
        .stack-card:hover { background: rgba(200,168,75,0.07); border-color: rgba(200,168,75,0.2); }
        .stack-card-name {
          font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 500; color: #F7F4EE;
        }
        .stack-card-note {
          font-family: 'Geist Mono', monospace;
          font-size: 9px; color: rgba(200,168,75,0.7);
          letter-spacing: 0.12em; text-transform: uppercase;
          background: rgba(200,168,75,0.08);
          border: 1px solid rgba(200,168,75,0.15);
          padding: 3px 8px; border-radius: 4px;
        }

        .builder-section { padding: 80px 48px; max-width: 1400px; margin: 0 auto; }
        .builder-inner {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .builder-card-big {
          background: #FFFDF8; border: 1px solid #E8E0CF;
          border-radius: 20px; padding: 40px;
          box-shadow: 0 4px 28px rgba(0,0,0,0.05);
          position: relative; overflow: hidden;
        }
        .builder-card-big::before {
          content:''; position:absolute; top:0; left:0; right:0; height:3px;
          background: linear-gradient(90deg, #C8A84B, #E8CC7A, #C8A84B);
        }
        .builder-avatar {
          width: 72px; height: 72px; border-radius: 18px;
          background: linear-gradient(135deg, rgba(200,168,75,0.15), rgba(200,168,75,0.05));
          border: 1px solid rgba(200,168,75,0.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700;
          color: #9A7B3C; margin-bottom: 20px;
        }
        .builder-name {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.03em;
          margin-bottom: 4px;
        }
        .builder-role {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .builder-role::after { content:''; flex:1; height:1px; background:#E8E0CF; max-width:60px; }
        .builder-desc { font-size: 14px; color: #7A6E62; line-height: 1.9; font-weight: 300; }
        .builder-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
        .builder-tag {
          padding: 5px 12px;
          background: #F7F4EE; border: 1px solid #E0D8CC;
          border-radius: 6px; font-size: 11px; color: #9E9485;
          font-family: 'Geist Mono', monospace; letter-spacing: 0.06em;
        }

        .builder-quote-section { padding-left: 0; }
        .builder-quote-eyebrow {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .builder-quote-eyebrow::before { content:''; display:inline-block; width:18px; height:1px; background:#C8BBA8; }
        .builder-quote {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700; font-style: italic;
          color: #1A1612; line-height: 1.4; letter-spacing: -0.03em;
          margin-bottom: 28px;
        }
        .builder-quote em { color: #9A7B3C; }
        .builder-quote-body { font-size: 14px; color: #7A6E62; line-height: 1.85; font-weight: 300; }

        .cta-section {
          background: #1A1612; margin: 0;
          padding: 80px 48px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-section::before {
          content:'';
          position: absolute; top:-120px; left:50%; transform:translateX(-50%);
          width:600px; height:600px; border-radius:50%;
          background: radial-gradient(circle, rgba(200,168,75,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-eyebrow {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: rgba(200,168,75,0.6);
          letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 20px;
        }
        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 700; font-style: italic;
          color: #F7F4EE; line-height: 1.1;
          letter-spacing: -0.04em; margin-bottom: 18px;
        }
        .cta-title em { color: #C8A84B; }
        .cta-sub { font-size: 15px; color: rgba(247,244,238,0.45); margin-bottom: 40px; font-weight: 300; }
        .cta-btns { display: flex; gap: 14px; justify-content: center; }
        .cta-btn-primary {
          padding: 15px 36px;
          background: #C8A84B; color: #1A1612;
          border: none; border-radius: 10px;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer; transition: all 0.22s;
          font-family: 'Outfit', sans-serif;
        }
        .cta-btn-primary:hover { background: #E8CC7A; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(200,168,75,0.25); }
        .cta-btn-secondary {
          padding: 15px 36px;
          background: transparent; color: rgba(247,244,238,0.6);
          border: 1px solid rgba(247,244,238,0.15); border-radius: 10px;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.22s;
          font-family: 'Outfit', sans-serif; letter-spacing: 0.03em;
        }
        .cta-btn-secondary:hover { border-color: rgba(247,244,238,0.35); color: #F7F4EE; }

        .footer {
          display: flex; justify-content: space-between; align-items: center;
          padding: 28px 48px;
          border-top: 1px solid rgba(0,0,0,0.07);
          background: #F7F4EE;
        }
        .footer-brand { font-family:'Playfair Display',serif; font-size:15px; font-style:italic; color:#C8BBA8; }
        .footer-txt { font-family:'Geist Mono',monospace; font-size:9px; color:#D4CAB8; letter-spacing:0.1em; text-align:center; }
      `}</style>

      {/* Navbar */}
      <nav className={`nav${scrolled ? ' elevated' : ''}`}>
        <div className="nav-brand" onClick={() => navigate('/')}>
          <span className="nav-brand-name">MarketPulse</span>
          <span className="nav-brand-tag">Terminal</span>
        </div>
        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</span>
          <span className="nav-link" onClick={() => navigate('/chat')}>AI Analyst</span>
          <span className="nav-link active">About</span>
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

      {/* Hero */}
      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="hero">
          <Reveal delay={0}>
            <div>
              <div className="hero-eyebrow">About MarketPulse</div>
              <h1 className="hero-title">
                Intelligence meets<br />
                <em>the market.</em>
              </h1>
              <p className="hero-desc">
                MarketPulse is an AI platform that tracks crypto and stock markets in real time and explains insights in simple terms.
              </p>
              <div className="hero-btns">
                <button className="btn-primary" onClick={() => navigate('/dashboard')}>Open Dashboard</button>
                <button className="btn-secondary" onClick={() => navigate('/chat')}>Try AI Analyst</button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120} from="right">
            <div className="hero-visual" />
          </Reveal>
        </div>
      </div>

      {/* Stats strip */}
      <Reveal delay={0}>
        <div className="stats-strip">
          {[
            { num: 8, suffix: '+', label: 'Live assets tracked' },
            { num: 100, suffix: '%', label: 'AI-grounded answers' },
            { num: 2, suffix: 's', label: 'Avg. AI response' },
            { num: 1, suffix: '', label: 'Builder, one vision' },
          ].map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-num">
                <StatNumber target={s.num} /><span>{s.suffix}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Features */}
      <div className="section">
        <Reveal delay={0}>
          <div className="sec-row">
            <span className="sec-eyebrow">What we offer</span>
            <div className="sec-line" />
          </div>
        </Reveal>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="fcard">
                <div className="fcard-icon">{f.icon}</div>
                <div className="fcard-title">{f.title}</div>
                <p className="fcard-desc">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: '#FFFDF8', borderTop: '1px solid #E8E0CF', borderBottom: '1px solid #E8E0CF', padding: '80px 0' }}>
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Reveal delay={0}>
            <div className="sec-row">
              <span className="sec-eyebrow">How it works</span>
              <div className="sec-line" />
            </div>
          </Reveal>
          <div className="how-grid">
            {HOW.map((h, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="how-card">
                  <div className="how-step-num">{h.step}</div>
                  <div className="how-title">{h.title}</div>
                  <p className="how-desc">{h.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Stack */}
      <Reveal delay={0}>
        <div className="stack-section">
          <div className="stack-inner">
            <div className="stack-head">
              <div className="stack-sec-eye">Technology</div>
              <div className="stack-sec-title">Built with the <em>best tools</em> for the job.</div>
            </div>
            <div className="stack-grid">
              {STACK.map((s, i) => (
                <div className="stack-card" key={i}>
                  <span className="stack-card-name">{s.label}</span>
                  <span className="stack-card-note">{s.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Builder */}
      <div className="builder-section">
        <Reveal delay={0}>
          <div className="sec-row">
            <span className="sec-eyebrow">The builder</span>
            <div className="sec-line" />
          </div>
        </Reveal>
        <div className="builder-inner">
          <Reveal delay={0}>
            <div className="builder-card-big">
              <div className="builder-avatar">A</div>
              <div className="builder-name">Abiraminayagi</div>
              <div className="builder-role">2nd Year CS · AI Engineer</div>
              <p className="builder-desc">
                Built MarketPulse as a full-stack AI project to explore what happens when real-time financial data meets large language models. Every layer — from the FastAPI backend to the LangGraph agent to the React frontend — was designed and built solo.
              </p>
              <div className="builder-tags">
                {['Full-stack', 'AI / LLM', 'FastAPI', 'React', 'LangGraph'].map((t, i) => (
                  <span className="builder-tag" key={i}>{t}</span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="builder-quote-section">
              <div className="builder-quote-eyebrow">Motivation</div>
              <p className="builder-quote">
                "Markets generate noise.<br />I wanted to build something that turns<br /><em>noise into clarity.</em>"
              </p>
              <p className="builder-quote-body">
                Most retail investors are overwhelmed by raw data — tickers, percentages, conflicting headlines. MarketPulse pairs live market data with an AI that can explain, compare, and analyse in plain language. The goal is not just to display data, but to make it <strong style={{ color: '#1A1612', fontWeight: 600 }}>intelligible</strong>.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* CTA */}
      <Reveal delay={0}>
        <div className="cta-section">
          <div className="cta-eyebrow">Ready to explore</div>
          <h2 className="cta-title">Your market edge<br />starts <em>here.</em></h2>
          <p className="cta-sub">Live prices. AI analysis. No noise.</p>
          <div className="cta-btns">
            <button className="cta-btn-primary" onClick={() => navigate('/dashboard')}>Open Dashboard</button>
            <button className="cta-btn-secondary" onClick={() => navigate('/chat')}>Ask the AI</button>
          </div>
        </div>
      </Reveal>

      {/* Footer */}
      <div className="footer">
        <span className="footer-brand">MarketPulse</span>
        <span className="footer-txt">For informational purposes only · Not financial advice</span>
        <span className="footer-txt">{now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  )
}

export default About