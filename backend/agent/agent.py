from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import SystemMessage, trim_messages
import os

from agent.prompts import SYSTEM_PROMPT
from agent.tools.catalog import search_products, get_product_detail, check_stock
from agent.tools.business import get_business_hours, get_location
from agent.tools.cart import get_cart, add_to_cart, remove_cart_item
from agent.tools.recommendations import recommend_products
from agent.tools.orders import get_order_status
from rag.vector_store import consult_knowledge_base

# Inicializar modelo Llama 3.3 70B vía Groq
model = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.5,
    max_retries=3,
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

# Función para preparar los mensajes antes de enviarlos al modelo
def custom_prompt(state):
    system_msg = SystemMessage(content=SYSTEM_PROMPT)
    
    # Recortar el historial para ahorrar tokens
    trimmed_msgs = trim_messages(
        state["messages"],
        max_tokens=2000,           # Límite máximo para el historial (ajustable)
        strategy="last",           # Conservar solo los mensajes más recientes
        token_counter=model,
        include_system=False,      # El prompt del sistema lo inyectamos manualmente arriba
        start_on="human"           # Garantiza que empiece en un mensaje del usuario
    )
    
    return [system_msg] + trimmed_msgs

# Crear el agente de LangGraph con el prompt del sistema y las herramientas
agent_executor = create_react_agent(
    model,
    tools,
    prompt=custom_prompt,
    checkpointer=memory
)
