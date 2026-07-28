from langchain_core.tools import tool
import os

# Simplificación MVP: en lugar de inicializar ChromaDB real si falta langchain-community,
# leeremos directamente del FAQ o podemos simular el RAG por ahora para no complicar dependencias,
# dado que el objetivo principal es mostrar el flujo del MVP.

@tool
def consult_knowledge_base(query: str) -> str:
    """
    Consulta la base de conocimientos (FAQ, envíos, diferencias de productos).
    Úsalo cuando el usuario haga preguntas sobre políticas, cómo tomar suplementos,
    diferencias entre productos (como isolate vs concentrate) o envíos.
    """
    # En un entorno real, aquí se usaría ChromaDB con embeddings.
    # Por ahora, simulamos una búsqueda básica en el archivo FAQ.
    
    file_path = os.path.join(os.path.dirname(__file__), "documents", "faq.md")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            return content
    except FileNotFoundError:
        return "Lo siento, la base de conocimientos no está disponible en este momento."
