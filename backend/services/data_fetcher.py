import requests
import time
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from database import db
from config import ALPHA_VANTAGE_KEY

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
                # Upsert — replace existing record for this asset
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

# ── Fetch stocks from Alpha Vantage ──────────────────────────────────────────
def fetch_stock_prices():
    symbols = ["AAPL", "GOOGL", "MSFT", "TSLA"]
    collection = db["stock_prices"]

    for i, symbol in enumerate(symbols):
        try:
            # Alpha Vantage free tier = 5 req/min → wait 13s between each
            if i > 0:
                time.sleep(13)

            url = "https://www.alphavantage.co/query"
            params = {
                "function": "GLOBAL_QUOTE",
                "symbol": symbol,
                "apikey": ALPHA_VANTAGE_KEY
            }
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            quote = data.get("Global Quote", {})
            if quote and quote.get("05. price"):
                # Upsert — replace existing record for this symbol
                collection.update_one(
                    {"asset": symbol},
                    {"$set": {
                        "asset": symbol,
                        "price": float(quote["05. price"]),
                        "change_percent": quote["10. change percent"],
                        "timestamp": datetime.utcnow()
                    }},
                    upsert=True
                )
                print(f"  ✅ {symbol} updated")
            else:
                print(f"  ⚠️  {symbol} — no data returned (rate limit?)")

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

    # Run once immediately on startup so DB is populated right away
    fetch_all_prices()

    return scheduler