# project/api/db.py
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Ler configurações do banco de dados das variáveis de ambiente
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306") # MySQL default port
DB_NAME = os.getenv("DB_NAME")

# A URL de conexão agora usa as variáveis de ambiente
DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Criar o engine do SQLAlchemy para o MySQL
# O pool_size e max_overflow podem ser ajustados para otimização em produção
engine = create_engine(DATABASE_URL, pool_recycle=3600) # Add pool_recycle for MySQL connections

# Criar a fábrica de sessões (SessionLocal) para uso nas rotas
# autocommit=False e autoflush=False são padrões recomendados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base do modelo para declarar classes ORM
# Isso precisa estar aqui para que os modelos em models.py possam herdar dela
Base = declarative_base()

# Importar os modelos para que sejam registrados na Base.metadata
# Embora a importação nos routers já faça isso, importar aqui garante que
# Base.metadata.create_all() em main.py "conheça" todos os modelos.
from . import models
