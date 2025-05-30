# Use uma imagem base Python
FROM python:3.9-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de requisitos e instala as dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante dos arquivos da aplicação
COPY . .

# Define as variáveis de ambiente (podem ser sobrescritas no docker-compose)
# ENV DATABASE_URL=...
# ENV FIREBASE_PROJECT_ID=...
# ENV FIREBASE_PRIVATE_KEY_ID=...
# ENV FIREBASE_PRIVATE_KEY="..."
# ENV FIREBASE_CLIENT_EMAIL=...

# Expõe a porta que o Gunicorn irá ouvir
EXPOSE 8000

# Comando para rodar a aplicação com Gunicorn e gevent
# O '--worker-class gevent' é importante para o desempenho em produção
CMD ["gunicorn", "--worker-class", "gevent", "--bind", "0.0.0.0:8000", "app:app"]