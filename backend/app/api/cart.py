from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from agent.tools.cart import get_cart

router = APIRouter()

@router.get("/{user_id}")
def get_user_cart(user_id: int, db: Session = Depends(get_db)):
    # Reutilizamos la función get_cart del agente, que maneja su propia sesión
    # o podríamos refactorizar para usar la inyectada. Por simplicidad en MVP, usamos la tool.
    return get_cart.invoke(input={"user_id": user_id})
