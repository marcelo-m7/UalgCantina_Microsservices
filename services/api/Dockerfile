# services/api/Dockerfile

# 1) Imagem base
FROM python:3.12-slim

# 2) Diretório de trabalho
WORKDIR /api/app

# 3) Copia e instala apenas as dependências (para usar cache do Docker)
COPY ./app/requirements.txt /api/app/requirements.txt

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r /api/app/requirements.txt

# 4) Copia todo o código-fonte da API
COPY ./app /api/app

# 5) Exponha a porta do FastAPI
EXPOSE 8000

# 6) Inicia o Uvicorn com hot-reload (desenvolvimento)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
