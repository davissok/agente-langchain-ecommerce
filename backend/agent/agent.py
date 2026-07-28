from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
import os

from agent.prompts import SYSTEM_PROMPT
from agent.tools.catalog import search_products, get_product_detail, check_stock
from agent.tools.business import get_business_hours, get_location
from agent.tools.cart import get_cart, add_to_cart, remove_cart_item
from agent.tools.recommendations import recommend_products
from agent.tools.orders import get_order_status
from rag.vector_store import consult_knowledge_base

# Inicializar modelo Gemini
model = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    temperature=0.3,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

# Lista de herramientas
tools = [
    search_products,
    get_product_detail,
    check_stock,
    get_business_hours,
    get_location,
    get_cart,
    add_to_cart,
    remove_cart_item,
    recommend_products,
    get_order_status,
    consult_knowledge_base
]

# Memoria local para mantener la conversación
memory = MemorySaver()

# Crear el agente de LangGraph con el prompt del sistema y las herramientas
agent_executor = create_react_agent(
    model,
    tools,
    prompt=SYSTEM_PROMPT,
    checkpointer=memory
)
