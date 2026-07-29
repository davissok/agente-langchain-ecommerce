import json
import unicodedata
from langchain_core.tools import tool
from db.database import SessionLocal
from db.models import Product

def _strip_accents(text: str) -> str:
    """Remove accents from text for flexible matching."""
    nfkd = unicodedata.normalize('NFKD', text)
    return ''.join(c for c in nfkd if unicodedata.category(c) != 'Mn')

@tool
def search_products(query: str) -> str:
    """Busca productos en el catálogo por nombre, categoría o descripción. Funciona con o sin tildes."""
    db = SessionLocal()
    try:
        # Normalize query: lowercase + strip accents
        query_normalized = _strip_accents(query.lower())
        
        # Fetch all products (MVP has ~8 products, perfectly fine)
        all_products = db.query(Product).all()
        
        # Filter with accent-insensitive matching across name, category, and description
        products = []
        for p in all_products:
            searchable = _strip_accents(
                f"{p.name} {p.category} {p.description or ''}".lower()
            )
            if query_normalized in searchable:
                products.append(p)
        
        if not products:
            return "No se encontraron productos que coincidan con la búsqueda."
        
        result = [
            {
                "id": p.id,
                "name": p.name,
                "brand": p.brand,
                "category": p.category,
                "price": p.price,
                "stock": p.stock,
                "description": p.description
            }
            for p in products[:10]
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
