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
        .badge-text { 
          font-size: 11px; 
          color: #F5D97E; 
          letter-spacing: 0.12em; 
          text-transform: uppercase; 
        }

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
          padding: 14px 32px; 
          background: #F5D97E; 
          color: #0D0818; 
          border: none; 
          border-radius: 8px; 
          font-size: 14px; 
          font-weight: 500; 
          cursor: pointer; 
          transition: opacity 0.2s; 
        }
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
  transition: opacity 0.2s; 
}
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
.btn-secondary:hover { border-color: #F5D97E; color: #F5D97E; }

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
      `}</style>

      <div className="nav">
  <span className="nav-logo">MarketPulse</span>
  <span onClick={() => navigate('/about')} style={{ fontSize: '13px', color: 'rgba(240,234,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em' }}>About</span>
</div>

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

    </div>
  )
}

export default Landing