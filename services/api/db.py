from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, scoped_session, sessionmaker
import config

engine = create_engine(config.DB_URL)
Base = declarative_base()
Session = scoped_session(sessionmaker(bind=engine))