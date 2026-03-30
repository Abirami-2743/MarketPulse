from fastapi import APIRouter
from pydantic import BaseModel
from services.agent_service import ask_agent

router = APIRouter()

class AgentQuery(BaseModel):
    question: str

@router.post("/ask")
def ask(query: AgentQuery):
    response = ask_agent(query.question)
    return {"answer": response}