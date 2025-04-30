import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

MYSQL_URL_STUDENT = os.getenv("MYSQL_URL_STUDENT")
MYSQL_URL_STAFF = os.getenv("MYSQL_URL_STAFF")

engine = create_engine(MYSQL_URL_STUDENT, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False)

def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_engine():
    return engine