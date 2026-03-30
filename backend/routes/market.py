from fastapi import APIRouter
from database import db
from services.data_fetcher import fetch_crypto_prices, fetch_stock_prices

router = APIRouter()

@router.get("/fetch")
def fetch_all():
    fetch_crypto_prices()
    fetch_stock_prices()
    return {"message": "Market data fetched and saved!"}

@router.get("/crypto")
def get_crypto():
    data = list(db["crypto_prices"].find({}, {"_id": 0}).sort("timestamp", -1).limit(4))
    return {"crypto": data}

@router.get("/stocks")
def get_stocks():
    data = list(db["stock_prices"].find({}, {"_id": 0}).sort("timestamp", -1).limit(4))
    return {"stocks": data}