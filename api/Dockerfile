FROM python:3.11-slim

WORKDIR /app

# 1) Instala libs de compilação + headers de C/SSL
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libffi-dev \
    libssl-dev \
 && rm -rf /var/lib/apt/lists/*

# 3) Copia requirements e instala explicitamente o bcrypt 4.x
COPY requirements.txt .
RUN pip install --no-cache-dir \
      bcrypt==4.0.1 \
      passlib[bcrypt] \
      python-jose \
 && pip install --no-cache-dir -r requirements.txt

COPY . .


# Expor porta
EXPOSE 8000

# Comando para iniciar o servidor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
