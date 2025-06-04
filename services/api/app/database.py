# services/api/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from config import settings

# Cria a engine do SQLAlchemy usando a URL do config
engine = create_engine(
    settings.db_url(),
    echo=False,
    future=True
)

# SessionLocal: factory de sessões (scoped_session não é necessário aqui)
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

# Base para declarar modelos
Base = declarative_base()


def init_db() -> None:
    """Create database tables if they do not exist."""
    print("[DEBUG] Initializing database and creating tables if needed...")
    Base.metadata.create_all(bind=engine)
