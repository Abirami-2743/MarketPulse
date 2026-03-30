import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import api from '../api'

function Dashboard() {
  const navigate = useNavigate()
  const [crypto, setCrypto] = useState([])
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [insight, setInsight] = useState('')
  const [insightLoading, setInsightLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      await api.get('/market/fetch')
      const cryptoRes = await api.get('/market/crypto')
      const stockRes = await api.get('/market/stocks')
      setCrypto(cryptoRes.data.crypto)
      setStocks(stockRes.data.stocks)

      const insightRes = await api.post('/agent/ask', {
        question: 'Give me a 2-3 sentence market summary for today based on current prices. Be concise and friendly.'
      })
      setInsight(insightRes.data.answer)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
    setInsightLoading(false)
  }

  const cryptoChartData = crypto.map((c) => ({
    name: c.asset,
    price: c.price
  }))

  const stockChartData = stocks.map((s) => ({
    name: s.asset,
    price: s.price,
    down: s.change_percent?.startsWith('-')
  }))

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
          letter-spacing: 0.03em;
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

        .body { padding: 32px 40px; background: #0D0818; }

        .insight-card {
          background: #13102A;
          border: 0.5px solid rgba(245,217,126,0.25);
          border-left: 3px solid #F5D97E;
          border-radius: 14px;
          padding: 20px 24px;
          margin-bottom: 32px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .insight-icon {
          width: 38px; height: 38px;
          background: rgba(245,217,126,0.08);
          border: 0.5px solid rgba(245,217,126,0.25);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .insight-label {
          font-size: 11px;
          color: #F5D97E;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .insight-text { font-size: 14px; color: rgba(240,234,255,0.8); line-height: 1.7; }
        .insight-loading { font-size: 13px; color: rgba(240,234,255,0.4); font-style: italic; }

        .charts-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 11px;
          color: rgba(240,234,255,0.7);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 32px;
        }
        .price-card {
          background: #13102A;
          border: 0.5px solid rgba(245,217,126,0.15);
          border-left: 2px solid #F5D97E;
          border-radius: 14px;
          padding: 20px;
          transition: all 0.2s;
        }
        .price-card:hover {
          border-color: rgba(245,217,126,0.4);
          border-left-color: #F5D97E;
          transform: translateY(-2px);
        }
        .card-name {
          font-size: 12px;
          color: rgba(240,234,255,0.7);
          margin-bottom: 8px;
          text-transform: capitalize;
          letter-spacing: 0.04em;
        }
        .card-price { font-size: 22px; font-weight: 500; color: #FFFFFF; margin-bottom: 6px; }
        .card-up { font-size: 12px; color: #4ADE80; }
        .card-down { font-size: 12px; color: #F87171; }

        .chart-box {
          background: #13102A;
          border: 0.5px solid rgba(139,92,246,0.2);
          border-radius: 14px;
          padding: 24px;
        }
        .chart-title { font-size: 14px; font-weight: 500; color: #FFFFFF; margin-bottom: 20px; }
        .loading-text {
          color: rgba(240,234,255,0.4);
          font-size: 14px;
          text-align: center;
          padding: 60px;
        }
      `}</style>

      <div className="navbar">
        <span className="nav-logo" onClick={() => navigate('/')}>MarketPulse</span>
        <div className="nav-links">
          <span className="nav-link active">Dashboard</span>
          <span className="nav-link" onClick={() => navigate('/chat')}>AI Chat</span>
          <span className="nav-link" onClick={() => navigate('/about')}>About</span>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>Logout</button>
        </div>
      </div>

      <div className="body">
        {loading ? (
          <p className="loading-text">Loading market data...</p>
        ) : (
          <>
            {/* AI Insight Card */}
            <div className="insight-card">
              <div className="insight-icon">🤖</div>
              <div>
                <div className="insight-label">AI Market Insight — Today</div>
                {insightLoading ? (
                  <div className="insight-loading">Analyzing market data...</div>
                ) : (
                  <div className="insight-text">{insight}</div>
                )}
              </div>
            </div>

            {/* Crypto */}
            <p className="section-title">Crypto prices</p>
            <div className="cards-grid">
              {crypto.map((c, i) => (
                <div className="price-card" key={i}>
                  <div className="card-name">{c.asset}</div>
                  <div className="card-price">${c.price.toLocaleString()}</div>
                  <div className={c.change_24h >= 0 ? 'card-up' : 'card-down'}>
                    {c.change_24h >= 0 ? '+' : ''}{c.change_24h.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>

            {/* Stocks */}
            <p className="section-title">Stock prices</p>
            <div className="cards-grid">
              {stocks.map((s, i) => (
                <div className="price-card" key={i}>
                  <div className="card-name">{s.asset}</div>
                  <div className="card-price">${s.price.toLocaleString()}</div>
                  <div className={s.change_percent?.startsWith('-') ? 'card-down' : 'card-up'}>
                    {s.change_percent}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Side by Side */}
            <p className="section-title">Price overview</p>
            <div className="charts-row">

              {/* Crypto Line Chart */}
              <div className="chart-box">
                <div className="chart-title">Crypto prices</div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={cryptoChartData}>
                    <XAxis dataKey="name" stroke="rgba(240,234,255,0.2)" fontSize={12} tick={{ fill: 'rgba(240,234,255,0.5)' }} />
                    <YAxis stroke="rgba(240,234,255,0.2)" fontSize={12} tick={{ fill: 'rgba(240,234,255,0.5)' }} />
                    <Tooltip contentStyle={{ background: '#13102A', border: '0.5px solid rgba(245,217,126,0.2)', color: '#F0EAFF', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="price" stroke="#F5D97E" strokeWidth={2} dot={{ fill: '#F5D97E', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stock Bar Chart */}
              <div className="chart-box">
                <div className="chart-title">Stock prices</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stockChartData}>
                    <XAxis dataKey="name" stroke="rgba(240,234,255,0.2)" fontSize={12} tick={{ fill: 'rgba(240,234,255,0.5)' }} />
                    <YAxis stroke="rgba(240,234,255,0.2)" fontSize={12} tick={{ fill: 'rgba(240,234,255,0.5)' }} />
                    <Tooltip contentStyle={{ background: '#13102A', border: '0.5px solid rgba(245,217,126,0.2)', color: '#F0EAFF', borderRadius: '8px' }} />
                    <Bar dataKey="price" radius={[6, 6, 0, 0]}>
                      {stockChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.down ? '#F87171' : '#4ADE80'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard