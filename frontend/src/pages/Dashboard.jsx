import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import api from '../api'

/* ── Animated count-up ── */
function useCountUp(target, duration = 1100) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(target * ease)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target])
  return val
}

function TickerPrice({ value }) {
  const v = useCountUp(value)
  return <>{v >= 1000 ? v.toLocaleString('en-US', { maximumFractionDigits: 0 }) : v.toFixed(2)}</>
}

/* ── Scroll fade-in ── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true) }, { threshold: 0.06 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      opacity: on ? 1 : 0,
      transform: on ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
    }}>{children}</div>
  )
}

/* ── Sparkline ── */
function Spark({ positive }) {
  const seed = positive ? 0 : Math.PI
  const data = Array.from({ length: 14 }, (_, i) => ({
    v: 40 + Math.sin(i * 0.7 + seed) * 22 + (Math.sin(i * 1.9) * 8)
  }))
  const color = positive ? '#2D7D46' : '#C0392B'
  return (
    <ResponsiveContainer width="100%" height={38}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`sk${positive ? 'u' : 'd'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
          fill={`url(#sk${positive ? 'u' : 'd'})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* ── Tooltip ── */
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#FFFDF8', border: '1px solid #E8E2D6',
      borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <p style={{ fontSize: 11, color: '#9E9485', margin: '0 0 4px', letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'Geist Mono', monospace" }}>{label}</p>
      <p style={{ fontSize: 17, color: '#1A1612', margin: 0, fontFamily: "'Geist Mono', monospace", fontWeight: 700 }}>
        ${Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  )
}

/* ── Main ── */
export default function Dashboard() {
  const navigate = useNavigate()
  const [crypto, setCrypto] = useState([])
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [insight, setInsight] = useState('')
  const [insightLoading, setInsightLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login')
    fetchData()
    const t = setInterval(() => setNow(new Date()), 1000)
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => { clearInterval(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  const fetchData = async () => {
    try {
      const cached = localStorage.getItem('mp_cache')
      if (cached) {
        const { data, ts } = JSON.parse(cached)
        if ((Date.now() - ts) / 60000 < 2) {
          setCrypto(data.crypto); setStocks(data.stocks); setInsight(data.insight)
          setLoading(false); setInsightLoading(false); return
        }
      }
    } catch {}
    try {
      const [cr, st] = await Promise.all([api.get('/market/crypto'), api.get('/market/stocks')])
      const cryptoData = cr.data.crypto, stockData = st.data.stocks
      setCrypto(cryptoData); setStocks(stockData)
      const ir = await api.post('/agent/ask', { question: 'Give me a 2-3 sentence market summary for today. Be concise and professional.' })
      setInsight(ir.data.answer)
      localStorage.setItem('mp_cache', JSON.stringify({ data: { crypto: cryptoData, stocks: stockData, insight: ir.data.answer }, ts: Date.now() }))
    } catch (e) { console.error(e) }
    setLoading(false); setInsightLoading(false)
  }

  const cryptoChart = crypto.map(c => ({ name: c.asset, price: c.price }))
  const stockChart = stocks.map(s => ({ name: s.asset, price: s.price, down: s.change_percent?.startsWith('-') }))

  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE', color: '#1A1612', fontFamily: "'Outfit', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&family=Geist+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F0EBE1; }
        ::-webkit-scrollbar-thumb { background: #C8BBA8; border-radius: 3px; }

        /* subtle paper texture */
        body {
          background-color: #F7F4EE;
          background-image:
            radial-gradient(ellipse 80% 60% at 70% -10%, rgba(212,175,95,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 0% 80%, rgba(160,130,90,0.05) 0%, transparent 50%);
        }

        /* ── Navbar ── */
        .nav {
          position: sticky; top: 0; z-index: 100;
          height: 62px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          background: rgba(247,244,238,0.88);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          transition: box-shadow 0.3s;
        }
        .nav.elevated { box-shadow: 0 2px 24px rgba(0,0,0,0.07); }

        .nav-brand {
          display: flex; align-items: baseline; gap: 10px;
          cursor: pointer; user-select: none;
        }
        .nav-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.03em;
        }
        .nav-brand-tag {
          font-family: 'Geist Mono', monospace;
          font-size: 9px;
          color: #B09A7A;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border: 1px solid #DDD5C5;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .nav-links { display: flex; gap: 2px; }
        .nav-link {
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #7A6E62;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
          letter-spacing: 0.01em;
        }
        .nav-link:hover { background: rgba(0,0,0,0.04); color: #1A1612; }
        .nav-link.active { background: #1A1612; color: #F7F4EE; }

        .nav-right { display: flex; align-items: center; gap: 20px; }
        .nav-clock {
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          color: #B09A7A;
          letter-spacing: 0.06em;
          text-align: right;
          line-height: 1.5;
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
        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }

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

        /* ── Page body ── */
        .page { padding: 44px 48px 80px; max-width: 1400px; margin: 0 auto; }

        /* ── Page header ── */
        .page-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 36px;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(0,0,0,0.07);
        }
        .page-header-left {}
        .page-eyebrow {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .page-eyebrow::before {
          content:''; display:inline-block;
          width:18px; height:1px; background:#C8BBA8;
        }
        .page-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 700;
          color: #1A1612;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .page-title em { font-style: italic; color: #9A7B3C; }
        .page-sub {
          margin-top: 10px;
          font-size: 14px; color: #9E9485;
          font-weight: 300; letter-spacing: 0.01em;
        }

        .header-stats { display: flex; gap: 32px; }
        .hstat { text-align: right; }
        .hstat-label {
          font-family: 'Geist Mono', monospace;
          font-size: 9px; color: #B09A7A;
          letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 4px;
        }
        .hstat-val {
          font-family: 'Geist Mono', monospace;
          font-size: 22px; font-weight: 700;
          color: #1A1612; line-height: 1;
        }
        .hstat-val.green { color: #2D7D46; }
        .hstat-val.gold { color: #9A7B3C; }

        /* ── AI insight ── */
        .insight {
          display: flex; gap: 20px; align-items: flex-start;
          background: #FFFDF8;
          border: 1px solid #E8E0CF;
          border-left: 3px solid #C8A84B;
          border-radius: 14px;
          padding: 24px 28px;
          margin-bottom: 40px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
          transition: box-shadow 0.3s;
        }
        .insight:hover { box-shadow: 0 4px 28px rgba(0,0,0,0.08); }
        .insight-icon {
          flex-shrink: 0; width: 44px; height: 44px;
          background: rgba(200,168,75,0.1);
          border: 1px solid rgba(200,168,75,0.25);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .insight-label {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #9A7B3C;
          letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 8px;
          display: flex; align-items: center; gap: 8px;
        }
        .insight-text {
          font-size: 14px; line-height: 1.78;
          color: #4A4138; font-weight: 400;
        }
        .insight-placeholder {
          font-family: 'Geist Mono', monospace;
          font-size: 12px; color: #C8BBA8;
          animation: blink 1.2s step-end infinite;
        }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.1} }

        /* ── Section label ── */
        .sec-row {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 18px;
        }
        .sec-title {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.18em; text-transform: uppercase;
          white-space: nowrap;
        }
        .sec-line { flex:1; height:1px; background: #E8E0CF; }
        .sec-count {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #C8BBA8; white-space: nowrap;
        }

        /* ── Cards grid ── */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 40px;
        }

        .pcard {
          background: #FFFDF8;
          border: 1px solid #E8E0CF;
          border-radius: 14px;
          padding: 20px 18px 14px;
          cursor: default;
          transition: transform 0.25s cubic-bezier(.23,1,.32,1), box-shadow 0.25s, border-color 0.25s;
          position: relative; overflow: hidden;
        }
        .pcard::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background: linear-gradient(90deg, #C8A84B, #E8CC7A, #C8A84B);
          opacity: 0; transition: opacity 0.25s;
        }
        .pcard:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.08); border-color: #D4C5A8; }
        .pcard:hover::before { opacity: 1; }

        .pcard-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .pcard-asset {
          font-family: 'Geist Mono', monospace;
          font-size: 11px; color: #9E9485;
          letter-spacing: 0.12em; text-transform: uppercase;
        }
        .pcard-badge {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; font-weight: 700;
          padding: 3px 8px; border-radius: 6px;
          letter-spacing: 0.03em;
        }
        .up { background: #EDFAF2; color: #2D7D46; border: 1px solid #B8DFC4; }
        .dn { background: #FDF0EE; color: #C0392B; border: 1px solid #DFB8B4; }

        .pcard-price {
          font-family: 'Geist Mono', monospace;
          font-size: 22px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em;
          margin-bottom: 10px; line-height: 1;
        }
        .pcard-price sup { font-size: 13px; color: #B09A7A; font-weight: 400; vertical-align: super; }

        /* ── Charts ── */
        .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 40px; }
        .chart-card {
          background: #FFFDF8;
          border: 1px solid #E8E0CF;
          border-radius: 16px;
          padding: 26px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
          transition: box-shadow 0.3s;
        }
        .chart-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
        .chart-head {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px;
        }
        .chart-ttl {
          font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 600;
          color: #1A1612; letter-spacing: -0.02em;
        }
        .chart-tag {
          font-family: 'Geist Mono', monospace;
          font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 6px;
          background: #F0EBE1; color: #9E9485;
          border: 1px solid #E0D8CC;
        }

        /* ── Summary row ── */
        .summary-row {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 14px; margin-bottom: 40px;
        }
        .sum-card {
          background: #FFFDF8;
          border: 1px solid #E8E0CF;
          border-radius: 14px;
          padding: 22px 22px 20px;
          display: flex; align-items: flex-start; gap: 16px;
          transition: box-shadow 0.25s;
        }
        .sum-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .sum-icon {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink:0;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .sum-icon.gold { background: rgba(200,168,75,0.1); border: 1px solid rgba(200,168,75,0.2); }
        .sum-icon.green { background: rgba(45,125,70,0.08); border: 1px solid rgba(45,125,70,0.2); }
        .sum-icon.red { background: rgba(192,57,43,0.07); border: 1px solid rgba(192,57,43,0.18); }
        .sum-lbl {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 4px;
        }
        .sum-val { font-family: 'Geist Mono', monospace; font-size: 26px; font-weight: 700; color: #1A1612; line-height:1; }
        .sum-sub { font-size: 12px; color: #9E9485; margin-top: 4px; }

        /* ── Loading ── */
        .loading-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 70vh; gap: 20px;
        }
        .loading-brand {
          font-family: 'Playfair Display', serif;
          font-size: 38px; font-weight: 700; font-style: italic;
          color: #1A1612; opacity: 0;
          animation: fadeUp 0.7s ease 0.1s forwards;
        }
        @keyframes fadeUp { to { opacity:1; transform: translateY(0); } from { opacity:0; transform: translateY(12px); } }
        .loading-track {
          width: 180px; height: 1px; background: #E0D8CC; border-radius:1px; overflow:hidden;
        }
        .loading-fill {
          height: 100%;
          background: linear-gradient(90deg, transparent, #C8A84B, transparent);
          animation: scanFill 1.4s ease infinite;
        }
        @keyframes scanFill { from{transform:translateX(-100%)} to{transform:translateX(300%)} }
        .loading-txt {
          font-family: 'Geist Mono', monospace;
          font-size: 11px; color: #C8BBA8; letter-spacing: 0.15em; text-transform: uppercase;
          animation: blink 1.4s step-end infinite;
        }

        /* ── Footer ── */
        .footer {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 24px;
          border-top: 1px solid #E8E0CF;
          margin-top: 20px;
        }
        .footer-brand { font-family:'Playfair Display',serif; font-size:15px; font-style:italic; color:#C8BBA8; }
        .footer-txt { font-family:'Geist Mono',monospace; font-size:9px; color:#D4CAB8; letter-spacing:0.1em; text-align:center; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`nav${scrolled ? ' elevated' : ''}`}>
        <div className="nav-brand" onClick={() => navigate('/')}>
          <span className="nav-brand-name">MarketPulse</span>
          <span className="nav-brand-tag">Terminal</span>
        </div>

        <div className="nav-links">
          <span className="nav-link active">Dashboard</span>
          <span className="nav-link" onClick={() => navigate('/chat')}>AI Analyst</span>
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

      {/* ── Page ── */}
      <div className="page">
        {loading ? (
          <div className="loading-state">
            <div className="loading-brand">MarketPulse</div>
            <div className="loading-track"><div className="loading-fill" /></div>
            <div className="loading-txt">Fetching live data…</div>
          </div>
        ) : <>

          {/* Page header */}
          <Reveal delay={0}>
            <div className="page-header">
              <div className="page-header-left">
                <div className="page-eyebrow">Market Overview</div>
                <h1 className="page-title">Pulse Check!<br /><em>here's your briefing.</em></h1>
                <p className="page-sub">{dateStr} · Real-time prices · AI-powered analysis</p>
              </div>
              <div className="header-stats">
                <div className="hstat">
                  <div className="hstat-label">Assets</div>
                  <div className="hstat-val gold">{crypto.length + stocks.length}</div>
                </div>
                <div className="hstat">
                  <div className="hstat-label">Gainers</div>
                  <div className="hstat-val green">
                    {[...crypto, ...stocks].filter(a => {
                      const p = a.change_percent || String(a.change_24h)
                      return !String(p).startsWith('-')
                    }).length}
                  </div>
                </div>
                <div className="hstat">
                  <div className="hstat-label">Status</div>
                  <div className="hstat-val green" style={{ fontSize: 14 }}>Open</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Summary cards */}
          <Reveal delay={60}>
            <div className="summary-row">
              <div className="sum-card">
                <div className="sum-icon gold">📊</div>
                <div>
                  <div className="sum-lbl">Total Assets</div>
                  <div className="sum-val">{crypto.length + stocks.length}</div>
                  <div className="sum-sub">Across crypto & equities</div>
                </div>
              </div>
              <div className="sum-card">
                <div className="sum-icon green">↑</div>
                <div>
                  <div className="sum-lbl">Gainers Today</div>
                  <div className="sum-val" style={{ color: '#2D7D46' }}>
                    {[...crypto, ...stocks].filter(a => !String(a.change_percent || a.change_24h).startsWith('-')).length}
                  </div>
                  <div className="sum-sub">Positive movement</div>
                </div>
              </div>
              <div className="sum-card">
                <div className="sum-icon red">↓</div>
                <div>
                  <div className="sum-lbl">Decliners Today</div>
                  <div className="sum-val" style={{ color: '#C0392B' }}>
                    {[...crypto, ...stocks].filter(a => String(a.change_percent || a.change_24h).startsWith('-')).length}
                  </div>
                  <div className="sum-sub">Negative movement</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* AI Insight */}
          <Reveal delay={100}>
            <div className="insight">
              <div className="insight-icon">✦</div>
              <div style={{ flex: 1 }}>
                <div className="insight-label">
                  <span className="live-dot" style={{ width: 5, height: 5, marginRight: 0 }} />
                  AI Market Insight — Today
                </div>
                {insightLoading
                  ? <div className="insight-placeholder">Analyzing market conditions_</div>
                  : <div className="insight-text">{insight}</div>
                }
              </div>
            </div>
          </Reveal>

          {/* Crypto */}
          <Reveal delay={130}>
            <div className="sec-row">
              <span className="sec-title">Cryptocurrency</span>
              <div className="sec-line" />
              <span className="sec-count">{crypto.length} assets</span>
            </div>
            <div className="cards-grid">
              {crypto.map((c, i) => {
                const up = c.change_24h >= 0
                return (
                  <Reveal key={i} delay={150 + i * 35}>
                    <div className="pcard">
                      <div className="pcard-top">
                        <span className="pcard-asset">{c.asset}</span>
                        <span className={`pcard-badge ${up ? 'up' : 'dn'}`}>
                          {up ? '+' : ''}{c.change_24h?.toFixed(2)}%
                        </span>
                      </div>
                      <div className="pcard-price">
                        <sup>$</sup><TickerPrice value={c.price} />
                      </div>
                      <Spark positive={up} />
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </Reveal>

          {/* Stocks */}
          <Reveal delay={200}>
            <div className="sec-row">
              <span className="sec-title">Equities</span>
              <div className="sec-line" />
              <span className="sec-count">{stocks.length} assets</span>
            </div>
            <div className="cards-grid">
              {stocks.map((s, i) => {
                const up = !s.change_percent?.startsWith('-')
                return (
                  <Reveal key={i} delay={220 + i * 35}>
                    <div className="pcard">
                      <div className="pcard-top">
                        <span className="pcard-asset">{s.asset}</span>
                        <span className={`pcard-badge ${up ? 'up' : 'dn'}`}>{s.change_percent}</span>
                      </div>
                      <div className="pcard-price">
                        <sup>$</sup><TickerPrice value={s.price} />
                      </div>
                      <Spark positive={up} />
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </Reveal>

          {/* Charts */}
          <Reveal delay={260}>
            <div className="sec-row">
              <span className="sec-title">Price Overview</span>
              <div className="sec-line" />
              <span className="sec-count">24h snapshot</span>
            </div>
            <div className="charts-row">
              <div className="chart-card">
                <div className="chart-head">
                  <span className="chart-ttl">Cryptocurrency</span>
                  <span className="chart-tag">Line · 24h</span>
                </div>
                <ResponsiveContainer width="100%" height={230}>
                  <AreaChart data={cryptoChart}>
                    <defs>
                      <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C8A84B" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#C8A84B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.04)" />
                    <XAxis dataKey="name" stroke="transparent"
                      tick={{ fill: '#B09A7A', fontFamily: "'Geist Mono',monospace", fontSize: 10 }} />
                    <YAxis stroke="transparent"
                      tick={{ fill: '#B09A7A', fontFamily: "'Geist Mono',monospace", fontSize: 10 }} />
                    <Tooltip content={<ChartTip />} />
                    <Area type="monotone" dataKey="price" stroke="#C8A84B" strokeWidth={2}
                      fill="url(#cg)"
                      dot={{ fill: '#C8A84B', r: 4, strokeWidth: 2, stroke: '#FFFDF8' }}
                      activeDot={{ r: 6, fill: '#9A7B3C', stroke: '#FFFDF8', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <div className="chart-head">
                  <span className="chart-ttl">Equities</span>
                  <span className="chart-tag">Bar · Current</span>
                </div>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={stockChart} barSize={24}>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.04)" vertical={false} />
                    <XAxis dataKey="name" stroke="transparent"
                      tick={{ fill: '#B09A7A', fontFamily: "'Geist Mono',monospace", fontSize: 10 }} />
                    <YAxis stroke="transparent"
                      tick={{ fill: '#B09A7A', fontFamily: "'Geist Mono',monospace", fontSize: 10 }} />
                    <Tooltip content={<ChartTip />} />
                    <Bar dataKey="price" radius={[5, 5, 0, 0]}>
                      {stockChart.map((e, i) => (
                        <Cell key={i} fill={e.down ? '#DFA09A' : '#8ECC9A'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Reveal>

          {/* Footer */}
          <div className="footer">
            <span className="footer-brand">MarketPulse</span>
            <span className="footer-txt">For informational purposes only · Not financial advice</span>
            <span className="footer-txt" style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: '#C8BBA8' }}>
              {dateStr}
            </span>
          </div>

        </>}
      </div>
    </div>
  )
}