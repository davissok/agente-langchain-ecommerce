from langchain_core.tools import tool
from db.database import SessionLocal
from db.models import Product

@tool
def search_products(query: str) -> list[dict]:
    """Busca productos en el catálogo por nombre o categoría."""
    db = SessionLocal()
    try:
        query_str = f"%{query.lower()}%"
        products = db.query(Product).filter(
            (Product.name.ilike(query_str)) | 
            (Product.category.ilike(query_str))
        ).limit(10).all()
        
        return [
            {
                "id": p.id,
                "name": p.name,
                "brand": p.brand,
                "category": p.category,
                "price": p.price,
                "stock": p.stock
            }
            for p in products
        ]
    finally:
        db.close()

@tool
def get_product_detail(product_id: int) -> dict:
    """Obtiene el detalle completo de un producto incluyendo su descripción."""
    db = SessionLocal()
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return {"error": f"No se encontró un producto con ID {product_id}"}
            
        return {
            "id": product.id,
            "name": product.name,
            "brand": product.brand,
            "category": product.category,
            "price": product.price,
            "stock": product.stock,
            "description": product.description
        }
    finally:
        db.close()

@tool
def check_stock(product_id: int) -> dict:
    """Verifica el stock disponible de un producto."""
    db = SessionLocal()
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return {"error": "Producto no encontrado"}
        return {"product_id": product.id, "name": product.name, "stock": product.stock}
    finally:
        db.close()
