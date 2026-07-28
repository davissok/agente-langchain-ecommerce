from langchain_core.tools import tool
from db.database import SessionLocal
from db.models import Product

@tool
def recommend_products(goal: str, budget: float = None) -> list[dict]:
    """
    Recomienda productos basados en el objetivo del cliente (ej. 'masa muscular', 'definición', 'energía').
    Si el presupuesto está definido, filtra por precio <= budget.
    """
    db = SessionLocal()
    try:
        # Lógica simple de recomendación por categoría o descripción.
        # En un MVP, mapeamos metas comunes a categorías.
        goal_lower = goal.lower()
        
        target_categories = []
        if "masa" in goal_lower or "volumen" in goal_lower:
            target_categories.extend(["Proteínas", "Ganadores de Peso", "Creatinas"])
        elif "definición" in goal_lower or "quemar" in goal_lower:
            target_categories.extend(["Proteínas", "Aminoácidos"])
        elif "energía" in goal_lower or "fuerza" in goal_lower:
            target_categories.extend(["Pre-entrenos", "Creatinas"])
        elif "salud" in goal_lower or "vitaminas" in goal_lower:
            target_categories.extend(["Vitaminas y Salud"])
            
        query = db.query(Product)
        if target_categories:
            query = query.filter(Product.category.in_(target_categories))
            
        if budget:
            query = query.filter(Product.price <= budget)
            
        # Retornamos hasta 3 recomendaciones
        recommended = query.limit(3).all()
        
        return [
            {
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "price": p.price,
                "reason": f"Ideal para {goal}"
            }
            for p in recommended
        ]
    finally:
        db.close()
