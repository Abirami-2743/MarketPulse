import { useNavigate } from 'react-router-dom'

function About() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0D0818', color: '#F0EAFF', fontFamily: 'Inter, sans-serif' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,700&family=Inter:wght@400;500&display=swap');

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 40px;
          background: #13102A;
          border-bottom: 0.5px solid rgba(139,92,246,0.2);
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

        .hero-section {
          text-align: center;
          padding: 80px 40px 60px;
          border-bottom: 0.5px solid rgba(139,92,246,0.15);
        }
        .about-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(245,217,126,0.08);
          border: 0.5px solid rgba(245,217,126,0.3);
          border-radius: 20px;
          padding: 6px 16px;
          margin-bottom: 24px;
        }
        .about-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #F5D97E; }
        .about-badge-text { font-size: 11px; color: #F5D97E; letter-spacing: 0.12em; text-transform: uppercase; }
        .about-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 60px;
          font-style: italic;
          color: #F5D97E;
          margin-bottom: 20px;
          line-height: 1.1;
        }
        .about-sub {
          font-size: 16px;
          color: rgba(240,234,255,0.55);
          max-width: 560px;
          margin: 0 auto 40px;
          line-height: 1.8;
        }
        .about-btns { display: flex; gap: 14px; justify-content: center; }
        .btn-primary {
          padding: 14px 32px;
          background: #F5D97E;
          color: #0D0818;
          border: none;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .btn-primary:hover { opacity: 0.85; }
        .btn-secondary {
          padding: 14px 32px;
          background: transparent;
          color: #F5D97E;
          border: 1px solid rgba(245,217,126,0.4);
          border-radius: 50px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .btn-secondary:hover { background: rgba(245,217,126,0.08); }

        .features-section {
          padding: 60px 40px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-label {
          font-size: 11px;
          color: rgba(240,234,255,0.4);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 40px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 60px;
        }
        .feature-card {
          background: #13102A;
          border: 0.5px solid rgba(139,92,246,0.2);
          border-top: 2px solid #F5D97E;
          border-radius: 14px;
          padding: 28px;
          transition: border-color 0.2s;
        }
        .feature-card:hover { border-color: rgba(245,217,126,0.4); border-top-color: #F5D97E; }
        .feature-icon {
          width: 40px; height: 40px;
          background: rgba(245,217,126,0.08);
          border: 0.5px solid rgba(245,217,126,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          font-size: 18px;
        }
        .feature-title { font-size: 15px; font-weight: 500; color: #F0EAFF; margin-bottom: 8px; }
        .feature-desc { font-size: 13px; color: rgba(240,234,255,0.45); line-height: 1.7; }

        .stack-section {
          background: #13102A;
          border-top: 0.5px solid rgba(139,92,246,0.15);
          border-bottom: 0.5px solid rgba(139,92,246,0.15);
          padding: 60px 40px;
          text-align: center;
        }
        .stack-grid {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 32px;
        }
        .stack-pill {
          padding: 8px 20px;
          background: rgba(245,217,126,0.06);
          border: 0.5px solid rgba(245,217,126,0.2);
          border-radius: 50px;
          font-size: 13px;
          color: #F5D97E;
          letter-spacing: 0.04em;
        }

        .builder-section { padding: 60px 40px; text-align: center; }
        .builder-card {
          background: #13102A;
          border: 0.5px solid rgba(139,92,246,0.2);
          border-radius: 20px;
          padding: 40px;
          max-width: 500px;
          margin: 0 auto;
        }
        .builder-avatar {
          width: 72px; height: 72px;
          background: rgba(245,217,126,0.1);
          border: 1px solid rgba(245,217,126,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 16px;
        }
        .builder-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-style: italic;
          color: #F5D97E;
          margin-bottom: 6px;
        }
        .builder-role {
          font-size: 12px;
          color: rgba(240,234,255,0.4);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .builder-desc { font-size: 13px; color: rgba(240,234,255,0.5); line-height: 1.7; }
      `}</style>

      <div className="navbar">
        <span className="nav-logo" onClick={() => navigate('/')}>MarketPulse</span>
        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</span>
          <span className="nav-link" onClick={() => navigate('/chat')}>AI Chat</span>
          <span className="nav-link active">About</span>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>Logout</button>
        </div>
      </div>

      <div className="hero-section">
        <div className="about-badge">
          <div className="about-badge-dot" />
          <span className="about-badge-text">About MarketPulse</span>
        </div>
        <div className="about-title">Intelligence meets<br />the market.</div>
        <p className="about-sub">MarketPulse is an AI-powered market intelligence platform that gives you real-time crypto and stock data, analyzed and explained by a smart AI agent.</p>
        <div className="about-btns">
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          <button className="btn-secondary" onClick={() => navigate('/chat')}>Try AI Chat</button>
        </div>
      </div>

      <div className="features-section">
        <p className="section-label">What we offer</p>
        <div className="features-grid">
          {[
            { icon: '📈', title: 'Live market data', desc: 'Real-time crypto and stock prices fetched from CoinGecko and Alpha Vantage APIs, updated every time you visit.' },
            { icon: '🤖', title: 'AI agent', desc: 'Ask our LangChain-powered AI agent anything about markets. It reads real data from our database before answering.' },
            { icon: '🔐', title: 'Secure auth', desc: 'JWT-based authentication with bcrypt password hashing. Your account and data are always protected.' },
            { icon: '💬', title: 'Smart chat', desc: 'A full chat interface powered by Llama AI through Groq. Ask investment questions and get intelligent answers.' },
            { icon: '📊', title: 'Price charts', desc: 'Visual price comparison charts built with Recharts, giving you a clear overview of market performance.' },
            { icon: '⚡', title: 'Fast backend', desc: 'Built on FastAPI with MongoDB — blazing fast API responses and efficient data storage.' },
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="stack-section">
        <p className="section-label">Built with</p>
        <div className="stack-grid">
          {['FastAPI', 'LangChain', 'Groq + Llama', 'MongoDB', 'React', 'CoinGecko API', 'Alpha Vantage', 'JWT Auth', 'Recharts'].map((s, i) => (
            <span className="stack-pill" key={i}>{s}</span>
          ))}
        </div>
      </div>

      <div className="builder-section">
        <p className="section-label">Built by</p>
        <div className="builder-card">
          <div className="builder-avatar">A</div>
          <div className="builder-name">Abie</div>
          <div className="builder-role">2nd Year CS Student · AI Engineer in the making</div>
          <p className="builder-desc">Built MarketPulse as a full stack AI project to combine real-time market data with intelligent AI agents. Passionate about building impactful products with AI.</p>
        </div>
      </div>

    </div>
  )
}

export default About