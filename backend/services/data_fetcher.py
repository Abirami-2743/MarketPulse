import requests
import time
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from database import db

# ── Fetch crypto from CoinGecko ──────────────────────────────────────────────
def fetch_crypto_prices():
    try:
        url = "https://api.coingecko.com/api/v3/simple/price"
        params = {
            "ids": "bitcoin,ethereum,binancecoin,solana",
            "vs_currencies": "usd",
            "include_24hr_change": "true"
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        collection = db["crypto_prices"]
        for coin, values in data.items():
            if "usd" in values:
                collection.update_one(
                    {"asset": coin},
                    {"$set": {
                        "asset": coin,
                        "price": values["usd"],
                        "change_24h": values.get("usd_24h_change", 0),
                        "timestamp": datetime.utcnow()
                    }},
                    upsert=True
                )
        print(f"✅ Crypto prices updated at {datetime.utcnow().strftime('%H:%M:%S')}")
    except Exception as e:
        print(f"❌ Crypto fetch error: {e}")

# ── Fetch stocks from Yahoo Finance (free, no API key, no rate limits) ────────
def fetch_stock_prices():
    symbols = ["AAPL", "GOOGL", "MSFT", "TSLA"]
    collection = db["stock_prices"]

    for symbol in symbols:
        try:
            url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
            params = {"interval": "1d", "range": "1d"}
            headers = {"User-Agent": "Mozilla/5.0"}
            response = requests.get(url, params=params, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()

            result = data["chart"]["result"][0]
            meta = result["meta"]
            price = meta.get("regularMarketPrice") or meta.get("previousClose")
            prev_close = meta.get("previousClose") or meta.get("chartPreviousClose")

            if price and prev_close:
                change = price - prev_close
                change_pct = (change / prev_close) * 100
                change_str = f"{'+' if change_pct >= 0 else ''}{change_pct:.4f}%"

                collection.update_one(
                    {"asset": symbol},
                    {"$set": {
                        "asset": symbol,
                        "price": round(price, 2),
                        "change_percent": change_str,
                        "timestamp": datetime.utcnow()
                    }},
                    upsert=True
                )
                print(f"  ✅ {symbol}: ${price:.2f} ({change_str})")
            else:
                print(f"  ⚠️  {symbol} — no price data")

        except Exception as e:
            print(f"  ❌ {symbol} fetch error: {e}")

    print(f"✅ Stock prices updated at {datetime.utcnow().strftime('%H:%M:%S')}")

# ── Fetch everything ──────────────────────────────────────────────────────────
def fetch_all_prices():
    print("🔄 Running scheduled market data fetch...")
    fetch_crypto_prices()
    fetch_stock_prices()
    print("✅ All market data refreshed.")

# ── Scheduler — runs every 15 minutes ────────────────────────────────────────
def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        fetch_all_prices,
        trigger="interval",
        minutes=15,
        id="market_fetch",
        replace_existing=True
    )
    scheduler.start()
    print("⏰ Market data scheduler started (every 15 min)")
    fetch_all_prices()
    return scheduler