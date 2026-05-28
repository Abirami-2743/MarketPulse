# MarketPulse

**AI-powered market intelligence terminal for real-time crypto and equity analysis.**

> "Markets generate noise. I wanted to build something that turns noise into clarity."

[![Live Demo](https://img.shields.io/badge/Live-Demo-F5D97E?style=for-the-badge)](https://marketpulse.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-MarketPulse-181717?style=for-the-badge&logo=github)](https://github.com/Abirami-2743/MarketPulse)

---

## What is MarketPulse?

MarketPulse is a full-stack AI market intelligence platform that combines live financial data with a LangChain-powered AI agent. Ask it anything about the market — it reads real prices from the database before answering. No hallucinated numbers. No generic ChatGPT responses. Just grounded, structured intelligence.

---

## Features

| Feature | Details |
|---|---|
| Live Crypto Prices | Bitcoin, Ethereum, Solana, BNB via CoinGecko API |
| Stock Intelligence | AAPL, TSLA, MSFT, GOOGL via Alpha Vantage |
| AI Market Agent | LangChain + LangGraph + Llama 3.3 70B via Groq |
| Risk Assessment | AUTO HIGH / MEDIUM / LOW based on 24h price change |
| Smart Chat | Persistent chat with formatted responses and table rendering |
| Background Scheduler | APScheduler refreshes all market data every 15 minutes |
| Secure Auth | JWT authentication with bcrypt password hashing |
| Visual Analytics | Recharts area + bar charts with gradient fills |

---

## Tech Stack

### Backend
- **FastAPI** — REST API framework
- **MongoDB** — Database for prices and users
- **LangChain + LangGraph** — AI agent orchestration
- **Groq (Llama 3.3 70B)** — LLM inference
- **APScheduler** — Background market data refresh
- **CoinGecko API** — Crypto prices
- **Alpha Vantage API** — Stock prices
- **PyJWT + bcrypt** — Auth

### Frontend
- **React + Vite** — UI framework
- **Recharts** — Data visualization
- **Framer Motion** — Animations
- **React Router** — Navigation

---

## Project Structure

```
marketpulse/
├── backend/
│   ├── main.py              # FastAPI app + scheduler startup
│   ├── config.py            # Environment config
│   ├── database.py          # MongoDB connection
│   ├── models/
│   │   └── user.py          # Pydantic models
│   ├── routes/
│   │   ├── auth.py          # Register / Login
│   │   ├── market.py        # Crypto + Stock endpoints
│   │   └── agent.py         # AI agent endpoint
│   └── services/
│       ├── agent_service.py # LangGraph agent + tools
│       ├── auth_service.py  # JWT + bcrypt logic
│       └── data_fetcher.py  # Market data + scheduler
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Chat.jsx
    │   │   └── About.jsx
    │   ├── App.jsx
    │   └── api.js
    └── package.json
```

---

## Local Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- MongoDB (local or Atlas)
- API keys: Groq, Alpha Vantage, CoinGecko (free)

### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Fill in your keys (see Environment Variables below)

# Start server
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env
echo "VITE_API_URL=http://localhost:8000" > .env

# Start dev server
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/marketpulse
SECRET_KEY=your_jwt_secret_key_here
GROQ_API_KEY=your_groq_api_key
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
```

> CoinGecko is free with no API key required.
> Get Groq key free at [console.groq.com](https://console.groq.com)
> Get Alpha Vantage key free at [alphavantage.co](https://www.alphavantage.co)

---

## How the AI Agent Works

```
User question
     │
     ▼
LangGraph ReAct Agent (Llama 3.3 70B)
     │
     ├── Tool: get_crypto_prices() → reads MongoDB
     ├── Tool: get_stock_prices()  → reads MongoDB
     │
     ▼
Structured response with:
  • Risk Level (HIGH / MEDIUM / LOW)
  • Trend (Bullish / Bearish / Neutral)
  • Confidence score
  • 2-3 sentence expert analysis
```

Data is **never fetched live during chat** — the background scheduler keeps MongoDB fresh every 15 minutes, eliminating API rate limit issues.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login, get JWT |
| GET | `/market/crypto` | Get crypto prices |
| GET | `/market/stocks` | Get stock prices |
| POST | `/agent/ask` | Ask AI agent |

---

## Built By

**Abiraminayagi** — 2nd year CS undergraduate, Sri Shakthi Institute of Engineering and Technology, Coimbatore.

- GitHub: [@Abirami-2743](https://github.com/Abirami-2743)
- Project: [github.com/Abirami-2743/MarketPulse](https://github.com/Abirami-2743/MarketPulse)

---

## License

MIT — free to use, modify, and distribute.

---

*Built for NextGenHacks 2026 · For informational purposes only · Not financial advice*