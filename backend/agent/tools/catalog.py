import json
from langchain_core.tools import tool
from db.database import SessionLocal
from db.models import Product

@tool
def search_products(query: str) -> str:
    """Busca productos en el catálogo por nombre o categoría."""
    db = SessionLocal()
    try:
        query_str = f"%{query.lower()}%"
        products = db.query(Product).filter(
            (Product.name.ilike(query_str)) | 
            (Product.category.ilike(query_str))
        ).limit(10).all()
        
        if not products:
            return "No se encontraron productos que coincidan con la búsqueda."
        
        result = [
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
        return json.dumps(result, ensure_ascii=False)
    finally:
        db.close()

@tool
def get_product_detail(product_id: int) -> str:
    """Obtiene el detalle completo de un producto incluyendo su descripción."""
    db = SessionLocal()
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return f"No se encontró un producto con ID {product_id}."
            
        result = {
            "id": product.id,
            "name": product.name,
            "brand": product.brand,
            "category": product.category,
            "price": product.price,
            "stock": product.stock,
            "description": product.description
        }
        return json.dumps(result, ensure_ascii=False)
    finally:
        db.close()

@tool
def check_stock(product_id: int) -> str:
    """Verifica el stock disponible de un producto."""
    db = SessionLocal()
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return "Producto no encontrado."
        result = {"product_id": product.id, "name": product.name, "stock": product.stock}
        return json.dumps(result, ensure_ascii=False)
    finally:
        db.close()
