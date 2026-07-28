from langchain_core.tools import tool
from db.database import SessionLocal
from db.models import Order

@tool
def get_order_status(order_id: int) -> str:
    """Consulta el estado de un pedido dado su ID."""
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return "No se encontró ningún pedido con ese ID."
        return f"El pedido #{order.id} tiene el estado: '{order.status}' y un total de ${order.total}."
    finally:
        db.close()
