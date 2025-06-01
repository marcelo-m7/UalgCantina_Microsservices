# services/api/Dockerfile

# 1. Imagem base Python (slim)
FROM python:3.12-slim

# 2. Define diretório de trabalho dentro do container
WORKDIR /api/app

# 3. Copia apenas o requirements.txt para aproveitar o cache do Docker
COPY ./app/requirements.txt /api/app/requirements.txt

# 4. Instala dependências do Python
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r /api/app/requirements.txt

# 5. Copia todo o restante do código da API
COPY ./app /api/app

# 6. Expõe a porta usada pelo FastAPI
EXPOSE 8000

# 7. Comando padrão para iniciar a API em modo de desenvolvimento (hot-reload)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
