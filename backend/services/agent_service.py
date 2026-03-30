from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from langchain.tools import tool
from database import db
from config import GROQ_API_KEY

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=GROQ_API_KEY
)

@tool
def get_crypto_prices(query: str) -> str:
    """Get the latest cryptocurrency prices from the database"""
    data = list(db["crypto_prices"].find({}, {"_id": 0}).sort("timestamp", -1).limit(4))
    if not data:
        return "No crypto data available"
    result = ""
    for coin in data:
        result += f"{coin['asset']}: ${coin['price']} (24h change: {round(coin['change_24h'], 2)}%)\n"
    return result

@tool
def get_stock_prices(query: str) -> str:
    """Get the latest stock prices from the database"""
    data = list(db["stock_prices"].find({}, {"_id": 0}).sort("timestamp", -1).limit(4))
    if not data:
        return "No stock data available"
    result = ""
    for stock in data:
        result += f"{stock['asset']}: ${stock['price']} (change: {stock['change_percent']})\n"
    return result

tools = [get_crypto_prices, get_stock_prices]

from langchain_core.messages import SystemMessage

system_prompt = """You are MarketPulse AI, a smart financial assistant built for the MarketPulse platform. 
You were created by Abie, a CS student, as part of the MarketPulse project.
You help users understand stock and cryptocurrency markets.
Always use your available tools to get real market data before answering price-related questions.
Be concise, helpful and friendly."""

agent_executor = create_react_agent(llm, tools, prompt=system_prompt)

def ask_agent(question: str) -> str:
    result = agent_executor.invoke({
        "messages": [("human", question)]
    })
    # Get last message content
    last_message = result["messages"][-1].content
    
    # Clean up any function call artifacts
    import re
    cleaned = re.sub(r'<function.*?</function>', '', last_message, flags=re.DOTALL)
    cleaned = re.sub(r'\*\*(.*?)\*\*', r'\1', cleaned)
    cleaned = cleaned.strip()
    
    return cleaned if cleaned else last_message