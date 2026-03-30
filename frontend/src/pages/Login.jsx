import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ height: '100vh', background: '#0D0818', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '24px', boxSizing: 'border-box' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,700&family=Inter:wght@400;500&display=swap');

        .card {
          display: flex;
          width: 100%;
          height: 100%;
          border-radius: 28px;
          overflow: hidden;
          border: 0.5px solid rgba(139,92,246,0.2);
        }

        .right {
          flex: 1;
          background: #1E0F3A;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 52px;
          text-align: center;
          position: relative;
          overflow: hidden;
          clip-path: ellipse(100% 100% at 15% 50%);
        }

        .right-glow {
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(245,217,126,0.08);
          top: -80px; right: -80px;
        }

        .right-glow2 {
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(139,92,246,0.1);
          bottom: -60px; left: -60px;
        }

        .right-coin {
          width: 150px; height: 150px;
          object-fit: contain;
          margin-bottom: 28px;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 12px 28px rgba(245,217,126,0.3));
          position: relative;
          z-index: 2;
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }

        .right-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-style: italic;
          color: #F5D97E;
          margin-bottom: 12px;
          position: relative;
          z-index: 2;
        }

        .right-sub {
          font-size: 13px;
          color: rgba(240,234,255,0.5);
          margin-bottom: 32px;
          line-height: 1.7;
          max-width: 220px;
          position: relative;
          z-index: 2;
        }

        .register-btn {
          padding: 12px 36px;
          background: transparent;
          color: #F5D97E;
          border: 1px solid rgba(245,217,126,0.4);
          border-radius: 50px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
          position: relative;
          z-index: 2;
        }
        .register-btn:hover { background: rgba(245,217,126,0.08); border-color: #F5D97E; }

        .left {
          flex: 1;
          background: #13102A;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 52px;
        }

        .split-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-style: italic;
          color: #F5D97E;
          margin-bottom: 36px;
          cursor: pointer;
        }

        .split-title {
          font-size: 26px;
          font-weight: 500;
          color: #F0EAFF;
          margin-bottom: 6px;
        }

        .split-sub {
          font-size: 13px;
          color: rgba(240,234,255,0.4);
          margin-bottom: 28px;
        }

        .field-label {
          display: block;
          font-size: 11px;
          color: rgba(240,234,255,0.8);
          margin-bottom: 7px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .field-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          color: #F0EAFF;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          margin-bottom: 20px;
          transition: border-color 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .field-input:focus { border-color: #F5D97E; }
        .field-input::placeholder { color: rgba(240,234,255,0.2); }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #F5D97E;
          color: #0D0818;
          border: none;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: opacity 0.2s;
          font-family: 'Inter', sans-serif;
          margin-top: 4px;
        }
        .submit-btn:hover { opacity: 0.85; }
        .submit-btn:disabled { opacity: 0.6; }
        .error-msg { color: #F87171; font-size: 13px; margin-bottom: 14px; }
      `}</style>

      <div className="card">
        {/* Left - Form */}
        <div className="left">
          <span className="split-logo" onClick={() => navigate('/')}>MarketPulse</span>
          <h2 className="split-title">Welcome back</h2>
          <p className="split-sub">Login to your MarketPulse account</p>

          {error && <p className="error-msg">{error}</p>}

          {['email', 'password'].map((field) => (
            <div key={field}>
              <label className="field-label">{field}</label>
              <input
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                value={form[field]}
                onChange={handleChange}
                className="field-input"
                placeholder={field === 'email' ? 'you@example.com' : '••••••••'}
              />
            </div>
          ))}

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {/* Right */}
        <div className="right">
          <div className="right-glow" />
          <div className="right-glow2" />
          <img src="/bitcoin.png" alt="Bitcoin" className="right-coin" />
          <h3 className="right-title">New here?</h3>
          <p className="right-sub">Create an account and start tracking markets with AI today!</p>
          <button className="register-btn" onClick={() => navigate('/register')}>Create Account</button>
        </div>
      </div>
    </div>
  )
}

export default Login