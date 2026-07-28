import sys
import os

# Add parent dir to path so we can import from db
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.database import SessionLocal, engine
from db.models import Base, Product, User

# Sample products
SUPPLEMENTS = [
    {
        "name": "Whey Protein Isolate",
        "brand": "Optimum Nutrition",
        "category": "Proteínas",
        "price": 35000,
        "stock": 50,
        "description": "Proteína de suero aislada de alta calidad, ideal para definición muscular y rápida absorción."
    },
    {
        "name": "Creatina Monohidratada",
        "brand": "Universal",
        "category": "Creatinas",
        "price": 25000,
        "stock": 100,
        "description": "Mejora el rendimiento, la fuerza y favorece el aumento de masa muscular."
    },
    {
        "name": "BCAA 5000 Powder",
        "brand": "Mutant",
        "category": "Aminoácidos",
        "price": 18000,
        "stock": 30,
        "description": "Aminoácidos ramificados para recuperación muscular y prevención de la fatiga."
    },
    {
        "name": "Pre-Workout C4",
        "brand": "Cellucor",
        "category": "Pre-entrenos",
        "price": 28000,
        "stock": 25,
        "description": "Energía explosiva, resistencia y concentración para tus entrenamientos intensos."
    },
    {
        "name": "Mass Gainer",
        "brand": "BSN",
        "category": "Ganadores de Peso",
        "price": 45000,
        "stock": 20,
        "description": "Mezcla alta en calorías con carbohidratos y proteínas para ganar volumen."
    },
    {
        "name": "Omega 3 Fish Oil",
        "brand": "Now Foods",
        "category": "Vitaminas y Salud",
        "price": 15000,
        "stock": 80,
        "description": "Ácidos grasos esenciales para la salud cardiovascular y articular."
    },
    {
        "name": "Multivitamínico Opti-Men",
        "brand": "Optimum Nutrition",
        "category": "Vitaminas y Salud",
        "price": 22000,
        "stock": 40,
        "description": "Complejo vitamínico diseñado para las necesidades de atletas y personas activas."
    },
    {
        "name": "Glutamina Micronizada",
        "brand": "Dymatize",
        "category": "Aminoácidos",
        "price": 20000,
        "stock": 45,
        "description": "Ayuda a la recuperación muscular y fortalece el sistema inmunológico."
    },
]

def run_seed():
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if we already have products
        existing_products = db.query(Product).count()
        if existing_products == 0:
            print("Insertando productos iniciales...")
            for prod_data in SUPPLEMENTS:
                product = Product(**prod_data)
                db.add(product)
            
            print("Insertando usuario de prueba (user_id=1)...")
            test_user = User(id=1, name="Usuario Prueba", email="test@example.com")
            db.add(test_user)
            
            db.commit()
            print("Seed completado exitosamente.")
        else:
            print(f"La base de datos ya contiene {existing_products} productos. Saltando seed.")
    except Exception as e:
        print(f"Error durante el seed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
