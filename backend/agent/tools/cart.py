from langchain_core.tools import tool
from db.database import SessionLocal
from db.models import Cart, CartItem, Product
from sqlalchemy.orm import joinedload

@tool
def get_cart(user_id: int) -> dict:
    """Consulta el carrito de compras actual de un usuario."""
    db = SessionLocal()
    try:
        cart = db.query(Cart).filter(Cart.user_id == user_id, Cart.status == "active").first()
        if not cart:
            return {"message": "El carrito está vacío o no existe."}
            
        items = db.query(CartItem).options(joinedload(CartItem.product)).filter(CartItem.cart_id == cart.id).all()
        
        total = 0
        cart_details = []
        for item in items:
            subtotal = item.product.price * item.quantity
            total += subtotal
            cart_details.append({
                "product_id": item.product.id,
                "name": item.product.name,
                "quantity": item.quantity,
                "subtotal": subtotal
            })
            
        return {
            "cart_id": cart.id,
            "items": cart_details,
            "total": total
        }
    finally:
        db.close()

@tool
def add_to_cart(user_id: int, product_id: int, quantity: int = 1) -> dict:
    """Agrega un producto al carrito de compras del usuario."""
    db = SessionLocal()
    try:
        # Verificar producto
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return {"error": "El producto no existe."}
            
        if product.stock < quantity:
            return {"error": f"No hay suficiente stock. Stock disponible: {product.stock}"}

        # Obtener o crear carrito activo
        cart = db.query(Cart).filter(Cart.user_id == user_id, Cart.status == "active").first()
        if not cart:
            cart = Cart(user_id=user_id, status="active")
            db.add(cart)
            db.commit()
            db.refresh(cart)
            
        # Verificar si el producto ya está en el carrito
        cart_item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id).first()
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
            db.add(cart_item)
            
        db.commit()
        return {"success": f"Se agregó {quantity}x '{product.name}' al carrito exitosamente."}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()

@tool
def remove_cart_item(user_id: int, product_id: int) -> dict:
    """Quita un producto del carrito de compras del usuario."""
    db = SessionLocal()
    try:
        cart = db.query(Cart).filter(Cart.user_id == user_id, Cart.status == "active").first()
        if not cart:
            return {"error": "No tienes un carrito activo."}
            
        cart_item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id).first()
        if not cart_item:
            return {"error": "El producto no está en el carrito."}
            
        db.delete(cart_item)
        db.commit()
        return {"success": "Producto removido del carrito exitosamente."}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()
