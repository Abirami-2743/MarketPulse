from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, market, agent
from services.data_fetcher import start_scheduler

app = FastAPI(title="MarketPulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://market-pulse-jade-iota.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(market.router, prefix="/market", tags=["Market"])
app.include_router(agent.router, prefix="/agent", tags=["Agent"])

@app.on_event("startup")
async def startup_event():
    start_scheduler()

@app.get("/")
def root():
    return {"message": "MarketPulse API is running!"}