import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const FEATURES = [
  { icon: '📈', text: 'Live crypto & stock prices' },
  { icon: '✦',  text: 'AI-powered market analysis' },
  { icon: '📊', text: 'Visual price charts' },
  { icon: '🔐', text: 'Secure JWT authentication' },
]

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    const blockedDomains = ['example.com', 'test.com', 'fake.com', 'temp.com', 'mailinator.com', 'tempmail.com', 'throwaway.com']
    if (blockedDomains.includes(form.email.split('@')[1])) {
      setError('Please use a real email address.')
      setLoading(false)
      return
    }

    if (form.username.length < 3) {
      setError('Username must be at least 3 characters.')
      setLoading(false)
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    try {
      await api.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    }
    setLoading(false)
  }

  const fields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'your username' },
    { name: 'email',    label: 'Email address', type: 'text', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div style={{
      height: '100vh',
      background: '#F7F4EE',
      display: 'flex',
      fontFamily: "'Outfit', sans-serif",
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&family=Geist+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes scanFill  { from{transform:translateX(-100%)} to{transform:translateX(300%)} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer   {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* ── Left panel ── */
        .panel-left {
          width: 52%;
          background: #322a22;
          display: flex;
          flex-direction: column;
          padding: 52px 60px;
          position: relative;
          overflow: hidden;
        }

        /* radial glow */
        .panel-left::before {
          content:'';
          position:absolute; top:-140px; left:-100px;
          width:500px; height:500px; border-radius:50%;
          background: radial-gradient(circle, rgba(200,168,75,0.07) 0%, transparent 70%);
          pointer-events:none;
        }
        .panel-left::after {
          content:'';
          position:absolute; bottom:-100px; right:-80px;
          width:360px; height:360px; border-radius:50%;
          background: radial-gradient(circle, rgba(200,168,75,0.05) 0%, transparent 70%);
          pointer-events:none;
        }

        .left-brand {
          display: flex; align-items: baseline; gap: 10px;
          cursor: pointer; user-select: none;
          margin-bottom: 56px;
          position: relative; z-index: 2;
        }
        .left-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #F7F4EE; letter-spacing: -0.03em;
        }
        .left-brand-tag {
          font-family: 'Geist Mono', monospace;
          font-size: 9px; color: rgba(200,168,75,0.7);
          letter-spacing: 0.15em; text-transform: uppercase;
          border: 1px solid rgba(200,168,75,0.2);
          padding: 2px 7px; border-radius: 4px;
        }

        .left-eyebrow {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: rgba(200,168,75,0.6);
          letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 10px;
          position: relative; z-index: 2;
        }
        .left-eyebrow::before {
          content:''; display:inline-block;
          width:18px; height:1px; background:rgba(200,168,75,0.35);
        }

        .left-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(34px, 3.5vw, 48px);
          font-weight: 700; line-height: 1.08;
          letter-spacing: -0.04em;
          color: #F7F4EE; margin-bottom: 18px;
          position: relative; z-index: 2;
        }
        .left-title em { font-style: italic; color: #C8A84B; }

        .left-desc {
          font-size: 14px; color: rgba(247,244,238,0.45);
          line-height: 1.85; font-weight: 300;
          margin-bottom: 44px;
          position: relative; z-index: 2;
          max-width: 380px;
        }

        .feature-list {
          display: flex; flex-direction: column; gap: 14px;
          position: relative; z-index: 2;
          margin-bottom: 52px;
        }
        .feature-item {
          display: flex; align-items: center; gap: 14px;
        }
        .feature-icon-wrap {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink:0;
          background: rgba(200,168,75,0.08);
          border: 1px solid rgba(200,168,75,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .feature-text {
          font-size: 13px; color: rgba(247,244,238,0.6);
          font-weight: 400; letter-spacing: 0.01em;
        }

        .left-divider {
          height: 1px; background: rgba(247,244,238,0.07);
          margin-bottom: 24px;
          position: relative; z-index: 2;
        }

        .left-login-prompt {
          font-size: 13px; color: rgba(247,244,238,0.35);
          position: relative; z-index: 2;
          display: flex; align-items: center; gap: 10px;
        }
        .left-login-link {
          font-weight: 600; color: #C8A84B;
          cursor: pointer; letter-spacing: 0.04em;
          transition: opacity 0.2s;
        }
        .left-login-link:hover { opacity: 0.75; }

        /* ── Right panel ── */
        .panel-right {
          flex: 1;
          background: #F7F4EE;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 52px 60px;
          position: relative;
        }

        .form-shell {
          width: 100%; max-width: 380px;
          animation: fadeUp 0.6s ease both;
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
          color: #1A1612; letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
        .form-sub { font-size: 13px; color: #9E9485; margin-bottom: 32px; font-weight: 300; }

        .field-wrap { margin-bottom: 18px; }
        .field-label {
          display: block;
          font-family: 'Geist Mono', monospace;
          font-size: 9px; color: #B09A7A;
          letter-spacing: 0.18em; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .field-input {
          width: 100%;
          padding: 13px 16px;
          background: #FFFDF8;
          border: 1px solid #E0D8CC;
          border-radius: 10px;
          color: #1A1612; font-size: 14px;
          outline: none;
          font-family: 'Outfit', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: #C8BBA8; }
        .field-input:focus {
          border-color: #C8A84B;
          box-shadow: 0 0 0 3px rgba(200,168,75,0.12);
        }
        .field-input.focused { border-color: #C8A84B; }

        .error-banner {
          display: flex; align-items: flex-start; gap: 10px;
          background: #FDF0EE; border: 1px solid #DFB8B4;
          border-radius: 10px; padding: 12px 14px;
          margin-bottom: 18px; color: #C0392B;
          font-size: 13px; line-height: 1.5;
        }
        .error-icon { flex-shrink:0; margin-top:1px; }

        .submit-btn {
          width: 100%; padding: 14px;
          background: #1A1612; color: #F7F4EE;
          border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer; transition: all 0.22s;
          font-family: 'Outfit', sans-serif;
          margin-top: 6px;
          position: relative; overflow: hidden;
        }
        .submit-btn::after {
          content:'';
          position:absolute; inset:0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
          background-size: 200% 100%;
          opacity:0; transition:opacity 0.2s;
        }
        .submit-btn:hover:not(:disabled)::after { opacity:1; animation: shimmer 1.2s ease infinite; }
        .submit-btn:hover:not(:disabled) { background: #2D2520; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
        .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        .form-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0;
        }
        .form-divider-line { flex:1; height:1px; background:#E8E0CF; }
        .form-divider-txt {
          font-family:'Geist Mono',monospace;
          font-size:9px; color:#C8BBA8; letter-spacing:0.12em;
          text-transform:uppercase; white-space:nowrap;
        }

        .login-btn-alt {
          width: 100%; padding: 13px;
          background: transparent; color: #7A6E62;
          border: 1px solid #DDD5C5; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.22s;
          font-family: 'Outfit', sans-serif; letter-spacing: 0.03em;
        }
        .login-btn-alt:hover { border-color: #C8A84B; color: #9A7B3C; background: rgba(200,168,75,0.04); }

        .form-footer {
          margin-top: 28px; text-align: center;
          font-family: 'Geist Mono', monospace;
          font-size: 9px; color: #D4CAB8;
          letter-spacing: 0.1em; text-transform: uppercase;
          line-height: 1.8;
        }
      `}</style>

      {/* ── Left: editorial panel ── */}
      <div className="panel-left">
        <div className="left-brand" onClick={() => navigate('/')}>
          <span className="left-brand-name">MarketPulse</span>
          <span className="left-brand-tag">Terminal</span>
        </div>

        <div className="left-eyebrow">New account</div>
        <h1 className="left-title">
          Your edge in<br />
          <em>every market.</em>
        </h1>
        <p className="left-desc">
          Join MarketPulse and get instant access to live crypto and equity data, powered by an AI analyst that reads real market conditions before it speaks.
        </p>

        <div className="feature-list">
          {FEATURES.map((f, i) => (
            <div className="feature-item" key={i}>
              <div className="feature-icon-wrap">{f.icon}</div>
              <span className="feature-text">{f.text}</span>
            </div>
          ))}
        </div>

        <div className="left-divider" />
        <div className="left-login-prompt">
          Already have an account?
          <span className="left-login-link" onClick={() => navigate('/login')}>Sign in →</span>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="panel-right">
        <div className="form-shell">
          <div className="form-eyebrow">Get started</div>
          <h2 className="form-title">Create account</h2>
          <p className="form-sub">Start tracking markets with AI today.</p>

          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          {fields.map((f) => (
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
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
              />
            </div>
          ))}

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <div className="form-divider">
            <div className="form-divider-line" />
            <span className="form-divider-txt">or</span>
            <div className="form-divider-line" />
          </div>

          <button className="login-btn-alt" onClick={() => navigate('/login')}>
            Sign in to existing account
          </button>

          <div className="form-footer">
            For informational purposes only · Not financial advice
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
