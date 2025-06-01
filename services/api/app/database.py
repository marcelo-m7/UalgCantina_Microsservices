# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

# Cria engine sincronizada
engine = create_engine(settings.db_url(), echo=False, future=True)

# SessionLocal usará esse engine
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Base para os modelos
Base = declarative_base()


def init_db():
    """
    Chame esta função no startup para criar todas as tabelas
    definidas em models.py, se ainda não existirem.
    """
    import models  # garante que os modelos sejam registrados em Base.metadata
    Base.metadata.create_all(bind=engine)
