from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base
from app.api import chat, products, cart

# Crear tablas (si no existen)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Supplement AI Sales Agent MVP")

import os

# Configurar CORS para permitir que Next.js se comunique
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000", "*"], # En prod remover el "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido al Supplement AI Sales Agent API"}
