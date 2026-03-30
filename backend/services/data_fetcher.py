import requests
from datetime import datetime
from database import db
from config import ALPHA_VANTAGE_KEY

def fetch_crypto_prices():
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {
        "ids": "bitcoin,ethereum,binancecoin,solana",
        "vs_currencies": "usd",
        "include_24hr_change": "true"
    }
    response = requests.get(url, params=params, timeout=10)
    data = response.json()

    collection = db["crypto_prices"]
    for coin, values in data.items():
        if "usd" in values:
            collection.insert_one({
                "asset": coin,
                "price": values["usd"],
                "change_24h": values.get("usd_24h_change", 0),
                "timestamp": datetime.utcnow()
            })
    print("✅ Crypto prices saved!")

def fetch_stock_prices():
    symbols = ["AAPL", "GOOGL", "MSFT", "TSLA"]
    collection = db["stock_prices"]

    for symbol in symbols:
        url = "https://www.alphavantage.co/query"
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": ALPHA_VANTAGE_KEY
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        quote = data.get("Global Quote", {})
        if quote:
            collection.insert_one({
                "asset": symbol,
                "price": float(quote["05. price"]),
                "change_percent": quote["10. change percent"],
                "timestamp": datetime.utcnow()
            })
    print("✅ Stock prices saved!")