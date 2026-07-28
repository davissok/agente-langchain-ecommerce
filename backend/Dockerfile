FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema requeridas (opcional, por si acaso)
# RUN apt-get update && apt-get install -y gcc sqlite3 libsqlite3-dev

# Copiar el archivo de requerimientos e instalarlos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código del backend
COPY . .

# Exponer el puerto
EXPOSE 8000

# Comando para iniciar la aplicación (sin --reload para producción)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
