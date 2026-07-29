from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agent.agent import agent_executor
from langchain_core.messages import HumanMessage
import traceback

from typing import Optional

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: int
    message: str
    thread_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    actions: list[dict] = []

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        thread_id = request.thread_id if request.thread_id else str(request.user_id)
        config = {"configurable": {"thread_id": thread_id}}
        
        # Ejecutar el agente de LangGraph
        response = agent_executor.invoke(
            {"messages": [HumanMessage(content=request.message)]},
            config=config
        )
        
        # Extraer el mensaje de respuesta
        # La respuesta final de un modelo ReAct en LangGraph suele estar en el último AIMessage
        ai_message = response["messages"][-1].content
        
        # Gemini 3.5+ puede devolver contenido como lista de bloques en vez de string
        if isinstance(ai_message, list):
            ai_message = " ".join(
                block.get("text", "") for block in ai_message if isinstance(block, dict) and "text" in block
            )
        
        return ChatResponse(message=ai_message, actions=[])
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

