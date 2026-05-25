from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from langchain.tools import tool
from database import db
from config import GROQ_API_KEY
import re

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=GROQ_API_KEY,
    temperature=0.3
)

@tool
def get_crypto_prices(query: str) -> str:
    """Get the latest cryptocurrency prices from the database"""
    data = list(db["crypto_prices"].find({}, {"_id": 0}).sort("timestamp", -1).limit(4))
    if not data:
        return "No crypto data available"
    result = ""
    for coin in data:
        change = round(coin['change_24h'], 2)
        risk = "HIGH" if abs(change) >= 5 else "MEDIUM" if abs(change) >= 2 else "LOW"
        trend = "Bullish" if change > 0 else "Bearish" if change < 0 else "Neutral"
        result += f"{coin['asset']}: ${coin['price']:,.2f} | 24h: {change:+.2f}% | Risk: {risk} | Trend: {trend}\n"
    return result

@tool
def get_stock_prices(query: str) -> str:
    """Get the latest stock prices from the database"""
    data = list(db["stock_prices"].find({}, {"_id": 0}).sort("timestamp", -1).limit(4))
    if not data:
        return "No stock data available"
    result = ""
    for stock in data:
        change_str = stock.get('change_percent', '0%').replace('%', '')
        try:
            change = float(change_str)
        except:
            change = 0
        risk = "HIGH" if abs(change) >= 5 else "MEDIUM" if abs(change) >= 2 else "LOW"
        trend = "Bullish" if change > 0 else "Bearish" if change < 0 else "Neutral"
        result += f"{stock['asset']}: ${stock['price']:,.2f} | Change: {stock['change_percent']} | Risk: {risk} | Trend: {trend}\n"
    return result

tools = [get_crypto_prices, get_stock_prices]

system_prompt = """You are MarketPulse AI — an expert financial market analyst built into the MarketPulse platform, created by Abie, a CS engineering student.

## When asked about your capabilities ("what can you do", "how can you help", "what are you", etc):
Respond like this — do NOT call any tools:
"I'm MarketPulse AI, your intelligent market analyst. Here's what I can do:
- 📊 Real-time crypto prices — Bitcoin, Ethereum, Solana, and more
- 📈 Stock analysis — Live prices and change data for top stocks
- ⚠ Risk Assessment — HIGH / MEDIUM / LOW risk rating for any asset
- 🧠 Market Summaries — Overall sentiment and standout movers
- 💬 Ask me anything like: 'Analyze Bitcoin', 'Compare stocks today', or 'Which assets are bullish?'"

## For all price/market questions — ALWAYS call your tools first, then respond.

## Response Format for Asset Analysis:
**[Asset Name]**
- Risk Level: [High / Medium / Low]
- Trend: [Bullish (up) / Bearish (down) / Neutral]
- Confidence: [X%]
- Price: $[price]
- Analysis: [2-3 sentence expert insight]

## For casual conversational messages (greetings, thanks, compliments like "good", "nice", "thanks", "ok", "great", "very good", "cool", "wow", "lol"):
Respond warmly and briefly, then nudge them back. Example:
- "Thanks! 😊 Ask me anything about stocks or crypto anytime."
- "Glad to help! Let me know if you want to analyze any asset."
- "Hello! I'm ready to analyze any stock or crypto for you."

## For clearly off-topic questions (coding help, unrelated personal questions, general knowledge with zero relation to finance):
Respond: "I'm specialized in market analysis only. Try asking me about a stock or crypto!"

## Questions about what stocks/cryptos are available, what's in the app, what data exists:
These ARE market questions — call your tools and list what's available with prices.

## Risk Rules:
- HIGH if |24h change| ≥ 5%, MEDIUM if ≥ 2%, LOW if < 2%
- Confidence: 85% low-risk, 70% medium, 55% high-risk
- Bullish if change > 0, Bearish if < 0, Neutral if near zero

## General Market Summary:
2-3 sentences covering overall sentiment, standout performers, brief risk note.

## For short follow-up or clarification messages ("only 6?", "why?", "what about stocks?", "show more", "not 8?", any short question referencing previous context):
Treat as a market question. Use your tools to get data and answer helpfully. 
Example: "only 6?? not 8?" → explain how many assets are currently tracked in the database and list them all.

## Rules:
- Never invent prices — always call tools first for market questions
- Be analytical, professional, concise
- End analyses with an actionable note"""

agent_executor = create_react_agent(llm, tools, prompt=system_prompt)

def ask_agent(question: str) -> str:
    try:
        result = agent_executor.invoke({
            "messages": [("human", question)]
        })
        last_message = result["messages"][-1].content

        # Clean up any function call artifacts
        cleaned = re.sub(r'<function.*?</function>', '', last_message, flags=re.DOTALL)
        cleaned = re.sub(r'<tool_call>.*?</tool_call>', '', cleaned, flags=re.DOTALL)
        cleaned = cleaned.strip()

        return cleaned if cleaned else "I couldn't retrieve market data right now. Please try again."
    except Exception as e:
        return "I'm having trouble accessing market data at the moment. Please try again in a few seconds."