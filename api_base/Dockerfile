# Dockerfile para API FastAPI
FROM python:3.11-slim

# Diretório de trabalho
WORKDIR /app

# Instalar dependências de sistema
RUN apt-get update \
  && apt-get install -y build-essential libffi-dev python3-dev \
  && rm -rf /var/lib/apt/lists/*

# Copiar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da API
COPY . .

# Expor porta
EXPOSE 8000

# Comando para iniciar o servidor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
