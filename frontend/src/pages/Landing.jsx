import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

const FEATURES = [
  { icon: '📈', title: 'Live Crypto Prices', desc: 'Real-time Bitcoin, Ethereum, Solana and BNB prices fetched directly from CoinGecko API every 15 minutes.' },
  { icon: '📊', title: 'Stock Intelligence', desc: 'Track AAPL, TSLA, MSFT and GOOGL with live price data and change indicators from Alpha Vantage.' },
  { icon: '🤖', title: 'AI Market Agent', desc: 'Ask our LangChain + Llama AI agent anything. It reads real-time data from our database before answering.' },
  { icon: '⚠️', title: 'Risk Assessment', desc: 'Instant HIGH / MEDIUM / LOW risk ratings for every asset based on live 24h price movements.' },
  { icon: '🔐', title: 'Secure Accounts', desc: 'JWT authentication with bcrypt password hashing. Your data and portfolio are always safe.' },
  { icon: '⚡', title: 'Blazing Fast', desc: 'Built on FastAPI with MongoDB and background schedulers. Sub-second responses, always fresh data.' },
]

const STATS = [
  { num: '8+', label: 'Live assets tracked' },
  { num: 'AI', label: 'Powered analysis' },
  { num: '15m', label: 'Data refresh cycle' },
  { num: '24/7', label: 'Market coverage' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [displayed, setDisplayed] = useState('')
  const [showContent, setShowContent] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cryptoPrices, setCryptoPrices] = useState({ bitcoin: null, ethereum: null })
  const [now, setNow] = useState(new Date())
  const fullText = 'MarketPulse'

  useScrollReveal()

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      if (i < fullText.length) { setDisplayed(fullText.slice(0, i + 1)); i++ }
      else { clearInterval(t); setTimeout(() => setShowContent(true), 300) }
    }, 90)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(t) }
  }, [])

  useEffect(() => {
    api.get('/market/crypto').then(res => {
      const data = res.data.crypto
      const btc = data.find(c => c.asset === 'bitcoin')
      const eth = data.find(c => c.asset === 'ethereum')
      if (btc || eth) setCryptoPrices({ bitcoin: btc, ethereum: eth })
    }).catch(() => {})
  }, [])

  const btc = cryptoPrices.bitcoin
  const eth = cryptoPrices.ethereum
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

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

        /* ── Scroll reveal ── */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1); }
        .reveal.revealed { opacity: 1; transform: none; }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }
        .reveal-d4 { transition-delay: 0.4s; }
        .reveal-d5 { transition-delay: 0.5s; }

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
          font-size: 22px; font-weight: 700; color: #1A1612;
          letter-spacing: -0.03em;
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
          background: none; border: none; font-family: inherit;
        }
        .nav-link:hover { background: rgba(0,0,0,0.04); color: #1A1612; }

        .nav-right { display: flex; align-items: center; gap: 12px; }

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

        .btn-signin {
          font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 8px 18px; border-radius: 8px;
          border: 1px solid #DDD5C5; background: transparent; color: #7A6E62;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-signin:hover { border-color: #1A1612; color: #1A1612; background: rgba(0,0,0,0.03); }

        .btn-cta {
          font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 8px 20px; border-radius: 8px;
          border: 1px solid #1A1612; background: #1A1612; color: #F7F4EE;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-cta:hover { background: #2C2420; box-shadow: 0 4px 16px rgba(0,0,0,0.15); }

        /* ── Hero ── */
        .hero {
          min-height: calc(100vh - 62px);
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 80px 48px 80px;
          position: relative; overflow: hidden;
          max-width: 1400px; margin: 0 auto;
        }

        /* Subtle ruled-paper lines in background */
        .hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 47px, rgba(200,168,75,0.06) 47px, rgba(200,168,75,0.06) 48px
          );
          z-index: 0;
        }

        .hero-left { position: relative; z-index: 2; }

        .eyebrow-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: #FFFDF8;
          border: 1px solid #DDD5C5;
          border-radius: 50px; padding: 6px 16px;
          margin-bottom: 28px;
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.15em; text-transform: uppercase;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(40px, 5vw, 68px);
          font-weight: 700; line-height: 1.08;
          color: #1A1612; letter-spacing: -0.03em;
          margin-bottom: 10px;
        }
        .hero-title-gold { color: #9A7B3C; font-style: italic; }
        .cursor {
          display: inline-block; width: 3px; height: 0.8em;
          background: #9A7B3C; margin-left: 2px;
          vertical-align: middle; border-radius: 2px;
          animation: blink 0.8s step-end infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .hero-sub {
          font-size: 15px; color: #9E9485; line-height: 1.8;
          max-width: 420px; margin-bottom: 40px; font-weight: 300;
          opacity: 0; transform: translateY(14px);
          animation: fadeUp 0.6s ease 0.2s forwards;
        }
        .hero-actions {
          display: flex; gap: 12px;
          opacity: 0; transform: translateY(14px);
          animation: fadeUp 0.6s ease 0.4s forwards;
        }
        @keyframes fadeUp { to { opacity: 1; transform: none; } }

        .btn-hero-primary {
          padding: 14px 36px; background: #1A1612; color: #F7F4EE;
          border: none; border-radius: 10px; font-size: 13px;
          font-weight: 600; cursor: pointer; letter-spacing: 0.06em;
          text-transform: uppercase; font-family: inherit;
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.2); background: #2C2420; }

        .btn-hero-ghost {
          padding: 14px 36px; background: transparent; color: #7A6E62;
          border: 1px solid #DDD5C5; border-radius: 10px; font-size: 13px;
          font-weight: 500; cursor: pointer; letter-spacing: 0.04em;
          font-family: inherit; transition: all 0.25s;
        }
        .btn-hero-ghost:hover { border-color: #1A1612; color: #1A1612; background: rgba(0,0,0,0.02); transform: translateY(-2px); }

        /* ── Hero Right — ticker cards ── */
        .hero-right {
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          height: 440px;
        }

        .mock-dashboard {
          background: #FFFDF8;
          border: 1px solid #E8E0CF;
          border-radius: 20px;
          padding: 24px;
          width: 380px;
          box-shadow: 0 8px 48px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04);
          position: relative;
          animation: floatCard 5s ease-in-out infinite;
        }
        @keyframes floatCard { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

        .mock-top {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid #EEE8DC;
        }
        .mock-title { font-family: 'Playfair Display', serif; font-size: 14px; color: #1A1612; font-weight: 600; }
        .mock-badge {
          font-family: 'Geist Mono', monospace; font-size: 9px;
          color: #2D7D46; background: #EDFAF2; border: 1px solid #A8DEB8;
          border-radius: 50px; padding: 3px 8px; letter-spacing: 0.1em;
          display: flex; align-items: center; gap: 5px;
        }

        .mock-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 11px 0; border-bottom: 1px solid #F0EBE1;
        }
        .mock-row:last-child { border-bottom: none; }
        .mock-asset { font-family: 'Geist Mono', monospace; font-size: 11px; color: #7A6E62; letter-spacing: 0.1em; }
        .mock-price { font-family: 'Geist Mono', monospace; font-size: 14px; font-weight: 700; color: #1A1612; }
        .mock-up { font-family: 'Geist Mono', monospace; font-size: 10px; color: #2D7D46; background: #EDFAF2; border: 1px solid #B8DFC4; padding: 2px 7px; border-radius: 5px; }
        .mock-dn { font-family: 'Geist Mono', monospace; font-size: 10px; color: #C0392B; background: #FDF0EE; border: 1px solid #DFB8B4; padding: 2px 7px; border-radius: 5px; }

        .mock-insight {
          margin-top: 14px;
          background: #F7F4EE;
          border: 1px solid #E0D8CC;
          border-left: 3px solid #C8A84B;
          border-radius: 8px;
          padding: 10px 14px;
        }
        .mock-insight-lbl { font-family: 'Geist Mono', monospace; font-size: 8px; color: #B09A7A; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 5px; }
        .mock-insight-txt { font-size: 11px; color: #7A6E62; line-height: 1.6; }

        /* Floating accent card */
        .float-card {
          position: absolute;
          background: #FFFDF8;
          border: 1px solid #E8E0CF;
          border-radius: 12px;
          padding: 12px 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          font-family: 'Geist Mono', monospace;
        }
        .float-card.risk { bottom: 30px; left: -50px; animation: floatCard2 5s ease-in-out 1s infinite; }
        .float-card.trend { top: 20px; right: -40px; animation: floatCard2 5s ease-in-out 2.5s infinite; }
        @keyframes floatCard2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .fc-lbl { font-size: 8px; color: #B09A7A; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 5px; }
        .fc-val { font-size: 16px; font-weight: 700; color: #1A1612; }
        .fc-sub { font-size: 10px; color: #9E9485; margin-top: 3px; }

        /* ── Divider ── */
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #DDD5C5, #C8A84B40, #DDD5C5, transparent);
          margin: 0 48px;
        }

        /* ── Page body ── */
        .page { max-width: 1400px; margin: 0 auto; padding: 0 48px; }

        /* ── Section eyebrow ── */
        .sec-eyebrow {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.2em; text-transform: uppercase;
          text-align: center; margin-bottom: 12px;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .sec-eyebrow::before, .sec-eyebrow::after {
          content: ''; flex: 1; max-width: 60px; height: 1px; background: #DDD5C5;
        }

        .sec-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700; color: #1A1612;
          text-align: center; margin-bottom: 12px; line-height: 1.15;
          letter-spacing: -0.02em;
        }
        .sec-sub {
          font-size: 14px; color: #9E9485;
          text-align: center; max-width: 440px;
          margin: 0 auto 52px; line-height: 1.75; font-weight: 300;
        }

        /* ── Features ── */
        .features-section { padding: 90px 0; }

        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .feature-card {
          background: #FFFDF8;
          border: 1px solid #E8E0CF;
          border-radius: 14px; padding: 28px 26px;
          transition: all 0.3s cubic-bezier(0.23,1,.32,1);
          position: relative; overflow: hidden;
        }
        .feature-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #C8A84B, #E8CC7A, #C8A84B);
          opacity: 0; transition: opacity 0.3s;
        }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.07); border-color: #D4C5A8; }
        .feature-card:hover::before { opacity: 1; }

        .feat-icon {
          width: 48px; height: 48px;
          background: rgba(200,168,75,0.08);
          border: 1px solid rgba(200,168,75,0.2);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 18px;
        }
        .feat-title {
          font-size: 15px; font-weight: 600; color: #1A1612;
          margin-bottom: 8px; letter-spacing: -0.01em;
        }
        .feat-desc { font-size: 13px; color: #9E9485; line-height: 1.75; font-weight: 300; }

        /* ── Stats ── */
        .stats-section {
          background: #FFFDF8;
          border: 1px solid #E8E0CF;
          border-radius: 20px; padding: 48px;
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 32px; margin-bottom: 0;
          position: relative; overflow: hidden;
        }
        .stats-section::before {
          content: ''; position: absolute; inset: 0;
          background: repeating-linear-gradient(
            90deg, transparent, transparent 1px, rgba(200,168,75,0.03) 1px, rgba(200,168,75,0.03) 2px
          );
          background-size: 48px; pointer-events: none;
        }

        .stat-item { text-align: center; position: relative; }
        .stat-item:not(:last-child)::after {
          content: ''; position: absolute; right: 0; top: 15%; bottom: 15%;
          width: 1px; background: #E8E0CF;
        }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 48px; font-weight: 700; color: #9A7B3C;
          line-height: 1; margin-bottom: 10px; letter-spacing: -0.02em;
        }
        .stat-label {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #B09A7A;
          letter-spacing: 0.14em; text-transform: uppercase;
        }

        /* ── CTA ── */
        .cta-section {
          padding: 100px 0; text-align: center;
        }
        .cta-inner {
          background: #1A1612;
          border-radius: 24px;
          padding: 72px 48px;
          position: relative; overflow: hidden;
        }
        .cta-inner::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            radial-gradient(ellipse 60% 50% at 30% 50%, rgba(200,168,75,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 80% 20%, rgba(200,168,75,0.06) 0%, transparent 50%);
          pointer-events: none;
        }
        .cta-eyebrow {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: #9A7B3C;
          letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 20px; display: block;
        }
        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 4.5vw, 52px);
          font-weight: 700; color: #F7F4EE;
          line-height: 1.1; margin-bottom: 16px;
          position: relative; z-index: 2;
          letter-spacing: -0.02em;
        }
        .cta-title em { color: #C8A84B; font-style: italic; }
        .cta-sub {
          font-size: 15px; color: rgba(247,244,238,0.45);
          margin-bottom: 44px; max-width: 400px;
          margin-left: auto; margin-right: auto;
          line-height: 1.75; font-weight: 300;
          position: relative; z-index: 2;
        }
        .cta-actions { display: flex; gap: 12px; justify-content: center; position: relative; z-index: 2; }
        .btn-cta-main {
          padding: 15px 44px; background: #C8A84B; color: #1A1612;
          border: none; border-radius: 10px; font-size: 13px;
          font-weight: 700; cursor: pointer; letter-spacing: 0.06em;
          text-transform: uppercase; font-family: inherit;
          transition: all 0.25s;
          box-shadow: 0 4px 24px rgba(200,168,75,0.35);
        }
        .btn-cta-main:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(200,168,75,0.5); background: #D4B455; }
        .btn-cta-ghost {
          padding: 15px 44px; background: transparent; color: rgba(247,244,238,0.6);
          border: 1px solid rgba(247,244,238,0.15); border-radius: 10px; font-size: 13px;
          font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.25s;
        }
        .btn-cta-ghost:hover { border-color: rgba(247,244,238,0.35); color: #F7F4EE; transform: translateY(-2px); }

        /* ── Footer ── */
        .footer {
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 48px;
          border-top: 1px solid #E8E0CF;
          background: rgba(247,244,238,0.88);
          backdrop-filter: blur(20px);
        }
        .footer-brand { font-family:'Playfair Display',serif; font-size:18px; font-weight:700; color:#1A1612; }
        .footer-links { display: flex; gap: 4px; }
        .footer-link {
          padding: 6px 14px; font-size: 13px; color: #7A6E62;
          cursor: pointer; transition: color 0.2s;
          background: none; border: none; font-family: inherit; border-radius: 7px;
        }
        .footer-link:hover { color: #1A1612; background: rgba(0,0,0,0.04); }
        .footer-copy { font-family: 'Geist Mono', monospace; font-size: 10px; color: #C8BBA8; letter-spacing: 0.08em; }

        @media (max-width: 900px) {
          .nav { padding: 0 24px; }
          .hero { grid-template-columns: 1fr; padding: 60px 24px; text-align: center; }
          .hero-right { display: none; }
          .hero-sub { max-width: 100%; }
          .hero-actions { justify-content: center; }
          .eyebrow-badge { margin: 0 auto 28px; }
          .page { padding: 0 24px; }
          .section-divider { margin: 0 24px; }
          .features-grid { grid-template-columns: 1fr 1fr; }
          .stats-section { grid-template-columns: 1fr 1fr; }
          .footer { padding: 24px; flex-direction: column; gap: 14px; text-align: center; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr; }
          .stats-section { grid-template-columns: 1fr 1fr; }
          .stat-item::after { display: none; }
          .cta-inner { padding: 48px 24px; }
          .cta-actions { flex-direction: column; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`nav${scrolled ? ' elevated' : ''}`}>
        <div className="nav-brand" onClick={() => navigate('/')}>
          <span className="nav-brand-name">MarketPulse</span>
          <span className="nav-brand-tag">Terminal</span>
        </div>

        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('/about')}>About</button>
        </div>

        <div className="nav-right">
          <div className="live-badge">
            <span className="live-dot" />
            Live
          </div>
          <button className="btn-signin" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn-cta" onClick={() => navigate('/register')}>Get started</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-left">
          <div className="eyebrow-badge">
            <span className="live-dot" style={{ width: 5, height: 5 }} />
            Live AI · Real-time market data
          </div>

          <h1 className="hero-title">
            It's not just data.<br />
            It's{' '}
            <span className="hero-title-gold">{displayed}</span>
            {!showContent && <span className="cursor" />}
          </h1>

          {showContent && (
            <>
              <p className="hero-sub">
                Real-time stocks and crypto intelligence powered by AI. Ask questions, get structured risk analysis, make smarter decisions.
              </p>
              <div className="hero-actions">
                <button className="btn-hero-primary" onClick={() => navigate('/register')}>Start for free →</button>
                <button className="btn-hero-ghost" onClick={() => navigate('/login')}>Sign in</button>
              </div>
            </>
          )}
        </div>

        <div className="hero-right">
          {/* Floating accent cards */}
          <div className="float-card risk">
            <div className="fc-lbl">Risk level</div>
            <div className="fc-val" style={{ color: '#C0392B' }}>HIGH</div>
            <div className="fc-sub">BTC · 24h vol</div>
          </div>
          <div className="float-card trend">
            <div className="fc-lbl">Gainers today</div>
            <div className="fc-val" style={{ color: '#2D7D46' }}>6</div>
            <div className="fc-sub">of 8 assets</div>
          </div>

          {/* Mock dashboard card */}
          <div className="mock-dashboard">
            <div className="mock-top">
              <span className="mock-title">Market Overview</span>
              <div className="mock-badge">
                <span className="live-dot" style={{ width: 5, height: 5 }} />
                Live
              </div>
            </div>

            {[
              { asset: 'BTC', price: btc ? `$${btc.price.toLocaleString()}` : '$77,532', change: btc ? `${btc.change_24h >= 0 ? '+' : ''}${btc.change_24h?.toFixed(2)}%` : '+0.80%', up: btc ? btc.change_24h >= 0 : true },
              { asset: 'ETH', price: eth ? `$${eth.price.toLocaleString()}` : '$2,120', change: eth ? `${eth.change_24h >= 0 ? '+' : ''}${eth.change_24h?.toFixed(2)}%` : '-0.02%', up: eth ? eth.change_24h >= 0 : false },
              { asset: 'AAPL', price: '$211.40', change: '+1.23%', up: true },
              { asset: 'TSLA', price: '$248.90', change: '-0.87%', up: false },
            ].map((row, i) => (
              <div className="mock-row" key={i}>
                <span className="mock-asset">{row.asset}</span>
                <span className="mock-price">{row.price}</span>
                <span className={row.up ? 'mock-up' : 'mock-dn'}>{row.change}</span>
              </div>
            ))}

            <div className="mock-insight">
              <div className="mock-insight-lbl">✦ AI Insight</div>
              <div className="mock-insight-txt">Markets show cautious optimism as BTC consolidates above key support. Tech equities outperforming.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider" />

      {/* ── Features ── */}
      <div className="page">
        <section className="features-section">
          <p className="sec-eyebrow reveal">What we offer</p>
          <h2 className="sec-heading reveal reveal-d1">Everything you need<br />to track the market</h2>
          <p className="sec-sub reveal reveal-d2">One platform for live prices, AI analysis, and risk intelligence — no noise, just signal.</p>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`feature-card reveal reveal-d${Math.min(i + 1, 5)}`}>
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-title">{f.title}</div>
                <p className="feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="stats-section reveal" style={{ marginBottom: '90px' }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="cta-inner reveal">
            <span className="cta-eyebrow">Get started today</span>
            <h2 className="cta-title reveal reveal-d1">
              Ready to pulse<br />with the <em>market?</em>
            </h2>
            <p className="cta-sub reveal reveal-d2">
              Join MarketPulse and start making smarter investment decisions with real-time AI analysis.
            </p>
            <div className="cta-actions reveal reveal-d3">
              <button className="btn-cta-main" onClick={() => navigate('/register')}>Start for free →</button>
              <button className="btn-cta-ghost" onClick={() => navigate('/login')}>Sign in</button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="footer">
        <span className="footer-brand">MarketPulse</span>
        <div className="footer-links">
          <button className="footer-link" onClick={() => navigate('/about')}>About</button>
          <button className="footer-link" onClick={() => navigate('/login')}>Sign in</button>
          <button className="footer-link" onClick={() => navigate('/register')}>Register</button>
        </div>
        <span className="footer-copy">Built by Abie · 2026</span>
      </footer>
    </div>
  )
}