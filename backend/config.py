from dotenv import load_dotenv
import os

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")