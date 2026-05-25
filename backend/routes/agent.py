from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.agent_service import ask_agent

router = APIRouter()

class AgentQuery(BaseModel):
    question: str

@router.post("/ask")
def ask(query: AgentQuery):
    if not query.question or not query.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    try:
        response = ask_agent(query.question.strip())
        return {"answer": response, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Agent error. Please try again.")