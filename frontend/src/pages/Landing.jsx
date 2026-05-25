import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()
  const [displayed, setDisplayed] = useState('')
  const [showContent, setShowContent] = useState(false)
  const fullText = 'MarketPulse'

  useEffect(() => {
    let i = 0
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setDisplayed(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typing)
        setTimeout(() => setShowContent(true), 400)
      }
    }, 100)
    return () => clearInterval(typing)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0D0818', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,700&family=Playfair+Display:wght@700;900&family=Inter:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 60px;
          position: relative;
          z-index: 10;
          border-bottom: 0.5px solid rgba(139,92,246,0.15);
        }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 700;
          font-style: italic;
          color: #F5D97E;
          letter-spacing: 0.04em;
        }
        .nav-about {
          font-size: 13px;
          color: rgba(240,234,255,0.5);
          cursor: pointer;
          fontFamily: 'Inter, sans-serif';
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }
        .nav-about:hover { color: #F5D97E; }

        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 80px);
          align-items: center;
          padding: 0 60px;
          position: relative;
          z-index: 2;
        }

        .hero-left { display: flex; flex-direction: column; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(245,217,126,0.08);
          border: 0.5px solid rgba(245,217,126,0.3);
          border-radius: 20px;
          padding: 6px 16px;
          margin-bottom: 28px;
          width: fit-content;
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #F5D97E;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .badge-text { font-size: 11px; color: #F5D97E; letter-spacing: 0.12em; text-transform: uppercase; }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 72px;
          font-weight: 900;
          color: #F0EAFF;
          line-height: 1.0;
          margin-bottom: 12px;
        }
        .hero-title-accent { color: #F5D97E; }

        .hero-sub {
          font-size: 15px;
          color: rgba(240,234,255,0.7);
          line-height: 1.8;
          margin-bottom: 40px;
          max-width: 380px;
        }

        .hero-btns { display: flex; gap: 14px; }
        .btn-primary {
          padding: 14px 36px;
          background: #F5D97E;
          color: #0D0818;
          border: none;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(245,217,126,0.3);
        }
        .btn-primary:hover { opacity: 0.85; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(245,217,126,0.4); }

        .btn-secondary {
          padding: 14px 36px;
          background: transparent;
          color: #F0EAFF;
          border: 1px solid rgba(245,217,126,0.4);
          border-radius: 50px;
          font-size: 14px;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: #F5D97E; color: #F5D97E; transform: translateY(-2px); }

        .hero-right {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .glow-behind {
          position: absolute;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%);
        }
        .coin-img {
          width: 380px; height: 380px;
          object-fit: contain;
          position: relative;
          z-index: 2;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 20px 40px rgba(245,217,126,0.25));
        }
        @keyframes float {
          0%,100%{transform:translateY(0px)}
          50%{transform:translateY(-20px)}
        }

        .price-tag {
          position: absolute;
          z-index: 3;
          background: #F0EAFF;
          border-radius: 10px;
          padding: 10px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .price-tag.btc { top: 20%; right: 5%; }
        .price-tag.eth { bottom: 25%; left: 5%; }
        .price-tag-name { font-size: 10px; color: #666; margin-bottom: 2px; }
        .price-tag-val { font-size: 15px; font-weight: 500; color: #0D0818; }
        .price-tag-chg { font-size: 11px; color: #276B45; }

        .fadeIn { animation: fadeIn 0.8s ease forwards; }
        @keyframes fadeIn {
          from{opacity:0;transform:translateY(16px)}
          to{opacity:1;transform:translateY(0)}
        }

        /* Features Section */
        .features-section {
          padding: 80px 60px;
          background: #0D0818;
          overflow: visible;
        }

        .section-tag {
          font-size: 11px;
          color: #F5D97E;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 16px;
        }

        .section-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-style: italic;
          color: #F0EAFF;
          text-align: center;
          margin-bottom: 52px;
          line-height: 1.2;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          background: #13102A;
          border: 0.5px solid rgba(139,92,246,0.2);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(245,217,126,0.1) inset;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #F5D97E, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(245,217,126,0.3);
          border-color: rgba(245,217,126,0.3);
        }
        .feature-card:hover::before { opacity: 1; }

        .feature-icon-wrap {
          width: 48px; height: 48px;
          background: rgba(245,217,126,0.08);
          border: 0.5px solid rgba(245,217,126,0.2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .feature-title {
          font-size: 16px;
          font-weight: 500;
          color: #F0EAFF;
          margin-bottom: 10px;
        }

        .feature-desc {
          font-size: 13px;
          color: rgba(240,234,255,0.45);
          line-height: 1.75;
        }

        /* Stats Section */
        .stats-section {
          padding: 60px;
          background: #13102A;
          border-top: 0.5px solid rgba(139,92,246,0.15);
          border-bottom: 0.5px solid rgba(139,92,246,0.15);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .stat-card {
          text-align: center;
          padding: 24px;
          background: rgba(245,217,126,0.04);
          border: 0.5px solid rgba(245,217,126,0.1);
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          transition: all 0.2s;
        }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: #F5D97E;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(240,234,255,0.45);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* CTA Section */
        .cta-section {
          padding: 100px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-glow {
          position: absolute;
          width: 600px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px;
          font-style: italic;
          color: #F0EAFF;
          margin-bottom: 16px;
          position: relative;
          z-index: 2;
        }

        .cta-sub {
          font-size: 15px;
          color: rgba(240,234,255,0.5);
          margin-bottom: 40px;
          position: relative;
          z-index: 2;
        }

        .cta-btn {
          padding: 16px 48px;
          background: #F5D97E;
          color: #0D0818;
          border: none;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.06em;
          transition: all 0.2s;
          box-shadow: 0 8px 32px rgba(245,217,126,0.35);
          position: relative;
          z-index: 2;
        }
        .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(245,217,126,0.45); }

        /* Footer */
        .footer {
          padding: 24px 60px;
          background: #13102A;
          border-top: 0.5px solid rgba(139,92,246,0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-style: italic;
          color: #F5D97E;
        }
        .footer-text {
          font-size: 12px;
          color: rgba(240,234,255,0.3);
        }
      `}</style>

      {/* Navbar */}
      <div className="nav">
        <span className="nav-logo">MarketPulse</span>
        <span className="nav-about" onClick={() => navigate('/about')}>About</span>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="hero-left">
          <div className="badge">
            <div className="badge-dot" />
            <span className="badge-text">Live AI · Real-time data</span>
          </div>
          <div className="hero-title">
            It's not just data.<br />It's <span className="hero-title-accent">{displayed}</span>
          </div>
          {showContent && (
            <>
              <p className="hero-sub fadeIn">Real-time stocks and crypto intelligence powered by AI. Ask questions, get insights, make smarter decisions.</p>
              <div className="hero-btns fadeIn">
                <button className="btn-primary" onClick={() => navigate('/register')}>Get started</button>
                <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
              </div>
            </>
          )}
        </div>

        <div className="hero-right">
          <div className="glow-behind" />
          <img src="/bitcoin.png" alt="Bitcoin" className="coin-img" />
          <div className="price-tag btc">
            <div className="price-tag-name">Bitcoin</div>
            <div className="price-tag-val">$70,560</div>
            <div className="price-tag-chg">+0.39%</div>
          </div>
          <div className="price-tag eth">
            <div className="price-tag-name">Ethereum</div>
            <div className="price-tag-val">$2,153</div>
            <div className="price-tag-chg">+0.90%</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="features-section">
        <p className="section-tag">What we offer</p>
        <h2 className="section-heading">Everything you need<br />to track the market</h2>
        <div className="features-grid">
          {[
            { icon: '📈', title: 'Live crypto prices', desc: 'Real-time Bitcoin, Ethereum, Solana and BNB prices fetched directly from CoinGecko API.' },
            { icon: '📊', title: 'Stock tracker', desc: 'Track AAPL, TSLA, MSFT and GOOGL with live price updates from Alpha Vantage.' },
            { icon: '🤖', title: 'AI market agent', desc: 'Ask our LangChain + Llama AI agent anything. It reads real data from our database before answering.' },
            { icon: '💬', title: 'Smart chat', desc: 'Full chat interface powered by Groq. Ask investment questions and get intelligent answers instantly.' },
            { icon: '🔐', title: 'Secure accounts', desc: 'JWT authentication with bcrypt password hashing. Your data is always safe and protected.' },
            { icon: '⚡', title: 'Fast & reliable', desc: 'Built on FastAPI with MongoDB. Blazing fast responses with efficient data storage.' },
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon-wrap">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-section">
        {[
          { num: '4+', label: 'Live crypto assets' },
          { num: '4+', label: 'Stock symbols' },
          { num: 'AI', label: 'Powered agent' },
          { num: '24/7', label: 'Market data' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-glow" />
        <div className="cta-title">Ready to pulse<br />with the market?</div>
        <p className="cta-sub">Join MarketPulse and start making smarter investment decisions today.</p>
        <button className="cta-btn" onClick={() => navigate('/register')}>Get started for free</button>
      </div>

      {/* Footer */}
      <div className="footer">
        <span className="footer-logo">MarketPulse</span>
        <span className="footer-text">Built by Abie · 2026</span>
      </div>

    </div>
  )
}

export default Landing