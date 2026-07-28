# Supplement AI Sales Agent

Agente conversacional inteligente para ecommerce de suplementos, diseñado para actuar como un asistente de ventas 24/7. El agente es capaz de atender clientes, recomendar suplementos según sus objetivos, consultar el catálogo, gestionar carritos y asistir durante el proceso de compra.

## 🚀 Características (MVP V1)

*   **Chat IA 24/7:** Atención constante al cliente mediante lenguaje natural.
*   **Consulta de Catálogo y Precios:** Busca productos, disponibilidad y precios.
*   **Recomendaciones Inteligentes:** Sugiere suplementos (proteínas, creatina, etc.) basándose en los objetivos, presupuesto y experiencia del usuario.
*   **Gestión de Carrito:** Capacidad de crear carritos, agregar productos y consultar el estado actual del carrito mediante la IA.
*   **Memoria Contextual:** Recuerda preferencias y productos vistos durante la conversación.

## 🏗️ Arquitectura y Stack Tecnológico

El proyecto está dividido en un Frontend y un Backend, comunicados mediante una API REST.

### Backend (Render)
*   **Lenguaje:** Python
*   **Framework:** FastAPI + Uvicorn
*   **Agente IA:** LangChain / LangGraph
*   **LLM API:** Gemini API

### Frontend (Vercel)
*   **Framework:** Next.js (React)
*   **Estilos:** Tailwind CSS

### Datos y Persistencia
*   **Base de Datos Relacional:** Supabase (PostgreSQL) para usuarios, productos, carritos y pedidos.
*   **Memoria a Corto Plazo:** Redis
*   **RAG / Base de Conocimiento:** Vector DB (para documentos, políticas de envío, diferencias entre productos).

## 🛠️ Estructura del Proyecto

*   `/backend`: Contiene la lógica del agente, la configuración de LangChain/LangGraph y la API en FastAPI.
*   `/frontend`: Contiene la interfaz de usuario en Next.js.

## 🚀 Instalación y Uso Local

### Prerrequisitos
*   Node.js (para el frontend)
*   Python 3.9+ o Docker (para el backend)

### Backend
1.  Navega a la carpeta del backend: `cd backend`
2.  Copia el archivo `.env.example` a `.env` y configura tus variables de entorno (Supabase, Gemini API, etc.).
3.  Puedes levantar el backend usando Docker:
    ```bash
    docker-compose up --build
    ```
    *O si prefieres sin Docker:*
    ```bash
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```

### Frontend
1.  Navega a la carpeta del frontend: `cd frontend`
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Copia `.env.example` a `.env.local` y asegúrate de configurar `NEXT_PUBLIC_API_URL` apuntando a tu backend local (ej. `http://127.0.0.1:8000`).
4.  Levanta el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## ☁️ Despliegue en Producción

El proyecto está configurado para ser desplegado fácilmente en la nube:

*   **Backend (Render):** El backend se puede desplegar como un "Web Service" en Render. Render detectará automáticamente el `Dockerfile` en la carpeta `/backend` y se encargará de compilar y levantar la aplicación.
*   **Frontend (Vercel):** El frontend está optimizado para Vercel. Al crear un nuevo proyecto en Vercel, asegúrate de configurar el **Root Directory** como `frontend` y agregar la variable de entorno `NEXT_PUBLIC_API_URL` apuntando a la URL generada por Render para tu backend.

## 🛣️ Roadmap / Futuras Versiones

*   Integración de pasarela de pagos.
*   Automatización de envíos.
*   Integración con WhatsApp.
*   Sistema CRM.
